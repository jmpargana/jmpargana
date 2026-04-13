+++
title = 'OpenSource - 2 - First Contribution'
date = 2024-08-30T22:03:54+01:00
draft = false
tags = ["Open Source", "OSS", "containerd", "go"]
+++

## Getting started

I should've called it _My Second Contribution_ to be accurate. The first contribution, can be quite easy. Instead I'll call that one step zero and the second as my first. It even fits better our software engineering counting habits.

## Finding your target

Contributing to an open source project isn't really that much different than your daily job (assuming you work with industry standard practices). You go through the same ramping up steps. You'll read documentation on the organisation, on the team. What tools are needed and how to set them up. 

Every open source project is different, but they tend to follow the same principles. You need:
- Code of conduct
- Contributing guide
- License
- Security guide
- README 

Sometimes it's all on the README. Sometimes on different markdown files. Sometimes on a Wiki section. Other times as a GitHub Pages site. If it's not there, hey, that's a contribution opportunity for you right there.

Whatever you go for, you should be confident to get information on:
- how to run the code, tests
- what tools to use (linting, generating, etc.)
- what style to adhere to
- how to document and communicate your changes

## Step zero

If you look at big projects on GitHub, you'll find extremely complex source code, a lot of documentation with guidelines, thousands of issues with tens of comments. If you investigate who the commenters and maintainers are, you'll sometimes spot people in big tech companies, principal engineers, community giants. In a nutshell, it's intimidating. 

Don't be frighten. For the very first step. Let's call it step zero. There's a single repository called [first contribution](https://github.com/firstcontributions/first-contributions) that simplifies the hard step of navigating through code.

## Actual contribution

Now that you have completed your first contribution, I'll share my experience rather than tell you exactly which repository to contribute to.

I've been reading code of tools I use regularly for a while, and since got the idea of contributing to an open source project, started also visiting the issues and the `/org/repo/contribute` pages.

> NOTE: If you didn't know, searching for `/contribute` in any repo will automatically list any issue labeled as `good first issue`.


Inside the `containerd` organisation I learned about the tool `nerdctl`, which is CLI compatible with Docker, but wired for the containerd runtime. 

By chance, I found a good first issue that was actually a small feature request, not just documentation or a bug fix. [Issue in question](https://github.com/containerd/nerdctl/issues/2835) was to add multiple build contexts to an image build, allowing files from different folders.

I cloned the repository and started exploring the code to understand how it worked. After some experimentation, I figured out how to pass that flag down to [BuildX](https://github.com/docker/buildx).

Before opening the PR I read all the documentation that was available to understand how the tests should look like and what kind of documentation was needed for the additional CLI flag.

[Here's the result](https://github.com/containerd/nerdctl/pull/2861).

During review I realise there was another [potential PR](https://github.com/containerd/nerdctl/pull/2869) I could do, by refactoring an API used in tests to use `t.TempDir()` to generate an ephemeral directory. 

## Conclusion

My first open source contribution turned out to be a fast track into the second for the same project and made me realise the hardest part about joining the contributor community of any project is the onboarding process. Once you've gotten an ok understanding of the code and have experienced the contribution process, it becomes much easier to reiterate. 

With that, I invite you, the reader: if you want to join the open source community but doubt your abilities, start by exploring the code. This is something you likely already do in your daily work. Starting is the hardest part.