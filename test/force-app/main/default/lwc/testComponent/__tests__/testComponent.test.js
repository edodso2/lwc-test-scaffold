// @ts-ignore
import { createElement } from "lwc"

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
    is: TestComponent
  })

  // set elem props
  element.prop = TEST

  // add elem to body
  document.body.appendChild(element)

  return {
    element
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
