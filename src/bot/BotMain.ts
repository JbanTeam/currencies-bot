import { CommandHandler } from '../handlers/CommandHandler';
import { MessageHandler } from '../handlers/MessageHandler';
import { Logger } from '../services/Logger';
import { BotProvider, IncomingMessage } from '../types/BotTypes';

export class BotMain {
  private provider: BotProvider;
  private messageHandler: MessageHandler;
  private commandHandler: CommandHandler;

  constructor(provider: BotProvider) {
    this.provider = provider;
    this.messageHandler = new MessageHandler();
    this.commandHandler = new CommandHandler();
  }

  async sendMessage(chatId: string, text: string): Promise<void> {
    await this.provider.sendMessage(chatId, text);
  }

  async start(): Promise<void> {
    await this.provider.onMessage(async (message: IncomingMessage) => {
      // Logger.log(`Received message: ${message.text}`);

      let response: string;
      if (message.text.startsWith('/')) {
        response = await this.commandHandler.handleCommand(message.text);
      } else {
        response = await this.messageHandler.handleMessage(message.text);
      }

      await this.sendMessage(message.chatId, response);
    });
  }
}
