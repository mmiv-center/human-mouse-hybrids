// example for the two datasets used in the animated bar plot
var data1 = [
  { group: "A", value: 4 },
  { group: "B", value: 16 },
  { group: "C", value: 8 }
];

var data2 = [
  { group: "A", value: 7 },
  { group: "B", value: 1 },
  { group: "C", value: 20 }
];

// in order to iterate through a (flat) object and change all the values 
function objectMap(object, mapFn) {
  return Object.keys(object).reduce(function (result, key) {
    result[key] = mapFn(object[key], key)
    return result
  }, {})
}

function distributeControlPointsSquare() {
  // instead a circle configuration do a square one
  var radius = 0.65;
  var circles = [];
  var circle_lengths = {};
  var scale = 1;
  for (var i = 0; i < set_variations.length; i++) {
    if (circles.indexOf(set_variations[i].c.circle) == -1) {
      circles.push(set_variations[i].c.circle);
      circle_lengths[set_variations[i].c.circle] = 0;
    }
    circle_lengths[set_variations[i].c.circle]++;
  }
  var circle_lengths_keys = Object.keys(circle_lengths);
  for (var i = 1; i < circle_lengths_keys.length; i++) {
    circle_lengths[circle_lengths_keys[i]]++;
  }
  var w = 2;
  var h = 2; // aspect ratio is important
  var aspect_ratio = w / h;

  function sizes(w, h, n) {
    nx = Math.sqrt((w / h) * n + ((w - h) * (w - h) / (4 * h * h))) - ((w - h) / (2 * h))
    ny = n / nx;
    return [Math.ceil(nx), Math.ceil(ny)];
  }
  var s = [1, 1];
  for (var c = 0; c < circles.length; c++) {
    var circle = circles[c];
    if (c == 1) {
      scale *= 0.5 * w / s[0];
    }
    // distribute the control points in a square
    var cx = set_variations[circle].c.x;
    var cy = set_variations[circle].c.y;
    s = sizes(w, h, circle_lengths[circle]);
    // but we need to change the circle coordinates as well now
    var ci = 0;
    var di = scale * (0.5 * w / s[0]);
    var x = (ci % s[0]) * w / s[0];
    var y = Math.floor(ci / s[0]) * h / s[1];
    set_variations[circle].c.x = (di + cx + scale * (x)) - (w / 2);
    set_variations[circle].c.y = (di + cy + scale * (y)) - (h / 2);

    ci++;
    for (var i = 0; i < set_variations.length; i++) {
      if (set_variations[i].c.circle != circle) {
        continue;
      }
      var di = scale * (0.5 * w / s[0]);
      var x = (ci % s[0]) * w / s[0];
      var y = Math.floor(ci / s[0]) * h / s[1];
      set_variations[i].c = {
        x: (di + cx + scale * (x)) - (w / 2),
        y: (di + cy + scale * (y)) - (h / 2),
        circle: set_variations[i].c.circle,
        weight: set_variations[i].c.weight
      };
      ci++;
    }
  }
}

// assume that we have a varying number of set variations and
// distribute them in a circle (c-coordinates)
function distributeControlPoints() { // start with circle 0
  var radius = 0.65;
  var circles = [];
  var circle_lengths = {};
  for (var i = 0; i < set_variations.length; i++) {
    if (circles.indexOf(set_variations[i].c.circle) == -1) {
      circles.push(set_variations[i].c.circle);
      circle_lengths[set_variations[i].c.circle] = 0;
    }
    circle_lengths[set_variations[i].c.circle]++;
  }
  var circle_lengths_keys = Object.keys(circle_lengths);
  for (var i = 1; i < circle_lengths_keys.length; i++) {
    circle_lengths[circle_lengths_keys[i]]++;
  }
  //console.log(JSON.stringify(circle_lengths));
  //console.log(JSON.stringify(circles));
  for (var c = 0; c < circles.length; c++) {
    var circle = circles[c];
    // we would like to create an offset angle for each lower level circle based on the
    // orientation of the higher level circle position of the middle point
    var offset_angle = 0;
    if (c > 0) {
      offset_angle = set_variations[circles[c]].c.offset_angle;
    }
    var cx = set_variations[circle].c.x;
    var cy = set_variations[circle].c.y;
    var ci = 0;
    for (var i = 0; i < set_variations.length; i++) {
      if (i == circle) {
        // ignore this one, it is always at the center
        continue;
      }
      if (set_variations[i].c.circle != circle) {
        continue;
      } else {
        cx = set_variations[circle].c.x;
        cy = set_variations[circle].c.y;
      }
      var angle = ci * 2 * Math.PI / (circle_lengths[circle] - 1) + offset_angle;
      ci++;
      var x = Math.cos(angle) * radius;
      var y = Math.sin(angle) * radius;
      set_variations[i].c = { x: cx + x, y: cy + y, circle: set_variations[i].c.circle, offset_angle: angle, weight: set_variations[i].c.weight };
    }
    if (c == 0) {
      radius *= 0.35;
    }
  }
}

var demo01 = [
  { // the first set will always be placed in the center
    name: "setA",
    idx: 0,
    set: {},
    c: { x: 0, y: 0, circle: 0, weight: 0 },
    description: "No highlight, ignore the other set."
  }
];
var demo02 = [
  { // the first set will always be placed in the center
    name: "setA",
    idx: 0,
    set: {},
    c: { x: 0, y: 0, circle: 0, weight: 0 },
    description: "No highlight, ignore the other set."
  },
  { // the first set will always be placed in the center
    name: "setB",
    idx: 1,
    set: {},
    c: { x: 0, y: 0, circle: 0, weight: 0 },
    description: "No highlight, ignore the other set."
  }
];

var demo03 = [
  { // the first set will always be placed in the center
    name: "setA",
    idx: 0,
    set: {},
    c: { x: 0, y: 0, circle: 0, weight: 0 },
    description: "No highlight, ignore the other set."
  },
  { // the first set will always be placed in the center
    name: "setB",
    idx: 1,
    set: {},
    c: { x: 0, y: 0, circle: 0, weight: 0 },
    description: "No highlight, ignore the other set."
  },
  { // the first set will always be placed in the center
    name: "setC",
    idx: 2,
    set: {},
    c: { x: 0, y: 0, circle: 0, weight: 0 },
    description: "No highlight, ignore the other set."
  }
];

var demo04 = [
  { // the first set will always be placed in the center
    name: "setA",
    idx: 0,
    set: {},
    c: { x: 0, y: 0, circle: 0, weight: 0 },
    description: "No highlight, ignore the other set."
  },
  { // the first set will always be placed in the center
    name: "setB",
    idx: 1,
    set: {},
    c: { x: 0, y: 0, circle: 0, weight: 0 },
    description: "No highlight, ignore the other set."
  },
  { // the first set will always be placed in the center
    name: "setC",
    idx: 2,
    set: {},
    c: { x: 0, y: 0, circle: 0, weight: 0 },
    description: "No highlight, ignore the other set."
  },
  { // the first set will always be placed in the center
    name: "setD",
    idx: 3,
    set: {},
    c: { x: 0, y: 0, circle: 0, weight: 0 },
    description: "No highlight, ignore the other set."
  }
];



var demo05 = [
  { // the first set will always be placed in the center
    name: "setA",
    idx: 0,
    set: {},
    c: { x: 0, y: 0, circle: 0, weight: 0 },
    description: "No highlight, ignore the other set."
  },
  { // the first set will always be placed in the center
    name: "setB",
    idx: 1,
    set: {},
    c: { x: 0, y: 0, circle: 0, weight: 0 },
    description: "No highlight, ignore the other set."
  },
  { // the first set will always be placed in the center
    name: "setC",
    idx: 2,
    set: {},
    c: { x: 0, y: 0, circle: 0, weight: 0 },
    description: "No highlight, ignore the other set."
  },
  { // the first set will always be placed in the center
    name: "setD",
    idx: 3,
    set: {},
    c: { x: 0, y: 0, circle: 0, weight: 0 },
    description: "No highlight, ignore the other set."
  },
  { // the first set will always be placed in the center
    name: "setD",
    idx: 4,
    set: {},
    c: { x: 0, y: 0, circle: 0, weight: 0 },
    description: "No highlight, ignore the other set."
  }
];

