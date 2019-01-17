import { Dimensions, Linking, Share } from 'react-native';

const WINDOW_WIDTH = Dimensions.get('window').width;
const WINDOW_HEIGHT = Dimensions.get('window').height;
const FIELDPLUS_URL = 'https://www.fieldpulse.com?utm_campaign=contractor-calculator-app&utm_medium=app&utm_sourece=contractor-calculator-app';
const IPHONE_X_STATUS_BAR_HEIGHT = 44;

const _colorSet = {
  mainColor: '#3192cc',
  greyColor: '#fafafa',
  blackColor: 'black',
  whiteColor: 'white',
  pinkColor: '#f06292',
  darkGreyColor: '#5f5f5f',
  darkMainColor: '#007abe',
  bgGreyColor: '#f4f4f4',
  lightGreyColor: '#eeeeee',
  transparent: 'transparent',
  btnGery: '#979797',
  feetInputGrey: '#fafafa',
  green: '#5eA848',
  red: '#b33636',
  blue: '#2f8dc6',
  pink: '#9013fe',
  modalBgGreayColor: 'rgba(150, 150, 150, 0.7)',
  indicatorBoxColor: 'rgba(150, 150, 150, 0.2)',
  indicatorBgColor: 'rgba(255, 255, 255, 0.9)'
};

const _fontSet = {
  xxlarge: 40,
  xlarge: 30,
  large: 25,
  middle: 20,
  normal: 15,
  small: 13,
  xsmall: 11,
  xxsmall: 9,
};

const _iconSizeSet = {
  large: 35,
  normal: 24,
  small: 20,
};

const _styleSet = {
  menuButton: {
    alignSelf: 'center',
    justifyContent: 'center',
    padding: 10,
    paddingLeft: 20,
    paddingRight: 20,
  },
  rightNavButton: {
    marginRight: 20,
    color: _colorSet.whiteColor
  },
  indicatorBox: {
    padding: 20,
    backgroundColor: _colorSet.indicatorBoxColor,
    borderRadius: 10,
  },
  indicator: {
    width: '100%',
    height: '100%',
    backgroundColor: _colorSet.indicatorBgColor,
    backgroundColor: '_colorSet.indicatorBgColor',
    justifyContent: 'center',
    position: 'absolute',
    alignItems: 'center',
  }
};

const _iconSet = {
  logo: require('../assets/icons/logo.png'),

}

const _phaseOptions = [
  { key: 1, label: 'DC' },
  { key: 2, label: 'AC - Single Phase' },
  { key: 3, label: 'AC - Three Phase - Line to Line Voltage' },
  { key: 4, label: 'AC - Three Phase - Line to Neutral Voltage' },
];

const _wireTypeOptions = [
  { key: 1, label: 'Copper' },
  { key: 2, label: 'Aluminum' },
];

const _simplePhaseOptions = [
  { key: 1, label: 'Single Phase' },
  { key: 2, label: '3 Phase' },
];

const _voltageOptions = [
  { key: 120, label: '120' },
  { key: 240, label: '240' },
  { key: 480, label: '480' },
];

const _pitchOptions = [
  { key: '0/12', label: '0/12', multiplier: 1 },
  { key: '1/12', label: '1/12', multiplier: 1.003 },
  { key: '2/12', label: '2/12', multiplier: 1.031 },
  { key: '3/12', label: '3/12', multiplier: 1.031 },
  { key: '4/12', label: '4/12', multiplier: 1.054 },
  { key: '5/12', label: '5/12', multiplier: 1.083 },
  { key: '6/12', label: '6/12', multiplier: 1.118 },
  { key: '7/12', label: '7/12', multiplier: 1.158 },
  { key: '8/12', label: '8/12', multiplier: 1.202 },
  { key: '9/12', label: '9/12', multiplier: 1.250 },
  { key: '10/12', label: '10/12', multiplier: 1.302 },
  { key: '11/12', label: '11/12', multiplier: 1.357 },
  { key: '12/12', label: '12/12', multiplier: 1.414 },
  { key: '13/12', label: '13/12', multiplier: 1.474 },
  { key: '14/12', label: '14/12', multiplier: 1.537 },
  { key: '15/12', label: '15/12', multiplier: 1.601 },
  { key: '16/12', label: '16/12', multiplier: 1.667 },
  { key: '17/12', label: '17/12', multiplier: 1.734 },
  { key: '18/12', label: '18/12', multiplier: 1.803 },
]

