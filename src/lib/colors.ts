import { Colors as AerogelColors } from '@aerogel/core';

export const Colors = {
    ...AerogelColors,
    Solid: 'solid',
    SolidSecondary: 'solid-secondary',
};

export type Color = (typeof Colors)[keyof typeof Colors];
