# 🍜 Ramen ![CI](https://github.com/NoelDeMartin/ramen/actions/workflows/ci.yml/badge.svg)

Can you make Ramen? [Let's find out!](https://ramen.noeldemartin.com)

## What is this?

This is a simple (and silly) [Solid App](https://solidproject.org) that I've created to test interacting with [different Solid environments](#current-status-and-known-issues). In theory, a Solid App should work with any backend conforming to [the specs](https://solidproject.org/TR/). But in practice, there are some things that don't work exactly the same everywhere. It's also a good place to start if you want to learn how I build my apps.

What the application actually does is that once you're logged in, it checks if you have a `schema:Recipe` container and finds a recipe with "ramen" in the title. If they don't exist, it lets you create them.

This repository should be my golden standard for app interactions with Solid servers, so if anything is not working for you, please [let me know!](https://github.com/NoelDeMartin/ramen/issues/new) Chances are that it's also affecting [my other apps](https://github.com/search?q=org%3ANoelDeMartin%20topic%3Asolid-app&type=repositories).

## Current Status and Known Issues

The application has been tested with the following implementations:

| Solid Server                                                              | Status                      | Last tested on | Comments                                                                                                                                                       |
| ------------------------------------------------------------------------- | --------------------------- | -------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [NSS](https://github.com/solid/node-solid-server) 5.7.7                   | :thumbsup: Working          | 08/12/2024     |                                                                                                                                                                |
| [CSS](https://github.com/CommunitySolidServer/CommunitySolidServer) 7.0.1 | :thumbsup: Working          | 08/12/2024     |                                                                                                                                                                |
| [ESS](https://inrupt.com/products/enterprise-solid-server/)               | :thumbsup: Working          | 08/12/2024     |                                                                                                                                                                |
| [TrinPod](https://trinpod.us/)                                            | :thumbsup: Working          | 18/06/2021     |                                                                                                                                                                |
| [PHP Solid Server](https://github.com/pdsinterop/php-solid-server)        | :warning: Partially working | 28/12/2020     | The server requires multiple fixes to work properly, reported here: [pdsinterop/php-solid-server#42](https://github.com/pdsinterop/php-solid-server/issues/42) |

Missing a server? [Let me know!](https://github.com/NoelDeMartin/ramen/issues/new)
