// Renders the shared SVG diagrams to static files for the website.
import { diagramFor } from '../../geo-kids/js/diagrams.js';
import { writeFileSync, mkdirSync } from 'fs';
const out = new URL('../assets/diagrams/', import.meta.url);
mkdirSync(out, { recursive: true });
const map = { layers: 'g-diameter', plates: 'g-plate', volcano: 'g-eruption', strata: 'g-stratum', fold: 'g-folding', fault: 'g-faulting', seismograph: 'g-seismograph', timescale: 'g-geological-timescale', lattice: 'g-crystal', shelf: 'g-continental-shelf', root: 'g-mountain-root', rift: 'g-rift' };
for (const [name, id] of Object.entries(map)) writeFileSync(new URL(name + '.svg', out), diagramFor(id));
console.log('diagrams:', Object.keys(map).length);
