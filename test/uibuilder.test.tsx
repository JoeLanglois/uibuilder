/** @jsxImportSource ../src */

import { describe, expect, it, vi } from "vitest"

describe("UIBuilder", () => {
  it("creates real DOM nodes from TSX", () => {
    const node = <div class="card"><strong>Hello</strong></div>

    expect(node).toBeInstanceOf(HTMLDivElement)
    expect((node as HTMLDivElement).className).toBe("card")
    expect(node.textContent).toBe("Hello")
  })

  it("renders interpolated text safely", () => {
    const value = '<img src=x onerror="alert(1)">'
    const node = <p>{value}</p> as HTMLParagraphElement

    expect(node.textContent).toBe(value)
    expect(node.querySelector("img")).toBeNull()
  })

  it("attaches DOM-native event handlers", () => {
    const click = vi.fn()
    const button = <button onclick={click}>Save</button> as HTMLButtonElement

    button.click()

    expect(click).toHaveBeenCalledOnce()
  })

  it("supports function components", () => {
    function Greeting({ name }: { name: string }) {
      return <h1>Hello {name}</h1>
    }

    const node = <Greeting name="Ada" />

    expect(node.textContent).toBe("Hello Ada")
  })

  it("supports fragments and arrays", () => {
    const items = ["one", "two"]
    const node = (
      <>
        <span>start</span>
        {items.map(item => <b>{item}</b>)}
      </>
    )

    const host = document.createElement("div")
    host.append(node)

    expect(host.innerHTML).toBe("<span>start</span><b>one</b><b>two</b>")
  })

  it("sets DOM properties and arbitrary attributes", () => {
    const input = (
      <input value="hello" disabled data-id="42" aria-label="Name" />
    ) as HTMLInputElement

    expect(input.value).toBe("hello")
    expect(input.disabled).toBe(true)
    expect(input.dataset.id).toBe("42")
    expect(input.getAttribute("aria-label")).toBe("Name")
  })

  it("supports callback refs", () => {
    let element: HTMLInputElement | undefined

    const input = <input ref={el => { element = el }} />

    expect(element).toBe(input)
  })

  it("creates SVG nodes in the SVG namespace", () => {
    const svg = <svg><circle cx={10} cy={10} r={5} /></svg> as SVGSVGElement

    expect(svg.namespaceURI).toBe("http://www.w3.org/2000/svg")
    expect(svg.firstElementChild?.namespaceURI).toBe("http://www.w3.org/2000/svg")
  })
})
