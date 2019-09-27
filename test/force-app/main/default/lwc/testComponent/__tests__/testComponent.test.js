// @ts-ignore
import { createElement } from "lwc"
import { TestUtils, Simulate } from "@tigerface/lwc-test-utils"

import TestComponent from "c/testComponent"

jest.mock("c/datatablePopover")

// hide console warnings from LWC about manually
// setting value of inputs via input.value.
// eslint-disable-next-line no-console
console.warn = jest.fn()

// shared test constants
const TEST = ""

function setupTest() {
  // create element
  const element = createElement("c-test-component", {
    is: Component
  })

  // set elem props
  element.prop = TEST

  // add elem to body
  document.body.appendChild(element)

  // event listener mocks
  const testEventListener = jest.fn()

  // add event listener mocks
  element.addEventListener("test", testEventListener)

  return {
    element,
    testEventListener
  }
}

describe("c-test-component", () => {
  afterEach(() => {
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild)
    }

    jest.clearAllMocks()
  })

  it("", () => {})
})