var demo06 = [
  { // the first set will always be placed in the center
    name: "setA",
    idx: 0,
    set: {},
    c: { x: 0, y: 0, circle: 0, weight: 0 },
    description: "No highlight, ignore the other set."
  },
  { // the first set will always be placed in the center
    name: "setB",
    idx: 1,
    set: {},
    c: { x: 0, y: 0, circle: 0, weight: 0 },
    description: "No highlight, ignore the other set."
  },
  { // the first set will always be placed in the center
    name: "setC",
    idx: 2,
    set: {},
    c: { x: 0, y: 0, circle: 0, weight: 0 },
    description: "No highlight, ignore the other set."
  },
  { // the first set will always be placed in the center
    name: "setD",
    idx: 3,
    set: {},
    c: { x: 0, y: 0, circle: 0, weight: 0 },
    description: "No highlight, ignore the other set."
  },
  { // the first set will always be placed in the center
    name: "setD",
    idx: 4,
    set: {},
    c: { x: 0, y: 0, circle: 0, weight: 0 },
    description: "No highlight, ignore the other set."
  },
  { // the first set will always be placed in the center
    name: "setE",
    idx: 5,
    set: {},
    c: { x: 0, y: 0, circle: 0, weight: 0 },
    description: "No highlight, ignore the other set."
  }
];

var demo06_weight = [
  { // the first set will always be placed in the center
    name: "setA",
    idx: 0,
    set: {},
    c: { x: 0, y: 0, circle: 0, weight: 0 },
    description: "No highlight, ignore the other set."
  },
  { // the first set will always be placed in the center
    name: "setB",
    idx: 1,
    set: {},
    c: { x: 0, y: 0, circle: 0, weight: 3000 },
    description: "No highlight, ignore the other set."
  },
  { // the first set will always be placed in the center
    name: "setC",
    idx: 2,
    set: {},
    c: { x: 0, y: 0, circle: 0, weight: 0 },
    description: "No highlight, ignore the other set."
  },
  { // the first set will always be placed in the center
    name: "setD",
    idx: 3,
    set: {},
    c: { x: 0, y: 0, circle: 0, weight: 0 },
    description: "No highlight, ignore the other set."
  },
  { // the first set will always be placed in the center
    name: "setD",
    idx: 4,
    set: {},
    c: { x: 0, y: 0, circle: 0, weight: 0 },
    description: "No highlight, ignore the other set."
  },
  { // the first set will always be placed in the center
    name: "setE",
    idx: 5,
    set: {},
    c: { x: 0, y: 0, circle: 0, weight: 0 },
    description: "No highlight, ignore the other set."
  }
];

var demo04_01 = [
  { // the first set will always be placed in the center
    name: "set41",
    idx: 0,
    set: {},
    c: { x: 0, y: 0, circle: 0, weight: 0 },
    description: "No highlight, ignore the other set."
  },
  { // the first set will always be placed in the center
    name: "setB",
    idx: 1,
    set: {},
    c: { x: 0, y: 0, circle: 0, weight: 0 },
    description: "No highlight, ignore the other set."
  },
  { // the first set will always be placed in the center
    name: "setC",
    idx: 2,
    set: {},
    c: { x: 0, y: 0, circle: 0, weight: 0 },
    description: "No highlight, ignore the other set."
  },
  { // the first set will always be placed in the center
    name: "setD",
    idx: 3,
    set: {},
    c: { x: 0, y: 0, circle: 0, weight: 0 },
    description: "No highlight, ignore the other set."
  },
  { // the first set will always be placed in the center
    name: "setAA",
    idx: 4,
    set: {},
    c: { x: 0, y: 0, circle: 1, weight: 0 },
    description: "No highlight, ignore the other set."
  }
];
var demo04_02 = [
  { // the first set will always be placed in the center
    name: "set42",
    idx: 0,
    set: {},
    c: { x: 0, y: 0, circle: 0, weight: 0 },
    description: "No highlight, ignore the other set."
  },
  { // the first set will always be placed in the center
    name: "setB",
    idx: 1,
    set: {},
    c: { x: 0, y: 0, circle: 0, weight: 0 },
    description: "No highlight, ignore the other set."
  },
  { // the first set will always be placed in the center
    name: "setC",
    idx: 2,
    set: {},
    c: { x: 0, y: 0, circle: 0, weight: 0 },
    description: "No highlight, ignore the other set."
  },
  { // the first set will always be placed in the center
    name: "setD",
    idx: 3,
    set: {},
    c: { x: 0, y: 0, circle: 0, weight: 0 },
    description: "No highlight, ignore the other set."
  },
  { // the first set will always be placed in the center
    name: "setAA",
    idx: 4,
    set: {},
    c: { x: 0, y: 0, circle: 1, weight: 0 },
    description: "No highlight, ignore the other set."
  },
  { // the first set will always be placed in the center
    name: "setAB",
    idx: 5,
    set: {},
    c: { x: 0, y: 0, circle: 1, weight: 0 },
    description: "No highlight, ignore the other set."
  }
];

var demo04_03 = [
  { // the first set will always be placed in the center
    name: "set42",
    idx: 0,
    set: {},
    c: { x: 0, y: 0, circle: 0, weight: 0 },
    description: "No highlight, ignore the other set."
  },
  { // the first set will always be placed in the center
    name: "setB",
    idx: 1,
    set: {},
    c: { x: 0, y: 0, circle: 0, weight: 0 },
    description: "No highlight, ignore the other set."
  },
  { // the first set will always be placed in the center
    name: "setC",
    idx: 2,
    set: {},
    c: { x: 0, y: 0, circle: 0, weight: 0 },
    description: "No highlight, ignore the other set."
  },
  { // the first set will always be placed in the center
    name: "setD",
    idx: 3,
    set: {},
    c: { x: 0, y: 0, circle: 0, weight: 0 },
    description: "No highlight, ignore the other set."
  },
  { // the first set will always be placed in the center
    name: "setAA",
    idx: 4,
    set: {},
    c: { x: 0, y: 0, circle: 1, weight: 0 },
    description: "No highlight, ignore the other set."
  },
  { // the first set will always be placed in the center
    name: "setAB",
    idx: 5,
    set: {},
    c: { x: 0, y: 0, circle: 1, weight: 0 },
    description: "No highlight, ignore the other set."
  },
  { // the first set will always be placed in the center
    name: "setAB",
    idx: 6,
    set: {},
    c: { x: 0, y: 0, circle: 1, weight: 0 },
    description: "No highlight, ignore the other set."
  }
];

