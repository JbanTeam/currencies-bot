import { Logger } from '../services/Logger';

export class CommandHandler {
  constructor() {}

  async handleCommand(command: string): Promise<string> {
    Logger.log(`Received command: ${command}`);

    switch (command) {
      case '/start':
        return `Привет! Я помогу вам узнать текущие курсы валют.
Напишите /currency для получения списка доступных валют.`;
      case '/help':
        return 'Доступные команды: /start, /help, /currency.';
      case '/currency':
        return 'Введите валютную пару в формате USD-EUR, чтобы узнать курс обмена.';
      default:
        return 'Неизвестная команда. Попробуйте /help.';
    }
  }
}
