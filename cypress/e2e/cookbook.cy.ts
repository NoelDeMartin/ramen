import { podUrl, webId } from '@aerogel/cypress';

describe('Cookbook', () => {

    beforeEach(() => {
        cy.solidReset();
        cy.visit('/');
    });

    it('Creates containers', () => {
        // Arrange
        cy.intercept('PUT', podUrl('/cookbook/')).as('createCookbook');
        cy.intercept('PUT', podUrl('/settings/privateTypeIndex')).as('createTypeIndex');
        cy.intercept('PATCH', podUrl('/settings/privateTypeIndex')).as('registerCookbook');

        cy.ariaInput('Login url').clear().type(`${webId()}{enter}`);
        cy.solidLogin();

        // Act
        cy.see('You don\'t have a place to store your recipes');
        cy.matchImageSnapshot();
        cy.press('Create cookbook');

        // Assert
        cy.see('Creating cookbook...');
        cy.see(`Your recipes are stored in ${podUrl('/cookbook/')}`, { srOnly: true });

        cy.get('@createCookbook').its('response.statusCode').should('eq', 201);
        cy.get('@createTypeIndex').its('response.statusCode').should('eq', 201);

        cy.fixtureWithReplacements('register-cookbook.sparql', { cookbookId: '#[[.*]]' }).then((sparql) => {
            cy.get('@registerCookbook').its('request.body').should('be.sparql', sparql);
        });
    });

    it('Teaches Ramen', () => {
        // Arrange
        cy.intercept('PATCH', podUrl('/cookbook/juns-ramen')).as('learnRamen');

        cy.solidCreateDocument('/settings/privateTypeIndex', 'privateTypeIndex.ttl');
        cy.solidUpdateDocument('/settings/privateTypeIndex', 'register-cookbook.sparql', { cookbookId: '#cookbook' });
        cy.solidUpdateDocument('/profile/card', 'register-type-index.sparql');
        cy.solidCreateContainer('/cookbook/', 'Cookbook');

        cy.ariaInput('Login url').clear().type(`${webId()}{enter}`);
        cy.solidLogin();

        // Act
        cy.see('You don\'t know how to make Ramen');
        cy.matchImageSnapshot();
        cy.press('Teach me');

        // Assert
        cy.see('You know how to make Ramen!');
        cy.see(`Your Ramen recipe is at ${podUrl('/cookbook/juns-ramen#it')}`);

        cy.get('@learnRamen').its('response.statusCode').should('eq', 201);
        cy.fixture('learn-ramen.sparql').then((sparql) => {
            cy.get('@learnRamen').its('request.body').should('be.sparql', sparql);
        });
    });

    it('Finds an existing container', () => {
        // Arrange
        cy.solidCreateDocument('/settings/privateTypeIndex', 'privateTypeIndex.ttl');
        cy.solidUpdateDocument('/settings/privateTypeIndex', 'register-cookbook.sparql', { cookbookId: '#cookbook' });
        cy.solidUpdateDocument('/profile/card', 'register-type-index.sparql');
        cy.solidCreateContainer('/cookbook/', 'Cookbook');

        // Act
        cy.ariaInput('Login url').clear().type(`${webId()}{enter}`);
        cy.solidLogin();

        // Assert
        cy.see(`Your recipes are stored in ${podUrl('/cookbook/')}`, { srOnly: true });
    });

    it('Finds existing Ramen', () => {
        // Arrange
        cy.solidCreateDocument('/settings/privateTypeIndex', 'privateTypeIndex.ttl');
        cy.solidUpdateDocument('/settings/privateTypeIndex', 'register-cookbook.sparql', { cookbookId: '#cookbook' });
        cy.solidUpdateDocument('/profile/card', 'register-type-index.sparql');
        cy.solidCreateContainer('/cookbook/', 'Cookbook');
        cy.solidCreateDocument('/cookbook/ramen', 'ramen.ttl');

        // Act
        cy.ariaInput('Login url').clear().type(`${webId()}{enter}`);
        cy.solidLogin();

        // Assert
        cy.see('You know how to make Ramen!');
        cy.see(`Your Ramen recipe is at ${podUrl('/cookbook/ramen#it')}`);
        cy.matchImageSnapshot();
    });

});