var demo04_04 = [
  { // the first set will always be placed in the center
    name: "set42",
    idx: 0,
    set: {},
    c: { x: 0, y: 0, circle: 0, weight: 0 },
    description: "No highlight, ignore the other set."
  },
  { // the first set will always be placed in the center
    name: "setB",
    idx: 1,
    set: {},
    c: { x: 0, y: 0, circle: 0, weight: 0 },
    description: "No highlight, ignore the other set."
  },
  { // the first set will always be placed in the center
    name: "setC",
    idx: 2,
    set: {},
    c: { x: 0, y: 0, circle: 0, weight: 0 },
    description: "No highlight, ignore the other set."
  },
  { // the first set will always be placed in the center
    name: "setD",
    idx: 3,
    set: {},
    c: { x: 0, y: 0, circle: 0, weight: 0 },
    description: "No highlight, ignore the other set."
  },
  { // the first set will always be placed in the center
    name: "setAA",
    idx: 4,
    set: {},
    c: { x: 0, y: 0, circle: 1, weight: 0 },
    description: "No highlight, ignore the other set."
  },
  { // the first set will always be placed in the center
    name: "setAB",
    idx: 5,
    set: {},
    c: { x: 0, y: 0, circle: 1, weight: 0 },
    description: "No highlight, ignore the other set."
  },
  { // the first set will always be placed in the center
    name: "setAB",
    idx: 6,
    set: {},
    c: { x: 0, y: 0, circle: 1, weight: 0 },
    description: "No highlight, ignore the other set."
  },
  { // the first set will always be placed in the center
    name: "setAB",
    idx: 7,
    set: {},
    c: { x: 0, y: 0, circle: 1, weight: 0 },
    description: "No highlight, ignore the other set."
  }
];

var demo04_05 = [
  { // the first set will always be placed in the center
    name: "set42",
    idx: 0,
    set: {},
    c: { x: 0, y: 0, circle: 0, weight: 0 },
    description: "No highlight, ignore the other set."
  },
  { // the first set will always be placed in the center
    name: "setB",
    idx: 1,
    set: {},
    c: { x: 0, y: 0, circle: 0, weight: 0 },
    description: "No highlight, ignore the other set."
  },
  { // the first set will always be placed in the center
    name: "setC",
    idx: 2,
    set: {},
    c: { x: 0, y: 0, circle: 0, weight: 0 },
    description: "No highlight, ignore the other set."
  },
  { // the first set will always be placed in the center
    name: "setD",
    idx: 3,
    set: {},
    c: { x: 0, y: 0, circle: 0, weight: 0 },
    description: "No highlight, ignore the other set."
  },
  { // the first set will always be placed in the center
    name: "setAA",
    idx: 4,
    set: {},
    c: { x: 0, y: 0, circle: 1, weight: 0 },
    description: "No highlight, ignore the other set."
  },
  { // the first set will always be placed in the center
    name: "setAB",
    idx: 5,
    set: {},
    c: { x: 0, y: 0, circle: 1, weight: 0 },
    description: "No highlight, ignore the other set."
  },
  { // the first set will always be placed in the center
    name: "setAB",
    idx: 6,
    set: {},
    c: { x: 0, y: 0, circle: 1, weight: 0 },
    description: "No highlight, ignore the other set."
  },
  { // the first set will always be placed in the center
    name: "setAB",
    idx: 7,
    set: {},
    c: { x: 0, y: 0, circle: 1, weight: 0 },
    description: "No highlight, ignore the other set."
  },
  { // the first set will always be placed in the center
    name: "setAB",
    idx: 8,
    set: {},
    c: { x: 0, y: 0, circle: 1, weight: 0 },
    description: "No highlight, ignore the other set."
  }
];

var demo04_06 = [
  { // the first set will always be placed in the center
    name: "set42",
    idx: 0,
    set: {},
    c: { x: 0, y: 0, circle: 0, weight: 0 },
    description: "No highlight, ignore the other set."
  },
  { // the first set will always be placed in the center
    name: "setB",
    idx: 1,
    set: {},
    c: { x: 0, y: 0, circle: 0, weight: 0 },
    description: "No highlight, ignore the other set."
  },
  { // the first set will always be placed in the center
    name: "setC",
    idx: 2,
    set: {},
    c: { x: 0, y: 0, circle: 0, weight: 0 },
    description: "No highlight, ignore the other set."
  },
  { // the first set will always be placed in the center
    name: "setD",
    idx: 3,
    set: {},
    c: { x: 0, y: 0, circle: 0, weight: 0 },
    description: "No highlight, ignore the other set."
  },
  { // the first set will always be placed in the center
    name: "setAA",
    idx: 4,
    set: {},
    c: { x: 0, y: 0, circle: 1, weight: 0 },
    description: "No highlight, ignore the other set."
  },
  { // the first set will always be placed in the center
    name: "setAB",
    idx: 5,
    set: {},
    c: { x: 0, y: 0, circle: 1, weight: 0 },
    description: "No highlight, ignore the other set."
  },
  { // the first set will always be placed in the center
    name: "setAB",
    idx: 6,
    set: {},
    c: { x: 0, y: 0, circle: 1, weight: 0 },
    description: "No highlight, ignore the other set."
  },
  { // the first set will always be placed in the center
    name: "setAB",
    idx: 7,
    set: {},
    c: { x: 0, y: 0, circle: 1, weight: 0 },
    description: "No highlight, ignore the other set."
  },
  { // the first set will always be placed in the center
    name: "setAB",
    idx: 8,
    set: {},
    c: { x: 0, y: 0, circle: 1, weight: 0 },
    description: "No highlight, ignore the other set."
  },
  { // the first set will always be placed in the center
    name: "setAB",
    idx: 9,
    set: {},
    c: { x: 0, y: 0, circle: 1, weight: 0 },
    description: "No highlight, ignore the other set."
  }
];


