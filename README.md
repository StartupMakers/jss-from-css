# jss-from-css

Use the best bits of ES6 and CSS to work with your [JSS styles](https://github.com/cssinjs/jss).

## Installation

```bash
npm install jss-from-css --save
```

## Example

```javascript
import jss from 'jss'
import preset from 'jss-preset-default'
import color from 'color'
import fromCSS, { keyframes } from 'jss-from-css'

// One time setup with default plugins and settings.
jss.setup(preset())

const rotate360 = keyframes`
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
`

const styles = fromCSS`
  button {
    color: ${context => context.defaultColor || 'palevioletred'};
    display: block;
    margin: 0.5em 0;
    font-family: Helvetica, Arial, sans-serif;

    &:hover {
      text-decoration: underline;
      animation: ${rotate360} 2s linear infinite;
    }
  }
  
  ctaButton {
    @include button;
    
    &:hover {
      background: ${color('blue').darken(0.3).hex()}
    }
  }
`

const { classes } = jss.createStyleSheet(styles({
  defaultColor: 'navy',
}).attach()

document.body.innerHTML = `
  <button class="${classes['button']}">Button</button>
  <button class="${classes['ctaButton']}">CTA Button</button>
`
```

## Additional

Originally based on [styled-component 2.0.0-4](https://github.com/styled-components/styled-components/commit/22531e2431229d1f678b7ff1d575745800b888ed)

