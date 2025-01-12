/*******************************************************************************
 * Copyright (c) 2021 Obeo.
 * This program and the accompanying materials
 * are made available under the erms of the Eclipse Public License v2.0
 * which accompanies this distribution, and is available at
 * https://www.eclipse.org/legal/epl-2.0/
 *
 * SPDX-License-Identifier: EPL-2.0
 *
 * Contributors:
 *     Obeo - initial API and implementation
 *******************************************************************************/
describe('/projects/:projectId/edit - Object Context Menu', () => {
  beforeEach(() => {
    cy.deleteAllProjects();
    cy.createProject('Cypress Project').then((res) => {
      const projectId = res.body.data.createProject.project.id;
      const robot_flow_id = 'c26b6086-b444-3ee6-b8cd-9a4fde5956a7';
      cy.createDocument(projectId, robot_flow_id, 'robot').then((res) => {
        cy.visit(`/projects/${projectId}/edit`);
      });
    });
  });

  it('can rename an object', () => {
    cy.getByTestId('robot').dblclick();

    cy.getByTestId('Robot-more').click();
    cy.getByTestId('treeitem-contextmenu').findByTestId('rename-tree-item').click();

    cy.getByTestId('treeitem-contextmenu').should('not.exist');

    cy.getByTestId('name-edit').type('NewRobot{enter}');
    cy.getByTestId('Robot').should('not.exist');
    cy.getByTestId('NewRobot').should('exist');
  });

  it('cannot rename an object with no label feature', () => {
    cy.getByTestId('robot').dblclick();
    cy.getByTestId('Robot').dblclick();
    cy.getByTestId('Wifi').dblclick();

    cy.getByTestId('standard-more').click();

    cy.getByTestId('treeitem-contextmenu').findByTestId('rename-tree-item').should('not.exist');
  });

  it('can delete an object', () => {
    cy.getByTestId('robot').dblclick();

    cy.getByTestId('Robot-more').click();
    cy.getByTestId('treeitem-contextmenu').findByTestId('delete').click();

    cy.getByTestId('Robot').should('not.exist');
  });

  it('can open the new object modal', () => {
    cy.getByTestId('robot').dblclick();
    cy.getByTestId('Robot-more').click();

    cy.getByTestId('treeitem-contextmenu').findByTestId('new-object').click();

    cy.get('.MuiDialog-container').should('be.visible');
  });

  it('can create a new object by clicking on the create button', () => {
    cy.getByTestId('robot').dblclick();
    cy.getByTestId('Robot-more').click();

    cy.getByTestId('treeitem-contextmenu').findByTestId('new-object').click();

    cy.getByTestId('childCreationDescription').click();
    cy.get('[data-value="Power Input"]').click();
    cy.getByTestId('create-object').click();

    cy.getByTestId('explorer').contains('PowerInput');
  });

  it('can select the created child object', () => {
    cy.getByTestId('robot').dblclick();
    cy.getByTestId('Robot-more').click();

    cy.getByTestId('treeitem-contextmenu').findByTestId('new-object').click();

    cy.getByTestId('childCreationDescription').click();
    cy.get('[data-value="Power Input"]').click();
    cy.getByTestId('create-object').click();

    cy.getByTestId('explorer').contains('PowerInput');
    cy.getByTestId('selected').contains('PowerInput');
  });

  it('can open the new representation modal', () => {
    cy.getByTestId('robot').dblclick();
    cy.getByTestId('Robot-more').click();

    cy.getByTestId('treeitem-contextmenu').findByTestId('new-representation').click();

    cy.get('.MuiDialog-container').should('be.visible');
  });

  it('can create a new representation by typing enter', () => {
    cy.getByTestId('robot').dblclick();
    cy.getByTestId('Robot-more').click();

    cy.getByTestId('treeitem-contextmenu').findByTestId('new-representation').click();
    cy.getByTestId('name').clear();
    cy.getByTestId('name').type('diagram{enter}');
    cy.getByTestId('create-representation').click();

    cy.get('.MuiDialog-container').should('not.exist');

    cy.getByTestId('explorer').contains('diagram');
  });

  it('can create a new representation by clicking on the create button', () => {
    cy.getByTestId('robot').dblclick();
    cy.getByTestId('Robot-more').click();

    cy.getByTestId('treeitem-contextmenu').findByTestId('new-representation').click();
    cy.getByTestId('name').clear();
    cy.getByTestId('name').type('diagram');
    cy.getByTestId('create-representation').click();

    cy.get('.MuiDialog-container').should('not.exist');

    cy.getByTestId('explorer').contains('diagram');
  });

  it('can expand the node in which the representation is created and open the representation', () => {
    cy.getByTestId('robot').dblclick();
    cy.getByTestId('Robot-more').click();

    cy.getByTestId('treeitem-contextmenu').findByTestId('new-representation').click();
    cy.getByTestId('name').clear();
    cy.getByTestId('name').type('Topography');
    cy.getByTestId('create-representation').click();

    cy.get('.MuiDialog-container').should('not.exist');

    cy.getByTestId('explorer').contains('Topography');
    cy.getByTestId('representation-tab-Topography').should('exist');
  });

  it('contains a default name for the representation', () => {
    cy.getByTestId('robot').dblclick();
    cy.getByTestId('Robot-more').click();

    cy.getByTestId('treeitem-contextmenu').findByTestId('new-representation').click();
    cy.getByTestId('representationDescription').click();
    cy.getByTestId('Topography with auto layout').click();
    cy.getByTestId('name').should('have.value', 'Topography with auto layout');

    cy.getByTestId('representationDescription').click();
    cy.getByTestId('Topography').click();
    cy.getByTestId('name').should('have.value', 'Topography');

    cy.getByTestId('name').clear().type('newName');
    cy.getByTestId('name').should('have.value', 'newName');

    cy.getByTestId('representationDescription').click();
    cy.getByTestId('Topography with auto layout').click();
    cy.getByTestId('name').should('have.value', 'newName');
  });
});