var demo_max = [
  { // the first set will always be placed in the center
    name: "setA",
    idx: 0,
    set: {},
    c: { x: 0, y: 0, circle: 0, weight: 0 },
    description: "No highlight, ignore the other set."
  },
  {
    name: "setB",
    idx: 1,
    set: {}, // w1 == 1
    c: { x: 1, y: 0, circle: 0, weight: 0 },
    description: "Alternate between Mouse and Human."
  },
  {
    name: "intersection",
    set: {}, // w1 == 0
    idx: 2,
    c: { x: 0, y: 1, circle: 0, weight: 0 },
    description: "Highlight what is not in the other set."
  },
  {
    name: "frequency peak 01",
    set: {}, // w1 == 0
    idx: 3,
    c: { x: 0, y: -1, circle: 0, weight: 0 },
    description: "Highlight all values at the slowest repeating frequency.",
    descLong: "Characteristic frequencies are computed by treating the mutation locations as a time series. Peak detection in the Fourier spectrum identifies repeating patterns. Using the detected peak frequency and phase we reconstruct an envelope function that is multiplied with the proteomics data for the current protein and mutation type."
  },
  {
    name: "frequency peak 02",
    set: {}, // w1 == 0
    idx: 4,
    c: { x: 0, y: -1, circle: 3, weight: 0 },
    description: "Highlight all values at the second slowest repeating frequency.",
    descLong: "Characteristic frequencies are computed by treating the mutation locations as a time series. Peak detection in the Fourier spectrum identifies repeating patterns. Using the detected peak frequency and phase we reconstruct an envelope function that is multiplied with the proteomics data for the current protein and mutation type."
  },
  {
    name: "frequency peak 03",
    set: {}, // w1 == 0
    idx: 5,
    c: { x: 0, y: -1, circle: 3, weight: 0 },
    description: "Highlight all values at the third characteristic frequency.",
    descLong: "Characteristic frequencies are computed by treating the mutation locations as a time series. Peak detection in the Fourier spectrum identifies repeating patterns. Using the detected peak frequency and phase we reconstruct an envelope function that is multiplied with the proteomics data for the current protein and mutation type."
  },
  {
    name: "frequency peak 04",
    set: {}, // w1 == 0
    idx: 6,
    c: { x: 0, y: -1, circle: 3, weight: 0 },
    description: "Highlight all values at the fourth repeating frequency.",
    descLong: "Characteristic frequencies are computed by treating the mutation locations as a time series. Peak detection in the Fourier spectrum identifies repeating patterns. Using the detected peak frequency and phase we reconstruct an envelope function that is multiplied with the proteomics data for the current protein and mutation type."
  },
  {
    name: "frequency peak 05",
    set: {}, // w1 == 0
    idx: 7,
    c: { x: 0, y: -1, circle: 3, weight: 0 },
    description: "Highlight all values at the fifth (fastest) repeating frequency.",
    descLong: "Characteristic frequencies are computed by treating the mutation locations as a time series. Peak detection in the Fourier spectrum identifies repeating patterns. Using the detected peak frequency and phase we reconstruct an envelope function that is multiplied with the proteomics data for the current protein and mutation type."
  },
  {
    name: "difference",
    set: {}, // w1 == 0
    idx: 8,
    c: { x: 0, y: -1, circle: 0, weight: 0 },
    description: "Highlight where MOUSE and HUMAN are the same"
  },
  {
    name: "union",
    set: {}, // w1 == 0
    idx: 9,
    c: { x: 0, y: -1, circle: 0, weight: 0 },
    description: "Highlight what is added by the other"
  },
  {
    name: "Jaccard",
    set: {}, // w1 == 0
    idx: 10,
    c: { x: 0, y: -1, circle: 0, weight: 0 },
    description: "Highlight relative difference using the Jaccard index"
  },
  {
    name: "0",
    set: {}, // w1 == 0
    idx: 11,
    c: { x: -1, y: 0, circle: 0, weight: 300 },
    description: "Highlight what is in this set",
    descLong: "The marginal distribution of mutation values for a given protein and mutation type is described based on their quartiles. 25% of the values are expected to be between the minimum and q1, between q1 and q2, between q2 and q3, and between q3 and the maximum value."
  },
  /*  {
      name: "min-q1",
      set: {}, // w1 == 0
      idx: 12,
      c: { x: 0, y: -1, circle: 11, weight: 0 },
      description: "Highlight all values that are between the minimum and q1",
      descLong: "The marginal distribution of mutation values for a given protein and mutation type is described based on their quartiles. 25% of the values are expected to be between the minimum and q1, between q1 and q2, between q2 and q3, and between q3 and the maximum value."
    },
    {
      name: "q1-q2",
      set: {}, // w1 == 0
      idx: 13,
      c: { x: 0, y: -1, circle: 11, weight: 0 },
      description: "Highlight all values that are between q1 and q2",
      descLong: "The marginal distribution of mutation values for a given protein and mutation type is described based on their quartiles. 25% of the values are expected to be between the minimum and q1, between q1 and q2, between q2 and q3, and between q3 and the maximum value."
    }, */
  {
    name: "q1-q3",
    set: {}, // w1 == 0
    idx: 12,
    c: { x: 0, y: -1, circle: 11, weight: 100 },
    description: "Highlight values in the middle (between q1 and q3)",
    descLong: "The marginal distribution of mutation values for a given protein and mutation type is described based on their quartiles. 25% of the values are expected to be between the minimum and q1, between q1 and q2, between q2 and q3, and between q3 and the maximum value."
  },
  /*  {
      name: "q2-q3",
      set: {}, // w1 == 0
      idx: 15,
      c: { x: 0, y: -1, circle: 11, weight: 0 },
      description: "Highlight all values that are between q2 and q3",
      descLong: "The marginal distribution of mutation values for a given protein and mutation type is described based on their quartiles. 25% of the values are expected to be between the minimum and q1, between q1 and q2, between q2 and q3, and between q3 and the maximum value."
    },
  {
    name: "q3-max",
    set: {}, // w1 == 0
    idx: 16,
    c: { x: 0, y: -1, circle: 11, weight: 0 },
    description: "Highlight all values that are between q3 and the maximum value",
    descLong: "The marginal distribution of mutation values for a given protein and mutation type is described based on their quartiles. 25% of the values are expected to be between the minimum and q1, between q1 and q2, between q2 and q3, and between q3 and the maximum value."
  }, */
  {
    name: "extremes",
    set: {}, // w1 == 0
    idx: 13,
    c: { x: 0, y: -1, circle: 11, weight: 0 },
    description: "Highlight all extreme values, values that are below q1 or above q3",
    descLong: "The marginal distribution of mutation values for a given protein and mutation type is described based on their quartiles. 25% of the values are expected to be between the minimum and q1, between q1 and q2, between q2 and q3, and between q3 and the maximum value."
  },
];

var set_variations = demo_max;
//var set_variations = demo04;

