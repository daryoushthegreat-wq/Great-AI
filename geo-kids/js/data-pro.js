// Geologist level (ages 12+). Whole book, pages 4–32, grouped by us into 4 units and 15 lessons.
// words:  [term, definition, note?]   note starting "Today:" = where current science differs from the 1980s book.
// facts:  [statement, true/false, explanation]
// cloze:  [sentence with ___, answer term]   (answer must be one of this lesson's terms)
// task:   { type: 'order', prompt, items (in correct order) } or { type: 'sort', prompt, bins: { name: [items] } }
// specimen: the collection reward for finishing the lesson.

export const UNITS = [
  { id: 'p1', title: 'Unit 1: Planet Earth', pages: '4–11', lessons: ['g1', 'g2', 'g3', 'g4'] },
  { id: 'p2', title: 'Unit 2: Minerals, Rocks and Plates', pages: '12–19', lessons: ['g5', 'g6', 'g7', 'g8'] },
  { id: 'p3', title: 'Unit 3: The Changing Surface', pages: '20–27', lessons: ['g9', 'g10', 'g11', 'g12'] },
  { id: 'p4', title: 'Unit 4: Quakes, Treasures and Time', pages: '28–32', lessons: ['g13', 'g14', 'g15'] },
];

export const LESSONS = {
  g1: {
    title: 'Our Earth', pages: '4–5', specimen: 'basalt',
    words: [
      ['molten', 'Melted by intense heat. Molten rock is liquid rock.'],
      ['weathering', 'The breaking down of rock at the surface by wind, rain, ice and living things.', 'In the book, weathered volcanic rock on St Vincent became the soil a jungle grows in.'],
      ['erosion', 'The wearing away and carrying off of rock and soil by wind, water and ice.', 'The rock of the Algerian desert is being eroded into a sea of sand.'],
      ['soil', 'The loose top layer of the land, made of weathered rock mixed with the remains of plants and animals.'],
      ['coastline', 'The edge where land meets sea. It moves slowly as land and sea levels change.'],
      ['sea level', 'The average height of the surface of the sea. Heights on land are measured from it, and it changes over long periods.'],
      ['mountain range', 'A line or group of mountains formed by the same movements of the earth.', 'The Alps are a relatively young range that has not finished growing.'],
      ['volcanic rock', 'Rock formed when molten rock from inside the earth reaches the surface and cools.'],
    ],
    facts: [
      ['The Oman Mountains in Arabia are made of rocks that were once under an ocean.', true, 'Slow movements raised them from the water, and wind and rain carved them into mountains.'],
      ['The inside of the earth is cool, like its surface.', false, 'The inside is white-hot. Only the thin outer shell is cool.'],
      ['Earthquakes and volcanoes are evidence of activity deep inside the earth.', true, 'They happen suddenly, but the movement behind them goes on slowly all the time.'],
      ['Coastlines stay in the same place for ever.', false, 'They move slowly as land and sea levels change.'],
      ['The Alps have finished growing.', false, 'The book describes the Alps as a relatively young range that has not finished growing.'],
      ['It takes millions of years for new mountains and oceans to form.', true, 'We only catch a glimpse of these changes in a human lifetime.'],
    ],
    cloze: [
      ['The breaking down of rock at the surface by wind, rain and ice is called ___.', 'weathering'],
      ['Rock that reached the surface as a liquid and then cooled is ___.', 'volcanic rock'],
      ['The Alps are a young ___ that is still growing.', 'mountain range'],
      ['As land and sea levels change, the ___ slowly moves.', 'coastline'],
      ['The jungle on St Vincent grows in ___ made from weathered volcanic rock.', 'soil'],
    ],
    task: { type: 'sort', prompt: 'Is this change sudden or very slow?', bins: {
      'Sudden': ['An earthquake', 'A volcanic eruption'],
      'Very slow': ['Mountains rising', 'A coastline moving', 'Desert rock wearing into sand', 'Soil forming from rock'],
    } },
  },
  g2: {
    title: 'How the Earth Was Formed', pages: '6–7', specimen: 'meteorite',
    words: [
      ['element', 'A basic chemical substance that cannot be split into simpler substances. About a hundred are known, such as hydrogen, oxygen and iron.'],
      ['hydrogen', 'The lightest element, a gas. Stars such as the Sun are made mostly of hydrogen.'],
      ['nuclear reaction', 'A change in the centres of atoms that releases huge amounts of energy. In the Sun, nuclear reactions turn hydrogen into helium.'],
      ['solar system', 'The Sun and everything that travels around it, including the eight planets.'],
      ['orbit', 'The curved path that one object follows around another, such as the earth around the Sun.'],
      ['meteorite', 'A piece of rock or metal from space that falls and reaches the ground.'],
      ['crater', 'A bowl-shaped hollow made by an impact or by a volcano.'],
      ['atmosphere', 'The layer of gases held around a planet by its gravity.'],
      ['gravity', 'The force that pulls objects towards each other. Earth’s gravity holds the atmosphere and the oceans in place.', 'Today: the earth is about 4,540 million years old. The book says it had grown large enough to hold its gases by about 4,000 million years ago.'],
    ],
    facts: [
      ['Stars make new elements through nuclear reactions.', true, 'When an old star explodes, it scatters new, rarer elements into space.'],
      ['The Sun formed from a cloud of gas and dust that shrank and grew hotter.', true, 'When the centre became hot enough, nuclear reactions started and the Sun was born.'],
      ['The planets formed before the Sun.', false, 'The Sun formed first. The rest of the cloud became a disc, then rings, which condensed into planets.'],
      ['Radiation from the young Sun blew gases away from the closest planets.', true, 'That is why the inner planets, including earth, are rocky.'],
      ['The early earth had a smooth surface with no craters.', false, 'Massive meteorites and comets covered it with craters, like the Moon.'],
      ['Gravity held the gases and water vapour that formed our atmosphere and oceans.', true, 'Once the earth was large enough, its gravity trapped them.'],
    ],
    cloze: [
      ['Hydrogen, oxygen and iron are each a chemical ___.', 'element'],
      ['Inside the Sun, hydrogen is turned into helium by a ___.', 'nuclear reaction'],
      ['A rock from space that crashes into the ground is a ___.', 'meteorite'],
      ['The earth’s ___ held the escaping gases close to the planet.', 'gravity'],
      ['The Sun and all the planets together make up the ___.', 'solar system'],
    ],
    task: { type: 'order', prompt: 'Put the birth of the solar system in order, first to last.', items: [
      'A cloud of gas and dust shrinks',
      'Nuclear reactions start: the Sun is born',
      'The leftover cloud spreads into a flat disc',
      'The disc separates into rings',
      'Each ring condenses into a young planet',
      'Meteorites and comets bombard the earth',
      'Gases and vapour form the atmosphere and oceans',
    ] },
  },
  g3: {
    title: 'Inside the Earth', pages: '8–9', specimen: 'iron',
    words: [
      ['crust', 'The very thin top layer of the earth’s shell. It is cooler than the rock below.'],
      ['shell', 'The earth’s rigid outer layer: the crust together with the solid top of the mantle.', 'Today: scientists call this layer the lithosphere.'],
      ['mantle', 'The thick layer of white-hot rock, about 2,900 km deep, between the crust and the core. It is solid but churns very slowly.'],
      ['outer core', 'The liquid layer around the earth’s centre, made largely of iron.'],
      ['inner core', 'The solid ball of rock and metal at the very centre of the earth.'],
      ['shock wave', 'A wave of energy that travels through rock. Shock waves from earthquakes show scientists what the inside of the earth is like.'],
      ['diameter', 'A straight line across a circle or ball, passing through its centre. The earth’s diameter is over 12,700 km.'],
      ['white-hot', 'So hot that it glows white. White-hot is hotter than red-hot.'],
    ],
    facts: [
      ['Scientists learn about the earth’s interior by studying shock waves from earthquakes.', true, 'The way the waves travel through the earth reveals its layers.'],
      ['The whole mantle is liquid.', false, 'The mantle is white-hot but solid. It churns very slowly.'],
      ['The mantle is about 2,900 kilometres deep.', true, 'Below it lies the core.'],
      ['The inner core is liquid.', false, 'The outer core is liquid. The inner core is solid.'],
      ['The core is made largely of iron.', true, 'It is the hottest and densest part of the earth.'],
      ['The shell rests on a layer of rock that is partly molten, like hot toffee.', true, 'The rigid plates slide over this softer layer.'],
    ],
    cloze: [
      ['The thin top layer of the earth’s shell is called the ___.', 'crust'],
      ['About 2,900 km of slowly churning hot rock make up the ___.', 'mantle'],
      ['The solid centre of the earth is the ___.', 'inner core'],
      ['An earthquake sends out a ___ that travels through the earth.', 'shock wave'],
      ['The liquid iron layer around the earth’s centre is the ___.', 'outer core'],
    ],
    task: { type: 'order', prompt: 'Order the layers from the surface to the centre.', items: [
      'Crust', 'Rest of the rigid shell', 'Partly molten layer', 'Mantle', 'Outer core (liquid)', 'Inner core (solid)',
    ] },
  },
  g4: {
    title: 'The Outer Layers', pages: '10–11', specimen: 'mudstone',
    words: [
      ['Moho', 'The boundary at the base of the crust. It was discovered by studying how earthquake waves travel.', 'Short for Mohorovičić, the scientist who found it.'],
      ['borehole', 'A narrow, deep hole drilled into the ground to study or extract rock, water or oil.'],
      ['quarry', 'An open pit where rock is cut or dug out from the surface.'],
      ['sediment', 'Sand, mud and other particles carried by wind, water or ice and laid down in layers.'],
      ['deposit', 'To lay down sediment in a new place. The material that is laid down is also called a deposit.'],
      ['stress', 'A force that squeezes or stretches rock. Too much stress makes rock crack.'],
      ['buckle', 'To bend and crumple under pressure, as rock layers do when squeezed for a long time.'],
      ['geology', 'The science of rocks and of the earth’s history, which is recorded in its rocks.'],
    ],
    facts: [
      ['Under the continents, the shell can be more than 100 kilometres thick.', true, 'Under the oceans it is much thinner.'],
      ['The shell is thicker under the oceans than under the continents.', false, 'It is much thinner under the oceans.'],
      ['New crust forms along cracks in the ocean shell.', true, 'As the rock pushes up, the shell on either side slides slowly apart.'],
      ['The deepest boreholes have reached the mantle.', false, 'The deepest boreholes have barely scratched the surface. No one has seen very far into the earth.'],
      ['Rock squeezed for a very long time may buckle and fold into mountains.', true, 'The Alps and the Himalayas formed this way.'],
      ['Layers of sediment harden into rock that records the earth’s movements.', true, 'Reading these rocks is how geologists learn the history of the earth.'],
    ],
    cloze: [
      ['The base of the crust is called the ___.', 'Moho'],
      ['Sand and mud laid down in layers by wind, ice and water are called ___.', 'sediment'],
      ['When rock is squeezed for a very long time, it may ___ and fold.', 'buckle'],
      ['Reading the history of the earth in its rocks is called ___.', 'geology'],
      ['A force that squeezes or stretches rock is called ___.', 'stress'],
    ],
    task: { type: 'sort', prompt: 'Is this made by people or by nature?', bins: {
      'Made by people': ['Quarry', 'Borehole', 'Deep mine'],
      'Natural': ['Volcano', 'Moho', 'Rock strata', 'Earthquake'],
    } },
  },
  g5: {
    title: 'The World of Crystals', pages: '12–13', specimen: 'quartz',
    words: [
      ['atom', 'The tiniest particle of an element that can exist.'],
      ['compound', 'A substance made of two or more elements joined together chemically.'],
      ['mineral', 'A natural crystalline chemical. Rocks are made up of minerals.'],
      ['crystal', 'A solid whose atoms are fixed together in a regular, repeating pattern.'],
      ['silicate', 'A mineral made of oxygen and silicon, often joined with metals. Silicates are the largest group of minerals.'],
      ['quartz', 'A very common silicate mineral, made of silicon and oxygen. Its crystals are often clear or milky.'],
      ['calcite', 'The mineral that chalk is made of, almost entirely.'],
      ['feldspar', 'A common group of silicate minerals. Granite is a mixture of feldspar, quartz and other minerals.'],
      ['ore', 'A rock or mineral from which a useful metal can be extracted.', 'Galena is a lead ore. Silver is sometimes found in it.'],
      ['thin section', 'A slice of rock ground so thin that light shines through it. Geologists study it under a microscope with crossed polarizers.'],
    ],
    facts: [
      ['Oxygen and silicon make up over 74 per cent of the earth’s crust.', true, 'Other common elements include aluminium, iron and magnesium.'],
      ['The earth is made mostly of much heavier materials than the Sun.', true, 'The Sun is mostly the light gas hydrogen.'],
      ['Chalk is a mixture of many different minerals.', false, 'Chalk is made almost entirely of one mineral, calcite.'],
      ['Each mineral has its own crystal structure, which helps geologists identify it.', true, 'Crossed polarizers make crystal structures show up clearly.'],
      ['Mineral crystals are always large.', false, 'Most are tiny, although some over ten metres long have been found.'],
      ['Galena is a lead ore.', true, 'Silver is sometimes found in it as well.'],
    ],
    cloze: [
      ['In a ___, the atoms are fixed together in a regular pattern.', 'crystal'],
      ['Chalk is made almost entirely of the mineral ___.', 'calcite'],
      ['Granite is a mixture of feldspar, ___ and other minerals.', 'quartz'],
      ['A rock from which a useful metal can be extracted is an ___.', 'ore'],
      ['A substance made of elements joined chemically is a ___.', 'compound'],
    ],
    task: { type: 'sort', prompt: 'Is this an element or a mineral?', bins: {
      'Element': ['Oxygen', 'Silicon', 'Iron', 'Aluminium'],
      'Mineral': ['Quartz', 'Calcite', 'Feldspar', 'Galena'],
    } },
  },
  g6: {
    title: 'Rocks from Inside the Earth', pages: '14–15', specimen: 'garnet',
    words: [
      ['igneous rock', 'Rock that formed when molten rock cooled and hardened. Granite is an igneous rock.'],
      ['metamorphic rock', 'Rock that was re-made from existing rock by great heat and pressure, without melting.'],
      ['schist', 'A metamorphic rock that was once mud. It often contains garnet crystals and flaky mica.'],
      ['gneiss', 'A banded metamorphic rock that was folded deep inside the earth’s crust.', 'Pronounced "nice".'],
      ['garnet', 'A mineral that grows as crystals inside metamorphic rock. It shows as dark spots in schist.'],
      ['mica', 'A flaky mineral that splits into very thin sheets.'],
      ['folding', 'The bending of rock layers by heavy, slow, sideways pressure.'],
      ['faulting', 'The cracking and slipping of rock along a break when it is squeezed or stretched.'],
      ['recrystallize', 'To form new crystals from old ones. In metamorphic rock this happens without melting.'],
    ],
    facts: [
      ['Schist was once mud.', true, 'Heat and pressure deep underground turned the mud into schist.'],
      ['Granite cooled slowly, so its crystals grew large.', true, 'Slow cooling gives crystals time to grow.'],
      ['Metamorphic rocks form by melting.', false, 'They are re-made without melting. Igneous rocks form from melted rock.'],
      ['The Alps are folded mountains, pushed by pressure from the south.', true, 'The rocks buckled over when they were pushed.'],
      ['When rock lurches suddenly along a crack, it can cause an earthquake.', true, 'This kind of movement is called faulting.'],
      ['We can watch crystals change inside the crust.', false, 'We cannot see it happen. We only see the evidence in rocks that are now at the surface.'],
    ],
    cloze: [
      ['Rock re-made by heat and pressure without melting is ___.', 'metamorphic rock'],
      ['The dark spots in schist are crystals of ___.', 'garnet'],
      ['The flaky mineral in schist is ___.', 'mica'],
      ['When rocks crack and slip along a break, it is called ___.', 'faulting'],
      ['Rock that cooled from a molten state is ___.', 'igneous rock'],
    ],
    task: { type: 'sort', prompt: 'Igneous or metamorphic?', bins: {
      'Igneous': ['Granite', 'Gabbro', 'Basalt', 'Obsidian'],
      'Metamorphic': ['Schist', 'Gneiss', 'Slate'],
    } },
  },
  g7: {
    title: 'Plates', pages: '16–17', specimen: 'obsidian',
    words: [
      ['plate', 'One of the rigid pieces that the earth’s shell is broken into. The plates fit together like a crazy jigsaw.'],
      ['magma', 'Molten rock churned up from the mantle, below the surface.'],
      ['mid-ocean ridge', 'A long underwater mountain chain where two plates pull apart and new ocean crust forms.'],
      ['ocean trench', 'A deep, narrow valley in the ocean floor where one plate is forced down into the mantle.'],
      ['subduction', 'The sinking of one plate beneath another, back down into the hot mantle.', 'The book describes this as one plate being "forced to slide under" the other.'],
      ['continental crust', 'The thick, light crust that forms the continents.'],
      ['oceanic crust', 'The thin, dense crust that forms the ocean floors.'],
      ['Himalayas', 'The mountain chain formed where the plate carrying India pressed against the plate carrying Asia.'],
    ],
    facts: [
      ['Plates move a few centimetres a year.', true, 'That is very slow, but over millions of years it moves whole continents.'],
      ['Where plates pull apart, magma rises and forms new crust.', true, 'It cools and seals the plate edges.'],
      ['When two plates meet head-on, both always rise upwards.', false, 'One is forced under the other. Its crust is pushed down into the mantle, where some of it melts.'],
      ['Volcanoes and earthquakes are found mostly along plate edges.', true, 'Maps of volcanoes and earthquakes trace the plate edges.'],
      ['The Himalayas formed where two plates carrying continents pressed together.', true, 'The rocks were pushed up and then eroded into jagged peaks.'],
      ['Most new crust forms in the middle of continents.', false, 'Most new crust forms along ridges on the ocean floors.'],
    ],
    cloze: [
      ['The earth’s shell is broken into rigid pieces. Each one is called a ___.', 'plate'],
      ['Molten rock below the surface is called ___.', 'magma'],
      ['A deep ___ forms where one plate is forced down into the mantle.', 'ocean trench'],
      ['New ocean crust forms along a ___.', 'mid-ocean ridge'],
      ['The sinking of one plate under another is called ___.', 'subduction'],
    ],
    task: { type: 'sort', prompt: 'Where does it happen?', bins: {
      'Plates pull apart': ['Mid-ocean ridge', 'New crust forms', 'Magma wells up to fill the gap'],
      'Plates push together': ['Ocean trench', 'One plate slides under', 'The Himalayas rise'],
    } },
  },
  g8: {
    title: 'Drifting Continents', pages: '18–19', specimen: 'fossil-fern',
    words: [
      ['continental drift', 'The very slow movement of the continents across the earth’s surface, carried on moving plates.'],
      ['Alfred Wegener', 'The German scientist who explained the theory of continental drift in the early 1900s.'],
      ['fossil', 'The preserved remains or traces of a plant or animal that lived long ago.'],
      ['Pangaea', 'The name scientists give to the single supercontinent that existed about 200 million years ago.', 'The book calls it "one large island" and does not use the name.'],
      ['rift', 'A long crack where the earth’s shell is splitting apart.', 'The rift that holds the Red Sea continues up the Jordan Valley.'],
      ['Red Sea', 'The narrow sea between Africa and Arabia. It is slowly widening as Arabia drifts away from Africa.'],
      ['Atlantic Ocean', 'The ocean between the Americas and Europe and Africa. Similar rocks and fossils on both sides show the continents were once joined.'],
    ],
    facts: [
      ['Wegener noticed that rocks on both sides of the Atlantic are similar.', true, 'They also contain fossils of the same plants and animals.'],
      ['Wegener explained continental drift in the 1800s.', false, 'He explained it in the early 1900s.'],
      ['Ocean crust is much younger than the continents.', true, 'It is made at mid-ocean ridges and moves away from them.'],
      ['The Red Sea is slowly widening.', true, 'Arabia is drifting away from Africa.'],
      ['The continents have stopped moving.', false, 'They are still drifting and splitting.'],
      ['The outlines of the continents fit together like pieces of a jigsaw.', true, 'The fit is even better if you remove the oceans to show the full continental crust.'],
    ],
    cloze: [
      ['The theory that continents move was explained by ___.', 'Alfred Wegener'],
      ['The preserved remains of a plant or animal in rock is a ___.', 'fossil'],
      ['The Red Sea lies in a ___ that is slowly widening.', 'rift'],
      ['Long ago, all the continents were joined in one supercontinent called ___.', 'Pangaea'],
      ['The slow movement of continents is called ___.', 'continental drift'],
    ],
    task: { type: 'order', prompt: 'Put the world maps in order, oldest to newest.', items: [
      '200 million years ago: one large supercontinent',
      '135 million years ago: the land is splitting apart',
      'Today: the continents we know',
      '50 million years ahead: the continents keep drifting',
    ] },
  },
  g9: {
    title: 'The Moving Map', pages: '20–21', specimen: 'coal',
    words: [
      ['continental shelf', 'The gently sloping edge of a continent, covered by shallow sea.'],
      ['shelf sea', 'A shallow sea that floods a continental shelf, like the North Sea or the Persian Gulf.'],
      ['uplift', 'The slow raising of land by movements inside the earth.'],
      ['climate', 'The usual weather of a place over a long time.'],
      ['coal seam', 'A layer of coal in rock, made from the compressed remains of ancient forests.'],
      ['arid', 'Very dry, with little or no rain.'],
      ['ice age', 'A long cold period when ice sheets spread over much of the land.', 'The book calls these "icy periods".'],
      ['fjord', 'A long, deep, narrow sea inlet in a valley carved by ice.', 'The book spells it "fiord".'],
      ['U-shaped valley', 'A valley with steep sides and a wide floor, carved out by a moving glacier.'],
    ],
    facts: [
      ['The Persian Gulf and the North Sea are shallow shelf seas.', true, 'They flood the gently sloping edges of continents.'],
      ['Coal seams are the compressed remains of equatorial forests.', true, 'As the plates drifted, the land passed through many different climates.'],
      ['About 165 million years ago, Britain had an icy climate.', false, 'It was tropical. Dinosaurs roamed the land and reptiles lived in the seas.'],
      ['About 250 million years ago, the area that is now Britain was hot and arid.', true, 'Land and a salt-sea covered the area.'],
      ['During icy periods, ice carved U-shaped valleys and deep fjords.', true, 'When the ice melted, the sea filled them again.'],
      ['Rocks carried by ice always stay where they formed.', false, 'Ice and melt-water carried many rocks far from where they came from.'],
    ],
    cloze: [
      ['The Persian Gulf is a shallow ___.', 'shelf sea'],
      ['A layer of coal made from ancient forests is a ___.', 'coal seam'],
      ['Some sandstones in cold countries show evidence of a once ___ climate.', 'arid'],
      ['A deep, narrow sea inlet carved by ice is a ___.', 'fjord'],
      ['The slow raising of land by movements inside the earth is ___.', 'uplift'],
    ],
    task: { type: 'sort', prompt: 'Is this a clue to a hot past or a cold past?', bins: {
      'Hot climate': ['Coal seams', 'Desert sandstone', 'Dinosaur fossils', 'Salt-sea deposits'],
      'Cold climate': ['U-shaped valleys', 'Fjords', 'Rocks carried far by ice'],
    } },
  },
  g10: {
    title: 'Strata', pages: '22–23', specimen: 'ammonite',
    words: [
      ['stratum', 'A single layer of sedimentary rock. The plural is strata.'],
      ['sedimentary rock', 'Rock formed from layers of sediment that were laid down and hardened.'],
      ['limestone', 'A sedimentary rock made mostly of calcite, often from shells and skeletons of sea life.'],
      ['ammonite', 'An extinct sea animal with a coiled shell, often found as a fossil in limestone.'],
      ['superposition', 'The rule that in undisturbed strata, the oldest layer is at the bottom and the youngest is at the top.', 'The book states this rule but does not name it.'],
      ['relative age', 'Whether a rock is older or younger than another, without a date in years.'],
      ['radioactive dating', 'Working out the actual age of a rock, in millions of years, by measuring its radioactivity.'],
      ['chalk', 'A soft white sedimentary rock formed from the skeletons of tiny sea plants.', 'The chalk cliffs in the book formed from mud laid down about 80 million years ago.'],
    ],
    facts: [
      ['In undisturbed strata, the oldest rocks are at the bottom.', true, 'The youngest rocks are at the top.'],
      ['Chalk formed from the skeletons of tiny sea plants.', true, 'They built up as layers of white mud under the sea.'],
      ['Fossils tell us nothing about past environments.', false, 'Fossils show what conditions were like when the sediment was laid down.'],
      ['The actual age of some rocks can be found by measuring their radioactivity.', true, 'This gives an age in millions of years.'],
      ['The ammonite fossils shown in the book are about 18 million years old.', false, 'They are over 180 million years old.'],
      ['Layers of pure quartz sand or salt form by a sorting process.', true, 'Minerals are sorted as they are carried and deposited.'],
    ],
    cloze: [
      ['A single layer of sedimentary rock is a ___.', 'stratum'],
      ['The oldest layer is at the bottom of undisturbed rock. This rule is called ___.', 'superposition'],
      ['Coiled fossil shells in limestone are often an ___.', 'ammonite'],
      ['Scientists find a rock’s age in years by ___.', 'radioactive dating'],
      ['Rock formed from layers of hardened sediment is ___.', 'sedimentary rock'],
    ],
    task: { type: 'order', prompt: 'How does sedimentary rock form? Put the steps in order.', items: [
      'New rock is exposed at the surface',
      'Wind, rain and ice attack and erode it',
      'Tiny grains are carried away',
      'The grains are deposited as sediment',
      'Layers build up and harden into strata',
    ] },
  },
  g11: {
    title: 'Mountains', pages: '24–25', specimen: 'gneiss',
    words: [
      ['fold mountains', 'Mountains formed when rock layers are squeezed between plates and buckle upwards.'],
      ['mountain root', 'The thick part of the crust below a mountain chain. Like an iceberg, most of it is hidden beneath the surface.'],
      ['density', 'How heavy a material is for its size. Light continental rock floats on denser rock below.'],
      ['volcanic chain', 'A line of volcanoes formed along the edge of a plate.'],
      ['Andes', 'The volcano-studded mountains of South America. They rose as an ocean plate slid beneath the continent.'],
      ['Alps', 'A mountain chain in Europe. The main squeezes that formed it happened about 25 million years ago.'],
      ['ancient mountains', 'The worn-down remains of much higher mountains, such as the Scottish Highlands, the Urals and the Appalachians.'],
      ['plain', 'A wide area of flat land. Over millions of years, even the highest mountains are worn down to plains.'],
    ],
    facts: [
      ['The Andes rose as an ocean plate slid beneath South America.', true, 'They are still growing very slowly today.'],
      ['The main squeezes that formed the Alps happened about 25 million years ago.', true, 'The Alps are part of a series of chains still forming at the edges of Europe and Arabia.'],
      ['The highest mountains today will last for ever.', false, 'Millions of years from now they will be worn down to flat plains.'],
      ['The crust is thicker beneath a mountain chain than anywhere else.', true, 'Like an iceberg, we see only a fraction of it at the surface.'],
      ['Mountains are made mostly of dense ocean crust.', false, 'They are made mostly of light continental crust, such as granite.'],
      ['The Urals and the Appalachians are eroded remains of much higher mountains.', true, 'They formed at the edges of plates that disappeared long ago.'],
    ],
    cloze: [
      ['Like an iceberg, most of a ___ is hidden below the surface.', 'mountain root'],
      ['Light continental rock floats on rock of greater ___.', 'density'],
      ['The ___ rose as an ocean plate slid beneath South America.', 'Andes'],
      ['Over millions of years, mountains are worn down to a ___.', 'plain'],
      ['Mountains made by rock layers buckling upwards are ___.', 'fold mountains'],
    ],
    task: { type: 'sort', prompt: 'Young mountains, or ancient worn-down ones?', bins: {
      'Young and still growing': ['Himalayas', 'Alps', 'Andes'],
      'Ancient and worn down': ['Scottish Highlands', 'Urals', 'Appalachians'],
    } },
  },
  g12: {
    title: 'Volcanoes', pages: '26–27', specimen: 'pumice',
    words: [
      ['eruption', 'The bursting out of lava, gas and ash from a volcano.'],
      ['lava', 'Molten rock that has reached the earth’s surface.'],
      ['basalt', 'Dark volcanic rock formed from runny lava. It wells up at mid-ocean ridges and hotspots.'],
      ['andesite', 'Volcanic rock from lava that is lighter than basalt. It is common where one plate sinks under another.'],
      ['shield volcano', 'A broad, gently sloping volcano built from great flows of runny lava, as in Hawaii.'],
      ['hotspot', 'A place far from plate edges where magma rises from deep in the mantle, such as Hawaii.'],
      ['Ring of Fire', 'The chain of volcanic islands and mountains around the Pacific Ocean, above sinking plate edges.'],
      ['obsidian', 'A natural black glass made when granite magma cools very quickly.'],
      ['pumice', 'A very light, frothy volcanic rock full of gas bubbles.'],
    ],
    facts: [
      ['Hawaii’s volcanoes lie above a hotspot, far from any plate edge.', true, 'The magma rises from deep in the mantle.'],
      ['The more gas magma contains, the more violent the explosion.', true, 'Sticky, gassy magma explodes when the pressure is released.'],
      ['Pumice is a heavy, dense rock.', false, 'Pumice is so light and frothy that it can float on water.'],
      ['Obsidian is a glass made from quickly cooled granite magma.', true, 'It cools too fast for crystals to grow.'],
      ['Basalt lava is thick and sticky.', false, 'Basalt lava is runny. It can flow out into great lava plains.'],
      ['Andesite lava is lighter than basalt lava.', true, 'It is not pulled down with the sinking ocean crust, so it builds islands and continents instead.'],
    ],
    cloze: [
      ['Molten rock that reaches the surface is called ___.', 'lava'],
      ['A broad volcano built from runny lava is a ___.', 'shield volcano'],
      ['Hawaii lies above a ___.', 'hotspot'],
      ['Black volcanic glass is called ___.', 'obsidian'],
      ['The volcanic islands around the Pacific form the ___.', 'Ring of Fire'],
    ],
    task: { type: 'sort', prompt: 'Runny basalt lava, or sticky, gassy magma?', bins: {
      'Runny basalt': ['Mid-ocean ridges', 'Hawaii hotspot', 'Shield volcanoes', 'Lava plains'],
      'Sticky, gassy magma': ['Where one plate sinks under another', 'Violent explosions', 'Andesite islands'],
    } },
  },
  g13: {
    title: 'Earthquakes', pages: '28–29', specimen: 'slate',
    words: [
      ['tremor', 'A small shaking of the ground.'],
      ['seismograph', 'An instrument that detects and records earthquake waves.'],
      ['fault line', 'The line on the surface where a fault, a break in the rock, can be seen.'],
      ['tsunami', 'A massive sea wave caused by an earthquake or other sudden movement under the sea.'],
      ['landslide', 'A sudden fall of rock and soil down a slope.'],
      ['brittle', 'Hard but easily broken or cracked, rather than bending.'],
      ['strain', 'The build-up of stress in rocks that are locked together, until they break.'],
    ],
    facts: [
      ['A seismograph can detect tremors too small for people to feel.', true, 'Portable seismographs record small, shallow tremors.'],
      ['The deepest earthquakes cause the most damage at the surface.', false, 'Earthquakes nearer the surface do the greatest damage.'],
      ['Near the top of the crust, rocks are brittle and may lock together for years.', true, 'Strain builds up until the rocks suddenly move.'],
      ['A violent earthquake in Iran in 1968 left a long fault.', true, 'Fault lines in rocks can show earthquake movements from the past.'],
      ['Tsunamis are caused by strong winds.', false, 'They are caused by earthquakes and other sudden movements under the sea.'],
      ['Scientists use shock waves from earthquakes to study the structure of the earth.', true, 'This is how layers like the Moho and the core were found.'],
    ],
    cloze: [
      ['An instrument that records earthquake waves is a ___.', 'seismograph'],
      ['A massive sea wave caused by an earthquake is a ___.', 'tsunami'],
      ['Near the surface, rocks are ___, so they crack rather than bend.', 'brittle'],
      ['A very small earthquake is a ___.', 'tremor'],
      ['Stress builds up as ___ until the rocks break.', 'strain'],
    ],
    task: { type: 'order', prompt: 'How does an earthquake happen? Put the steps in order.', items: [
      'Two plates rub against each other',
      'Brittle rocks lock together',
      'Strain builds up for years',
      'The strain reaches breaking point',
      'A wave of movement shoots along the rocks',
      'The crust wobbles like a huge jelly',
    ] },
  },
  g14: {
    title: 'Treasures from the Earth', pages: '30–31', specimen: 'jade',
    words: [
      ['gemstone', 'A beautiful, rare mineral crystal that is cut and polished for jewellery.'],
      ['diamond', 'The hardest natural mineral. Its crystals are found in rock that was once molten, deep under the earth’s shell.'],
      ['jade', 'A tough green stone used for carving. It is made from the minerals nephrite and jadeite.'],
      ['fossil fuel', 'A fuel such as coal, oil or gas, formed over millions of years from the remains of living things.'],
      ['peat', 'Soft, brown, partly rotted plant material. Under pressure, layers of peat become coal.'],
      ['coal', 'A black rock that burns, formed from ancient forests buried and compressed under layers of mud and sand.'],
      ['oil', 'A liquid fossil fuel formed mostly from the remains of tiny sea life.', 'Today: the book predicted that oil would be in short supply by the year 2000. That did not happen, but fossil fuels still cannot be replaced, and burning them adds carbon dioxide to the air.'],
      ['plankton', 'Tiny plants and animals that drift in the sea. Their remains formed most of the world’s oil.'],
      ['uranium', 'A radioactive metal. It can be used as a source of power instead of fossil fuels.'],
    ],
    facts: [
      ['Diamond crystals are found in rock that was once molten, deep under the earth’s shell.', true, 'Gems form as a result of the slow movement within the earth.'],
      ['Coal formed from forests that were buried and compressed over millions of years.', true, 'First the plants became peat, then coal.'],
      ['Most of the world’s oil formed from the remains of marine plankton.', true, 'Gas comes from both coal and oil.'],
      ['The earth replaces fossil fuels as fast as we use them.', false, 'The earth replaces them far too slowly for our needs.'],
      ['Limestone, gravel and clay are sedimentary rocks used for building.', true, 'Sedimentary rocks provide most of our building materials.'],
      ['Gold and silver can be gathered by water seeping through hot rock.', true, 'They crystallize again near the surface, where they can be mined.'],
    ],
    cloze: [
      ['Coal, oil and gas are each a ___.', 'fossil fuel'],
      ['Partly rotted plant material that can become coal is ___.', 'peat'],
      ['Most oil formed from the remains of marine ___.', 'plankton'],
      ['A radioactive metal used for power is ___.', 'uranium'],
      ['The green stone made from nephrite and jadeite is ___.', 'jade'],
    ],
    task: { type: 'sort', prompt: 'Which group does it belong to?', bins: {
      'Fossil fuel': ['Coal', 'Oil', 'Natural gas'],
      'Gemstone': ['Diamond', 'Topaz', 'Tourmaline'],
      'Building material': ['Limestone', 'Gravel', 'Clay'],
    } },
  },
  g15: {
    title: 'Geological Timescale', pages: '32', specimen: 'trilobite',
    words: [
      ['geological timescale', 'The calendar geologists use to divide the earth’s history into eras and periods.'],
      ['era', 'A very long division of geological time, made up of several periods.'],
      ['period', 'A division of an era, such as the Jurassic period.'],
      ['Precambrian', 'All of the earth’s history before the Cambrian period. It is by far the longest part.', 'Today: the Cambrian is dated to about 539 million years ago, not 570 as in the book.'],
      ['Palaeozoic', 'The era of "ancient life", from the Cambrian to the Permian period.'],
      ['Mesozoic', 'The era of "middle life", from the Triassic to the Cretaceous. It was the age of the dinosaurs.', 'Today: about 252 to 66 million years ago.'],
      ['Cenozoic', 'The era of "new life", from 66 million years ago to today.', 'Today: the book’s "Tertiary" is now split into the Palaeogene and Neogene periods.'],
      ['Jurassic', 'The middle period of the Mesozoic era, when dinosaurs roamed the land.', 'Today: about 201 to 145 million years ago (the book says 195 to 140).'],
      ['Holocene', 'The most recent part of the Quaternary period: the one we live in now.'],
    ],
    facts: [
      ['The Precambrian is by far the longest part of the earth’s history.', true, 'On the book’s timescale it fills most of the bar.'],
      ['Dinosaurs lived during the Mesozoic era.', true, 'The Mesozoic includes the Triassic, Jurassic and Cretaceous periods.'],
      ['The Cambrian is younger than the Jurassic.', false, 'The Cambrian is much older. It began the Palaeozoic era.'],
      ['We live in the Holocene.', true, 'It is part of the Quaternary period.'],
      ['The Quaternary is the oldest period.', false, 'It is the most recent period.'],
      ['The coloured bands in the book’s detailed timescale are drawn to scale.', false, 'The book says they are not in proportion to the lengths of the periods.'],
    ],
    cloze: [
      ['Earth history before the Cambrian is called the ___.', 'Precambrian'],
      ['The age of the dinosaurs is the ___ era.', 'Mesozoic'],
      ['We live in the ___.', 'Holocene'],
      ['A long division of time made of several periods is an ___.', 'era'],
      ['The era of "new life" is the ___.', 'Cenozoic'],
    ],
    task: { type: 'order', prompt: 'Put the periods in order, oldest first.', items: [
      'Cambrian', 'Silurian', 'Carboniferous', 'Permian', 'Triassic', 'Jurassic', 'Cretaceous', 'Quaternary',
    ] },
  },
};

