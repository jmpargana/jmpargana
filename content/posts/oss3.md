+++
title = 'OpenSource - 3 - Humbled by AI'
date = 2026-03-19T22:03:54+01:00
draft = false
tags = ["Open Source", "OSS", "TypeScript", "GHA", "GitHub Actions"]
+++

I've managed to find another project that I could contribute to.

During the last weeks of December, while a team in my company was migrating from Azure DevOps Pipelines to GitHub Actions, a colleague reached out because one of the actions we developed, which was meant to be reused across the company was not working. It was the CI workflow, responsible for build, running and publishing the unit and integration tests, while security scans would run in parallel. 

This workflow would fail in their runtime, because the runners didn't have docker compose installed and the [compose-action](https://github.com/hoverkraft-tech/compose-action) crashed with an unexpected error. 

Navigating the code exposed a quick bug to solve so I opened my personal laptop and layed hands to work. 

## The Bug

The bug was very easy to fix, but hidden in a few layers of if/else logic with 3 flags. It took me a while to figure out the cleanest boolean expression, without refactoring too much the code. 

This is the kind of setup, that no matter how you look at, it'll always look like you can improve it. You'll understand what I mean with the snippet:

```typescript
async install({ composeVersion, cwd, githubToken }: InstallInputs): Promise<string> {
    const currentVersion = await this.getInstalledVersion(cwd);

    const needsInstall = !currentVersion || (composeVersion && composeVersion !== currentVersion);
    if (!needsInstall) {
      return currentVersion;
    }

    let targetVersion = composeVersion || COMPOSE_VERSION_LATEST;

    if (targetVersion === COMPOSE_VERSION_LATEST) {
      if (!githubToken) {
        throw new Error("GitHub token is required to install the latest version");
      }
      targetVersion = await this.getLatestVersion(githubToken);
    }

    await this.installVersion(targetVersion);

    return this.version({ cwd });
  }
```

## Pushing changes

Before submitting the PR I filed a [bug report](https://github.com/hoverkraft-tech/compose-action/issues/232), documenting the issue as requested in the code of conduct. Then, a few minutes later a opened the [PR](https://github.com/hoverkraft-tech/compose-action/pull/234).

Everything went well and within a few minutes the maintainer merged the changes. 

## Humbling experience

Here's why I'm writing an article about it. 

Between the time I filed the bug and opened the PR (few minutes tops), copilot had already created a branch, opened a PR in draft with the plan to identify the issue. It then correctly identified the issue and submitted a similar PR with a similar refactor of the boolean states along with the same style of testing. All this in maximum 5 minutes compared to the 2/3h it took me to clone the code, read the documentation, study the tests, setup my personal laptop to run the tests, document the pull request description. 

This wasn't the state of art we are witnessing today with impressive coding agents and cheap-to-run models like gemma. It was back in January and it was already insanely powerful and making it compelling for open source maintainers to stop relying on contributers for such small tasks.