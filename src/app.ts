import dotenv from 'dotenv';
import { BotManager } from './bot/BotManager';
import { Logger } from './services/Logger';

dotenv.config();

const botManager = new BotManager();
botManager.start().catch(error => {
  Logger.error(`${error}`);
});
