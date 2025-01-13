import { BotManager } from './bot/BotManager';
import { Logger } from './services/Logger';

const botManager = new BotManager();
botManager.start().catch(error => {
  Logger.error(`${error}`);
});
