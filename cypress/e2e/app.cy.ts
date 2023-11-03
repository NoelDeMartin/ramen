import { cssPodUrl } from '@aerogel/cypress';

describe('App', () => {

    beforeEach(() => {
        cy.resetSolid();
        cy.visit('/');
    });

    it('Logs in', () => {
        // Arrange
        cy.see('Log in with Solid');

        // Act
        cy.ariaInput('Login url').clear().type(`${cssPodUrl()}{enter}`);
        cy.cssLogin();

        // Assert
        cy.see('Are you ready to cook?');
    });

    it('Logs in with invalid url', () => {
        // Act
        cy.ariaInput('Login url').clear().type('notavalidurl{enter}');

        // Assert
        cy.see('Login failed');
    });

});
