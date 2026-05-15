# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

Marketing/informational website for **St. Therese of the Child Jesus Catholic Hospital, Nomayos (Cameroon)**. Based on a third-party HTML/SCSS theme ("Chemlabs" by 7oorof, see header comment in [assets/js/main.js](assets/js/main.js)).

Two parallel versions of the site live in this repo. Be sure you know which one a change is supposed to land in before editing:

- **Root (`/`)** — a pre-built **Vue SPA**. Only the built artifacts ship here: [index.html](index.html) loads the bundled [assets/index-13Tf3oaq.js](assets/index-13Tf3oaq.js) and [assets/index-E147co0K.css](assets/index-E147co0K.css), and [.htaccess](.htaccess) rewrites all non-file requests to `/index.html` for client-side routing. **The Vue source code, `package.json`, and build config are not in this repo** — only the compiled output. Edits to the SPA require the upstream source project; you cannot rebuild it from here.
- **[legacy/](legacy/)** — the original multi-page static site, one `.html` per route (`about-us.html`, `contact-us.html`, `tests-*.html`, `blog.html`, `team.html`, etc.). Self-contained with its own [legacy/assets/](legacy/assets/) tree (duplicated SCSS, JS, images, PHP). This is the editable HTML version.

`assets/` at the root and `legacy/assets/` are **separate copies** of the theme assets — changes to one do not propagate. The root `assets/` is what the Vue build was originally compiled against; the live SPA does not load files from there at runtime (the bundle is self-contained).

## Working in the SCSS

Both `assets/scss/` and `legacy/assets/scss/` follow the same structure:

- `global/` — variables, mixins, base
- `layout/` — non-component primitives (typography, buttons, forms, alerts, pagination, animation, ...)
- `module/` — page-section components (header, footer, banners, services, team, blog, shop, ...)
- `style.scss` is the entry that `@import`s every partial in order; see [assets/scss/style.scss](assets/scss/style.scss).

Compiled output is `assets/css/style.css` (with `style.css.map`). There is no build script committed — use any Sass compiler (e.g. `sass assets/scss/style.scss assets/css/style.css`). `assets/css/libraries.css` is a vendor bundle and should not be hand-edited.

## Legacy JS

The legacy site is jQuery-based. All interactive behaviors (preloader, mobile menu, sticky navbar, carousel, video popup, counters, portfolio filter, contact-form validation, ...) live in [legacy/assets/js/main.js](legacy/assets/js/main.js) with vendor plugins in `plugins.js`. The table of contents at the top of `main.js` is the index — add new behaviors as a new numbered section and keep that TOC in sync.

## Contact form

[assets/php/contact.php](assets/php/contact.php) (and the legacy copy) posts via PHPMailer (vendored in `assets/php/PHPMailer/`). The `$recipientEmail` / `$recipientName` at the top are placeholders (`your@email`) and need to be set before the form will actually deliver. Note the existing file also has bugs — `$senderEmail` is referenced but never read from `$_POST`, and `$mail->MsgHTML($body)` uses an undefined `$body`. Fix these alongside any contact-form work.

## Deployment

Designed for an Apache host (the `.htaccess` rewrite rule is what makes the Vue SPA's deep links work). PHP support is required for the contact form. The empty `dist/` and `www/` directories at the root appear to be deploy-target stubs.
