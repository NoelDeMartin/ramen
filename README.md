# 🍜 Ramen [![Build Status](https://semaphoreci.com/api/v1/noeldemartin/ramen/branches/main/badge.svg)](https://semaphoreci.com/noeldemartin/ramen)

Can you make Ramen? [Let's find out!](https://ramen.noeldemartin.com)

## What is this?

This is a simple (and silly) [Solid App](https://solidproject.org) that I've created to test interacting with PODs. I had been developing apps exclusively with [NSS](https://github.com/solid/node-solid-server), but now that I've started testing with other implementations I decided to create something simple without all the clutter. Going forward, this repository will be my golden standard. So it's also a good place to start if you want to learn how I build my apps.

What the application actually does is that once you're logged into a POD, it checks if you have a `schema:Recipe` container and finds a recipe with "ramen" in the title. If they don't exist, it lets you create them.
