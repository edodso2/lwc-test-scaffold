#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const inquirer = require('inquirer');

const templateBuilder = require('./templateBuilder');
const { camelToSnakeCase, snakeToCamelCase, lowerCaseFirstLetter } = require('./utils');

function getProjectRoot() {
  let sfdxProjectConfig = fs.readFileSync('./sfdx-project.json', 'utf8');
  sfdxProjectConfig = JSON.parse(sfdxProjectConfig);

  return './' + sfdxProjectConfig.packageDirectories[0].path + '/main/default/lwc';
}

function convertChildToImportPath(nodeName) {
  // convert to camel case
  nodeName = snakeToCamelCase(nodeName);

  // convert to import
  namespace = nodeName[0];
  nodeName = nodeName.slice(1);
  nodeName = lowerCaseFirstLetter(nodeName);
  return namespace + '/' + nodeName;
}

const listValidators = {
  events: 'Input must be a comma seperated list of event names. Ex: select, change, save',
  children: 'Input must be a comma seperated list of child names. Ex: lightning-button, c-custom-menu, lightning-datatable'
};

function validateList(input, type) {
  let valid = true;

  input.forEach((item) => {
    const containsSpaces = item.indexOf(' ') > -1;

    if (containsSpaces) {
      valid = false;
    }
  });

  if (valid) {
    return true;
  } else {
    return listValidators[type];
  }
}

function filterList(input) {
  // convert empty input to empty array
  if (!input) {
    return [];
  }

  return input.split(',').map(item => item.trim());
}

const questions = [
  {
    type: 'input',
    name: 'componentName',
    message: 'What is the component class name?',
  },
  {
    type: 'confirm',
    name: 'useTigerfaceUtils',
    message: 'Include @tigerface/lwc-test-utils? (must already be installed via NPM)'
  },
  {
    type: 'input',
    name: 'children',
    message: 'Enter child elements needed for assertions: ',
    validate: (input) => validateList(input, 'children'),
    filter: filterList
  },
  {
    type: 'input',
    name: 'events',
    message: 'Enter the event names your component outputs that are needed for assertions: ',
    validate: (input) => validateList(input, 'events'),
    filter: filterList
  },
  {
    type: 'confirm',
    name: 'mockChildComponents',
    message: 'Mock child components?'
  },
];

inquirer
  .prompt(questions)
  .then(answers => {
    const { componentName, useTigerfaceUtils, children, events, mockChildComponents } = answers;

    // get project root from sfdx-package.json
    const lwcRoot = getProjectRoot();

    const componentFileName = lowerCaseFirstLetter(componentName);
    const componentNodeName = 'c-' + camelToSnakeCase(componentName);

    const childComponentRegex = /<([a-z]+(-?[a-z]+)*)/g;

    const filePath = path.join(`${lwcRoot}/${componentFileName}/${componentFileName}.html`);

    const HTML = fs.readFileSync(filePath, 'utf8');

    const childComponentImports = [];

    if (mockChildComponents) {
      do {
        m = childComponentRegex.exec(HTML);

        // don't include lightning components or non custom components
        if (m) {
          const tagName = m[1];
          if (!tagName.includes('lightning') && tagName.includes('-')) {
            const childImport = convertChildToImportPath(tagName);
            childComponentImports.push(childImport);
          }
        }
      } while (m);
    }

    const template = templateBuilder(
      componentName,
      componentFileName,
      componentNodeName,
      useTigerfaceUtils,
      children,
      events,
      mockChildComponents,
      childComponentImports
    );

    const componentDir = lwcRoot + ' + componentFileName';
    const testDir = componentDir + '/__tests__';
  
    if (!fs.existsSync(testDir)) {
      fs.mkdirSync(testDir);
    }
  
    fs.writeFileSync(testDir + '/' + componentFileName + '.test.js', template);
  });