import { createCSSParser } from '../src/index';

const parser = createCSSParser({
  context: {
    color: 'black',
  }
});

const button = `
  color: red;
`;

const styles = parser`
  button {
    background: ${context => context.color};
    width: 200px;
    border-radius: 10px;
    ${button}
  }
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
`;

console.log(styles);
