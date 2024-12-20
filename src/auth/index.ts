import type { Options } from '@aerogel/plugin-solid';

import ActivityPodsAuthenticator from '@/auth/ActivityPodsAuthenticator';
import RamenAuthenticator from '@/auth/RamenAuthenticator';

export const authConfig: Options = {
    defaultAuthenticator: 'ramen',
    authenticators: {
        'activity-pods': new ActivityPodsAuthenticator(),
        'ramen': new RamenAuthenticator(),
    },
    onUserProfileLoaded(profile, store) {
        profile.usesActivityPods = !!store.statement(
            profile.webId,
            'http://www.w3.org/1999/02/22-rdf-syntax-ns#type',
            'https://www.w3.org/ns/activitystreams#Person',
        );
    },
};

declare module '@aerogel/plugin-solid' {
    interface Authenticators {
        'activity-pods': ActivityPodsAuthenticator;
        ramen: RamenAuthenticator;
    }
}

declare module '@noeldemartin/solid-utils' {
    interface SolidUserProfile {
        usesActivityPods?: boolean;
    }
}
