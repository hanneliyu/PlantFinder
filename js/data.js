// ===== Plant database =====
// Council fields (height, sun, water, soil, vegetation zone, flowering) come from
// Inner West Council "Native Plants of the Inner West" list (Nature for Backyards).
// Width, toxicity, allergy and pot size are general horticultural reference values — verify before use.
// Months: 1 = Jan … 12 = Dec. m(9,2) = Sep→Feb (wraps).
function m(a, b) { const r = []; let i = a; while (true) { r.push(i); if (i === b) break; i = i % 12 + 1; } return r; }

const COUNCILS = {
  "inner-west": {
    name: "Inner West Council",
    list: "Native Plants of the Inner West (Nature for Backyards)",
    url: "https://www.innerwest.nsw.gov.au/trees-gardens-and-wildlife/native-plants-inner-west",
    pdf: "https://www.innerwest.nsw.gov.au/sites/default/files/2026-02/Native%20Plants%20of%20the%20Inner%20West%20list%20FINAL%20181120%20(10).pdf"
  }
};

const ZONES = {
  SSFW: "Sandstone Slopes Forest & Woodland",
  STIF: "Sydney Turpentine-Ironbark Forest",
  WC: "Wetland Complex (Swamp Oak, saltmarsh, reedland)"
};
const ALLZ = ["SSFW", "STIF", "WC"];

// tox: safe | low | caution | toxic     allergy: low | moderate | high
const PLANTS = [
  // ---------- Climbers ----------
  { type: "Climber", sci: "Hardenbergia violacea", common: "Purple Coral Pea", h: [1.5, 3], w: [1.5, 3], sun: ["FS"], water: "LW", soil: "Any", zones: ["SSFW", "STIF"], months: m(8, 10), colour: "Purple", hex: "#6B3FA0", tox: ["low", "Not known to be toxic. Pea-family seeds are best not eaten."], allergy: ["low", "Insect-pollinated."], pot: "140 mm", note: "Twining climber or scrambling groundcover. Good on fences and trellis; also copes with part shade." },
  { type: "Climber", sci: "Hibbertia scandens", common: "Climbing Guinea Flower", h: [1, 3], w: [1, 2], sun: ["FS", "PS"], water: "LW", soil: "Any", zones: ["SSFW", "STIF"], months: m(9, 3), colour: "Bright yellow", hex: "#E3B400", tox: ["safe", "No known toxicity."], allergy: ["low", "Insect-pollinated."], pot: "140 mm", note: "Also works as a groundcover or spilling over low walls. Salt tolerant." },
  { type: "Climber", sci: "Kennedia rubicunda", common: "Dusky Coral Pea", h: [2, 4], w: [3, 5], sun: ["FS"], water: "LW", soil: "Any", zones: ["SSFW", "STIF"], months: m(8, 11), colour: "Dark red", hex: "#8E1F2B", tox: ["low", "Not known to be toxic. Pea-family seeds are best not eaten."], allergy: ["low", "Bird-pollinated."], pot: "140 mm", note: "Vigorous. Give it strong support and room; good for covering long fences." },
  { type: "Climber", sci: "Pandorea pandorana", common: "Wonga Wonga Vine", h: [3, 6], w: [3, 6], sun: ["FS", "PS"], water: "LW", soil: "Any", zones: ["SSFW", "STIF"], months: m(6, 12), colour: "Cream-white", hex: "#EFE6CF", tox: ["safe", "No known toxicity."], allergy: ["low", "Insect-pollinated."], pot: "140–200 mm", note: "Woody climber for pergolas and large fences. Prune after flowering to control size." },
  { type: "Climber", sci: "Billardiera scandens", common: "Apple Berry", h: [1, 2], w: [1, 2], sun: ["PS", "S"], water: "MW", soil: "Any", zones: ["SSFW", "STIF"], months: m(9, 12), colour: "Cream", hex: "#EADFB4", tox: ["safe", "Ripe fruit is edible (bush food)."], allergy: ["low", "Insect-pollinated."], pot: "Tubestock / 140 mm", note: "Light twiner that won't smother other plants. Purple fruit." },
  { type: "Climber", sci: "Clematis aristata", common: "Old Man's Beard", h: [3, 5], w: [2, 4], sun: ["PS"], water: "MW", soil: "Any – clay", zones: ["STIF"], months: m(8, 11), colour: "White", hex: "#F3F3EE", tox: ["caution", "Sap and leaves contain irritant compounds (protoanemonin). Can irritate skin and is harmful if eaten — keep pets from chewing it."], allergy: ["low", "Sap may irritate skin; wear gloves when pruning."], pot: "140 mm", note: "Fluffy silver seed heads follow the flowers." },

  // ---------- Groundcovers, grasses, strappy, sedges ----------
  { type: "Strappy", sci: "Dianella caerulea", common: "Blue Flax-lily", h: [0.5, 0.5], w: [0.4, 0.6], sun: ["FS", "PS", "S"], water: "LW", soil: "Any", zones: ["STIF"], months: m(9, 2), colour: "Blue", hex: "#3E5FB8", tox: ["low", "Low risk; berries not recommended for pets or small children."], allergy: ["low", "Insect-pollinated."], pot: "140 mm", note: "Tough strappy plant for borders and mass planting. Purple berries attract birds." },
  { type: "Strappy", sci: "Lomandra longifolia", common: "Mat Rush", h: [1, 1], w: [1, 1], sun: ["FS", "PS", "S"], water: "LW", soil: "Any", zones: ["STIF"], months: m(10, 1), colour: "Yellow (tiny, scented)", hex: "#D9B84A", tox: ["safe", "No known toxicity."], allergy: ["low", "Low pollen."], pot: "140 mm", note: "Very hardy. Good for slopes, verges and erosion control. Leaf edges are sharp." },
  { type: "Grass", sci: "Themeda triandra", common: "Kangaroo Grass", h: [0.75, 0.75], w: [0.4, 0.6], sun: ["FS", "PS"], water: "LW", soil: "Any", zones: ["SSFW", "STIF"], months: m(10, 3), colour: "Rusty-purple seed heads", hex: "#8A4B3A", tox: ["safe", "No known toxicity."], allergy: ["moderate", "Wind-pollinated grass; can affect hay fever sufferers in spring–summer."], pot: "Tubestock / 140 mm", note: "Cut back or thin in late winter to keep it tidy." },
  { type: "Grass", sci: "Cymbopogon refractus", common: "Barbed Wire Grass", h: [0.6, 0.6], w: [0.3, 0.5], sun: ["FS", "PS"], water: "LW", soil: "Any", zones: ["STIF"], months: m(12, 4), colour: "Reddish seed heads", hex: "#9A5A3C", tox: ["safe", "No known toxicity."], allergy: ["moderate", "Wind-pollinated grass."], pot: "Tubestock", note: "Tufted, wiry stems with barbed seed heads. Very drought tolerant." },
  { type: "Grass", sci: "Microlaena stipoides", common: "Weeping Grass", h: [0.3, 0.3], w: [0.3, 0.6], sun: ["PS", "S"], water: "MW", soil: "Any", zones: ["SSFW", "STIF"], months: m(1, 12), colour: "Green seed heads", hex: "#7C9A5B", tox: ["safe", "No known toxicity."], allergy: ["moderate", "Wind-pollinated grass."], pot: "Tubestock", note: "Shade-tolerant native lawn alternative; can be mown." },
  { type: "Groundcover", sci: "Dichondra repens", common: "Kidney Weed", h: [0.05, 0.05], w: [0.5, 1], sun: ["FS", "PS", "S"], water: "MW", soil: "Any", zones: ["STIF"], months: m(9, 2), colour: "Tiny white", hex: "#F1F1EA", tox: ["safe", "No known toxicity."], allergy: ["low", "Low pollen."], pot: "Tubestock", note: "Lawn alternative for light foot traffic and between stepping stones." },
  { type: "Groundcover", sci: "Viola hederacea", common: "Native Violet", h: [0.15, 0.15], w: [0.5, 1], sun: ["PS", "S"], water: "MW", soil: "Any – sand", zones: ["WC"], months: m(9, 2), colour: "White & purple", hex: "#8F7CC4", tox: ["safe", "Flowers are edible."], allergy: ["low", "Insect-pollinated."], pot: "Tubestock", note: "Spreads by runners. Great under trees in moist shade." },
  { type: "Groundcover", sci: "Carpobrotus glaucescens", common: "Pig Face", h: [0.2, 0.2], w: [1, 2], sun: ["FS", "PS", "S"], water: "LW", soil: "Well-drained", zones: ["WC"], months: m(8, 4), colour: "Pink-purple", hex: "#C2449A", tox: ["safe", "Fruit is edible (bush food)."], allergy: ["low", "Insect-pollinated."], pot: "140 mm", note: "Succulent. Good for coastal, dry and bank planting." },
  { type: "Groundcover", sci: "Scaevola albida", common: "Fanflower", h: [0.3, 0.3], w: [0.5, 1], sun: ["FS", "PS", "S"], water: "MW", soil: "Any", zones: ["SSFW"], months: m(10, 3), colour: "Mauve", hex: "#9B86C9", tox: ["safe", "No known toxicity."], allergy: ["low", "Insect-pollinated."], pot: "140 mm", note: "Long flowering. Good for edging and spilling over walls." },
  { type: "Groundcover", sci: "Commelina cyanea", common: "Scurvy Weed", h: [0.2, 0.2], w: [0.5, 1], sun: ["PS", "S"], water: "MW", soil: "Any", zones: ALLZ, months: m(12, 5), colour: "Blue", hex: "#2F6FD0", tox: ["safe", "No known toxicity."], allergy: ["low", "Insect-pollinated."], pot: "Tubestock", note: "Fast-spreading groundcover for moist shade. Can be vigorous." },
  { type: "Groundcover", sci: "Wahlenbergia gracilis", common: "Australian Bluebell", h: [0.3, 0.3], w: [0.2, 0.3], sun: ["FS", "PS"], water: "LW", soil: "Any", zones: ALLZ, months: m(1, 12), colour: "Sky blue", hex: "#6FA3DE", tox: ["safe", "No known toxicity."], allergy: ["low", "Insect-pollinated."], pot: "Tubestock", note: "Delicate. Self-seeds into gaps between other plants." },
  { type: "Groundcover", sci: "Tetragonia tetragonioides", common: "Warrigal Greens", h: [0.2, 0.2], w: [1, 2], sun: ["PS", "S"], water: "MW", soil: "Any – sand", zones: ["WC"], months: m(9, 3), colour: "Small yellow", hex: "#E0C340", tox: ["caution", "Edible bush food, but leaves contain oxalates — blanch before eating."], allergy: ["low", "Low pollen."], pot: "140 mm", note: "Edible native groundcover with fleshy leaves. (Flowering season from general reference.)" },
  { type: "Groundcover", sci: "Pelargonium inodorum", common: "Wild Geranium", h: [0.3, 0.3], w: [0.3, 0.5], sun: ["FS", "PS"], water: "LW", soil: "Any – sand", zones: ["SSFW"], months: m(10, 3), colour: "Pink", hex: "#E08AA8", tox: ["low", "Pelargoniums are listed as mildly toxic to cats and dogs."], allergy: ["low", "Insect-pollinated."], pot: "Tubestock", note: "Short-lived; lets itself seed around." },
  { type: "Sedge & Rush", sci: "Carex appressa", common: "Tall Sedge", h: [0.5, 0.5], w: [0.5, 0.8], sun: ["FS", "PS", "S"], water: "MW", soil: "Any", zones: ["WC"], months: m(10, 1), colour: "Brown seed heads", hex: "#8A6A3E", tox: ["safe", "No known toxicity."], allergy: ["low", "Low pollen."], pot: "Tubestock", note: "Rain gardens, swales and pond edges." },
  { type: "Sedge & Rush", sci: "Ficinia nodosa", common: "Knobby Club Rush", h: [0.6, 0.6], w: [0.5, 0.8], sun: ["FS", "PS", "S"], water: "MW", soil: "Any", zones: ["WC"], months: m(10, 1), colour: "Brown seed heads", hex: "#8A6A3E", tox: ["safe", "No known toxicity."], allergy: ["low", "Low pollen."], pot: "Tubestock / 140 mm", note: "Salt and wind tolerant. Works in rain gardens and pots." },
  { type: "Sedge & Rush", sci: "Juncus usitatus", common: "Common Rush", h: [1, 1], w: [0.5, 0.8], sun: ["FS", "PS", "S"], water: "MW", soil: "Any", zones: ["WC"], months: m(10, 1), colour: "Straw seed heads", hex: "#C8B27A", tox: ["safe", "No known toxicity."], allergy: ["low", "Low pollen."], pot: "Tubestock", note: "Wet areas, detention basins and pond margins." },

  // ---------- Shrubs ----------
  { type: "Shrub", sci: "Westringia fruticosa", common: "Coastal Rosemary", h: [1, 2], w: [1, 2], sun: ["PS", "S"], water: "LW", soil: "Any – sand", zones: ALLZ, months: m(1, 12), colour: "White", hex: "#F1F0EC", tox: ["safe", "No known toxicity."], allergy: ["low", "Insect-pollinated."], pot: "140–200 mm", note: "Takes clipping well — ideal hedge. Also grows well in full sun." },
  { type: "Shrub", sci: "Correa alba", common: "White Correa", h: [1, 1], w: [1, 1.5], sun: ["FS", "PS"], water: "LW", soil: "Any – sand", zones: ["SSFW"], months: m(3, 8), colour: "White", hex: "#F1F0EC", tox: ["safe", "No known toxicity."], allergy: ["low", "Insect-pollinated."], pot: "140 mm", note: "Salt tolerant with grey-green leaves. Good low hedge." },
  { type: "Shrub", sci: "Correa reflexa", common: "Native Fuchsia", h: [1.5, 1.5], w: [1, 1], sun: ["FS", "PS", "S"], water: "MW", soil: "Any", zones: ["STIF"], months: m(3, 11), colour: "Red & green", hex: "#C0392B", tox: ["safe", "No known toxicity."], allergy: ["low", "Bird-pollinated."], pot: "140 mm", note: "Bell flowers feed honeyeaters in the cooler months." },
  { type: "Shrub", sci: "Callistemon linearis", common: "Narrow-leaved Bottlebrush", h: [2, 2], w: [1.5, 1.5], sun: ["FS", "PS"], water: "MW", soil: "Any", zones: ["SSFW"], months: m(9, 11), colour: "Red", hex: "#C41E3A", tox: ["safe", "No known toxicity."], allergy: ["low", "Bird-pollinated."], pot: "140–200 mm", note: "Bird-attracting. Prune lightly after flowering." },
  { type: "Shrub", sci: "Banksia spinulosa", common: "Hairpin Banksia", h: [2, 2], w: [1.5, 1.5], sun: ["PS"], water: "MW", soil: "Any", zones: ["SSFW"], months: m(4, 8), colour: "Yellow-orange", hex: "#E08A1E", tox: ["safe", "No known toxicity."], allergy: ["low", "Bird-pollinated."], pot: "140–200 mm", note: "Needs good drainage. Avoid high-phosphorus fertiliser." },
  { type: "Shrub", sci: "Grevillea buxifolia", common: "Grey Spider Flower", h: [2, 2], w: [1.5, 1.5], sun: ["FS", "PS"], water: "LW", soil: "Any – sand", zones: ["SSFW"], months: m(10, 3), colour: "Grey (felty)", hex: "#9C9A94", tox: ["low", "Not considered toxic if eaten."], allergy: ["moderate", "Some grevilleas cause skin irritation — wear gloves when pruning."], pot: "140 mm", note: "Needs well-drained sandy soil. Avoid high-phosphorus fertiliser." },
  { type: "Shrub", sci: "Grevillea linearifolia", common: "White Spider Flower", h: [2, 2], w: [1.5, 1.5], sun: ["FS", "PS"], water: "LW", soil: "Any – sand", zones: ["SSFW"], months: m(6, 11), colour: "Pinkish white", hex: "#F2D9DE", tox: ["low", "Not considered toxic if eaten."], allergy: ["moderate", "Some grevilleas cause skin irritation — wear gloves when pruning."], pot: "140 mm", note: "Shelter for small birds. Needs good drainage." },
  { type: "Shrub", sci: "Kunzea ambigua", common: "Tick Bush", h: [3, 3], w: [2, 3], sun: ["FS", "PS"], water: "LW", soil: "Any", zones: ["STIF"], months: m(10, 12), colour: "White (honey-scented)", hex: "#F4F2EA", tox: ["safe", "No known toxicity."], allergy: ["low", "Insect-pollinated; strong scent may bother some people."], pot: "140 mm", note: "Dense habitat shrub for small birds. Fast-growing screen." },
  { type: "Shrub", sci: "Leptospermum polygalifolium", common: "Lemon-scented Tea Tree", h: [3, 3], w: [2, 2], sun: ["FS", "PS"], water: "MW", soil: "Any", zones: ["SSFW", "WC"], months: m(10, 12), colour: "White", hex: "#F4F2EA", tox: ["safe", "No known toxicity."], allergy: ["low", "Insect-pollinated."], pot: "140–200 mm", note: "Good informal screen. Tolerates damp soil." },
  { type: "Shrub", sci: "Acacia suaveolens", common: "Sweet Wattle", h: [2, 2], w: [1, 1], sun: ["FS", "PS"], water: "LW", soil: "Any – sand", zones: ["SSFW"], months: m(6, 8), colour: "Cream (perfumed)", hex: "#EFE3A8", tox: ["low", "Not considered toxic."], allergy: ["moderate", "Wattle pollen is heavy and mostly insect-carried, but sensitive people may react."], pot: "Tubestock / 140 mm", note: "Fast-growing and short-lived (about 5–10 years)." },
  { type: "Shrub", sci: "Acacia longifolia", common: "Sydney Golden Wattle", h: [3, 4], w: [3, 3], sun: ["FS", "PS", "S"], water: "LW", soil: "Any – sand", zones: ALLZ, months: m(7, 9), colour: "Golden yellow", hex: "#E8B90C", tox: ["low", "Not considered toxic."], allergy: ["moderate", "Wattle pollen is heavy and mostly insect-carried, but sensitive people may react."], pot: "140–200 mm", note: "Fast screening plant. Relatively short-lived." },
  { type: "Shrub", sci: "Acacia myrtifolia", common: "Myrtle Wattle", h: [0.5, 1], w: [1, 1], sun: ["FS", "PS", "S"], water: "MW", soil: "Any", zones: ["SSFW", "STIF"], months: m(6, 8), colour: "Pale yellow", hex: "#F0DD7A", tox: ["low", "Not considered toxic."], allergy: ["moderate", "Wattle pollen is heavy and mostly insect-carried, but sensitive people may react."], pot: "Tubestock / 140 mm", note: "Compact wattle with red stems. Suits small gardens." },
  { type: "Shrub", sci: "Bursaria spinosa", common: "Sweet Bursaria", h: [2, 3], w: [2, 2], sun: ["FS", "PS"], water: "MW", soil: "Any – clay", zones: ["STIF"], months: m(1, 3), colour: "White", hex: "#F4F2EA", tox: ["safe", "No known toxicity. Spiny."], allergy: ["low", "Insect-pollinated."], pot: "Tubestock / 140 mm", note: "Spiny shelter for small birds; nectar for butterflies." },
  { type: "Shrub", sci: "Goodenia ovata", common: "Hop Goodenia", h: [2, 2], w: [1.5, 1.5], sun: ["PS", "S"], water: "MW", soil: "Any – sand", zones: ALLZ, months: m(9, 3), colour: "Yellow", hex: "#E6C21F", tox: ["safe", "No known toxicity."], allergy: ["low", "Insect-pollinated."], pot: "140 mm", note: "Fast filler. Prune to keep it dense." },
  { type: "Shrub", sci: "Dodonaea triquetra", common: "Hop Bush", h: [2, 2], w: [1.5, 1.5], sun: ["PS", "S"], water: "LW", soil: "Any", zones: ALLZ, months: m(9, 2), colour: "Lime-green winged fruit", hex: "#A9C94A", tox: ["low", "Not considered toxic."], allergy: ["moderate", "Wind-pollinated."], pot: "140 mm", note: "Fast, hardy filler shrub. Decorative winged fruit." },
  { type: "Shrub", sci: "Indigofera australis", common: "Austral Indigo", h: [1.5, 1.5], w: [1, 1], sun: ["PS", "S"], water: "MW", soil: "Any – clay", zones: ["STIF"], months: m(8, 10), colour: "Pink", hex: "#D46BA0", tox: ["caution", "Reported as toxic to livestock. Keep pets from chewing it."], allergy: ["low", "Insect-pollinated."], pot: "140 mm", note: "Soft, open shrub. Good under trees." },
  { type: "Shrub", sci: "Solanum aviculare", common: "Kangaroo Apple", h: [2, 2], w: [2, 2], sun: ["PS", "S"], water: "MW", soil: "Any", zones: ALLZ, months: m(9, 3), colour: "Mauve", hex: "#8D6FC4", tox: ["toxic", "Unripe (green) fruit and leaves are poisonous (solanine). Avoid near play areas and pets."], allergy: ["low", "Insect-pollinated."], pot: "140 mm", note: "Fast-growing, short-lived pioneer shrub. Orange fruit." },
  { type: "Shrub", sci: "Pittosporum revolutum", common: "Rough Fruit Pittosporum", h: [1, 3], w: [1.5, 1.5], sun: ["PS", "S"], water: "MW", soil: "Any – sand", zones: ["SSFW", "STIF"], months: m(9, 11), colour: "Cream-yellow (scented)", hex: "#EAD27A", tox: ["low", "Fruit contains saponins; not for eating."], allergy: ["low", "Insect-pollinated."], pot: "140 mm", note: "Shade tolerant. Orange fruit with sticky red seeds for birds." },

  // ---------- Trees ----------
  { type: "Tree", size: "Small tree", sci: "Ceratopetalum gummiferum", common: "NSW Christmas Bush", h: [5, 8], w: [3, 4], sun: ["FS", "PS"], water: "LW", soil: "Any – sand", zones: ["SSFW"], months: m(9, 12), colour: "White, then red sepals", hex: "#C8323C", tox: ["safe", "No known toxicity."], allergy: ["low", "Insect-pollinated."], pot: "200 mm / 45 L", note: "Red sepals colour up around Christmas. Good small garden tree." },
  { type: "Tree", size: "Small tree", sci: "Angophora hispida", common: "Dwarf Apple", h: [6, 8], w: [4, 6], sun: ["FS", "PS"], water: "LW", soil: "Any – sand", zones: ["SSFW"], months: m(12, 2), colour: "Cream", hex: "#EFE6C9", tox: ["safe", "No known toxicity."], allergy: ["low", "Insect-pollinated."], pot: "200 mm / 45 L", note: "Small, often multi-stemmed tree with red new growth." },
  { type: "Tree", size: "Small tree", sci: "Melaleuca decora", common: "White Feather Honeymyrtle", h: [6, 7], w: [3, 5], sun: ["FS"], water: "MW", soil: "Any – clay", zones: ["STIF"], months: m(11, 12), colour: "White (scented)", hex: "#F4F2EA", tox: ["low", "Tea-tree oil is toxic to pets in concentrated form; the plant itself is low risk."], allergy: ["low", "Insect-pollinated."], pot: "45 L", note: "Suits clay soils. Scented flowers." },
  { type: "Tree", size: "Small tree", sci: "Melaleuca linariifolia", common: "Snow-in-Summer", h: [8, 10], w: [4, 6], sun: ["FS", "PS"], water: "MW", soil: "Any", zones: ["SSFW", "WC"], months: m(9, 2), colour: "Cream (honey-scented)", hex: "#F1EBD4", tox: ["low", "Tea-tree oil is toxic to pets in concentrated form; the plant itself is low risk."], allergy: ["low", "Insect-pollinated."], pot: "45 L", note: "Papery bark. Tolerates wet soils. Mass white flowering." },
  { type: "Tree", size: "Medium tree", sci: "Banksia integrifolia", common: "Coast Banksia", h: [10, 15], w: [5, 8], sun: ["FS", "PS"], water: "LW", soil: "Any – sand", zones: ["SSFW", "WC"], months: m(1, 6), colour: "Pale yellow", hex: "#E8D98A", tox: ["safe", "No known toxicity."], allergy: ["low", "Bird-pollinated."], pot: "45 L", note: "Salt and wind tolerant. Food for birds and possums." },
  { type: "Tree", size: "Medium tree", sci: "Banksia serrata", common: "Old Man Banksia", h: [10, 12], w: [4, 6], sun: ["FS", "PS"], water: "LW", soil: "Any – sand", zones: ["SSFW"], months: m(1, 6), colour: "Creamy yellow", hex: "#E3D596", tox: ["safe", "No known toxicity."], allergy: ["low", "Bird-pollinated."], pot: "45 L", note: "Gnarled bark. Needs sandy, free-draining soil." },
  { type: "Tree", size: "Medium tree", sci: "Allocasuarina littoralis", common: "Black She-oak", h: [10, 12], w: [3, 5], sun: ["FS", "PS"], water: "LW", soil: "Any", zones: ["SSFW", "STIF"], months: m(9, 11), colour: "Red (female) / rusty (male)", hex: "#A0402E", tox: ["safe", "No known toxicity."], allergy: ["high", "Wind-pollinated; casuarina pollen is a known hay fever trigger."], pot: "Tubestock / 45 L", note: "Needle drop forms a natural mulch. Cones feed cockatoos." },
  { type: "Tree", size: "Medium tree", sci: "Eucalyptus haemastoma", common: "Scribbly Gum", h: [10, 14], w: [6, 10], sun: ["FS", "PS"], water: "LW", soil: "Any – sand", zones: ["SSFW"], months: m(3, 11), colour: "Cream", hex: "#EEE6C8", tox: ["low", "Leaves and oil can make pets sick if eaten in quantity."], allergy: ["moderate", "Mostly insect-pollinated; some people react to eucalypt pollen and oil."], pot: "45 L", note: "Smooth white bark with insect 'scribbles'. Needs space — check tree setback rules." },
  { type: "Tree", size: "Medium tree", sci: "Eucalyptus robusta", common: "Swamp Mahogany", h: [10, 15], w: [8, 12], sun: ["FS"], water: "MW", soil: "Any – sand", zones: ["WC"], months: m(6, 8), colour: "Cream", hex: "#EEE6C8", tox: ["low", "Leaves and oil can make pets sick if eaten in quantity."], allergy: ["moderate", "Mostly insect-pollinated; some people react to eucalypt pollen and oil."], pot: "45 L", note: "Tolerates wet soil. Key winter nectar for birds and flying-foxes. Large tree — not for small yards." },
  { type: "Tree", size: "Tall tree", sci: "Syncarpia glomulifera", common: "Turpentine", h: [18, 20], w: [8, 12], sun: ["FS"], water: "LW", soil: "Any – clay", zones: ["STIF"], months: m(9, 11), colour: "White", hex: "#F4F2EA", tox: ["safe", "No known toxicity."], allergy: ["low", "Insect-pollinated."], pot: "45 L", note: "Signature tree of the critically endangered Sydney Turpentine-Ironbark Forest. Slow-growing and large." }
];
PLANTS.forEach((p, i) => { p.id = i + 1; p.councils = ["inner-west"]; });