const _MenuData = [
  {
    title: 'General',
    member: [
      {
        title: 'Estimates & Invoices',
        route: 'SimplySend',
      }, {
        title: 'Square Footage',
        route: 'SquareFootage',
      }, {
        title: 'Convert Decimals and Fractions',
        route: 'ConvertDecimalFraction',
      }, {
        title: 'Fraction Calculator',
        route: 'FractionCalcultor',
      }, {
        title: 'Measurement Conversion',
        route: 'MeasurementConversion',
      }
    ],
  }, {
    title: 'Electrical',
    member: [
      {
        title: 'Amps to Watts',
        route: 'AmpsToWatts',
      }, {
        title: 'Ohm\'s Law',
        route: 'OhmsLaw',
      }, {
        title: 'Wire Size',
        route: 'WireSize',
      }, {
        title: 'Amps by Wire Size',
        route: 'AmpsByWireSize',
      }
    ],
  }, {
    title: 'Interiors',
    member: [
      {
        title: 'Wall and Paint Footage',
        route: 'WallFootage',
      }, {
        title: 'Drywall Footage',
        route: 'DrywallFootage',
      }, {
        title: 'Flooring Calculator',
        route: 'FlooringTile',
      }
    ],
  }, {
    title: 'Exteriors',
    member: [
      {
        title: 'Roof Footage',
        route: 'RoofCalculator',
      }, {
        title: 'Roof Pitch',
        route: 'RoofPitch',
      }, {
        title: 'Siding & Brick',
        route: 'SidingBrick',
      }
    ],
  }
];

const _constant = {
  conductor_resistivity: {
    copper: 11.2,
    aluminum: 17.4,
  }
}

const _wireTable = [
  { circ: 1620, size: "18 AWG", amax: 0, cmax: 14 },
  { circ: 2580, size: "16 AWG", amax: 0, cmax: 18 },
  { circ: 4110, size: "14 AWG", amax: 0, cmax: 20 },
  { circ: 6530, size: "12 AWG", amax: 20, cmax: 25 },
  { circ: 10380, size: "10 AWG", amax: 25, cmax: 30 },
  { circ: 15510, size: "8 AWG", amax: 30, cmax: 40 },
  { circ: 26240, size: "6 AWG", amax: 40, cmax: 55 },
  { circ: 41740, size: "4 AWG", amax: 55, cmax: 70 },
  { circ: 52620, size: "3 AWG", amax: 65, cmax: 85 },
  { circ: 66360, size: "2 AWG", amax: 75, cmax: 95 },
  { circ: 83690, size: "1 AWG", amax: 85, cmax: 110 },
  { circ: 105600, size: "1/0 AWG", amax: 100, cmax: 125 },
  { circ: 133100, size: "2/0 AWG", amax: 135, cmax: 175 },
  { circ: 167800, size: "3/0 AWG", amax: 155, cmax: 200 },
  { circ: 211600, size: "4/0 AWG", amax: 180, cmax: 230 },
  { circ: 250000, size: "250 MCM", amax: 205, cmax: 255 },
  { circ: 300000, size: "300 MCM", amax: 230, cmax: 285 },
  { circ: 350000, size: "350 MCM", amax: 250, cmax: 310 },
  { circ: 400000, size: "400 MCM", amax: 270, cmax: 335 },
  { circ: 500000, size: "500 MCM", amax: 310, cmax: 380 },
  { circ: 600000, size: "600 MCM", amax: 340, cmax: 420 },
  { circ: 700000, size: "700 MCM", amax: 375, cmax: 460 },
  { circ: 750000, size: "750 MCM", amax: 385, cmax: 475 },
  { circ: 800000, size: "800 MCM", amax: 395, cmax: 490 },
  { circ: 900000, size: "900 MCM", amax: 425, cmax: 520 },
  { circ: 1000000, size: "1000 MCM", amax: 445, cmax: 545 },
  { circ: 1250000, size: "1250 MCM", amax: 485, cmax: 590 },
  { circ: 1500000, size: "1500 MCM", amax: 520, cmax: 625 },
  { circ: 1750000, size: "1750 MCM", amax: 545, cmax: 650 },
  { circ: 2000000, size: "2000 MCM", amax: 560, cmax: 665 },
]

const _routeLabel = [
  { route: 'AmpsToWatts', label: 'Amps To Watts' },
  { route: 'OhmsLaw', label: 'Ohm\'s Law' },
  { route: 'WireSize', label: 'Wire Size' },
  { route: 'SquareFootage', label: 'Square Footage' },
  { route: 'ScrewRoomFootage', label: 'Drywall Footage' },
  { route: 'GallonRoomFootage', label: 'Wall Footage' },
  { route: 'FlooringTile', label: 'Flooring & Tile' },
  { route: 'SidingBrick', label: 'Siding and Brick' },
  { route: 'RoofCalculator', label: 'Roof Calculator' },
];

