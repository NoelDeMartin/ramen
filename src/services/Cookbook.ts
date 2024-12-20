import { facade, tap } from '@noeldemartin/utils';
import { Metadata, setExperimentalFlags, usingExperimentalActivityPods } from 'soukai-solid';
import { Solid } from '@aerogel/plugin-solid';

import junsRamen from '@/assets/json/juns-ramen.json';
import Recipe from '@/models/Recipe';
import RecipeInstructionsStep from '@/models/RecipeInstructionsStep';
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
        const container = await RecipesContainer.at(url).create({ name: 'Cookbook' });

        await this.initializeContainer(container);
        await container.register(typeIndex.url, Recipe);
    }

    public async learnRamen(): Promise<void> {
        if (!this.container) {
            return;
        }

        if (usingExperimentalActivityPods()) {
            await this.learnRamenInActivityPods();

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

        if (Solid.user?.usesActivityPods) {
            await this.enableActivityPods();
        }

        if (Solid.isLoggedIn()) {
            await this.loadModels();
        }
    }

    protected async initializeContainer(container: RecipesContainer): Promise<void> {
        this.container = container;

        await this.container.loadRelation('recipes');

        if (usingExperimentalActivityPods() && this.container) {
            Metadata.collection = this.container.url;
            RecipeInstructionsStep.collection = this.container.url;
        }
    }

    protected async loadModels(): Promise<void> {
        const typeIndexes = await Promise.all([Solid.findPublicTypeIndex(), Solid.findPrivateTypeIndex()]);
        const containers = await Promise.all(
            typeIndexes.map((typeIndex) => typeIndex?.findContainer(Recipe, RecipesContainer)),
        );
        const container = containers.find((model) => !!model) ?? null;

        container && (await this.initializeContainer(container));

        this.ramen = this.container?.recipes?.find((recipe) => recipe.isRamen()) ?? null;
    }

    protected async enableActivityPods(): Promise<void> {
        setExperimentalFlags({ activityPods: true });

        Recipe.replaceRdfPrefixes({ 'https://schema.org/': 'http://schema.org/' });
        RecipeInstructionsStep.replaceRdfPrefixes({ 'https://schema.org/': 'http://schema.org/' });
    }

    protected async learnRamenInActivityPods(): Promise<void> {
        const { instructions, ...attributes } = junsRamen;
        const ramen = new Recipe(attributes);

        await Promise.all(
            instructions.map((text, index) => {
                return ramen.relatedInstructions.create({ position: index + 1, text });
            }),
        );

        await this.container?.relatedRecipes.save(ramen);
        await ramen.metadata.save();

        this.ramen = ramen;
    }

}

export default facade(CookbookService);
