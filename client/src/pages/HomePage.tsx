import React, { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Container,
  Paper,
  useTheme,
  useMediaQuery,
  Fade,
  Zoom,
  Fab,
  Chip,
  Stack,
  alpha,
  useScrollTrigger,
  Avatar,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from "@mui/material";
import { styled } from "@mui/material/styles";
import {
  EmojiNature,
  CleaningServices,
  Speed,
  MilitaryTech,
  ContactMail,
  ArrowForward,
  SettingsSuggest,
  Lightbulb,
  Visibility,
  KeyboardArrowUp,
  ArrowDownward,
  CheckCircle,
  ExpandMore,
  Engineering,
  SafetyCheck,
  PrecisionManufacturing,
  SupportAgent,
  LocalShipping,
  Payment,
  VerifiedUser
} from "@mui/icons-material";
import { motion } from "framer-motion";
import PortfolioSlider from "../components/portfolio/PortfolioSlider";
import RequestForm from "../components/forms/RequestForm";

const FullWidthSection = styled(Box)({
  width: "100%",
  overflow: "hidden"
});

const HeroSection = styled(FullWidthSection)(({ theme }) => ({
  position: "relative",
  color: theme.palette.common.white,
  minHeight: "100vh",
  display: "flex",
  alignItems: "center",
  backgroundSize: "cover",
  backgroundPosition: "center",
  "&::after": {
    content: '""',
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "150px",
    background: `linear-gradient(to bottom, transparent 0%, ${theme.palette.background.default} 100%)`,
    zIndex: 1
  }
}));

const FeatureCard = styled(Card)(({ theme }) => ({
  width: "100%",
  height: "100%",
  display: "flex",
  flexDirection: "column",
  transition: "all 0.3s ease",
  borderRadius: theme.shape.borderRadius * 2,
  "&:hover": {
    transform: "translateY(-8px)",
    boxShadow: theme.shadows[10],
    "& .MuiAvatar-root": {
      transform: "scale(1.1)",
      boxShadow: theme.shadows[4]
    }
  }
}));

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  transition: "all 0.3s ease",
  width: 80,
  height: 80,
  marginBottom: theme.spacing(3),
  marginLeft: "auto",
  marginRight: "auto",
  backgroundColor: alpha(theme.palette.primary.main, 0.1),
  color: theme.palette.primary.main
}));

const ScrollDownButton = styled(Fab)(({ theme }) => ({
  position: "absolute",
  bottom: theme.spacing(4),
  left: "50%",
  transform: "translateX(-50%)",
  zIndex: 2,
  animation: "bounce 2s infinite",
  "@keyframes bounce": {
    "0%, 20%, 50%, 80%, 100%": {
      transform: "translateY(0) translateX(-50%)"
    },
    "40%": {
      transform: "translateY(-20px) translateX(-50%)"
    },
    "60%": {
      transform: "translateY(-10px) translateX(-50%)"
    }
  }
}));

// Константы данных
const features = [
  {
    title: "Быстро и эффективно",
    description:
      "В 10 раз быстрее механической очистки. Наша технология позволяет обрабатывать до 5 м² поверхности в час.",
    icon: <Speed fontSize="large" />,
    details: [
      "Скорость обработки до 5 м²/час",
      "Минимальное время простоя оборудования",
      "Быстрая подготовка поверхности"
    ]
  },
  {
    title: "Экологично",
    description:
      "Без химии, без вредных выбросов. Полностью безопасный для окружающей среды процесс очистки.",
    icon: <EmojiNature fontSize="large" />,
    details: [
      "Отсутствие химических отходов",
      "Не требует утилизации расходников",
      "Соответствует экологическим стандартам"
    ]
  },
  {
    title: "Точная обработка",
    description:
      "До микрона точность. Возможность очистки сложных рельефных поверхностей без повреждений.",
    icon: <CleaningServices fontSize="large" />,
    details: [
      "Точность до 10 микрон",
      "Очистка труднодоступных мест",
      "Сохранение геометрии детали"
    ]
  },
  {
    title: "Премиум-качество",
    description:
      "Без повреждения структуры металла. Идеальная подготовка поверхности под дальнейшую обработку.",
    icon: <MilitaryTech fontSize="large" />,
    details: [
      "Не изменяет свойства металла",
      "Идеальная адгезия для покрытий",
      "Увеличение срока службы изделий"
    ]
  }
];

