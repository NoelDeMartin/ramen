# ActivityPods Compatibility Report

This report outlines the challenges I've faced adapting my [Ramen](https://ramen.noeldemartin.com) app to work with [ActivityPods](https://activitypods.org/). Ideally, it should work without changing any code; that's the point of Solid being a protocol. But they are still working on making ActivityPods fully spec-compliant, and I wanted to see how far it was.

This document only talks about my specific challenges adapting this app. You can read the official compatibility report in their website at [ActivityPods: Solid compliance](https://activitypods.org/specs/solid), and what they plan to do in the future in [ActivityPods 3.0 Milestones](https://pad.lescommuns.org/GDwoZyzJSkGPnvaOlJrSqA#).

## Current status

With the current implementation, the application works with ActivityPods 🥳. However, you'll notice that it gets stuck during the installation process, and you need to go back to the app to retry the log in process. This is likely due to some [additional requirements](#additional-requirements), but I decided not to implement everything as this is likely to change in the future (and many of those are outside the scope of the Solid spec).

All in all, if you just want to see the code, these are all the changes I had to do:

-   [Changes in `soukai-solid`](https://github.com/NoelDeMartin/soukai-solid/commit/c8e51620dd240521cb1a339487049e5573baaad3).
-   [Changes in the Ramen app](https://github.com/NoelDeMartin/ramen/commit/9555ba84c942d5612c052b5241a2cce5ef4b85f7).
-   [Deploying a new service at `rem.noeldemartin.com`](https://github.com/NoelDeMartin/rem/).

## Additional requirements

Besides the [limitations](#limitations) in their current implementation, I've also noticed some additional requirements that I haven't encountered in any other Solid Server so far. Some of these are likely to change as they become fully spec-compliant.

-   **Using [SAI](https://solid.github.io/data-interoperability-panel/specification/).** In the current implementation, SAI is the only way to log in with a Solid App. This is likely to change, as described in this issue: https://github.com/activitypods/activitypods/issues/344.

-   **ActivityPub's inbox/outbox.** I suspect the reason why my application gets stuck during the installation process is that I don't implement ActivityPub's inbox/outbox endpoints. And [their frontend seems to wait for an Accept activity](https://github.com/activitypods/activitypods/blob/2888f28fcb5e5607f3498a4f84cbf7b64b8a33ea/pod-provider/frontend/src/pages/AuthorizePage/InstallationScreen.js#L69..L75). I have to assume this won't be a requirement in the future, as it's completely unrelated to Solid.

-   **Server-side computation.** Similar to other Solid Servers, logging in to an ActivityPods Pod requires providing a [Client ID document](https://solid.github.io/solid-oidc/#clientids-document). However, in contrast with other servers, [they expect this document to perform content negotiation using a `JsonLdContext` header](https://activitypods.org/specs/activitypods#jsonldcontext-header).

    This is not too difficult to implement, but it raises the concern of expecting Solid Apps to have a server-side component. So far, all my applications have worked entirely in the frontend, and that's been one of the biggest advantages of Solid (no need to manage servers, they can work in a local networks, etc.). The way I've solved it is implementing [a separate service](https://github.com/NoelDeMartin/rem/) to manage application identities. But I'm not sure how far this can be stretched in the future, and I've already seen some parts where it breaks down (the authorization UI is showing the service domain instead of the app's, etc.).

## Limitations and unexpected behavior

Most of these are likely to be fixed in a future version when ActivityPods becomes fully spec-compliant. But I was surprised because some weren't listed in their [official compatibility report](https://activitypods.org/specs/solid).

-   [Inrupt's authentication library](https://github.com/inrupt/solid-client-authn-js) doesn't work. I have to assume this is because they don't fully support Solid-OIDC yet, but I haven't dug any further.
-   Container urls don't end with `/`.
-   RDF documents can only contain triples for a single subject, which has to be the document's url. They cannot contain fragments such as `#it`.
-   Document container urls don't match the document's. For example, using this app you'll notice the container for recipes is created at `/data/schema/recipe`, but contained recipes are created as `/data/{uuid}` (instead of `/data/schema/recipe/{uuid}` as I'd expect).
-   Creating documents with `text/turtle` doesn't work, I had to use `application/ld+json` instead.
-   It's only possible to create containers for known vocabularies. During registration, the server validates the vocabularies against [prefix.cc](https://prefix.cc/). For example, in my app I was using `https://schema.org/Recipe`; but that didn't work since it expected `http://schema.org/Recipe` (starting with `http://` instead of `https://`). However, once the container has been created, you can store any resource inside (for example, I also create `http://schema.org/HowToStep` and `https://vocab.noeldemartin.com/crdt/Metadata` documents).
-   Container responses include the triples from all the contained documents, not just `ldp:contains` and `dc:modified`. There is some ambiguity in the spec regarding what container responses should include, as discussed in [solid/specification#227](https://github.com/solid/specification/issues/227#issuecomment-773945439). But this resembles the deprecated [globbing](https://github.com/solid/solid-spec/blob/master/api-rest.md#globbing-inlining-on-get) approach that was shown to cause performance issues.

## Conclusion

Depending how you've implemented your Solid App, some of these can be very difficult or very easy to bypass. In my case, I was able to make most of them work with relatively little work (take a look at [the diffs above](#current-status)). For authentication, I had already decoupled the functionality; it was only a matter of [implementing a new authentication method](https://github.com/NoelDeMartin/ramen/blob/main/src/auth/ActivityPodsAuthenticator.ts). And since I'm using the Active Record design pattern with [Soukai](https://github.com/noeldemartin/soukai-solid), I didn't have to modify most of my application code.

However, there are some issues that wouldn't be so irrelevant in a real application. The limitation of creating an individual document for each RDF resource causes serious performance problems. In this app, you can already see how "learning Ramen" is much slower than against other PODs. Among other things, this happens because just creating a single recipe requires 12 network requests (1 for the recipe itself, 1 for the metadata, and 10 for the instruction steps). In a real application, like [Umai](https://umai.noeldemartin.com), this would be much worse. Besides having more than a single recipe, modifications would create multiple [CRDT operations](https://vocab.noeldemartin.com/crdt/Operation). Subsequently, this would become a problem each time the application wants to synchronize the data with the POD. Because now the "recipes container" would contain hundreds of documents (most of which wouldn't be recipes), and that would translate to hundreds of network requests.

Because of this, and other issues described throughout this document, I'm refraining from adapting any of my real apps to ActivityPods. But I'm looking forward to the day they are addressed. Because like many others, I'm very excited about the project!
