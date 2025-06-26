import { Controller, Post, Body } from '@nestjs/common';
import { TelegramService } from './telegram.service';

@Controller('api/tg')
export class TelegramController {
  constructor(private readonly telegramService: TelegramService) {}

  @Post()
  async sendToTelegram(@Body() jsonData: any) {
    try {
      const message = this.formatMessage(jsonData);
      await this.telegramService.sendMessage(message);
      return { 
        success: true, 
        message: 'Данные успешно отправлены в Telegram',
        data: jsonData
      };
    } catch (error) {
      return {
        success: false,
        message: 'Ошибка при отправке в Telegram',
        error: error.message
      };
    }
  }
   private formatMessage(data: any): string {
    const serviceTypes = {
      cleaning: "Лазерная очистка металла",
      rust_removal: "Удаление ржавчины",
      paint_removal: "Удаление краски",
      oxide_removal: "Удаление окислов",
      preparation: "Подготовка поверхности к покраске"
    };

    const materialTypes = {
      steel: "Сталь",
      aluminum: "Алюминий",
      copper: "Медь",
      brass: "Латунь",
      cast_iron: "Чугун",
      other: "Другое"
    };

    return `
Новая заявка с сайта:
Имя: ${data.name || 'Не указано'}
Телефон: ${data.phone || 'Не указано'}
Email: ${data.email || 'Не указано'}
Услуга: ${serviceTypes[data.serviceType] || data.serviceType || 'Не указано'}
Материал: ${materialTypes[data.materialType] || data.materialType || 'Не указано'}
Сообщение: ${data.message || 'Не указано'}
    `.trim();
  }
}
