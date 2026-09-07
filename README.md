# UIBuilder

Tiny TSX runtime for building **real DOM nodes**.

UIBuilder is deliberately not a framework. There is no virtual DOM, reconciliation, reactive state, hooks, component lifecycle, scheduler, renderer, or DOM mounting API. TSX is just pleasant syntax for creating DOM.

```tsx
const view = (
  <main>
    <h1>Hello</h1>
    <button onclick={() => console.log("clicked")}>Save</button>
  </main>
)

document.body.append(view)
```

## Philosophy

The browser already has a UI tree and APIs for inserting, replacing and removing it: the DOM.

UIBuilder keeps the original project's useful idea and removes the historical machinery around it:

- TSX creates actual DOM nodes immediately.
- Function components are ordinary functions.
- Strings and numbers become text nodes, so interpolation is safe by default.
- Events use DOM-native names such as `onclick` and `oninput`.
- DOM properties are assigned directly when possible.
- `data-*`, `aria-*`, SVG, fragments, arrays and callback refs work naturally.
- DOM insertion and redraws use native APIs such as `append`, `replaceChildren` and `replaceWith`.

## Install

```sh
npm install @jdlanglois/uibuilder
```

Configure TypeScript to use UIBuilder's automatic JSX runtime:

```json
{
  "compilerOptions": {
    "jsx": "react-jsx",
    "jsxImportSource": "@jdlanglois/uibuilder"
  }
}
```

No `createElement` import is required.

## Components

Components are just functions returning DOM:

```tsx
type User = {
  id: number
  name: string
}

function UserRow({ user }: { user: User }) {
  return (
    <li>
      <strong>{user.name}</strong>
      <button onclick={() => edit(user.id)}>Edit</button>
    </li>
  )
}

const row = <UserRow user={{ id: 1, name: "Ada" }} />
```

There are no component instances and no component lifecycle.

## Children and fragments

Arrays are flattened recursively. `null`, `undefined` and booleans render nothing.

```tsx
const list = (
  <ul>
    {users.map(user => <UserRow user={user} />)}
  </ul>
)

const pair = (
  <>
    <button>Previous</button>
    <button>Next</button>
  </>
)
```

Fragments are real `DocumentFragment` objects.

## DOM-native props

UIBuilder intentionally follows the platform rather than React conventions.

```tsx
const input = (
  <input
    class="search"
    value="hello"
    disabled={false}
    aria-label="Search"
    data-kind="query"
    oninput={event => {
      console.log(event.currentTarget.value)
    }}
  />
)
```

Use `class`, `for`, `onclick`, `oninput`, etc.

A callback `ref` gives direct access to the node:

```tsx
let input: HTMLInputElement

const view = <input ref={element => { input = element }} />
```

## Updating the DOM

UIBuilder stops after creating DOM nodes. Use the platform directly.

Replace a screen:

```tsx
const app = document.querySelector("#app")!

app.replaceChildren(<Companies />)
```

Replace one subtree:

```tsx
document
  .querySelector("#company-list")!
  .replaceWith(<CompanyList companies={companies} />)
```

Append something:

```tsx
document.body.append(<Toast message="Saved" />)
```

No UIBuilder abstraction is needed for operations the DOM already expresses clearly.

## Safety

Interpolated values are inserted with `document.createTextNode`, not parsed as HTML:

```tsx
const userInput = "<img src=x onerror=alert(1)>"

const view = <p>{userInput}</p>
```

The value above is displayed as text.

UIBuilder does not provide a special raw-HTML escape hatch. If you explicitly assign `innerHTML`, you are using the DOM API directly and are responsible for sanitizing that HTML.

## API

The public API is intentionally small:

```ts
jsx
jsxs
Fragment
append
toNode
```

Most applications should only use TSX. The runtime exports exist primarily to support the JSX transform and composition.

## Development

```sh
npm install
npm test
npm run typecheck
npm run build
```

The build is plain TypeScript. Vitest + happy-dom cover DOM behavior. No Gulp, Visual Studio project, committed build output, or framework-specific tooling.

## License

MIT. This project is a modern rewrite of the original UIBuilder by wisercoder; the original copyright notice is preserved in [LICENSE](./LICENSE).
