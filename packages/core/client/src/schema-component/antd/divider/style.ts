import { genStyleHook } from '../__builtins__';

const useStyles = genStyleHook('nb-card-item', (token) => {
  const { componentCls } = token;

  return {
    [componentCls]: {
      // '.card': {
      //   marginBottom: token.marginLG,
      // },
      'padding': token.marginLG
    },
  };
});

export default useStyles;
