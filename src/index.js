// @flow
import stylis from 'stylis'

/* Import singletons */
import generateAlphabeticName from './utils/generateAlphabeticName'
import css from './constructors/css'
import injectGlobal from './constructors/injectGlobal'
import styleSheet from './models/StyleSheet'

/* Import singleton constructors */
import _styledComponent from './models/StyledComponent'
import _styled from './constructors/styled'
import _keyframes from './constructors/keyframes'
import _ComponentStyle from './models/ComponentStyle'

/* Import components */
import ThemeProvider from './models/ThemeProvider'

/* Import Higher Order Components */
import withTheme from './hoc/withTheme'

/* Instantiate singletons */
const keyframes = _keyframes(generateAlphabeticName)
const styled = _styled(
  _styledComponent(
    _ComponentStyle(generateAlphabeticName)
  )
)

/* First debug steps */
type CSSOptions = {
  parse: (CSS: string) => Object,
}
type CompiledCSSCallback = (context: Object?, options: CSSOptions?) => Object
const fromCSS: CompiledCSSCallback = (CSS: string) {
  return (context, options) => ({
    return (options && options.parse) ? options.parse(CSS) : stylis(
      '',
      CSS,
      false,
      false
    );
  })
}
  

/* Export everything */
export default fromCSS
export { css, keyframes, injectGlobal, ThemeProvider, withTheme, styleSheet }
