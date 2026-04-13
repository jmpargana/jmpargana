+++
title = 'MiniTube - PKI & rootCA + LB Setup'
date = 2026-03-05T22:03:54+01:00
draft = false
tags = ["kubernetes", "tls", "pki", "ca", "lb", "load balancer", "cloud", "gateway api", "cert-manager"]
+++

This post is part of my _MiniTube_ series. If you end up enjoying the content, please have a look at other related tasks.

## Problem

Let's start with the problem. [Web Crypto API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API) is only available over secure contexts (HTTPS) or localhost. 

While developing the frontend to my MiniTube application, the function I was using to generate a random UUID `crypto.randomUUID()` stopped working once I deployed the container in Kubernetes. 

## Solution

The solution was not really a solution, but rather an invitation to understand how setting TLS locally can be done. 

Like [oauth](/posts/oauth2), TLS is something I've been using for a very long time. It's part of every deployment to production. It's part of internal communication of pods in Kubernetes if you have a service mesh. It's ubiquitous. 

Yet, I had never really spend any time trying to understand how it works exactly. This prompted me on a journey to understand something that in my mind was only one thing (_TLS_), which then turned into a lot of other things, because _TLS_ is really just part of a cryptography ecosystem which has been standardised in the way we communicate over the internet. 

## Scope

I'll use different posts to dive deeper into how TLS works (cryptography behind it, the protocol itself, different versions and flows). 

In this post I'll focus on PKI, the options we have for setting up a certificate and the easiest way to set up a load balancer to your service using TLS.

## PKI

In order to set up a secure environment you need _trust_. Trust, specially in a distributed system with many moving parts requires some sort of centralize entity, or better, multiple entities to give you confidence that a given actor is trustworthy. 

Certificates can be fake, tampered with, invalid, misused, you name it. PKI, also public key infrastructure was created as a process to define few trustworthy organisations that could delegate the validation to others they trust, thus creating a chain of trust. 

PKI has flow to generate and validate certificates. We won't go into how they work and the nomenclature used for each of the actors. The more interesting part of it is how certificates are passed and how are they validated. 

When you perform a TLS handshake before submitting your HTTP request to a server, the server responds with a certificate and a chain of certificates that extend to a root CA (certification authority). 

Locally you are expected to have the missing CA, either on your browser or on your operating system and compute the signing of the chain with the public key you have locally. All these computations are extremely quick and done before you start encrypting the content of your communication with the temporary server+client secret. 

These root CAs include public keys for some of the entities you might already know: Let's encrypt, DigiCert, Apple, etc.

Your first question might be: should I create a certificate from one of these root CAs or other CAs, or should I create my own root CA. 

The answer is _it depends_. Creating your own root CA has limitations, because it won't be automatically trusted by other clients, unless you add it to their root CAs, but it can be incredibly useful in a setup where you only want internal _trust_. 

## Requesting certificate

First, let's explore getting a certificate from an existing CA that's not own by you. This used to be expensive until Let's Encrypt came in and created the ACME (Automatic Certificate Management Environment) protocol, which is a dance over HTTP that you can leverage to generate a certificate with full automation. 

This protocol involves requesting a certificate along with the type of validation that the ACME server will require to get proof you are the owner of the domain you are requesting for. You don't need to implement the interaction flow yourself. There's great tools, even with full infrastructure provisioning, like [cert-manager](https://cert-manager.io/docs/), that implement the protocol and give you full automation to manage your certificates.

The only issue is, if you don't own the domain yet, or if you don't expose a client on that domain to prove you are the owner, you won't be able to get a certificate for it (unless in non-production environments).

## root CA

Moving to the custom root CA. If you only intend to use a domain that you are playing with locally (and you usually trust yourself), creating a root CA might be enough. 

[mkcert](https://mkcert.org/) is an amazing tool that does exactly that. It generates a local root CA, that you can use to create certificates by yourself to yourself.


Start by installing the CA on your system:

```sh
> mkcert -install
```

Then you can generate the certificate:

```sh
> mkcert your-domain.com
```

Finally you navigate to the certificate location and use the certificates for whatever you need.

```sh
> mkcert -CAROOT
```

## Using the certificates

For each of the certificate you'll have the public and private key. Each of them encoded with x.509 format. If you configured `cert-manager` previously, you can leverage it by pointing to files or full strings, instead of configuring the ACME flow.

You need to create a secret with the certificates first:

```sh
mkcert -install
CA=$(mkcert -CAROOT)
kubectl create secret tls minitube-tls --cert="$CA/rootCA.pem" --key="$CA/rootCA-key.pem" --namespace cert-manager
```

With that in place you can create a `ClusterIssuer`, which is quite a simple payload when it doesn't need ACME configuration.

```yaml
apiVersion: cert-manager.io/v1
kind: ClusterIssuer
metadata:
  name: letsencrypt-staging
spec:
  ca:
    secretName: minitube-tls
```

Then, using the new Gateway API, you can create a `Gateway` (I'll go over the missing piece of creating a `GatewayClass` later):

```yaml
apiVersion: gateway.networking.k8s.io/v1
kind: Gateway
metadata:
  name: minitube-gateway
  annotations:
    cert-manager.io/cluster-issuer: letsencrypt-staging
spec:
  gatewayClassName: eg
  listeners:
  - name: https
    tls:
      mode: Terminate
      certificateRefs:
      - name: minitube-tls
    hostname: minitube.local
    port: 443
    protocol: HTTPS
    allowedRoutes:
      namespaces:
        from: All
```

Finally, all you need to add the domain to your static DNS configuration, so that your browser knows how to translate the TLS secured domain into an IP:

```sh
> sudo cat $(kubectl get gateway minitube-gateway -o jsonpath='{.status.addresses[0].value}') >> /etc/hosts
```

## Load Balancing

The final step is to create a load balancer, so that you can access your cluster from the outside. The following example is meant for [kind](https://kind.sigs.k8s.io/) users. There's a tool that creates a tunnel to your cluster, running inside docker, so that you can replicate a cloud provider without having to use a service from outside: [cloud-provider-kind](https://github.com/kubernetes-sigs/cloud-provider-kind).

Once you are running you can install any service you'd use to perform load balancing and/or act as API Gateway. One of my go to tools is [envoy](https://gateway.envoyproxy.io/).

Running the following command will set up a `GatewayClass` that you can use to attach an external IP to the Gateway you've configured before:

```sh
> helm install eg oci://docker.io/envoyproxy/gateway-helm --version v1.7.1 -n envoy-gateway-system --create-namespace --skip-crds
```

## Conclusion

That's it on how I've configured my MiniTube project to be accessible with TLS and use the crypto web API locally. I hope you've came out of this with a bit more knowledge on how PKI works and how you can use it.

I'll create a post in the future to explain the content of the certificates and how the TLS protocol itself works.