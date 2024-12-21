# ActivityPods Compatibility Report

> [!WARNING]
> This report still needs to be reviewed by the ActivityPods team, who've been very helpful in solving my doubts so far. I'll reach out to them after the holiday season 🎄.

This report outlines the challenges I've faced adapting my [Ramen](https://ramen.noeldemartin.com) app to work with [ActivityPods](https://activitypods.org/). Ideally, it should work without changing any code; that's the point of Solid being a protocol. But they are still working on making ActivityPods fully spec-compliant, and I wanted to see how far it was.

This document only talks about my specific challenges adapting this app, you can read the official compatibility report in their website: [ActivityPods: Solid compliance](https://activitypods.org/specs/solid).

## Current status

With the current implementation, the application works with ActivityPods 🥳. However, you'll notice that it gets stuck during the installation process, and you need to go back to the app to retry the log in process. This is likely due to some [additional requirements](#additional-requirements), but I decided not to implement everything as this is likely to change in the future (and many of those are outside the scope of the Solid spec).

All in all, if you just want to see the code, these are all the changes I had to do:

-   [Changes in `soukai-solid`](https://github.com/NoelDeMartin/soukai-solid/commit/c8e51620dd240521cb1a339487049e5573baaad3).
-   [Changes in the Ramen app](https://github.com/NoelDeMartin/ramen/commit/9555ba84c942d5612c052b5241a2cce5ef4b85f7).
-   [Deploying a new service at `rem.noeldemartin.com`](https://github.com/NoelDeMartin/rem/).

## Additional requirements

Besides the [limitations](#limitations) in their current implementation, I've also noticed some additional requirements that I haven't encountered in any other Solid Server so far. Some of these are likely to change as they become fully spec-compliant, but others may be requirements going forward.

-   **Using [SAI](https://solid.github.io/data-interoperability-panel/specification/).** In the current implementation, SAI is the only way to log in with a Solid App. This is likely to change, as described in this issue: https://github.com/activitypods/activitypods/issues/344.

-   **ActivityPub's inbox/outbox.** I suspect the reason why my application gets stuck during the installation process is that I don't implement ActivityPub's inbox/outbox endpoints. And [their frontend seems to wait for an Accept activity](https://github.com/activitypods/activitypods/blob/2888f28fcb5e5607f3498a4f84cbf7b64b8a33ea/pod-provider/frontend/src/pages/AuthorizePage/InstallationScreen.js#L69..L75). I have to assume this won't be a requirement in the future, as it's completely unrelated to Solid.

-   **Server-side computation.** Similar to other Solid Servers, logging in to an ActivityPods Pod requires providing a [Client ID document](https://solid.github.io/solid-oidc/#clientids-document). However, in contrast with other servers, [they expect this endpoint to perform content negotiation using a `JsonLdContext` header](https://github.com/assemblee-virtuelle/semapps/issues/1204#issuecomment-1809738430).

    This is not too difficult to implement, but it raises the concern of expecting Solid Apps to have a server-side component. So far, all my applications have worked entirely in the frontend, and that's been one of the biggest advantages of Solid (no need to manage servers, they can work in a local networks, etc.). Looking at their codebase, reading [their tutorials](https://docs.activitypods.org/tutorials/create-your-first-social-app/), and talking with them, it seems like this is a core assumption they are making. So I don't think this is likely to change in the near future.

    The way I've solved it is implementing [a separate service](https://github.com/NoelDeMartin/rem/) to manage application identities. But I'm not sure how far this can be stretched in the future, and I've already seen some parts where it breaks down (the authorization UI is showing the service domain instead of the app's, etc.).

## Limitations and unexpected behavior

Most of these are likely to be fixed in a future version when ActivityPods becomes fully spec-compliant. But I was surprised because some weren't listed in their [official compatibility report](https://activitypods.org/specs/solid).

-   [Inrupt's authentication library](https://github.com/inrupt/solid-client-authn-js) doesn't work. I have to assume this is because they don't fully support Solid-OIDC yet, but I haven't dug any further. This may prove a challenge for some apps, but in my case I had already decoupled authentication methods so it was only a matter of [implementing a new one](https://github.com/NoelDeMartin/ramen/blob/main/src/auth/ActivityPodsAuthenticator.ts).
-   Container urls don't end with `/`.
-   RDF documents can only contain triples for a single subject, which has to be the document's url. They cannot contain fragments such as `#it`.
-   Document container urls don't match the document's. For example, using this app you'll notice the container for recipes is created at `/data/schema/recipe`, but child recipes are created as `/data/{uuid}` (instead of `/data/schema/recipe/{uuid}` as I'd expect).
-   Creating documents with `text/turtle` doesn't work, I had to use JsonLD.
-   It's only possible to create containers for known vocabularies. During registration, the server validates the vocabularies against [prefix.cc](https://prefix.cc/). For example, in my app I was using `https://schema.org/Recipe`; but that didn't work since it expected `http://schema.org/Recipe` (starting with `http://` instead of `https://`). However, once the container has been created, you can store any resource inside (for example, I also create `http://schema.org/HowToStep` and `https://vocab.noeldemartin.com/crdt/Metadata` documents).

Depending how you've implemented your Solid App, some of these can be very difficult or very easy to bypass. In my case, I was able to make most of them work with relatively little work (take a look at [the diffs above](#current-status)). However, they create some issues that wouldn't be so irrelevant in a real application.

For example, the limitation of creating an individual document for each RDF resource causes serious performance issues. In this app, you can already see how "learning Ramen" is much slower than against other PODs. Among other things, this happens because just creating a single recipe requires 13 network requests (1 for the recipe itself, 1 for the metadata, and 11 for the instruction steps). In a real application, like [Umai](https://umai.noeldemartin.com), this would be much worse. Besides having more than a single recipe, modifications also create multiple [CRDT operations](https://vocab.noeldemartin.com/crdt/Operation). Subsequently, this will become a problem each time the application wants to synchronize the data with the POD, because now the "recipes container" will contain hundreds of documents (most of which aren't recipes), which translates to hundreds of network requests.

Because of these, and other issues described throughout this document, I'm refraining from adapting any of my real apps to ActivityPods.
