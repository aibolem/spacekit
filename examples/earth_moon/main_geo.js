// Create the visualization and put it in our div.
const viz = new Spacekit.Simulation(document.getElementById('main-container'), {
  basePath: '../../src',
  jdPerSecond: 5,
});

// Create a skybox using NASA TYCHO artwork.
// viz.createSkybox(Spacekit.SkyboxPresets.NASA_TYCHO);
viz.createStars();

// Create our first object - the sun - using a preset space object.
viz.createObject('sun', Spacekit.SpaceObjectPresets.SUN);

// Then add some planets
viz.createObject('mercury', Spacekit.SpaceObjectPresets.MERCURY);
viz.createObject('venus', Spacekit.SpaceObjectPresets.VENUS);
viz.createObject('mars', Spacekit.SpaceObjectPresets.MARS);
viz.createObject('jupiter', Spacekit.SpaceObjectPresets.JUPITER);
viz.createObject('saturn', Spacekit.SpaceObjectPresets.SATURN);
viz.createObject('uranus', Spacekit.SpaceObjectPresets.URANUS);
viz.createObject('neptune', Spacekit.SpaceObjectPresets.NEPTUNE);
viz.createObject('pluto', Spacekit.SpaceObjectPresets.PLUTO);

const earth = viz.createObject(
  'earth',
  Object.assign(Spacekit.SpaceObjectPresets.EARTH, {
    labelText: 'Earth',
  }),
);

const moon = viz.createObject('moon', Spacekit.SpaceObjectPresets.MOON);
moon.orbitAround(earth);

const spaceship = viz.createObject('Rocksky_or_Asteroid_to_move=A₽ØApsis_PeriApsis', {
  labelText: 'Rocksky_A₽ØApsis_PeriApsis',
  ephem: new Spacekit.Ephem(
    {
      // These parameters define orbit shape.
      // Эксцентриситет e и либо большая полуось a, либо расстояние перицентра q используются для определения формы и размера орбиты.
      a: 0.3,
      e: 0.5,
      i: 52,

      // These parameters define the orientation of the orbit.
      // Долгота восходящего узла Ω, наклонение i и аргумент перицентра ω или долгота перицентра ϖ определяют ориентацию орбиты в ее плоскости.
      om: 3.170946964325638e2,
      w: 1.774865822248395e2,
      ma: 1.764302192487955e2,

      // Where the object is in its orbit.
      epoch: 2460317,
    },
    'deg',
  ),
});
spaceship.orbitAround(earth);

const spaceshipMoon = viz.createObject('spaceskepet_მივუახლოვდებით_gей©ева', {
  labelText: 'spaceskepet_მივუახლოვდებით_gей©ева',
  ephem: new Spacekit.Ephem(
    {
      // These parameters define orbit shape.
      a: 0.1,
      e: 0,
      i: 0,

      // These parameters define the orientation of the orbit.
      om: 0,
      w: 0,
      ma: 0,

      // Where the object is in its orbit.
      epoch: 2460317,
    },
    'deg',
  ),
});
spaceshipMoon.orbitAround(spaceship);