// ===== Suburb → council lookup =====
// share: other councils that cover part of the suburb
const SUBURBS = [
  ["Annandale", "2038", "inner-west"], ["Ashbury", "2193", "inner-west", ["City of Canterbury Bankstown"]],
  ["Ashfield", "2131", "inner-west"], ["Balmain", "2041", "inner-west"], ["Balmain East", "2041", "inner-west"],
  ["Birchgrove", "2041", "inner-west"], ["Camperdown", "2050", "inner-west", ["City of Sydney"]],
  ["Croydon", "2132", "inner-west", ["Burwood Council"]], ["Croydon Park", "2133", "inner-west", ["City of Canterbury Bankstown", "Burwood Council"]],
  ["Dobroyd Point", "2045", "inner-west"], ["Dulwich Hill", "2203", "inner-west"], ["Enmore", "2042", "inner-west"],
  ["Haberfield", "2045", "inner-west"], ["Hurlstone Park", "2193", "inner-west", ["City of Canterbury Bankstown"]],
  ["Leichhardt", "2040", "inner-west"], ["Lewisham", "2049", "inner-west"], ["Lilyfield", "2040", "inner-west"],
  ["Marrickville", "2204", "inner-west"], ["Newtown", "2042", "inner-west", ["City of Sydney"]],
  ["Petersham", "2049", "inner-west"], ["Rozelle", "2039", "inner-west"], ["St Peters", "2044", "inner-west", ["City of Sydney"]],
  ["Stanmore", "2048", "inner-west"], ["Summer Hill", "2130", "inner-west"], ["Sydenham", "2044", "inner-west"], ["Tempe", "2044", "inner-west"],
  // Neighbouring / other councils (not in the database yet)
  ["Glebe", "2037", "City of Sydney"], ["Forest Lodge", "2037", "City of Sydney"], ["Erskineville", "2043", "City of Sydney"],
  ["Alexandria", "2015", "City of Sydney"], ["Redfern", "2016", "City of Sydney"], ["Chippendale", "2008", "City of Sydney"],
  ["Surry Hills", "2010", "City of Sydney"], ["Sydney", "2000", "City of Sydney"],
  ["Drummoyne", "2047", "City of Canada Bay"], ["Five Dock", "2046", "City of Canada Bay"], ["Abbotsford", "2046", "City of Canada Bay"], ["Concord", "2137", "City of Canada Bay"],
  ["Burwood", "2134", "Burwood Council"], ["Strathfield", "2135", "Strathfield Council"],
  ["Canterbury", "2193", "City of Canterbury Bankstown"], ["Earlwood", "2206", "City of Canterbury Bankstown"], ["Campsie", "2194", "City of Canterbury Bankstown"],
  ["Arncliffe", "2205", "Bayside Council"], ["Mascot", "2020", "Bayside Council"], ["Wolli Creek", "2205", "Bayside Council"],
  ["Thornleigh", "2120", "Hornsby Shire Council"], ["Hornsby", "2077", "Hornsby Shire Council"],
  ["Parramatta", "2150", "City of Parramatta"], ["Chatswood", "2067", "Willoughby City Council"]
].map(([name, pc, council, share]) => ({ name, pc, council, share: share || [] }));

// ===== Flower colour groups (for filtering) =====
const COLOUR_GROUPS = {
  white: ["White & cream", "#F3F1E8"], yellow: ["Yellow", "#E6BE1A"], orange: ["Orange", "#E08A1E"],
  pink: ["Pink", "#E07AA6"], red: ["Red", "#C0262F"], purple: ["Purple & mauve", "#7E5BB5"],
  blue: ["Blue", "#3E6FC8"], green: ["Green", "#8DB04A"], brown: ["Brown seed heads", "#8A6A3E"]
};
const COLOUR_OF = {
  "Hardenbergia violacea": ["purple"], "Hibbertia scandens": ["yellow"], "Kennedia rubicunda": ["red"],
  "Pandorea pandorana": ["white"], "Billardiera scandens": ["white"], "Clematis aristata": ["white"],
  "Dianella caerulea": ["blue"], "Lomandra longifolia": ["yellow"], "Themeda triandra": ["brown"],
  "Cymbopogon refractus": ["brown"], "Microlaena stipoides": ["green"], "Dichondra repens": ["white"],
  "Viola hederacea": ["white", "purple"], "Carpobrotus glaucescens": ["pink", "purple"], "Scaevola albida": ["purple"],
  "Commelina cyanea": ["blue"], "Wahlenbergia gracilis": ["blue"], "Tetragonia tetragonioides": ["yellow"],
  "Pelargonium inodorum": ["pink"], "Carex appressa": ["brown"], "Ficinia nodosa": ["brown"], "Juncus usitatus": ["brown"],
  "Westringia fruticosa": ["white"], "Correa alba": ["white"], "Correa reflexa": ["red", "green"],
  "Callistemon linearis": ["red"], "Banksia spinulosa": ["yellow", "orange"], "Grevillea buxifolia": ["white"],
  "Grevillea linearifolia": ["white", "pink"], "Kunzea ambigua": ["white"], "Leptospermum polygalifolium": ["white"],
  "Acacia suaveolens": ["white"], "Acacia longifolia": ["yellow"], "Acacia myrtifolia": ["yellow"],
  "Bursaria spinosa": ["white"], "Goodenia ovata": ["yellow"], "Dodonaea triquetra": ["green"],
  "Indigofera australis": ["pink"], "Solanum aviculare": ["purple"], "Pittosporum revolutum": ["yellow"],
  "Ceratopetalum gummiferum": ["white", "red"], "Angophora hispida": ["white"], "Melaleuca decora": ["white"],
  "Melaleuca linariifolia": ["white"], "Banksia integrifolia": ["yellow"], "Banksia serrata": ["yellow"],
  "Allocasuarina littoralis": ["red", "brown"], "Eucalyptus haemastoma": ["white"], "Eucalyptus robusta": ["white"],
  "Syncarpia glomulifera": ["white"]
};
PLANTS.forEach((p) => { p.cg = COLOUR_OF[p.sci] || []; });

// ===== Plant usage (general landscape guidance) =====
const USAGES = ["Hedge", "Topiary", "Groundcover", "Feature plant", "Screen", "Windbreak", "Fragrant", "Border plant", "Attractive foliage", "Autumn foliage", "Lawn alternative", "Fire retardant", "Wow factor", "Bush tucker"];
const USE_OF = {
  "Hardenbergia violacea": ["Groundcover", "Screen"], "Hibbertia scandens": ["Groundcover", "Screen"],
  "Kennedia rubicunda": ["Groundcover", "Screen"], "Pandorea pandorana": ["Screen"], "Billardiera scandens": ["Bush tucker"],
  "Clematis aristata": ["Screen"], "Dianella caerulea": ["Border plant"], "Lomandra longifolia": ["Border plant", "Groundcover"],
  "Themeda triandra": ["Border plant", "Attractive foliage"], "Cymbopogon refractus": ["Border plant"],
  "Microlaena stipoides": ["Lawn alternative", "Groundcover"], "Dichondra repens": ["Lawn alternative", "Groundcover", "Fire retardant"],
  "Viola hederacea": ["Groundcover", "Bush tucker", "Fire retardant"], "Carpobrotus glaucescens": ["Groundcover", "Bush tucker", "Fire retardant"],
  "Scaevola albida": ["Groundcover", "Border plant"], "Commelina cyanea": ["Groundcover", "Fire retardant"],
  "Wahlenbergia gracilis": ["Border plant"], "Tetragonia tetragonioides": ["Groundcover", "Bush tucker", "Fire retardant"],
  "Pelargonium inodorum": ["Border plant"], "Carex appressa": ["Border plant"], "Ficinia nodosa": ["Border plant", "Attractive foliage"],
  "Juncus usitatus": ["Border plant"], "Westringia fruticosa": ["Hedge", "Topiary", "Screen", "Windbreak", "Attractive foliage"],
  "Correa alba": ["Hedge", "Topiary", "Border plant", "Attractive foliage", "Fire retardant"], "Correa reflexa": ["Border plant"],
  "Callistemon linearis": ["Hedge", "Screen", "Feature plant", "Wow factor"], "Banksia spinulosa": ["Feature plant", "Wow factor"],
  "Grevillea buxifolia": ["Feature plant"], "Grevillea linearifolia": ["Screen"],
  "Kunzea ambigua": ["Hedge", "Screen", "Windbreak", "Fragrant"], "Leptospermum polygalifolium": ["Hedge", "Screen", "Windbreak", "Fragrant"],
  "Acacia suaveolens": ["Fragrant"], "Acacia longifolia": ["Screen", "Windbreak", "Wow factor"],
  "Acacia myrtifolia": ["Border plant", "Attractive foliage"], "Bursaria spinosa": ["Hedge", "Fragrant"],
  "Goodenia ovata": ["Screen"], "Dodonaea triquetra": ["Hedge", "Screen"], "Indigofera australis": ["Border plant"],
  "Solanum aviculare": ["Screen", "Attractive foliage"], "Pittosporum revolutum": ["Screen", "Fragrant", "Fire retardant"],
  "Ceratopetalum gummiferum": ["Feature plant", "Screen", "Wow factor"], "Angophora hispida": ["Feature plant", "Attractive foliage"],
  "Melaleuca decora": ["Screen", "Windbreak", "Fragrant"], "Melaleuca linariifolia": ["Feature plant", "Screen", "Fragrant", "Wow factor"],
  "Banksia integrifolia": ["Feature plant", "Screen", "Windbreak"], "Banksia serrata": ["Feature plant", "Wow factor"],
  "Allocasuarina littoralis": ["Screen", "Windbreak", "Attractive foliage"], "Eucalyptus haemastoma": ["Feature plant", "Wow factor"],
  "Eucalyptus robusta": ["Windbreak"], "Syncarpia glomulifera": ["Feature plant", "Windbreak"]
};
PLANTS.forEach((p) => { p.uses = USE_OF[p.sci] || []; });

