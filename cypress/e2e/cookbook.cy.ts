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
        cy.see(`Your recipes are stored in ${cssPodUrl('/cookbook/')}`, { srOnly: true });

        cy.get('@createCookbook').its('response.statusCode').should('eq', 201);
        cy.get('@createTypeIndex').its('response.statusCode').should('eq', 201);

        cy.fixtureWithReplacements('register-cookbook.sparql', { cookbookId: '#[[.*]]' }).then((sparql) => {
            cy.get('@registerCookbook').its('request.body').should('be.sparql', sparql);
        });
    });

    it('Teaches Ramen', () => {
        // Arrange
        cy.intercept('PATCH', cssPodUrl('/cookbook/juns-ramen')).as('learnRamen');

        cy.createSolidDocument('/settings/privateTypeIndex', 'privateTypeIndex.ttl');
        cy.updateSolidDocument('/settings/privateTypeIndex', 'register-cookbook.sparql', { cookbookId: '#cookbook' });
        cy.updateSolidDocument('/profile/card', 'register-type-index.sparql');
        cy.createSolidContainer('/cookbook/', 'Cookbook');

        cy.ariaInput('Login url').clear().type(`${cssUrl()}{enter}`);
        cy.cssLogin();

        // Act
        cy.see('You don\'t know how to make Ramen');
        cy.press('Teach me');

        // Assert
        cy.see('You know how to make Ramen!');
        cy.see(`Your Ramen recipe is at ${cssPodUrl('/cookbook/juns-ramen#it')}`);

        cy.get('@learnRamen').its('response.statusCode').should('eq', 201);
        cy.get('@learnRamen').its('request.body').should('include', 'Jun\'s Ramen');
        cy.get('@learnRamen').its('request.body').should('include', '500g Boston Butt Pork');
        cy.get('@learnRamen').its('request.body').should('include', 'Itadakimasu!');
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
        cy.see(`Your recipes are stored in ${cssPodUrl('/cookbook/')}`, { srOnly: true });
    });

    it('Finds existing Ramen', () => {
        // Arrange
        cy.createSolidDocument('/settings/privateTypeIndex', 'privateTypeIndex.ttl');
        cy.updateSolidDocument('/settings/privateTypeIndex', 'register-cookbook.sparql', { cookbookId: '#cookbook' });
        cy.updateSolidDocument('/profile/card', 'register-type-index.sparql');
        cy.createSolidContainer('/cookbook/', 'Cookbook');
        cy.createSolidDocument('/cookbook/ramen', 'ramen.ttl');

        // Act
        cy.ariaInput('Login url').clear().type(`${cssUrl()}{enter}`);
        cy.cssLogin();

        // Assert
        cy.see('You know how to make Ramen!');
        cy.see(`Your Ramen recipe is at ${cssPodUrl('/cookbook/ramen#it')}`);
    });

});
