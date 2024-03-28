---
toc: true
comments: false
layout: post
title:  Parallax Lessson
description: Describing parallax and other features
---

## What is motion parallax?

Motion parallax describes a psychological phenomenon in which we perceive that farther away objects seem to move slower than close objects.

![Alt text](https://www.researchgate.net/publication/299401615/figure/fig2/AS:349707269361671@1460388118826/Motion-parallax-When-an-observer-passes-through-a-scene-when-driving-a-car-it-moves.png)

If you were in a car, looking out of the window, you might notice that nearby trees or buildings seem to move quickly, while mountains in the distance hardly move at all.

## Motion parallax in games

This effect is frequently replicated in games by layering transparent images over each other.

For example, our Mario game layers images from ``/images/platformer/backgrounds``

![combined](../images/lesson/combined.gif)

Notice how as the player moves, the mountains in the background move slower than the hills closer to the player.

This is accomplished by setting different speed logic to each of the backgrounds, then layering on top of each other.

![hills](../images/lesson/hills.gif)

> Fast moving hills in the front

![mountains](../images/lesson/mountains.gif)

> Slower moving mountains in the back