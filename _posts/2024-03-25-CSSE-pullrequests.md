---
toc: true
comments: false
layout: post
title:  Pull Requests Guide
description: Tutorial on Forks and Pull Requests
---
## Making a Fork

To start, you will need a "fork" of a GitHub repository. In this case, we will use [platformer3x](https://github.com/nighthawkcoders/platformer3x). This will create a copy of the repository to save your changes to the code without them being saved on the original (so that we don't accidentally break Mr. Mortensen's code). You will only need one of these per team.

1. To do this, navigate to a repository and click the fork button on the top-right.

![fork image](https://github.com/nighthawkcoders/platformer3x/assets/112529809/3cd73185-2ea0-4c54-a708-f1135fa9ed57)

2. Fill in the name/description however you want

![Screen Shot 2024-03-25 at 1 10 45 PM](https://github.com/nighthawkcoders/platformer3x/assets/112529809/f7b371f9-ea17-453f-8fa7-5aa3ebf17d1d)

3. Invite your team members as collaborators through the settings section on GitHub.

![Share!](https://github.com/nighthawkcoders/platformer3x/assets/112529809/8758971f-7ac6-4701-9760-a3a5a58c4a06)

4. Next, you can clone your new fork in VSCode and start coding! Hurrah!!

## Saving your Changes

1. Most of this should be review, but after making a change to your cloned fork, you should stage changes in Source Control and commit them with a message.

![Screen Shot 2024-03-25 at 1 13 42 PM](https://github.com/nighthawkcoders/platformer3x/assets/112529809/c01721e2-d4eb-4ad6-9899-f1fe404105e4)

2. Next, if you are working with others, you should run ``git pull`` in the terminal (ctrl + `) to make sure you are up to date with the changes made by your team.

3. Now, you can safely sync changes to your repository.

## Making a Pull Request

Before having our changes saved on the original repository, platformer3x (Mr. Mortensen's), you will need to make a pull request.