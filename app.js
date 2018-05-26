const AuroraAPI = require('nanoleaves');
const aurora = new AuroraAPI({
    host: '192.168.1.125',
    token: 'z6jQ0SLy14vKhR9Xj5HcVwakRB4AgJtd'
});

//Import color steps in RGB. Step gradient made with http://www.perbang.dk/rgbgradient/
var ColorSteps = require('./color_1500.js');

//get some random stuff generated.
var randomNumber = function(min, max) {
  min = typeof min !== 'undefined' ? min : 0;
  max = typeof max !== 'undefined' ? max : 100;
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Fonction to change and array of tiles to a single color
var change_color = function(input,r,g,b){
  var reColoredInput = input.map(obj =>{
     obj.r = r;
     obj.g = g;
     obj.b = b;
     return obj;
  });
  console.log(reColoredInput);
  aurora.setStaticPanel(reColoredInput);
  console.log('color changed to:'+'R:'+r+' G:'+g+' B:'+b);
};

// List of pannels that need to be OFF for the Wizerty logo
const wizerty_OFF = [
  { id: 16, r: 0, g: 0, b: 0, transition: 50 },
  { id: 19, r: 0, g: 0, b: 0, transition: 50 },
  { id: 101, r: 0, g: 0, b: 0, transition: 50 },
  { id: 163, r: 0, g: 0, b: 0, transition: 50 },
];

// List of pannels that need to ON for the Wizerty lgoo
// WIZERTY Logo Color = Pentone 390C (official) and 382C (print)
// With Aurora power connector at the bottom right corner or the W
const wizerty_ON = [
	{ id: 37, r: 196, g: 214, b: 0, transition: 50 },
	{ id: 68, r: 196, g: 214, b: 0, transition: 50 },
  { id: 169, r: 196, g: 214, b: 0, transition: 50 },
  { id: 118, r: 196, g: 214, b: 0, transition: 50 },
  { id: 2, r: 196, g: 214, b: 0, transition: 50 },
  { id: 193, r: 196, g: 214, b: 0, transition: 50 },
  { id: 150, r: 196, g: 214, b: 0, transition: 50 },
  { id: 142, r: 196, g: 214, b: 0, transition: 50 },
  { id: 76, r: 196, g: 214, b: 0, transition: 50 },
  { id: 92, r: 196, g: 214, b: 0, transition: 50 },
	{ id: 102, r: 196, g: 214, b: 0, transition: 50 },
  { id: 132, r: 196, g: 214, b: 0, transition: 50 },
  { id: 250, r: 196, g: 214, b: 0, transition: 50 },
  { id: 29, r: 196, g: 214, b: 0, transition: 50 },
  { id: 58, r: 196, g: 214, b: 0, transition: 50 },
  { id: 217, r: 196, g: 214, b: 0, transition: 50 },
  { id: 138, r: 196, g: 214, b: 0, transition: 50 },
  { id: 239, r: 196, g: 214, b: 0, transition: 50 },
  { id: 113, r: 196, g: 214, b: 0, transition: 50 },
  { id: 214, r: 196, g: 214, b: 0, transition: 50 },
  { id: 160, r: 196, g: 214, b: 0, transition: 50 },
];

// We apply the colors the the panels
// First, Switch OFF the ones that are not needed for the Wizerty logo
aurora.setStaticPanel(wizerty_OFF);

// Loop to test the changing of the color depending on some random value - simulation of PSU load.
function loop() {

  //Randomly generate a PSU wattage read-out betwee 0 and 1500 - for the test
  var psuWatts = randomNumber(0, 1500);
  console.log('PSU Wattage : '+psuWatts+' Watts');

  //Ther should be a better way to do this. Best would be to read these from the JSON file
  //Will check later
  var counts = [0, 100, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 1100, 1200, 1300, 1400, 1500];

  //Figures out the closest "step" for the Wattage value just read from the PSU.
  var closest = counts.reduce(function(prev, curr) {
  return (Math.abs(curr - psuWatts) < Math.abs(prev - psuWatts) ? curr : prev);
  });
  console.log('Closest step : '+closest);

  // JSON Object for the current color step. The array ID corresponds to the closest value/100.
  // This would be adjusted if there would be more granularity.
  var ColorSpecs = ColorSteps[parseInt(closest/100)];

  // Set panel color with RGB values.
  change_color(wizerty_ON,ColorSpecs['R'],ColorSpecs['G'],ColorSpecs['B'])

  }

  setInterval(loop, 1000);
