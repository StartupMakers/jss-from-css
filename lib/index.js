'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createCSSParser = createCSSParser;

var _css = require('css');

var _css2 = _interopRequireDefault(_css);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * CSS TO JSS parser constructor
 * @param {Function} parser function as argument takes CSS string
 * @param {Object} context passed throw to literals expressions
 * @returns {Object} result of parser execution
 * */
function createCSSParser(_ref) {
  var _ref$parser = _ref.parser,
      parser = _ref$parser === undefined ? defaultCSSParser : _ref$parser,
      _ref$context = _ref.context,
      context = _ref$context === undefined ? {} : _ref$context;

  return function (chunks) {
    for (var _len = arguments.length, variables = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      variables[_key - 1] = arguments[_key];
    }

    var styles = void 0;
    if (chunks.length === 1) {
      styles = chunks[0];
    } else {
      styles = chunks.reduce(function (result, chunk, index) {
        var variable = variables[index];
        if (typeof variable === 'function') {
          return result + chunk + variable(context);
        } else if (typeof variable === 'string') {
          return result + chunk + variable;
        } else {
          return result + chunk;
        }
      }, '');
    }
    return parser(styles);
  };
}

/**
 * Default CSS parser, uses 'css' package for parsing
 * @param {String} styles CSS string
 * @returns {Object} result of transforming to JSS
 * */
function defaultCSSParser(styles) {
  var _css$parse = _css2.default.parse(styles),
      stylesheet = _css$parse.stylesheet;

  if (stylesheet.parsingErrors.length > 0) {
    throw new Error(stylesheet.parsingErrors);
  } else {
    return toJssRules(stylesheet.rules);
  }
}

/**
 * CSS rules to JSS object transform function
 * @param {Object} cssRules object with rules
 * @returns {Object} JSS rules object
 * */
function toJssRules(cssRules) {
  var jssRules = {};

  function addRule(rule, rules) {
    if (rule.type === 'comment') return;
    var style = {};
    var key = rule.selectors.join(', ');
    rule.declarations.forEach(function (decl) {
      style[decl.property] = decl.value;
    });
    rules[key] = style;
  }

  cssRules.forEach(function (rule) {
    if (rule.type === 'comment') return;
    switch (rule.type) {
      case 'rule':
        {
          addRule(rule, jssRules);
          break;
        }
      case 'media':
        {
          var key = '@media ' + rule.media;
          var value = {};
          rule.rules.forEach(function (rule) {
            addRule(rule, value);
          });
          jssRules[key] = value;
          break;
        }
      case 'font-face':
        {
          var _key2 = '@' + rule.type;
          var _value = {};
          rule.declarations.forEach(function (decl) {
            _value[decl.property] = decl.value;
          });
          jssRules[_key2] = _value;
          break;
        }
      case 'keyframes':
        {
          var _key3 = '@' + rule.type + ' ' + rule.name;
          var _value2 = {};
          rule.keyframes.forEach(function (keyframe) {
            var frameKey = keyframe.values.join(', ');
            var frameValue = {};
            keyframe.declarations.forEach(function (decl) {
              frameValue[decl.property] = decl.value;
            });
            _value2[frameKey] = frameValue;
          });
          jssRules[_key3] = _value2;
        }
    }
  });

  return jssRules;
}