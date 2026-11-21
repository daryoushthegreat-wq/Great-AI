"""Builds the static website "Reading the Earth" from content.py.

Usage (from the earth-site folder):
    node tools/diagrams.mjs        # renders the SVG diagrams
    python3 tools/build.py <folder with NASA images and meta.json>

Output: index.html, chapters/*.html, glossary.html, credits.html and assets/ in earth-site/.
"""
import html, json, os, re, shutil, subprocess, sys
from PIL import Image

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
sys.path.insert(0, HERE)
import content as C  # noqa: E402

SRC = sys.argv[1] if len(sys.argv) > 1 else os.path.join(ROOT, 'tools', 'nasa')
IMG = os.path.join(ROOT, 'assets', 'img')
os.makedirs(IMG, exist_ok=True)
os.makedirs(os.path.join(ROOT, 'chapters'), exist_ok=True)
e = lambda s: html.escape(s, quote=True)

# ---------- Images: resize copies of the NASA originals ----------
meta = json.load(open(os.path.join(SRC, 'meta.json')))
SIZES = {}
for nid in C.PHOTOS:
    src = os.path.join(SRC, meta[nid]['file'])
    im = Image.open(src).convert('RGB')
    for suffix, w in (('', 1600), ('-sm', 640)):
        out = os.path.join(IMG, f'{nid}{suffix}.jpg')
        c = im.copy(); c.thumbnail((w, w * 2))
        if not os.path.exists(out):
            c.save(out, quality=80, optimize=True, progressive=True)
        if suffix == '':
            SIZES[nid] = c.size

# ---------- Glossary from the shared term list ----------
gl_json = subprocess.check_output(['node', '-e', "import('" + os.path.join(ROOT, '..', 'geo-kids', 'js', 'data-pro.js').replace('\\', '/') + "').then(m=>console.log(JSON.stringify(Object.values(m.WORDS).map(w=>[w.word,w.def]))))"])
GLOSS = {w: d for w, d in json.loads(gl_json)}
slug = lambda s: re.sub(r'[^a-z0-9]+', '-', s.lower()).strip('-')

CH = {c['slug']: c for c in C.CHAPTERS}
ORDER = [s for _, ss in C.PARTS for s in ss]
PART_OF = {s: (i + 1, name) for i, (name, ss) in enumerate(C.PARTS) for s in ss}

# ---------- Page shell ----------
def page(title, body, depth=0, desc='', full=True):
    up = '../' * depth
    head = f'''<title>{e(title)}</title>
<meta name="description" content="{e(desc or C.SITE_TAGLINE)}">
<meta name="claude:viewport-fit-sides" content="cover">
<link rel="stylesheet" href="{up}assets/style.css">'''
    nav = f'''<header class="site-head"><div class="wrap head-row">
  <a class="brand" href="{up}index.html">{e(C.SITE_TITLE)}</a>
  <nav aria-label="Site"><a href="{up}index.html#contents">Contents</a><a href="{up}glossary.html">Glossary</a><a href="{up}credits.html">Credits</a></nav>
</div></header>'''
    foot = f'''<footer class="site-foot"><div class="wrap">
  <p>{e(C.SITE_TITLE)} is an independent introduction to geology. Photographs courtesy of NASA; NASA does not endorse this site. <a href="{up}credits.html">Image credits and sources</a>.</p>
</div></footer>'''
    inner = f'{nav}\n<main id="main">{body}</main>\n{foot}'
    if not full:
        return head + '\n' + inner
    return f'''<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="referrer" content="no-referrer">
{head}
</head>
<body>
<a class="skip" href="#main">Skip to content</a>
{inner}
</body>
</html>
'''

def photo(nid, caption, depth, hero=False):
    w, h = SIZES[nid]
    t, credit = C.PHOTOS[nid]
    up = '../' * depth
    return f'''<figure class="photo{' hero-photo' if hero else ''}">
  <img src="{up}assets/img/{nid}.jpg" srcset="{up}assets/img/{nid}-sm.jpg 640w, {up}assets/img/{nid}.jpg {w}w" sizes="(max-width: 760px) 100vw, 760px" width="{w}" height="{h}" alt="{e(t)}" {'' if hero else 'loading="lazy"'}>
  <figcaption>{e(caption)} <span class="credit">Photo: <a href="{up}credits.html#{nid}">{e(credit)}</a></span></figcaption>
</figure>'''

def diagram(name, caption, depth):
    svg = open(os.path.join(ROOT, 'assets', 'diagrams', name + '.svg')).read()
    return f'<figure class="diagram">{svg}<figcaption>{e(caption)} <span class="credit">Diagram: {e(C.SITE_TITLE)}</span></figcaption></figure>'

