import { PromisedValue, uuid } from '@noeldemartin/utils';
import { Quad } from 'n3';

import RDFStore from '@/utils/RDFStore';

import CookbookModel from '@/models/soukai/Cookbook';
import TypeRegistration from '@/models/soukai/TypeRegistration';

import Auth, { UserProfile } from '@/services/Auth';

class Cookbook {

    private _ready: PromisedValue<void> = new PromisedValue();
    private _model: PromisedValue<CookbookModel> = new PromisedValue();

    public get model(): CookbookModel | null {
        return this._model.value;
    }

    public get ready(): Promise<void> {
        return this._ready;
    }

    public get loaded(): Promise<void> {
        return this._model.then();
    }

    public async start(): Promise<void> {
        await Auth.ready;
        await this.loadModel();

        this._ready.resolve();
    }

    public async create(): Promise<void> {
        if (this.model)
            throw new Error('You already have a cookbook!');

        const profile = await Auth.profile as UserProfile;
        const model = await CookbookModel.at(profile.storageUrls[0]).create<CookbookModel>({ name: 'Cookbook' });

        this._model.resolve(model);

        await this.registerModel(model);
    }

    private async registerModel(model: CookbookModel): Promise<void> {
        const profile = await Auth.profile as UserProfile;
        const typeRegistration = new TypeRegistration({
            forClass: 'https://schema.org/Recipe',
            instanceContainer: model.url,
        });

        typeRegistration.mintUrl(profile.privateTypeIndexUrl, true, uuid());

        await typeRegistration.save(profile.privateTypeIndexUrl);
    }

    private async loadModel(): Promise<void> {
        if (!Auth.isLoggedIn)
            return;

        await this.loadModelFromCookbook();
    }

    private async loadModelFromCookbook(): Promise<void> {
        const url = await this.readCookbookUrl();

        if (!url)
            return;

        const model = await CookbookModel.find<CookbookModel>(url);

        if (model)
            this._model.resolve(model as CookbookModel);
    }

    private async readCookbookUrl(): Promise<string | null> {
        const profile = await Auth.profile as UserProfile;
        const store = await RDFStore.fromUrl(Auth.fetch, profile.privateTypeIndexUrl);
        const cookbookType = store
            .statements(null, 'rdfs:type', 'solid:TypeRegistration')
            .find(
                statement =>
                    store.contains(statement.subject.value, 'solid:forClass', 'schema:Recipe') &&
                    store.contains(statement.subject.value, 'solid:instanceContainer'),
            );

        if (!cookbookType)
            return null;

        const instanceContainerType = store.statement(cookbookType.subject.value, 'solid:instanceContainer') as Quad;

        return instanceContainerType.object.value;
    }

}

export default new Cookbook();
