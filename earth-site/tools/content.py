# Content for "Reading the Earth": an original introduction to geology for adult learners.
# All text here is original. Photos are public-domain NASA images (see PHOTOS for credits).
# Body markup: plain HTML. Insert a photo with [[photo:ID|caption]] and a diagram with [[diagram:name|caption]].
# A "Science today" callout: [[update:text]].

SITE_TITLE = "Reading the Earth"
SITE_TAGLINE = "A short, illustrated introduction to how our planet works"

PARTS = [
    ("Planet Earth", ["our-earth", "formation", "inside", "outer-layers"]),
    ("Minerals, Rocks and Plates", ["crystals", "rocks-from-below", "plates", "drifting-continents"]),
    ("The Changing Surface", ["moving-map", "strata", "mountains", "volcanoes"]),
    ("Quakes, Resources and Time", ["earthquakes", "resources", "timescale"]),
]

# nasa_id -> (short title, credit line). Credits follow the NASA image library record.
PHOTOS = {
    "as17-148-22727": ("Earth seen by the Apollo 17 crew, 7 December 1972", "NASA"),
    "sts068-228-081": ("Sahara Desert, Algeria, from Space Shuttle mission STS-68", "NASA"),
    "iss069e003275": ("Oman and the Dhofar mountains on the Arabian Sea", "NASA / photographed by Sultan Alneyadi, ISS Expedition 69"),
    "GSFC_20171208_Archive_e000790": ("The Sun seen by the Solar Dynamics Observatory", "NASA / GSFC / SDO"),
    "iss074e0208832": ("Meteor Crater, Arizona, from the International Space Station", "NASA"),
    "GSFC_20171208_Archive_e001386": ("Blue Marble 2012, a composite satellite image of Earth", "NASA / NOAA / GSFC / Suomi NPP"),
    "iss074e0301902": ("The Grand Canyon and the Colorado Plateau from the International Space Station", "NASA"),
    "PIA14897": ("The eastern Grand Canyon seen by the Terra satellite", "NASA / GSFC / METI / ERSDAC / JAROS, and U.S./Japan ASTER Science Team"),
    "S70-20954": ("Thin sections of Apollo 12 Moon rocks under a microscope", "NASA"),
    "PIA03893": ("Folded rock layers of the Anti-Atlas Mountains, Morocco", "NASA / GSFC / METI / ERSDAC / JAROS, and U.S./Japan ASTER Science Team"),
    "iss072e397138": ("The Himalayas between the Tibetan Plateau and India", "NASA"),
    "as17-148-22718": ("Arabia and north-east Africa from Apollo 17", "NASA"),
    "iss071e183804": ("The Gulf of Aqaba and the Gulf of Suez at the north end of the Red Sea", "NASA"),
    "PIA03424": ("Lofoten Islands and the fjord coast of Norway", "NASA / GSFC / LaRC / JPL, MISR Team"),
    "iss069e025225": ("The Swiss Alps from the International Space Station", "NASA / photographed by Sultan Alneyadi, ISS Expedition 69"),
    "s31-151-113": ("The southern Appalachian Mountains, USA", "NASA"),
    "iss013e24184": ("Eruption of Cleveland Volcano, Aleutian Islands, Alaska, May 2006", "NASA"),
    "iss074e0459342": ("Mount Fuji, Japan, seen from almost directly above", "NASA"),
    "PIA02786": ("The San Andreas Fault in the Carrizo Plain, California", "NASA / JPL"),
    "iss015e29867": ("Bingham Canyon Mine, Utah, one of the largest open-pit mines in the world", "NASA"),
}

SOURCES = {
    "usgs-dynamic": ("USGS: This Dynamic Earth, the story of plate tectonics", "https://pubs.usgs.gov/gip/dynamic/dynamic.html"),
    "ics": ("International Commission on Stratigraphy: International Chronostratigraphic Chart", "https://stratigraphy.org/chart"),
    "usgs-volcano": ("USGS Volcano Hazards Program", "https://www.usgs.gov/programs/VHP"),
    "gvp": ("Smithsonian Institution Global Volcanism Program", "https://volcano.si.edu/"),
    "usgs-eq": ("USGS Earthquake Hazards Program", "https://www.usgs.gov/programs/earthquake-hazards"),
    "nasa-eo": ("NASA Earth Observatory", "https://earthobservatory.nasa.gov/"),
    "nasa-ss": ("NASA Science: Our Solar System", "https://science.nasa.gov/solar-system/"),
    "nasa-images": ("NASA Image and Video Library", "https://images.nasa.gov/"),
}

