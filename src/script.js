var n = 5;
var l = 3;
var m = 2;

// Standard factorial
function sFact(x) {
    var rval = 1;
    for (var i = rval + 1; i <= x; i++) {
        rval = rval * i;
    }
    return rval;
}

// Falling factorial
// Mathematica argument convention
function fFact(x, n) {
  if (n == 0) {
    return 1;
  }
  else {
   var rval = x - n + 1;
   for (var i = rval + 1; i <= x; i++) {
     rval = rval * i;
   }
   return rval;
  }
}

// Binomial coefficient
// Mathemetica argument convention
function binomial(n, m) {
  return fFact(n, m) / sFact(m);
}

// https://en.wikipedia.org/wiki/Laguerre_polynomials#Generalized_Laguerre_polynomials
function L(n, alpha, x) {
  var k = n - 1;
  
  if (n == 0) {
    return 1;
  }
  else if (n == 1) {
    return 1 + alpha - x;
  }
  else if (n >= 1) {
    return ((2*k + 1 + alpha - x) * L(k, alpha, x) - (k + alpha) * L(k - 1, alpha, x)) / (k + 1);
  }
  else {
    return 0;
  }
}

// https://en.wikipedia.org/wiki/Associated_Legendre_polynomials#Closed_Form
function P(l, m, x) {
  if (m < 0) {
    return Math.pow(-1, Math.abs(m)) * (sFact(l - Math.abs(m)) / sFact(l + Math.abs(m))) * P(l, Math.abs(m), x);
  }
  else {
   var sval = 0;
   for (var k = m; k <= l; k++) {
     sval = sval + ((sFact(k) / sFact(k - m)) * Math.pow(x, k - m) * binomial(l, k) * binomial((l + k - 1) / 2, l));
   }
   return Math.pow(-1, m) * Math.pow(2, l) * Math.pow(1 - x ** 2, m / 2) * sval;
  }
}

// https://en.wikipedia.org/wiki/Spherical_harmonics#Real_form
function Y(l, m, theta, phi) {
  if (m < 0) {
   return Math.pow(-1, m) * Math.sqrt(2) * Math.sqrt(((2 * l + 1) / (4 * Math.PI)) * (sFact(l - Math.abs(m)) / sFact(l + Math.abs(m)))) * P(l, Math.abs(m), Math.cos(theta)) * Math.sin(Math.abs(m) * phi);
  }
  else if (m == 0) {
    return Math.sqrt((2 * l + 1) / (4 * Math.PI)) * P(l, m, Math.cos(theta));
  }
  else {
    return Math.pow(-1, m) * Math.sqrt(2) * Math.sqrt(((2 * l + 1) / (4 * Math.PI)) * (sFact(l - m) / sFact(l + m))) * P(l, m, Math.cos(theta)) * Math.cos(m * phi);
  }
}

// https://en.wikipedia.org/wiki/Hydrogen-like_atom
// (Z / a_u) = 1
function R(n, l, r) {
 return Math.sqrt(Math.pow(2 / n, 3) * (sFact(n - l - 1) / (2 * n * sFact(n + l)))) * Math.exp(-r / n) * Math.pow(2 * r / n, l) * L(n - l - 1, 2 * l + 1, 2 * r / n);  
}

function gto(x, y, z, alpha, i, j, k) {
  return (
     Math.pow(2 * alpha / Math.PI, 3 / 4) 
   * Math.sqrt(
       (Math.pow(8 * alpha, i + j + k) * sFact(i) * sFact(j) * sFact(k))
        / (sFact(2 * i) * sFact(2 * j) * sFact(2 * k)))
   * Math.pow(x, i) * Math.pow(y, j) * Math.pow(z, k) 
   * Math.exp(-(alpha) * (Math.pow(x, 2) + Math.pow(y, 2) + Math.pow(z, 2)))
  );
}

var d = n ** 2.5;
var dn = d * 0.03;
var r = 0;
var theta = 0;
var phi = 0;
var x = [];
var y = [];
var z = [];
var orbital = [];

for (var i = -d; i <= d; i += dn) {
  for (var j = -d; j <= d; j += dn) {
    for (var k = -d; k <= d; k += dn) {
      r = Math.sqrt(i ** 2 + j ** 2 + k ** 2);
      theta = Math.acos(k / r);
      phi = Math.atan(j / i);
      x.push(i);
      y.push(j);
      z.push(k);
      
      orbital.push(R(n, l, r) * Y(l, m, theta, phi));
    }
  }
}  

var data = [
    {
        type: "isosurface",
        x: x,
        y: y,
        z: z,
        value: orbital,
        isomin: -1/(n ** 2.9),
        isomax: 1/(n ** 2.9),
        surface: {show: true, count: 6, fill: 0.3},
        showscale: false,
        caps: {
            x: {show: false},
            y: {show: false},
            z: {show: false}
        },
    }
];

var layout = {
  width: 800,
  height: 800,
    hovermode: false,
    hoverinfo: 'none',
    margin: {t:0, l:0, b:0},
    scene: {
        camera: {
            eye: {
                x: 1.9,
                y: 1.2,
                z: 0.6
            }
        },
        xaxis: {
          showspikes: false,
          mirror: true,
          showline: true,
        },
      yaxis: {
          showspikes: false,
          mirror: true,
          showline: true,
        },
      zaxis: {
          showspikes: false,
          mirror: true,
          showline: true,
        },
    }
};

Plotly.newPlot('myDiv', data, layout);