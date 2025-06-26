import React from "react";
import {
  AppBar,
  Box,
  Toolbar,
  Button,
  IconButton,
  useTheme,
  Container,
  Stack,
  ThemeProvider
} from "@mui/material";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
import InstagramIcon from "@mui/icons-material/Instagram";
import TelegramIcon from "@mui/icons-material/Telegram";
import LocationOnIcon from "@mui/icons-material/LocationOn";

const socialLinks = [
  { icon: <InstagramIcon />, url: "https://instagram.com" },
  { icon: <TelegramIcon />, url: "https://t.me/your_telegram" }
];

const phoneNumber = "+375 (00) 000-00-00";
const address = "г. Минск, ул. Примерная, 123";

const Footer: React.FC = () => {
  const theme = useTheme();

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar
          position="static"
          color="primary"
          elevation={2}
          sx={{
            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, #2a4a7a 100%)`,
          }}
        >
          <Container maxWidth="lg">
            <Toolbar sx={{ 
              display: 'flex', 
              justifyContent: 'center',
              px: 2,
              minHeight: 64
            }}>
              <Box sx={{ 
                display: "flex", 
                flexDirection: { xs: "column", sm: "row" },
                alignItems: "center",
                justifyContent: 'center',
                width: '100%',
                gap: { xs: 2, sm: 4 },
                py: { xs: 2, sm: 0 }
              }}>
                <Button
                  variant="text"
                  color="inherit"
                  startIcon={<LocationOnIcon />}
                  href="https://yandex.ru/maps/"
                  target="_blank"
                  sx={{
                    color: theme.palette.primary.contrastText,
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    },
                    minWidth: 'auto'
                  }}
                >
                  {address}
                </Button>

                <Stack direction="row" spacing={2}>
                  {socialLinks.map((social, index) => (
                    <IconButton
                      key={index}
                      href={social.url}
                      target="_blank"
                      color="inherit"
                      size="small"
                      sx={{
                        '&:hover': {
                          color: theme.palette.secondary.main,
                        }
                      }}
                    >
                      {social.icon}
                    </IconButton>
                  ))}
                </Stack>

                <Button
                  variant="outlined"
                  color="inherit"
                  startIcon={<LocalPhoneIcon />}
                  sx={{
                    borderColor: 'rgba(255, 255, 255, 0.5)',
                    color: theme.palette.primary.contrastText,
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      borderColor: theme.palette.primary.contrastText,
                    },
                    minWidth: 'auto'
                  }}
                  href={`tel:${phoneNumber.replace(/\D/g, "")}`}
                >
                  {phoneNumber}
                </Button>
              </Box>
            </Toolbar>
          </Container>
        </AppBar>
      </Box>
    </ThemeProvider>
  );
};

export default Footer;