# 🍜 Ramen [![Build Status](https://semaphoreci.com/api/v1/noeldemartin/ramen/branches/main/badge.svg)](https://semaphoreci.com/noeldemartin/ramen)

Can you make Ramen? [Let's find out!](https://ramen.noeldemartin.com)

## What is this?

This is a simple (and silly) [Solid App](https://solidproject.org) that I've created to test interacting with different Solid environments ([NSS](https://github.com/solid/node-solid-server), [CSS](https://github.com/solid/community-server), [ESS](https://inrupt.com/products/enterprise-solid-server/), [PSS](https://github.com/pdsinterop/php-solid-server), etc.). I had been developing apps exclusively with NSS, but now that I started testing with other implementations I wanted to start with something simple. Going forward, this repository will be my golden standard for app interactions with Solid. So it's also a good place to start if you want to learn how I build my apps.

What the application actually does is that once you're logged in, it checks if you have a `schema:Recipe` container and finds a recipe with "ramen" in the title. If they don't exist, it lets you create them.

If this application is not working with your POD, please let me know! I'm also open to improvements if there's something I could be doing differently.

## Attributions

Emojis by [Twitter](https://github.com/twitter/twemoji/), icons by [heroicons](https://heroicons.com/), and Ubuntu font by [Canonical](https://design.ubuntu.com/font/).
