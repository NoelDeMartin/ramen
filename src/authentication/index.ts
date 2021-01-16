import Authenticator, { AuthSession } from '@/authentication/Authenticator';
import CommunityAuthenticator from '@/authentication/CommunityAuthenticator';
import InruptAuthenticator from '@/authentication/InruptAuthenticator';
import LegacyAuthenticator from '@/authentication/LegacyAuthenticator';

export type { AuthSession };

export enum AuthenticationMethod {
    Inrupt = 'inrupt',
    Community = 'community',
    Legacy = 'legacy',
}

export const defaultAuthenticationMethod = AuthenticationMethod.Inrupt;

export const authenticators: Record<AuthenticationMethod, Authenticator> = {
    [AuthenticationMethod.Inrupt]: InruptAuthenticator,
    [AuthenticationMethod.Community]: CommunityAuthenticator,
    [AuthenticationMethod.Legacy]: LegacyAuthenticator,
};
