import Cookbook from './Cookbook';

export const services = {
    $cookbook: Cookbook,
};

export type AppServices = typeof services;

declare module '@aerogel/core' {
    interface Services extends AppServices {}
}
