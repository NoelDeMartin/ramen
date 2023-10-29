import { cssPodUrl } from '@aerogel/cypress';

describe('App', () => {

    beforeEach(() => {
        cy.resetSolid();
        cy.visit('/');
    });

    it('Logs in', () => {
        cy.see('Log in with Solid');
        cy.ariaInput('Login url').type(`${cssPodUrl()}{enter}`);
        cy.cssLogin();
        cy.see('Hello');
    });

});
