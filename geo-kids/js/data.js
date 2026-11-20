// Course content taken from the book "The Earth" (geology picture book), pages 4–19.
// Unit and lesson grouping is ours: the book itself has topics, not units.
// Every word has a short definition written for ages 5–10.
// Every fact comes from the text on the lesson's pages.

export const UNITS = [
  {
    id: 'u1',
    title: 'Unit 1: Our Planet and What Is Inside',
    pages: '4–11',
    lessons: ['l1', 'l2', 'l3', 'l4'],
  },
  {
    id: 'u2',
    title: 'Unit 2: Rocks, Crystals and Plates',
    pages: '12–19',
    lessons: ['l5', 'l6', 'l7', 'l8'],
  },
];

export const LESSONS = {
  l1: {
    title: 'Our Earth',
    pages: '4–5',
    words: [
      ['earth', 'Earth is the planet we live on. From space it looks blue.'],
      ['rock', 'Rock is the hard stuff that the earth is made of.'],
      ['mountain', 'A mountain is very high land. Moving rock pushes mountains up.'],
      ['desert', 'A desert is a very dry land with lots of sand.'],
      ['jungle', 'A jungle is a hot, wet forest full of trees.'],
      ['ocean', 'An ocean is a huge area of salty water.'],
      ['sand', 'Sand is tiny bits of rock, worn away by wind and water.'],
    ],
    facts: [
      ['From space, the earth looks blue.', true],
      ['The inside of the earth is cold.', false, 'No! The inside of the earth is very, very hot.'],
      ['Wind and rain can wear rock away to make sand.', true],
      ['A mountain grows in one day.', false, 'No! Mountains take millions of years to grow.'],
    ],
  },
  l2: {
    title: 'How the Earth Was Formed',
    pages: '6–7',
    words: [
      ['sun', 'The sun is a star. It gives us light and heat.'],
      ['star', 'A star is a giant ball of very hot gas that shines.'],
      ['planet', 'A planet is a big ball that goes around the sun. Earth is a planet.'],
      ['comet', 'A comet is a ball of ice and dust that flies through space.'],
      ['crater', 'A crater is a round hole made when a big rock crashes into the ground.'],
      ['atmosphere', 'The atmosphere is the blanket of air all around the earth.'],
    ],
    facts: [
      ['The sun began as a huge cloud of gas and dust.', true],
      ['The earth is older than the sun.', false, 'No! The sun was born first. Then the planets were made.'],
      ['Long ago, big rocks crashed into the earth and made craters.', true],
      ['The earth has no air around it.', false, 'No! The earth has an atmosphere. It is a blanket of air.'],
      ['Oceans cover more than half of the earth.', true],
    ],
  },
  l3: {
    title: 'Inside the Earth',
    pages: '8–9',
    words: [
      ['crust', 'The crust is the thin, cool outside skin of the earth. We live on the crust.'],
      ['mantle', 'The mantle is a thick layer of very hot rock under the crust. It moves very slowly.'],
      ['core', 'The core is the centre of the earth. It is the hottest part.'],
      ['iron', 'Iron is a strong, heavy metal. The core is made mostly of iron.'],
      ['solid', 'Solid means hard and keeps its shape, like a rock or an ice cube.'],
      ['liquid', 'Liquid means it can flow and pour, like water.'],
    ],
    facts: [
      ['The crust is the thin outside layer of the earth.', true],
      ['The core is made of ice.', false, 'No! The core is very hot. It is made mostly of iron.'],
      ['The outer core is liquid, and the inner core is solid.', true],
      ['The mantle is the thinnest layer.', false, 'No! The crust is the thinnest layer. The mantle is very thick.'],
    ],
  },
  l4: {
    title: 'The Outer Layers',
    pages: '10–11',
    words: [
      ['layer', 'A layer is one sheet lying on top of another, like the parts of a sandwich.'],
      ['volcano', 'A volcano is a mountain where hot, melted rock comes out from inside the earth.'],
      ['earthquake', 'An earthquake is when the ground shakes because rocks crack and move.'],
      ['mine', 'A mine is a deep hole that people dig to get rocks and metals.'],
      ['mud', 'Mud is wet, soft dirt. After a long time, layers of mud can turn into rock.'],
      ['erosion', 'Erosion is when wind, ice and water slowly wear rock away.'],
      ['geology', 'Geology is the study of rocks and the story of the earth.'],
    ],
    facts: [
      ['No one has ever been to the centre of the earth.', true],
      ['Layers of sand and mud can harden and become new rock.', true],
      ['Wind and rain can never change rocks.', false, 'No! Wind, ice and water wear rocks away. This is called erosion.'],
      ['The rock under the oceans is thicker than the rock under the land.', false, 'No! The rocky shell is thicker under the land and thinner under the oceans.'],
      ['Rocks can tell us the story of the earth.', true],
    ],
  },
  l5: {
    title: 'The World of Crystals',
    pages: '12–13',
    words: [
      ['crystal', 'A crystal is a solid with a neat pattern inside. Many crystals have flat sides and sharp edges.'],
      ['mineral', 'A mineral is a natural solid made of crystals. Rocks are made of minerals.'],
      ['quartz', 'Quartz is a very common mineral. Its crystals look clear or milky.'],
      ['granite', 'Granite is a hard, speckled rock. It is a mix of minerals, like quartz.'],
      ['chalk', 'Chalk is a soft, white rock. It is made almost all of one mineral, called calcite.'],
      ['sandstone', 'Sandstone is rock made of grains of sand that were pressed and stuck together.'],
      ['microscope', 'A microscope is a tool that makes tiny things look big.'],
    ],
    facts: [
      ['Rocks are made of minerals.', true],
      ['Some crystals are more than ten metres long.', true],
      ['Chalk is made of many different minerals.', false, 'No! Chalk is made almost all of one mineral, called calcite.'],
      ['The sun is made mostly of rock.', false, 'No! The sun is made mostly of a light gas called hydrogen.'],
      ['Sandstone is made of grains of sand.', true],
    ],
  },
  l6: {
    title: 'Rocks from Inside the Earth',
    pages: '14–15',
    words: [
      ['igneous rock', 'Igneous rock was once melted. Then it cooled down and became hard. Granite is an igneous rock.'],
      ['metamorphic rock', 'Metamorphic rock is rock that was changed by great heat and squashing, without melting.'],
      ['pressure', 'Pressure is a strong push or squeeze.'],
      ['fold', 'A fold is a bend in layers of rock. Pushing from the sides makes folds.'],
      ['fault', 'A fault is a crack where rocks slip past each other.'],
      ['garnet', 'Garnet is a mineral with dark red crystals. They grow inside squashed rock.'],
    ],
    facts: [
      ['Pushing from the sides can bend rock into folds.', true],
      ['When rocks crack and slip, it can cause an earthquake.', true],
      ['Igneous rock was never melted.', false, 'No! Igneous rock was once melted. Then it cooled down.'],
      ['Rocks change very fast, in a few minutes.', false, 'No! Rocks change very slowly, over a very long time.'],
    ],
  },
  l7: {
    title: 'Plates',
    pages: '16–17',
    words: [
      ['plate', 'A plate is a giant piece of the earth’s rocky shell. The plates fit together like a jigsaw.'],
      ['jigsaw', 'A jigsaw is a puzzle made of pieces that fit together.'],
      ['magma', 'Magma is melted rock deep under the ground.'],
      ['continent', 'A continent is a very big piece of land, like Africa or Asia.'],
      ['ocean trench', 'An ocean trench is a very deep valley under the sea. There, one plate slides under another.'],
      ['mid-ocean ridge', 'A mid-ocean ridge is a line of mountains under the sea. New rock is made there.'],
    ],
    facts: [
      ['The earth’s shell is cracked like an eggshell.', true],
      ['Plates move very fast, like a car.', false, 'No! Plates move very slowly, only a few centimetres a year.'],
      ['When two plates push together, one can slide under the other.', true],
      ['The Himalaya mountains were made when two plates pushed together.', true],
    ],
  },
  l8: {
    title: 'Drifting Continents',
    pages: '18–19',
    words: [
      ['map', 'A map is a picture of places, as if you look down from the sky.'],
      ['raft', 'A raft is a flat boat that floats. Continents ride on plates like rafts.'],
      ['drift', 'To drift means to move very slowly, carried along.'],
      ['fossil', 'A fossil is what is left of a very old plant or animal, kept inside rock.'],
      ['Red Sea', 'The Red Sea lies between Africa and Arabia. It is slowly getting wider.'],
      ['Arabia', 'Arabia is a big piece of land. It is slowly moving away from Africa.'],
    ],
    facts: [
      ['Long ago, the continents were joined together as one big island.', true],
      ['The Red Sea is slowly getting wider.', true],
      ['Continents always stay in the same place.', false, 'No! Continents drift very, very slowly.'],
      ['The same fossils are found on both sides of the Atlantic Ocean.', true],
    ],
  },
};

// Flatten into lookup tables.
export const WORDS = {};
export const FACTS = {};
export const LESSON_ORDER = UNITS.flatMap((u) => u.lessons);

for (const lid of LESSON_ORDER) {
  const L = LESSONS[lid];
  L.id = lid;
  L.wordIds = L.words.map(([w, def]) => {
    const id = w.toLowerCase().replace(/[^a-z]+/g, '-');
    WORDS[id] = { id, word: w, def, lesson: lid };
    return id;
  });
  L.factIds = L.facts.map(([text, truth, fix], i) => {
    const id = `${lid}-f${i + 1}`;
    FACTS[id] = { id, text, truth, fix: fix || '', lesson: lid };
    return id;
  });
}

export const GAMES = [
  { id: 'cards', name: 'Word Cards', say: 'Word cards. Look, listen, and learn new words.' },
  { id: 'listen', name: 'Listen and Find', say: 'Listen and find. Tap the right picture.' },
  { id: 'match', name: 'Match', say: 'Match. Find the picture and its word.' },
  { id: 'truefalse', name: 'True or False', say: 'True or false. Listen, then tap yes or no.' },
  { id: 'trace', name: 'Trace', say: 'Trace. Draw the letter with your finger.' },
];
