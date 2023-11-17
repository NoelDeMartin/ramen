import { facade } from '@noeldemartin/utils';
import { Solid } from '@aerogel/plugin-solid';

import Recipe from '@/models/Recipe';
import RecipesContainer from '@/models/RecipesContainer';

import Service from './Cookbook.state';

export class CookbookService extends Service {

    public async create(url: string): Promise<void> {
        if (this.container) {
            throw new Error('Container already exists!');
        }

        const typeIndex = await Solid.findOrCreatePrivateTypeIndex();
        this.container = await RecipesContainer.at(url).create({ name: 'Cookbook' });

        await this.container.register(typeIndex.url, Recipe);
    }

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
