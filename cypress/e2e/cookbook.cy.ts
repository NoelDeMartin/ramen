import { cssUrl } from '@aerogel/cypress';

describe('Auth', () => {

    beforeEach(() => {
        cy.solidReset();
        cy.visit('/');
    });

    it('Works without an existing container', () => {
        // Act
        cy.ariaInput('Login url').clear().type(`${cssUrl()}{enter}`);
        cy.cssLogin();

        // Assert
        cy.see('You don\'t have a place to store your recipes');
    });

    it('Finds an existing container', () => {
        // Arrange
        cy.createSolidDocument('/settings/privateTypeIndex', 'privateTypeIndex.ttl');
        cy.updateSolidDocument('/settings/privateTypeIndex', 'register-cookbook.sparql');
        cy.updateSolidDocument('/profile/card', 'register-type-index.sparql');
        cy.createSolidContainer('/recipes/', 'Cookbook');

        // Act
        cy.ariaInput('Login url').clear().type(`${cssUrl()}{enter}`);
        cy.cssLogin();

        // Assert
        cy.see('Found some recipes on Cookbook');
    });

});
