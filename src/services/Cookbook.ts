import { facade, tap } from '@noeldemartin/utils';
import { Solid } from '@aerogel/plugin-solid';

import ramenJson from '@/assets/json/ramen.json';
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
        const container = await RecipesContainer.createAt(url, { name: 'Cookbook' });

        await this.initializeContainer(container);
        await container.register(typeIndex.url, Recipe);
        await Solid.refreshUserProfile();
    }

    public async learnRamen(): Promise<void> {
        if (!this.container) {
            return;
        }

        const { instructions, ...attributes } = ramenJson;

        this.ramen = await tap(new Recipe(attributes), async (ramen) => {
            instructions.forEach((text, index) => ramen.relatedInstructions.attach({ position: index + 1, text }));

            await this.container?.relatedRecipes.save(ramen);
        });
    }

    protected async boot(): Promise<void> {
        await Solid.booted;

        if (Solid.isLoggedIn()) {
            await this.loadModels();
        }
    }

    protected async initializeContainer(container: RecipesContainer): Promise<void> {
        this.container = container;

        await this.container.loadRelation('recipes');
    }

    protected async loadModels(): Promise<void> {
        const container = await Solid.findRegisteredContainer(Recipe, RecipesContainer);

        container && (await this.initializeContainer(container));

        this.ramen = this.container?.recipes?.find((recipe) => recipe.isRamen()) ?? null;
    }

}

export default facade(CookbookService);
