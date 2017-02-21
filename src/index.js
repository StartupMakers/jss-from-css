import css from 'css';

export function createCSSParser({ parser = defaultCSSParser, context = {} }) {
  return (chunks, ...variables) => {
    let styles;
    if (chunks.length === 1) {
      styles = chunks[0];
    } else {
      styles = chunks.reduce((result, chunk, index) => {
        const variable = variables[index];
        if (typeof variable === 'function') {
          return result + chunk + variable(context);
        } else if (typeof variable === 'string') {
          return result + chunk + variable;
        } else {
          return result + chunk;
        }
      }, '')
    }
    return parser(styles);
  }
}

function defaultCSSParser(styles) {
  const { stylesheet } = css.parse(styles);
  if (stylesheet.parsingErrors.length > 0) {
    throw new Error(stylesheet.parsingErrors);
  } else {
    return toJssRules(stylesheet.rules);
  }
}

function toJssRules(cssRules) {
  var jssRules = {};

  function addRule(rule, rules) {
    if (rule.type === 'comment') return;
    const style = {};
    const key = rule.selectors.join(', ');
    rule.declarations.forEach(function (decl) {
      style[decl.property] = decl.value
    });
    rules[key] = style
  }

  cssRules.forEach(function (rule) {
    if (rule.type === 'comment') return;
    switch (rule.type) {
      case 'rule': {
        addRule(rule, jssRules);
        break;
      }
      case 'media': {
        const key = '@media ' + rule.media;
        const value = {};
        rule.rules.forEach(function(rule) {
          addRule(rule, value)
        });
        jssRules[key] = value;
        break
      }
      case 'font-face': {
        const key = '@' + rule.type;
        const value = {};
        rule.declarations.forEach(function (decl) {
          value[decl.property] = decl.value
        });
        jssRules[key] = value;
        break
      }
      case 'keyframes': {
        const key = '@' + rule.type + ' ' + rule.name;
        const value = {};
        rule.keyframes.forEach(function (keyframe) {
          const frameKey = keyframe.values.join(', ');
          const frameValue = {};
          keyframe.declarations.forEach(function (decl) {
            frameValue[decl.property] = decl.value
          });
          value[frameKey] = frameValue;
        });
        jssRules[key] = value;
      }
    }
  });

  return jssRules;
}