// ===== Gardening with Angus cross-reference (gardeningwithangus.com.au, checked Sep 2026) =====
// Facts only (sizes, frost, wildlife) — GwA text and photos are copyright and are not copied.
// cv = page is for a cultivar, so its sizes are not used for the species.
const GWA = {
  "Hardenbergia violacea": { url: "https://gardeningwithangus.com.au/hardenbergia-violaceae-native-sarsparilla/", h: [2, 5], w: [2, 3], frost: "Light frost", wildlife: "Bees, butterflies, insects", uses: ["Groundcover", "Screen"] },
  "Hibbertia scandens": { url: "https://gardeningwithangus.com.au/hibbertia-scandens-snake-vine/", h: [0.5, 3], w: [1, 5], frost: "Light frost", wildlife: "Bees, butterflies, lizards", uses: ["Groundcover"] },
  "Pandorea pandorana": { url: "https://gardeningwithangus.com.au/pandorea-pandorana-wonga-wonga-vine/", h: [2, 20], w: [1, 9], frost: "Heavy frost", wildlife: "Bees, butterflies, insects", uses: ["Feature plant"] },
  "Billardiera scandens": { url: "https://gardeningwithangus.com.au/billardiera-scandens/", h: [0.2, 1.5], w: [0.5, 3], frost: "Light frost", wildlife: "Bees, nectar-eating birds, butterflies, insects", uses: ["Groundcover", "Screen"] },
  "Dianella caerulea": { url: "https://gardeningwithangus.com.au/dianella-caerulea/", h: [0.5, 1], w: [0.5, 2], frost: "Light frost", wildlife: "Seed-eating birds", uses: ["Groundcover", "Border plant"] },
  "Lomandra longifolia": { url: "https://gardeningwithangus.com.au/lomandra-longifolia-mat-rush/", h: [0.4, 1], w: [0.4, 0.6], frost: "Light frost", wildlife: "Bees, insects", uses: ["Fragrant"] },
  "Dichondra repens": { url: "https://gardeningwithangus.com.au/dichondra-repens-kidney-weed/", h: [0.1, 0.3], w: [1, 5], frost: "Light frost", wildlife: "", uses: ["Groundcover", "Lawn alternative"] },
  "Viola hederacea": { url: "https://gardeningwithangus.com.au/viola-hederacea-native-violet/", h: [0.1, 0.2], w: [0.3, 1], frost: "Light frost", wildlife: "", uses: ["Groundcover", "Lawn alternative"] },
  "Correa alba": { url: "https://gardeningwithangus.com.au/correa-alba-white-correa/", h: [1, 1.5], w: [1, 1.5], frost: "Light frost", wildlife: "Nectar-eating birds, insects", uses: ["Topiary", "Border plant", "Attractive foliage"] },
  "Correa reflexa": { url: "https://gardeningwithangus.com.au/correa-reflexa-native-fuchsia/", h: [0.5, 1.2], w: [0.5, 1], frost: "Light frost", wildlife: "Bees, nectar-eating birds, butterflies, insects", uses: ["Groundcover", "Border plant"] },
  "Banksia spinulosa": { url: "https://gardeningwithangus.com.au/banksia-spinulosa-hairpin-banksia/", h: [1, 3], w: [1, 3], frost: "Light frost", wildlife: "Bees, nectar-eating birds, butterflies, insects", uses: ["Screen", "Windbreak"] },
  "Kunzea ambigua": { url: "https://gardeningwithangus.com.au/kunzea-ambigua-tick-bush/", h: [1, 5], w: [1, 3], frost: "Heavy frost", wildlife: "Bees, nectar-eating birds, butterflies, insects", uses: ["Screen", "Windbreak", "Fragrant"] },
  "Bursaria spinosa": { url: "https://gardeningwithangus.com.au/bursaria-spinosa-sweet-bursaria/", h: [1.5, 4], w: [1.5, 3], frost: "Light frost", wildlife: "Bees, nectar & seed-eating birds, butterflies, insects", uses: ["Feature plant", "Border plant"] },
  "Indigofera australis": { url: "https://gardeningwithangus.com.au/indigofera-australis-australian-indigo/", h: [1, 2], w: [1, 2], frost: "Light frost", wildlife: "Bees, nectar-eating birds, insects", uses: ["Feature plant", "Border plant"] },
  "Pittosporum revolutum": { url: "https://gardeningwithangus.com.au/pittosporum-revolutum-yellow-pittosporum/", h: [4, 15], w: [1.5, 4], frost: "Light frost", wildlife: "Bees, seed-eating birds, butterflies, insects", uses: ["Hedge", "Screen", "Windbreak", "Fragrant"] },
  "Angophora hispida": { url: "https://gardeningwithangus.com.au/angophora-hispida-dwarf-apple-gum/", h: [5, 7], w: [3, 5], frost: "Light frost", wildlife: "Bees, nectar-eating birds, butterflies, insects", uses: ["Feature plant", "Windbreak"] },
  "Banksia integrifolia": { url: "https://gardeningwithangus.com.au/banksia-integrifolia-coast-banksia/", h: [4, 15], w: [1, 6], frost: "Light frost", wildlife: "Bees, birds, butterflies, insects, mammals", uses: ["Feature plant", "Screen", "Windbreak"] },
  "Banksia serrata": { url: "https://gardeningwithangus.com.au/banksia-serrata-old-man-banksia/", h: [3, 15], w: [2, 4], frost: "Light frost", wildlife: "Bees, nectar & seed-eating birds, butterflies, insects", uses: ["Feature plant", "Screen", "Windbreak"] },
  "Allocasuarina littoralis": { url: "https://gardeningwithangus.com.au/allocasuarina-littoralis-black-she-oak/", h: [8, 12], w: [4, 7], frost: "Light frost", wildlife: "Seed-eating birds", uses: ["Screen", "Windbreak"] },
  // Cultivar pages — link only
  "Themeda triandra": { url: "https://gardeningwithangus.com.au/themeda-triandra-mingo-kangaroo-grass/", cv: "Mingo" },
  "Scaevola albida": { url: "https://gardeningwithangus.com.au/scaevola-albida-mauve-carpet-fan-flower/", cv: "Mauve Carpet" },
  "Westringia fruticosa": { url: "https://gardeningwithangus.com.au/westringia-fruticosa-zena-coastal-rosemary/", cv: "Zena" },
  "Leptospermum polygalifolium": { url: "https://gardeningwithangus.com.au/leptospermum-polygalifolium-copper-glow-tea-tree/", cv: "Copper Glow" },
  "Goodenia ovata": { url: "https://gardeningwithangus.com.au/goodenia-ovata-prostrate-goodenia/", cv: "Prostrate" },
  "Ceratopetalum gummiferum": { url: "https://gardeningwithangus.com.au/ceratopetalum-gummiferum-alberys-red-new-south-wales-christmas-bush/", cv: "Alberys Red" },
  "Melaleuca linariifolia": { url: "https://gardeningwithangus.com.au/melaleuca-linariifolia-seafoam-paperbark/", cv: "Seafoam" }
};
PLANTS.forEach((p) => {
  const g = GWA[p.sci];
  p.gwa = g || null;
  if (!g || g.cv) return;
  // Width was a reference estimate: widen it to cover the GwA range.
  p.wOrig = p.w.slice();
  p.w = [Math.min(p.w[0], g.w[0]), Math.max(p.w[1], g.w[1])];
  // Climber heights were estimates too (council gives none).
  if (p.type === "Climber") { p.hOrig = p.h.slice(); p.h = [Math.min(p.h[0], g.h[0]), Math.max(p.h[1], g.h[1])]; }
  // Add GwA usages we didn't already have.
  g.uses.forEach((u) => { if (!p.uses.includes(u)) p.uses.push(u); });
});
// ===== Hornsby Shire Council =====
// Superseded: the 2005 "Create a Native Garden" brochures are no longer linked by council.
// hornsby_habitat.js (applied last) keeps only species on the council's 2017 nursery list.
// The brochures give each plant's form and a size class; sun and size symbols are images and
// could not be read, so heights, widths, sun, water and flowering months below are general
// horticultural reference values (marked "ref" in the app) unless the Inner West list already covers the species.

COUNCILS["inner-west"].short = "Inner West";
COUNCILS["inner-west"].zones = ZONES;
COUNCILS["inner-west"].zoneLabel = "Vegetation zone";
COUNCILS["inner-west"].zoneHelp = "Inner West has three native vegetation zones.";
COUNCILS["inner-west"].sources = [{ label: "Native Plants of the Inner West (PDF)", url: COUNCILS["inner-west"].pdf }];

COUNCILS["hornsby"] = {
  name: "Hornsby Shire Council",
  short: "Hornsby",
  list: "Create a Native Garden (Rural, Southern and Northern Suburbs)",
  url: "https://www.hornsby.nsw.gov.au/Environment/Flora-and-fauna/Native-plants-and-weeds/Native-gardening-tips",
  zones: {
    RURAL: "Rural suburbs (Area 1): shale and sandstone soils — Arcadia, Galston, Dural, Glenorie, Wisemans Ferry…",
    SOUTH: "Southern suburbs (Area 2): fertile shale-derived clay soils — Hornsby, Thornleigh, Pennant Hills, Epping…",
    NORTH: "Northern suburbs (Area 3): shallow sandstone-derived sandy soils — Asquith, Mt Colah, Berowra, Brooklyn…"
  },
  zoneNames: { RURAL: "Rural", SOUTH: "Southern", NORTH: "Northern" },
  zoneLabel: "Council area",
  zoneHelp: "Hornsby's planting guides split the shire into three areas by soil.",
  sources: []
};
COUNCILS["inner-west"].zoneNames = { SSFW: "SSFW", STIF: "STIF", WC: "WC" };

// Existing species: zones per council
PLANTS.forEach((p) => { p.zonesBy = { "inner-west": p.zones }; });

// Species already in the database that Hornsby also lists, with the areas it lists them for
const HORNSBY_SHARED = {
  "Hardenbergia violacea": ["SOUTH", "NORTH"], "Hibbertia scandens": ["SOUTH"], "Pandorea pandorana": ["RURAL", "SOUTH", "NORTH"],
  "Dianella caerulea": ["SOUTH"], "Lomandra longifolia": ["RURAL", "SOUTH", "NORTH"], "Themeda triandra": ["RURAL", "SOUTH", "NORTH"],
  "Viola hederacea": ["RURAL", "SOUTH"], "Syncarpia glomulifera": ["SOUTH"], "Acacia myrtifolia": ["SOUTH"],
  "Grevillea linearifolia": ["SOUTH"], "Indigofera australis": ["SOUTH"], "Leptospermum polygalifolium": ["RURAL", "SOUTH"],
  "Eucalyptus haemastoma": ["NORTH"], "Banksia serrata": ["NORTH"], "Ceratopetalum gummiferum": ["NORTH"],
  "Angophora hispida": ["NORTH"], "Banksia spinulosa": ["NORTH"], "Correa reflexa": ["NORTH"], "Grevillea buxifolia": ["NORTH"],
  "Juncus usitatus": ["RURAL"], "Goodenia ovata": ["RURAL"]
};
PLANTS.forEach((p) => {
  const z = HORNSBY_SHARED[p.sci];
  if (!z) return;
  p.councils.push("hornsby");
  p.zonesBy.hornsby = z;
});
PLANTS.find((p) => p.sci === "Themeda triandra").alias = "Listed by Hornsby as Themeda australis";

// Hornsby size classes (from the brochures' key)
const HSC = { G: "Groundcover (0.25–1 m)", S: "Shrub (1–2.5 m)", ST: "Small tree (10–15 m)", LT: "Large tree (20–25 m)" };

