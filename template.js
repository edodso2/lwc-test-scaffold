// @ts-ignore
import { createElement } from 'lwc';
$tigerfaceUtils$

import $componentName$ from 'c/$componentFileName$';

$mockComponentImportsTemplate$

// hide console warnings from LWC about manually
// setting value of inputs via input.value. 
// eslint-disable-next-line no-console
console.warn = jest.fn();

// shared test constants
const TEST = '';

function setupTest() {

  // create element
  const element = createElement('$componentNodeName$', {
    is: Component
  });

  // set elem props
  element.prop = TEST;

  // add elem to body
  document.body.appendChild(element);

  $childElsTemplate$ 
   
  $mockEventListenersTemplate$

  return {
    element,
    $testSetupReturn$
  };
}

describe('$componentNodeName$', () => {

  afterEach(() => {
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }

    jest.clearAllMocks();
  });

  it('', () => {});

});