// compute set change from data1 to data2 using two weights from -1 to 1
function computeSetChange(all_data, w1, w2) { // data should contain the set and type columns
  all_data2 = {};

  var row_names = Object.keys(all_data);
  for (var i = 0; i < row_names.length; i++) {
    // we want the pairs from data1 (the one with mouse and human)
    var setA = all_data[row_names[i]];
    var row_name = setA['set'] + ' ' + setA['type'];

    var type = all_data[row_name].type;
    var corresponding_set_name = "";
    if (setA.set.indexOf("HUMAN") !== -1) {
      corresponding_set_name = setA.set.replace("HUMAN", "MOUSE");
    } else {
      corresponding_set_name = setA.set.replace("MOUSE", "HUMAN");
    }
    if (corresponding_set_name == "") {
      console.log("Error: no corresponding set found");
      continue;
    }
    for (var j = 0; j < row_names.length; j++) {
      if (all_data[row_names[j]].set == corresponding_set_name && all_data[row_names[j]].type == type) {
        setB = all_data[row_names[j]];
        break;
      }
    }
    // we should convert setA and setB so that we have floating point numbers instead of strings
    for (var key in setA) {
      if (key == "set" || key == "type" || key == "index") {
        continue;
      }
      setA[key] = parseFloat(setA[key]);
    }
    for (var key in setB) {
      if (key == "set" || key == "type" || key == "index") {
        continue;
      }
      setB[key] = parseFloat(setB[key]);
    }

    // now we have setA and setB and can compute the set variations based on w1 and w2
    var intersection = {}; // if both have the same value
    for (var key in setA) {
      if (key == "set" || key == "type" || key == "index") {
        intersection[key] = setA[key];
      } else {
        intersection[key] = (setA[key] == setB[key]) ? setA[key] : 0;
      }
    }
    var difference = {}; // the values they don't share
    for (var key in setA) {
      if (key == "set" || key == "type" || key == "index") {
        difference[key] = setA[key];
      } else {
        difference[key] = (setA[key] != setB[key]) ? setA[key] : 0;
      }
    }
    var union = {};
    for (var key in setA) {
      if (key == "set" || key == "type" || key == "index") {
        union[key] = setA[key];
      } else {
        union[key] = (setA[key] > 0) ? setA[key] : (setB[key] > 0 ? setB[key] : 0);
      }
    }
    var jaccard = {};
    for (var key in setA) {
      if (key == "set" || key == "type" || key == "index") {
        jaccard[key] = setA[key];
      } else {
        jaccard[key] = Math.abs(10 * (((setA[key] + setB[key]) > 0) ? (setA[key] - setB[key]) / (setA[key] + setB[key]) : 0));
      }
    }

    // weight 1
    // Values in setA not in setB ... values in both setA and setB ... values only in setB

    // Jacqcard index: area of intersection / area of union - but this is a single values for each full set
    // we can coompute this for bags of hieght values

    // ok, so there are lots of measures and each might change the display relative to the center (setA)
    // we can dial in which one of them - matches with "steerable" like in a wheel
    // if we put setA into the middle it also makes sense
    // we should use the voronoid cells and color them by how much change (entropy?) we each produce
    // we should also write a sentence for each of the variations
    // make the heartbeat faster and peak at the outside (faster) remain more on the inside (setA)

    // we should compute the weighted average by the distance of the middle to each of the sets

    function idx4(str) {
      // return the index of the given name in set_variations
      for (var i = 0; i < set_variations.length; i++) {
        if (set_variations[i].name == str) {
          return i;
        }
      }
      return -1;
    }

    // compute the set variations for the setA and setB objects, re-use the coordinates and descriptions
    set_variations[idx4("setA")].set = setA;
    set_variations[idx4("setB")].set = setB;
    set_variations[idx4("intersection")].set = intersection;
    set_variations[idx4("difference")].set = difference;
    set_variations[idx4("union")].set = union;
    set_variations[idx4("Jaccard")].set = jaccard;
    set_variations[idx4("0")].set = objectMap(setA, function (a) { return 0.0; });
    // here an analysis of moments would be nice as well

    // lets compute the marginal histogram and do the quartiles (just checking what this looks like)
    function quartiles(data) {
      var data_sorted = data.slice().sort(function (a, b) { return a - b; });
      var q1 = data_sorted[Math.floor(data_sorted.length / 4)];
      var q2 = data_sorted[Math.floor(data_sorted.length / 2)];
      var q3 = data_sorted[Math.floor(3 * data_sorted.length / 4)];
      return { min: data_sorted[0], q1: q1, q2: q2, q3: q3, max: data_sorted[data_sorted.length - 1] };
    }
    var d = [];
    for (var key in setA) {
      if (key == "set" || key == "type" || key == "index" || setA[key] == 0) {
        continue;
      }
      d.push(setA[key]);
    }
    var q = quartiles(d);

    //set_variations[idx4("min-q1")].set = objectMap(setA, function (a) { if (a > 0 && a < q.q1) return q.q3; else return a; });
    //set_variations[idx4("q1-q2")].set = objectMap(setA, function (a) { if (a > 0 && a >= q.q1 && a < q.q2) return q.min; else return a; });
    set_variations[idx4("q1-q3")].set = objectMap(setA, function (a) { if (a > 0 && a >= q.q1 && a <= q.q3) return 0.0; else return a; });
    //set_variations[idx4("q2-q3")].set = objectMap(setA, function (a) { if (a > 0 && a >= q.q2 && a <= q.q3) return q.min; else return a; });
    //set_variations[idx4("q3-max")].set = objectMap(setA, function (a) { if (a > 0 && a > q.q3) return q.min; else return a; });
    set_variations[idx4("extremes")].set = objectMap(setA, function (a) {
      if (a > 0 && (a < q.q1 || a > q.q3)) {
        if (a < a.q1)
          return q.min;
        return q.min;
      } else return a;
    });

    // frequency analysis of setA, make a copy of d
    const freqData = new ComplexArray(512).map((value, i, n) => {
      if (i > d.length - 1)
        value.real = 0;
      else
        value.real = d[i];
    });

    var frequencies = freqData.FFT();
    // ok, now what is a peak in the frequency spectrum?
    var targets = peakDetect(frequencies);
    if (targets.length > 0) {
      var j = 0;
      // assume that the locations are sorted
      set_variations[idx4("frequency peak 01")].set = objectMap(setA, function (a, key) {
        if (key == "set" || key == "type" || key == "index" || setA[key] == 0) {
          return a;
        }
        if (j < targets[0].real.length) {
          j = j + 1;
          return a * Math.abs(targets[0].real[j - 1]); // scale a by the waveform (treat negative as positive)
        } else {
          j = j + 1;
          return a;
        }
      });
    }

    if (targets.length > 1) {
      var j = 0;
      // assume that the locations are sorted
      set_variations[idx4("frequency peak 02")].set = objectMap(setA, function (a, key) {
        if (key == "set" || key == "type" || key == "index" || setA[key] == 0) {
          return a;
        }
        if (j < targets[1].real.length) {
          j = j + 1;
          return a * Math.abs(targets[1].real[j - 1]); // scale a by the waveform (treat negative as positive)
        } else {
          j = j + 1;
          return a;
        }
      });
    }

    if (targets.length > 2) {
      var j = 0;
      // assume that the locations are sorted
      set_variations[idx4("frequency peak 03")].set = objectMap(setA, function (a, key) {
        if (key == "set" || key == "type" || key == "index" || setA[key] == 0) {
          return a;
        }
        if (j < targets[2].real.length) {
          j = j + 1;
          return a * Math.abs(targets[2].real[j - 1]); // scale a by the waveform (treat negative as positive)
        } else {
          j = j + 1;
          return a;
        }
      });
    }

    if (targets.length > 3) {
      var j = 0;
      // assume that the locations are sorted
      set_variations[idx4("frequency peak 04")].set = objectMap(setA, function (a, key) {
        if (key == "set" || key == "type" || key == "index" || setA[key] == 0) {
          return a;
        }
        if (j < targets[3].real.length) {
          j = j + 1;
          return a * Math.abs(targets[3].real[j - 1]); // scale a by the waveform (treat negative as positive)
        } else {
          j = j + 1;
          return a;
        }
      });
    }

    if (targets.length > 4) {
      var j = 0;
      // assume that the locations are sorted
      set_variations[idx4("frequency peak 05")].set = objectMap(setA, function (a, key) {
        if (key == "set" || key == "type" || key == "index" || setA[key] == 0) {
          return a;
        }
        if (j < targets[4].real.length) {
          j = j + 1;
          return a * Math.abs(targets[4].real[j - 1]); // scale a by the waveform (treat negative as positive)
        } else {
          j = j + 1;
          return a;
        }
      });
    }


    // assume that w1 and w2 are between -1 and 1
    var distances = []; // the distance in the control space between (w1, w2) and each set_variations c-coordinate
    var sum_distances = 0;
    var winner = 0;
    for (var j = 0; j < set_variations.length; j++) {
      var c = set_variations[j].c;
      var d = Math.sqrt(Math.pow(c.x - w1, 2) + Math.pow(c.y - w2, 2));
      distances.push(d);
      sum_distances += d;
      if (d < distances[winner]) {
        winner = j;
      }
    }
    // instead of the average we can use the winner
    //console.log("pick winner as: " + set_variations[winner].name + " " + set_variations[winner].description);

    jQuery('#control-explanation').fadeOut(function () {
      jQuery(this).text(set_variations[winner].description).fadeIn();
    });
    if (typeof set_variations[winner].descLong !== 'undefined') {
      jQuery('#control-explanation-detail').fadeOut(function () {
        jQuery(this).html("<p>" + set_variations[winner].descLong + "</p>").fadeIn();
      });
    } else {
      jQuery('#control-explanation-detail').fadeOut();
    }


    // interpolate the sets based on the weighted distances to the center
    var comb = {};
    for (var idx in setA) {
      if (idx == "set" || idx == "type" || idx == "index") {
        comb[idx] = setA[idx];
      } else {
        // we can normalize all distances now so they sum to 1
        /* for (var i = 0; i < distances.length; i++) {
          var w = distances[i] / sum_distances;
          comb[idx] += (setA[idx] * (1 - w)) + (set_variations[i].set[idx] * w);
        } */
        comb[idx] = set_variations[winner].set[idx];
      }
    }

    all_data2[row_name] = comb;
  }
  return all_data2;
}

function pad(num, size) {
  var s = "000000000" + num;
  return s.substr(s.length - size);
}