const T = (o) => Object.assign({ councils: ["hornsby"], hRef: true, gwa: null }, o);
const HORNSBY_NEW = [
  // ---------- Climbers ----------
  T({ type: "Climber", sci: "Clematis glycinoides", common: "Old Man's Beard (Headache Vine)", h: [3, 6], w: [2, 4], sun: ["PS", "S"], water: "MW", soil: "Any", zonesBy: { hornsby: ["RURAL", "SOUTH", "NORTH"] }, months: m(8, 11), colour: "White", hex: "#F3F3EE", cg: ["white"], tox: ["caution", "Sap and leaves contain irritant compounds (protoanemonin). Keep pets from chewing it."], allergy: ["low", "Crushed leaves smell pungent; sap may irritate skin."], pot: "140 mm", uses: ["Screen"], note: "Vigorous, fast-growing vine. Spills over banks or covers a fence; fluffy seed heads follow the flowers." }),
  T({ type: "Climber", sci: "Cissus hypoglauca", common: "Native Grape", h: [5, 10], w: [3, 6], sun: ["FS", "PS", "S"], water: "MW", soil: "Any", zonesBy: { hornsby: ["RURAL"] }, months: m(12, 2), colour: "Small yellow", hex: "#E0C340", cg: ["yellow"], tox: ["low", "Black fruit is edible but acidic and can irritate the mouth."], allergy: ["low", "Insect-pollinated."], pot: "140 mm", uses: ["Screen", "Bush tucker"], note: "Vigorous, hardy tall vine with glossy leaves. Covers pergolas and fences." }),
  T({ type: "Climber", sci: "Morinda jasminoides", common: "Jasmine Morinda", h: [2, 4], w: [2, 3], sun: ["PS", "S"], water: "MW", soil: "Any", zonesBy: { hornsby: ["RURAL"] }, months: m(12, 2), colour: "Cream (fragrant)", hex: "#EFE6CF", cg: ["white"], tox: ["low", "Orange berries are not recommended for eating."], allergy: ["low", "Insect-pollinated."], pot: "140 mm", uses: ["Screen", "Fragrant", "Groundcover"], note: "Scrambling climber with glossy leaves and orange berries; also spills over slopes. Now also named Gynochthodes jasminoides." }),

  // ---------- Grasses, strappy plants, sedges ----------
  T({ type: "Grass", sci: "Austrostipa ramosissima", common: "Bamboo Grass", h: [1.5, 2.5], w: [1, 1.5], sun: ["FS", "PS"], water: "LW", soil: "Any", zonesBy: { hornsby: ["SOUTH"] }, months: m(10, 2), colour: "Straw seed heads", hex: "#C8B27A", cg: ["brown"], tox: ["safe", "No known toxicity."], allergy: ["moderate", "Wind-pollinated grass."], pot: "140 mm", uses: ["Feature plant", "Screen"], note: "Tall, cane-like clumps with weeping foliage. A feature when mass planted." }),
  T({ type: "Strappy", sci: "Dianella prunina", common: "Dianella", h: [0.3, 0.5], w: [0.3, 0.5], sun: ["FS", "PS"], water: "LW", soil: "Any – sand", zonesBy: { hornsby: ["NORTH"] }, months: m(9, 12), colour: "Purple", hex: "#6B4FA0", cg: ["purple"], tox: ["low", "Low risk; berries not recommended for pets or small children."], allergy: ["low", "Insect-pollinated."], pot: "140 mm", uses: ["Border plant", "Attractive foliage"], note: "Clumps of narrow, purplish leaves and purple berries. Rockeries, pots and water features." }),
  T({ type: "Strappy", sci: "Xanthorrhoea media", common: "Forest Grass Tree", h: [1, 2], w: [1, 1.5], sun: ["FS", "PS"], water: "LW", soil: "Any – sand", zonesBy: { hornsby: ["RURAL", "NORTH"] }, months: m(8, 11), colour: "Cream flower spike", hex: "#EADFB4", cg: ["white"], tox: ["safe", "No known toxicity."], allergy: ["low", "Insect-pollinated."], pot: "200 mm", uses: ["Feature plant", "Wow factor"], note: "Slow-growing clump that may form a trunk with age, with a tall creamy flower spike. Striking feature, also in pots." }),
  T({ type: "Sedge & Rush", sci: "Gahnia sieberiana", common: "Red-fruit Saw-sedge", h: [1.5, 2], w: [1, 1.5], sun: ["FS", "PS"], water: "HW", soil: "Any – damp", zonesBy: { hornsby: ["RURAL"] }, months: m(9, 12), colour: "Dark brown spikelets", hex: "#5A3E2B", cg: ["brown"], tox: ["safe", "No known toxicity. Leaf edges are sharp — wear gloves."], allergy: ["low", "Low pollen."], pot: "140 mm", uses: ["Feature plant", "Border plant"], note: "Tall clump for wet areas, pond edges and effluent-affected soils. Food plant for sword-grass brown butterflies." }),

  // ---------- Groundcovers and ferns ----------
  T({ type: "Groundcover", sci: "Brachyscome angustifolia", common: "Stiff Daisy", h: [0.1, 0.3], w: [0.3, 0.6], sun: ["FS", "PS"], water: "MW", soil: "Any", zonesBy: { hornsby: ["SOUTH"] }, months: m(9, 11), colour: "Pink-mauve daisies", hex: "#D59BC4", cg: ["pink", "purple"], tox: ["safe", "No known toxicity."], allergy: ["low", "Insect-pollinated."], pot: "Tubestock / 140 mm", uses: ["Groundcover", "Border plant"], note: "Mat-forming daisy for moist spots and cottage gardens. Listed by council as Brachycome angustifolia." }),
  T({ type: "Groundcover", sci: "Helichrysum scorpioides", common: "Button Everlasting (Paper Daisy)", h: [0.2, 0.4], w: [0.3, 0.5], sun: ["FS", "PS"], water: "LW", soil: "Any", zonesBy: { hornsby: ["SOUTH"] }, months: m(9, 1), colour: "Bright yellow", hex: "#E6BE1A", cg: ["yellow"], tox: ["safe", "No known toxicity."], allergy: ["low", "Insect-pollinated."], pot: "Tubestock", uses: ["Groundcover", "Border plant"], note: "Tufted everlasting daisy; best mass planted. Now also named Coronidium scorpioides." }),
  T({ type: "Groundcover", sci: "Actinotus helianthi", common: "Flannel Flower", h: [0.5, 1], w: [0.4, 0.6], sun: ["FS"], water: "LW", soil: "Any – sand", zonesBy: { hornsby: ["NORTH"] }, months: m(8, 1), colour: "White (felted)", hex: "#F1F1EA", cg: ["white"], tox: ["safe", "No known toxicity."], allergy: ["moderate", "Felty hairs on leaves and flowers can irritate skin and eyes."], pot: "Tubestock / 140 mm", uses: ["Feature plant", "Wow factor", "Attractive foliage"], note: "Soft grey felty foliage and white star flowers. Needs very well-drained sandy soil; often short-lived." }),
  T({ type: "Groundcover", sci: "Dampiera stricta", common: "Blue Dampiera", h: [0.3, 0.5], w: [0.3, 0.6], sun: ["FS", "PS"], water: "LW", soil: "Any – sand", zonesBy: { hornsby: ["NORTH"] }, months: m(8, 1), colour: "Blue-purple", hex: "#4D5FC0", cg: ["blue", "purple"], tox: ["safe", "No known toxicity."], allergy: ["low", "Insect-pollinated."], pot: "Tubestock", uses: ["Groundcover", "Border plant"], note: "Small sprawling plant for sandy soil. Pairs well with Flannel Flower." }),
  T({ type: "Fern", sci: "Adiantum aethiopicum", common: "Maidenhair Fern", h: [0.2, 0.4], w: [0.5, 1], sun: ["PS", "S"], water: "MW", soil: "Any", zonesBy: { hornsby: ["RURAL", "SOUTH"] }, months: [], colour: "No flowers (fern)", hex: "#6E9A4F", cg: [], tox: ["safe", "No known toxicity."], allergy: ["low", "Fern spores; rarely a problem."], pot: "Tubestock / 140 mm", uses: ["Groundcover", "Attractive foliage"], note: "Spreads into soft clumps in sheltered, moist spots; also good in pots. Good frog habitat." }),
  T({ type: "Fern", sci: "Doodia aspera", common: "Prickly Rasp Fern", h: [0.3, 0.5], w: [0.3, 0.6], sun: ["PS", "S"], water: "MW", soil: "Any", zonesBy: { hornsby: ["SOUTH"] }, months: [], colour: "No flowers (fern)", hex: "#6E9A4F", cg: [], tox: ["safe", "No known toxicity."], allergy: ["low", "Fern spores; rarely a problem."], pot: "140 mm", uses: ["Groundcover", "Attractive foliage"], note: "Compact, hardy fern with pinkish new fronds. Rockeries and pots; good frog habitat." }),
  T({ type: "Fern", sci: "Hypolepis muelleri", common: "Harsh Ground Fern", h: [0.5, 1], w: [1, 2], sun: ["FS", "PS", "S"], water: "HW", soil: "Any – damp", zonesBy: { hornsby: ["RURAL", "NORTH"] }, months: [], colour: "No flowers (fern)", hex: "#6E9A4F", cg: [], tox: ["safe", "No known toxicity."], allergy: ["low", "Fern spores; rarely a problem."], pot: "Tubestock", uses: ["Groundcover"], note: "Very hardy fern that spreads quickly in wet ground and tolerates effluent-affected soils. Erosion control." }),

  // ---------- Shrubs ----------
  T({ type: "Shrub", sci: "Ozothamnus diosmifolius", common: "Rice Flower (Everlasting Paper Daisy)", h: [1.5, 3], w: [1, 1.5], sun: ["FS", "PS"], water: "LW", soil: "Any", zonesBy: { hornsby: ["SOUTH"] }, months: m(9, 12), colour: "Cream-white clusters", hex: "#F1EBD4", cg: ["white"], tox: ["safe", "No known toxicity."], allergy: ["low", "Insect-pollinated."], pot: "140 mm", uses: ["Screen", "Fragrant"], note: "Tall, fast shrub with aromatic foliage. Flowers dry well for arrangements." }),
  T({ type: "Shrub", sci: "Pultenaea flexilis", common: "Graceful Bush Pea", h: [1.5, 3], w: [1.5, 2.5], sun: ["FS", "PS"], water: "MW", soil: "Any", zonesBy: { hornsby: ["RURAL", "SOUTH"] }, months: m(9, 10), colour: "Yellow", hex: "#E6BE1A", cg: ["yellow"], tox: ["low", "Not known to be toxic. Pea-family seeds are best not eaten."], allergy: ["low", "Insect-pollinated."], pot: "140 mm", uses: ["Screen", "Border plant", "Wow factor"], note: "Large rounded shrub covered in yellow pea flowers in spring. Borders and understorey." }),
  T({ type: "Shrub", sci: "Zieria smithii", common: "Sandfly Zieria", h: [1, 2], w: [1, 1.5], sun: ["PS", "S"], water: "MW", soil: "Any", zonesBy: { hornsby: ["SOUTH"] }, months: m(9, 1), colour: "White or pink stars", hex: "#F2D9DE", cg: ["white", "pink"], tox: ["low", "Aromatic oils; not for eating."], allergy: ["low", "Insect-pollinated."], pot: "140 mm", uses: ["Border plant", "Fragrant"], note: "Rounded, open shrub with aromatic leaves. Pots, borders and understorey." }),
  T({ type: "Shrub", sci: "Banksia ericifolia", common: "Heath Banksia", h: [2, 4], w: [2, 3], sun: ["FS", "PS"], water: "LW", soil: "Any – sand", zonesBy: { hornsby: ["NORTH"] }, months: m(4, 8), colour: "Bright orange", hex: "#E07A1E", cg: ["orange"], tox: ["safe", "No known toxicity."], allergy: ["low", "Bird-pollinated."], pot: "140–200 mm", uses: ["Screen", "Windbreak", "Feature plant", "Wow factor"], note: "Dense rounded shrub with bright orange winter cones; food for birds. Screen or windbreak." }),
  T({ type: "Shrub", sci: "Callistemon citrinus", common: "Crimson Bottlebrush", h: [2, 4], w: [1.5, 3], sun: ["FS", "PS"], water: "MW", soil: "Any", zonesBy: { hornsby: ["NORTH"] }, months: [4].concat(m(9, 11)), colour: "Red", hex: "#C41E3A", cg: ["red"], tox: ["safe", "No known toxicity."], allergy: ["low", "Bird-pollinated."], pot: "140–200 mm", uses: ["Hedge", "Screen", "Feature plant", "Wow factor"], note: "Dense, fast-growing; flowers in spring and again in autumn. Screen, hedge or pots. Also named Melaleuca citrina." }),
  T({ type: "Shrub", sci: "Crowea saligna", common: "Crowea", h: [0.5, 1], w: [0.5, 1], sun: ["PS"], water: "MW", soil: "Any", zonesBy: { hornsby: ["NORTH"] }, months: m(9, 11), colour: "Pink stars", hex: "#E07AA6", cg: ["pink"], tox: ["safe", "No known toxicity."], allergy: ["low", "Insect-pollinated."], pot: "Tubestock / 140 mm", uses: ["Border plant", "Fragrant"], note: "Small shrub with aromatic leaves. Likes a moist, protected spot with richer soil." }),
  T({ type: "Shrub", sci: "Austromyrtus tenuifolia", common: "Narrow-leaf Myrtle", h: [1, 2], w: [1, 1.5], sun: ["PS", "S"], water: "MW", soil: "Any – damp", zonesBy: { hornsby: ["RURAL"] }, months: m(12, 4), colour: "White", hex: "#F4F2EA", cg: ["white"], tox: ["safe", "No known toxicity."], allergy: ["low", "Insect-pollinated."], pot: "140 mm", uses: ["Hedge", "Border plant"], note: "Small, dense shrub with purple fruit. Understorey for sheltered, moist spots." }),
  T({ type: "Shrub", sci: "Baeckea linifolia", common: "Weeping Baeckea", h: [1, 2], w: [1, 1.5], sun: ["FS", "PS"], water: "HW", soil: "Any – damp", zonesBy: { hornsby: ["RURAL"] }, months: m(1, 3), colour: "White", hex: "#F4F2EA", cg: ["white"], tox: ["safe", "No known toxicity."], allergy: ["low", "Insect-pollinated."], pot: "140 mm", uses: ["Screen", "Border plant", "Attractive foliage"], note: "Slender weeping shrub with fine aromatic leaves. Good in very moist soil and along creeks." }),
  T({ type: "Shrub", sci: "Bauera rubioides", common: "Dog Rose", h: [0.5, 1.5], w: [1, 2], sun: ["PS", "S"], water: "HW", soil: "Any – damp", zonesBy: { hornsby: ["RURAL"] }, months: m(8, 11), colour: "Pink", hex: "#E07AA6", cg: ["pink", "white"], tox: ["safe", "No known toxicity."], allergy: ["low", "Insect-pollinated."], pot: "Tubestock / 140 mm", uses: ["Border plant", "Hedge", "Groundcover"], note: "Fast, spreading shrub with showy pink flowers; likes moist spots. Can be clipped as a border." }),
  T({ type: "Shrub", sci: "Prostanthera ovalifolia", common: "Mint Bush", h: [1.5, 3], w: [1, 2], sun: ["FS", "PS"], water: "MW", soil: "Any (well-drained)", zonesBy: { hornsby: ["RURAL"] }, months: m(9, 11), colour: "Purple", hex: "#7E5BB5", cg: ["purple"], tox: ["low", "Aromatic oils; not for eating."], allergy: ["low", "Insect-pollinated."], pot: "140 mm", uses: ["Screen", "Border plant", "Fragrant", "Wow factor"], note: "Upright shrub with strongly minty leaves and masses of purple spring flowers. Often short-lived." }),

  // ---------- Trees ----------
  T({ type: "Tree", size: "Small tree", sci: "Acacia floribunda", common: "White Sallow Wattle", h: [4, 8], w: [3, 5], sun: ["FS", "PS"], water: "LW", soil: "Any", zonesBy: { hornsby: ["SOUTH"] }, months: m(7, 9), colour: "Pale yellow (fragrant)", hex: "#F0DD7A", cg: ["yellow"], tox: ["low", "Not considered toxic."], allergy: ["moderate", "Wattle pollen is heavy and mostly insect-carried, but sensitive people may react."], pot: "Tubestock / 140 mm", uses: ["Feature plant", "Screen", "Windbreak", "Fragrant"], note: "Graceful, spreading, fast-growing feature tree. Relatively short-lived." }),
  T({ type: "Tree", size: "Small tree", sci: "Acacia decurrens", common: "Black Wattle (Sydney Green Wattle)", h: [6, 8], w: [4, 6], sun: ["FS", "PS"], water: "LW", soil: "Any", councils: ["inner-west", "hornsby"], hRef: false, zonesBy: { "inner-west": ["SSFW", "WC"], hornsby: ["RURAL"] }, months: m(7, 9), colour: "Bright yellow (fragrant)", hex: "#E8B90C", cg: ["yellow"], tox: ["low", "Not considered toxic."], allergy: ["moderate", "Wattle pollen is heavy and mostly insect-carried, but sensitive people may react."], pot: "Tubestock / 140 mm", uses: ["Windbreak", "Screen", "Fragrant", "Wow factor"], note: "Upright, fast-growing wattle; good windbreak. Short-lived. Height from the Inner West list." }),
  T({ type: "Tree", size: "Small tree", sci: "Allocasuarina torulosa", common: "Forest Oak", h: [10, 15], w: [4, 6], sun: ["FS", "PS"], water: "LW", soil: "Any", zonesBy: { hornsby: ["SOUTH"] }, months: m(6, 10), colour: "Rusty male spikes / red female", hex: "#A0402E", cg: ["brown", "red"], tox: ["safe", "No known toxicity."], allergy: ["high", "Wind-pollinated; casuarina pollen is a known hay fever trigger."], pot: "Tubestock / 45 L", uses: ["Feature plant", "Screen", "Windbreak", "Attractive foliage"], note: "Fine, soft weeping foliage. Cones feed Glossy Black and Gang-gang Cockatoos." }),
  T({ type: "Tree", size: "Small tree", sci: "Elaeocarpus reticulatus", common: "Blueberry Ash", h: [5, 10], w: [3, 5], sun: ["FS", "PS", "S"], water: "MW", soil: "Any", zonesBy: { hornsby: ["SOUTH"] }, months: m(10, 12), colour: "White or pink fringed bells", hex: "#F2D9DE", cg: ["white", "pink"], tox: ["safe", "No known toxicity."], allergy: ["low", "Insect-pollinated."], pot: "200 mm / 45 L", uses: ["Feature plant", "Screen", "Hedge", "Wow factor"], note: "Fringed bell flowers followed by blue berries for birds. Screen or small shade tree." }),
  T({ type: "Tree", size: "Small tree", sci: "Acmena smithii", common: "Lilly Pilly", h: [5, 10], w: [3, 5], sun: ["FS", "PS", "S"], water: "MW", soil: "Any", zonesBy: { hornsby: ["NORTH"] }, months: m(11, 1), colour: "Fluffy cream", hex: "#EFE6CF", cg: ["white"], tox: ["safe", "Pink fruit is edible (bush food)."], allergy: ["low", "Insect-pollinated."], pot: "200 mm / 45 L", uses: ["Hedge", "Topiary", "Screen", "Attractive foliage", "Bush tucker"], note: "Bronze-pink new growth and pink fruit in late summer. Screen, clipped hedge or rainforest-style garden. Now also named Syzygium smithii." }),
  T({ type: "Tree", size: "Small tree", sci: "Callitris rhomboidea", common: "Port Jackson Pine", h: [6, 10], w: [3, 4], sun: ["FS", "PS"], water: "LW", soil: "Any – sand", zonesBy: { hornsby: ["RURAL"] }, months: [], colour: "No flowers (conifer)", hex: "#4F6B4A", cg: [], tox: ["safe", "No known toxicity."], allergy: ["moderate", "Wind-pollinated conifer."], pot: "140 mm / 45 L", uses: ["Screen", "Windbreak", "Feature plant", "Attractive foliage"], note: "Narrow native conifer with fine, deep green foliage. Cones feed Black and Gang-gang Cockatoos." }),
  T({ type: "Tree", size: "Small tree", sci: "Tristaniopsis laurina", common: "Water Gum", h: [8, 15], w: [4, 6], sun: ["FS", "PS"], water: "MW", soil: "Any – damp", zonesBy: { hornsby: ["RURAL"] }, months: m(12, 1), colour: "Yellow clusters", hex: "#E6BE1A", cg: ["yellow"], tox: ["safe", "No known toxicity."], allergy: ["low", "Insect-pollinated."], pot: "45 L", uses: ["Screen", "Feature plant", "Attractive foliage"], note: "Dense tree with glossy leaves, red new growth and smooth patchy bark. Tall screen; likes moist soil." }),
  T({ type: "Tree", size: "Large tree", sci: "Eucalyptus paniculata", common: "Grey Ironbark", h: [20, 25], w: [10, 15], sun: ["FS"], water: "LW", soil: "Any – clay", zonesBy: { hornsby: ["RURAL", "SOUTH"] }, months: m(5, 9), colour: "Cream", hex: "#EEE6C8", cg: ["white"], tox: ["low", "Leaves and oil can make pets sick if eaten in quantity."], allergy: ["moderate", "Mostly insect-pollinated; some people react to eucalypt pollen and oil."], pot: "45 L", uses: ["Feature plant", "Windbreak"], note: "Straight, deeply furrowed dark trunk. Winter food for many birds and animals. Large gardens only." }),
  T({ type: "Tree", size: "Large tree", sci: "Eucalyptus punctata", common: "Grey Gum", h: [18, 25], w: [10, 15], sun: ["FS", "PS"], water: "LW", soil: "Any – clay", councils: ["inner-west", "hornsby"], hRef: false, zonesBy: { "inner-west": ["SSFW", "STIF"], hornsby: ["RURAL"] }, months: m(12, 2), colour: "Cream", hex: "#EEE6C8", cg: ["white"], tox: ["low", "Leaves and oil can make pets sick if eaten in quantity."], allergy: ["moderate", "Mostly insect-pollinated; some people react to eucalypt pollen and oil."], pot: "45 L", uses: ["Feature plant", "Windbreak"], note: "Grey bark shedding in orange and cream patches. Important koala food tree. Large gardens only." }),
  T({ type: "Tree", size: "Large tree", sci: "Corymbia gummifera", common: "Red Bloodwood", h: [20, 25], w: [8, 12], sun: ["FS"], water: "LW", soil: "Any – sand", zonesBy: { hornsby: ["NORTH"] }, months: m(1, 4), colour: "Cream", hex: "#EEE6C8", cg: ["white"], tox: ["low", "Leaves and oil can make pets sick if eaten in quantity."], allergy: ["moderate", "Mostly insect-pollinated; some people react to eucalypt pollen and oil."], pot: "45 L", uses: ["Feature plant"], note: "Straight trunk with rough, tessellated bark and urn-shaped gumnuts. Food for Sugar Gliders. Large gardens only." })
];
const HSIZE = { Groundcover: "G", Fern: "G", Strappy: "G", Grass: "G", "Sedge & Rush": "G", Shrub: "S", Climber: null };
let nextId = Math.max.apply(null, PLANTS.map((p) => p.id)) + 1;
HORNSBY_NEW.forEach((p) => {
  p.id = nextId++;
  p.zones = p.zonesBy["inner-west"] || [];
  const cls = p.type === "Tree" ? (p.size === "Large tree" ? "LT" : "ST") : HSIZE[p.type];
  if (cls) p.sizeClass = HSC[cls];
  PLANTS.push(p);
});
// Council size class for shared species too
PLANTS.forEach((p) => {
  if (p.sizeClass || !p.councils.includes("hornsby")) return;
  const cls = p.type === "Tree" ? (p.size === "Large tree" ? "LT" : "ST") : HSIZE[p.type];
  if (cls) p.sizeClass = HSC[cls];
});

