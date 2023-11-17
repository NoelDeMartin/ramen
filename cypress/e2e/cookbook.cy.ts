import { cssPodUrl, cssUrl } from '@aerogel/cypress';

describe('Cookbook', () => {

    beforeEach(() => {
        cy.solidReset();
        cy.visit('/');
    });

    it('Creates containers', () => {
        // Arrange
        cy.intercept('PUT', cssPodUrl('/cookbook/')).as('createCookbook');
        cy.intercept('PUT', cssPodUrl('/settings/privateTypeIndex')).as('createTypeIndex');
        cy.intercept('PATCH', cssPodUrl('/settings/privateTypeIndex')).as('registerCookbook');

        cy.ariaInput('Login url').clear().type(`${cssUrl()}{enter}`);
        cy.cssLogin();

        // Act
        cy.see('You don\'t have a place to store your recipes');
        cy.press('Create cookbook');

        // Assert
        cy.see('Creating cookbook...');
        cy.see('Found some recipes on Cookbook');

        cy.get('@createCookbook').its('response.statusCode').should('eq', 201);
        cy.get('@createTypeIndex').its('response.statusCode').should('eq', 201);

        cy.fixtureWithReplacements('register-cookbook.sparql', { cookbookId: '#[[.*]]' }).then((sparql) => {
            cy.get('@registerCookbook').its('request.body').should('be.sparql', sparql);
        });
    });

    it('Finds an existing container', () => {
        // Arrange
        cy.createSolidDocument('/settings/privateTypeIndex', 'privateTypeIndex.ttl');
        cy.updateSolidDocument('/settings/privateTypeIndex', 'register-cookbook.sparql', { cookbookId: '#cookbook' });
        cy.updateSolidDocument('/profile/card', 'register-type-index.sparql');
        cy.createSolidContainer('/cookbook/', 'Cookbook');

        // Act
        cy.ariaInput('Login url').clear().type(`${cssUrl()}{enter}`);
        cy.cssLogin();

        // Assert
        cy.see('Found some recipes on Cookbook');
    });

});
