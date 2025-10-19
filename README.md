# Snaplet

**Snaplet** is a lightweight, modular UI widget system for the web. It allows developers and non-technical users to integrate interactive components (Snaplets) into any web application easily. Components can include product grids, counters, tables, countdowns, color boxes, and more.

Snaplets are hosted independently from your applications and are loaded dynamically using the Snaplet Engine.

---

## Table of Contents

1. [Overview](#overview)
2. [Features](#features)
3. [Architecture](#architecture)
4. [Getting Started](#getting-started)
5. [Usage](#usage)
6. [Advanced Configuration](#advanced-configuration)
7. [Best Practices](#best-practices)
8. [License](#license)

---

## Overview

Snaplet enables **modular, reusable web components** that can be:

- Hosted centrally and used across multiple applications.
- Integrated without rebuilding the main application.
- Updated independently from your main app.
- Rendered inside a Shadow DOM to avoid style and script conflicts.

---

## Features

- **Modular Components:** Each Snaplet is independent and encapsulated.
- **Dynamic Loading:** JS, CSS, and HTML templates are loaded on-demand.
- **Shadow DOM Encapsulation:** Prevents conflicts with your app’s existing styles or scripts.
- **Easy Configuration:** Define component behavior using JSON.
- **Error Handling:** On-screen and console reporting for easier debugging.
- **Lazy Loading:** Optional delayed loading of Snaplets.
- **Multiple Hosts:** Components can be served from GitHub Pages, GitLab Pages, Cloudflare, or any static host.

---

## Architecture
```
snaplet-engine/ # Core loader
└─ snaplet-loader.js # Loads Snaplets dynamically
snaplet-components/ # Optional, separate repo
├─ counter/
│ ├─ script.js
│ ├─ style.css
│ └─ template.html
├─ product-grid/
│ ├─ script.js
│ ├─ style.css
│ └─ template.html
└─ ...
snaplet-demo/ # Demo applications
└─ index.html
```


**Snaplet Loader Responsibilities:**

1. Attach Shadow DOM for isolation.
2. Parse `<script type="application/json">` inside `<snap-let>` for configuration.
3. Load external CSS, HTML template, and JS module.
4. Render component inside its Shadow DOM.
5. Display errors visually and log them to the console.

---

## Getting Started

### 1. Include the Snaplet Engine

```html
<script src="https://yourhost.com/snaplet-engine/snaplet-loader.js"></script>
```

2. Add a Snaplet
```html
<snap-let>
  <script type="application/json">
  {
    "name": "counter",
    "entry": "https://yourhost.com/counter/script.js",
    "css": "https://yourhost.com/counter/style.css",
    "label": "Clicks:",
    "buttonText": "Add One"
  }
  </script>
</snap-let>

```
- name: Snaplet name
- entry: URL to JS logic
- css: Optional CSS URL
- html: Optional HTML template URL
- Other config keys depend on the component (e.g., products, targetDate)


## Usage Examples
### counter
```html
<snap-let>
  <script type="application/json">
  {
    "name": "counter",
    "entry": "https://yourhost.com/counter/script.js",
    "css": "https://yourhost.com/counter/style.css",
    "label": "Clicks:",
    "buttonText": "Add One"
  }
  </script>
</snap-let>

```

### Product Grid
```html
<snap-let>
  <script type="application/json">
  {
    "name": "product-grid",
    "entry": "https://yourhost.com/product-grid/script.js",
    "css": "https://yourhost.com/product-grid/style.css",
    "html": "https://yourhost.com/product-grid/template.html",
    "products": [
      {"name":"Widget A","price":19.99,"image":"https://picsum.photos/200?1"},
      {"name":"Widget B","price":29.99,"image":"https://picsum.photos/200?2"}
    ],
    "buttonText": "Add to Cart"
  }
  </script>
</snap-let>

```




### Countdown
```html
<snap-let>
  <script type="application/json">
  {
    "name": "countdown",
    "entry": "https://yourhost.com/countdown/script.js",
    "targetDate": "2025-12-31T23:59:59Z",
    "label": "Countdown to New Year:"
  }
  </script>
</snap-let>

```


## Advanced Configuration
- Lazy Loading
```json
"lazy": true
```

- Debug mode
```json
"debug": true
```


- Versioning
```json
"version": "3.2"
```



## Best Practices
Always serve Snaplets over HTTPS to avoid mixed content errors.
- Use Shadow DOM styles for safe encapsulation.
- Host Snaplet engine and components separately for flexibility.
- Include version numbers in component URLs to prevent breaking changes.
- Test Snaplets in multiple browsers to ensure consistent behavior.

License
- Snaplet is open source. Choose a license that suits your needs:
- GPLv3 – Strong copyleft, ensures derivatives are also open source.
- Apache 2.0 – Permissive, allows commercial usage while keeping attribution.
- MIT – Highly permissive, minimal restrictions.

Summary
Snaplet provides:
- Modular, reusable web components
- Safe Shadow DOM encapsulation
- Dynamic loading of JS, CSS, and HTML
- Flexible hosting and easy integration
- Debugging and error reporting

Snaplets help teams rapidly deploy interactive UI components without the overhead of rebuilding or redeploying the main application.


For more examples, visit the demo: [https://codearchiste.github.io/snaplet-demo/](https://codearchiste.github.io/snaplet-demo/)