def render_body(text, depth):
    def rep(m):
        kind, rest = m.group(1), m.group(2)
        if kind == 'photo':
            nid, cap = rest.split('|', 1); return photo(nid, cap, depth)
        if kind == 'diagram':
            name, cap = rest.split('|', 1); return diagram(name, cap, depth)
        if kind == 'update':
            return f'<aside class="update"><p class="update-label">Science today</p><p>{rest}</p></aside>'
        return m.group(0)
    return re.sub(r'\[\[(photo|diagram|update):(.+?)\]\]', rep, text, flags=re.S)

# ---------- Chapters ----------
for i, s in enumerate(ORDER):
    c = CH[s]; num = i + 1; pn, pname = PART_OF[s]
    prev = CH[ORDER[i - 1]] if i > 0 else None
    nxt = CH[ORDER[i + 1]] if i + 1 < len(ORDER) else None
    body_src = c['body']; hero = ''
    if c['hero']:
        m = re.search(r'\[\[photo:' + re.escape(c['hero']) + r'\|(.+?)\]\]\n?', body_src)
        cap = m.group(1) if m else C.PHOTOS[c['hero']][0] + '.'
        if m: body_src = body_src.replace(m.group(0), '')  # show it once, at the top
        hero = photo(c['hero'], cap, 1, hero=True)
    terms = ''.join(f'<div><dt><a href="../glossary.html#{slug(t)}">{e(t)}</a></dt><dd>{e(GLOSS[t])}</dd></div>' for t in c['terms'] if t in GLOSS)
    quiz = ''.join(f'<details><summary>{e(q)}</summary><p>{e(a)}</p></details>' for q, a in c['quiz'])
    srcs = ''.join(f'<li><a href="{u}" rel="noopener">{e(t)}</a></li>' for t, u in (C.SOURCES[k] for k in c['sources']))
    body = f'''
<article class="chapter">
  <div class="wrap narrow chapter-head">
    <p class="eyebrow">Part {pn}: {e(pname)} · Chapter {num} of {len(ORDER)}</p>
    <h1>{e(c['title'])}</h1>
    <p class="dek">{e(c['dek'])}</p>
  </div>
  <div class="wrap narrow">{hero}</div>
  <div class="wrap narrow prose">{render_body(body_src, 1)}</div>
  <div class="wrap narrow">
    <section class="box terms" aria-labelledby="t-{s}"><h2 id="t-{s}">Key terms</h2><dl>{terms}</dl></section>
    <section class="box quiz" aria-labelledby="q-{s}"><h2 id="q-{s}">Check your understanding</h2><p class="muted">Think of your answer, then open each question to compare.</p>{quiz}</section>
    <section class="sources" aria-labelledby="s-{s}"><h2 id="s-{s}">Further reading</h2><ul>{srcs}</ul></section>
    <nav class="pager" aria-label="Chapters">
      {f'<a class="prev" href="{prev["slug"]}.html"><span>Previous</span>{e(prev["title"])}</a>' if prev else '<span></span>'}
      {f'<a class="next" href="{nxt["slug"]}.html"><span>Next</span>{e(nxt["title"])}</a>' if nxt else '<a class="next" href="../glossary.html"><span>Next</span>Glossary</a>'}
    </nav>
  </div>
</article>'''
    open(os.path.join(ROOT, 'chapters', s + '.html'), 'w').write(page(f"{c['title']} · {C.SITE_TITLE}", body, 1, c['dek']))

# ---------- Index ----------
def card(s, num):
    c = CH[s]
    if c['hero']:
        pic = f'<img src="assets/img/{c["hero"]}-sm.jpg" alt="" loading="lazy" width="640" height="{int(SIZES[c["hero"]][1] * 640 / SIZES[c["hero"]][0])}">'
    else:
        pic = open(os.path.join(ROOT, 'assets', 'diagrams', 'timescale.svg')).read()
    return f'''<a class="card" href="chapters/{s}.html"><span class="card-pic">{pic}</span>
<span class="card-text"><span class="card-num">Chapter {num}</span><span class="card-title">{e(c['title'])}</span><span class="card-dek">{e(c['dek'])}</span></span></a>'''

n = 0; parts_html = ''
for pi, (pname, ss) in enumerate(C.PARTS):
    cards = ''
    for s in ss:
        n += 1; cards += card(s, n)
    parts_html += f'<section class="part"><h2><span class="part-num">Part {pi + 1}</span> {e(pname)}</h2><div class="cards">{cards}</div></section>'

