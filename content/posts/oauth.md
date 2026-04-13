+++
title = 'OAuth2 Explained'
date = 2026-03-05T22:03:54+01:00
draft = false
tags = ["architecture", "backend", "oauth2", "authorisation", "authentication", "oidc"]
+++

I've recently integrated a provider and consumer service with Azure AD and B2C. Setting up the scopes was confusing and since I've felt that although I've been using OAuth in my systems for a long time, I haven't really understood it well, I decided to invest some time and really learn how it works under the hood. 

I could tell you that reading the various RFCs offered me clarity, but I'd be lying. The key point of why they didn't, it's because there isn't a single cohesive document explaining the core concepts. It's spread around multiple ones:
- RFC 6750 defines how tokens are actually used
- RFC 7636 patches a major authorization code vulnerability
- RFC 8252 redefines best practices for mobile/desktop
- RFC 8414 adds discovery
- RFC 6819 explains security assumptions after the fact


## OAuth2 in Action

After some research I landed on [this book](https://www.manning.com/books/oauth-2-in-action). It does a good job explaining the fundamentals, giving clear implementation details on all entities and a complete set of security issues and gaps in the framework.

I'll try to explain in very simple terms how the frameworks and forward you to another implementation post by the end, so you learn how it works under-the-hood.

## Basics

OAuth2 is not a protocol, but a framework of protocols. Because it's an abstraction, it has different implementations, each focused on a particular usecase. 

The abstraction revolves around **delegating authorization** to obtain **limited access** to a _resource server_ on behalf of _resource owner_ without sharing credentials.

Let's unpack that. 

OAuth2 is **not** about authentication. A commonly misunderstood aspect is that developers often try to use OAuth2 for authentication because of its flexibility, and libraries now exist that support this pattern (more on this later).

Let's pick a simple example. You have some photos stored in a server. You have your credentials to access that server. Now another service, let's say a printer service, wants to access **your** photos in order to print them for you. You could either download them and provide to the printer service. You could share your storage credentials, so the printing service would download them for you, _or_ you could leverage oauth. You generate a _token_, where you allow the printing service to download those photos.

That is the **main kind of authorization designed for OAuth2**. Everything else is an adaption, where you or a developer disguises a flow as something that can be represented this way.

## Actors

OAuth2 is designed around four actors:
- Resource owner
- Protected resource
- Authorization manager
- Client

Resource owner can be anything. It's more likely to be a user, but it could also be a service. The protected resource usually sits behind a service and is sometimes called _resource server_. The client can be a server as well.

The flow is simple:
1. Client requests resource owner authorization to access protected resource
2. Resource owner informs authorization manager that he allows that access
3. Authorization manager issues _token_ and shares it with client
4. Client requests protected resource with _token_



## Token

You might have noticed. The whole framework revolves around a _token_, which is a representation of something that has limited access and is issued per client per resource owner per protected resource, but what is a _token_ exactly?

The OAuth2 specification doesn't define exactly what a token should be. It defines principles such as: tokens should not be easily guessable, they should be short-lived, and so on.

We'll get to JWT later in this article, but for now let's focus on the flows, despite of token implementation.

## Grants

As the actors can be different things, there are predefined flows, also called grant types, to represent the most usual ones. In some of them not all actors are there. In other multiple actors are the same one. We'll start looking at those cases first, as they have the easiest flow.

For each of the flows, a specific `grant_type` value is passed in the payload.

### Client credentials

`grant_type: client`

When the resource owner is not important, your grant doesn't need to dance between resource owner, client and authorisation manager, it can directly call the authorisation manager with it's credentials to request a token generation. The authorisation manager validates the credentials and generates a token, which is then used to call the protected resource.

Here's the list of steps:
1. Client calls auth server with `client_id` and `client_secret`
2. Auth server responds with token
3. Client calls resource server with token
4. Resource server validates token

The client credentials can be passed in multiple ways. Either in the body or as an auth header. The auth header with base64 encoding seems to be the prefered version (documented in cloud providers).

### Implicit

`grant_type: implicit`

When the resource owner and the client are the same, aka. your client application lives in the browser and represents the user, you can use this grant type. 

This grant was created for a simplification of the authorization code grant, but has been deemed insecure and only relevant in few situations. We'll skip this one for now.

### Assertion

`grant_type: assertion`

Also known as _On Behalf Of_ flow. The resource owner is already being represented by the client, which wants to propagate it to another resource server. 

You call the authorisation server with the token you're carrying so it generates a new one based on that. 

### Resource Owner

`grant_type: password`

This one was really just created to provide a stepping stone to OAuth2 adopters that were relying on basic `user:password` header. It's not recommended as it involves passing the password in the payload and defeats the purpose of using limited short-lived tokens.

### Authorization code

`grant_type: code`

This is the main flow. The most complete and the one you should favor when implementing OAuth2 on a frontend service. 

The flow is as follows:
1. Client generates `code_challenge`, `code_verifier` and `state`
2. Client calls authorisation server with it's `redirect_uri`, the challenge, state and it's `client_id`
3. Authorisation server returns a redirect uri where user is asked for **authorisation**
4. After logging in, the user consents to the limited scope of access (aka. permissions)
5. Authorisation server calls client on the provided `redirect_uri` if it matches it's configuration (more on this later) with the `state` and a `code`
6. Client validates `state` and exchanges `code` for _token_. This time it needs to provide the `code_verifier`
7. Authorisation server validates the verifier against the challenge provided earlier and generates a _token_
8. Client calls resource server with _token_

There's a few security measures that come with it to prevent CSRF attacks, namely to include 
a `nonce` and `PKCE` (read as pixie). 

All these moving parts complement different parts of the system and tackle different vulnerabilities. In the implementation post you'll see that it's actually pretty straight forward.

## Scope

For all these JSON requests you must include `scope`, which represents the _limited_ access the resource owner is giving in the resource server. Like the _token_ this is just a vague specification. You can implement your own rules on need. OIDC uses words like `email profile pictures`, but you can have `read:files write:photos` on your API. Azure AD uses tenantIds or API URIs. The only requirement is to pass each of the scopes space separated inside that string and the client must be registered in the authorisation server with a each of the scopes being asked to the resource owner.

## Token

Now we get to the fun part. The token as mentioned early can be any kind of string. I won't bore you with the details on why short strings or meaningful ones can be problematic. I also won't go over why sharing database for the resource owner to validate a generated token with the authorisation token is a bad idea (this is not forbidden or disencouraged by the framework).

The token design should simplify two things, passing context, simplifying validation. Alas, comes our hero JWT. 

The JWT has been designed to have a header, a payload and a signature. The three parts are base64 encoded and `.` separated. 

Why is it so powerful you might ask. Well, the signature allows for many different approaches. You can have symmetric signing, where resource server and authorisation server share a private key. You can use asymmetric, where you have public and private key pairs. You can add encryption on top of the signature. You can do all sorts of things. By signing the token, you allow it to carry context that you know was only included by your authorisation server and no other actors. If also prevents you from having to share a database or calling the server for validation (on an introspection endpoint). If you have an encryption method on top you could even include some sensible information.

Signing is a powerful solution to removing an extra network call from your flow. Here's how the JWT flow has been standardised:
1. Authorisation server has multiple public/private key pairs used to sign it's tokens (or shared private if agreed with the resource server)
2. It serves the public keys in a `.well-known/keys` endpoint, which resource servers can regularly call to get non expired keys
3. When generating a token it gets signed by a particular key and the key id (`kid`) is included in the token header
4. The resource owner computes de signature with the public key that matches the `kid`


The JWT can include all sorts of information in the payload, although you should strive to keep it short, as it's passed as a header. Some of the following fields (aka. claims) called _registered_ and recommended but not mandatory:
- `iss`: issuer
- `sub`: subject
- `aud`: audience identifies the recipients
- `exp`: expiration time
- `iat`: issued at time
- `nbf`: not before time
- `jti`: unique identifier for JWT

Besides the registered claims you also have public and private claims. 


## Client registration

Finally we come to the client registration. It can be static or dynamic, even though you'll see a manual provisioning setup around dynamic registration. I'll go over this topic in the implementation post. 

## Extras

Repeating an important point. OAuth2 does not handle **authentication**. In order to cover that, an extension protocol called OpenID Connect has been created on top of it, which relies on the authorisation server also being an identity provider. When that is the case, you can add authentication layer on top of it by leveraging a second token called the ID token and serving a `/userinfo` endpoint. 

The OIDC protocol is a bit complexer and deserves a full post to discuss it. I'll get a bit into the details during the implementation post, which you can read next.