// ===== Hornsby suburbs (from the three brochures) =====
for (let i = SUBURBS.length - 1; i >= 0; i--) if (/Hornsby Shire/.test(SUBURBS[i].council)) SUBURBS.splice(i, 1);
[
  // Area 1 — Rural
  ["Arcadia", "2159", "RURAL"], ["Berrilee", "2159", "RURAL"], ["Galston", "2159", "RURAL"], ["Fiddletown", "2159", "RURAL"],
  ["Glenorie", "2157", "RURAL", ["The Hills Shire Council"]], ["Canoelands", "2157", "RURAL"], ["Forest Glen", "2157", "RURAL"],
  ["Dural", "2158", "RURAL", ["The Hills Shire Council"]], ["Middle Dural", "2158", "RURAL", ["The Hills Shire Council"]],
  ["Laughtondale", "2775", "RURAL"], ["Singletons Mill", "2775", "RURAL"], ["Wisemans Ferry", "2775", "RURAL", ["The Hills Shire Council"]],
  // Area 2 — Southern
  ["Hornsby", "2077", "SOUTH"], ["Waitara", "2077", "SOUTH"], ["Normanhurst", "2076", "SOUTH"], ["Wahroonga", "2076", "SOUTH", ["Ku-ring-gai Council"]],
  ["Thornleigh", "2120", "SOUTH"], ["Pennant Hills", "2120", "SOUTH"], ["Westleigh", "2120", "SOUTH"], ["Beecroft", "2119", "SOUTH"], ["Cheltenham", "2119", "SOUTH"],
  ["Epping", "2121", "SOUTH", ["City of Parramatta"]], ["North Epping", "2121", "SOUTH"], ["West Pennant Hills", "2125", "SOUTH", ["The Hills Shire Council"]],
  ["Cherrybrook", "2126", "SOUTH"], ["Glenhaven", "2156", "SOUTH", ["The Hills Shire Council"]],
  // Area 3 — Northern
  ["Asquith", "2077", "NORTH"], ["Hornsby Heights", "2077", "NORTH"], ["Mount Colah", "2079", "NORTH"], ["Mount Kuring-gai", "2080", "NORTH"],
  ["Berowra", "2081", "NORTH"], ["Cowan", "2081", "NORTH"], ["Berowra Heights", "2082", "NORTH"], ["Brooklyn", "2083", "NORTH"], ["Dangar Island", "2083", "NORTH"]
].forEach(([name, pc, zone, share]) => SUBURBS.push({ name, pc, council: "hornsby", zone, share: share || [] }));
// ===== Hornsby Community Nursery list =====
// Source: Hornsby Shire Council, "Stock Grown At Hornsby Community Nursery" (last updated January 2017).
// The list gives each plant's habitat and soil (sandstone, clay/shale, creeklines, estuary) but no sizes.
// Areas are matched from that soil note using the brochures' own rule: sandstone = Northern,
// shale/clay = Southern, both = Rural. "Australian Horticultural Plants" go in a separate HORT group.
// Sizes, sun, water and flowering are general reference values unless the species is also on the Inner West list.

COUNCILS.hornsby.zones.HORT = "Australian horticultural plants grown by the council nursery — not all are local to Hornsby";
COUNCILS.hornsby.zoneNames.HORT = "Horticultural";
COUNCILS.hornsby.zoneHelp = "Areas come from Hornsby's three planting guides. For plants only on the council nursery list, the area is matched from the soil type in council's notes.";
COUNCILS.hornsby.list = "Create a Native Garden brochures and the Community Nursery stock list";
COUNCILS.hornsby.sources.push({ label: "Hornsby Community Nursery stock list, 2017 (PDF)", url: "https://www.hornsby.nsw.gov.au/files/assets/public/v/1/environment/flora-and-fauna/native-plants-and-weeds/native-gardening-tips/documents/production-list-for-hsc-nursery-january-2017.pdf" });

const ZS = { S: ["NORTH", "RURAL"], C: ["SOUTH", "RURAL"], A: ["RURAL", "SOUTH", "NORTH"], E: ["NORTH", "RURAL"], H: ["HORT"] };
const HEX = { white: "#F1F0EC", yellow: "#E6BE1A", orange: "#E07A1E", pink: "#E07AA6", red: "#C41E3A", purple: "#7E5BB5", blue: "#3E6FC8", green: "#8DB04A", brown: "#8A6A3E" };
const PEA = /^(Pultenaea|Daviesia|Bossiaea|Dillwynia|Viminaria|Hardenbergia|Kennedia|Indigofera)/;
const EUC = /^(Eucalyptus|Corymbia|Angophora)/;

function NN(type, size, sci, common, h, w, sun, water, soil, months, colour, cg, uses, zones, note, o) {
  o = o || {};
  const fern = type === "Fern";
  let tox = ["safe", "No known toxicity."], allergy = ["low", fern ? "Fern spores; rarely a problem." : "Insect-pollinated."];
  if (type === "Grass") allergy = ["moderate", "Wind-pollinated grass."];
  if (/^Acacia/.test(sci)) { tox = ["low", "Not considered toxic."]; allergy = ["moderate", "Wattle pollen is heavy and mostly insect-carried, but sensitive people may react."]; }
  if (/Casuarina/.test(sci)) allergy = ["high", "Wind-pollinated; casuarina pollen is a known hay fever trigger."];
  if (EUC.test(sci)) { tox = ["low", "Leaves and oil can make pets sick if eaten in quantity."]; allergy = ["moderate", "Mostly insect-pollinated; some people react to eucalypt pollen and oil."]; }
  if (/^Grevillea/.test(sci)) { tox = ["low", "Not considered toxic if eaten."]; allergy = ["moderate", "Some grevilleas cause skin irritation — wear gloves when pruning."]; }
  if (PEA.test(sci)) tox = ["low", "Not known to be toxic. Pea-family seeds are best not eaten."];
  const big = type === "Tree" && h[1] >= 15;
  return {
    type, size: size || undefined, sci, common, h, w, sun, water, soil, months, colour,
    hex: o.hex || (cg.length ? HEX[cg[0]] : fern ? "#6E9A4F" : "#8DB04A"), cg,
    tox: o.tox || tox, allergy: o.allergy || allergy,
    pot: o.pot || (type === "Tree" ? (big ? "Tubestock / 45 L" : "Tubestock / 200 mm") : "Tubestock"),
    uses, note, councils: o.iw ? ["inner-west", "hornsby"] : ["hornsby"],
    zonesBy: Object.assign({ hornsby: Array.isArray(zones) ? zones : ZS[zones] }, o.iw ? { "inner-west": o.iw } : {}),
    hRef: !o.iw, nursery: true, gwa: null, alias: o.alias
  };
}
const NF = "No flowers (fern)";

