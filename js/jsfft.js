
function drawToCanvas(element_id, data) {
  const element = document.getElementById(element_id);
  const width = element.clientWidth;
  const height = element.clientHeight;
  const n = data.length;

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  element.appendChild(canvas);

  const context = canvas.getContext('2d');
  context.strokeStyle = 'blue';
  context.beginPath();
  data.forEach((c_value, i) => {
    context.lineTo(i * width / n, height / 2 * (1.5 - c_value.real));
  });
  context.stroke();
}

// what we actually want would be the peak frequency (highest energy) and the phase
// at which that happens. Better to do this with a shifted set of basis functions for a 
// given frequency.
function peakDetect(data) {

  // lets do this in chunks. We want to detect some peaks at regular intervals
  var chunkSize = 20;
  var peaks = [];
  var phases = [];
  for (var i = 0; i < data.length / 2; i++) {
    var energy = []; // amplitude spectrum
    var phase = []; // phase spectrum
    for (var j = 0; j < chunkSize; j++) {
      energy.push(Math.sqrt(data.real[i + j] * data.real[i + j] + data.imag[i + j] * data.imag[i + j]));
      phase.push(Math.atan2(data.imag[i + j], data.real[i + j]));
    }
    total_energy = energy.reduce(function (a, b) {
      return a + b;
    }, 0) / chunkSize;

    var threshold = total_energy * 1.001;
    var max_value = energy[0];
    var max_index = 0;
    for (var pos = 1; pos < chunkSize - 1; pos++) {
      if (energy[pos] > max_value) {
        max_value = energy[pos];
        max_index = pos;
      }
    }
    if (max_value > threshold &&
      energy[i] < threshold &&
      energy[energy.length - 1] < threshold) {
      console.log(i + max_index, max_value);
      peaks.push(i + max_index);
      phases.push(phase[max_index]);
    }
  }

  var p = [];
  for (var i = 0; i < peaks.length; i++) {
    var uniqueEntry = (peaks.indexOf(peaks[i]) === i);
    if (uniqueEntry) {
      p.push([peaks[i], phases[i]]);
    }
  }
  // if we have the amplitude and the phase,
  // what are clean version of those? We can return the IFFT of them as mapping functions.
  var targets = []; // one for each peak we found
  for (var i = 0; i < p.length; i++) {
    var target = new ComplexArray(data);
    for (var j = 0; j < target.real.length; j++) {
      if (p[i][0] != j) {
        target.real[j] = 0;
        target.imag[j] = 0;
      }
    }
    // scale target to max 1
    var ifft = target.InvFFT();
    var ifft_max = Math.max(...ifft.real);
    ifft.real = ifft.real.map(function (a) {
      if (a < 0)
        return 0.0;
      return a / ifft_max; // scaled to max == 1
    });
    targets.push(ifft); // we ignore the imaginary part here only real part is scaled
  }
  return targets;
}

//window.onload = function() {
//  const data = new __WEBPACK_IMPORTED_MODULE_0__lib_fft__["a" /* ComplexArray */](128).map((value, i, n) => {
//    value.real = (i > n/3 && i < 2*n/3) ? 1 : 0;
//  });

//  drawToCanvas('original', data);

//  data.FFT();
//  drawToCanvas('fft', data);
//  data.map((freq, i, n) => {
//    if (i > n/5 && i < 4*n/5) {
//      freq.real = 0;
//      freq.imag = 0;
//    }
//  });
//  drawToCanvas('fft_filtered', data);
//  drawToCanvas('original_filtered', data.InvFFT());

//  drawToCanvas('all_in_one', data.frequencyMap((freq, i, n) => {
//    if (i > n/5 && i < 4*n/5) {
//      freq.real = 0;
//      freq.imag = 0;
//    }
//  }));
//}


class ComplexArray {
  constructor(other, arrayType = Float32Array) {
    if (other instanceof ComplexArray) {
      // Copy constuctor.
      this.ArrayType = other.ArrayType;
      this.real = new this.ArrayType(other.real);
      this.imag = new this.ArrayType(other.imag);
    } else {
      this.ArrayType = arrayType;
      // other can be either an array or a number.
      this.real = new this.ArrayType(other);
      this.imag = new this.ArrayType(this.real.length);
    }

    this.length = this.real.length;
  }

  toString() {
    const components = [];

    this.forEach((value, i) => {
      components.push(
        `(${value.real.toFixed(2)}, ${value.imag.toFixed(2)})`
      );
    });

    return `[${components.join(', ')}]`;
  }

  forEach(iterator) {
    const n = this.length;
    // For gc efficiency, re-use a single object in the iterator.
    const value = Object.seal(Object.defineProperties({}, {
      real: { writable: true }, imag: { writable: true },
    }));

    for (let i = 0; i < n; i++) {
      value.real = this.real[i];
      value.imag = this.imag[i];
      iterator(value, i, n);
    }
  }

  // In-place mapper.
  map(mapper) {
    this.forEach((value, i, n) => {
      mapper(value, i, n);
      this.real[i] = value.real;
      this.imag[i] = value.imag;
    });

    return this;
  }

  conjugate() {
    return new ComplexArray(this).map((value) => {
      value.imag *= -1;
    });
  }

  magnitude() {
    const mags = new this.ArrayType(this.length);

    this.forEach((value, i) => {
      mags[i] = Math.sqrt(value.real * value.real + value.imag * value.imag);
    })

    return mags;
  }

  FFT() {
    return fft(this, false);
  }

  InvFFT() {
    return fft(this, true);
  }

  // Applies a frequency-space filter to input, and returns the real-space
  // filtered input.
  // filterer accepts freq, i, n and modifies freq.real and freq.imag.
  frequencyMap(filterer) {
    return this.FFT().map(filterer).InvFFT();
  }

}