// as a  diversity/singleton measure we can simply count if one modification takes it all
function diversity(all_data, divers, levels = [0, 5]) { // levels should be odd numbers
  // we want the index on two levels... for  three proteins
  divers = {};
  var prot_mods = Object.keys(all_data);
  var proteins = {}; // create unique lists
  var modifications = {};
  for (var i = 0; i < prot_mods.length; i++) {
    var s = prot_mods[i].split(" ");
    var p = s[0].replace("_HUMAN", "").replace("_MOUSE", "");
    proteins[p] = 1;
    modifications[s.slice(1).join(" ")] = 1;
  }
  proteins = Object.keys(proteins);
  modifications = Object.keys(modifications);
  var max_loc = 0;

  for (var i = 0; i < proteins.length; i++) {
    var protein = proteins[i];
    var max_per_loc = {};
    for (var j = 0; j < modifications.length; j++) {
      var names = [protein + "_HUMAN" + " " + modifications[j], protein + "_MOUSE" + " " + modifications[j]];
      for (nam in names) {
        for (loc in all_data[names[nam]]) {
          if (["set", "type", "index"].indexOf(loc) === -1) {
            if (parseFloat(loc.replace("loc_", "")) > max_loc) {
              max_loc = parseFloat(loc.replace("loc_", ""));
            }

            if (typeof max_per_loc[loc] == 'undefined') {
              max_per_loc[loc] = { modification: [modifications[j]], value: parseFloat(all_data[names[nam]][loc]) };
            }
            if (parseFloat(all_data[names[nam]][loc]) > max_per_loc[loc].value) {
              max_per_loc[loc] = { modification: [modifications[j]], value: parseFloat(all_data[names[nam]][loc]) };
            } else if (parseFloat(all_data[names[nam]][loc]) == max_per_loc[loc].value &&
              max_per_loc[loc].modification.indexOf(modifications[j]) == -1) {
              max_per_loc[loc].modification.push(modifications[j]);
            }

          }
        }
      }
    }
    // now store the winner - if we have a single modification per location
    divers[protein] = { 0: max_per_loc };
    for (shift_idx in levels) {
      var shift = levels[shift_idx];
      if (shift == 0) {
        continue;
      }
      divers[protein][shift] = {};
      var shift2 = Math.floor(shift / 2);
      for (var j = 1; j < max_loc; j++) { // compute shifted mean
        var winners = {};
        for (var k = j - shift2; k < j + shift2; k++) {
          if (k < 1 || k > max_loc - 1) {
            continue;
          }
          var loc = "loc_" + pad(k, 3);
          if (typeof divers[protein][0][loc] == 'undefined') {
            continue;
          }
          if (divers[protein][0][loc]["modification"].length != 1) {
            continue;
          }
          // we have a single winner at this location
          if (typeof winners[divers[protein][0][loc]["modification"][0]] == 'undefined') {
            winners[divers[protein][0][loc]["modification"][0]] = 0;
          }
          winners[divers[protein][0][loc]["modification"][0]]++; // count how many times we have that lonely winner
        }
        // how do we have a single winner?
        var max_winner = 0;
        var num_winners = 0;
        for (win in winners) {
          if (typeof winners[max_winner] == "undefined" || winners[win] >= winners[max_winner]) {
            max_winner = win;
            num_winners++;
          }
        }
        if (max_winner != 0 && num_winners == 1) {
          divers[protein][shift]["loc_" + pad(j, 3)] = max_winner;
        } else {
          divers[protein][shift]["loc_" + pad(j, 3)] = "";
        }
      }
    }
  }
  return divers;
}


var svg;
var x;
var y;
var height = 100;
var width = 300;
var margin = { top: 20, right: 30, bottom: 30, left: 25 };

var all_data = {};
var divers = {}; // diversity index results

function loadData(callback) {
  var subset = ["ROA1_HUMAN", "ROA1_MOUSE", "TGFB1_HUMAN", "TGFB1_MOUSE", "ALDOA_HUMAN", "ALDOA_MOUSE"];
  //var subset = ["ROA1_HUMAN", "ROA1_MOUSE"];

  d3.csv("data/mut_pos_all_prot_table.csv", function (data) {

    // we get this for each for in the data
    var keys = Object.keys(data);
    var row_name = data['set'] + ' ' + data['type'];
    all_data[row_name] = data;

    var ignore = ['set', 'type', 'index']; // all other are locations
    data1 = [];
    if (subset.indexOf(data['set']) == -1) {
      return; // don't add these
    }

    for (var i = 0; i < keys.length; i++) {
      if (ignore.indexOf(keys[i]) == -1) {
        data1.push({ group: keys[i], value: parseFloat(data[keys[i]]) });
      }
    }
    // put the data into main variables data1 and data2
    data2 = [];
    for (var i = 0; i < data1.length; i++) {
      data2.push({ group: data1[i].group, value: 0 });
    }

    callback(row_name, [data1, data2]);
  }).then(function (data) {
    divers = diversity(all_data, {}, [0, 9]);
    // and display
    displayDiversity(divers);
  });
}

// show the diversity winner with a small sign above the location
function displayDiversity(divers) {
  for (protein in divers) {
    var dat = divers[protein][0]; // should always exist
    // first find the svg's for each protein
    for (loc in dat) {
      if (dat[loc].modification.length == 1) {
        var mod = dat[loc].modification[0];
        var svg = d3.selectAll("#my_dataviz svg[protein='" + protein + "'][modification='" + mod + "']");
        var rects = svg.select("rect[loc='" + loc + "']");
        // guess we have some rects now?
        if (rects.size() > 0) {
          //console.log(rects.size());
          rects.each(function (d, b) {
            // this points to the element itself
            if (d.value == 0) {
              return;
            }
            var y = parseFloat(d3.select(this).attr("y"));
            var x = parseFloat(d3.select(this).attr("x"));
            var bw = parseFloat(d3.select(this).attr("width"));
            //console.log(JSON.stringify(d) + " " + b + " " + y + " " + x + " " + loc + " " + protein + " " + mod);
            height = 110 - margin.top - margin.bottom;
            d3.select(this.parentNode).append("text")
              .attr("x", x + (bw / 2))
              .attr("y", (y - 1))
              .attr("modification", mod)
              .attr("fill", "#BBB")
              .attr('text-anchor', 'middle')
              .attr('font-size', '8px')
              .text("\u2655"); // white queen
          });
        }
      }
    }

  }
}

// A function that create / update the plot for a given variable:
function update(data, sanitized_row_name, x, y, dataSetA) {

  var svg = d3.select("#my_dataviz svg." + sanitized_row_name);

  var u = svg.selectAll("rect.dynamic")
    .data(data)

  //margin = { top: 10, right: 10, bottom: 50, left: 30 };
  u
    .join("rect")
    .transition()
    .duration(500)
    .attr("x", d => x(d.group))
    .attr("y", d => y(Math.log(1 + d.value)))
    .attr("width", x.bandwidth())
    .attr("height", d => height - y(Math.log(1 + d.value)))
    .attr("fill", "#333")
    .attr('class', 'dynamic')
    .attr('pointer-events', 'none')
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

}

