import type { Options } from '@aerogel/plugin-solid';

import ActivityPodsAuthenticator from '@/auth/ActivityPodsAuthenticator';
import RamenAuthenticator from '@/auth/RamenAuthenticator';
import MetroAuthenticator from '@/auth/MetroAuthenticator';

export const authConfig: Options = {
    defaultAuthenticator: 'metro',
    authenticators: {
        'activity-pods': new ActivityPodsAuthenticator(),
        'ramen': new RamenAuthenticator(),
        'metro': new MetroAuthenticator(),
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
        metro: MetroAuthenticator;
    }
}

declare module '@noeldemartin/solid-utils' {
    interface SolidUserProfile {
        usesActivityPods?: boolean;
    }
}
