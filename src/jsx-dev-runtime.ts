import { Fragment, jsx } from "./jsx-runtime.js"

export { Fragment }

export function jsxDEV(
  type: Parameters<typeof jsx>[0],
  props: Parameters<typeof jsx>[1],
  key?: string | number,
  _isStaticChildren?: boolean,
  _source?: unknown,
  _self?: unknown
): Node {
  return jsx(type, props, key)
}