const NURSERY_NEW = [
  // ---------- Trees ----------
  NN("Tree", "Small tree", "Acacia parramattensis", "Parramatta Green Wattle", [6, 10], [4, 6], ["FS", "PS"], "LW", "Any – clay", m(11, 1), "Pale yellow", ["yellow"], ["Screen", "Windbreak", "Feature plant"], "C", "Feathery-leaved wattle of shale forests. Summer flowering; attracts a wide range of wildlife."),
  NN("Tree", "Small tree", "Acacia implexa", "Hickory Wattle", [4, 10], [3, 5], ["FS", "PS", "S"], "LW", "Any", m(12, 4), "Pale yellow", ["yellow"], ["Screen", "Windbreak"], "C", "Very common tall wattle on clay; forms suckering stands if disturbed. Height from the Inner West list.", { iw: ["SSFW", "STIF"] }),
  NN("Tree", "Small tree", "Alphitonia excelsa", "Red Ash", [8, 12], [4, 6], ["FS", "PS"], "MW", "Any", m(12, 3), "Cream", ["white"], ["Feature plant", "Attractive foliage"], "A", "Leaves are silvery underneath and smell of sarsaparilla when crushed. Rainforest margins and sheltered gullies; common near the Hawkesbury River."),
  NN("Tree", "Small tree", "Angophora bakeri", "Narrow-leaved Apple", [6, 10], [4, 6], ["FS", "PS"], "LW", "Any – sand", m(12, 1), "Cream", ["white"], ["Feature plant"], "S", "Small, low tree with rough bark and narrow leaves, for sandy soil on sandstone."),
  NN("Tree", "Large tree", "Angophora costata", "Sydney Red Gum", [15, 25], [10, 15], ["FS", "PS"], "LW", "Any – sand", m(11, 1), "Cream", ["white"], ["Feature plant", "Wow factor"], "A", "Smooth pink-orange bark that sheds in summer, and gnarled limbs. Sandstone soils, also clay in Turpentine-Ironbark Forest. Large gardens only."),
  NN("Tree", "Large tree", "Angophora floribunda", "Rough-barked Apple", [15, 25], [10, 15], ["FS"], "MW", "Any", m(11, 1), "Cream", ["white"], ["Feature plant", "Windbreak"], "A", "Spreading tree with fibrous bark on deep alluvial soils and in Blue Gum High Forest; heavy summer flowering."),
  NN("Tree", "Small tree", "Backhousia myrtifolia", "Grey Myrtle", [4, 8], [3, 5], ["PS", "S"], "MW", "Any", m(11, 12), "Cream stars", ["white"], ["Screen", "Hedge", "Fragrant"], "A", "Dense small tree with aromatic leaves for sheltered, moist spots near streams."),
  NN("Tree", "Medium tree", "Casuarina glauca", "Swamp Oak", [10, 15], [4, 6], ["FS"], "HW", "Any – damp", m(9, 11), "Rusty spikes / red female", ["brown", "red"], ["Windbreak", "Screen"], "E", "Tolerates salty, waterlogged ground and forms stands along estuaries. Suckers readily."),
  NN("Tree", "Medium tree", "Ceratopetalum apetalum", "Coachwood", [10, 15], [5, 8], ["PS", "S"], "MW", "Any – damp", m(10, 11), "White, sepals turn pinkish", ["white", "pink"], ["Feature plant", "Screen"], "S", "Rainforest tree of sandstone creeklines in deep gullies; smooth grey bark."),
  NN("Tree", "Medium tree", "Doryphora sassafras", "Sassafras", [10, 15], [4, 6], ["PS", "S"], "MW", "Any (rich, moist)", m(7, 9), "White", ["white"], ["Feature plant", "Fragrant"], "S", "Rainforest tree with aromatic, glossy leaves. Rare in the shire — upper Berowra Creek on volcanic soils.", { tox: ["low", "Aromatic oils; not for eating."] }),
  NN("Tree", "Large tree", "Eucalyptus acmenoides", "White Mahogany", [15, 25], [8, 12], ["FS"], "LW", "Any – clay", m(11, 1), "White", ["white"], ["Feature plant"], "C", "Tree of heavy soils in the rural suburbs south to Epping; part of Turpentine-Ironbark Forest."),
  NN("Tree", "Large tree", "Eucalyptus globoidea", "White Stringybark", [15, 25], [8, 12], ["FS"], "LW", "Any – sand", m(3, 6), "White", ["white"], ["Feature plant", "Windbreak"], "S", "Stringy-barked tree of dry forest on well-watered sandy or alluvial soils."),
  NN("Tree", "Large tree", "Eucalyptus pilularis", "Blackbutt", [25, 35], [10, 15], ["FS"], "MW", "Any", m(12, 2), "Cream", ["white"], ["Feature plant"], "A", "Very tall tree of fertile, moist soils; rough dark bark on the lower trunk. Blue Gum High Forest and Turpentine-Ironbark Forest. Large sites only."),
  NN("Tree", "Large tree", "Eucalyptus piperita", "Sydney Peppermint", [16, 18], [8, 12], ["FS", "PS"], "LW", "Any – sand", m(11, 12), "Cream", ["white"], ["Feature plant"], "S", "Sandstone watercourses and hillsides; peppermint-scented leaves. Height from the Inner West list.", { iw: ["SSFW"] }),
  NN("Tree", "Medium tree", "Eucalyptus racemosa", "Snappy Gum", [10, 15], [6, 10], ["FS"], "LW", "Any – sand", m(6, 9), "Cream", ["white"], ["Feature plant"], "S", "Small to medium spreading gum with scribbled white bark, on sandstone hillsides."),
  NN("Tree", "Large tree", "Eucalyptus resinifera", "Red Mahogany", [20, 30], [10, 15], ["FS"], "MW", "Any", m(11, 1), "White", ["white"], ["Feature plant", "Windbreak"], "C", "Forest tree of deeper, fairly fertile soils; red-brown stringy bark."),
  NN("Tree", "Large tree", "Eucalyptus saligna", "Sydney Blue Gum", [30, 40], [10, 15], ["FS"], "MW", "Any – clay", m(1, 3), "White", ["white"], ["Feature plant"], "C", "Dominant tree of the critically endangered Blue Gum High Forest, on heavy clay. Very large — parks and big sites only."),
  NN("Tree", "Large tree", "Eucalyptus sieberi", "Silvertop Ash", [15, 25], [8, 10], ["FS"], "LW", "Any – sand", m(9, 11), "White", ["white"], ["Feature plant"], "S", "Ridgetop tree on lateritic sandstone soils; uncommon in the shire."),
  NN("Tree", "Large tree", "Eucalyptus tereticornis", "Forest Red Gum", [20, 30], [10, 15], ["FS"], "MW", "Any – clay", m(6, 11), "White", ["white"], ["Feature plant"], "C", "Tall, uncommon gum on shale; important koala food tree."),
  NN("Tree", "Medium tree", "Corymbia eximia", "Yellow Bloodwood", [8, 15], [6, 10], ["FS"], "LW", "Any – sand", m(10, 12), "Cream", ["white"], ["Feature plant", "Wow factor"], "S", "Drier sandstone country; yellow flaky bark and heavy late-spring flowering."),
  NN("Tree", "Small tree", "Glochidion ferdinandi", "Cheese Tree", [6, 12], [4, 6], ["FS", "PS"], "MW", "Any", m(9, 12), "Small greenish-yellow", ["green"], ["Screen", "Feature plant"], "A", "Shade tree for rainforest margins, wet forest and near water. Small pumpkin-shaped fruit feeds birds.", { tox: ["low", "Fruit is not for eating."] }),
  NN("Tree", "Medium tree", "Melaleuca quinquenervia", "Broad-leaved Paperbark", [8, 15], [5, 8], ["FS"], "HW", "Any – damp", m(3, 7), "Cream (musky scent)", ["white"], ["Windbreak", "Screen", "Feature plant"], "E", "Large paperbark forming near-pure stands beside salt water, especially around Brooklyn.", { allergy: ["moderate", "Musky flower scent and pollen can trigger hay fever in some people."] }),
  NN("Tree", "Small tree", "Stenocarpus salignus", "Scrub Beefwood", [8, 12], [4, 6], ["FS", "PS"], "MW", "Any – damp", m(10, 1), "White", ["white"], ["Feature plant", "Screen"], "A", "Small tree along watercourses with white, grevillea-like flowers in spring and summer."),
  NN("Tree", "Small tree", "Callicoma serratifolia", "Black Wattle (Callicoma)", [4, 12], [3, 5], ["FS", "PS"], "MW", "Any – sand", m(10, 12), "Creamy yellow balls", ["white", "yellow"], ["Screen", "Feature plant"], "A", "Multi-stemmed tall shrub or small tree along stream banks; often only 4–5 m. Height from the Inner West list.", { iw: ["SSFW"] }),

  // ---------- Shrubs ----------
  NN("Shrub", null, "Acacia linifolia", "Flax-leaf Wattle", [2, 2], [1, 1.5], ["FS", "PS", "S"], "LW", "Any", m(12, 3), "Cream", ["white"], ["Screen"], "S", "Common in forest on sandy soils, occasionally clay. Height from the Inner West list.", { iw: ["SSFW", "STIF"] }),
  NN("Shrub", null, "Acacia longissima", "Long-leaved Wattle", [2, 5], [2, 3], ["PS"], "MW", "Any (well-drained)", m(1, 4), "Pale yellow rods", ["yellow"], ["Screen"], "A", "Dense wattle with long, fine leaves for sheltered forest sites."),
  NN("Shrub", null, "Acacia oxycedrus", "Spike Wattle", [1, 3], [1, 2], ["FS", "PS"], "LW", "Any – sand", m(7, 9), "Bright yellow rods", ["yellow"], ["Hedge"], "S", "Sharp, spiky foliage — a good barrier and shelter for small birds. Uncommon, on sandstone ridgetops."),
  NN("Shrub", null, "Acacia stricta", "Straight Wattle", [1, 3], [1, 1.5], ["FS", "PS"], "LW", "Any – clay", m(6, 9), "Pale yellow", ["yellow"], ["Screen"], "C", "Uncommon small wattle of clay soils in Blue Gum High Forest and Turpentine-Ironbark Forest."),
  NN("Shrub", null, "Acacia terminalis", "Sunshine Wattle", [1.5, 1.5], [1, 1.5], ["FS", "PS"], "LW", "Any – sand", [2, 3, 6, 7, 8], "Bright yellow", ["yellow"], ["Wow factor", "Attractive foliage"], "S", "Ferny-leaved wattle of forest on sandstone. Height and flowering from the Inner West list.", { iw: ["SSFW", "STIF"] }),
  NN("Shrub", null, "Acacia ulicifolia", "Prickly Moses", [1.5, 1.5], [1, 1.5], ["FS", "PS"], "LW", "Any", m(3, 8), "Cream", ["white"], ["Hedge"], "A", "Prickly small wattle; shelter for small birds. Height and flowering from the Inner West list.", { iw: ["SSFW", "STIF"] }),
  NN("Shrub", null, "Acrotriche divaricata", "Ground Berry", [0.5, 1.5], [1, 2], ["PS", "S"], "MW", "Any", m(5, 9), "Tiny green", ["green"], ["Border plant", "Groundcover"], "A", "Very dense small shrub for sheltered, moist forest spots."),
  NN("Shrub", null, "Allocasuarina distyla", "Scrub She-oak", [2, 4], [1.5, 3], ["FS"], "LW", "Any – sand", m(3, 8), "Rusty spikes / red female", ["brown", "red"], ["Screen", "Windbreak"], "S", "Low she-oak of sandstone ridgetops."),
  NN("Shrub", null, "Banksia marginata", "Silver Banksia", [2, 6], [2, 3], ["FS", "PS"], "LW", "Any – sand", m(3, 7), "Pale yellow", ["yellow"], ["Screen", "Feature plant"], "S", "Large rounded shrub with small yellow autumn cones. Heath and woodland."),
  NN("Shrub", null, "Banksia oblongifolia", "Fern-leaved Banksia", [1, 3], [1, 2], ["FS", "PS"], "MW", "Any – sand", m(3, 8), "Greenish-yellow", ["green", "yellow"], ["Feature plant", "Attractive foliage"], "S", "Medium shrub with rusty new growth and greenish autumn cones. Heath and woodland."),
  NN("Shrub", null, "Bossiaea obcordata", "Spiny Bossiaea", [0.5, 1], [0.5, 1], ["FS", "PS"], "LW", "Any – sand", m(8, 10), "Yellow and red pea", ["yellow", "red"], ["Border plant"], "S", "Small, spiky pea flowering in early spring, in forest on sandstone."),
  NN("Shrub", null, "Bossiaea lenticularis", "Bossiaea", [0.5, 1], [0.5, 1], ["FS", "PS"], "LW", "Any – sand", m(8, 10), "Yellow and red pea", ["yellow", "red"], ["Border plant", "Attractive foliage"], ["NORTH"], "Rare small shrub of the northern shire with ornate foliage."),
  NN("Shrub", null, "Breynia oblongifolia", "Coffee Bush", [1, 3], [1, 2], ["FS", "PS", "S"], "MW", "Any", m(10, 3), "Tiny greenish", ["green"], ["Screen"], "A", "Common regrowth shrub of forests, with red or black berries.", { tox: ["low", "Berries are not for eating."] }),
  NN("Shrub", null, "Crowea exalata", "Small Crowea", [0.3, 1], [0.5, 1], ["PS"], "MW", "Any – sand", m(1, 6), "Bright pink stars", ["pink"], ["Border plant", "Wow factor"], ["NORTH", "RURAL", "HORT"], "Small shrub with pink starry flowers for sandy, well-drained soils."),
  NN("Shrub", null, "Darwinia fascicularis", "Darwinia", [0.5, 1.5], [0.5, 1], ["FS"], "MW", "Any – sand", m(6, 10), "White turning red", ["white", "red"], ["Border plant", "Feature plant"], "S", "Small sandstone shrub for full sun and moist sandy soil. Listed by council as Darwinia fasicularis."),
  NN("Shrub", null, "Daviesia corymbosa", "Bitter Pea", [1, 2], [0.5, 1], ["FS", "PS"], "LW", "Any – sand", m(8, 10), "Yellow and red pea", ["yellow", "red"], ["Border plant"], "S", "Small shrub of sandstone ridgetops in the drier north-west of the shire."),
  NN("Shrub", null, "Daviesia ulicifolia", "Native Gorse", [0.5, 1.5], [0.5, 1], ["FS", "PS"], "LW", "Any – clay", m(8, 10), "Yellow and red pea", ["yellow", "red"], ["Hedge"], "C", "Prickly small shrub on clay — good shelter for small birds. Blue Gum High Forest and Turpentine-Ironbark Forest."),
  NN("Shrub", null, "Denhamia sylvestris", "Orangebark", [3, 6], [2, 3], ["PS", "S"], "MW", "Any", m(10, 12), "Small cream", ["white"], ["Screen"], "A", "Forest and rainforest-margin shrub with yellow-orange fruit. Previously named Maytenus."),
  NN("Shrub", null, "Dillwynia retorta", "Heathy Parrot Pea", [1, 1], [0.5, 1], ["FS", "PS"], "LW", "Any – sand", m(9, 11), "Yellow and red-brown", ["yellow", "red"], ["Border plant", "Wow factor"], "S", "Common small sandstone shrub flowering in early spring. Height from the Inner West list.", { iw: ["SSFW"] }),
  NN("Shrub", null, "Eupomatia laurina", "Bolwarra", [3, 6], [2, 3], ["PS", "S"], "MW", "Any (moist)", m(11, 1), "Cream", ["white"], ["Screen", "Bush tucker"], "A", "Rainforest-margin shrub with edible, guava-like fruit.", { tox: ["safe", "Ripe fruit is edible (bush food)."] }),
  NN("Shrub", null, "Grevillea mucronulata", "Green Spider Flower", [1, 2], [1, 1.5], ["FS", "PS"], "LW", "Any – sand", m(5, 10), "Green and red", ["green", "red"], ["Border plant"], ["RURAL"], "Uncommon; outer rural suburbs on sandstone."),
  NN("Shrub", null, "Grevillea sericea", "Pink Spider Flower", [1, 2], [1, 1.5], ["FS", "PS"], "LW", "Any – sand", m(6, 11), "Pink", ["pink"], ["Feature plant", "Wow factor"], "S", "Woodland and heath shrub, especially around Berowra and Cowan."),
  NN("Shrub", null, "Grevillea speciosa", "Red Spider Flower", [1, 2], [1, 1.5], ["FS", "PS"], "LW", "Any – sand", m(6, 11), "Red", ["red"], ["Feature plant", "Wow factor"], "S", "Uncommon; Galston and Berowra through to Wisemans Ferry."),
  NN("Shrub", null, "Hakea sericea", "Needle Bush", [2, 3], [1.5, 2], ["FS", "PS", "S"], "MW", "Any", m(6, 8), "White", ["white"], ["Hedge", "Screen"], "A", "Spiky shrub with white winter flowers; excellent bird shelter. Height from the Inner West list.", { iw: ["STIF"] }),
  NN("Shrub", null, "Homalanthus nutans", "Bleeding Heart", [3, 6], [2, 4], ["FS", "PS"], "MW", "Any", m(10, 1), "Small yellow-green", ["green"], ["Screen", "Attractive foliage", "Autumn foliage"], "A", "Fast pioneer shrub; old leaves turn bright red before falling.", { tox: ["caution", "Milky sap may irritate skin and eyes."] }),
  NN("Shrub", null, "Isopogon anethifolius", "Drumsticks", [1, 3], [1, 1.5], ["FS", "PS"], "LW", "Any – sand", m(9, 11), "Yellow", ["yellow"], ["Feature plant"], "S", "Common sandstone shrub with fine divided leaves and drumstick-like seed heads."),
  NN("Shrub", null, "Lomatia myricoides", "River Lomatia", [2, 5], [2, 3], ["FS", "PS"], "MW", "Any – damp", m(11, 1), "Cream (fragrant)", ["white"], ["Screen", "Fragrant"], "A", "Tall, long-lived shrub of stream banks; tolerates flooding."),
  NN("Shrub", null, "Lomatia silaifolia", "Crinkle Bush", [0.5, 1], [0.5, 1], ["FS", "PS"], "LW", "Any – sand", m(11, 1), "Cream", ["white"], ["Attractive foliage", "Border plant"], "S", "Small sandstone shrub with finely divided leaves; flowers strongly after fire."),
  NN("Shrub", null, "Leptospermum squarrosum", "Pink Tea Tree", [2, 4], [1, 2], ["FS"], "LW", "Any – sand", m(3, 5), "Pink", ["pink"], ["Screen", "Feature plant", "Wow factor"], "S", "Narrow, upright tea tree for well-drained sandy soil in full sun; autumn flowers."),
  NN("Shrub", null, "Leptospermum trinervium", "Flaky-barked Tea Tree", [3, 5], [2, 3], ["FS", "PS"], "LW", "Any – sand", m(9, 11), "White", ["white"], ["Screen", "Attractive foliage"], "S", "Tall, long-lived tea tree with a flaky trunk and heavy spring flowering."),
  NN("Shrub", null, "Lambertia formosa", "Mountain Devil", [1, 2], [1, 1.5], ["FS", "PS"], "LW", "Any – sand", m(1, 12), "Pinkish red", ["red", "pink"], ["Feature plant"], "S", "Heath and woodland shrub; nectar-rich red flowers and horned 'devil' seed pods."),
  NN("Shrub", null, "Lasiopetalum parviflorum", "Small-flowered Velvet Bush", [0.3, 1], [0.5, 1], ["PS"], "LW", "Any – sand", m(8, 10), "White-pink", ["white", "pink"], ["Border plant"], "S", "Small shrub of ridgetop woodland."),
  NN("Shrub", null, "Leucopogon juniperinus", "Prickly Beard-heath", [1, 1], [0.5, 1], ["PS"], "MW", "Any", m(9, 11), "White", ["white"], ["Border plant"], "A", "Spiky small understorey shrub with berries. Height from the Inner West list.", { iw: ["SSFW", "STIF"] }),
  NN("Shrub", null, "Leucopogon lanceolatus", "Lance-leaf Beard-heath", [1, 3], [1, 1.5], ["PS"], "MW", "Any", m(8, 10), "White", ["white"], ["Screen"], "A", "Small upright shrub for sheltered forest on clay or sand."),
  NN("Shrub", null, "Melaleuca ericifolia", "Swamp Paperbark", [2, 6], [2, 3], ["FS"], "HW", "Any – damp", m(9, 11), "Cream", ["white"], ["Screen", "Hedge", "Windbreak"], "E", "Forms dense thickets on salty estuary margins."),
  NN("Shrub", null, "Myrsine howittiana", "Brush Muttonwood", [4, 8], [2, 4], ["PS", "S"], "MW", "Any", m(6, 9), "Cream", ["white"], ["Screen"], "A", "Small tree of rainforest margins with blue fruit. Previously named Rapanea."),
  NN("Shrub", null, "Myrsine variabilis", "Muttonwood", [2, 5], [1.5, 3], ["PS", "S"], "MW", "Any – sand", m(5, 8), "Cream", ["white"], ["Screen"], "S", "Coastal forest shrub on sandy soils with black fruit."),
  NN("Shrub", null, "Notelaea longifolia", "Native Olive", [3, 6], [2, 4], ["FS", "PS", "S"], "LW", "Any", m(8, 10), "Cream (fragrant)", ["white"], ["Screen", "Hedge", "Fragrant"], "A", "Tough shrub with leathery leaves and black fruit; forest on clay or sandstone.", { tox: ["low", "Fruit is not recommended for eating."] }),
  NN("Shrub", null, "Olearia microphylla", "Small-leaved Daisy Bush", [1, 2], [1, 1.5], ["FS", "PS"], "MW", "Any", m(8, 10), "White daisies", ["white"], ["Border plant", "Wow factor"], "A", "Covered in white daisies in spring; short-lived."),
  NN("Shrub", null, "Persoonia laurina", "Laurel Geebung", [1, 2], [1, 1.5], ["FS", "PS"], "LW", "Any", m(12, 3), "Yellow", ["yellow"], ["Bush tucker"], "A", "Slow-growing geebung for clay or enriched sandy soil; edible fruit.", { tox: ["safe", "Ripe fruit is edible (bush food)."] }),
  NN("Shrub", null, "Petrophile pulchella", "Conesticks", [1, 3], [0.5, 1], ["FS"], "LW", "Any – sand", m(11, 1), "Pale yellow", ["yellow"], ["Feature plant"], "S", "Narrow, upright shrub of heath and woodland on sandstone."),
  NN("Shrub", null, "Platysace lanceolata", "Shrubby Platysace", [0.5, 1.5], [0.5, 1], ["FS", "PS"], "LW", "Any – sand", m(11, 2), "White", ["white"], ["Border plant"], "S", "Understorey shrub that springs up after fire in sandstone country."),
  NN("Shrub", null, "Platysace linearifolia", "Carrot Tops", [0.3, 1], [0.3, 0.6], ["FS"], "LW", "Any – sand", m(11, 2), "White", ["white"], ["Border plant"], "S", "Post-fire understorey plant of more exposed sandstone sites."),
  NN("Shrub", null, "Pultenaea daphnoides", "Large-leaf Bush Pea", [1, 3], [1, 2], ["FS", "PS"], "MW", "Any – sand", m(8, 10), "Yellow and red", ["yellow", "red"], ["Screen", "Wow factor"], "S", "Pea shrub of heath to wet forest on sandy soils."),
  NN("Shrub", null, "Pultenaea linophylla", "Halo Bush Pea", [0.3, 1], [0.5, 1], ["FS", "PS"], "LW", "Any – sand", m(8, 10), "Yellow and red", ["yellow", "red"], ["Border plant"], ["NORTH"], "Rare small shrub from Hornsby Heights through to Cowan."),
  NN("Shrub", null, "Pultenaea retusa", "Notched Bush Pea", [0.5, 1.5], [0.5, 1], ["FS", "PS"], "LW", "Any – clay", m(8, 10), "Yellow and red", ["yellow", "red"], ["Border plant"], "C", "Small upright pea of clay forests."),
  NN("Shrub", null, "Pultenaea scabra var. biloba", "Rough Bush Pea", [1, 2], [0.5, 1.5], ["FS", "PS"], "LW", "Any", m(8, 10), "Yellow", ["yellow"], ["Border plant"], "A", "Very rare in the shire; forest on sandy or clay soils."),
  NN("Shrub", null, "Pultenaea tuberculata", "Wreath Bush Pea", [0.5, 1.5], [0.5, 1], ["FS", "PS"], "LW", "Any – sand", m(1, 4), "Yellow", ["yellow"], ["Border plant"], "S", "Very common in heath and woodland; flowers in late summer and autumn."),
  NN("Shrub", null, "Pultenaea villosa", "Hairy Bush Pea", [1, 2], [1, 2], ["FS", "PS"], "LW", "Any – clay", m(9, 10), "Yellow-orange", ["yellow", "orange"], ["Border plant", "Wow factor"], "C", "Rare weeping pea, often in Turpentine-Ironbark Forest."),
  NN("Shrub", null, "Telopea speciosissima", "NSW Waratah", [2, 3], [1, 1.5], ["FS", "PS"], "MW", "Any – sand", m(9, 11), "Red", ["red"], ["Feature plant", "Wow factor"], "S", "NSW floral emblem. Large red flowers; needs sheltered, moist sandy soil with good drainage."),
  NN("Shrub", null, "Trema aspera", "Poison Peach", [3, 6], [2, 3], ["FS", "PS"], "MW", "Any", m(10, 3), "Small greenish", ["green"], ["Screen"], "A", "Fast pioneer after disturbance; black fruits attract birds.", { tox: ["caution", "Leaves are reported to poison livestock; not for eating."] }),
  NN("Shrub", null, "Trochocarpa laurina", "Tree Heath", [3, 6], [2, 3], ["PS", "S"], "MW", "Any – damp", m(5, 9), "White", ["white"], ["Screen"], "A", "Large shrub with black fruit and fissured bark; rainforest margins and creeklines."),
  NN("Shrub", null, "Viminaria juncea", "Native Broom", [2, 4], [1, 2], ["FS"], "HW", "Any – damp", m(10, 12), "Yellow-orange", ["yellow", "orange"], ["Screen", "Feature plant"], "S", "Fast, short-lived pioneer for swampy ground; leafless, weeping green stems."),
  NN("Shrub", null, "Dracophyllum secundum", "Dracophyllum", [0.3, 1], [0.3, 0.6], ["PS"], "HW", "Any – damp", m(8, 11), "Pink-white", ["pink", "white"], ["Border plant"], "S", "Spreading small shrub of wet sandstone rock faces."),

  // ---------- Groundcovers, ferns, herbs ----------
  NN("Fern", null, "Calochlaena dubia", "Soft Bracken", [0.5, 1.5], [1, 3], ["PS", "S"], "MW", "Any – sand", [], NF, [], ["Groundcover"], "A", "Colony-forming fern for sheltered forest ground."),
  NN("Groundcover", null, "Centella asiatica", "Pennywort", [0.15, 0.15], [0.5, 1], ["FS", "PS", "S"], "MW", "Any", m(11, 5), "Tiny", ["green"], ["Groundcover", "Bush tucker"], "A", "Creeping groundcover for damp places. Height from the Inner West list.", { iw: ["STIF", "WC"] }),
  NN("Groundcover", null, "Geranium homeanum", "Native Geranium", [0.5, 0.5], [0.3, 0.6], ["FS", "PS", "S"], "MW", "Any", m(9, 2), "Pale pink", ["pink"], ["Groundcover"], "A", "Soft groundcover for damper forest sites. Height from the Inner West list.", { iw: ["STIF"] }),
  NN("Groundcover", null, "Hibbertia diffusa", "Wedge Guinea Flower", [0.2, 0.5], [0.5, 1], ["FS", "PS"], "LW", "Any", m(10, 12), "Bright yellow", ["yellow"], ["Groundcover", "Border plant"], "A", "Small groundcover with bright yellow late-spring flowers."),
  NN("Groundcover", null, "Hydrocotyle peduncularis", "Pennywort", [0.15, 0.15], [0.5, 1], ["PS", "S"], "MW", "Any", m(9, 2), "Tiny white", ["white"], ["Groundcover", "Lawn alternative"], "A", "Low creeping groundcover for moist forest soil. Height from the Inner West list.", { iw: ["STIF"] }),
  NN("Groundcover", null, "Hydrocotyle tripartita", "Pennywort", [0.05, 0.1], [0.5, 1], ["PS", "S"], "MW", "Any – damp", m(9, 2), "Tiny", ["green"], ["Groundcover", "Lawn alternative"], "A", "Tiny creeping groundcover for damp places along watercourses; fills gaps between pavers."),
  NN("Groundcover", null, "Mentha satureioides", "Native Pennyroyal", [0.1, 0.3], [0.5, 1], ["FS", "PS"], "MW", "Any", m(11, 3), "White", ["white"], ["Groundcover", "Fragrant", "Bush tucker"], "A", "Spreading, dense native mint with white summer flowers; leaves used for tea. Listed by council as Mentha satuerioides.", { tox: ["low", "Edible herb in small amounts; pennyroyal oils are toxic in quantity."] }),
  NN("Groundcover", null, "Pratia purpurascens", "White Root", [0.05, 0.1], [0.5, 1], ["PS", "S"], "MW", "Any", m(9, 4), "White-mauve", ["white", "purple"], ["Groundcover", "Lawn alternative"], "A", "Spreading groundcover with small white flowers; roots spread widely.", { tox: ["caution", "Contains alkaloids; not for eating."] }),
  NN("Groundcover", null, "Pseuderanthemum variabile", "Pastel Flower", [0.1, 0.3], [0.2, 0.5], ["PS", "S"], "MW", "Any", m(11, 3), "Lilac-pink", ["pink", "purple"], ["Groundcover"], "A", "Tiny, hardy, deep-rooted plant with lilac flowers for shade."),
  NN("Groundcover", null, "Pterostylis curta", "Blunt Greenhood (orchid)", [0.1, 0.3], [0.1, 0.3], ["PS", "S"], "MW", "Any – sand", m(7, 10), "Green and white hood", ["green", "white"], ["Feature plant"], "A", "Ground orchid that forms colonies; dies back after spring flowering."),
  NN("Groundcover", null, "Wahlenbergia stricta", "Tall Bluebell", [0.3, 0.6], [0.2, 0.4], ["FS", "PS"], "LW", "Any", m(9, 2), "Blue", ["blue"], ["Border plant"], "C", "Eucalypt forest wildflower, chiefly Blue Gum High Forest."),
  NN("Groundcover", null, "Thysanotus tuberosus", "Common Fringe-lily", [0.2, 0.6], [0.2, 0.3], ["FS", "PS"], "LW", "Any", m(10, 1), "Purple (fringed)", ["purple"], ["Border plant", "Bush tucker"], "A", "Delicate fringed purple flowers in early summer; tubers were a traditional food."),

  // ---------- Climbers ----------
  NN("Climber", null, "Eustrephus latifolius", "Wombat Berry", [1, 3], [1, 2], ["PS"], "LW", "Any", m(9, 12), "Pink-white", ["pink", "white"], ["Screen", "Bush tucker"], "A", "Light twiner with orange berries; the fleshy roots and arils were traditional food.", { iw: ["SSFW", "STIF"] }),
  NN("Climber", null, "Hibbertia dentata", "Trailing Guinea Flower", [1, 2], [1, 2], ["PS", "S"], "MW", "Any", m(8, 11), "Yellow", ["yellow"], ["Groundcover", "Screen"], "A", "Trailing vine or groundcover with bronze new leaves, for sheltered forest."),
  NN("Climber", null, "Tylophora barbata", "Bearded Tylophora", [1, 2], [0.5, 1], ["PS", "S"], "MW", "Any – clay", m(11, 2), "Small purple", ["purple"], ["Screen"], "C", "Small, light climber of sheltered forest on clay.", { tox: ["caution", "Milkweed family; treat as poisonous."] }),

  // ---------- Grasses ----------
  NN("Grass", null, "Austrodanthonia racemosa", "Wallaby Grass", [0.3, 0.6], [0.2, 0.4], ["FS", "PS"], "LW", "Any – clay", m(9, 12), "Straw seed heads", ["brown"], ["Border plant", "Lawn alternative"], "C", "Small, long-lived tufted grass; grows in winter. Now also named Rytidosperma racemosum."),
  NN("Grass", null, "Austrodanthonia tenuior", "Wallaby Grass", [0.3, 0.8], [0.3, 0.3], ["FS"], "LW", "Any", m(9, 12), "Straw seed heads", ["brown"], ["Border plant"], "A", "Tufted grass for clay or sand in full sun; winter growing. Now also named Rytidosperma tenuius."),
  NN("Grass", null, "Austrostipa pubescens", "Spear Grass", [0.6, 1.2], [0.3, 0.5], ["FS", "PS"], "LW", "Any", m(9, 12), "Straw seed heads", ["brown"], ["Border plant"], "A", "Rigid, very long-lived tussock; winter growing. Seeds are sharp."),
  NN("Grass", null, "Digitaria parviflora", "Small-flowered Finger Grass", [0.3, 0.6], [0.3, 0.3], ["FS", "PS"], "LW", "Any", m(12, 3), "Purplish seed heads", ["purple", "brown"], ["Border plant"], "A", "Summer-growing grass of forest on sandstone or clay."),
  NN("Grass", null, "Dichelachne micrantha", "Short-hair Plume Grass", [0.4, 0.8], [0.3, 0.3], ["FS", "PS"], "LW", "Any – clay", m(10, 1), "Feathery seed heads", ["brown"], ["Border plant"], "C", "Narrow tussock with plume-like seed heads. Listed by council as Dichelachne micranthra."),
  NN("Grass", null, "Echinopogon caespitosus", "Tufted Hedgehog Grass", [0.5, 0.5], [0.3, 0.4], ["PS", "S"], "MW", "Any", m(9, 12), "Round green seed heads", ["green"], ["Border plant"], "S", "Tall tufted grass with bristly round seed heads. Height from the Inner West list.", { iw: ["STIF"] }),
  NN("Grass", null, "Echinopogon ovatus", "Forest Hedgehog Grass", [0.2, 0.5], [0.3, 0.3], ["PS", "S"], "MW", "Any – clay", m(9, 12), "Round green seed heads", ["green"], ["Groundcover"], "C", "Low, spreading grass of clay forests; winter growing."),
  NN("Grass", null, "Entolasia marginata", "Bordered Panic", [0.2, 0.5], [0.5, 1], ["PS", "S"], "MW", "Any", m(11, 3), "Green seed heads", ["green"], ["Groundcover"], "A", "Scrambling grass for sheltered, moist forest; grows all year."),
  NN("Grass", null, "Entolasia stricta", "Wiry Panic", [0.3, 0.8], [0.3, 0.3], ["FS", "PS"], "LW", "Any", m(11, 3), "Green seed heads", ["green"], ["Border plant"], "A", "Slender, upright, long-lived grass on clay or sandstone."),
  NN("Grass", null, "Imperata cylindrica", "Blady Grass", [0.5, 1], [1, 3], ["FS", "PS"], "LW", "Any", m(10, 12), "Silky white plumes", ["white"], ["Groundcover"], "A", "Spreads strongly by underground stems — plant only where it can be contained."),
  NN("Grass", null, "Oplismenus aemulus", "Basket Grass", [0.2, 0.2], [0.5, 1], ["PS", "S"], "MW", "Any", m(12, 4), "Green seed heads", ["green"], ["Groundcover"], "A", "Soft, mat-forming grass for shade; grows fast in warm months. Height from the Inner West list.", { iw: ["SSFW", "STIF"] }),
  NN("Grass", null, "Oplismenus imbecillis", "Creeping Beard Grass", [0.1, 0.3], [0.5, 1], ["PS", "S"], "MW", "Any – damp", m(12, 4), "Green seed heads", ["green"], ["Groundcover"], "A", "Prostrate grass for sheltered, moist spots, especially creeklines."),
  NN("Grass", null, "Poa affinis", "Tussock Grass", [0.3, 0.6], [0.3, 0.5], ["PS", "S"], "MW", "Any – clay", m(9, 12), "Green-purple seed heads", ["green"], ["Border plant"], "C", "Soft tussock that forms meadows in shade; winter growing."),

  // ---------- Grass-like plants ----------
  NN("Strappy", null, "Arthropodium milleflorum", "Vanilla Lily", [0.4, 0.8], [0.2, 0.4], ["FS", "PS"], "MW", "Any – clay", m(10, 1), "Pale mauve (vanilla scent)", ["white", "purple"], ["Fragrant", "Border plant"], "C", "Soft grassy lily of clay forests with vanilla-scented flowers."),
  NN("Strappy", null, "Blandfordia nobilis", "Christmas Bells", [0.3, 0.8], [0.2, 0.4], ["FS"], "HW", "Any – sand", m(12, 1), "Red-orange bells with yellow tips", ["orange", "red", "yellow"], ["Feature plant", "Wow factor"], "S", "Orange-red bell flowers around Christmas; needs moist sandy soil in full sun."),
  NN("Strappy", null, "Dianella revoluta", "Blueberry Lily", [0.4, 0.8], [0.4, 0.6], ["FS", "PS"], "LW", "Any – clay", m(9, 12), "Blue", ["blue"], ["Border plant"], "C", "Tough strappy plant for clay soils in sun or light shade; blue berries.", { tox: ["low", "Berries not recommended for pets or small children."] }),
  NN("Strappy", null, "Doryanthes excelsa", "Gymea Lily", [1.5, 4], [1.5, 2.5], ["FS", "PS"], "LW", "Any", m(8, 10), "Red flower head on 4–6 m spike", ["red"], ["Feature plant", "Wow factor"], "S", "Huge rosette with a red flower spike up to 6 m. Takes years to flower."),
  NN("Sedge & Rush", null, "Juncus kraussii", "Sea Rush", [0.8, 1.5], [0.5, 1], ["FS"], "HW", "Any – damp", m(10, 1), "Brown", ["brown"], ["Border plant"], "E", "Large upright rush of salt marsh and saltwater edges."),
  NN("Sedge & Rush", null, "Lepidosperma laterale", "Variable Sword-sedge", [0.4, 1], [0.3, 0.6], ["FS", "PS"], "LW", "Any – sand", m(9, 12), "Brown", ["brown"], ["Border plant"], "S", "Tufted sedge of forest and woodland on sandy soils."),
  NN("Strappy", null, "Lomandra multiflora", "Many-flowered Mat-rush", [0.3, 0.6], [0.3, 0.5], ["FS", "PS"], "LW", "Any", m(9, 11), "Yellow", ["yellow"], ["Border plant"], "A", "Compact mat-rush for woodland and forest on many soils."),
  NN("Strappy", null, "Patersonia sericea", "Silky Purple-flag", [0.3, 0.5], [0.2, 0.4], ["FS", "PS"], "LW", "Any – sand", m(9, 12), "Purple", ["purple"], ["Border plant", "Attractive foliage"], "S", "Silver-grey tufts with purple iris-like flowers in spring."),
  NN("Strappy", null, "Xanthorrhoea arborea", "Broad-leaf Grass Tree", [1.5, 3], [1.5, 2], ["FS", "PS"], "LW", "Any – sand", m(8, 11), "Cream flower spike", ["white"], ["Feature plant", "Wow factor"], "S", "Grass tree that forms a trunk, for sheltered sites on sand or sandstone."),

  // ---------- Australian horticultural plants (council nursery) ----------
  NN("Shrub", null, "Abrophyllum ornans", "Native Hydrangea", [2, 5], [2, 3], ["PS", "S"], "MW", "Any (rich, moist)", m(10, 12), "Cream-yellow", ["white", "yellow"], ["Attractive foliage", "Screen"], "H", "Large-leaved rainforest understorey shrub with black berries."),
  NN("Shrub", null, "Acmena smithii var. minor", "Small-leaved Lilly Pilly", [3, 6], [2, 3], ["FS", "PS", "S"], "MW", "Any", m(11, 1), "Cream", ["white"], ["Hedge", "Topiary", "Screen", "Bush tucker"], "H", "Smaller, dense form of Lilly Pilly — good for hedging.", { tox: ["safe", "Fruit is edible (bush food)."] }),
  NN("Shrub", null, "Austromyrtus dulcis", "Midgen Berry", [0.5, 1.5], [1, 2], ["FS", "PS"], "MW", "Any – sand", m(10, 2), "White", ["white"], ["Groundcover", "Hedge", "Bush tucker"], "H", "Low spreading bush food with sweet speckled berries. Native to northern NSW, not Hornsby.", { tox: ["safe", "Berries are edible (bush food)."] }),
  NN("Shrub", null, "Cordyline petiolaris", "Broad-leaved Palm Lily", [2, 4], [1, 2], ["PS", "S"], "MW", "Any", m(10, 12), "Mauve", ["purple"], ["Feature plant", "Attractive foliage"], "H", "Palm-like plant with mauve flowers and red berries; tropical look for shade."),
  NN("Groundcover", null, "Dendrobium kingianum", "Pink Rock Orchid", [0.1, 0.3], [0.2, 0.5], ["PS"], "LW", "Rock or bark (epiphyte)", m(8, 10), "Pink-white (fragrant)", ["pink", "white"], ["Feature plant", "Fragrant"], "H", "Orchid that grows on rocks and tree trunks; scented spring flowers."),
  NN("Shrub", null, "Eriostemon 'Profusion'", "Wax Flower 'Profusion'", [0.8, 1.2], [0.8, 1.2], ["FS", "PS"], "LW", "Any (well-drained)", m(7, 10), "White", ["white"], ["Hedge", "Border plant", "Fragrant", "Wow factor"], "H", "Tough, aromatic small shrub covered in white stars in spring. Now also sold as Philotheca 'Profusion'."),
  NN("Shrub", null, "Graptophyllum ilicifolium", "Native Holly", [2, 4], [1, 2], ["PS", "S"], "MW", "Any", m(9, 11), "Crimson", ["red"], ["Feature plant"], "H", "Shade-loving shrub with prickly leaves and crimson flowers; rare in the wild."),
  NN("Shrub", null, "Grevillea shiressii", "Blue Grevillea", [2, 4], [2, 3], ["PS"], "MW", "Any – damp", m(7, 9), "Blue-green", ["blue", "green"], ["Screen"], "H", "Rare grevillea found naturally only at Mooney Mooney Creek."),
  NN("Groundcover", null, "Hypoxis hygrometrica", "Golden Weather-glass", [0.05, 0.15], [0.1, 0.1], ["FS", "PS"], "MW", "Any", m(1, 5), "Golden yellow stars", ["yellow"], ["Border plant"], "H", "Tiny lily with golden star flowers in late summer and autumn."),
  NN("Fern", null, "Polystichum australiense", "Mother Shield Fern", [0.3, 0.6], [0.5, 1], ["PS", "S"], "MW", "Any", [], NF, [], ["Groundcover", "Attractive foliage"], "H", "Fern that spreads by plantlets on older fronds. Listed by council as Polysticium australense."),
  NN("Shrub", null, "Prostanthera incisa", "Cut-leaf Mint Bush", [1, 2], [1, 1.5], ["FS", "PS"], "MW", "Any (well-drained)", m(9, 11), "Lilac", ["purple"], ["Fragrant", "Border plant", "Wow factor"], "H", "Scented foliage and lilac spring flowers; needs good drainage.", { tox: ["low", "Aromatic oils; not for eating."] }),
  NN("Shrub", null, "Prostanthera scutellarioides", "Western Sydney Mint Bush", [1, 2], [1, 1.5], ["FS", "PS"], "LW", "Any", m(8, 10), "Deep purple", ["purple"], ["Border plant", "Wow factor"], "H", "Tolerant mint bush with deep purple spring flowers; foliage is not aromatic."),
  NN("Groundcover", null, "Trachymene incisa", "Wild Parsnip", [0.3, 0.8], [0.3, 0.3], ["FS", "PS"], "LW", "Any – sand", m(10, 3), "White", ["white"], ["Border plant"], "H", "Upright perennial herb with tight heads of white flowers.")
];