const howItWorks = [
  {
    title: "Подготовка поверхности",
    description:
      "Очистка поверхности от крупных загрязнений и предварительная диагностика состояния материала.",
    icon: <SettingsSuggest fontSize="large" />,
    steps: [
      "Визуальный осмотр",
      "Удаление крупных загрязнений",
      "Определение параметров обработки"
    ]
  },
  {
    title: "Лазерная обработка",
    description:
      "Воздействие лазерным лучом для удаления загрязнений с точным контролем параметров.",
    icon: <Lightbulb fontSize="large" />,
    steps: [
      "Настройка мощности лазера",
      "Автоматизированная обработка",
      "Контроль температуры"
    ]
  },
  {
    title: "Контроль качества",
    description:
      "Проверка результата очистки и подготовка отчета о выполненной работе.",
    icon: <Visibility fontSize="large" />,
    steps: [
      "Визуальная проверка",
      "Измерительный контроль",
      "Фотофиксация результата"
    ]
  }
];

const applications = [
  {
    title: "Промышленное оборудование",
    description: "Очистка от ржавчины, окалины и старых покрытий",
    icon: <Engineering />
  },
  {
    title: "Автомобильные детали",
    description: "Подготовка поверхностей перед покраской",
    icon: <LocalShipping />
  },
  {
    title: "Исторические артефакты",
    description: "Бережная реставрация металлических предметов",
    icon: <SafetyCheck />
  },
  {
    title: "Авиационные компоненты",
    description: "Очистка без изменения механических свойств",
    icon: <PrecisionManufacturing />
  }
];

const faqs = [
  {
    question: "Какие поверхности можно очищать?",
    answer:
      "Мы работаем с черными и цветными металлами, включая сталь, алюминий, медь и их сплавы. Также возможна обработка камня и некоторых видов пластика."
  },
  {
    question: "Какова стоимость услуги?",
    answer:
      "Стоимость зависит от площади обработки, степени загрязнения и типа материала. Минимальный заказ - 5000 руб. Точную стоимость мы сможем назвать после осмотра изделия."
  },
  {
    question: "Какие гарантии вы предоставляете?",
    answer:
      "Мы гарантируем полное удаление указанных загрязнений без повреждения основного материала. На все работы предоставляется гарантия 1 год."
  },
  {
    question: "Можно ли обрабатывать крупногабаритные изделия?",
    answer:
      "Да, мы имеем оборудование для обработки изделий до 5 метров в длину и 3 тонн весом. Для особо крупных объектов возможен выезд на место."
  }
];

const advantages = [
  {
    title: "Опытные специалисты",
    description: "Наши инженеры имеют более 10 лет опыта в лазерной очистке",
    icon: <SupportAgent />
  },
  {
    title: "Собственное оборудование",
    description:
      "Используем профессиональные лазерные установки последнего поколения",
    icon: <PrecisionManufacturing />
  },
  {
    title: "Гибкая система оплаты",
    description: "Возможна оплата по безналу, наличными и в рассрочку",
    icon: <Payment />
  },
  {
    title: "Гарантия качества",
    description:
      "Все работы выполняются по договору с гарантийными обязательствами",
    icon: <VerifiedUser />
  }
];

function ScrollTop(props: { children: React.ReactElement }) {
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 100
  });

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const anchor = (
      (event.target as HTMLDivElement).ownerDocument || document
    ).querySelector("#back-to-top-anchor");

    if (anchor) {
      anchor.scrollIntoView({
        behavior: "smooth",
        block: "center"
      });
    }
  };

  return (
    <Zoom in={trigger}>
      <Box
        onClick={handleClick}
        role="presentation"
        sx={{ position: "fixed", bottom: 16, right: 16, zIndex: 1000 }}
      >
        {props.children}
      </Box>
    </Zoom>
  );
}

