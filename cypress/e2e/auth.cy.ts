import { serverUrl, webId } from '@aerogel/cypress';

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
        cy.ariaInput('Login url').clear().type(`${serverUrl()}{enter}`);
        cy.solidLogin();

        // Assert
        cy.see('Alice Cooper');
        cy.see(`Your Web Id is ${webId()}`, { srOnly: true });
    });

    it('Logs in with invalid url', () => {
        // Act
        cy.ariaInput('Login url').clear().type('notavalidurl{enter}');

        // Assert
        cy.see('Login failed');
    });

    it('Logs out', () => {
        // Arrange
        cy.ariaInput('Login url').clear().type(`${serverUrl()}{enter}`);
        cy.solidLogin();

        // Act
        cy.ariaLabel('Log out').click();
        cy.contains('[role="dialog"]', 'Log out from this device?').within(() => {
            cy.press('Log out');
        });

        // Assert
        cy.dontSee('Alice Cooper');
    });

});
