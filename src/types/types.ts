interface BotProvider {
  sendMessage(chatId: number, text: string): Promise<void>;
  onMessage(callback: (message: IncomingMessage) => void): Promise<void>;
}

type IncomingMessage = {
  chatId: number;
  text: string;
  timestamp: Date;
  messageId: number;
  user?: {
    id: number;
    username?: string;
  };
};

type TgUser = {
  id: number;
  is_bot: boolean;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
};

type TgChat = {
  id: number;
  type: 'private' | 'group' | 'supergroup' | 'channel';
  title?: string;
  username?: string;
  first_name?: string;
  last_name?: string;
};

type TgMessageEntity = {
  type:
    | 'mention'
    | 'hashtag'
    | 'bot_command'
    | 'url'
    | 'email'
    | 'bold'
    | 'italic'
    | 'code'
    | 'pre'
    | 'text_link'
    | 'text_mention';
  offset: number;
  length: number;
  url?: string;
  user?: TgUser;
};

type TgSendMsgParams = {
  chatId: number;
  text: string;
  options?: TgSendMessageOptions;
};

type TgSendMessageOptions = {
  parse_mode?: 'html' | 'markdown' | 'markdownv2';
  disable_web_page_preview?: boolean;
  disable_notification?: boolean;
  reply_markup?: object;
};

type InlineKeyboardButton = {
  text: string;
  callback_data?: string;
  url?: string;
};

type InlineKeyboardMarkup = {
  inline_keyboard: InlineKeyboardButton[][];
};

type TgMessage = {
  message_id: number;
  from?: TgUser;
  chat: TgChat;
  date: number;
  text?: string;
  entities?: TgMessageEntity[];
  reply_markup?: InlineKeyboardMarkup;
};

type TgUpdate = {
  update_id: number;
  message: TgMessage;
};

type TgUpdateResponse = {
  ok: boolean;
  result: TgUpdate[];
  description?: string;
};

type ExchangeRates = {
  [exchangeCode: string]: number;
};

type ExchangeRateApiResponse = {
  success: boolean;
  terms: string;
  privacy: string;
  source: string;
  timestamp: number;
  quotes: ExchangeRates;
};

export {
  BotProvider,
  IncomingMessage,
  ExchangeRates,
  ExchangeRateApiResponse,
  TgUpdateResponse,
  TgMessage,
  TgSendMsgParams,
};
