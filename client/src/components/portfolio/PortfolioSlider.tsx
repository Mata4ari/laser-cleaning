import React, { useState, useEffect, useCallback } from "react";
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
  CircularProgress
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

interface PortfolioSliderProps {
  onSlideChange?: (imageUrl: string) => void;
  isAdmin?: boolean;
}

const PortfolioSlider: React.FC<PortfolioSliderProps> = ({
  onSlideChange,
  isAdmin = false
}) => {
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<PortfolioItem | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error"
  });

  useEffect(() => {
    const loadItems = async () => {
      try {
        setLoading(true);
        const items = await getPortfolioItems();
        console.log(items);
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

    const onDrop = useCallback((acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0 && editingItem) {
        const file = acceptedFiles[0];
        setEditingItem({
          ...editingItem,
          imageUrl: URL.createObjectURL(file)
        });
      }
    }, [editingItem]);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".webp"]
    },
    maxFiles: 1
  });

  const handleEdit = (item: PortfolioItem) => {
  // Создаем копию объекта для редактирования
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

    // Более надежная проверка на существующий элемент
    const isExistingItem = editingItem.id > 0 && 
                         portfolioItems.some(item => item.id === editingItem.id);

    if (isExistingItem) {
      // Для существующего элемента находим оригинал
      const originalItem = portfolioItems.find(item => item.id === editingItem.id);
      if (!originalItem) {
        throw new Error("Оригинальная работа не найдена");
      }

      // Создаем объект только с измененными полями
      const updatedFields: Partial<PortfolioItem> = {};
      if (editingItem.title !== originalItem.title) updatedFields.title = editingItem.title;
      if (editingItem.description !== originalItem.description) updatedFields.description = editingItem.description;
      if (editingItem.imageUrl !== originalItem.imageUrl) updatedFields.imageUrl = editingItem.imageUrl;

      // Обновляем только если есть изменения
      if (Object.keys(updatedFields).length > 0) {
        const updatedItem = await updatePortfolioItem(editingItem.id, updatedFields);
        setPortfolioItems(portfolioItems.map(item => 
          item.id === updatedItem.id ? updatedItem : item
        ));
        showMessage("Работа обновлена", "success");
      } else {
        showMessage("Нет изменений для сохранения", "error");
      }
    } else {
      // Создаем новую работу
      const newItem = await createPortfolioItem({
        title: editingItem.title,
        description: editingItem.description,
        imageUrl: editingItem.imageUrl
      });
      setPortfolioItems([...portfolioItems, newItem]);
      showMessage("Новая работа добавлена", "success");
    }
  } catch (error) {
    showMessage("Ошибка сохранения работы", "error");
    console.error(error);
  } finally {
    setIsUploading(false);
    setIsDialogOpen(false);
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

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: 300
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        width: "200%",
        height: "100%",
        position: "relative",
        padding: "10px 0"
      }}
    >
      {isAdmin && (
        <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
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
          >
            Добавить работу
          </Button>
        </Box>
      )}

      {portfolioItems.length > 0 ? (
        <Swiper
          style={{
            width: "100%",
            height: "100%"
          }}
          spaceBetween={40}
          slidesPerView={5.0}
          centeredSlides={true}
          pagination={{ clickable: true }}
          navigation={true}
          loop={!isAdmin}
          autoplay={!isAdmin ? { delay: 3000 } : false}
          grabCursor={true}
          breakpoints={{
            640: {
              slidesPerView: 1.3,
              spaceBetween: 20
            },
            768: {
              slidesPerView: 1.7,
              spaceBetween: 20
            },
            1024: {
              slidesPerView: 2.2,
              spaceBetween: 20
            },
            1440: {
              slidesPerView: 2.8,
              spaceBetween: 20
            }
          }}
          modules={[Pagination, Navigation, EffectCreative]}
          effect="creative"
          creativeEffect={{
            prev: {
              shadow: true,
              translate: ["-60%", 0, -300],
              rotate: [0, 0, -5]
            },
            next: {
              shadow: true,
              translate: ["60%", 0, -300],
              rotate: [0, 0, 5]
            }
          }}
          onSlideChange={(swiper: SwiperType) => {
            const activeIndex = swiper.realIndex;
            const activeSlide =
              portfolioItems[activeIndex % portfolioItems.length];
            onSlideChange?.(activeSlide.imageUrl);
          }}
        >
          {portfolioItems.map((item) => (
            <SwiperSlide
              key={item.id}
              style={{
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "100%"
              }}
            >
              <Card
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  transition: "transform 0.3s",
                  borderRadius: "20px",
                  boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
                  "&:hover": {
                    transform: "scale(1.02)",
                    boxShadow: "0 15px 40px rgba(0,0,0,0.3)"
                  },
                  height: "95%",
                  width: "100%",
                  margin: "auto",
                  maxWidth: "none",
                  position: "relative"
                }}
              >
                {isAdmin && (
                  <Box
                    sx={{
                      position: "absolute",
                      top: 8,
                      right: 8,
                      zIndex: 1,
                      display: "flex",
                      gap: 1,
                      backgroundColor: "rgba(255,255,255,0.7)",
                      borderRadius: "20px",
                      p: 0.5
                    }}
                  >
                    <IconButton
                      aria-label="edit"
                      onClick={() => handleEdit(item)}
                      size="small"
                    >
                      <Edit fontSize="small" />
                    </IconButton>
                    <IconButton
                      aria-label="delete"
                      onClick={() => handleDelete(item.id)}
                      size="small"
                    >
                      <Delete fontSize="small" />
                    </IconButton>
                  </Box>
                )}

                <Box
                  sx={{
                    height: "85%",
                    overflow: "hidden",
                    borderTopLeftRadius: "20px",
                    borderTopRightRadius: "20px"
                  }}
                >
                  <CardMedia
                    component="img"
                    image={item.imageUrl}
                    alt={item.title}
                    sx={{
                      objectFit: "cover",
                      width: "100%",
                      height: "100%"
                    }}
                  />
                </Box>
                <CardContent
                  sx={{
                    flexGrow: 1,
                    p: 3,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center"
                  }}
                >
                  <Typography
                    variant="h4"
                    component="div"
                    sx={{ fontWeight: 600 }}
                  >
                    {item.title}
                  </Typography>
                  <Typography
                    variant="h6"
                    color="text.secondary"
                    sx={{ mt: 2 }}
                  >
                    {item.description}
                  </Typography>
                </CardContent>
              </Card>
            </SwiperSlide>
          ))}
        </Swiper>
      ) : (
        <Typography variant="h6" textAlign="center" sx={{ py: 4 }}>
          Нет работ для отображения
        </Typography>
      )}

      <Dialog
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {editingItem?.id ? "Редактировать работу" : "Добавить работу"}
          <IconButton
            aria-label="close"
            onClick={() => setIsDialogOpen(false)}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500]
            }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
  <Box sx={{ mb: 3 }} {...getRootProps()}>
    <input {...getInputProps()} />
    {editingItem?.imageUrl ? (
      <Box sx={{
        width: "100%",
        height: 200,
        mb: 2,
        borderRadius: 1,
        overflow: "hidden",
        position: "relative"
      }}>
        <img
          src={editingItem.imageUrl}
          alt="Preview"
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
        <Box sx={{
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
        }}>
          <Button variant="contained" startIcon={<Add />}>
            Заменить изображение
          </Button>
        </Box>
      </Box>
    ) : (
      <Box sx={{
        width: "100%",
        height: 200,
        border: "2px dashed",
        borderColor: "divider",
        borderRadius: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        cursor: "pointer"
      }}>
        <Add fontSize="large" />
        <Typography>Перетащите изображение или кликните для выбора</Typography>
      </Box>
    )}
  </Box>
  <TextField
    fullWidth
    label="Название работы"
    name="title"
    value={editingItem?.title || ""}
    onChange={handleInputChange}
    sx={{ mb: 2 }}
  />
  <TextField
    fullWidth
    label="Описание"
    name="description"
    value={editingItem?.description || ""}
    onChange={handleInputChange}
    multiline
    rows={4}
  />
</DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDialogOpen(false)}>Отмена</Button>
          <Button
            onClick={handleSave}
            variant="contained"
            disabled={
              isUploading || 
              !editingItem?.title || 
              !editingItem?.description ||
              !editingItem?.imageUrl  // Добавлена проверка на изображение
}
          >
            {isUploading ? "Сохранение..." : "Сохранить"}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default PortfolioSlider;
