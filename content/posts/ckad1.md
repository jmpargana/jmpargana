+++ 
draft = false
date = 2024-08-14T15:05:23+01:00
title = "CKAD - 1 - Foundations"
description = ""
slug = ""
authors = []
tags = ["certification", "kubernetes"]
categories = []
externalLink = ""
series = []
+++

Welcome! In this series you'll read along my journey to CKAD certification. You can expect 
high-level knowledge sharing and hopefully some useful tips.

## Picking the course

Visiting the [linux foundation](https://training.linuxfoundation.org/certification/certified-kubernetes-application-developer-ckad/), you'll see a suggested package, which includes a course, an annual subscription, and more. 

After getting advise from colleagues who are already certified, I decided to follow a different course instead, on [Udemy](https://www.udemy.com/course/certified-kubernetes-application-developer/learn/lecture/28376970#overview). 

Not only does this have close to 5 star reviews, it's significantly cheaper. I purchased it with a discount of 80% (at around $11).

## First impressions

I've only just started. After completing the _Section 2: Core Concepts_, I'm already very impressed with the instructor. 
Even though I've been using Kubernetes professionally and dealing with it daily—debugging, deploying, securing—the course is the first time I've understood core concepts that make the documentation and manifest development much clearer. 

Also, since the course is heavily focused on `kubectl`, I've stopped relying on `k9s` as a daily dependency and am now comfortable using `kubectl` directly.

### Manifest skeleton

```yaml
apiVersion: string
kind: Kind
metadata: map[string]any
spec: any
```

Each manifest always has the 4 components listed above. 

`Kind` is anything either available in the kubernetes API (ex. `Pod`, `Service`, `ReplicaSet`, etc.) or it's something custom defined (or a _CRD_).

`spec`, the most important field, is strongly typed and needs to match it's `Kind`. 

> NOTE: In future posts I'll go more in depth with `apiVersion`, `kind` and `spec`. Understanding these fields is all about understanding how Kubernetes exposes it's API and how you can enhance it.


### Kubernetes API References

My motivation to explore the documentation can be split in 2 points.

#### LLMs

In my quest to become a better software engineer, I want to fight the constant urge of finding the _easy_ solution. For most questions I have, instead of searching for a response on StackOverflow, on Guides, articles, I end up going for the easy thing: asking the latest most powerful model. 

This is sadly becoming a recurring event. Much more serious than using `k9s` as a clutch. 

One way I'm trying to break out of that cycle is to find the information in 2 sources. Either the official documentation or directly in the source code. 

#### Certificate

My second motivation is during the certification one only has access to the documentation. So ideally, you should become well versed in it's structure to find your way around.

#### Reference

Well, the docs are massive. You have over 1000 pages, but the API reference, as it's automatically generated, is quite intuitive. It feels like navigating code.

You start of in the [References > Kubernetes API](https://kubernetes.io/docs/reference/kubernetes-api/) submodule. If you can't find it straight away in the categories, you can simply search for a title (ex. `Pods`).

Every documentation that is not a reference, contains an API reference on top-right corner saying `X API`. Clicking it, you'll see exactly what's expected in the spec.

Here's the example for `Pod`:

```yaml
PodSpec:
  Containers:
    - Name: string
      Image: string
      // ... plenty more
  Volumes:
  Scheduling:
  // ... plenty more
```

You'll be able to understand exactly what the required fields are and how what data is expected. 

### Imperative commands

The 3rd valuable lesson is using _imperative commands_ to quickly generate YAML manifest boilerplate. While you can add all necessary flags for a complete resource definition, you can quickly generate templates for most common debugging scenarios. 

Before I start dumping all the information I've learned so far, there's 2 important flags that come in handy when using imperative commands.

1. `--dry-run=client` -> does not create any resources yet, just outputs the result
2. `-o yaml` -> dumps the exact yaml manifest needed

#### Pods

As pods are working resources, you can _run_ them:

```sh
$ kubectl run nginx --image nginx --dry-run=client -o yaml
apiVersion: v1
kind: Pod
metadata:
  creationTimestamp: null
  labels:
    run: nginx
  name: nginx
spec:
  containers:
  - image: nginx
    name: nginx
    resources: {}
  dnsPolicy: ClusterFirst
  restartPolicy: Always
status: {}
```

For `Deployments` you need to _create_. As with other commands in `kubectl` you can opt for the short form:

```sh
$ kubectl create deploy nginx-deploy --image nginx --replicas 4 --dry-run=client -o yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  creationTimestamp: null
  labels:
    app: nginx-deploy
  name: nginx-deploy
spec:
  replicas: 4
  selector:
    matchLabels:
      app: nginx-deploy
  strategy: {}
  template:
    metadata:
      creationTimestamp: null
      labels:
        app: nginx-deploy
    spec:
      containers:
      - image: nginx
        name: nginx
        resources: {}
status: {}
```

As you can probably notice, the selector labels and pod metadata match, so that's one less thing you need to check on.

For services there are multiple ways, I'll show an alternative to `create`:

```sh
$ kubectl expose pod redis --port=6379 --name redis-svc --dry-run=client -o yaml
apiVersion: v1
kind: Service
metadata:
  creationTimestamp: null
  labels:
    run: redis
  name: redis-svc
spec:
  ports:
  - port: 6379
    protocol: TCP
    targetPort: 6379
  selector:
    run: redis
status:
  loadBalancer: {}
```

And for namespace, you can also do it very quickly:

```sh
$ kubectl create ns ns-test --dry-run=client -o yaml
apiVersion: v1
kind: Namespace
metadata:
  creationTimestamp: null
  name: ns-test
spec: {}
status: {}
```

You can always pipe these yaml to files that you edit further before applying, or you don't even have to worry about the output if you simply want to validate the typing. Doing a `--dry-run` will give you feedback if the types are correct.


## Conclusion

These were the first learnings, but here comes a recommendation. The only reason I can remember them all so well is because of the practicing labs that come with the udemy course.

Playing around with quickly creating all kinds of resources, even debugging some pods on your dev cluster.