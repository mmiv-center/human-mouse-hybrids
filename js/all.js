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

var set_variations = [
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
    description: "Highlight all values at the slowest repeating frequency."
  },
  {
    name: "frequency peak 02",
    set: {}, // w1 == 0
    idx: 4,
    c: { x: 0, y: -1, circle: 3, weight: 0 },
    description: "Highlight all values at the second slowest repeating frequency."
  },
  {
    name: "frequency peak 03",
    set: {}, // w1 == 0
    idx: 5,
    c: { x: 0, y: -1, circle: 3, weight: 0 },
    description: "Highlight all values at the third repeating frequency."
  },
  {
    name: "frequency peak 04",
    set: {}, // w1 == 0
    idx: 6,
    c: { x: 0, y: -1, circle: 3, weight: 0 },
    description: "Highlight all values at the fourth repeating frequency."
  },
  {
    name: "frequency peak 05",
    set: {}, // w1 == 0
    idx: 7,
    c: { x: 0, y: -1, circle: 3, weight: 0 },
    description: "Highlight all values at the fifth (fastest) repeating frequency."
  },

  {
    name: "difference",
    set: {}, // w1 == 0
    idx: 8,
    c: { x: 0, y: -1, circle: 0, weight: 0 },
    description: "Highlight where MOUSE and HUMAN are the same."
  },
  {
    name: "union",
    set: {}, // w1 == 0
    idx: 9,
    c: { x: 0, y: -1, circle: 0, weight: 0 },
    description: "Highlight what is added by the other."
  },
  {
    name: "Jaccard",
    set: {}, // w1 == 0
    idx: 10,
    c: { x: 0, y: -1, circle: 0, weight: 0 },
    description: "Highlight relative difference (Jaccard index)."
  },
  {
    name: "0",
    set: {}, // w1 == 0
    idx: 11,
    c: { x: -1, y: 0, circle: 0, weight: 300 },
    description: "Highlight what is in this set (analysis of marginals)."
  },
  {
    name: "min-q1",
    set: {}, // w1 == 0
    idx: 12,
    c: { x: 0, y: -1, circle: 11, weight: 0 },
    description: "Highlight all values that are between the minimum and q1."
  },
  {
    name: "q1-q2",
    set: {}, // w1 == 0
    idx: 13,
    c: { x: 0, y: -1, circle: 11, weight: 0 },
    description: "Highlight all values that are between q1 and q2."
  },
  {
    name: "q1-q3",
    set: {}, // w1 == 0
    idx: 14,
    c: { x: 0, y: -1, circle: 11, weight: 100 },
    description: "Highlight all values that are between q1 and q3."
  },
  {
    name: "q2-q3",
    set: {}, // w1 == 0
    idx: 15,
    c: { x: 0, y: -1, circle: 11, weight: 0 },
    description: "Highlight all values that are between q2 and q3."
  },
  {
    name: "q3-max",
    set: {}, // w1 == 0
    idx: 16,
    c: { x: 0, y: -1, circle: 11, weight: 0 },
    description: "Highlight all values that are between q3 and the maximum value."
  },
  {
    name: "extremes",
    set: {}, // w1 == 0
    idx: 17,
    c: { x: 0, y: -1, circle: 11, weight: 0 },
    description: "Highlight all values that are below q1 or above q3."
  },
];


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

    set_variations[idx4("min-q1")].set = objectMap(setA, function (a) { if (a > 0 && a < q.q1) return q.q3; else return a; });
    set_variations[idx4("q1-q2")].set = objectMap(setA, function (a) { if (a > 0 && a >= q.q1 && a < q.q2) return q.min; else return a; });
    set_variations[idx4("q1-q3")].set = objectMap(setA, function (a) { if (a > 0 && a >= q.q1 && a <= q.q3) return 0.0; else return a; });
    set_variations[idx4("q2-q3")].set = objectMap(setA, function (a) { if (a > 0 && a >= q.q2 && a <= q.q3) return q.min; else return a; });
    set_variations[idx4("q3-max")].set = objectMap(setA, function (a) { if (a > 0 && a > q.q3) return q.min; else return a; });
    set_variations[idx4("extremes")].set = objectMap(setA, function (a) {
      if (a > 0 && (a < q.q1 || a > q.q3)) {
        if (a < a.q1)
          return q.min;
        return q.max;
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
      jQuery(this).html("<i>" + set_variations[winner].description + "</i>").fadeIn();
    });

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


var svg;
var x;
var y;
var height = 100;
var width = 300;
var margin = { top: 30, right: 30, bottom: 30, left: 25 };

var all_data = {};

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
  });
}


// A function that create / update the plot for a given variable:
function update(data, sanitized_row_name, x, y) {

  var svg = d3.select("#my_dataviz svg." + sanitized_row_name);

  var u = svg.selectAll("rect")
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
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
}

function setup(row_name, sets) {
  // set the dimensions and margins of the graph
  width = 1300 - margin.left - margin.right;
  height = 100 - margin.top - margin.bottom;

  var bcolor = "#333";
  if (row_name.indexOf("HUMAN") != -1) {
    bcolor = "#444";
  }

  data1 = sets[0];

  // append the svg object to the body of the page
  var svg = d3.select("#my_dataviz")
    .append("svg")
    .attr("class", row_name)
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
      return (i + 1) % 20 !== 0 ? '' : interval;
    });

  svg.append("g")
    .attr("transform", `translate(0,${height})`)
    .call(axisX)

  // Add Y axis
  var y = d3.scaleLinear()
    .domain([0, 3.5])
    .range([height, 0])

  var axisY = d3.axisLeft(y)
    .tickFormat(function (interval, i) {
      return (i + 1) % 2 !== 0 ? '' : interval;
    });
  svg.append("g")
    .attr("class", "myYaxis")
    .call(axisY);

  // add a title  
  svg.append("text")
    .attr("x", (width / 2))
    .attr("y", 0 - (margin.top / 2))
    .attr("text-anchor", "middle")
    .style("font-size", "12px")
    .style("text-decoration", "none")
    .style("fill", "#333")
    .text(function (d) {
      var a = row_name;
      a = a.replace("HUMAN", "HUMAN ");
      a = a.replace("MOUSE", "MOUSE ");
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

  update(sets[si], sanitized_row_name, x, y);
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
      return cmap + "q" + (4 % 9) + "-9";
    })
    //.attr("d", function (d) { return "M" + d.join("L") + "Z"; });
    .attr("d", function (point, i) { return line(resampleSegments(voronoi[i])); });

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
  distributeControlPoints();
  // display control point influence voronoi cells
  displayControlPoints();

  loadData(function (row_name, sets) {
    //console.log("setup row_name: " + row_name);
    var sanitized_row_name = row_name.replace(/\s/g, '');

    data1 = sets[0];
    data2 = sets[1];
    objs = setup(sanitized_row_name, sets);
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

});