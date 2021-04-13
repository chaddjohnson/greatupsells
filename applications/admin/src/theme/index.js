import { createMuiTheme } from '@material-ui/core/styles';

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#F05E23'
    },
    secondary: {
      main: '#23B5F0',
      contrastText: '#FFFFFF'
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
    },
    MuiTextField: {
      root: {
        backgroundColor: '#FFFFFF'
      }
    },
    MuiSelect: {
      root: {
        backgroundColor: '#FFFFFF'
      }
    },
    MuiTableContainer: {
      root: {
        WebkitOverflowScrolling: 'touch'
      }
    },
    MuiTableRow: {
      root: {
        '&:hover td, &:focus-within td': {
          backgroundColor: 'rgba(0, 0, 0, 0.04)'
        }
      }
    }
  }
});

export default theme;