CHAPTERS = [
    {
        "slug": "our-earth",
        "title": "Our Earth",
        "dek": "A calm blue planet on the outside, a restless engine underneath.",
        "hero": "as17-148-22727",
        "body": """
<p>Seen from space, the Earth looks peaceful: blue oceans, white swirls of cloud, the brown and green of the continents. That calm is only skin deep. A few tens of kilometres below our feet the rock is hot enough to glow, and a few thousand kilometres down it is as hot as the surface of the Sun.</p>
<p>That inner heat keeps the planet moving. The rock of the deep interior is solid, yet over millions of years it creeps and churns like a very thick fluid. The thin, cold, rigid outer layer rides on top and is broken, bent and remade as it goes. Most of the time the movement is far too slow to notice: a few centimetres a year, about as fast as your fingernails grow.</p>
<h2>Fast events, slow processes</h2>
<p>Now and then the slow motion shows itself suddenly. An earthquake is the moment when rocks that have been straining against each other for decades finally slip. A volcanic eruption is the moment when molten rock that has been collecting underground finds a way out. Both are dramatic, but they are the visible edge of processes that never stop.</p>
[[photo:iss069e003275|The mountains of Dhofar in Oman are built from rock that formed under the sea and was later lifted high above it.]]
<p>Other changes are slower still. Mountains are pushed up over millions of years and worn down again by rain, ice and wind. Rocks that formed on the sea floor end up on mountain tops; the mountains of Oman, for example, contain slices of ancient ocean floor. Coastlines move as the land rises or sinks and as sea level changes with the climate.</p>
<h2>Weathering and erosion</h2>
<p>At the surface, rock is constantly attacked. <strong>Weathering</strong> breaks it down where it stands: water freezes in cracks and splits them open, rainwater slowly dissolves some minerals, and plant roots pry rocks apart. <strong>Erosion</strong> then carries the loose material away, in rivers, glaciers, waves and wind. Over long periods, weathered rock mixed with the remains of plants and animals becomes <strong>soil</strong>, the thin layer that feeds almost all life on land.</p>
[[photo:sts068-228-081|The Sahara in Algeria. In deserts, wind and occasional floods wear exposed rock down into sand.]]
<p>Geology is the science of these processes: how rocks form, how they change, and what they record about the planet's past. This site follows that story from the birth of the Earth to the resources we take from it today.</p>
""",
        "terms": ["molten", "weathering", "erosion", "soil", "sea level", "mountain range"],
        "quiz": [
            ("Roughly how fast do the Earth's outer layers move?", "A few centimetres a year, about the speed at which fingernails grow."),
            ("What is the difference between weathering and erosion?", "Weathering breaks rock down where it is; erosion carries the broken material away."),
            ("Why can rocks that formed under the sea be found on mountain tops?", "Slow movements of the Earth's outer layer can lift sea-floor rock high above sea level over millions of years."),
        ],
        "sources": ["usgs-dynamic", "nasa-eo"],
    },
    {
        "slug": "formation",
        "title": "How the Earth Was Formed",
        "dek": "From a cloud of gas and dust to a rocky planet with air and oceans.",
        "hero": "GSFC_20171208_Archive_e000790",
        "body": """
<p>Everything around us, including our own bodies, is built from about a hundred chemical <strong>elements</strong>. The lightest, hydrogen and helium, were made soon after the universe began. Almost all the others were made later, inside stars.</p>
<p>A star like the Sun shines because of <strong>nuclear fusion</strong> in its core: hydrogen nuclei are squeezed together to make helium, releasing enormous energy. Bigger stars go further, building carbon, oxygen, silicon and iron. When they die, often in huge explosions, they scatter these elements into space, where they mix with gas clouds that will form the next generation of stars and planets.</p>
<h2>The birth of the Solar System</h2>
<p>About 4.6 billion years ago, one such cloud of gas and dust began to collapse under its own <strong>gravity</strong>. Most of the material fell to the centre, which grew hot and dense until fusion started: the Sun was born. The rest flattened into a spinning disc around it. Within the disc, dust grains stuck together into pebbles, then boulders, then bodies kilometres across, which collided and merged to form planets.</p>
<p>Close to the young Sun it was too hot for ice to survive, so the inner planets, Mercury, Venus, Earth and Mars, were built mainly from rock and metal. Farther out, ice and gas were plentiful, and the giant planets formed.</p>
[[update:Older books often gave the Earth's age as about 4,000 million years. Radiometric dating of meteorites and the oldest Earth minerals now puts it at about 4.54 billion years.]]
<h2>A violent beginning</h2>
<p>The young Earth was hit again and again by leftover debris. One giant collision with a body about the size of Mars is thought to have thrown out the material that formed the Moon. Smaller impacts covered the surface with craters. On the Moon, with no weather and no moving plates, those craters are still visible. On Earth, erosion and plate movement have erased nearly all of them, though younger ones survive.</p>
[[photo:iss074e0208832|Meteor Crater in Arizona is about 1.2 km wide and formed roughly 50,000 years ago, one of the youngest and best-preserved impact craters on Earth.]]
<p>As the planet grew, heat from impacts and from radioactive elements melted much of it. Heavy iron sank to the centre to form the core, and lighter rock floated to the top. Gases released from the interior, together with water brought by impacts, were held by the Earth's gravity. They became the first <strong>atmosphere</strong> and, once the surface cooled, the oceans.</p>
""",
        "terms": ["element", "hydrogen", "nuclear reaction", "solar system", "orbit", "meteorite", "crater", "atmosphere", "gravity"],
        "quiz": [
            ("Where were most elements heavier than helium made?", "Inside stars, by nuclear fusion, and scattered into space when those stars died."),
            ("Why are the inner planets rocky?", "Close to the young Sun it was too hot for ice, so they formed mainly from rock and metal."),
            ("Why does the Moon have many more visible craters than the Earth?", "The Moon has no weather or moving plates, so its craters are not erased by erosion or plate movement."),
        ],
        "sources": ["nasa-ss"],
    },
    {
        "slug": "inside",
        "title": "Inside the Earth",
        "dek": "Nobody has been there, but earthquake waves have mapped it.",
        "hero": "GSFC_20171208_Archive_e001386",
        "body": """
<p>The Earth is about 12,700 km across. The deepest hole ever drilled, the Kola Superdeep Borehole in Russia, reached just over 12 km, roughly one-thousandth of the way to the centre. Everything we know about the deep interior comes from indirect evidence, above all from earthquake waves.</p>
<p>When a large earthquake happens, its <strong>shock waves</strong> travel through the whole planet and are recorded by seismometers around the world. Waves speed up, slow down, bend and reflect when they meet material of a different kind. One type of wave cannot pass through liquid at all. By comparing records from thousands of earthquakes, seismologists have built up a picture of the Earth's layers.</p>
[[diagram:layers|The Earth's layers drawn to scale. The crust is so thin that it has to be exaggerated to be seen at all.]]
<h2>The layers</h2>
<p><strong>Crust.</strong> The outermost skin, from about 5 to 10 km thick under the oceans to 30 to 70 km under the continents. It is the only layer we can sample directly.</p>
<p><strong>Mantle.</strong> Hot rock about 2,900 km thick, making up most of the Earth's volume. It is solid, but over geological time it flows extremely slowly, carrying heat up from below.</p>
<p><strong>Outer core.</strong> A layer of liquid iron and nickel about 2,200 km thick. Its swirling motion generates the Earth's magnetic field, which shields the surface from much of the Sun's harmful radiation.</p>
<p><strong>Inner core.</strong> A solid ball of iron and nickel about 1,220 km in radius. It is hotter than the outer core, roughly 5,000 to 6,000 °C, but the pressure is so great that the metal stays solid.</p>
[[update:Older textbooks often described a single rigid "shell". Geologists now call the rigid outer layer, made of the crust plus the top of the mantle, the lithosphere. It rests on the asthenosphere, a hotter and weaker part of the upper mantle that can flow slowly.]]
""",
        "terms": ["crust", "shell", "mantle", "outer core", "inner core", "shock wave", "diameter"],
        "quiz": [
            ("How do scientists know what the inside of the Earth is like?", "Mainly from the way earthquake waves travel through it, speeding up, slowing down, bending and reflecting at the boundaries between layers."),
            ("Which layer is liquid?", "The outer core. The inner core is solid because of the enormous pressure."),
            ("What generates the Earth's magnetic field?", "The movement of liquid iron in the outer core."),
        ],
        "sources": ["usgs-dynamic"],
    },
    {
        "slug": "outer-layers",
        "title": "The Outer Layers",
        "dek": "A thin, broken skin that records the planet's history.",
        "hero": "PIA14897",
        "body": """
<p>The boundary between the crust and the mantle is called the <strong>Moho</strong>, after the Croatian seismologist Andrija Mohorovičić, who found it in 1909. He noticed that earthquake waves suddenly sped up at a certain depth, a sign that they had passed into denser rock.</p>
<p>Continental crust and oceanic crust are very different. Oceanic crust is thin, dense and dark, made mostly of basalt, and is young by geological standards: almost none of it is older than about 200 million years. Continental crust is thicker, lighter and very varied, and parts of it are more than 4 billion years old.</p>
<h2>Squeezed, stretched and buried</h2>
<p>Because the lithosphere is broken into moving plates, it is constantly under <strong>stress</strong>. Where it is stretched, it cracks and thins. Where it is squeezed, it can <strong>buckle</strong> and fold into mountain ranges, or crack suddenly in an earthquake.</p>
<p>At the same time, the surface is being worn down. Rivers, glaciers and wind carry grains of rock away and lay them down as <strong>sediment</strong> in lakes, deltas and on the sea floor. As layer upon layer builds up, the lower layers are pressed and cemented into new rock.</p>
[[photo:PIA14897|The Grand Canyon, Arizona. The Colorado River has cut down through more than a kilometre of rock layers, exposing almost two billion years of Earth history.]]
<p>Because each layer records the conditions when it formed, a sequence of rock layers is like an archive. Reading that archive, working out what happened, in what order and when, is the core of <strong>geology</strong>.</p>
""",
        "terms": ["Moho", "borehole", "sediment", "deposit", "stress", "buckle", "geology"],
        "quiz": [
            ("What is the Moho?", "The boundary between the crust and the mantle, found from a sudden change in the speed of earthquake waves."),
            ("Why is almost no oceanic crust older than about 200 million years?", "It is continually made at mid-ocean ridges and destroyed where it sinks back into the mantle at ocean trenches."),
            ("How does sediment become rock?", "Layers build up, and the lower ones are compressed and cemented together over time."),
        ],
        "sources": ["usgs-dynamic", "nasa-eo"],
    },
    {
        "slug": "crystals",
        "title": "The World of Crystals",
        "dek": "Rocks are made of minerals, and minerals are made of crystals.",
        "hero": "S70-20954",
        "body": """
<p>Almost all rocks are mixtures of <strong>minerals</strong>. A mineral is a naturally formed solid with a definite chemical make-up and an ordered internal structure: its atoms are stacked in a regular, repeating pattern called a <strong>crystal</strong> lattice. That pattern controls the mineral's shape, hardness and the way it breaks.</p>
[[diagram:lattice|In a crystal, atoms are fixed in a repeating pattern. Different patterns give different minerals.]]
<h2>The crust's building blocks</h2>
<p>Just two elements, oxygen (about 46 per cent by mass) and silicon (about 28 per cent), make up roughly three-quarters of the Earth's crust. Not surprisingly, the most common minerals are <strong>silicates</strong>, built around a unit of one silicon atom surrounded by four oxygen atoms. Feldspars are the most abundant silicate group; <strong>quartz</strong> (silicon dioxide) is another very common one. Granite, for instance, is mostly feldspar and quartz with a little dark mica.</p>
<p>Some rocks are made almost entirely of a single mineral. Limestone and chalk are mostly <strong>calcite</strong> (calcium carbonate), and rock salt is halite. Others contain valuable metals: an <strong>ore</strong> is a rock rich enough in a metal to be worth mining, such as galena for lead.</p>
<h2>Seeing crystals</h2>
<p>Most mineral grains are tiny. To identify them, geologists grind a slice of rock until it is about 0.03 mm thick, a <strong>thin section</strong> that light can pass through, and examine it under a microscope between two polarizing filters set at right angles. Each mineral changes the light in its own way, so the grains light up in characteristic colours.</p>
[[photo:S70-20954|Thin sections of Moon rocks returned by Apollo 12. Viewed in polarized light, individual crystals show up in vivid colours.]]
<p>You can try a simple version at home. Hold one pair of polarized sunglasses in front of another and rotate it until the light almost disappears. Put a piece of clear sticky tape or a crumpled plastic wrapper between them, and it will glow with colours.</p>
""",
        "terms": ["atom", "compound", "mineral", "crystal", "silicate", "quartz", "calcite", "feldspar", "ore", "thin section"],
        "quiz": [
            ("Which two elements make up about three-quarters of the crust?", "Oxygen and silicon."),
            ("What makes a mineral a crystal?", "Its atoms are arranged in a regular, repeating pattern."),
            ("Why do geologists use polarizing filters on a microscope?", "Each mineral changes polarized light in a characteristic way, which helps identify it."),
        ],
        "sources": ["usgs-dynamic"],
    },
    {
        "slug": "rocks-from-below",
        "title": "Rocks from Inside the Earth",
        "dek": "Rocks that were melted, or squeezed and baked without melting.",
        "hero": "PIA03893",
        "body": """
<p>Geologists sort rocks into three great families according to how they formed. Sedimentary rocks are covered in the chapter on strata. The other two families form deep underground.</p>
<h2>Igneous rocks</h2>
<p><strong>Igneous rocks</strong> crystallize from molten rock. If magma cools slowly, deep underground, the crystals have time to grow large, giving coarse-grained rocks such as granite and gabbro. If it erupts and cools quickly at the surface, the crystals stay tiny, as in basalt. If it cools almost instantly, there is no time for crystals at all and the result is natural glass, obsidian.</p>
<h2>Metamorphic rocks</h2>
<p><strong>Metamorphic rocks</strong> are existing rocks transformed by heat and pressure without melting. Minerals <strong>recrystallize</strong> into new, more stable forms. Mudstone becomes slate when it is squeezed, then schist, with glittering flakes of mica and often red garnet crystals, at higher temperatures. At higher temperatures still, it becomes banded gneiss. Limestone turns into marble.</p>
<h2>Folding and faulting</h2>
<p>The same forces that cause metamorphism also deform rocks on a large scale. Slow, steady sideways pressure bends layers into <strong>folds</strong>, from tiny crumples to arches many kilometres across. Where rock is too brittle to bend, it breaks, and the two sides slip past each other along a <strong>fault</strong>. Sudden slip on a fault is what causes an earthquake.</p>
<div class="figpair">
[[diagram:fold|Sideways pressure folds rock layers into upfolds and downfolds.]]
[[diagram:fault|Where rock breaks, the two sides slip along a fault.]]
</div>
[[photo:PIA03893|Satellite view of the Anti-Atlas Mountains of Morocco, in false colour. Layers of limestone, sandstone and other sediments that once lay flat on an ocean floor have been crumpled by the collision of Africa and Europe.]]
""",
        "terms": ["igneous rock", "metamorphic rock", "schist", "gneiss", "garnet", "mica", "folding", "faulting", "recrystallize"],
        "quiz": [
            ("Why does granite have large crystals and basalt small ones?", "Granite cooled slowly deep underground, giving crystals time to grow; basalt cooled quickly at the surface."),
            ("Does metamorphic rock form by melting?", "No. It forms when existing rock is changed by heat and pressure while staying solid."),
            ("What is the difference between a fold and a fault?", "A fold is a bend in rock layers; a fault is a break along which the rocks have moved."),
        ],
        "sources": ["usgs-dynamic"],
    },
    {
        "slug": "plates",
        "title": "Plates",
        "dek": "The Earth's outer shell is a jigsaw of moving pieces.",
        "hero": "iss072e397138",
        "body": """
<p>The lithosphere is broken into seven or eight major <strong>plates</strong> and many smaller ones. They fit together like a cracked eggshell and move relative to each other at a few centimetres a year. Almost all earthquakes, volcanoes and mountain building happen along their edges. This idea, <strong>plate tectonics</strong>, became the unifying theory of geology in the 1960s.</p>
[[diagram:plates|At a mid-ocean ridge, plates pull apart and new crust forms. At an ocean trench, one plate sinks beneath another.]]
<h2>Three kinds of boundary</h2>
<p><strong>Divergent boundaries</strong>, where plates pull apart. Most are <strong>mid-ocean ridges</strong>, a chain of underwater volcanic mountains that runs for about 65,000 km around the globe. Magma rises into the gap and freezes into new oceanic crust.</p>
<p><strong>Convergent boundaries</strong>, where plates move towards each other. If one plate carries dense oceanic crust, it sinks beneath the other in a process called <strong>subduction</strong>, forming a deep <strong>ocean trench</strong>. As the sinking plate heats up, water released from it helps melt the mantle above, feeding chains of volcanoes such as the Andes and Japan. If both plates carry continents, neither sinks easily, and the crust crumples into great mountain ranges.</p>
<p><strong>Transform boundaries</strong>, where plates slide past each other sideways, as along the San Andreas Fault in California. Crust is neither made nor destroyed there, but the grinding motion causes frequent earthquakes.</p>
[[photo:iss072e397138|The Himalayas, seen from the International Space Station, separate the high, dry Tibetan Plateau (top) from the cloud-covered plains of India.]]
<p>The Himalayas are the result of a continent-to-continent collision. The plate carrying India has been pushing into Asia for about 50 million years. It is still moving north at a few centimetres a year, and the mountains are still rising, though erosion wears them down almost as fast.</p>
""",
        "terms": ["plate", "magma", "mid-ocean ridge", "ocean trench", "subduction", "continental crust", "oceanic crust", "Himalayas"],
        "quiz": [
            ("What happens at a mid-ocean ridge?", "Plates pull apart, magma rises into the gap, and new oceanic crust forms."),
            ("Why does oceanic crust sink at subduction zones?", "It is denser than continental crust, so it is the plate that goes down."),
            ("Why are the Himalayas still rising?", "The Indian plate is still pushing into Asia."),
        ],
        "sources": ["usgs-dynamic"],
    },
    {
        "slug": "drifting-continents",
        "title": "Drifting Continents",
        "dek": "How a once-ridiculed idea became the foundation of modern geology.",
        "hero": "as17-148-22718",
        "body": """
<p>Look at a world map and the coastlines of South America and Africa seem to fit together like jigsaw pieces. In 1915 the German scientist <strong>Alfred Wegener</strong> argued that this was no accident. In his book <em>The Origin of Continents and Oceans</em> he proposed that the continents had once been joined in a single supercontinent, which he called <strong>Pangaea</strong>, and had since drifted apart.</p>
<p>His evidence was strong. Matching rock formations and mountain belts line up across the Atlantic. Identical <strong>fossils</strong> of land plants and reptiles that could not have crossed an ocean are found on continents now thousands of kilometres apart. Traces of ancient glaciers appear in places that are now tropical.</p>
<h2>Why it took fifty years</h2>
<p>Most geologists rejected <strong>continental drift</strong> because Wegener could not explain what force could push continents through solid ocean floor. The answer came from mapping the sea bed after the Second World War. Scientists found the mid-ocean ridges, discovered that the ocean floor gets steadily older away from them, and found matching stripes of magnetism recorded in the rock on either side. The ocean floor itself was spreading. Continents do not plough through the oceans; they ride along on moving plates.</p>
[[update:Pangaea began to break apart about 200 million years ago. The Atlantic Ocean is still widening, by a few centimetres a year.]]
[[photo:iss071e183804|At the north end of the Red Sea, the Gulf of Aqaba (left) and the Gulf of Suez (right) frame the Sinai Peninsula. The Red Sea is a young ocean opening up as Arabia pulls away from Africa.]]
<h2>An ocean being born</h2>
<p>The Red Sea shows what the early Atlantic must have looked like. It lies in a <strong>rift</strong>, a long crack where the Arabian plate is pulling away from Africa. The rift continues north along the Gulf of Aqaba and the Dead Sea, and south into the East African Rift Valley. Given enough time, the Red Sea may widen into a full ocean.</p>
[[diagram:rift|A rift: as two plates pull apart, the land between them sinks and the sea floods in.]]
""",
        "terms": ["continental drift", "Alfred Wegener", "fossil", "Pangaea", "rift", "Red Sea", "Atlantic Ocean"],
        "quiz": [
            ("What evidence did Wegener use for continental drift?", "The fit of coastlines, matching rocks and mountain belts across oceans, identical fossils on separate continents, and traces of ancient glaciers in now-tropical places."),
            ("Why was his idea rejected at first?", "He could not explain what force moved the continents."),
            ("Which discovery finally explained drift?", "Sea-floor spreading at mid-ocean ridges, shown by the age and magnetic stripes of the ocean floor."),
        ],
        "sources": ["usgs-dynamic"],
    },
    {
        "slug": "moving-map",
        "title": "The Moving Map",
        "dek": "Continents travel through climates, and the rocks remember.",
        "hero": "PIA03424",
        "body": """
<p>Because plates move, every continent has travelled across the globe over its history. The rocks of a single country can record deserts, tropical swamps and ice sheets, not because the climate in one place changed so dramatically, but because the land itself moved through different climate zones.</p>
<p>Britain is a good example. Its coal formed from swamp forests that grew near the equator about 300 million years ago. Its red sandstones record hot deserts when it lay in the dry belt north of the equator. Later it sat under warm, shallow seas full of life, and only recently has it reached its present northern position.</p>
<h2>Shelves and shallow seas</h2>
<p>Continents do not end at the shoreline. Most are fringed by a <strong>continental shelf</strong>, a gently sloping platform covered by shallow sea, before the sea floor drops away to the deep ocean. Seas such as the North Sea and the Persian Gulf lie on flooded continental crust. Because the shelves are so flat, even a small rise or fall in sea level floods or exposes huge areas.</p>
[[diagram:shelf|A continental shelf: the flooded edge of a continent, covered by a shallow sea.]]
<h2>Ice ages</h2>
<p>Over the last 2.6 million years the Earth has swung repeatedly between cold <strong>glacial periods</strong> and warmer interglacials like the present one. At the coldest times, ice sheets covered much of North America and northern Europe, and sea level was about 120 metres lower than today. Glaciers carved deep, steep-sided <strong>U-shaped valleys</strong>. Where the sea later flooded them, they became <strong>fjords</strong>.</p>
[[photo:PIA03424|The coast of northern Norway and the Lofoten Islands, seen by the Terra satellite. The deep inlets are fjords: valleys carved by ice-age glaciers and later flooded by the sea.]]
""",
        "terms": ["continental shelf", "shelf sea", "uplift", "climate", "coal seam", "arid", "ice age", "fjord", "U-shaped valley"],
        "quiz": [
            ("Why can one country contain rocks from deserts, tropical swamps and ice sheets?", "The land has moved through different climate zones as its plate drifted."),
            ("What is a continental shelf?", "The gently sloping, shallow-sea-covered edge of a continent, before the drop to the deep ocean."),
            ("How does a fjord form?", "A glacier carves a deep U-shaped valley, which the sea floods after the ice melts."),
        ],
        "sources": ["nasa-eo"],
    },
    {
        "slug": "strata",
        "title": "Strata",
        "dek": "Layered rocks are pages of Earth history, stacked in order.",
        "hero": "iss074e0301902",
        "body": """
<p><strong>Sedimentary rocks</strong> form at the Earth's surface from sediment: sand, mud, the shells and skeletons of living things, or minerals that crystallize out of water. As it is carried by rivers, wind or currents, sediment is sorted by size and weight, so that beaches collect sand, quiet lagoons collect mud, and evaporating seas leave salt. Buried and compressed, these deposits harden into sandstone, mudstone, limestone and rock salt.</p>
<p>Each layer is a <strong>stratum</strong>, and together they are <strong>strata</strong>. The type of rock, its grain size, and features such as ripple marks or mud cracks tell geologists what the environment was like when it was laid down.</p>
[[diagram:strata|In undisturbed strata, the oldest layer is at the bottom and the youngest at the top.]]
<h2>Putting events in order</h2>
<p>The simplest rule in geology is <strong>superposition</strong>: in a sequence of layers that has not been overturned, each layer is younger than the one beneath it. Combined with the fossils in each layer, this allowed nineteenth-century geologists to put rocks around the world in order and build the first geological timescale, long before anyone could put numbers on it. This gives the <strong>relative age</strong> of rocks.</p>
<h2>Putting numbers on time</h2>
<p>Since the early twentieth century, <strong>radiometric dating</strong> has given absolute ages. Some elements, such as uranium, decay into others at a known, steady rate. By measuring how much of the original element remains in a mineral and how much has turned into its product, scientists can calculate how long ago the mineral formed. The oldest known pieces of the Earth, tiny zircon crystals from Western Australia, are about 4.4 billion years old.</p>
""",
        "terms": ["stratum", "sedimentary rock", "limestone", "ammonite", "superposition", "relative age", "radioactive dating", "chalk"],
        "quiz": [
            ("What does the rule of superposition say?", "In undisturbed layers, the oldest is at the bottom and the youngest at the top."),
            ("How does radiometric dating work?", "Radioactive elements decay at a known rate, so the ratio of original element to its decay product shows how long ago a mineral formed."),
            ("What can a sedimentary layer tell us?", "What the environment was like when it formed, from its rock type, grain size, structures and fossils."),
        ],
        "sources": ["ics", "usgs-dynamic"],
    },
    {
        "slug": "mountains",
        "title": "Mountains",
        "dek": "Built by colliding plates, destroyed by water and ice.",
        "hero": "iss069e025225",
        "body": """
<p>Most great mountain ranges form where plates converge. When an ocean plate sinks beneath a continent, the edge of the continent is squeezed and thickened, and volcanoes grow on top. The Andes formed this way. When two continents collide, as India and Asia did, or Africa and Europe, the crust between them is folded, stacked and thickened into ranges such as the Himalayas and the Alps.</p>
<h2>Roots like an iceberg</h2>
<p>Continental crust is lighter than the mantle beneath it and floats on it, a little like an iceberg on water. A mountain range therefore has a deep <strong>root</strong> of thickened crust extending far down into the mantle. Under the Himalayas the crust is roughly twice its normal thickness. As erosion removes rock from the top, the root slowly rises to replace it, which is why rocks that formed deep underground end up exposed on mountain tops.</p>
[[diagram:root|A mountain range floats on denser rock below, with a deep root of light continental crust.]]
[[photo:iss069e025225|The Swiss Alps from the International Space Station. The Alps formed as Africa pushed north into Europe, folding and stacking layers of rock.]]
<h2>The life of a mountain range</h2>
<p>Mountains are attacked as soon as they rise. Frost, glaciers and rivers cut them into peaks and valleys and carry them away as sediment. Young ranges such as the Himalayas are high and jagged. Old ranges such as the Appalachians in North America were once as high as the Alps but have been worn down over hundreds of millions of years into rounded hills.</p>
[[photo:s31-151-113|The southern Appalachians from the Space Shuttle. Their long parallel ridges are the worn-down stumps of folds formed more than 250 million years ago.]]
[[update:Mount Everest's official height is 8,848.86 metres, agreed by China and Nepal in 2020. The mountain is still rising by a few millimetres a year.]]
""",
        "terms": ["fold mountains", "mountain root", "density", "volcanic chain", "Andes", "Alps", "ancient mountains", "plain"],
        "quiz": [
            ("How did the Andes form?", "An ocean plate sinking beneath South America squeezed and thickened the continent's edge and fed volcanoes."),
            ("What is a mountain root?", "The thick, light crust that extends deep beneath a mountain range, like the hidden part of an iceberg."),
            ("Why are the Appalachians lower and more rounded than the Himalayas?", "They are far older and have been eroded for hundreds of millions of years."),
        ],
        "sources": ["usgs-dynamic", "nasa-eo"],
    },
    {
        "slug": "volcanoes",
        "title": "Volcanoes",
        "dek": "Where molten rock reaches the surface, and why some eruptions explode.",
        "hero": "iss013e24184",
        "body": """
<p>A volcano is any opening in the crust where molten rock, gas and ash escape. Below ground the molten rock is called <strong>magma</strong>; once it reaches the surface it is <strong>lava</strong>. Magma collects in chambers a few kilometres down and rises through cracks when its pressure builds.</p>
[[diagram:volcano|Inside a volcano: magma rises from a chamber through a vent and erupts as lava, ash and gas.]]
<h2>Runny or sticky</h2>
<p>How a volcano erupts depends mainly on its magma. <strong>Basalt</strong> magma is low in silica, hot and runny. Its gas escapes easily, so eruptions are usually gentle, with fountains and rivers of lava that build broad <strong>shield volcanoes</strong> such as those of Hawaii and Iceland. Magma richer in silica, such as <strong>andesite</strong> and rhyolite, is thick and sticky. It traps gas, and when the pressure is finally released, the gas expands violently and blasts the magma into ash and <strong>pumice</strong>. These explosive volcanoes typically build steep cones of layered lava and ash, such as Mount Fuji.</p>
<h2>Where volcanoes are</h2>
<p>Most volcanoes lie along plate boundaries. Along mid-ocean ridges, mostly hidden under the sea, basalt erupts as the plates separate. Above subduction zones, chains of explosive volcanoes form, including the <strong>Ring of Fire</strong> around the Pacific, which hosts most of the world's active volcanoes. A few volcanoes, such as Hawaii, sit over <strong>hotspots</strong> far from any boundary, where hot rock rises from deep in the mantle.</p>
[[photo:iss013e24184|An ash plume drifts from Cleveland Volcano in the Aleutian Islands of Alaska, part of the Ring of Fire. An astronaut on the International Space Station first reported this eruption to the Alaska Volcano Observatory.]]
[[update:About 1,350 volcanoes on land are considered potentially active, according to the USGS. In a typical year, roughly 50 to 70 of them erupt, according to the Smithsonian Global Volcanism Program.]]
[[photo:iss074e0459342|Mount Fuji, Japan, seen from almost directly above. Its steep cone is built from layers of lava and ash above a subduction zone.]]
""",
        "terms": ["eruption", "lava", "basalt", "andesite", "shield volcano", "hotspot", "Ring of Fire", "obsidian", "pumice"],
        "quiz": [
            ("Why are some eruptions gentle and others explosive?", "Runny, low-silica magma lets gas escape easily; sticky, high-silica magma traps gas until it bursts out violently."),
            ("What is a hotspot?", "A place where hot rock rises from deep in the mantle, producing volcanoes away from plate boundaries, as in Hawaii."),
            ("What is the Ring of Fire?", "The chain of volcanoes and earthquake zones around the Pacific Ocean, above subduction zones."),
        ],
        "sources": ["usgs-volcano", "gvp"],
    },
    {
        "slug": "earthquakes",
        "title": "Earthquakes",
        "dek": "Stored-up strain released in seconds.",
        "hero": "PIA02786",
        "body": """
<p>Along a fault, the rocks on either side are pushed in different directions by plate movement, but friction holds them locked together. <strong>Strain</strong> builds up, sometimes for centuries, until the rock suddenly gives way. The two sides lurch past each other, and the stored energy radiates out as seismic waves. That sudden release is an earthquake.</p>
<p>Most earthquakes happen within the brittle upper crust, at depths of a few to a few tens of kilometres. Shallow earthquakes generally do the most damage. In subduction zones, earthquakes can happen down to about 700 km deep as the sinking plate breaks up.</p>
[[photo:PIA02786|The San Andreas Fault, a transform boundary where the Pacific plate slides past the North American plate. This radar-based perspective view shows the fault as a straight valley across the Carrizo Plain.]]
<h2>Measuring earthquakes</h2>
<p>Earthquakes are recorded by <strong>seismographs</strong>. Their size is given as a magnitude. Today scientists use the moment magnitude scale, which measures the total energy released. Each step of one whole number means about 32 times more energy. The largest earthquake ever recorded struck Chile in 1960, with a magnitude of 9.5.</p>
[[diagram:seismograph|A seismograph record. Small tremors are followed by the large waves of the main shock.]]
<h2>Effects</h2>
<p>Most damage comes from shaking that brings down buildings, and from <strong>landslides</strong> and fires. Earthquakes under the sea can lift or drop the sea floor and set off a <strong>tsunami</strong>, a series of waves that can cross whole oceans. The Indian Ocean tsunami of 2004, caused by a magnitude 9.1 earthquake off Sumatra, killed more than 200,000 people in fourteen countries.</p>
[[update:Older books sometimes claimed that over a million earthquakes are detected each year. The USGS estimates that several hundred thousand are detectable each year, of which about 100,000 can be felt and around 100 cause damage.]]
""",
        "terms": ["tremor", "seismograph", "fault line", "tsunami", "landslide", "brittle", "strain"],
        "quiz": [
            ("What actually happens in an earthquake?", "Rocks locked together on a fault slip suddenly, releasing built-up strain as seismic waves."),
            ("How much more energy does a magnitude 7 earthquake release than a magnitude 6?", "About 32 times more."),
            ("How can an earthquake cause a tsunami?", "Sudden movement of the sea floor displaces the water above it, creating waves that spread across the ocean."),
        ],
        "sources": ["usgs-eq"],
    },
    {
        "slug": "resources",
        "title": "Treasures from the Earth",
        "dek": "Gems, metals, building stone and fuel, and what they cost us.",
        "hero": "iss015e29867",
        "body": """
<p>Almost every material object we use was dug or pumped from the ground. The same geological processes described in this guide concentrate useful materials in particular places.</p>
<h2>Gems and metals</h2>
<p><strong>Diamonds</strong> form more than 150 km down, in the mantle, and are carried up rapidly by rare, deep-sourced eruptions. Other gems grow in metamorphic rocks or in the last, fluid-rich stages of cooling magma. Many metal ores form where hot water circulating through the crust dissolves metals and deposits them in veins as it cools. Copper deposits above old subduction zones are a major example.</p>
[[photo:iss015e29867|Bingham Canyon Mine in Utah, seen from the International Space Station. The open pit is more than 4 km wide and about 1.2 km deep, and has produced large amounts of copper, gold and molybdenum.]]
<h2>Building materials</h2>
<p>Sedimentary rocks supply most of our building materials. Limestone is the main ingredient of cement. Sand and gravel make concrete and glass, and clay is used for bricks and ceramics. By weight, sand and gravel are the most extracted materials on Earth.</p>
<h2>Fossil fuels</h2>
<p><strong>Coal</strong> formed from plant material that built up in swamps as <strong>peat</strong> and was then buried and compressed over millions of years. <strong>Oil</strong> and natural gas formed mainly from the remains of marine <strong>plankton</strong>, buried in sea-floor mud and slowly cooked by the Earth's heat. These fuels took millions of years to form and are being used up in a few centuries.</p>
[[update:Burning fossil fuels releases carbon dioxide that was stored underground for millions of years. It is the main cause of the rise in atmospheric carbon dioxide since the industrial revolution and of present-day global warming. Many older books predicted oil would run short around the year 2000; that did not happen. Today the pressing issue is the climate impact of burning it.]]
""",
        "terms": ["gemstone", "diamond", "jade", "fossil fuel", "peat", "coal", "oil", "plankton", "uranium"],
        "quiz": [
            ("Where do diamonds form?", "Deep in the mantle, more than 150 km down, before being carried up by rare deep-sourced eruptions."),
            ("What did oil and natural gas mostly form from?", "The remains of marine plankton buried in sea-floor mud and slowly heated."),
            ("Why are fossil fuels called non-renewable?", "They take millions of years to form but are being used up in centuries."),
        ],
        "sources": ["nasa-eo"],
    },
    {
        "slug": "timescale",
        "title": "The Geological Timescale",
        "dek": "The calendar of Earth history, and how small our part of it is.",
        "hero": None,
        "body": """
<p>Geologists divide Earth history into a hierarchy of units: eons, <strong>eras</strong>, <strong>periods</strong> and epochs. The boundaries usually mark major changes in the fossil record, such as the appearance of new groups of organisms or mass extinctions. The names are agreed internationally and the dates are refined as dating methods improve.</p>
[[diagram:timescale|The geological timescale drawn to scale. The Precambrian takes up nearly nine-tenths of Earth history.]]
<h2>The big divisions</h2>
<p><strong>Precambrian</strong> (about 4,540 to 539 million years ago). Almost nine-tenths of Earth history. Life appears at least 3.5 billion years ago, but for most of this time it is microscopic. Oxygen builds up in the atmosphere around 2.4 billion years ago.</p>
<p><strong>Palaeozoic era</strong> (539 to 252 million years ago), "ancient life". Animals with shells and skeletons appear in the Cambrian. Fish, land plants, insects, amphibians and early reptiles follow. It ends with the largest mass extinction known, at the end of the Permian.</p>
<p><strong>Mesozoic era</strong> (252 to 66 million years ago), "middle life". This is the age of dinosaurs, including the Triassic, <strong>Jurassic</strong> and Cretaceous periods. Pangaea breaks apart. It ends when an asteroid strikes what is now Mexico's Yucatán Peninsula.</p>
<p><strong>Cenozoic era</strong> (66 million years ago to today), "new life". Mammals and flowering plants spread. The Quaternary period, the last 2.58 million years, brings repeated ice ages and the rise of our own species. We live in the <strong>Holocene</strong> epoch, which began about 11,700 years ago at the end of the last glacial period.</p>
[[update:Many older charts used the name "Tertiary" and dated the start of the Cambrian to about 570 million years ago. The International Commission on Stratigraphy now divides the Tertiary into the Palaeogene and Neogene periods and dates the start of the Cambrian to about 538.8 million years ago.]]
<p>If the whole history of the Earth were squeezed into one calendar year, the dinosaurs would die out on about 26 December, and our own species would appear only about half an hour before midnight on 31 December.</p>
""",
        "terms": ["geological timescale", "era", "period", "Precambrian", "Palaeozoic", "Mesozoic", "Cenozoic", "Jurassic", "Holocene"],
        "quiz": [
            ("Roughly what share of Earth history is the Precambrian?", "Almost nine-tenths."),
            ("What ended the Mesozoic era?", "An asteroid impact about 66 million years ago, which wiped out the dinosaurs apart from birds."),
            ("Which epoch do we live in, and when did it begin?", "The Holocene, which began about 11,700 years ago."),
        ],
        "sources": ["ics"],
    },
]
