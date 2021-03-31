import { createMuiTheme } from '@material-ui/core/styles';

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#F05E23'
    },
    secondary: {
      main: '#23B5F0'
    }
  },
  overrides: {
    MuiBreadcrumbs: {
      root: {
        '&, & a': {
          fontSize: '20px',
          fontWeight: 500,
          letterSpacing: 0.15,
          color: 'white'
        }
      }
    }
  }
});

export default theme;
