export interface BotProvider {
  sendMessage(chatId: string, text: string): Promise<void>;
  onMessage(callback: (message: IncomingMessage) => void): Promise<void>;
}

export type IncomingMessage = {
  chatId: string;
  text: string;
  timestamp: Date;
  user?: {
    id: string;
    username?: string;
  };
};
