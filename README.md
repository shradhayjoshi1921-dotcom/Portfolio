# Shradhay — Developer Portfolio

A responsive, single-page portfolio built with semantic HTML, modern CSS, and vanilla JavaScript. It is dependency-free and can be hosted as a static site.

## Run locally

Open `index.html` directly, or start a local static server from the repository root:

```sh
python3 -m http.server 4173 --bind 0.0.0.0
```

Then visit `http://localhost:4173`.

## Personalize

Edit **`config.js`** to update Shradhay's name, email, LinkedIn, GitHub, Instagram, GitHub username/API, and project repository URLs. A configured project repository opens directly; when an individual repository URL is blank, its button is clearly labeled and links only to the configured GitHub profile. No repository URLs are guessed.

The public GitHub panel reads profile counts and recent repositories from the unauthenticated GitHub REST API when available. The contribution graph is intentionally an empty placeholder—no contribution totals or activity are invented. If the API is unreachable or rate-limited, the page shows a clear fallback state.

## Replace the blank image assets

- `assets/images/profile.jpg` — replace with a personal portrait. The hero container is intentionally blank; no generated, stock, or avatar image is included. Update its `alt` text in `index.html` when you add your photo.
- `assets/images/projects/logicbloom.jpg`
- `assets/images/projects/campus.jpg`
- `assets/images/projects/bubblegum-chat.jpg`

Replace each project image with a real screenshot at the same path (or update the corresponding `src` in `index.html`). The current files are small, solid-color blank placeholders.

## Contact form

The form validates its fields and opens a prefilled draft in the visitor's email application using the address in `config.js`. It does not submit to a server or store form data.

## Files

- `index.html` — page structure, metadata, content, and replaceable image paths
- `style.css` — responsive visual system, animations, reduced-motion support
- `script.js` — navigation, reveal/micro-interactions, contact form, and live GitHub data
- `config.js` — editable profile/contact/repository configuration
