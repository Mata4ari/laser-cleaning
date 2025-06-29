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
  Zoom,
  Divider,
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
  CheckCircle as CheckCircleIcon
} from "@mui/icons-material";
import axios from "axios";

const StepperButton = styled(Button)(({ theme }) => ({
  borderRadius: 24,
  padding: theme.spacing(1, 2),
  fontWeight: 600,
  transition: "all 0.2s ease",
  textTransform: "none",
  fontSize: "0.875rem",
  "&:hover": {
    transform: "scale(1.02)",
    boxShadow: theme.shadows[2]
  },
  [theme.breakpoints.up("sm")]: {
    padding: theme.spacing(1, 3),
    fontSize: "1rem",
    "&:hover": {
      transform: "scale(1.05)",
      boxShadow: theme.shadows[4]
    }
  }
}));

const GradientCard = styled(Card)(({ theme }) => ({
  background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.grey[50]} 100%)`,
  borderRadius: theme.shape.borderRadius * 3,
  overflow: "hidden",
  boxShadow: `0 10px 40px -10px ${theme.palette.primary.main}30`,
  maxWidth: 800,
  margin: "0 auto",
  position: "relative",
  "&:before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "4px",
    background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`
  },
  "&:hover": {
    transform: "translateY(-3px)",
    boxShadow: `0 15px 50px -12px ${theme.palette.primary.main}40`
  }
}));

