# 🍜 Ramen ![CI](https://github.com/NoelDeMartin/ramen/actions/workflows/ci.yml/badge.svg)

Can you make Ramen? [Let's find out!](https://ramen.noeldemartin.com)

## What is this?

This is a simple (and silly) [Solid App](https://solidproject.org) that I've created to test interacting with [different Solid environments](#current-status-and-known-issues). In theory, a Solid App should work with any backend conforming to [the specs](https://solidproject.org/TR/). But in practice, there are some things that don't work exactly the same everywhere. It's also a good place to start if you want to learn how I build my apps.

What the application actually does is that once you're logged in, it checks if you have a `schema:Recipe` container and finds a recipe with "ramen" in the title. If they don't exist, it lets you create them.

This repository should be my golden standard for app interactions with Solid servers, so if anything is not working for you, please [let me know!](https://github.com/NoelDeMartin/ramen/issues/new) Chances are that it's also affecting [my other apps](https://github.com/search?q=org%3ANoelDeMartin%20topic%3Asolid-app&type=repositories).

## Current Status and Known Issues

The application has been tested with the following implementations:

<!-- prettier-ignore-start -->
| Solid Server                                                              | Status                      | Last tested | Comments |
| ------------------------------------------------------------------------- | --------------------------- | ----------- | -------- |
| [LSS](https://lss.noeldemartin.com/)                                      | :warning: Partially working | 09/04/2025  | Private read/write operations mostly work, but it doesn't support any of the authorization schemes (WAC, ACP, etc). |
| [iGrant.io](https://datapod.igrant.io/)                                   | :thumbsup: Working          | 27/02/2025  |          |
| [ActivityPods](https://activitypods.org/) 2.0.4                           | :no_entry: Not working      | 21/12/2024  | The server implements a subset of the Solid Specification, and requires using [SAI](https://solid.github.io/data-interoperability-panel/specification/) and a server-side component (which I'm no longer running). Learn more about it in my full [ActivityPods Compatibility Report](./docs/activitypods.md). |
| [TrinPod](https://trinpod.eu/)                                            | :thumbsup: Working          | 30/01/2024  |          |
| [NSS](https://github.com/solid/node-solid-server) 5.7.7                   | :thumbsup: Working          | 08/12/2023  |          |
| [CSS](https://github.com/CommunitySolidServer/CommunitySolidServer) 7.0.1 | :thumbsup: Working          | 08/12/2023  |          |
| [ESS](https://inrupt.com/products/enterprise-solid-server/)               | :thumbsup: Working          | 08/12/2023  |          |
| [use.id](https://use.id/)                                                 | :no_entry: Not working      | 08/12/2023  | The server doesn't expose any [writable profiles](https://solid.github.io/webid-profile/) (nor extended profiles), so the app fails trying to create a [type index](https://solid.github.io/type-indexes/). |
| [PHP Solid Server](https://github.com/pdsinterop/php-solid-server)        | :warning: Partially working | 28/12/2020  | The server requires multiple fixes to work properly, reported here: [pdsinterop/php-solid-server#42](https://github.com/pdsinterop/php-solid-server/issues/42). |
<!-- prettier-ignore-end -->

Missing a server? [Let me know!](https://github.com/NoelDeMartin/ramen/issues/new)