hero_id = 'as17-148-22727'
w, h = SIZES[hero_id]
index_body = f'''
<section class="cover">
  <div class="wrap cover-grid">
    <div class="cover-text">
      <p class="eyebrow light">An introduction to geology</p>
      <h1>{e(C.SITE_TITLE)}</h1>
      <p class="cover-lede">How our planet was made, what lies beneath our feet, and why continents drift, mountains rise and volcanoes erupt. Fifteen short chapters, written for curious adults and updated with current science.</p>
      <a class="cta" href="chapters/{ORDER[0]}.html">Start reading</a>
    </div>
    <figure class="cover-pic"><img src="assets/img/{hero_id}.jpg" width="{w}" height="{h}" alt="The whole Earth seen from Apollo 17, with Africa, Arabia and Antarctica visible"><figcaption>Earth from Apollo 17, December 1972. <a href="credits.html#{hero_id}">NASA</a></figcaption></figure>
  </div>
</section>
<div class="wrap">
  <section class="about">
    <p>Each chapter takes about five minutes to read. It has photographs from space, diagrams, a list of key terms and a few questions to check your understanding. Where popular older textbooks are now out of date, a <strong>Science today</strong> note gives the current view.</p>
  </section>
  <div id="contents">{parts_html}</div>
</div>'''
open(os.path.join(ROOT, 'index.html'), 'w').write(page(C.SITE_TITLE, index_body, 0))
# Artifact preview variant (no document skeleton).
open(os.path.join(ROOT, 'tools', 'artifact-index.html'), 'w').write(page(C.SITE_TITLE, index_body, 0, full=False))

# ---------- Glossary ----------
used = {t: s for s in ORDER for t in CH[s]['terms']}
letters = {}
for t in sorted(GLOSS, key=lambda x: x.lower()):
    letters.setdefault(t[0].upper(), []).append(t)
gl = ''.join(f'<section class="gl-letter"><h2 id="l-{L}">{L}</h2><dl>' + ''.join(
    f'<div id="{slug(t)}"><dt>{e(t)}</dt><dd>{e(GLOSS[t])}' + (f' <a class="gl-ch" href="chapters/{used[t]}.html">{e(CH[used[t]]["title"])}</a>' if t in used else '') + '</dd></div>'
    for t in ts) + '</dl></section>' for L, ts in letters.items())
jump = ''.join(f'<a href="#l-{L}">{L}</a>' for L in letters)
open(os.path.join(ROOT, 'glossary.html'), 'w').write(page(f'Glossary · {C.SITE_TITLE}', f'''
<div class="wrap narrow page-head"><p class="eyebrow">Reference</p><h1>Glossary</h1><p class="dek">{len(GLOSS)} geology terms used in this guide.</p><nav class="jump" aria-label="Letters">{jump}</nav></div>
<div class="wrap narrow glossary">{gl}</div>''', 0, 'Definitions of the geology terms used in Reading the Earth.'))

# ---------- Credits ----------
rows = ''
for nid, (t, credit) in C.PHOTOS.items():
    rows += f'''<div class="credit-row" id="{nid}"><img src="assets/img/{nid}-sm.jpg" alt="" loading="lazy" width="160" height="{int(SIZES[nid][1] * 160 / SIZES[nid][0])}">
<div><p class="credit-title">{e(t)}</p><p>Credit: {e(credit)}<br>NASA ID: {e(nid)} · <a href="https://images.nasa.gov/details/{e(nid)}" rel="noopener">Original record</a></p></div></div>'''
srcs = ''.join(f'<li><a href="{u}" rel="noopener">{e(t)}</a></li>' for t, u in C.SOURCES.values())
open(os.path.join(ROOT, 'credits.html'), 'w').write(page(f'Credits · {C.SITE_TITLE}', f'''
<div class="wrap narrow page-head"><p class="eyebrow">Reference</p><h1>Credits and sources</h1></div>
<div class="wrap narrow prose">
  <h2>Photographs</h2>
  <p>All photographs come from the NASA Image and Video Library. NASA material is generally not subject to copyright in the United States and may be used for educational purposes, provided NASA is credited as the source. Some satellite images are joint products with the partners named in their credit lines. NASA does not endorse this site or its content.</p>
  <div class="credits">{rows}</div>
  <h2>Diagrams and text</h2>
  <p>The text and diagrams were written and drawn for this site. They are an independent introduction to geology and do not reproduce any published book.</p>
  <h2>Sources and further reading</h2>
  <ul>{srcs}</ul>
</div>''', 0, 'Image credits and sources for Reading the Earth.'))

print('built', len(ORDER), 'chapters,', len(GLOSS), 'glossary terms,', len(C.PHOTOS), 'photos')
