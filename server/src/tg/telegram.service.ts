import { Injectable } from '@nestjs/common';
import { Telegraf } from 'telegraf';

@Injectable()
export class TelegramService {
  private bot: Telegraf;
  private readonly chatId = process.env.CHAT_ID||'';

  constructor() {
    this.bot = new Telegraf(process.env.BOT_API||'');
  }

  async sendMessage(text: string): Promise<void> {
    try {
      await this.bot.telegram.sendMessage(this.chatId, text);
    } catch (error) {
      console.error('Error sending Telegram message:', error);
    }
  }
}