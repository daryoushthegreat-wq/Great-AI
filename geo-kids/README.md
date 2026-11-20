# Earth Explorers

An offline geology app based on the book *The Earth*. It has two levels, chosen on the start screen:

- **Explorer (ages 5 to 10):** pages 4 to 19, 2 units, 8 lessons, spoken instructions, letter tracing and a pet dinosaur.
- **Geologist (ages 12 and up):** the whole book, pages 4 to 32, 4 units, 15 lessons, 126 terms with fuller definitions, labelled diagrams, and "Science today" notes where the 1980s book is out of date.

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

## What is inside (Explorer level)

- 2 units and 8 lessons. Each lesson shows its book pages. Lessons open in order.
- Five games in every lesson: Word Cards, Listen and Find, Match, True or False, and Trace.
- Words the child gets wrong come back more often, and old words come back in new lessons.
- Stars, a pet dinosaur that grows, and calm music with a volume control.
- All instructions are spoken. The app uses English voices that are installed on the device. It does not use online voices.
- No ads, no outside links, no data collection. Progress is saved only in this browser.

## What is inside (Geologist level)

- Five games in every lesson: Study Cards, Definitions, Fill the Gap, True or False (with explanations), and Sort and Order.
- Wrong answers come back in the same game and more often in later lessons.
- Stars raise a geologist rank. Finishing a lesson adds a rock or mineral to the specimen collection.
- Progress is stored separately from the Explorer level.

## Files

- `js/data.js` holds the units, lessons, words, definitions and facts. Edit this file to change the content.
- `js/letters.js` holds the stroke order for tracing lowercase letters.
- `js/data-pro.js` holds the Geologist level content: terms, facts, sentences and sort tasks.
- `js/diagrams.js` holds the labelled diagrams and specimen pictures for the Geologist level.
- `js/icons.js` holds the pictures. They are hand-drawn SVG and do not copy the book's photos.