const _pitchTable = [
  { pitch: '0/12', angle: 0 },
  { pitch: '1/12', angle: 4.76 },
  { pitch: '2/12', angle: 9.46 },
  { pitch: '3/12', angle: 14.04 },
  { pitch: '4/12', angle: 18.43 },
  { pitch: '5/12', angle: 22.62 },
  { pitch: '6/12', angle: 26.57 },
  { pitch: '7/12', angle: 30.26 },
  { pitch: '8/12', angle: 33.69 },
  { pitch: '9/12', angle: 36.87 },
  { pitch: '10/12', angle: 39.81 },
  { pitch: '11/12', angle: 42.51 },
  { pitch: '12/12', angle: 45.00 },
  { pitch: '13/12', angle: 47.29 },
  { pitch: '14/12', angle: 49.40 },
  { pitch: '15/12', angle: 51.34 },
  { pitch: '16/12', angle: 53.13 },

]

const _formatValue = (value, precision) => {
  if (isNaN(value))
    return null;
  else
    return (Math.round(value * Math.pow(10, precision)) / Math.pow(10, precision)).toString();
}

const _checkValue = (value) => {
  if (value == '') {
    value = 0;
  }

  if (!isNaN(value)) {
    return parseFloat(value);
  }
  return 0;
}

const _gcd = (a, b) => {
  return (b) ? _gcd(b, a % b) : a;
}

const _decimalToFraction = (_decimal, base) => {
  if (_decimal.toString().charAt(0) == '.') {
    _decimal = '0' + _decimal;
  }

  if (parseInt(_decimal) == parseFloat(_decimal)) {
    return {result: _decimal, bottom: 0};
  }

  var top = _decimal.toString().replace(/\d+[.]/, '');
  var bottom = Math.pow(10, top.length);
  if (_decimal > 1) {
    top = +top + Math.floor(_decimal) * bottom;
  }
  var x = _gcd(top, bottom);
  const integer = parseInt(top / bottom);
  top = top % bottom;
  top = top / x;
  bottom = bottom / x;
  if (bottom > base) {
    top = parseInt(top * base / bottom);
    bottom = base;
  }
  x = _gcd(top, bottom);
  top = top / x;
  bottom = bottom / x;

  let result = top + '/' + bottom;
  if (integer > 0) {
    result = integer + ' ' + result;
  }
  return { result: result, bottom: bottom };
};

_onEmail = (subject, body) => {
  Linking.openURL('mailto:?subject=' + subject + '&body=' + escape(body));
}

_onShare = (title, message) => {
  Share.share({
    message: message,
    title: title
  });
}

_onLinkWeb = () => {
  Linking.openURL(FIELDPLUS_URL);
}

_onSimplySend = () => {
  // Linking.openURL('simplysend://send');
  Linking.openURL('https://www.fieldpulse.com/contractor-estimate-app?utm_campaign=contractor-calculator-app&utm_medium=app&utm_sourece=contractor-calculator-app');
}

_getFeetInchLabel = (inchesValue) => {
  let label = '';
  const feet = parseInt(parseInt(inchesValue) / 12);
  const inches = parseInt(inchesValue) % 12;
  if (feet > 0) {
    label += feet + '\'';
  }
  if (inches > 0) {
    if (label.length > 0) {
      label += ' ';
    }
    label += inches + '"';
  }

  return label;
}

_getCalculationLabel = (routeName) => {

  let label = '';
  _routeLabel.forEach(item => {
    if (item.route == routeName) {
      label = item.label
    }
  });

  return label;
}

const StyleDict = {
  colorSet: _colorSet,
  fontSet: _fontSet,
  iconSizeSet: _iconSizeSet,
  iconSet: _iconSet,
  styleSet: _styleSet,
  windowW: WINDOW_WIDTH,
  windowH: WINDOW_HEIGHT,
  iphonex_statusbar_height: IPHONE_X_STATUS_BAR_HEIGHT,
  MenuData: _MenuData,
  optionSet: {
    phaseOptions: _phaseOptions,
    simplePhaseOptions: _simplePhaseOptions,
    wireTypeOptions: _wireTypeOptions,
    voltageOptions: _voltageOptions,
    pitchOptions: _pitchOptions,
  },
  constant: _constant,
  wireTable: _wireTable,
  pitchTable: _pitchTable,
  formatValue: _formatValue,
  checkValue: _checkValue,
  routeLabel: _routeLabel,
  getFeetInchLabel: _getFeetInchLabel,
  getCalculationLabel: _getCalculationLabel,
  onShare: _onShare,
  onEmail: _onEmail,
  onLinkWeb: _onLinkWeb,
  onSimplySend: _onSimplySend,
  decimalToFraction: _decimalToFraction,
};

export default StyleDict;