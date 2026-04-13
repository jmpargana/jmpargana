+++
title = "This Blog's Tech Stack & Architecture"
date = 2026-04-12T22:03:54+01:00
draft = false
tags = ["arch", "lambda", "terraform", "aws", "python", "javascript", "stitch", "hugo", "vanilla", "hugo"]
+++

In this post I'll go over the architecture behind this static site plus newsletter features, as well as the decisions behind the tech used.

## Overview

![architecture](/images/site/arch.png)

## Frontend

Starting with the frontend. The previous site was developed with [svelte](https://svelte.dev/) as a fun project to work with a technology I was excited about. Since I've added a blog to it, the functional requirements changed:
- Display page with list of blog posts
- Render markdown in page style for individual post
- Display landing page with animations
- Make it easy to write articles in markdown without having to change code
- Make it easy to update animations and styles without having to rewrite a lot of code

With these requirements in mind, continuing to write svelte would require me to create a set of components for the markdown, and implement a rendering engine, so that I could simply add a static asset which would get converted. 

Working with svelte also makes it difficult to experiment with animations, because the most efficient and document code you find, is usually vanilla javascript, which has good integration with all modern browser APIs.

I've decided to use [hugo](https://gohugo.io/) for the following reasons:
- great support for blogging and markdown rendering
- blazing fast (always a popular argument)
- built on top of helm templating engine, which is something I'm very familiar with because of my backend work
- popular and full of extensions
- great support for vanilla js, html and css

The way I've configured my hugo site was by creating a custom theme, where I define all the vanilla html, js and css inside the theme, then use the main site with only the parameters and markdown content added.

For styling I'm using CSS variables because they're well-supported across all modern browsers and provide excellent extensibility. You build your styles on top of variables and tweaking them in the browser developer tools updates the whole design instantaneously.

## Designs

Continuing on the css styles line, I started by copying the styles I had on my previous blog. However, a few weeks ago I watched a [fireship video](https://www.youtube.com/watch?v=qaB5HF4ax9M) about [stitch](https://stitch.withgoogle.com). 

If you're not familiar with it, I recommend exploring [stitch](https://stitch.withgoogle.com). It generates Figma-friendly designs from LLM prompts, allowing you to iterate on designs through natural language. 

Using Stitch was particularly useful because design has been a challenge for me in past projects. Leveraging AI-generated designs provided a practical solution without hiring a dedicated designer. 

Lastly, to set up those designs with the already existing css variables code, was just a matter of wiring up the MCP google provides and letting it update the whole codebase.


## Newsletter

Now we get to the fun part. The requirements for my newsletter were the following:
- Accept very low throughput and sporadic requests to manage user base
- Have list of users available behind UI so it's easy to review changes
- Spend $0

The requirements for low throughput and sporadic requests are straightforward to solve with any modern technology. The real considerations are CPU and memory efficiency, and ensuring rapid response times even if the service hasn't run in several days. 

The best tool I found was to use [AWS Lambda](https://aws.amazon.com/lambda/), which not only fits all requirements but offers a few more interesting features:
- I can configure it to scale aggressively if needed
- Very low latency
- Easy to develop

I picked python because of the amazing [boto3](https://pypi.org/project/boto3/) library, which exposes AWS services with a very simple SDK. 

The hardest part about developing lambda functions is to test them locally. Fortunately, AWS provides with a CLI tool [sam](https://aws.amazon.com/serverless/sam/) that solves exactly that problem.

If you look into the [repository](https://github.com/jmpargana/jmpargana) you can see a very complete README (auto generated when generating the project), which has all the commands needed to test it locally:

```sh
> sam build --use-container
> sam local invoke join --event events/event.json
> sam local start-api
curl http://localhost:3000
```


## Infrastructure

To provision the infrastructure mentioned above, I used Terraform. This is my preferred tool at work, and using it has deepened my knowledge of the AWS provider.

The terraform folder has a few modules to simplify the main provisioning. I've create a `state-module`, which creates an s3 bucket and dynamodb to store the backend remotely.

> NOTE: As of terraform v1.10.0 a new `use_lockfile` can be used, instead of configuring a separate database for locking.

I also have a `function-module` which abstracts the provisioning I need to perform for each of the lambda functions. 

A Lambda function can be deployed and provisioned in different ways within Terraform. My approach is to use a compiled `.zip` file that gets hashed and encoded before submission to AWS. I'll explain this decision in the automation section.

Once you have deployed the lambda functions you need a provision a REST API on AWS Gateway for it to be accessible from the outside. 

Here's a full list of the building blocks without getting lost in the weeds of implementation details:
- API Gateway REST API
- API Gateway Resource
- API Gateway Deployment (one per lambda)
- API Gateway Stage (one per deployment)

Then, per lambda:
- API Gateway Method
- API Gateway Integration
- Lambda Function (code)
- Lambda Invoke Permission

And the shared infra:
- DynamoDB (to store user list)
- IAM Policy (document, and policy)
- IAM Role (with policy attachment)
- SES (Email) template, to be used by broadcasting function


Last but not least, we also need to configure an extra function and responses for CORS policies, since the lambda will not be running in the same domain (the domain was delegated to GitHub Pages CDN).


## Automation

Regarding the automation, we could have automated the deploy, but the only thing changing continuously is likely to be the javascript animations, design & themes and the actual upload of new articles. For this reason I've opted at compiling the lambda function locally and running the terraform locally as well not to risk exposing my AWS credentials with a future supply-chain attack. 

The only automation we have in place is a simple GitHub Action to call the broadcasting function everytime a new article get's added/updated from the `/content/posts` folder.

## Conclusion

That's it on the implementation of this site. If you are curious feel free to clone and playaround with the code locally. If you have doubts or suggestions you can open an issue you reach out to me directly.