export const SPECIMENS = {
  basalt: ['Basalt', 'Dark volcanic rock from runny lava (p. 27).'],
  meteorite: ['Iron meteorite', 'A piece of the early solar system that fell to earth (p. 6).'],
  iron: ['Iron', 'The metal that makes up most of the earth’s core (p. 8).'],
  mudstone: ['Mudstone', 'Hardened layers of mud, a record of the earth’s past (p. 11).'],
  quartz: ['Quartz', 'One of the most common silicate minerals (p. 13).'],
  garnet: ['Garnet', 'Dark red crystals that grow inside schist (p. 15).'],
  obsidian: ['Obsidian', 'Black volcanic glass (p. 27).'],
  'fossil-fern': ['Fern fossil', 'The same fossils on both sides of the Atlantic helped prove continental drift (p. 18).'],
  coal: ['Coal', 'Ancient equatorial forest, compressed into rock (p. 20).'],
  ammonite: ['Ammonite', 'A coiled sea animal, over 180 million years old (p. 23).'],
  gneiss: ['Gneiss', 'Banded rock folded deep in a mountain’s roots (p. 14).'],
  pumice: ['Pumice', 'Frothy lava so light it floats (p. 27).'],
  slate: ['Slate', 'Dark, splitting rock found where crust was squeezed (p. 15).'],
  jade: ['Jade', 'Tough green stone carved into ornaments (p. 30).'],
  trilobite: ['Trilobite', 'A sea animal from the Palaeozoic era. It lived from the Cambrian to the Permian.'],
};

