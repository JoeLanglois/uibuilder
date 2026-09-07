import "./jsx-types.js"

export { append, Fragment, jsx, jsxs, toNode } from "./jsx-runtime.js"
export type { Child, Component } from "./jsx-runtime.js"

import { toNode, type Child } from "./jsx-runtime.js"

export function mount(target: Element, child: Child): Element {
  target.replaceChildren(toNode(child))
  return target
}

export function replace(target: Element, child: Child): void {
  target.replaceWith(toNode(child))
}