const HomePage: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [backgroundImage, setBackgroundImage] = useState("/images/hero-bg.jpg");
  const [expanded, setExpanded] = useState<string | false>(false);

  const handleSlideChange = (imageUrl: string) => {
    setBackgroundImage(imageUrl);
  };

  const handleScrollDown = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: "smooth"
    });
  };

  const handleAccordionChange =
    (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
    };

  return (
    <Box
      sx={{
        position: "relative",
        bgcolor: "background.default",
        width: "100%"
      }}
    >
      <Box id="back-to-top-anchor" sx={{ width: "100vw" }} />

      {/* Герой секция */}
      <HeroSection style={{ backgroundImage: `url(${backgroundImage})` }}>
        <Container
          maxWidth="lg"
          sx={{
            position: "relative",
            zIndex: 2,
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            alignItems: "center",
            gap: 6,
            py: 15
          }}
        >
          <Box sx={{ flex: 1 }}>
            <Fade in timeout={1000}>
              <Box>
                <Typography
                  variant={isMobile ? "h3" : "h2"}
                  sx={{
                    fontWeight: 800,
                    lineHeight: 1.2,
                    mb: 3,
                    color: "common.white"
                  }}
                >
                  Профессиональная лазерная очистка металла
                </Typography>
                <Typography
                  variant={isMobile ? "h6" : "h5"}
                  sx={{
                    my: 3,
                    color: alpha(theme.palette.common.white, 0.9)
                  }}
                >
                  Современная технология очистки без повреждений основы. Более
                  500 успешных проектов.
                </Typography>
                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  spacing={2}
                  sx={{ mt: 4 }}
                >
                  <Button
                    component={RouterLink}
                    to="/request"
                    variant="contained"
                    color="secondary"
                    size="large"
                    endIcon={<ContactMail />}
                    sx={{
                      px: 4,
                      py: 1.5,
                      borderRadius: 2,
                      fontWeight: 600
                    }}
                  >
                    Оставить заявку
                  </Button>
                  <Button
                    component={RouterLink}
                    to="/services"
                    variant="outlined"
                    size="large"
                    color="inherit"
                    endIcon={<ArrowForward />}
                    sx={{
                      px: 4,
                      py: 1.5,
                      borderRadius: 2,
                      fontWeight: 600,
                      borderWidth: 2,
                      color: "common.white",
                      "&:hover": {
                        borderWidth: 2,
                        bgcolor: alpha(theme.palette.common.white, 0.1)
                      }
                    }}
                  >
                    Узнать больше
                  </Button>
                </Stack>
              </Box>
            </Fade>
          </Box>

          <ScrollDownButton
            color="secondary"
            aria-label="scroll down"
            onClick={handleScrollDown}
          >
            <ArrowDownward />
          </ScrollDownButton>
        </Container>
      </HeroSection>

      {/* Преимущества */}
      <Container maxWidth="xl" sx={{ py: 10, width: "100%" }}>
        <Box textAlign="center" mb={8}>
          <Typography variant="h3" sx={{ fontWeight: 700, mb: 2 }} gutterBottom>
            Преимущества технологии
          </Typography>
          <Typography
            variant="subtitle1"
            color="text.secondary"
            maxWidth="md"
            mx="auto"
          >
            Гарантия качества и безопасности. Лазерная очистка - это современная
            альтернатива пескоструйной обработке.
          </Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: 4
          }}
        >
          {features.map((feature, index) => (
            <Box
              key={index}
              sx={{
                width: { xs: "100%", sm: "45%", md: "22%" },
                minWidth: { xs: "100%", sm: "45%", md: "22%" }
              }}
            >
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <FeatureCard elevation={4}>
                  <CardContent sx={{ textAlign: "center", px: 3, py: 4 }}>
                    <StyledAvatar>{feature.icon}</StyledAvatar>
                    <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
                      {feature.title}
                    </Typography>
                    <Typography
                      variant="body1"
                      color="text.secondary"
                      sx={{ mb: 2 }}
                    >
                      {feature.description}
                    </Typography>
                    <List dense>
                      {feature.details.map((detail, i) => (
                        <ListItem key={i} sx={{ py: 0 }}>
                          <ListItemIcon sx={{ minWidth: 32 }}>
                            <CheckCircle color="primary" fontSize="small" />
                          </ListItemIcon>
                          <ListItemText primary={detail} />
                        </ListItem>
                      ))}
                    </List>
                  </CardContent>
                </FeatureCard>
              </motion.div>
            </Box>
          ))}
        </Box>
      </Container>

      {/* Как это работает */}
      <Box py={10} sx={{ bgcolor: "background.paper", width: "100%" }}>
        <Container maxWidth="xl">
          <Box textAlign="center" mb={8}>
            <Typography variant="h3" sx={{ fontWeight: 700, mb: 2 }}>
              Как это работает
            </Typography>
            <Typography
              variant="subtitle1"
              color="text.secondary"
              maxWidth="md"
              mx="auto"
            >
              Процесс лазерной очистки состоит из трех основных этапов
            </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: 4
            }}
          >
            {howItWorks.map((step, index) => (
              <Box
                key={index}
                sx={{
                  width: { xs: "100%", sm: "45%", md: "30%" },
                  minWidth: { xs: "100%", sm: "45%", md: "30%" }
                }}
              >
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2, duration: 0.5 }}
                >
                  <FeatureCard elevation={4}>
                    <CardContent sx={{ textAlign: "center", px: 3, py: 4 }}>
                      <StyledAvatar>{step.icon}</StyledAvatar>
                      <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
                        {step.title}
                      </Typography>
                      <Typography
                        variant="body1"
                        color="text.secondary"
                        sx={{ mb: 2 }}
                      >
                        {step.description}
                      </Typography>
                      <List dense>
                        {step.steps.map((item, i) => (
                          <ListItem key={i} sx={{ py: 0 }}>
                            <ListItemIcon sx={{ minWidth: 32 }}>
                              <CheckCircle color="primary" fontSize="small" />
                            </ListItemIcon>
                            <ListItemText primary={item} />
                          </ListItem>
                        ))}
                      </List>
                    </CardContent>
                  </FeatureCard>
                </motion.div>
              </Box>
            ))}
          </Box>
        </Container>
      </Box>

      {/* Области применения */}
      <Container maxWidth="xl" sx={{ py: 10 }}>
        <Box textAlign="center" mb={8}>
          <Typography variant="h3" sx={{ fontWeight: 700, mb: 2 }}>
            Области применения
          </Typography>
          <Typography
            variant="subtitle1"
            color="text.secondary"
            maxWidth="md"
            mx="auto"
          >
            Наши услуги востребованы в различных отраслях промышленности
          </Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: 4
          }}
        >
          {applications.map((app, index) => (
            <Box
              key={index}
              sx={{
                width: { xs: "100%", sm: "45%", md: "22%" },
                minWidth: { xs: "100%", sm: "45%", md: "22%" }
              }}
            >
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <Card sx={{ height: "100%" }}>
                  <CardContent
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      textAlign: "center",
                      p: 3
                    }}
                  >
                    <Avatar
                      sx={{
                        bgcolor: alpha(theme.palette.primary.main, 0.1),
                        color: "primary.main",
                        width: 56,
                        height: 56,
                        mb: 2
                      }}
                    >
                      {app.icon}
                    </Avatar>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                      {app.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {app.description}
                    </Typography>
                  </CardContent>
                </Card>
              </motion.div>
            </Box>
          ))}
        </Box>
      </Container>

      {/* Наши преимущества */}
      <Box py={10} sx={{ bgcolor: "background.paper", width: "100%" }}>
        <Container maxWidth="xl">
          <Box textAlign="center" mb={8}>
            <Typography variant="h3" sx={{ fontWeight: 700, mb: 2 }}>
              Почему выбирают нас
            </Typography>
            <Typography
              variant="subtitle1"
              color="text.secondary"
              maxWidth="md"
              mx="auto"
            >
              Более 10 лет опыта в области лазерной очистки поверхностей
            </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: 4
            }}
          >
            {advantages.map((advantage, index) => (
              <Box
                key={index}
                sx={{
                  width: { xs: "100%", sm: "45%", md: "22%" },
                  minWidth: { xs: "100%", sm: "45%", md: "22%" }
                }}
              >
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 2,
                      p: 2
                    }}
                  >
                    <Avatar
                      sx={{
                        bgcolor: alpha(theme.palette.primary.main, 0.1),
                        color: "primary.main",
                        width: 48,
                        height: 48,
                        mt: 0.5
                      }}
                    >
                      {advantage.icon}
                    </Avatar>
                    <Box>
                      <Typography
                        variant="h6"
                        sx={{ fontWeight: 600, mb: 0.5 }}
                      >
                        {advantage.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {advantage.description}
                      </Typography>
                    </Box>
                  </Box>
                </motion.div>
              </Box>
            ))}
          </Box>
        </Container>
      </Box>

      {/* Частые вопросы */}
      <Container maxWidth="md" sx={{ py: 10 }}>
        <Box textAlign="center" mb={8}>
          <Typography variant="h3" sx={{ fontWeight: 700, mb: 2 }}>
            Частые вопросы
          </Typography>
          <Typography
            variant="subtitle1"
            color="text.secondary"
            maxWidth="md"
            mx="auto"
          >
            Ответы на наиболее распространенные вопросы наших клиентов
          </Typography>
        </Box>
        <Box>
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.3 }}
            >
              <Accordion
                expanded={expanded === `panel${index}`}
                onChange={handleAccordionChange(`panel${index}`)}
                elevation={2}
                sx={{ mb: 2, margin: 1 }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMore />}
                  aria-controls={`panel${index}bh-content`}
                  id={`panel${index}bh-header`}
                >
                  <Typography sx={{ fontWeight: 600 }}>
                    {faq.question}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography color="text.secondary">{faq.answer}</Typography>
                </AccordionDetails>
              </Accordion>
            </motion.div>
          ))}
        </Box>
      </Container>

      {/* Примеры работ */}
      <Box
        py={20}
        sx={{
          bgcolor: "background.default",
          width: "100%",
          position: "relative",
          overflow: "hidden"
        }}
      >
        <Container>
          <Box
            textAlign="center"
            mb={12}
            sx={{
              px: { xs: 2, md: 6 }
            }}
          >
            <Typography
              variant="h1"
              sx={{
                fontWeight: 900,
                mb: 4,
                fontSize: { xs: "2.5rem", sm: "3.5rem", md: "4.5rem" },
                lineHeight: 1.2
              }}
            >
              Наши работы
            </Typography>
            <Typography
              variant="h4"
              color="text.secondary"
              maxWidth="lg"
              mx="auto"
              sx={{
                fontSize: { xs: "1.25rem", md: "1.75rem" },
                lineHeight: 1.6,
                fontWeight: 400
              }}
            >
              Реальные примеры очистки поверхностей от коррозии и загрязнений.
              Более 500 успешных проектов.
            </Typography>
          </Box>

          <Box
            sx={{
              width: "100%",
              height: "80vh",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              position: "relative"
            }}
          >
            <PortfolioSlider onSlideChange={handleSlideChange} />
          </Box>
        </Container>
      </Box>

      {/* Форма заявки */}
      <Box py={10} sx={{ bgcolor: "background.paper", width: "100%" }}>
        <Container maxWidth="xl">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Paper
              elevation={6}
              sx={{
                borderRadius: 4,
                overflow: "hidden",
                maxWidth: 1200,
                mx: "auto",
                width: "100%"
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", md: "row" }
                }}
              >
                <Box
                  sx={{
                    width: { xs: "100%", md: "50%" },
                    bgcolor: "primary.main",
                    color: "common.white",
                    p: 6,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center"
                  }}
                >
                  <Typography variant="h3" sx={{ fontWeight: 700, mb: 3 }}>
                    Готовы начать проект?
                  </Typography>
                  <Typography variant="body1" paragraph sx={{ opacity: 0.9 }}>
                    Оставьте заявку, и мы свяжемся с вами в течение 1 часа для
                    консультации. Предоставим расчет стоимости и сроков
                    выполнения.
                  </Typography>
                  <Stack
                    direction="row"
                    spacing={2}
                    sx={{ mt: 3 }}
                    flexWrap="wrap"
                  >
                    <Chip
                      label="Бесплатная консультация"
                      color="secondary"
                      sx={{ fontWeight: 600, mb: 1 }}
                    />
                    <Chip
                      label="Ответ в течение 1 часа"
                      color="secondary"
                      sx={{ fontWeight: 600, mb: 1 }}
                    />
                  </Stack>
                </Box>
                <Box
                  sx={{
                    width: { xs: "100%", md: "50%" },
                    p: 6
                  }}
                >
                  <RequestForm />
                </Box>
              </Box>
            </Paper>
          </motion.div>
        </Container>
      </Box>

      <ScrollTop>
        <Fab color="primary" size="medium" aria-label="scroll back to top">
          <KeyboardArrowUp />
        </Fab>
      </ScrollTop>
    </Box>
  );
};

export default HomePage;
