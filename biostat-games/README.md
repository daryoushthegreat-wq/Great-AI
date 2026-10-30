# Biostat Lab

Offline learning games for *Biostatistics & Epidemiology*, Units 1–2 (book PDF pages 6–31).
Plain HTML/CSS/JS with no build step, no libraries, no network requests, no ads and no tracking.
Progress is stored only in the browser's local storage on the device.

## Run it

```bash
cd biostat-games
python3 -m http.server 8000
```

Open http://localhost:8000. To use it on a phone on the same Wi-Fi, run
`python3 -m http.server 8000 --bind 0.0.0.0` and open `http://<computer-ip>:8000`.

**Offline install:** browsers allow the offline service worker only on `https://` or `localhost`.
On a phone, host the folder over HTTPS (for example GitHub Pages), open it once, then use
"Add to Home Screen" / "Install app". After that it works with no connection.

## Structure

| File | Purpose |
|---|---|
| `js/core.js` | DOM helpers, randomness, local progress storage, quiz runner |
| `js/demos.js` | Animated, interactive explainers (stats lab, bathtub, CI, 2×2 table, screening grid, timelines, randomizer, blinding, sampling, confounding) |
| `js/content.js` | Units, lessons, book page numbers, key terms, explanations, book notes |
| `js/games.js` | The nine games (one learning goal each) |
| `js/main.js` | Home / lesson / game views, unlock order, hash routing |
| `sw.js`, `manifest.webmanifest` | Offline cache and installable app metadata |

A lesson unlocks when every game in the previous lesson has a best score of at least 80%.
"Parent tools" on the home screen can unlock all lessons for previewing or reset progress.