// Species already in the database that are also on the nursery list
const NURSERY_EXISTING = {
  "Allocasuarina littoralis": "S", "Banksia integrifolia": "E", "Eucalyptus robusta": ["RURAL"],
  "Acacia longifolia": "A", "Acacia suaveolens": "S", "Bursaria spinosa": "C", "Callistemon linearis": "S",
  "Dodonaea triquetra": "A", "Kunzea ambigua": "A", "Pittosporum revolutum": "A", "Commelina cyanea": "A",
  "Dichondra repens": "A", "Billardiera scandens": "A", "Kennedia rubicunda": "A", "Cymbopogon refractus": "S",
  "Microlaena stipoides": "A", "Ficinia nodosa": "E", "Carex appressa": "H"
};
PLANTS.forEach((p) => {
  const z = NURSERY_EXISTING[p.sci];
  if (z !== undefined) {
    if (!p.councils.includes("hornsby")) p.councils.push("hornsby");
    p.zonesBy.hornsby = [...new Set((p.zonesBy.hornsby || []).concat(Array.isArray(z) ? z : ZS[z]))];
    p.nursery = true;
  }
  if (p.sci === "Prostanthera ovalifolia") p.zonesBy.hornsby = [...new Set(p.zonesBy.hornsby.concat("HORT"))];
  if (p.sci === "Ficinia nodosa") p.alias = "Listed by Hornsby as Isolepis nodosa";
});
// Brochure species that also appear on the nursery list
["Acmena smithii", "Allocasuarina torulosa", "Elaeocarpus reticulatus", "Eucalyptus haemastoma", "Eucalyptus paniculata", "Eucalyptus punctata",
 "Corymbia gummifera", "Syncarpia glomulifera", "Tristaniopsis laurina", "Acacia floribunda", "Acacia myrtifolia", "Angophora hispida",
 "Austromyrtus tenuifolia", "Baeckea linifolia", "Banksia ericifolia", "Banksia serrata", "Banksia spinulosa", "Bauera rubioides",
 "Callistemon citrinus", "Ceratopetalum gummiferum", "Goodenia ovata", "Grevillea buxifolia", "Grevillea linearifolia", "Indigofera australis",
 "Leptospermum polygalifolium", "Ozothamnus diosmifolius", "Pultenaea flexilis", "Zieria smithii", "Actinotus helianthi", "Adiantum aethiopicum",
 "Doodia aspera", "Clematis glycinoides", "Hardenbergia violacea", "Hibbertia scandens", "Morinda jasminoides", "Pandorea pandorana",
 "Austrostipa ramosissima", "Themeda triandra", "Dianella caerulea", "Gahnia sieberiana", "Juncus usitatus", "Lomandra longifolia",
 "Xanthorrhoea media", "Prostanthera ovalifolia"].forEach((s) => { const p = PLANTS.find((x) => x.sci === s); if (p) p.nursery = true; });

