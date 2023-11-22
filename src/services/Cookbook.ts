import { facade, tap } from '@noeldemartin/utils';
import { Solid } from '@aerogel/plugin-solid';

import junsRamen from '@/assets/json/juns-ramen.json';
import Recipe from '@/models/Recipe';
import RecipesContainer from '@/models/RecipesContainer';

import Service from './Cookbook.state';

export class CookbookService extends Service {

    public hasCookbook(): this is { container: RecipesContainer } {
        return !!this.container;
    }

    public hasRamen(): boolean {
        return !!this.ramen;
    }

    public async create(url: string): Promise<void> {
        if (this.container) {
            throw new Error('Container already exists!');
        }

        const typeIndex = await Solid.findOrCreatePrivateTypeIndex();
        this.container = await RecipesContainer.at(url).create({ name: 'Cookbook' });

        await this.container.register(typeIndex.url, Recipe);
    }

    public async learnRamen(): Promise<void> {
        if (!this.container) {
            return;
        }

        const { instructions, ...attributes } = junsRamen;

        this.ramen = await tap(new Recipe(attributes), async (ramen) => {
            instructions.forEach((text, index) => ramen.relatedInstructions.attach({ position: index + 1, text }));

            await this.container?.relatedRecipes.save(ramen);
        });
    }

    protected async boot(): Promise<void> {
        await Solid.booted;

        Solid.loggedIn && (await this.loadModels());
    }

    protected async loadModels(): Promise<void> {
        const typeIndex = await Solid.findPrivateTypeIndex();
        this.container = (await typeIndex?.findContainer(Recipe, RecipesContainer)) ?? null;

        await this.container?.loadRelation('recipes');

        this.ramen = this.container?.recipes?.find((recipe) => recipe.isRamen()) ?? null;
    }

}

export default facade(new CookbookService());
