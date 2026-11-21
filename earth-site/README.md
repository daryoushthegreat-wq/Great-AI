# Reading the Earth

A static website that introduces geology to adult readers. It has 15 short chapters, a 126-term glossary, NASA photographs and labelled diagrams.

The chapter topics follow a classic geology picture book. The text and diagrams are original, and the site does not reproduce that book's text or images. Facts are updated to current science, and "Science today" notes point out where older textbooks are out of date.

## Publish

The site is plain HTML and CSS with no scripts. It has no tracking, cookies or external fonts. Upload the folder (without `tools/`) to any static host: GitHub Pages, Netlify, Cloudflare Pages, or ordinary web hosting. The entry page is `index.html`.

## Edit and rebuild

- Text, captions, quiz questions and sources are in `tools/content.py`.
- Glossary definitions come from `../geo-kids/js/data-pro.js`.
- Diagrams come from `../geo-kids/js/diagrams.js`.

```bash
node tools/diagrams.mjs                       # render diagrams to assets/diagrams/
python3 tools/build.py <folder with NASA originals and meta.json>
```

`tools/photo-meta.json` records the NASA ID, title, credit and download URL of every photograph. The build only needs the original files to make new image sizes. The resized images are already in `assets/img/`.

## Image rights

All photographs are from the NASA Image and Video Library (images.nasa.gov). NASA material is generally not subject to copyright in the United States, and NASA must be credited as the source. Some satellite images are joint products: keep the partner names in the credit lines, as `credits.html` does. Do not suggest that NASA endorses the site.