NURSERY_NEW.forEach((p) => {
  p.id = nextId++;
  p.zones = p.zonesBy["inner-west"] || [];
  if (p.type === "Tree") p.sizeClass = null;
  PLANTS.push(p);
});
// ===== Hornsby: sources and habitat (authoritative, applied last) =====
// Only source kept: Hornsby Shire Council, "Stock Grown At Hornsby Community Nursery" (January 2017),
// linked from the council's current Native gardening tips page.
// The 2005 "Create a Native Garden" brochures are no longer linked by council and have been removed as a source:
// species found only in those brochures are dropped, and their suburb "areas" are no longer used.
// Habitat codes below follow the soil/setting described in the nursery list's notes.

const HORNSBY_LIST_URL = "https://www.hornsby.nsw.gov.au/files/assets/public/v/1/documents/production-list-for-hsc-nursery-january-2017.pdf";
Object.assign(COUNCILS.hornsby, {
  list: "Stock Grown At Hornsby Community Nursery (January 2017)",
  pdf: HORNSBY_LIST_URL,
  zones: {
    SAND: "Sandstone — sandy, well-drained, low-nutrient soils (ridges, heath, woodland)",
    CLAY: "Shale / clay — heavier, more fertile soils (Blue Gum High Forest, Turpentine-Ironbark Forest)",
    WET: "Creeks, gullies and damp ground — rainforest margins, stream banks, sheltered moist sites",
    SALT: "Estuary and saltwater edges — Hawkesbury River, tidal inlets, salt marsh",
    HORT: "Australian horticultural plants grown by the council nursery — not all are local to Hornsby"
  },
  zoneNames: { SAND: "Sandstone", CLAY: "Shale / clay", WET: "Creeks & damp", SALT: "Estuary", HORT: "Horticultural" },
  zoneLabel: "Habitat",
  zoneHelp: "From the notes in Hornsby's nursery list. Pick the soil and conditions that match your site.",
  sources: [{ label: "Stock Grown At Hornsby Community Nursery, Jan 2017 (PDF)", url: HORNSBY_LIST_URL }]
});
COUNCILS["inner-west"].pdf = "https://www.innerwest.nsw.gov.au/sites/default/files/2026-02/Native%20Plants%20of%20the%20Inner%20West%20list%20FINAL%20181120%20%2810%29.pdf";
COUNCILS["inner-west"].sources = [{ label: "Native Plants of the Inner West (PDF)", url: COUNCILS["inner-west"].pdf }];

const HABITAT = {
  // Trees
  "Acacia parramattensis": "CLAY", "Acmena smithii": "WET", "Allocasuarina littoralis": "SAND", "Allocasuarina torulosa": "CLAY",
  "Alphitonia excelsa": "WET", "Angophora bakeri": "SAND", "Angophora costata": "SAND CLAY", "Angophora floribunda": "CLAY WET",
  "Backhousia myrtifolia": "WET", "Banksia integrifolia": "SALT", "Casuarina glauca": "SALT", "Ceratopetalum apetalum": "SAND WET",
  "Doryphora sassafras": "WET", "Elaeocarpus reticulatus": "WET", "Eucalyptus acmenoides": "CLAY", "Eucalyptus globoidea": "SAND",
  "Eucalyptus haemastoma": "SAND", "Eucalyptus paniculata": "CLAY", "Eucalyptus pilularis": "SAND CLAY", "Eucalyptus piperita": "SAND",
  "Eucalyptus punctata": "CLAY SAND", "Eucalyptus racemosa": "SAND", "Eucalyptus resinifera": "CLAY", "Eucalyptus robusta": "WET",
  "Eucalyptus saligna": "CLAY", "Eucalyptus sieberi": "SAND", "Eucalyptus tereticornis": "CLAY", "Corymbia eximia": "SAND",
  "Corymbia gummifera": "SAND", "Glochidion ferdinandi": "WET SALT", "Melaleuca quinquenervia": "SALT", "Stenocarpus salignus": "WET",
  "Syncarpia glomulifera": "CLAY", "Tristaniopsis laurina": "WET",
  // Shrubs
  "Acacia floribunda": "SAND CLAY", "Acacia implexa": "CLAY", "Acacia linifolia": "SAND", "Acacia longifolia": "SAND CLAY",
  "Acacia longissima": "SAND CLAY", "Acacia myrtifolia": "SAND", "Acacia oxycedrus": "SAND", "Acacia stricta": "CLAY",
  "Acacia suaveolens": "SAND", "Acacia terminalis": "SAND", "Acacia ulicifolia": "SAND CLAY", "Acrotriche divaricata": "WET",
  "Allocasuarina distyla": "SAND", "Angophora hispida": "SAND", "Austromyrtus tenuifolia": "SAND WET", "Baeckea linifolia": "WET",
  "Banksia ericifolia": "SAND", "Banksia marginata": "SAND", "Banksia oblongifolia": "SAND", "Banksia serrata": "SAND",
  "Banksia spinulosa": "SAND", "Bauera rubioides": "WET", "Bossiaea obcordata": "SAND", "Bossiaea lenticularis": "SAND",
  "Breynia oblongifolia": "SAND CLAY", "Bursaria spinosa": "CLAY SALT", "Callicoma serratifolia": "WET", "Callistemon citrinus": "SAND WET",
  "Callistemon linearis": "SAND", "Ceratopetalum gummiferum": "SAND", "Crowea exalata": "SAND HORT", "Darwinia fascicularis": "SAND",
  "Daviesia corymbosa": "SAND", "Daviesia ulicifolia": "CLAY", "Denhamia sylvestris": "WET", "Dillwynia retorta": "SAND",
  "Dodonaea triquetra": "SAND CLAY", "Eupomatia laurina": "WET", "Goodenia ovata": "CLAY SALT", "Grevillea buxifolia": "SAND",
  "Grevillea linearifolia": "SAND", "Grevillea mucronulata": "SAND", "Grevillea sericea": "SAND", "Grevillea speciosa": "SAND",
  "Hakea sericea": "SAND CLAY", "Homalanthus nutans": "SAND CLAY", "Indigofera australis": "CLAY", "Isopogon anethifolius": "SAND",
  "Kunzea ambigua": "SAND CLAY", "Lomatia myricoides": "WET", "Lomatia silaifolia": "SAND", "Leptospermum polygalifolium": "SAND WET",
  "Leptospermum squarrosum": "SAND", "Leptospermum trinervium": "SAND", "Lambertia formosa": "SAND", "Lasiopetalum parviflorum": "SAND",
  "Leucopogon juniperinus": "CLAY SAND", "Leucopogon lanceolatus": "CLAY SAND", "Melaleuca ericifolia": "SALT", "Myrsine howittiana": "WET",
  "Myrsine variabilis": "SAND", "Notelaea longifolia": "CLAY SAND", "Olearia microphylla": "CLAY SAND", "Ozothamnus diosmifolius": "CLAY SAND",
  "Persoonia laurina": "CLAY SAND", "Petrophile pulchella": "SAND", "Pittosporum revolutum": "CLAY SAND", "Platysace lanceolata": "SAND",
  "Platysace linearifolia": "SAND", "Pultenaea daphnoides": "SAND", "Pultenaea flexilis": "SAND CLAY", "Pultenaea linophylla": "SAND",
  "Pultenaea retusa": "CLAY", "Pultenaea scabra var. biloba": "SAND CLAY", "Pultenaea tuberculata": "SAND", "Pultenaea villosa": "CLAY",
  "Telopea speciosissima": "SAND", "Trema aspera": "SAND CLAY", "Trochocarpa laurina": "WET", "Viminaria juncea": "WET", "Zieria smithii": "CLAY SAND",
  // Groundlayer
  "Actinotus helianthi": "SAND", "Adiantum aethiopicum": "WET", "Calochlaena dubia": "SAND CLAY", "Centella asiatica": "WET",
  "Commelina cyanea": "WET", "Dichondra repens": "SAND CLAY", "Doodia aspera": "CLAY WET", "Dracophyllum secundum": "SAND WET",
  "Geranium homeanum": "WET", "Hibbertia diffusa": "SAND CLAY", "Hydrocotyle peduncularis": "WET", "Hydrocotyle tripartita": "WET",
  "Mentha satureioides": "SAND CLAY", "Pratia purpurascens": "SAND CLAY", "Pseuderanthemum variabile": "SAND CLAY", "Pterostylis curta": "SAND CLAY",
  "Wahlenbergia stricta": "CLAY", "Thysanotus tuberosus": "SAND CLAY",
  // Vines
  "Billardiera scandens": "CLAY SAND", "Clematis glycinoides": "CLAY SAND", "Eustrephus latifolius": "CLAY SAND", "Hardenbergia violacea": "CLAY SAND",
  "Hibbertia dentata": "CLAY WET", "Hibbertia scandens": "CLAY", "Kennedia rubicunda": "CLAY SAND", "Morinda jasminoides": "WET",
  "Pandorea pandorana": "WET", "Tylophora barbata": "CLAY",
  // Grasses
  "Austrodanthonia racemosa": "CLAY", "Austrodanthonia tenuior": "CLAY SAND", "Austrostipa pubescens": "CLAY SAND", "Austrostipa ramosissima": "WET",
  "Cymbopogon refractus": "SAND", "Digitaria parviflora": "SAND CLAY", "Dichelachne micrantha": "CLAY", "Echinopogon caespitosus": "SAND",
  "Echinopogon ovatus": "CLAY", "Entolasia marginata": "WET", "Entolasia stricta": "CLAY SAND", "Imperata cylindrica": "SAND CLAY",
  "Microlaena stipoides": "SAND CLAY", "Oplismenus aemulus": "SAND CLAY", "Oplismenus imbecillis": "WET", "Poa affinis": "CLAY WET", "Themeda triandra": "CLAY",
  // Grass-like
  "Arthropodium milleflorum": "CLAY", "Blandfordia nobilis": "SAND WET", "Dianella caerulea": "SAND CLAY", "Dianella revoluta": "CLAY",
  "Doryanthes excelsa": "SAND WET", "Gahnia sieberiana": "WET SAND", "Ficinia nodosa": "SALT", "Juncus usitatus": "WET", "Juncus kraussii": "SALT",
  "Lepidosperma laterale": "SAND", "Lomandra longifolia": "SAND CLAY", "Lomandra multiflora": "SAND CLAY", "Patersonia sericea": "SAND",
  "Xanthorrhoea arborea": "SAND", "Xanthorrhoea media": "SAND",
  // Australian horticultural plants
  "Abrophyllum ornans": "HORT", "Acmena smithii var. minor": "HORT", "Austromyrtus dulcis": "HORT", "Carex appressa": "HORT",
  "Cordyline petiolaris": "HORT", "Dendrobium kingianum": "HORT", "Eriostemon 'Profusion'": "HORT", "Graptophyllum ilicifolium": "HORT",
  "Grevillea shiressii": "HORT", "Hypoxis hygrometrica": "HORT", "Polystichum australiense": "HORT", "Prostanthera incisa": "HORT",
  "Prostanthera ovalifolia": "HORT", "Prostanthera scutellarioides": "HORT", "Trachymene incisa": "HORT"
};

// Apply: drop Hornsby membership for anything not on the nursery list, then set habitat.
const HORNSBY_DROPPED = [];
for (let i = PLANTS.length - 1; i >= 0; i--) {
  const p = PLANTS[i];
  if (!p.councils.includes("hornsby")) continue;
  if (!p.nursery) {
    p.councils = p.councils.filter((c) => c !== "hornsby");
    delete p.zonesBy.hornsby;
    HORNSBY_DROPPED.push(p.sci);
    if (!p.councils.length) PLANTS.splice(i, 1);
    continue;
  }
  p.zonesBy.hornsby = HABITAT[p.sci] ? HABITAT[p.sci].split(" ") : [];
  p.sizeClass = null;
  if (p.note) p.note = p.note.replace(/ Listed by council as Brachycome angustifolia\./, "");
}
// Hornsby suburbs are no longer split into brochure areas
SUBURBS.forEach((s) => { if (s.council === "hornsby") delete s.zone; });
// All 128 NSW local councils (NSW Spatial Services LGA boundaries, Sep 2026)
const NSW_COUNCILS = ["ALBURY CITY", "ARMIDALE REGIONAL", "BALLINA", "BALRANALD", "BATHURST REGIONAL", "BAYSIDE", "BEGA VALLEY", "BELLINGEN", "BERRIGAN", "BLACKTOWN", "BLAND", "BLAYNEY", "BLUE MOUNTAINS", "BOGAN", "BOURKE", "BREWARRINA", "BROKEN HILL", "BURWOOD", "BYRON", "CABONNE", "CAMDEN", "CAMPBELLTOWN", "CANADA BAY", "CANTERBURY-BANKSTOWN", "CARRATHOOL", "CENTRAL COAST", "CENTRAL DARLING", "CESSNOCK", "CITY OF PARRAMATTA", "CLARENCE VALLEY", "COBAR", "COFFS HARBOUR", "COOLAMON", "COONAMBLE", "COOTAMUNDRA-GUNDAGAI REGIONAL", "COWRA", "CUMBERLAND", "DUBBO REGIONAL", "DUNGOG", "EDWARD RIVER", "EUROBODALLA", "FAIRFIELD", "FEDERATION", "FORBES", "GEORGES RIVER", "GILGANDRA", "GLEN INNES SEVERN", "GOULBURN MULWAREE", "GREATER HUME SHIRE", "GRIFFITH", "GUNNEDAH", "GWYDIR", "HAWKESBURY", "HAY", "HILLTOPS", "HORNSBY", "HUNTERS HILL", "INNER WEST", "INVERELL", "JUNEE", "KEMPSEY", "KIAMA", "KU-RING-GAI", "KYOGLE", "LACHLAN", "LAKE MACQUARIE", "LANE COVE", "LEETON", "LISMORE", "LITHGOW CITY", "LIVERPOOL", "LIVERPOOL PLAINS", "LOCKHART", "MAITLAND", "MID-COAST", "MID-WESTERN REGIONAL", "MOREE PLAINS", "MOSMAN", "MURRAY RIVER", "MURRUMBIDGEE", "MUSWELLBROOK", "NAMBUCCA VALLEY", "NARRABRI", "NARRANDERA", "NARROMINE", "NEWCASTLE", "NORTH SYDNEY", "NORTHERN BEACHES", "OBERON", "ORANGE", "PARKES", "PENRITH", "PORT MACQUARIE-HASTINGS", "PORT STEPHENS", "QUEANBEYAN-PALERANG REGIONAL", "RANDWICK", "RICHMOND VALLEY", "RYDE", "SHELLHARBOUR", "SHOALHAVEN", "SINGLETON", "SNOWY MONARO REGIONAL", "SNOWY VALLEYS", "STRATHFIELD", "SUTHERLAND SHIRE", "SYDNEY", "TAMWORTH REGIONAL", "TEMORA", "TENTERFIELD", "THE HILLS SHIRE", "TWEED", "UPPER HUNTER", "UPPER LACHLAN SHIRE", "URALLA", "WAGGA WAGGA", "WALCHA", "WALGETT", "WARREN", "WARRUMBUNGLE", "WAVERLEY", "WEDDIN", "WENTWORTH", "WILLOUGHBY", "WINGECARRIBEE", "WOLLONDILLY", "WOLLONGONG", "WOOLLAHRA", "YASS VALLEY"];
