import React, { useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import {
  Box,
  TextField,
  Button,
  Typography,
  MenuItem,
  CircularProgress,
  InputAdornment,
  Avatar,
  useTheme,
  styled,
  Stepper,
  Step,
  StepLabel,
  Stack,
  Card,
  CardContent,
  Fade,
  Zoom,
  Divider,
  Alert,
  Snackbar,
  useMediaQuery
} from "@mui/material";
import {
  Send as SendIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Description as DescriptionIcon,
  Build as BuildIcon,
  Category as CategoryIcon,
  ArrowBack as ArrowBackIcon,
  ArrowForward as ArrowForwardIcon,
  CheckCircle as CheckCircleIcon,
} from "@mui/icons-material";
import axios from "axios";

const GradientCard = styled(Card)(({ theme }) => ({
  background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.grey[50]} 100%)`,
  borderRadius: theme.shape.borderRadius * 3,
  overflow: "hidden",
  boxShadow: `0 10px 40px -10px ${theme.palette.primary.main}30`,
  transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
  maxWidth: 800,
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
  },
  [theme.breakpoints.down("sm")]: {
    borderRadius: theme.shape.borderRadius * 2
  }
}));

const StepperButton = styled(Button)(({ theme }) => ({
  borderRadius: 30,
  padding: theme.spacing(1, 3),
  fontWeight: 600,
  transition: "all 0.3s ease",
  textTransform: "none",
  "&:hover": {
    transform: "scale(1.05)",
    boxShadow: theme.shadows[4]
  }
}));

const validationSchema = yup.object({
  name: yup
    .string()
    .required("Имя обязательно")
    .min(2, "Имя должно содержать не менее 2 символов"),
  email: yup
    .string()
    .email("Некорректный email"),
  phone: yup
    .string()
    .required("Телефон обязателен")
    .matches(
      /^(\+375)[\s-]?\(?\d{2}\)?[\s-]?\d{3}[\s-]?\d{2}[\s-]?\d{2}$/,
      "Формат: +375 (XX) XXX-XX-XX"
    ),
  serviceType: yup.string().required("Выберите тип услуги"),
  materialType: yup.string().required("Выберите тип материала"),
  message: yup
    .string()
    .notRequired()
    .max(500, "Сообщение не должно превышать 500 символов")
});

const serviceTypes = [
  { value: "cleaning", label: "Лазерная очистка металла" },
  { value: "rust_removal", label: "Удаление ржавчины" },
  { value: "paint_removal", label: "Удаление краски" },
  { value: "oxide_removal", label: "Удаление окислов" },
  { value: "preparation", label: "Подготовка поверхности к покраске" }
];

const materialTypes = [
  { value: "steel", label: "Сталь" },
  { value: "aluminum", label: "Алюминий" },
  { value: "copper", label: "Медь" },
  { value: "brass", label: "Латунь" },
  { value: "cast_iron", label: "Чугун" },
  { value: "other", label: "Другое" }
];

const steps = ["Контактная информация", "Тип услуги", "Детали заказа"];

const RequestForm: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [activeStep, setActiveStep] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const BASE_URL = process.env.REACT_APP_BASE_URL || 'http://localhost:5050';

  const formik = useFormik({
  initialValues: {
    name: "",
    email: "",
    phone: "",
    serviceType: "",
    materialType: "",
    message: ""
  },
  validationSchema: validationSchema,
  validateOnChange: true,
  validateOnBlur: true,
  onSubmit: () => {}
});

  const handleSubmit = async () => {
    try {
      
      const errors = await formik.validateForm();
      const errorsWithoutEmail = { ...errors };
      delete errorsWithoutEmail.email;
      if (Object.keys(errorsWithoutEmail).length > 0) return;

      setOpenSnackbar(false);
      formik.setSubmitting(true);
      
      

      await axios.post(`${BASE_URL}/api/tg`, formik.values);
      
      setCompleted(true);
      setOpenSnackbar(true);
      formik.resetForm();
    } catch (error) {
      console.error("Error submitting form:", error);
      setOpenSnackbar(true);
    } finally {
      formik.setSubmitting(false);
    }
  };

  const handleNext = () => {
    if (activeStep === 0) {
      formik.validateField("name");
      formik.validateField("phone");

      if (
        formik.errors.name ||
        formik.errors.phone ||
        !formik.values.name ||
        !formik.values.phone
      ) {
        formik.setTouched({ name: true, phone: true }, true);
        return;
      }
    } else if (activeStep === 1) {
      formik.validateField("serviceType");
      formik.validateField("materialType");

      if (
        formik.errors.serviceType ||
        formik.errors.materialType ||
        !formik.values.serviceType ||
        !formik.values.materialType
      ) {
        formik.setTouched({ serviceType: true, materialType: true }, true);
        return;
      }
    }

    setActiveStep(prev => prev + 1);
  };

  const handleBack = () => setActiveStep(prev => prev - 1);

  const handleReset = () => {
    setActiveStep(0);
    setCompleted(false);
    setOpenSnackbar(false);
    formik.resetForm();
  };

  const isStepValid = (step: number) => {
    if (step === 0) {
      return !!(formik.values.name && formik.values.phone && !formik.errors.name && !formik.errors.phone);
    } else if (step === 1) {
      return !!(formik.values.serviceType && formik.values.materialType && 
               !formik.errors.serviceType && !formik.errors.materialType);
    }
    return true; // Для последнего шага валидация не блокирует кнопку
  };

  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Fade in={activeStep === 0} timeout={500}>
            <Stack spacing={3}>
              <TextField
                fullWidth
                id="name"
                name="name"
                label="Ваше имя*"
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.name && Boolean(formik.errors.name)}
                helperText={formik.touched.name && formik.errors.name}
                variant="outlined"
                InputProps={{
                  startAdornment: <InputAdornment position="start"><PersonIcon color="primary" /></InputAdornment>
                }}
              />
              <TextField
                fullWidth
                id="email"
                name="email"
                label="Email"
                type="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email}
                variant="outlined"
                InputProps={{
                  startAdornment: <InputAdornment position="start"><EmailIcon color="primary" /></InputAdornment>
                }}
              />
              <TextField
                fullWidth
                id="phone"
                name="phone"
                label="Телефон*"
                placeholder="+375 (__) ___-__-__"
                value={formik.values.phone}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.phone && Boolean(formik.errors.phone)}
                helperText={formik.touched.phone && formik.errors.phone}
                variant="outlined"
                InputProps={{
                  startAdornment: <InputAdornment position="start"><PhoneIcon color="primary" /></InputAdornment>
                }}
              />
            </Stack>
          </Fade>
        );
      case 1:
        return (
          <Fade in={activeStep === 1} timeout={500}>
            <Stack spacing={3}>
              <TextField
                fullWidth
                id="serviceType"
                name="serviceType"
                select
                label="Тип услуги"
                value={formik.values.serviceType}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.serviceType && Boolean(formik.errors.serviceType)}
                helperText={formik.touched.serviceType && formik.errors.serviceType}
                variant="outlined"
                InputProps={{
                  startAdornment: <InputAdornment position="start"><BuildIcon color="primary" /></InputAdornment>
                }}
              >
                {serviceTypes.map((option) => (
                  <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
                ))}
              </TextField>
              <TextField
                fullWidth
                id="materialType"
                name="materialType"
                select
                label="Тип материала"
                value={formik.values.materialType}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.materialType && Boolean(formik.errors.materialType)}
                helperText={formik.touched.materialType && formik.errors.materialType}
                variant="outlined"
                InputProps={{
                  startAdornment: <InputAdornment position="start"><CategoryIcon color="primary" /></InputAdornment>
                }}
              >
                {materialTypes.map((option) => (
                  <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
                ))}
              </TextField>
            </Stack>
          </Fade>
        );
      case 2:
        return (
          <Fade in={activeStep === 2} timeout={500}>
            <Stack spacing={3}>
              <TextField
                fullWidth
                id="message"
                name="message"
                label="Описание"
                multiline
                rows={5}
                value={formik.values.message}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.message && Boolean(formik.errors.message)}
                helperText={
                  (formik.touched.message && formik.errors.message) || 
                  `${formik.values.message.length}/500 символов`
                }
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start" sx={{ alignSelf: "flex-start", mt: 1.5 }}>
                      <DescriptionIcon color="primary" />
                    </InputAdornment>
                  )
                }}
              />

              <Box sx={{ mt: 2, p: 2, bgcolor: "primary.light", borderRadius: 2, color: "white" }}>
                <Typography variant="subtitle2" sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                  <CheckCircleIcon fontSize="small" />
                  Сводка заявки:
                </Typography>
                <Typography variant="body2" sx={{ mb: 0.5 }}><strong>Имя:</strong> {formik.values.name}</Typography>
                <Typography variant="body2" sx={{ mb: 0.5 }}><strong>Телефон:</strong> {formik.values.phone}</Typography>
                <Typography variant="body2" sx={{ mb: 0.5 }}>
                  <strong>Услуга:</strong> {serviceTypes.find(s => s.value === formik.values.serviceType)?.label || "-"}
                </Typography>
                <Typography variant="body2">
                  <strong>Материал:</strong> {materialTypes.find(m => m.value === formik.values.materialType)?.label || "-"}
                </Typography>
              </Box>
            </Stack>
          </Fade>
        );
      default:
        return "Неизвестный шаг";
    }
  };

  if (completed) {
    return (
      <GradientCard>
        <CardContent sx={{ p: 4 }}>
          <Zoom in={completed}>
            <Box sx={{ textAlign: "center", py: 4 }}>
              <Avatar sx={{ m: "auto", bgcolor: "success.main", width: 80, height: 80, mb: 3, boxShadow: 4 }}>
                <CheckCircleIcon fontSize="large" />
              </Avatar>
              <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, color: "success.main" }}>
                Заявка отправлена!
              </Typography>
              <Typography variant="body1" color="text.secondary" paragraph sx={{ maxWidth: 450, mx: "auto", mb: 4 }}>
                Спасибо за обращение! Наш специалист свяжется с вами в ближайшее время.
              </Typography>
              <Button
                variant="contained"
                onClick={handleReset}
                sx={{ mt: 2, px: 4, py: 1.5, borderRadius: 30, fontWeight: 600, textTransform: "none" }}
              >
                Заполнить новую заявку
              </Button>
            </Box>
          </Zoom>
        </CardContent>
      </GradientCard>
    );
  }

  return (
    <GradientCard>
      <CardContent sx={{ p: { xs: 2, sm: 4 } }}>
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mb: 4 }}>
          <Avatar sx={{
            bgcolor: theme.palette.primary.main,
            width: 70, height: 70, mb: 3,
            boxShadow: theme.shadows[5],
            transition: "all 0.3s ease",
            "&:hover": { transform: "rotate(10deg) scale(1.05)" }
          }}>
            <SendIcon fontSize="large" />
          </Avatar>
          <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ fontWeight: 700 }}>
            Оставить заявку
          </Typography>
          <Typography variant="body1" color="text.secondary" align="center" sx={{ maxWidth: 600, mb: 3 }}>
            Заполните форму, и наш специалист свяжется с вами в ближайшее время
          </Typography>

          <Stepper activeStep={activeStep} alternativeLabel sx={{
            width: "100%", mb: 4,
            "& .MuiStepLabel-root": { transition: "all 0.3s ease" },
            "& .Mui-active": { transform: "scale(1.1)" }
          }}>
            {steps.map((label) => (
              <Step key={label}><StepLabel>{label}</StepLabel></Step>
            ))}
          </Stepper>
        </Box>

        <Box> {/* Убрали component="form" и onSubmit */}
          {getStepContent(activeStep)}

          <Divider sx={{ my: 4 }} />

          <Stack direction="row" spacing={2} justifyContent="space-between" alignItems="center" sx={{ mt: 3 }}>
            <Button
              color="inherit"
              variant="outlined"
              disabled={activeStep === 0}
              onClick={handleBack}
              startIcon={<ArrowBackIcon />}
              sx={{ visibility: activeStep === 0 ? "hidden" : "visible" }}
            >
              Назад
            </Button>

            <Box>
              {activeStep === steps.length - 1 ? (
                <StepperButton
                  type="button" // Изменили на type="button"
                  variant="contained"
                  color="primary"
                  size="large"
                  disabled={formik.isSubmitting || !isStepValid(activeStep)}
                  onClick={handleSubmit} // Добавили явный обработчик
                  startIcon={
                    formik.isSubmitting ? (
                      <CircularProgress size={20} color="inherit" />
                    ) : (
                      <SendIcon />
                    )
                  }
                  sx={{
                    minWidth: 200,
                    backgroundImage: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`
                  }}
                >
                  {formik.isSubmitting ? "Отправка..." : "Отправить заявку"}
                </StepperButton>
              ) : (
                <StepperButton
                  type="button"
                  variant="contained"
                  color="primary"
                  onClick={handleNext}
                  endIcon={<ArrowForwardIcon />}
                  disabled={!isStepValid(activeStep)}
                >
                  Продолжить
                </StepperButton>
              )}
            </Box>
          </Stack>
        </Box>
      </CardContent>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={() => setOpenSnackbar(false)} severity={completed ? "success" : "error"} sx={{ width: "100%" }}>
          {completed
            ? "Ваша заявка успешно отправлена!"
            : "Произошла ошибка при отправке заявки. Пожалуйста, попробуйте еще раз."}
        </Alert>
      </Snackbar>
    </GradientCard>
  );
};

export default RequestForm;