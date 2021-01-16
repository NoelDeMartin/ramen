# 🍜 Ramen [![Build Status](https://semaphoreci.com/api/v1/noeldemartin/ramen/branches/main/badge.svg)](https://semaphoreci.com/noeldemartin/ramen)

Can you make Ramen? [Let's find out!](https://ramen.noeldemartin.com)

## What is this?

This is a simple (and silly) [Solid App](https://solidproject.org) that I've created to test interacting with [different Solid environments](#current-status-and-known-issues). I had been developing apps exclusively with `node-solid-server`, but now that I wanted to test with other implementations I decided to start with something simple. Going forward, this repository will be my golden standard for app interactions with Solid servers. It's also a good place to start if you want to learn how I build my apps.

What the application actually does is that once you're logged in, it checks if you have a `schema:Recipe` container and finds a recipe with "ramen" in the title. If they don't exist, it lets you create them.

If this application is not working with your Solid account, please let me know! I'm also open to improvements if there's something I could be doing differently.

## Current Status and Known Issues

At the moment, users have to log in again after refreshing the page using the default authentication method. This is not an issue per-se, and the application will remind users of their last login url. But it's not great UX. This is [a known issue](https://github.com/inrupt/solid-client-authn-js/issues/423) in Inrupt's library.

The application has been tested with the following implementations:

- [Node Solid Server](https://github.com/solid/node-solid-server): The app has been tested and works properly with `v5.2.2` and `v5.6.0`.
- [Enterprise Solid Server](https://inrupt.com/products/enterprise-solid-server/): The app has been tested and works properly (tested in January 2021).
- [Community Solid Server](https://github.com/solid/community-server): The app has been tested and works properly with `v0.5.0`. However, logging in has to be done through an external provider as discussed [here](https://github.com/solid/community-server/issues/425).
- [PHP Solid Server](https://github.com/pdsinterop/php-solid-server): The app has been tested, but the server requires multiple fixes to work properly. Those are being discussed in [pdsinterop/php-solid-server#42](https://github.com/pdsinterop/php-solid-server/issues/42).

## Attributions

- SVG icons by [heroicons](https://heroicons.com) and [Zondicons](https://www.zondicons.com).
- SVG loaders by [Sam Herbert](https://samherbert.net/svg-loaders).
- Emojis by [Twitter](https://github.com/twitter/twemoji).
- Ubuntu font by [Canonical](https://design.ubuntu.com/font).
