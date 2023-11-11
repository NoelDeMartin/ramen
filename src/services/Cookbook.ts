import { facade } from '@noeldemartin/utils';
import { Solid } from '@aerogel/plugin-solid';

import Recipe from '@/models/Recipe';
import RecipesContainer from '@/models/RecipesContainer';

import Service from './Cookbook.state';

export class CookbookService extends Service {

    protected async boot(): Promise<void> {
        await Solid.booted;

        Solid.loggedIn && (await this.loadContainer());
    }

    protected async loadContainer(): Promise<void> {
        const typeIndex = await Solid.findPrivateTypeIndex();
        this.container = (await typeIndex?.findContainer(Recipe, RecipesContainer)) ?? null;
    }

}

export default facade(new CookbookService());
