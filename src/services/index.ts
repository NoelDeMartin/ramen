import Cookbook from './Cookbook';

export const services = {
    $cookbook: Cookbook,
};

export type AppServices = typeof services;

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties extends AppServices {}
}