function setup(row_name, sets, identity) {
  // set the dimensions and margins of the graph
  width = 1300 - margin.left - margin.right;
  height = 110 - margin.top - margin.bottom;

  var type = "MOUSE";
  if (row_name.indexOf("HUMAN") != -1) {
    type = "HUMAN";
  }

  data1 = sets[0];

  // append the svg object to the body of the page
  var svg = d3.select("#my_dataviz")
    .append("svg")
    .attr("class", row_name + " " + type)
    .attr("modification", identity.modification)
    .attr("protein", identity.protein)
    .attr("species", identity.species)
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    //.attr('fill', bcolor)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // X axis
  var x = d3.scaleBand()
    .range([0, width])
    .domain(data1.map(d => d.group))
    .padding(0.2);

  var axisX = d3.axisBottom(x)
    .tickFormat(function (interval, i) {
      var label = interval.replace("loc_", "");
      return (i + 1) % 20 !== 0 ? '' : label;
    });

  svg.append("text")
    .attr("class", "x label")
    .attr("text-anchor", "end")
    .attr("x", width)
    .attr("y", height + 28)
    .attr("font-size", "12px")
    .text("Modified Protein Residue Site");

  svg.append("text")
    .attr("class", "y label")
    .attr("text-anchor", "start")
    .attr("y", 0)
    .attr("dy", "-6px")
    .attr("dx", "-20px")
    .attr("font-size", "12px")
    //.attr("transform", "rotate(-90)")
    .text("Modification Count per Protein Site");

  svg.append("g")
    .attr("transform", `translate(0,${height})`)
    .call(axisX)

  // Add Y axis
  var y = d3.scaleLinear()
    .domain([0, 4])
    .range([height, 0])

  var axisY = d3.axisLeft(y)
    .tickFormat(function (interval, i) {
      var inter = parseFloat(interval);

      return (i + 1) % 2 !== 0 ? '' : Math.round(Math.exp(inter) - 1);
    });
  svg.append("g")
    .attr("class", "myYaxis")
    .call(axisY);

  var u2 = svg.selectAll("rect.static")
    .data(sets[0])

  // Three function that change the tooltip when user hover / move / leave a cell
  var mouseover = function (d) {
    jQuery('#tooltip').show();
    //jQuery('#tooltip').html(d.group + ": " + d.value);
    d3.select(this)
      .style("stroke", "orange")
      .style('stroke-width', '2px')
      .style("opacity", 1)
  }
  var mousemove = function (event, d) {
    var mx = /*jQuery(this).offset().left + */ event.pageX;  // d3.pointer(event)[0];
    var my = /*jQuery(this).offset().top + */ event.pageY; // d3.pointer(event)[1];
    // we need to create the content for the tooltip

    var protein = jQuery(event.currentTarget).parent().parent().attr('protein');
    var modification = jQuery(event.currentTarget).parent().parent().attr('modification');
    var species = jQuery(event.currentTarget).parent().parent().attr('species');

    var neighborhood = Object.keys(divers[protein])[1];

    jQuery('#tooltip-title').text(protein + " protein site " + d.group.replace("loc_", ""));
    //jQuery('#tooltip-location').text(d.group);
    jQuery('#tooltip-height').text(d.value);
    jQuery('#tooltip-protein').text(protein);
    var dom = "";
    jQuery('#tooltip-dominant').text("");
    if (divers[protein][0][d.group].modification.length == 1) {
      if (divers[protein][0][d.group].modification[0] == modification)
        dom = " (\u2655-dominant)";
      else {
        jQuery('#tooltip-dominant').text("Dominant modification at protein site " + d.group.replace("loc_", "") + " is \"" + divers[protein][0][d.group].modification[0] + "\".");
      }
    } else {
      jQuery('#tooltip-dominant').text("No dominant modification found.");
    }
    var newArticle = "A";
    switch (modification.charAt(0).toLowerCase()) {
      case 'a':
      case 'e':
      case 'i':
      case 'o':
      case 'u':
        newArticle += 'n'; // an
        break;
      default:
        // a
        break;
    }

    jQuery('#tooltip-modification').text(newArticle + " \"" + modification + "\" " + dom + " modification.");

    var neighbors = divers[protein][neighborhood][d.group];
    if (neighbors.length > 0) { // string
      var also = "";
      if (neighbors == modification && divers[protein][0][d.group].modification.length == 1)
        also = " also ";
      jQuery('#tooltip-neighbors').text("Neighboring sites are " + also + "dominated by \"" + neighbors + "\" modifications.");
    }

    jQuery('#tooltip')
      .css("left", (mx + 10) + "px")
      .css("top", (my) + "px")
      .show();
  }
  var mouseleave = function (event, d) {
    jQuery('#tooltip').hide();
    d3.select(this)
      .style("stroke", "none")
      .style("opacity", 0.8)
  }

  // can we have one plot of setA that stays on screen?
  u2
    .join("rect")
    .attr('class', 'static')
    .attr("x", d => x(d.group))
    .attr("y", d => y(Math.log(1 + d.value)))
    .attr("width", x.bandwidth())
    .attr("loc", d => d.group)
    .attr("height", d => height - y(Math.log(1 + d.value)))
    .attr("fill", "#BBB")
    .on("mouseover", mouseover)
    .on("mousemove", mousemove)
    .on("mouseleave", mouseleave);
  //.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // add a title  
  svg.append("text")
    .attr("x", (width / 2))
    .attr("y", 0/* 0 - (margin.top / 3) */)
    .attr("text-anchor", "middle")
    .style("font-size", "14px")
    .style("text-decoration", "none")
    .style("fill", "#333")
    .text(function (d) {
      var a = row_name;
      a = a.replace("HUMAN", "HUMAN ");
      a = a.replace("MOUSE", "MOUSE ");
      a = a.replace("Chemicald", "Chemical d");
      a = a.replace("Otherg", "Other g");
      a = a.replace("linkedg", "linked g");
      a = a.replace("_", " ");
      return a;
    });

  return [svg, x, y];
}

function toggleSets(sets, si, sanitized_row_name, x, y) {
  si = (si + 1) % sets.length;

  // we should change what sets[1] is based on all_data2 - if the weights have changed
  var row_names = Object.keys(all_data2);
  if (row_names.length == Object.keys(all_data).length) {
    for (var i = 0; i < row_names.length; i++) {
      var row_name = row_names[i];
      var srow_name = row_name.replace(/\s/g, '');
      if (srow_name == sanitized_row_name) {
        // found the corresponding entry in all_data2
        // get the group value type array for this
        var keys = Object.keys(all_data2[row_names[i]]);
        var ss = [];
        var ignore = ['set', 'type', 'index'];
        for (var j = 0; j < keys.length; j++) {
          if (ignore.indexOf(keys[j]) == -1) {
            ss.push({ group: keys[j], value: all_data2[row_names[i]][keys[j]] });
          }
        }
        sets[1] = ss;
        break;
      }
    }
  }

  update(sets[si], sanitized_row_name, x, y, sets[0]);
  setTimeout(function () {
    toggleSets(sets, si, sanitized_row_name, x, y);
  }, 600);
}

