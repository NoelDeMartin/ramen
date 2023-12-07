import { Colors as AerogelColors } from '@aerogel/core';

export const Colors = {
    ...AerogelColors,
    Solid: 'solid',
};

export type Color = (typeof Colors)[keyof typeof Colors];
