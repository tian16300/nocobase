import { genStyleHook } from '../../../__builtins__';

const useStyles = genStyleHook('nb-grid-body', (token) => {
  const { componentCls } = token;

  return {
    [componentCls]: {
      '.gridRow': {
        fill: token.colorFillQuaternary,
      },

      '.gridHeightRow': {
        fill: '#e6f7ff',
        borderColor: token.colorBorder,
      },

      '.gridRowLine': {
        stroke: token.colorBorder,
        // strokeWidth: 0,
        borderBottom: `1px solid ${token.colorBorder}`,
      },

      '.gridTick': {
        stroke: token.colorBorder,
        // strokeDasharray:3
        // ,
        // strokeWidth: 0
      },
      // '.gridTick:nth-child(7)': {
      //   stroke: token.colorBorderSecondary,
      //   strokeWidth: 0
      // }
    },
  };
});

export default useStyles;