// draw some cells into #controls
function displayControlPoints() {
  var w = jQuery('#control').width();
  var h = jQuery('#control').height();

  var vertices = [];
  for (var i = 0; i < set_variations.length; i++) {
    // c goes from -1 to 1, but our svg area goes from 0 to w, 0 to h
    vertices.push([
      (set_variations[i].c.x + 1) / 2 * w,
      (set_variations[i].c.y + 1) / 2 * h,
      set_variations[i].c.weight
    ]);
  }

  function updatePickPosition() {
    return; // do nothing
    vertices[0] = d3.svg.mouse(this);
    svg.selectAll("path")
      .data(d3.geom.voronoi(vertices)
        .map(function (d) { return "M" + d.join("L") + "Z"; }))
      .filter(function (d) { return this.getAttribute("d") != d; })
      .attr("d", function (d) { return d; });
  }

  var svg = d3.select("#control")
    .append("svg:svg")
    .attr("width", w)
    .attr("height", h)
    .attr("class", "PuBu")
  //.attr("class", "Paired")
  //.attr("class", "PiYG")
  //.on("mousemove", updatePickPosition);

  // we could draw not the polygons but a smoothed version of them
  var polygons = d3.geom.voronoi(vertices);

  var isCornerRadiusAbsolute = true;
  var cornerRadius = 33;
  function resampleSegments(points) {
    if (points.length == 0)
      return points;

    let i = -1;
    let n = points.length;
    let p0 = points[n - 1];
    let x0 = p0[0];
    let y0 = p0[1];
    let p1, x1, y1;
    let points2 = [];

    while (++i < n) {
      p1 = points[i];
      x1 = p1[0];
      y1 = p1[1];

      let finalRadius = 0;

      if (isCornerRadiusAbsolute) {
        let distance = Math.sqrt((x1 - x0) ** 2 + (y1 - y0) ** 2);
        let distFromPoint = cornerRadius / distance;
        finalRadius = distFromPoint >= 0.5 ? 0.5 : distFromPoint;
      }
      else {
        finalRadius = cornerRadius;
      }

      points2.push(
        [x0 + (x1 - x0) * finalRadius,
        y0 + (y1 - y0) * finalRadius],
        [x0 + (x1 - x0) * (1 - finalRadius),
        y0 + (y1 - y0) * (1 - finalRadius)],
        p1
      );

      p0 = p1;
      x0 = x1;
      y0 = y1;
    }
    return points2;
  }

  var bounds = d3.geom.polygon([
    [0, 0],
    [0, 200],
    [200, 200],
    [200, 0]
  ]);
  // wrong orientation, the reverse fixes the problem
  function circle(cx, cy, r, n) {
    var points = [];
    d3.range(1e-6, 2 * Math.PI, 2 * Math.PI / n).map(function (θ, i) {
      var point = [cx + Math.cos(θ) * r, cy + Math.sin(θ) * r];
      points.push(point);
      return point;
    });
    points = points.reverse();
    return points;
  }
  //bounds = d3.geom.polygon(circle(100, 100, 98, 14));
  var line = d3.line()
    .curve(d3.curveBasisClosed)
  //var voronoi = d3.geom.voronoi(vertices).map(function (cell) { return bounds.clip(cell); });

  var weightedVoronoi = d3.weightedVoronoi()
    .x(function (d) { return d[0]; })                     // set the x coordinate accessor
    .y(function (d) { return d[1]; })                     // set the y coordinate accessor
    .weight(function (d) {
      return d[2];
    })           // set the weight accessor
    .clip(bounds);  // set the clipping polygon

  var voronoi = weightedVoronoi(vertices);                        // compute the weighted Voronoi tessellation

  // Highlight a zone
  /* For the drop shadow filter... */
  var defs = svg.append("defs");

  var filter = defs.append("filter")
    .attr("id", "dropshadow")

  filter.append("feGaussianBlur")
    .attr("in", "SourceAlpha")
    .attr("in2", "SourceAlpha")
    .attr("stdDeviation", 2)
    .attr("result", "blur");
  filter.append("feOffset")
    .attr("in", "blur")
    //.attr("in2", "blur")
    .attr("dx", 0)
    .attr("dy", 0)
    .attr("result", "offsetBlur");

  var feMerge = filter.append("feMerge");

  feMerge.append("feMergeNode")
    .attr("in", "offsetBlur")
  feMerge.append("feMergeNode")
    .attr("in", "SourceGraphic");
  // end FILTER highlight a zone

  svg.selectAll("path")
    .data(voronoi)
    .enter().append("svg:path")
    //.attr("clip-path", "url(#clipCircle)") // make a circular clip around everything
    .attr("class", function (d, i) { // color the cells
      // the identify of the cells is no longer given by the index. We need to compute the
      // identify again if we need it. Maybe compute the center of mass and pick a winner with
      // the vertices?
      var geo_center = d.reduce(function (p, q) {
        return [p[0] + q[0], p[1] + q[1]];
      }, [0, 0]);
      geo_center[0] /= d.length;
      geo_center[1] /= d.length;
      var winner = 0;
      var dwinner = Infinity;
      for (var j = 0; j < vertices.length; j++) {
        var dist = (vertices[j][0] - geo_center[0]) * (vertices[j][0] - geo_center[0]) +
          (vertices[j][1] - geo_center[1]) * (vertices[j][1] - geo_center[1]);
        if (dist < dwinner) {
          winner = j;
          dwinner = dist;
        }
      }

      var cmap = "PuBu";
      if (set_variations[winner].c.circle != 0) {
        cmap = "OrRd";
      }
      return cmap + "q" + (4 % 9) + "-9 region";
    })
    //Our new hover effects
    .on('mouseover', function (d, i) {
      d3.select(this).transition()
        .duration('50')
        .attr('opacity', '.85');
    })
    .on('mouseout', function (d, i) {
      d3.select(this).transition()
        .duration('50')
        .attr('opacity', '1');
    })
    .on('click', function (d, i) {
      // we selected this section
      //console.log("we click on section!");
      d3.select(this.parentNode).selectAll("path")
        .attr("filter", "")
        .lower();
      d3.select(this)
        .attr("filter", "url(#dropshadow)")
        .raise();
    })
    //.attr("d", function (d) { return "M" + d.join("L") + "Z"; });
    .attr("d", function (point, i) { return line(resampleSegments(voronoi[i])); });
  //.attr("d", function (point, i) { return line(voronoi[i]); });

  svg.selectAll("circle")
    .data(vertices)
    .enter().append("svg:circle")
    .attr("transform", function (d) { return "translate(" + d[0] + "," + d[1] + ")"; })
    .attr("r", 2);

  svg.append("clipPath")
    .attr("id", "clipCircle")
    .append("circle")
    .attr("fill", "white")
    .attr("background", "black")
    .attr("opacity", 0.5)
    .attr("r", 100)
    .attr("cx", 100)
    .attr("cy", 100);


  //  https://bl.ocks.org/mbostock/4636377
  /*  var path22 = svg.selectAll("path")
      .data(vertices)
      .enter().append("path");
    var bounds = d3.geom.polygon([
      [0, 0],
      [0, 200],
      [200, 200],
      [200, -200]
    ]);
    var line = d3.line()
      .curve(d3.curveCatmullRomOpen)
    // .interpolate("basis-closed");
  
    function resample(points) {
      if (points.length == 0)
        return points;
      var i = -1,
        n = points.length,
        p0 = points[n - 1], x0 = p0[0], y0 = p0[1], p1, x1, y1,
        points2 = [];
      while (++i < n) {
        p1 = points[i], x1 = p1[0], y1 = p1[1];
        points2.push(
          [(x0 * 2 + x1) / 3, (y0 * 2 + y1) / 3],
          [(x0 + x1 * 2) / 3, (y0 + y1 * 2) / 3],
          p1
        );
        p0 = p1, x0 = x1, y0 = y1;
      }
      return points2;
    }
    var voronoi = d3.geom.voronoi(vertices).map(function (cell) { return bounds.clip(cell); });
    path22.attr("d", function (point, i) { return line(resample(voronoi[i])); });
  */



}


var all_data2 = {};

jQuery(document).ready(function () {

  //distributeControlPointsSquare();
  distributeControlPoints();
  // display control point influence voronoi cells
  displayControlPoints();

  loadData(function (row_name, sets) {
    //console.log("setup row_name: " + row_name);
    var sanitized_row_name = row_name.replace(/\s/g, '');

    var identity = {
      "protein": row_name.split(" ")[0].replace("_HUMAN", "").replace("_MOUSE", ""),
      "species": row_name.indexOf("_HUMAN") === -1 ? "mouse" : "human",
      "modification": row_name.split(" ").splice(1).join(" ")
    }

    data1 = sets[0];
    data2 = sets[1];
    objs = setup(sanitized_row_name, sets, identity);
    x = objs[1];
    y = objs[2];
    //update(data1, sanitized_row_name, x, y);
    toggleSets(sets, 0, sanitized_row_name, x, y);
  });

  // recalculate the second dataset again 
  jQuery('#control').on('click', function (e) {
    var w = jQuery(this).width();
    var h = jQuery(this).height();
    // 100 is the size in pixel for the div we click in
    var mouse_pos = [(e.pageX - $(this).offset().left) / w, (e.pageY - $(this).offset().top) / h];
    var w1 = mouse_pos[0] * 2 - 1;
    var w2 = mouse_pos[1] * 2 - 1;
    console.log(w1 + " " + w2);
    all_data2 = computeSetChange(all_data, w1, w2);
  });
  //jQuery('#tooltip').hide();
});