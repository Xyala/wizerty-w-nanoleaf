// Import dependencies
// ----------------------------------------------------------------------------------------------------------------------------------------
const AuroraAPI = require('nanoleaves');                    // Nanoleaf library by Ceejbot https://github.com/ceejbot/nanoleaves/
var ColorSteps = require('./color_1500.js');                // Import color steps in RGB. Step gradient made with http://www.perbang.dk/rgbgradient/


var wizerty_OFF = require('./config-wiz-off.js');           // Import list with pannels that need to be OFF
var wizerty_ON = require('./config-wiz-on.js');             // Import list with pannels that need to be ON
// Note: WIZERTY Logo Color = Pentone 390C (official) and 382C (print)
// Position and id with Aurora power connector at the bottom right corner or the W
// ----------------------------------------------------------------------------------------------------------------------------------------

// 0.   Initiate the panels structure to connect with (to be bustomized to your own setup)
const aurora = new AuroraAPI({
    host: '192.168.1.125',
    token: 'z6jQ0SLy14vKhR9Xj5HcVwakRB4AgJtd'
});

// 1.   First, Switch OFF the ones that are not needed for the Wizerty logo
aurora.setStaticPanel(wizerty_OFF);

// Loop to test the changing of the color depending on some random readout value
function loop() {
  //Randomly generate a PSU wattage read-out betwee 0 and 1500 - for the test
  var psuWatts = randomNumber(0, 1500);
  console.log('PSU Wattage : '+psuWatts+' Watts');

  //Ther should be a better way to do this. Best would be to read these from the JSON file
  //Will check later ...
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


  // Fonction to change and array of tiles to a single color.
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

  // Fonction to get some random stuff generated. Ultimately you input something else (PSU wattage or CPU Frequency)
  var randomNumber = function(min, max) {
    min = typeof min !== 'undefined' ? min : 0;
    max = typeof max !== 'undefined' ? max : 100;
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };
