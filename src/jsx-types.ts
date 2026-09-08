import type { Child } from "./jsx-runtime.js"

type EventProps<T extends Element> = {
  [K in keyof GlobalEventHandlersEventMap as `on${K}`]?: (
    event: GlobalEventHandlersEventMap[K] & { currentTarget: T }
  ) => unknown
}

type DataProps = {
  [K in `data-${string}`]?: string | number | boolean | null | undefined
}

type AriaProps = {
  [K in `aria-${string}`]?: string | number | boolean | null | undefined
}

type DOMProps<T extends Element> =
  Omit<Partial<T>, keyof GlobalEventHandlers | "children" | "style"> &
  EventProps<T> &
  DataProps &
  AriaProps & {
    class?: string
    for?: string
    style?: string | Partial<CSSStyleDeclaration>
    ref?: (element: T) => void
    children?: Child
  }

type HtmlElements = {
  [K in keyof HTMLElementTagNameMap]: DOMProps<HTMLElementTagNameMap[K]>
}

type SVGProps<T extends SVGElement> =
  EventProps<T> &
  DataProps &
  AriaProps & {
    [attribute: string]: unknown
    class?: string
    style?: string | Partial<CSSStyleDeclaration>
    ref?: (element: T) => void
    children?: Child
  }

type SvgElements = {
  [K in Exclude<keyof SVGElementTagNameMap, keyof HTMLElementTagNameMap>]:
    SVGProps<SVGElementTagNameMap[K]>
}

type CustomElements = {
  [K in `${string}-${string}`]: DOMProps<HTMLElement> & Record<string, unknown>
}

declare global {
  namespace JSX {
    type Element = Node

    interface ElementChildrenAttribute {
      children: {}
    }

    interface IntrinsicAttributes {
      key?: string | number
    }

    type IntrinsicElements = HtmlElements & SvgElements & CustomElements
  }
}

export {}
