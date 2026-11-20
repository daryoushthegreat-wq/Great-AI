# Earth Explorers

An offline geology game for children aged 5 to 10. It is based on the book *The Earth*, pages 4 to 19 (Units 1 and 2).
This is the English version. The Arabic version comes next.

## How to run it on a computer

You need [Node.js](https://nodejs.org) or Python. From this folder, run one of these:

```bash
npx serve .              # then open the address it prints
python3 -m http.server   # then open http://localhost:8000
```

Open the app once while the server is running. After that it works without internet.
In Chrome or Edge you can also install it as an app (the install icon in the address bar).
Opening `index.html` by double-clicking it will not work, because the offline part needs a local address.

## What is inside

- 2 units and 8 lessons. Each lesson shows its book pages. Lessons open in order.
- Five games in every lesson: Word Cards, Listen and Find, Match, True or False, and Trace.
- Words the child gets wrong come back more often, and old words come back in new lessons.
- Stars, a pet dinosaur that grows, and calm music with a volume control.
- All instructions are spoken. The app uses English voices that are installed on the device. It does not use online voices.
- No ads, no outside links, no data collection. Progress is saved only in this browser.

## Files

- `js/data.js` holds the units, lessons, words, definitions and facts. Edit this file to change the content.
- `js/letters.js` holds the stroke order for tracing lowercase letters.
- `js/icons.js` holds the pictures. They are hand-drawn SVG and do not copy the book's photos.
