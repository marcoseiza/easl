import { createTheme } from "@material-ui/core";
import { Palette } from "@material-ui/core/styles/createPalette";

export const theme = createTheme({
  typography: (p: Palette) => ({
    h1: {
      color: p.text.primary,
      fontStyle: 'bold',
    },
    h2: {
      color: p.text.primary
    },
    h3: {
      color: p.text.primary
    },
    h4: {
      color: p.text.secondary
    },
    h5: {
      color: p.text.secondary
    },
    h6: {
      color: p.text.secondary
    },
    body1: {
      color: p.text.primary
    },
    body2: {
      color: p.text.primary
    }
  }),
  palette: {
    common: {
      black: '#000',
      white: '#fff'
    },
    background: {
      default: '#002b36',
      paper: '#00212b',
    },
    primary: {
      main: '#002b36',
      dark: '#00212b',
      light: '#073642',
    },
    secondary: {
      main: '#268bd2'
    },
    error: {
      main: '#dc322f'
    },
    warning: {
      main: '#cb4b16'
    },
    info: {
      main: '#2aa198'
    },
    success: {
      main: '##859900'
    },
    text: {
      primary: '#93a1a1',
      secondary: '#2aa198',
      disabled: '#657b83',
      hint: '#b58900',
    },
    // type: PaletteType,
    // tonalOffset: PaletteTonalOffset,
    // contrastThreshold: number,
    // grey: ColorPartial,
    // divider: string,
    action: {
      active: '#586e75',
      hover: '#073642',
      hoverOpacity: 0.3,
      selected: '#073642',
      selectedOpacity: 0.5,
      disabled: '#657b83',
      disabledOpacity: 1,
      disabledBackground: '#657b83',
      focus: '#073642',
      focusOpacity: 1,
      activatedOpacity: 1,
    },
    // background: Partial < TypeBackground >,
  }
})