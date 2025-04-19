import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    primary: {
      main: '#2c3e50',      // Темно-синий/серый - для профессионального вида
      light: '#3d566e',     // Более светлый вариант основного
      dark: '#1a252f',      // Темный вариант для акцентов
    },
    secondary: {
      main: '#e74c3c',      // Ярко-красный - для кнопок и важных элементов
      light: '#ff6b5b',     // Более светлый красный
      dark: '#c0392b',      // Темный красный
    },
    background: {
      default: '#f8f9fa',   // Светло-серый фон
      paper: '#ffffff',     // Белый для карточек и панелей
    },
    text: {
      primary: '#2c3e50',   // Основной текст - темный
      secondary: '#7f8c8d', // Вторичный текст - серый
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      fontSize: '2.5rem',
      color: '#2c3e50',
    },
    h2: {
      fontWeight: 600,
      fontSize: '2rem',
      color: '#2c3e50',
    },
    h3: {
      fontWeight: 600,
      fontSize: '1.75rem',
      color: '#000000',
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.7,
      color: '#000000',
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
      color: '#000000',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '10px 24px',
          fontSize: '1rem',
        },
        contained: {
          boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.15)',
          '&:hover': {
            boxShadow: '0px 6px 16px rgba(0, 0, 0, 0.2)',
          },
        },
        outlined: {
          borderWidth: 2,
          '&:hover': {
            borderWidth: 2,
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0px 8px 20px rgba(0, 0, 0, 0.08)',
          transition: 'transform 0.3s, box-shadow 0.3s',
          '&:hover': {
            transform: 'translateY(-5px)',
            boxShadow: '0px 12px 24px rgba(0, 0, 0, 0.12)',
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#2c3e50',
        },
      },
    },
  },
});