/* unused harmony export FFT */
/* unused harmony export InvFFT */
/* unused harmony export frequencyMap */

// Math constants and functions we need.
const PI = Math.PI;
const SQRT1_2 = Math.SQRT1_2;

function FFT(input) {
  return ensureComplexArray(input).FFT();
};

function InvFFT(input) {
  return ensureComplexArray(input).InvFFT();
};

function frequencyMap(input, filterer) {
  return ensureComplexArray(input).frequencyMap(filterer);
};

//class ComplexArray extends __WEBPACK_IMPORTED_MODULE_0__complex_array__["a" /* default */] {
//  FFT() {
//    return fft(this, false);
//  }

//  InvFFT() {
//    return fft(this, true);
//  }

// Applies a frequency-space filter to input, and returns the real-space
// filtered input.
// filterer accepts freq, i, n and modifies freq.real and freq.imag.
//  frequencyMap(filterer) {
//    return this.FFT().map(filterer).InvFFT();
//  }
//}

function ensureComplexArray(input) {
  return input instanceof ComplexArray && input || new ComplexArray(input);
}

function fft(input, inverse) {
  const n = input.length;

  if (n & (n - 1)) {
    return FFT_Recursive(input, inverse);
  } else {
    return FFT_2_Iterative(input, inverse);
  }
}

function FFT_Recursive(input, inverse) {
  const n = input.length;

  if (n === 1) {
    return input;
  }

  const output = new ComplexArray(n, input.ArrayType);

  // Use the lowest odd factor, so we are able to use FFT_2_Iterative in the
  // recursive transforms optimally.
  const p = LowestOddFactor(n);
  const m = n / p;
  const normalisation = 1 / Math.sqrt(p);
  let recursive_result = new ComplexArray(m, input.ArrayType);

  // Loops go like O(n Σ p_i), where p_i are the prime factors of n.
  // for a power of a prime, p, this reduces to O(n p log_p n)
  for (let j = 0; j < p; j++) {
    for (let i = 0; i < m; i++) {
      recursive_result.real[i] = input.real[i * p + j];
      recursive_result.imag[i] = input.imag[i * p + j];
    }
    // Don't go deeper unless necessary to save allocs.
    if (m > 1) {
      recursive_result = fft(recursive_result, inverse);
    }

    const del_f_r = Math.cos(2 * PI * j / n);
    const del_f_i = (inverse ? -1 : 1) * Math.sin(2 * PI * j / n);
    let f_r = 1;
    let f_i = 0;

    for (let i = 0; i < n; i++) {
      const _real = recursive_result.real[i % m];
      const _imag = recursive_result.imag[i % m];

      output.real[i] += f_r * _real - f_i * _imag;
      output.imag[i] += f_r * _imag + f_i * _real;

      [f_r, f_i] = [
        f_r * del_f_r - f_i * del_f_i,
        f_i = f_r * del_f_i + f_i * del_f_r,
      ];
    }
  }

  // Copy back to input to match FFT_2_Iterative in-placeness
  // TODO: faster way of making this in-place?
  for (let i = 0; i < n; i++) {
    input.real[i] = normalisation * output.real[i];
    input.imag[i] = normalisation * output.imag[i];
  }

  return input;
}

function FFT_2_Iterative(input, inverse) {
  const n = input.length;

  const output = BitReverseComplexArray(input);
  const output_r = output.real;
  const output_i = output.imag;
  // Loops go like O(n log n):
  //   width ~ log n; i,j ~ n
  let width = 1;
  while (width < n) {
    const del_f_r = Math.cos(PI / width);
    const del_f_i = (inverse ? -1 : 1) * Math.sin(PI / width);
    for (let i = 0; i < n / (2 * width); i++) {
      let f_r = 1;
      let f_i = 0;
      for (let j = 0; j < width; j++) {
        const l_index = 2 * i * width + j;
        const r_index = l_index + width;

        const left_r = output_r[l_index];
        const left_i = output_i[l_index];
        const right_r = f_r * output_r[r_index] - f_i * output_i[r_index];
        const right_i = f_i * output_r[r_index] + f_r * output_i[r_index];

        output_r[l_index] = SQRT1_2 * (left_r + right_r);
        output_i[l_index] = SQRT1_2 * (left_i + right_i);
        output_r[r_index] = SQRT1_2 * (left_r - right_r);
        output_i[r_index] = SQRT1_2 * (left_i - right_i);

        [f_r, f_i] = [
          f_r * del_f_r - f_i * del_f_i,
          f_r * del_f_i + f_i * del_f_r,
        ];
      }
    }
    width <<= 1;
  }

  return output;
}

function BitReverseIndex(index, n) {
  let bitreversed_index = 0;

  while (n > 1) {
    bitreversed_index <<= 1;
    bitreversed_index += index & 1;
    index >>= 1;
    n >>= 1;
  }
  return bitreversed_index;
}

function BitReverseComplexArray(array) {
  const n = array.length;
  const flips = new Set();

  for (let i = 0; i < n; i++) {
    const r_i = BitReverseIndex(i, n);

    if (flips.has(i)) continue;

    [array.real[i], array.real[r_i]] = [array.real[r_i], array.real[i]];
    [array.imag[i], array.imag[r_i]] = [array.imag[r_i], array.imag[i]];

    flips.add(r_i);
  }

  return array;
}

function LowestOddFactor(n) {
  const sqrt_n = Math.sqrt(n);
  let factor = 3;

  while (factor <= sqrt_n) {
    if (n % factor === 0) return factor;
    factor += 2;
  }
  return n;
}
