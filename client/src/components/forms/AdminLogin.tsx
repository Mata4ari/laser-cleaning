import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import {
  Box,
  TextField,
  Button,
  Typography,
  CircularProgress,
  InputAdornment,
  Avatar,
  useTheme,
  styled,
  Card,
  CardContent,
  Fade,
  Alert,
  Snackbar,
  Divider,
  IconButton,
  Stack
} from "@mui/material";
import {
  Lock as LockIcon,
  Email as EmailIcon,
  Visibility,
  VisibilityOff
} from "@mui/icons-material";

const GradientCard = styled(Card)(({ theme }) => ({
  background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.grey[50]} 100%)`,
  borderRadius: theme.shape.borderRadius * 3,
  overflow: "hidden",
  boxShadow: `0 10px 40px -10px ${theme.palette.primary.main}30`,
  transition: `all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)`,
  maxWidth: 500,
  margin: "0 auto",
  position: "relative",
  "&:hover": {
    transform: "translateY(-5px)",
    boxShadow: `0 15px 50px -12px ${theme.palette.primary.main}40`
  },
  "&:before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "5px",
    background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`
  }
}));

const LoginButton = styled(Button)(({ theme }) => ({
  borderRadius: 30,
  padding: theme.spacing(1.5, 3),
  fontWeight: 600,
  transition: "all 0.3s ease",
  textTransform: "none",
  "&:hover": {
    transform: "scale(1.05)",
    boxShadow: theme.shadows[4]
  }
}));

const AdminLogin: React.FC = () => {
  const theme = useTheme();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoading, error } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password); // phone пустой
      navigate(location.state?.from || "/");
      setOpenSnackbar(true);
    } catch (err) {
      console.error("Login error:", err);
      setOpenSnackbar(true);
    }
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", alignItems: "center", p: 2 }}>
      <GradientCard>
        <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              mb: 4
            }}
          >
            <Avatar
              sx={{
                bgcolor: theme.palette.primary.main,
                width: 70,
                height: 70,
                mb: 3,
                boxShadow: theme.shadows[5],
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "rotate(10deg) scale(1.05)"
                }
              }}
            >
              <LockIcon fontSize="large" />
            </Avatar>
            <Typography
              variant="h4"
              component="h1"
              gutterBottom
              align="center"
              sx={{ fontWeight: 700 }}
            >
              Вход в панель администратора
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              align="center"
              sx={{ maxWidth: 400, mb: 3 }}
            >
              Введите ваши учетные данные для доступа к административной панели
            </Typography>
          </Box>

          <Box component="form" onSubmit={handleSubmit} noValidate>
            <Fade in={true} timeout={500}>
              <Stack spacing={3}>
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@example.com"
                  required
                  variant="outlined"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailIcon color="primary" />
                      </InputAdornment>
                    )
                  }}
                />

                <TextField
                  fullWidth
                  label="Пароль"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Введите пароль"
                  required
                  variant="outlined"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockIcon color="primary" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleTogglePasswordVisibility}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                />
              </Stack>
            </Fade>

            <Divider sx={{ my: 4 }} />

            <Box sx={{ textAlign: "center" }}>
              <LoginButton
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                disabled={isLoading}
                fullWidth
                sx={{
                  minWidth: 200,
                  backgroundImage: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`
                }}
                startIcon={
                  isLoading ? <CircularProgress size={20} color="inherit" /> : null
                }
              >
                {isLoading ? "Вход..." : "Войти"}
              </LoginButton>
            </Box>
          </Box>
        </CardContent>
      </GradientCard>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setOpenSnackbar(false)}
          severity={error ? "error" : "success"}
          sx={{ width: "100%" }}
        >
          {error ? error : "Вы успешно вошли в систему!"}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AdminLogin;
