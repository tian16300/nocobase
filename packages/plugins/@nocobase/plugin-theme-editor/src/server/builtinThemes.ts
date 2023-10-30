import { ThemeItem } from '../types';

/** antd 默认主题 */
export const defaultTheme: Omit<ThemeItem, 'id'> = {
  config: {
    "name": "Default",
    "token": {
      "colorInfo": "#1677ff",
      "wireframe": false,
      "colorBorder": "#e5e5e5",
      "colorWarning": "#FA8C16",
      "colorBgHeader": "#001529",
      "colorBgLayout": "#f2f2f2",
      "colorSettings": "#4096ff",
      "colorTextBase": "#000",
      "colorPrimaryHeader": "#001529",
      "colorTextHeaderMenu": "#ffffffa6",
      "colorBgSettingsHover": "#4096ff0f",
      "colorBorderSecondary": "#e0e0e0",
      "colorBgHeaderMenuHover": "#ffffff1a",
      "colorBgHeaderMenuActive": "#ffffff1a",
      "colorBorderSettingsHover": "#4096ff4d",
      "colorTextHeaderMenuHover": "#ffffff",
      "colorTextHeaderMenuActive": "#ffffff"
    }
  },
  optional: true,
  isBuiltIn: true,
  uid: 'default'
};

export const dark: Omit<ThemeItem, 'id'> = {
  config: {
    name: 'Dark',
    // @ts-ignore
    algorithm: 'darkAlgorithm',
  },
  optional: true,
  isBuiltIn: true,
  uid: 'dark'
};

export const compact: Omit<ThemeItem, 'id'> = {
  config: {
    name: 'Compact',
    // @ts-ignore
    algorithm: 'compactAlgorithm',
  },
  optional: true,
  isBuiltIn: true,
  uid: 'compact'
};

/** 同时包含 `紧凑` 和 `暗黑` 两种模式 */
export const compactDark: Omit<ThemeItem, 'id'> = {
  config: {
    name: 'Compact dark',
    // @ts-ignore
    algorithm: ['compactAlgorithm', 'darkAlgorithm'],
  },
  optional: true,
  isBuiltIn: true,
  uid: 'compact_dark'
};
