import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  Box,
  Typography,
  Card,
  CardMedia,
  CardContent,
  IconButton,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
  CircularProgress,
  Container,
  useTheme,
  useMediaQuery
} from "@mui/material";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation, EffectCreative } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Swiper as SwiperType } from "swiper";
import { Delete, Edit, Add, Close } from "@mui/icons-material";
import { useDropzone } from "react-dropzone";
import {
  getPortfolioItems,
  createPortfolioItem,
  updatePortfolioItem,
  deletePortfolioItem,
  PortfolioItem
} from "../../services/portfolioService";

// Базовый URL для изображений
const API_BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:5050";

interface PortfolioSliderProps {
  onSlideChange?: (imageUrl: string) => void;
  isAdmin?: boolean;
  isMobile?: boolean;
}
interface EditingItem extends PortfolioItem {
  imageFile?: File;
}

const PortfolioSlider: React.FC<PortfolioSliderProps> = ({
  onSlideChange,
  isAdmin = false,
  isMobile = false
}) => {
  const theme = useTheme();
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const isDesktop = useMediaQuery(theme.breakpoints.up("lg"));

  const swiperRef = useRef<SwiperType | null>(null);
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [editingItem, setEditingItem] = useState<EditingItem | null>(null);
  const [swiperKey, setSwiperKey] = useState(0);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error"
  });

  // Функция для получения полного URL изображения
  const getFullImageUrl = (url: string) => {
    if (!url) return "";
    // Если URL уже абсолютный, возвращаем как есть
    if (
      url.startsWith("http://") ||
      url.startsWith("https://") ||
      url.startsWith("blob:")
    ) {
      return url;
    }
    // Иначе добавляем базовый URL
    return `${API_BASE_URL}${url.startsWith("/") ? url : `/${url}`}`;
  };

  useEffect(() => {
    const loadItems = async () => {
      try {
        setLoading(true);
        const items = await getPortfolioItems();
        setPortfolioItems(items);
      } catch (error) {
        showMessage("Ошибка загрузки работ", "error");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadItems();
  }, []);

  function debounce(func: (...args: any[]) => void, wait: number) {
    let timeout: NodeJS.Timeout;
    return (...args: any[]) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  }

  useEffect(() => {
    const handleResize = debounce(() => {
      setSwiperKey((prev) => prev + 1);
    }, 100);

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0 && editingItem) {
        const file = acceptedFiles[0];
        const previewUrl = URL.createObjectURL(file);
        setEditingItem({
          ...editingItem,
          imageUrl: previewUrl,
          imageFile: file
        });
      }
    },
    [editingItem]
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".webp"]
    },
    maxFiles: 1
  });

  const handleCardClick = (index: number) => {
    if (swiperRef.current) {
      swiperRef.current.slideTo(index);
    }
  };

  const handleEdit = (item: PortfolioItem) => {
    setEditingItem({ ...item });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await deletePortfolioItem(id);
      setPortfolioItems(portfolioItems.filter((item) => item.id !== id));
      showMessage("Работа удалена", "success");
    } catch (error) {
      showMessage("Ошибка удаления работы", "error");
      console.error(error);
    }
  };

  const handleSave = async () => {
    if (!editingItem) return;

    try {
      setIsUploading(true);

      const formData = new FormData();
      formData.append("title", editingItem.title);
      formData.append("description", editingItem.description);

      if (editingItem.imageFile) {
        formData.append("image", editingItem.imageFile);
      }

      let updatedItems;
      if (
        editingItem.id > 0 &&
        portfolioItems.some((item) => item.id === editingItem.id)
      ) {
        const updatedItem = await updatePortfolioItem(editingItem.id, formData);
        updatedItems = portfolioItems.map((item) =>
          item.id === updatedItem.id ? updatedItem : item
        );
        showMessage("Работа обновлена", "success");
      } else {
        const newItem = await createPortfolioItem(formData);
        updatedItems = [...portfolioItems, newItem];
        showMessage("Новая работа добавлена", "success");
      }

      if (editingItem.imageUrl && editingItem.imageUrl.startsWith("blob:")) {
        URL.revokeObjectURL(editingItem.imageUrl);
      }

      setPortfolioItems(updatedItems);
      setIsDialogOpen(false);
      setEditingItem(null);
    } catch (error) {
      showMessage("Ошибка сохранения работы", "error");
      console.error(error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!editingItem) return;
    setEditingItem({
      ...editingItem,
      [e.target.name]: e.target.value
    });
  };

  const showMessage = (message: string, severity: "success" | "error") => {
    setSnackbar({
      open: true,
      message,
      severity
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleDialogClose = () => {
    if (editingItem?.imageUrl && editingItem.imageUrl.startsWith("blob:")) {
      URL.revokeObjectURL(editingItem.imageUrl);
    }
    setIsDialogOpen(false);
    setEditingItem(null);
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: 400
        }}
      >
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 6 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          mb: 6,
          px: isMobile ? 2 : 0
        }}
      >
        {isAdmin && (
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => {
              setEditingItem({
                id: 0,
                title: "Новая работа",
                description: "Описание работы",
                imageUrl: ""
              });
              setIsDialogOpen(true);
            }}
            size="large"
            sx={{
              fontSize: isMobile ? "0.875rem" : "1rem",
              px: 3,
              py: 1.5
            }}
          >
            Добавить работу
          </Button>
        )}
      </Box>

      {portfolioItems.length > 0 ? (
        <Box
          sx={{
            position: "relative",
            px: isMobile ? 1 : 0
          }}
        >
          <Swiper
            style={{
              width: "100%",
              height: "100%",
              padding: isMobile ? "10px 0 40px" : "30px 0 60px"
            }}
            key={`swiper-${swiperKey}`}
            spaceBetween={isDesktop ? 60 : isTablet ? 40 : 20}
            slidesPerView={isMobile ? 1 : 1.2}
            centeredSlides={true}
            pagination={
              isMobile
                ? false
                : {
                    clickable: true,
                    dynamicBullets: true
                  }
            }
            navigation={!isMobile}
            loop={false} // Всегда зацикливаем независимо от роли
            autoplay={
              !isAdmin ? { delay: 3500, disableOnInteraction: false } : false
            }
            grabCursor={true}
            breakpoints={{
              320: {
                slidesPerView: 1,
                spaceBetween: 10
              },
              600: {
                slidesPerView: 1.3,
                spaceBetween: 25
              },
              900: {
                slidesPerView: 1.8,
                spaceBetween: 30
              },
              1200: {
                slidesPerView: 2.2,
                spaceBetween: 40
              },
              1600: {
                slidesPerView: 2.8,
                spaceBetween: 50
              },
              1920: {
                slidesPerView: 3.2,
                spaceBetween: 60
              }
            }}
            modules={[Pagination, Navigation, EffectCreative]}
            effect={isMobile ? "slide" : "creative"}
            creativeEffect={{
              prev: {
                shadow: true,
                translate: ["-65%", 0, -400],
                rotate: [0, 0, -8]
              },
              next: {
                shadow: true,
                translate: ["65%", 0, -400],
                rotate: [0, 0, 8]
              }
            }}
            onSwiper={(swiper: SwiperType) => {
              swiperRef.current = swiper;
            }}
            onSlideChange={(swiper: SwiperType) => {
              const activeIndex = swiper.realIndex;
              const activeSlide =
                portfolioItems[activeIndex % portfolioItems.length];
              onSlideChange?.(getFullImageUrl(activeSlide.imageUrl));
            }}
          >
            {portfolioItems.map((item, index) => (
              <SwiperSlide
                key={item.id}
                style={{
                  height: "auto",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: isMobile ? "0" : "0 15px",
                  cursor: "pointer"
                }}
                onClick={() => handleCardClick(index)}
              >
                <Card
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    transition: "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
                    borderRadius: isMobile ? "16px" : "24px",
                    boxShadow: "0 12px 36px rgba(0,0,0,0.15)",
                    "&:hover": {
                      transform: isMobile ? "none" : "scale(1.03)",
                      boxShadow: isMobile
                        ? "0 12px 36px rgba(0,0,0,0.15)"
                        : "0 18px 48px rgba(0,0,0,0.25)"
                    },
                    height: "100%",
                    width: "100%",
                    maxWidth: isMobile ? "100%" : isDesktop ? 600 : 500,
                    position: "relative",
                    overflow: "hidden"
                  }}
                >
                  {isAdmin && (
                    <Box
                      sx={{
                        position: "absolute",
                        top: 12,
                        right: 12,
                        zIndex: 1,
                        display: "flex",
                        gap: 1,
                        backgroundColor: "rgba(255,255,255,0.8)",
                        borderRadius: "24px",
                        p: 1,
                        boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
                      }}
                    >
                      <IconButton
                        aria-label="edit"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit(item);
                        }}
                        size={isMobile ? "small" : "medium"}
                        color="primary"
                      >
                        <Edit fontSize={isMobile ? "small" : "medium"} />
                      </IconButton>
                      <IconButton
                        aria-label="delete"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(item.id);
                        }}
                        size={isMobile ? "small" : "medium"}
                        color="error"
                      >
                        <Delete fontSize={isMobile ? "small" : "medium"} />
                      </IconButton>
                    </Box>
                  )}

                  <Box
                    sx={{
                      height: isMobile
                        ? 260
                        : isDesktop
                        ? 380
                        : isTablet
                        ? 340
                        : 300,
                      overflow: "hidden",
                      borderTopLeftRadius: isMobile ? "16px" : "24px",
                      borderTopRightRadius: isMobile ? "16px" : "24px"
                    }}
                  >
                    <CardMedia
                      component="img"
                      image={getFullImageUrl(item.imageUrl)}
                      alt={item.title}
                      sx={{
                        objectFit: "cover",
                        width: "100%",
                        height: "100%",
                        transition: "transform 0.5s ease",
                        "&:hover": {
                          transform: isMobile ? "none" : "scale(1.05)"
                        }
                      }}
                    />
                  </Box>
                  <CardContent
                    sx={{
                      flexGrow: 1,
                      p: isMobile ? 2 : isDesktop ? 4 : 3,
                      pb: isMobile ? 2 : isDesktop ? 4 : 3
                    }}
                  >
                    <Typography
                      variant={isMobile ? "h6" : isDesktop ? "h4" : "h5"}
                      component="div"
                      sx={{
                        fontWeight: 700,
                        mb: 2,
                        lineHeight: 1.2
                      }}
                    >
                      {item.title}
                    </Typography>
                    <Typography
                      variant={
                        isMobile ? "body2" : isDesktop ? "body1" : "body2"
                      }
                      color="text.secondary"
                      sx={{
                        fontSize: isMobile
                          ? "0.85rem"
                          : isDesktop
                          ? "1.1rem"
                          : "0.95rem",
                        lineHeight: 1.6
                      }}
                    >
                      {item.description}
                    </Typography>
                  </CardContent>
                </Card>
              </SwiperSlide>
            ))}
          </Swiper>
        </Box>
      ) : (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            py: 10,
            textAlign: "center",
            px: 2
          }}
        >
          <Typography variant={isMobile ? "h5" : "h4"} sx={{ mb: 3 }}>
            Нет работ для отображения
          </Typography>
          {isAdmin && (
            <Button
              variant="contained"
              startIcon={<Add />}
              size="large"
              onClick={() => {
                setEditingItem({
                  id: 0,
                  title: "Новая работа",
                  description: "Описание работы",
                  imageUrl: ""
                });
                setIsDialogOpen(true);
              }}
              sx={{
                fontSize: isMobile ? "0.875rem" : "1rem",
                px: 4,
                py: 1.5
              }}
            >
              Добавить первую работу
            </Button>
          )}
        </Box>
      )}

      <Dialog
        open={isDialogOpen}
        onClose={handleDialogClose}
        maxWidth="md"
        fullWidth
        fullScreen={isMobile}
      >
        <DialogTitle
          sx={{
            fontSize: isMobile ? "1.25rem" : "1.5rem",
            py: 2
          }}
        >
          {editingItem?.id ? "Редактировать работу" : "Добавить работу"}
          <IconButton
            aria-label="close"
            onClick={handleDialogClose}
            sx={{
              position: "absolute",
              right: 12,
              top: 12,
              color: (theme) => theme.palette.grey[500]
            }}
          >
            <Close fontSize={isMobile ? "medium" : "large"} />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers sx={{ py: 3 }}>
          <Box sx={{ mb: 4 }} {...getRootProps()}>
            <input {...getInputProps()} />
            {editingItem?.imageUrl ? (
              <Box
                sx={{
                  width: "100%",
                  height: isMobile ? 250 : 350,
                  mb: 3,
                  borderRadius: 2,
                  overflow: "hidden",
                  position: "relative"
                }}
              >
                <img
                  src={getFullImageUrl(editingItem.imageUrl)}
                  alt="Preview"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover"
                  }}
                />
                <Box
                  sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "rgba(0,0,0,0.5)",
                    opacity: 0,
                    transition: "opacity 0.3s",
                    "&:hover": { opacity: 1 },
                    cursor: "pointer"
                  }}
                >
                  <Button
                    variant="contained"
                    startIcon={<Add />}
                    size={isMobile ? "medium" : "large"}
                  >
                    Заменить изображение
                  </Button>
                </Box>
              </Box>
            ) : (
              <Box
                sx={{
                  width: "100%",
                  height: isMobile ? 200 : 300,
                  border: "2px dashed",
                  borderColor: "divider",
                  borderRadius: 2,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexDirection: "column",
                  cursor: "pointer",
                  transition: "border-color 0.3s",
                  "&:hover": {
                    borderColor: "primary.main"
                  }
                }}
              >
                <Add fontSize="large" sx={{ fontSize: "3rem", mb: 2 }} />
                <Typography variant={isMobile ? "body1" : "h6"}>
                  Перетащите изображение или кликните для выбора
                </Typography>
                <Typography variant="caption" sx={{ mt: 1 }}>
                  Рекомендуемый размер: 1200x800px
                </Typography>
              </Box>
            )}
          </Box>
          <TextField
            fullWidth
            label="Название работы"
            name="title"
            value={editingItem?.title || ""}
            onChange={handleInputChange}
            sx={{ mb: 3 }}
            InputProps={{
              style: {
                fontSize: isMobile ? "0.95rem" : "1.1rem"
              }
            }}
            InputLabelProps={{
              style: {
                fontSize: isMobile ? "0.95rem" : "1.1rem"
              }
            }}
          />
          <TextField
            fullWidth
            label="Описание"
            name="description"
            value={editingItem?.description || ""}
            onChange={handleInputChange}
            multiline
            rows={isMobile ? 5 : 7}
            InputProps={{
              style: {
                fontSize: isMobile ? "0.95rem" : "1.1rem"
              }
            }}
            InputLabelProps={{
              style: {
                fontSize: isMobile ? "0.95rem" : "1.1rem"
              }
            }}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button
            onClick={handleDialogClose}
            size={isMobile ? "medium" : "large"}
            sx={{ px: 3 }}
          >
            Отмена
          </Button>
          <Button
            onClick={handleSave}
            variant="contained"
            disabled={isUploading || !editingItem?.imageUrl}
            size={isMobile ? "medium" : "large"}
            sx={{ px: 4 }}
          >
            {isUploading ? (
              <>
                <CircularProgress size={24} sx={{ mr: 1 }} />
                Сохранение...
              </>
            ) : (
              "Сохранить"
            )}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{
            fontSize: isMobile ? "0.875rem" : "1rem",
            alignItems: "center"
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default PortfolioSlider;
