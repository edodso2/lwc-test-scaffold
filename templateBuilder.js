const fs = require('fs');
const prettier = require('prettier');
const { snakeToCamelCase, lowerCaseFirstLetter } = require('./utils');

const tigerfaceUtils = `import { TestUtils, Simulate } from '@tigerface/lwc-test-utils';`;

function getChildName(child) {
  const camel = snakeToCamelCase(child);

  if (child.includes('lightning')) {
    return camel;
  } else {
    // remove namespace
    return lowerCaseFirstLetter(camel.slice(1));
  }
}

function buildMockComponentImports(imports) {
  return imports.map(cImport => `jest.mock('${cImport}');`).join('\n');
}

function buildChildrenQueries(children) {
  const childQueries = children.map(child => `\tconst ${getChildName(child)}El = element.shadowRoot.querySelector('${child}');`).join('\n');
  return `// get child elements for assertions\n${childQueries}`;
};

function buildEventListeners(events) {
  const eventListeners = events.map(event => `\tconst ${event}EventListener = jest.fn();`).join('\n');
  const addEventListeners = events.map(event => `\telement.addEventListener('${event}', ${event}EventListener);`).join('\n');

  return `// event listener mocks\n${eventListeners}\n\n\t// add event listener mocks\n${addEventListeners}`;
};

function buildTestSetupReturn(children, events) {
  let childVarNames;
  let eventVarNames;

  if (children.length) {
    childVarNames = children.map(child => `\t\t${getChildName(child)}El`).join(',\n');
  }

  if (events.length) {
    eventVarNames = events.map(event => `\t\t${event}EventListener`).join(',\n');
  }

  if (children.length && !events.length) {
    return `${childVarNames}`;
  } else if (!children.length && events.length) {
    return `${eventVarNames}`;
  } else if (children.length && events.length) {
    return `${childVarNames},\n${eventVarNames}`;
  } else {
    return '';
  }
};

const templateBuilder = (
  componentName,
  componentFileName,
  componentNodeName,
  useTigerfaceUtils,
  children,
  events,
  mockChildComponents,
  childComponentImports
) => {
  let tigerfaceUtilsTpl;
  let mockComponentImportsTemplate;
  let childElsTemplate;
  let mockEventListenersTemplate;
  let testSetupReturn = buildTestSetupReturn(children, events);

  let template = fs.readFileSync(__dirname + '/template.js', 'utf8');

  template = template.replace(/\$componentName\$/g, componentName);
  template = template.replace(/\$componentFileName\$/g, componentFileName);
  template = template.replace(/\$componentNodeName\$/g, componentNodeName);

  if (useTigerfaceUtils) {
    tigerfaceUtilsTpl = tigerfaceUtils;
  } else {
    tigerfaceUtilsTpl = '';
  }

  if (mockChildComponents) {
    mockComponentImportsTemplate = buildMockComponentImports(childComponentImports);
  } else {
    mockComponentImportsTemplate = '';
  }

  if (children.length) {
    childElsTemplate = buildChildrenQueries(children);
  } else {
    childElsTemplate = '';
  }

  if (events.length) {
    mockEventListenersTemplate = buildEventListeners(events);
  } else {
    mockEventListenersTemplate = '';
  }

  template = template.replace(/\$tigerfaceUtils\$/g, tigerfaceUtilsTpl);
  template = template.replace(/\$mockComponentImportsTemplate\$/g, mockComponentImportsTemplate);
  template = template.replace(/\$childElsTemplate\$/g, childElsTemplate);
  template = template.replace(/\$mockEventListenersTemplate\$/g, mockEventListenersTemplate);
  template = template.replace(/\$testSetupReturn\$/g, testSetupReturn);

  template = prettier.format(template, { parser: "babel" });

  return template;
};

module.exports = templateBuilder;
