import "./jsx-types.js"

export type Child =
  | Node
  | string
  | number
  | boolean
  | null
  | undefined
  | readonly Child[]

export type Component<Props = Record<string, never>> = (
  props: Props & { children?: Child }
) => Child

export const Fragment = Symbol("UIBuilder.Fragment")

type ElementType = string | Component<any> | typeof Fragment
type Props = Record<string, unknown> & { children?: Child }

export function jsx(
  type: ElementType,
  props: Props | null,
  _key?: string | number
): Node {
  const values = props ?? {}
  const { children, ...rest } = values

  if (type === Fragment) {
    return toNode(children)
  }

  if (typeof type === "function") {
    return toNode(type({ ...rest, children }))
  }

  const element = createElement(type)

  for (const [name, value] of Object.entries(rest)) {
    setProp(element, name, value)
  }

  append(element, children)
  return element
}

export const jsxs = jsx

export function append(parent: Node, child: Child): void {
  if (
    child == null ||
    child === false ||
    child === true
  ) {
    return
  }

  if (Array.isArray(child)) {
    for (const value of child) append(parent, value)
    return
  }

  if (child instanceof Node) {
    parent.appendChild(child)
    return
  }

  parent.appendChild(document.createTextNode(String(child)))
}

export function toNode(child: Child): Node {
  if (child instanceof Node) return child

  const fragment = document.createDocumentFragment()
  append(fragment, child)
  return fragment
}

function createElement(tag: string): Element {
  return SVG_TAGS.has(tag)
    ? document.createElementNS("http://www.w3.org/2000/svg", tag)
    : document.createElement(tag)
}

function setProp(element: Element, name: string, value: unknown): void {
  if (name === "ref") {
    if (typeof value === "function") value(element)
    return
  }

  if (value == null) return

  if (name === "class") {
    if (value !== false) element.setAttribute("class", String(value))
    return
  }

  if (name === "for") {
    if (value !== false) element.setAttribute("for", String(value))
    return
  }

  if (name === "style") {
    if (typeof value === "string") {
      element.setAttribute("style", value)
    } else if (typeof value === "object") {
      Object.assign((element as HTMLElement).style, value)
    }
    return
  }

  if (name.startsWith("on") && typeof value === "function") {
    element.addEventListener(name.slice(2), value as EventListener)
    return
  }

  if (name in element) {
    try {
      ;(element as unknown as Record<string, unknown>)[name] = value
      return
    } catch {
      // Some DOM properties are readonly. Fall through to attributes.
    }
  }

  if (value === false) {
    element.removeAttribute(name)
  } else if (value === true) {
    element.setAttribute(name, "")
  } else {
    element.setAttribute(name, String(value))
  }
}

const SVG_TAGS = new Set([
  "svg",
  "animate",
  "animateMotion",
  "animateTransform",
  "circle",
  "clipPath",
  "defs",
  "desc",
  "ellipse",
  "feBlend",
  "feColorMatrix",
  "feComponentTransfer",
  "feComposite",
  "feConvolveMatrix",
  "feDiffuseLighting",
  "feDisplacementMap",
  "feDistantLight",
  "feDropShadow",
  "feFlood",
  "feFuncA",
  "feFuncB",
  "feFuncG",
  "feFuncR",
  "feGaussianBlur",
  "feImage",
  "feMerge",
  "feMergeNode",
  "feMorphology",
  "feOffset",
  "fePointLight",
  "feSpecularLighting",
  "feSpotLight",
  "feTile",
  "feTurbulence",
  "filter",
  "foreignObject",
  "g",
  "image",
  "line",
  "linearGradient",
  "marker",
  "mask",
  "metadata",
  "mpath",
  "path",
  "pattern",
  "polygon",
  "polyline",
  "radialGradient",
  "rect",
  "set",
  "stop",
  "switch",
  "symbol",
  "text",
  "textPath",
  "tspan",
  "use",
  "view"
])
