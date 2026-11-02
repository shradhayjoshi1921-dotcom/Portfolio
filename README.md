# Shradhay — Developer Portfolio

A responsive, single-page portfolio made with semantic HTML, CSS, and vanilla JavaScript. The hero computer and project diagrams are built from HTML, CSS, and SVG—there are no stock photos, generated portraits, fake screenshots, or blank image slots.

## Run locally

Open `index.html`, or serve the repository root:

```sh
python3 -m http.server 4173 --bind 0.0.0.0
```

## Personalize

Edit **`config.js`** for the name, email, LinkedIn, GitHub, Instagram, GitHub username/API, and project repository URLs. Exact project URLs are used when configured; projects without a known repository link go to the configured GitHub profile rather than a guessed URL. An Instagram URL can be added there when available.

The GitHub panel requests public profile counts, repositories, languages, and repository update dates from GitHub's REST API. Values are live when the API is reachable; failures display an explicit status instead of fabricated data. Contributions are not simulated.

## Portfolio visuals and motion

- The hero desktop/editor is a CSS-built illustration with a type-on terminal command, animated caret and syntax highlight, drifting code glyph, floating technology tags, and subtle pointer tilt.
- Project cards use animated system maps for LogicBloom, Campus, and Bubblegum Chat—not screenshots or photo placeholders.
- Scroll reveals, active navigation, responsive menu, cursor glow, and magnetic CTAs respect reduced-motion preferences.

## Contact form

The form validates its fields and opens a prefilled draft in the visitor's email app using the address in `config.js`. It does not submit to a server or store form data.

## Files

- `index.html` — page structure, metadata, content, and CSS-built illustrations
- `style.css` — responsive visual system, workspace/project artwork, and motion
- `script.js` — navigation, interactions, contact form, and live GitHub data
- `config.js` — editable profile/contact/repository configuration
