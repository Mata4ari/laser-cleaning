import React, { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  useMediaQuery,
  useTheme,
  Container,
  Divider,
  Stack,
  ThemeProvider
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
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

const Header: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: "center" }}>
      <Typography variant="h6" sx={{ my: 2, color: theme.palette.primary.main }}>
        ЛАЗЕРНАЯ ОЧИСТКА
      </Typography>
      <Divider />
      <List>
        <ListItem sx={{ justifyContent: "center", mt: 2 }}>
          <Button
            variant="outlined"
            color="primary"
            startIcon={<LocalPhoneIcon />}
            href={`tel:${phoneNumber.replace(/\D/g, "")}`}
            sx={{
              borderColor: theme.palette.primary.main,
              color: theme.palette.primary.main,
              '&:hover': {
                backgroundColor: '#f0f4f8',
                borderColor: theme.palette.primary.dark,
              }
            }}
          >
            {phoneNumber}
          </Button>
        </ListItem>
        <ListItem sx={{ justifyContent: "center", mt: 2 }}>
          <Button
            variant="outlined"
            color="primary"
            startIcon={<LocationOnIcon />}
            href="https://yandex.ru/maps/"
            target="_blank"
            sx={{
              borderColor: theme.palette.primary.main,
              color: theme.palette.primary.main,
              '&:hover': {
                backgroundColor: '#f0f4f8',
                borderColor: theme.palette.primary.dark,
              }
            }}
          >
            {address}
          </Button>
        </ListItem>
        <ListItem sx={{ justifyContent: "center", mt: 2 }}>
          <Stack direction="row" spacing={2}>
            {socialLinks.map((social, index) => (
              <IconButton
                key={index}
                href={social.url}
                target="_blank"
                sx={{
                  color: theme.palette.primary.main,
                  '&:hover': {
                    color: theme.palette.secondary.main,
                  }
                }}
              >
                {social.icon}
              </IconButton>
            ))}
          </Stack>
        </ListItem>
      </List>
    </Box>
  );

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
            <Toolbar>
              <Typography
                variant="h6"
                component={RouterLink}
                to="/"
                sx={{
                  flexGrow: 1,
                  color: theme.palette.primary.contrastText,
                  textDecoration: "none",
                  fontWeight: 700,
                  '&:hover': {
                    opacity: 0.9,
                  }
                }}
              >
                ЛАЗЕРНАЯ ОЧИСТКА
              </Typography>

              {isMobile ? (
                <>
                  <IconButton
                    color="inherit"
                    aria-label="open drawer"
                    edge="start"
                    onClick={handleDrawerToggle}
                    sx={{
                      '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      }
                    }}
                  >
                    <MenuIcon />
                  </IconButton>
                </>
              ) : (
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Button
                    variant="text"
                    color="inherit"
                    startIcon={<LocationOnIcon />}
                    href="https://yandex.ru/maps/"
                    target="_blank"
                    sx={{
                      mr: 1,
                      color: theme.palette.primary.contrastText,
                      '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      }
                    }}
                  >
                    {address}
                  </Button>

                  <Stack direction="row" spacing={1} sx={{ mx: 2 }}>
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
                      ml: 2,
                      borderColor: 'rgba(255, 255, 255, 0.5)',
                      color: theme.palette.primary.contrastText,
                      '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        borderColor: theme.palette.primary.contrastText,
                      }
                    }}
                    href={`tel:${phoneNumber.replace(/\D/g, "")}`}
                  >
                    {phoneNumber}
                  </Button>
                </Box>
              )}
            </Toolbar>
          </Container>
        </AppBar>
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true
          }}
          sx={{
            display: { xs: "block", md: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: 240,
              backgroundColor: theme.palette.background.paper,
            }
          }}
        >
          {drawer}
        </Drawer>
      </Box>
    </ThemeProvider>
  );
};

export default Header;