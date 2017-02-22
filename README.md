# jss-from-css

> No black boxes anymore.

> Less magic 👉 Less bugs 👉 More profit! 🚀

Use the best bits of ES6 and CSS to work with your [JSS styles](https://github.com/cssinjs/jss).

Fast, predictable and fully customizable CSS to JSS "on-the-fly" adapter which support any custom CSS pre-processors including PostCSS, LESS, SCSS, Stylus and so on.

This package could help you to migrate to JSS in up to 5x faster.

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

## Adapters

At the moment [stylis.js](https://github.com/thysultan/stylis.js) and [reworkcss/css](https://github.com/reworkcss/css) are using to prepare and parse your CSS code. The both are small "one module" packages which are great for Client-side Applications.

According to [some benchmarks][https://github.com/postcss/benchmark], PostCSS could be faster. If you'd like to get PostCSS as default preprocessor and parser please use:

+ [jss-from-postcss](https://www.npmjs.com/package/jss-from-postcss)
+ [babel-plugin-jss-from-postcss](https://www.npmjs.com/package/babel-plugin-jss-from-postcss)

### Customize

You control everything. You can create any custom CSS adapter to override `prepare` and/or `parse` functions:

+ `prepare(CSS: string): string` is using for preprocessing your PostCSS, LESS, SCSS or Stylus code to plain CSS.
+ `parse(CSS: string): object` is using for converting plain CSSto JSS.

Feel free to play with it:

```javascript
import { createCSSAdapter, keyframes } from 'jss-from-css'
import myPostCSSParser from './my-css-parser'
import myStylusParser from './my-stylus-parser'

const fromPostCSS = createCSSAdapter({
  prepare: (CSS) => myPostCSSParserSync(CSS),
})

const fromStylus = createCSSAdapter({
  prepare: (CSS) => myStylusParser(CSS),
})

const rotate360 = keyframes`
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
`

const styles1 = fromPostCSS`
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

const styles2 = fromStylus`
  button 
    color ${context => context.defaultColor || 'palevioletred'};
    display block;
    margin 0.5em 0;
    font-family Helvetica, Arial, sans-serif;
`
```

