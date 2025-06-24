# SlideReveal.js

> **Disclaimer:**\
> This library is not affiliated with the original [jQuery SlideReveal](https://github.com/nnattawat/slidereveal) (author: Natthawat Pongsri, MIT license).\
> SlideReveal.js is a modern, dependency-free, vanilla JS implementation with extended functionality for contemporary frontend projects.

> **Special thanks to the original author:**\
> Huge thanks to [Natthawat Pongsri](https://github.com/nnattawat) for the idea and the original jQuery implementation.\
> The motivation for this rewrite was the move away from jQuery and the need for a universal, lightweight solution.

---

## Overview

**SlideReveal.js** is a lightweight, flexible, and dependency-free JavaScript class for creating responsive side panels (drawers/slide menus).\
It supports overlays, push-body effects, filters, keyboard accessibility, and full customization through callbacks and options.

> Browser support: Edge 12+, Chrome 45+, Firefox 44+, Safari 10+, IE — not supported
---

## Features

- Left or right sliding panel (`position: 'left' | 'right'`)
- Any width: px, %, vw, rem, em (`width: 320 | '80vw' | '70%' | ...`)
- Overlay with configurable color and opacity
- Push body effect (moves content) or overlays content
- Content filter (e.g., blur, grayscale) when open
- Close on the outside click (without an overlay)
- ARIA accessibility support
- Callbacks: onInit, onOpen, onClose, onEscape
- No external dependencies (no jQuery!)

---

## Installation

### 1. Via NPM (recommended)

```bash
npm install slidereveal-js
```

Then import in your code:

```js
import SlideReveal from 'slidereveal-js';
```

### 2. Manual Download

- Download [`slidereveal.min.js`](./dist/slidereveal.min.js)
- Add to your project and include via `<script src="slidereveal.min.js"></script>` if not using modules

---

## Quick Start

### 1. Add HTML

```html
<button class="toggle-button">Open Menu</button>
<div id="panel">
  <h2>My Menu</h2>
  <ul>
    <li>Item 1</li>
    <li>Item 2</li>
  </ul>
</div>
```

### 2. Initialize SlideReveal

```js
const menu = new Slidereveal('#panel', {
    position: 'right',
    width: 320,               // Supports '70vw', '80%', '300', etc.
    pushBody: true,
    overlay: true,
    overlayColor: 'rgba(25,25,25,0.3)',
    filter: true,
    trigger: '.toggle-button',    // CSS selector for open/close trigger
    closeOnOutsideClick: true,
    speed: 400,
    ariaLabel: 'Side Menu',
    onInit: () => console.log('Initialized!'),
    onOpen: () => console.log('Panel opened!'),
    onClose: () => console.log('Panel closed!'),
    onEscape: () => console.log('Closed by Escape')
});
```

### ⚠️ Important: About the `selector` Option

> **Warning:**
>The behavior of the selector option in SlideReveal depends on your page layout.
>
> - If you use a wrapper element selector (for example, #wrapper), only the content inside that container will be pushed or filtered.
> - If you use body as the selector, SlideReveal will wrap all content inside <body> (except the panel and overlay) into a wrapper to apply push/filter effects to the whole page.
>
>Mixing different layouts and selectors may affect the appearance and behavior of your panel.

#### Examples
Case 1: Selector is a wrapper container
``` html
<!-- selector: #wrapper -->
<body>
  <div id="wrapper">
    <header>
      <button class="toggle-panel">Trigger</button>
    </header>
    <article>
      Any content here!
    </article>
  </div>
  <div id="panel">
    <h2>Menu</h2>
    <ul>
      <li>Item 1</li>
      <li>Item 2</li>
    </ul>
  </div>
  <script>
    const menu = new SlideReveal('#panel', {
      selector: '#wrapper'
    });
  </script>
</body>

```
Case 2: Selector is body
``` html
<!-- selector: body -->
<body>
  <header>
    <button class="toggle-panel">Trigger</button>
  </header>
  <article>
    Body content here!
  </article>
  <div id="panel">
    <h2>Menu</h2>
    <ul>
      <li>Item 1</li>
      <li>Item 2</li>
    </ul>
  </div>
  <script>
    const menu = new SlideReveal('#panel', {
      selector: 'body'
    });
  </script>
</body>
```

> **Best Practice:**
> 
>Match your selector option to the actual main container of your content. 
> 
>If your content is already inside a container (like #wrapper), use that selector. If not, use 'body' (default), but be aware that SlideReveal will wrap all body content except the panel and overlay.

---

## Options

| Option                | Type               | Description                                             | Default             |
|-----------------------|--------------------|---------------------------------------------------------|---------------------|
| `width`               | Number/String      | Panel width (`px`, `%`, `vw`, `rem`, etc.)              | `300`               |
| `position`            | String             | `'left'` or `'right'`                                   | `'right'`           |
| `pushBody`            | Boolean            | Pushes body content instead of overlaying               | `false`             |
| `overlay`             | Boolean            | Shows overlay under the panel                           | `true`              |
| `overlayColor`        | String             | Overlay color (CSS value)                               | `'rgba(0,0,0,0.3)'` |
| `filter`              | Boolean            | Applies CSS filter to page content (blur, etc)          | `false`             |
| `filterStyle`         | String             | CSS filter value (e.g., `'blur(2px)'`)                  | `'blur(2px)'`       |
| `closeOnOutsideClick` | Boolean            | Closes panel when clicking outside (only if no overlay) | `false`             |
| `selector`            | String             | Selector for affected content (normally `'body'`)       | `'body'`            |
| `trigger`             | String/HTMLElement | Selector or element for open/close trigger              | `null`              |
| `speed`               | Number             | Animation duration in ms                                | `400`               |
| `autoEscape`          | Boolean            | Closes panel with Escape key                            | `true`              |
| `zIndex`              | Number             | zIndex for panel (default) and body (default - 1)       | `1050`              |
| `ariaLabel`           | String             | ARIA label for accessibility                            | `'Menu'`            |
| `onInit`              | Function           | Callback after panel initialization                     | `null`              |
| `onOpen`              | Function           | Callback after panel opens                              | `null`              |
| `onClose`             | Function           | Callback after panel closes                             | `null`              |
| `onEscape`            | Function           | Callback after closing by Escape                        | `null`              |

---

## API

| Method      | Description                         |
| ----------- | ----------------------------------- |
| `open()`    | Open the panel                      |
| `close()`   | Close the panel                     |
| `toggle()`  | Toggle the panel open/closed        |
| `destroy()` | Remove all handlers and DOM changes |

---


## Example: CSS (optional)

Minimal CSS (if you want to further style or animate):

```css
/* Example: style the overlay */
.slidereveal-overlay {
  transition: opacity 0.3s;
  /* You may override overlayColor via JS option */
}

/* Panel content styling (if needed) */
.panel-content {
  box-sizing: border-box;
  /* Add your custom styles */
}
```

Most styling is handled by JS inline styles; extra CSS is optional.

---

## License

MIT — free for personal and commercial use.

---

## Author

- [Mykhailo Kulyk](https://github.com/technoquill)
- Inspired by [Natthawat Pongsri](https://github.com/nnattawat) (original jQuery SlideReveal)

---