const validationSchema = yup.object({
  name: yup.string().required("Обязательное поле").min(2, "Минимум 2 символа"),
  email: yup.string().email("Некорректный email"),
  phone: yup
    .string()
    .required("Обязательное поле")
    .matches(
      /^(\+375)[\s-]?\(?\d{2}\)?[\s-]?\d{3}[\s-]?\d{2}[\s-]?\d{2}$/,
      "Формат: +375 (XX) XXX-XX-XX"
    ),
  serviceType: yup.string().required("Выберите тип услуги"),
  materialType: yup.string().required("Выберите тип материала"),
  message: yup.string().max(500, "Максимум 500 символов")
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

const steps = ["Контактные данные", "Тип услуги", "Детали"];

const RequestForm: React.FC = () => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [activeStep, setActiveStep] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:5050";

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
    onSubmit: async (values) => {
      try {
        setOpenSnackbar(false);
        await axios.post(`${BASE_URL}/api/tg`, values);
        setCompleted(true);
        setOpenSnackbar(true);
        formik.resetForm();
      } catch (error) {
        console.error("Error submitting form:", error);
        setOpenSnackbar(true);
      }
    }
  });

  const handleSubmit = async () => {
    try {
      const errors = await formik.validateForm();
      const errorsWithoutEmail = { ...errors };
      delete errorsWithoutEmail.email;
      if (Object.keys(errorsWithoutEmail).length > 0) return;
      formik.handleSubmit();
    } catch (error) {
      console.error("Error in handleSubmit:", error);
    }
  };

  const handleNext = () => {
    if (activeStep === 0) {
      formik.validateField("name");
      formik.validateField("phone");

      if (
        !formik.values.name ||
        !formik.values.phone ||
        formik.errors.name ||
        formik.errors.phone
      ) {
        formik.setTouched(
          {
            name: true,
            phone: true,
            email: true
          },
          false
        );
        return;
      }
    } else if (activeStep === 1) {
      formik.validateField("serviceType");
      formik.validateField("materialType");

      if (
        !formik.values.serviceType ||
        !formik.values.materialType ||
        formik.errors.serviceType ||
        formik.errors.materialType
      ) {
        formik.setTouched(
          {
            serviceType: true,
            materialType: true
          },
          false
        );
        return;
      }
    }

    setActiveStep((prev) => prev + 1);
  };

  const StepCounter = ({
    activeStep,
    totalSteps
  }: {
    activeStep: number;
    totalSteps: number;
  }) => (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      sx={{ mb: 2 }}
    >
      Шаг {activeStep + 1} из {totalSteps}
    </Typography>
  );

  const handleBack = () => setActiveStep((prev) => prev - 1);
  const handleReset = () => {
    setActiveStep(0);
    setCompleted(false);
    setOpenSnackbar(false);
    formik.resetForm();
  };

  const isStepValid = (step: number) => {
    if (step === 0) {
      return !!(
        formik.values.name &&
        formik.values.phone &&
        !formik.errors.name &&
        !formik.errors.phone
      );
    } else if (step === 1) {
      return !!(
        formik.values.serviceType &&
        formik.values.materialType &&
        !formik.errors.serviceType &&
        !formik.errors.materialType
      );
    }
    return true;
  };

  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Stack
            sx={{ mr: isSmallScreen ? -5 : 0, ml: isSmallScreen ? -5 : 0 }}
            spacing={isSmallScreen ? 2 : 2}
          >
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
              size={isSmallScreen ? "medium" : "small"}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonIcon color="primary" fontSize="small" />
                  </InputAdornment>
                ),
                style: {
                  fontSize: isSmallScreen ? "1rem" : "0.9rem",
                  padding: isSmallScreen ? "12px 14px" : "8px 14px"
                }
              }}
              InputLabelProps={{
                style: {
                  fontSize: isSmallScreen ? "1rem" : "0.9rem"
                }
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
              size={isSmallScreen ? "medium" : "small"}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon color="primary" fontSize="small" />
                  </InputAdornment>
                ),
                style: {
                  fontSize: isSmallScreen ? "1rem" : "0.9rem",
                  padding: isSmallScreen ? "12px 14px" : "8px 14px"
                }
              }}
              InputLabelProps={{
                style: {
                  fontSize: isSmallScreen ? "1rem" : "0.9rem"
                }
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
              size={isSmallScreen ? "medium" : "small"}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PhoneIcon color="primary" fontSize="small" />
                  </InputAdornment>
                ),
                style: {
                  fontSize: isSmallScreen ? "1rem" : "0.9rem",
                  padding: isSmallScreen ? "12px 14px" : "8px 14px"
                }
              }}
              InputLabelProps={{
                style: {
                  fontSize: isSmallScreen ? "1rem" : "0.9rem"
                }
              }}
            />
          </Stack>
        );
      case 1:
        return (
          <Stack
            sx={{ mr: isSmallScreen ? -5 : 0, ml: isSmallScreen ? -5 : 0 }}
            spacing={isSmallScreen ? 3 : 2}
          >
            <TextField
              fullWidth
              id="serviceType"
              name="serviceType"
              select
              label="Тип услуги*"
              value={formik.values.serviceType}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.serviceType && Boolean(formik.errors.serviceType)
              }
              helperText={
                formik.touched.serviceType && formik.errors.serviceType
              }
              variant="outlined"
              size={isSmallScreen ? "medium" : "small"}
              SelectProps={{
                MenuProps: {
                  PaperProps: {
                    style: {
                      maxHeight: 300,
                      
                    }
                  }
                }
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <BuildIcon color="primary" fontSize="small" />
                  </InputAdornment>
                ),
                style: {
                  fontSize: isSmallScreen ? "1rem" : "0.9rem",
                  padding: isSmallScreen ? "12px 14px" : "8px 14px"
                }
              }}
              InputLabelProps={{
                style: {
                  fontSize: isSmallScreen ? "1rem" : "0.9rem"
                }
              }}
            >
              {serviceTypes.map((option) => (
                <MenuItem
                  key={option.value}
                  value={option.value}
                  sx={{ fontSize: isSmallScreen ? "1rem" : "0.875rem" }}
                >
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              fullWidth
              id="materialType"
              name="materialType"
              select
              label="Тип материала*"
              value={formik.values.materialType}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.materialType &&
                Boolean(formik.errors.materialType)
              }
              helperText={
                formik.touched.materialType && formik.errors.materialType
              }
              variant="outlined"
              size={isSmallScreen ? "medium" : "small"}
              SelectProps={{
                MenuProps: {
                  PaperProps: {
                    style: {
                      maxHeight: 300
                    }
                  }
                }
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <CategoryIcon color="primary" fontSize="small" />
                  </InputAdornment>
                ),
                style: {
                  fontSize: isSmallScreen ? "1rem" : "0.9rem",
                  padding: isSmallScreen ? "12px 14px" : "8px 14px"
                }
              }}
              InputLabelProps={{
                style: {
                  fontSize: isSmallScreen ? "1rem" : "0.9rem"
                }
              }}
            >
              {materialTypes.map((option) => (
                <MenuItem
                  key={option.value}
                  value={option.value}
                  sx={{ fontSize: isSmallScreen ? "1rem" : "0.875rem" }}
                >
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </Stack>
        );
      case 2:
        return (
          <Stack
            sx={{ mr: isSmallScreen ? -5 : 0, ml: isSmallScreen ? -5 : 0 }}
            spacing={isSmallScreen ? 3 : 2}
          >
            <TextField
              fullWidth
              id="message"
              name="message"
              label="Описание"
              multiline
              rows={isSmallScreen ? 4 : 3}
              value={formik.values.message}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.message && Boolean(formik.errors.message)}
              helperText={
                (formik.touched.message && formik.errors.message) ||
                `${formik.values.message.length}/500 символов`
              }
              variant="outlined"
              size={isSmallScreen ? "medium" : "small"}
              InputProps={{
                startAdornment: (
                  <InputAdornment
                    position="start"
                    sx={{ alignSelf: "flex-start", mt: 1 }}
                  >
                    <DescriptionIcon color="primary" fontSize="small" />
                  </InputAdornment>
                ),
                style: {
                  fontSize: isSmallScreen ? "1rem" : "0.9rem"
                }
              }}
              InputLabelProps={{
                style: {
                  fontSize: isSmallScreen ? "1rem" : "0.9rem"
                }
              }}
            />

            <Box
              sx={{
                mt: 1,
                p: 1.5,
                bgcolor: "primary.light",
                borderRadius: 2,
                color: "white",
                fontSize: isSmallScreen ? "0.95rem" : "0.875rem"
              }}
            >
              <Typography
                variant="subtitle2"
                sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}
              >
                <CheckCircleIcon fontSize="small" />
                Сводка заявки:
              </Typography>
              <Typography variant="body2" sx={{ mb: 0.5 }}>
                <strong>Имя:</strong> {formik.values.name}
              </Typography>
              <Typography variant="body2" sx={{ mb: 0.5 }}>
                <strong>Телефон:</strong> {formik.values.phone}
              </Typography>
              <Typography variant="body2" sx={{ mb: 0.5 }}>
                <strong>Услуга:</strong>{" "}
                {serviceTypes.find((s) => s.value === formik.values.serviceType)
                  ?.label || "-"}
              </Typography>
              <Typography variant="body2">
                <strong>Материал:</strong>{" "}
                {materialTypes.find(
                  (m) => m.value === formik.values.materialType
                )?.label || "-"}
              </Typography>
            </Box>
          </Stack>
        );
      default:
        return "Неизвестный шаг";
    }
  };

  const renderFormContent = () => (
    <>
      {!isSmallScreen && (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            mb: 3
          }}
        >
          <Avatar
            sx={{
              bgcolor: theme.palette.primary.main,
              width: 60,
              height: 60,
              mb: 2,
              boxShadow: theme.shadows[3],
              transition: "all 0.2s ease",
              "&:hover": { transform: "rotate(8deg) scale(1.05)" }
            }}
          >
            <SendIcon fontSize="large" />
          </Avatar>
          <Typography
            variant="h5"
            component="h1"
            gutterBottom
            align="center"
            sx={{ fontWeight: 700 }}
          >
            Оставить заявку
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            align="center"
            sx={{
              maxWidth: 500,
              mb: 2
            }}
          >
            Заполните форму, и наш специалист свяжется с вами в ближайшее время
          </Typography>
        </Box>
      )}

      {isSmallScreen ? (
        <Box>
          <Typography
            variant="h5"
            component="h1"
            align="center"
            sx={{ fontWeight: 700, mt: -8, mr: -5, ml: -5 }}
          >
            Оставить заявку
          </Typography>
          <StepCounter activeStep={activeStep} totalSteps={steps.length} />
          <Typography
            variant="h6"
            sx={{
              mb: 2,
              textAlign: "center",
              color: "primary.main",
              fontWeight: 600,
              mr: -5,
              ml: -5
            }}
          >
            {steps[activeStep]}
          </Typography>
        </Box>
      ) : (
        <Stepper
          activeStep={activeStep}
          alternativeLabel
          sx={{
            width: "100%",
            mb: 3,
            "& .MuiStepLabel-root": {
              padding: 0,
              "& .MuiStepLabel-label": {
                fontSize: "0.8rem",
                marginTop: "4px"
              }
            }
          }}
        >
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      )}

      {getStepContent(activeStep)}

      <Divider sx={{ my: isSmallScreen ? 1 : 3 }} />

      {isSmallScreen ? (
        <Stack spacing={1.5} sx={{ mt: 2 }}>
          {activeStep === steps.length - 1 ? (
            <StepperButton
              fullWidth
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              disabled={formik.isSubmitting || !isStepValid(activeStep)}
              startIcon={
                formik.isSubmitting ? (
                  <CircularProgress size={18} color="inherit" />
                ) : (
                  <SendIcon fontSize="small" />
                )
              }
              sx={{
                py: 1.5,
                backgroundImage: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`
              }}
            >
              {formik.isSubmitting ? "Отправка..." : "Отправить заявку"}
            </StepperButton>
          ) : (
            <StepperButton
              fullWidth
              variant="contained"
              color="primary"
              onClick={handleNext}
              disabled={!isStepValid(activeStep)}
              endIcon={<ArrowForwardIcon fontSize="small" />}
              sx={{ py: 1.5 }}
            >
              Далее
            </StepperButton>
          )}

          {activeStep !== 0 && (
            <Button
              fullWidth
              color="inherit"
              variant="outlined"
              onClick={handleBack}
              startIcon={<ArrowBackIcon fontSize="small" />}
              sx={{ py: 1.2 }}
            >
              Назад
            </Button>
          )}
        </Stack>
      ) : (
        <Stack
          direction="row"
          spacing={2}
          justifyContent="space-between"
          alignItems="center"
          sx={{ mt: 2 }}
        >
          <Button
            color="inherit"
            variant="outlined"
            disabled={activeStep === 0}
            onClick={handleBack}
            startIcon={<ArrowBackIcon fontSize="small" />}
            size="medium"
            sx={{ visibility: activeStep === 0 ? "hidden" : "visible" }}
          >
            Назад
          </Button>

          {activeStep === steps.length - 1 ? (
            <StepperButton
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              disabled={formik.isSubmitting || !isStepValid(activeStep)}
              startIcon={
                formik.isSubmitting ? (
                  <CircularProgress size={18} color="inherit" />
                ) : (
                  <SendIcon fontSize="small" />
                )
              }
              sx={{
                minWidth: 180,
                backgroundImage: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`
              }}
            >
              {formik.isSubmitting ? "Отправка..." : "Отправить заявку"}
            </StepperButton>
          ) : (
            <StepperButton
              variant="contained"
              color="primary"
              onClick={handleNext}
              disabled={!isStepValid(activeStep)}
              endIcon={<ArrowForwardIcon fontSize="small" />}
              sx={{ minWidth: 150 }}
            >
              Далее
            </StepperButton>
          )}
        </Stack>
      )}
    </>
  );

  const renderSuccessContent = () => (
    <Zoom in={completed}>
      <Box sx={{ textAlign: "center", py: isSmallScreen ? 3 : 3 }}>
        <Avatar
          sx={{
            m: "auto",
            bgcolor: "success.main",
            width: isSmallScreen ? 64 : 70,
            height: isSmallScreen ? 64 : 70,
            mb: 3,
            boxShadow: 3
          }}
        >
          <CheckCircleIcon fontSize={isSmallScreen ? "large" : "large"} />
        </Avatar>
        <Typography
          variant={isSmallScreen ? "h5" : "h5"}
          gutterBottom
          sx={{ fontWeight: 700, color: "success.main" }}
        >
          Заявка отправлена!
        </Typography>
        <Typography
          variant="body1"
          color="text.secondary"
          paragraph
          sx={{
            maxWidth: 400,
            mx: "auto",
            mb: 3,
            fontSize: isSmallScreen ? "1rem" : "1rem"
          }}
        >
          Спасибо за обращение! Наш специалист свяжется с вами в ближайшее
          время.
        </Typography>
        <Button
          variant="contained"
          onClick={handleReset}
          size={isSmallScreen ? "large" : "medium"}
          sx={{
            borderRadius: 24,
            px: 4,
            py: 1,
            fontWeight: 600,
            textTransform: "none"
          }}
        >
          Новая заявка
        </Button>
      </Box>
    </Zoom>
  );

  if (completed) {
    return isSmallScreen ? (
      <Box sx={{ p: 2 }}>{renderSuccessContent()}</Box>
    ) : (
      <GradientCard>
        <CardContent sx={{ p: 3 }}>{renderSuccessContent()}</CardContent>
      </GradientCard>
    );
  }

  return isSmallScreen ? (
    <Box sx={{ p: 2 }}>{renderFormContent()}</Box>
  ) : (
    <GradientCard>
      <CardContent sx={{ p: 2 }}>{renderFormContent()}</CardContent>
    </GradientCard>
  );
};

export default RequestForm;
