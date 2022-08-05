import { arrayFirst, PromisedValue, str } from '@noeldemartin/utils';

import CookbookModel from '@/models/soukai/Cookbook';
import Recipe from '@/models/soukai/Recipe';

import Cookbook from '@/services/Cookbook';

import junsRamen from '@/assets/json/juns-ramen.json';

class Ramen {

    private _model: PromisedValue<Recipe> = new PromisedValue();

    public get model(): Recipe | null {
        return this._model.value;
    }

    public get loaded(): Promise<void> {
        return this._model.then();
    }

    public async start(): Promise<void> {
        await Cookbook.ready;

        Cookbook.model
            ? await this.load()
            : Cookbook.loaded.then(() => this.load());
    }

    public async learnRecipe(): Promise<void> {
        if (!Cookbook.model)
            throw new Error('You don\'t have a cookbook!');

        const ramen = new Recipe(junsRamen);

        for (let index = 0; index < junsRamen.instructions.length; index++) {
            ramen.relatedInstructions.attach({
                position: index + 1,
                text: junsRamen.instructions[index],
            });
        }

        const model = await Cookbook.model.relatedRecipes.save(ramen);

        this._model.resolve(model);
    }

    private async load(): Promise<void> {
        const cookbook = Cookbook.model as CookbookModel;
        const recipes = await cookbook.relatedRecipes.getModels();
        const model = arrayFirst(recipes, recipe => str(recipe.name).toSlug().includes('ramen'));

        if (model)
            this._model.resolve(model);
    }

}

export default new Ramen();