export const RANKS = [
  [0, 'Rock Hound'],
  [25, 'Field Assistant'],
  [60, 'Field Geologist'],
  [110, 'Senior Geologist'],
  [170, 'Professor of Geology'],
];

export const GAMES = [
  { id: 'study', name: 'Study Cards', hint: 'Read each term and its definition. Tap the speaker to hear it.' },
  { id: 'define', name: 'Definitions', hint: 'Match each definition to the right term.' },
  { id: 'cloze', name: 'Fill the Gap', hint: 'Choose the term that completes the sentence.' },
  { id: 'truefalse', name: 'True or False', hint: 'Decide whether each statement from the book is true.' },
  { id: 'sort', name: 'Sort and Order', hint: 'Sort the items into groups, or put them in order.' },
];

// ---------- Flatten ----------
export const WORDS = {};
export const FACTS = {};
export const CLOZES = {};
export const LESSON_ORDER = UNITS.flatMap((u) => u.lessons);
for (const lid of LESSON_ORDER) {
  const L = LESSONS[lid];
  L.id = lid;
  L.wordIds = L.words.map(([w, def, note]) => {
    const id = 'g-' + w.toLowerCase().replace(/[^a-z]+/g, '-');
    if (WORDS[id]) throw new Error('Duplicate term ' + w);
    WORDS[id] = { id, word: w, def, note: note || '', lesson: lid };
    return id;
  });
  L.factIds = L.facts.map(([text, truth, why], i) => {
    const id = `${lid}-f${i + 1}`;
    FACTS[id] = { id, text, truth, why, lesson: lid };
    return id;
  });
  L.clozeIds = L.cloze.map(([text, ans], i) => {
    const id = `${lid}-c${i + 1}`;
    const wid = L.wordIds.find((x) => WORDS[x].word === ans);
    if (!wid) throw new Error(`Cloze answer "${ans}" is not a term in ${lid}`);
    CLOZES[id] = { id, text, answer: wid, lesson: lid };
    return id;
  });
}
