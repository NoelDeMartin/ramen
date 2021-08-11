import { arrayFilter, PromisedValue, uuid } from '@noeldemartin/utils';
import { createPrivateTypeIndex, SolidUserProfile } from '@noeldemartin/solid-utils';

import RDFStore from '@/utils/RDFStore';

import CookbookModel from '@/models/soukai/Cookbook';
import TypeRegistration from '@/models/soukai/TypeRegistration';

import Auth from '@/services/Auth';

class Cookbook {

    private _ready: PromisedValue<void> = new PromisedValue();
    private _model: PromisedValue<CookbookModel> = new PromisedValue();

    public get model(): CookbookModel | null {
        return this._model.value;
    }

    public get ready(): Promise<void> {
        return this._ready;
    }

    public get loaded(): Promise<CookbookModel> {
        return this._model.then();
    }

    public async start(): Promise<void> {
        await Auth.ready;
        await this.loadModel();

        this._ready.resolve();
    }

    public async create(storageUrl: string): Promise<void> {
        if (this.model)
            throw new Error('You already have a cookbook!');

        const model = await CookbookModel.at(storageUrl).create<CookbookModel>({ name: 'Cookbook' });

        this._model.resolve(model);

        await this.registerModel(model);
    }

    private async registerModel(model: CookbookModel): Promise<void> {
        const profile = await Auth.profile as SolidUserProfile;
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
        const urls = await this.readCookbookUrls();

        for (const url of urls) {
            const model = await CookbookModel.find<CookbookModel>(url);

            if (!model)
                continue;

            this._model.resolve(model);
            break;
        }
    }

    private async readCookbookUrls(): Promise<string[]> {
        const profile = await Auth.profile as SolidUserProfile;
        const findCookbooks = async (typeIndexUrl: string) => {
            const store = await RDFStore.fromUrl(Auth.fetch, typeIndexUrl);

            return store
                .statements(null, 'rdfs:type', 'solid:TypeRegistration')
                .filter(
                    statement =>
                        store.contains(statement.subject.value, 'solid:forClass', 'schema:Recipe') &&
                        store.contains(statement.subject.value, 'solid:instanceContainer'),
                )
                .map(
                    typeStatement =>
                        store.statement(typeStatement.subject.value, 'solid:instanceContainer')?.object.value,
                )
                .filter(url => !!url) as string[];
        };

        const typeIndexUrls = arrayFilter([profile.publicTypeIndexUrl, profile.privateTypeIndexUrl]);

        if (typeIndexUrls.length === 0) {
            profile.privateTypeIndexUrl = await createPrivateTypeIndex(profile, Auth.fetch);

            typeIndexUrls.push(profile.privateTypeIndexUrl);
        }

        const urls = await Promise.all(typeIndexUrls.map(url => findCookbooks(url)));

        return urls.flat();
    }

}

export default new Cookbook();
