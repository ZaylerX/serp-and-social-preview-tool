# SERPscope

A small tool to preview how a page will look in Google search results and in a social share card, before you publish it. You type a title, a description, a URL and an image, and the page shows you the result, checks it against a few basic SEO rules, and writes the meta tags for you.

I work in SEO, so this started from something I do by hand every day: counting characters and guessing what will get cut off. It is also my first real JavaScript project, built without any framework.

## What it does

- Google preview with the title, description and URL path, truncated the way a result would be (60 and 155 characters on desktop, 50 and 120 on mobile).
- Social card preview with the image, domain, title and description. If the image URL is missing or broken, a placeholder is shown instead.
- Live character counters with a simple "too short / optimal / too long" label.
- An SEO checklist with five checks: title length, description length, target keyword near the start of the title, target keyword near the start of the description, and a clean lowercase URL. A check only appears once there is something to check.
- Generated meta tags (title, description and Open Graph tags) with a Copy button. Empty fields are skipped and special characters are escaped.
- Desktop and Mobile preview modes.
- Midnight Mode, a dark theme with a smooth transition.

## Built with

HTML, CSS and plain JavaScript.

## Running it

Open `index.html` in a browser. An internet connection is needed for the fonts and the placeholder image.

## How it works

There is a single `state` object that holds everything the user types, plus the current preview mode and theme. Every input and button only updates that object and then calls one `render()` function, which redraws the whole page from the state. Small helper functions do the specific jobs (truncating text, parsing the URL, building the checklist, building the meta tags). Keeping a single source of truth made it much easier to find bugs.

The dark theme uses CSS custom properties: JavaScript only adds or removes a `dark` class on the body, and the colors change from there.

## What I learned

- Keeping state in one place and rendering from it, instead of updating the page in many places.
- Building DOM elements from code
- Escaping characters like quotes and ampersands before putting them in generated HTML.
- CSS variables for theming

## Known limitations

- The character limits are approximate. Google measures width in pixels, not characters, and the Open Graph limits are not officially documented.
- URL validation is basic: it checks that the address can be parsed and that the domain contains a dot.
- The Copy button says "Copied!" even if the browser refuses clipboard access.
- If the image URL is broken, the browser tries to load it again on every keystroke.

## How it was built

I wrote the code myself while learning, with an AI tutor guiding me step by step and helping me debug. It started out as a way to practice for a career change from SEO into web development.

## Credits

- Icons from [Lucide](https://lucide.dev) and [Font Awesome Free](https://fontawesome.com).
- Fonts from Google Fonts: IBM Plex Sans, IBM Plex Mono, Plus Jakarta Sans and Unbounded.
- Placeholder image from blocks.astratic.com.
