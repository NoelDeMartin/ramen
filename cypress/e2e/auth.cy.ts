import { cssPodWebId, cssUrl } from '@aerogel/cypress';

describe('Auth', () => {

    beforeEach(() => {
        cy.solidReset();
        cy.visit('/');
    });

    it('Logs in', () => {
        // Arrange
        cy.see('Log in with Solid');
        cy.matchImageSnapshot();

        // Act
        cy.ariaInput('Login url').clear().type(`${cssUrl()}{enter}`);
        cy.cssLogin();

        // Assert
        cy.see('Alice Cooper');
        cy.see(`Your Web Id is ${cssPodWebId()}`, { srOnly: true });
    });

    it('Logs in with invalid url', () => {
        // Act
        cy.ariaInput('Login url').clear().type('notavalidurl{enter}');

        // Assert
        cy.see('Login failed');
    });

    it('Logs out', () => {
        // Arrange
        cy.ariaInput('Login url').clear().type(`${cssUrl()}{enter}`);
        cy.cssLogin();

        // Act
        cy.ariaLabel('Log out').click();
        cy.contains('[role="dialog"]', 'Are you sure you want to log out?').within(() => {
            cy.press('Ok');
        });

        // Assert
        cy.dontSee('Alice Cooper');
    });

});
