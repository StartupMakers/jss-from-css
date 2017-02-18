# jss-from-css

Use the best bits of ES6 and CSS to work with your [JSS styles](https://github.com/cssinjs/jss).

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
    color: palevioletred;
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

const { classes } = jss.createStyleSheet(styles).attach()

document.body.innerHTML = `
  <button class="${classes['button']}">Button</button>
  <button class="${classes['ctaButton']}">CTA Button</button>
`
```
