/******************************************************************************
 * Visualization setup and definitions https://aibolem.github.io/spacekit/docs/modules.html#Coordinate3d
 * https://aibolem.github.io/spacekit/docs/classes/Ephem.html
 *****************************************************************************/

const viz = new Spacekit.Simulation(document.getElementById('main-container'), {
  jdPerSecond: 0.01,
  particleTextureUrl: '{{assets}}/sprites/fuzzyparticle.png',
  unitsPerAu: 100.0,
  camera: {
    initialPosition: [
     /* 0.1739865009560048, -0.12915937125168006, 0.10357994703146715, */
      /* jupiter       */
    /*  0.0014980565625981512, -0.030445338891231168, 0.03616394298897485,*/
      /* teegarden */
     0.04, 0.16, 2.6, 
      
    ],
  },
});

// Create a light source somewhere off in the distance.
const SUN_POS = [5, 5, 1];
viz.createLight(SUN_POS);
viz.createObject(
  'sun',
  Object.assign(Spacekit.SpaceObjectPresets.SUN, {
    position: SUN_POS,
  }),
);

// Create a starry background using Yale Bright Star Catalog Data.
viz.createStars();
particleTextureUrl: 'bsc/bsc5.dat/bsc5.dat';

// Create saturn
const saturn = viz.createSphere('saturn', {
  textureUrl: './th_saturn.png',
  radius: 58232.503 / 149598000, // radius in AU, so Saturn is shown to scale
  levelsOfDetail: [
    { radii: 0, segments: 64 },
    { radii: 30, segments: 16 },
    { radii: 60, segments: 8 },
  ],
  atmosphere: {
    enable: false,
  },
  occludeLabels: true,
});
saturn.addRings(74270.580913, 140478.924731, './saturn_rings_top.png');

// Add its moons
const moonObjs = [];
let saturnSatellites = [];
viz.loadNaturalSatellites().then((loader) => {
  saturnSatellites = loader.getSatellitesForPlanet('saturn');
  saturnSatellites.forEach((moon) => {
    const obj = viz.createObject(moon.name, {
      labelText: moon.name,
      ephem: moon.ephem,
      particleSize: 50,
    });
    moonObjs.push(obj);
  });
});

/******************************************************************************
 * GUI and User Interactions below
 *****************************************************************************/

const guiState = {
  Speed: 0.01,
  Highlight: 'REGULAR',
  'Hide other orbits': true,
  'Hide labels': false,
  'Set Date': function () {
    const input = prompt('Enter a date in YYYY-MM-DD format', '2023-10-15');
    if (input) {
      viz.setDate(new Date(input));
    }
  },
};
const gui = new dat.GUI();
gui.add(guiState, 'Speed', 0, 20).onChange((val) => {
  viz.setJdPerSecond(val);
});

// Map from a category string to the tag in NaturalSatellites object.
const tagFilters = {
  All: 'ALL',
  None: 'NONE',
  'Regular orbits': 'REGULAR',
  'Irregular orbits': 'IRREGULAR',
  'Newly discovered': 'NEWLY_DISCOVERED',
  'Lost (unconfirmed)': 'LOST',
};

function resetDisplay() {
  const showLabels = !guiState['Hide labels'];
  moonObjs.forEach((moonObj) => {
    moonObj.getOrbit().setVisibility(true);
    moonObj.getOrbit().setHexColor(0x444444);
    moonObj.setLabelVisibility(showLabels);
  });
}

function updateFilterDisplay(tag) {
  if (tag === 'ALL') {
    resetDisplay();
    return;
  }

  const matching = new Set(
    saturnSatellites
      .filter((moon) => moon.tags.has(tag))
      .map((moon) => moon.name),
  );

  const showLabels = !guiState['Hide labels'];
  moonObjs.forEach((moonObj) => {
    if (matching.has(moonObj.getId())) {
      moonObj.getOrbit().setVisibility(true);
      moonObj.getOrbit().setHexColor(0xffff00);
      moonObj.setLabelVisibility(showLabels);
    } else if (guiState['Hide other orbits']) {
      moonObj.getOrbit().setVisibility(false);
      moonObj.setLabelVisibility(showLabels);
    } else {
      moonObj.getOrbit().setHexColor(0x444444);
      moonObj.getOrbit().setVisibility(true);
      moonObj.setLabelVisibility(showLabels);
    }
  });
}

gui
  .add(guiState, 'Highlight', Object.keys(tagFilters))
  .onChange((catString) => {
    const tag = tagFilters[catString];
    updateFilterDisplay(tag);
  });
gui.add(guiState, 'Hide other orbits').onChange(() => {
  updateFilterDisplay(tagFilters[guiState.Highlight]);
});
gui.add(guiState, 'Hide labels').onChange(() => {
  updateFilterDisplay(tagFilters[guiState.Highlight]);
});
//gui.add(guiState, 'Set Date');

             // Just Close 
gui.close();

window.THREE = Spacekit.THREE;
