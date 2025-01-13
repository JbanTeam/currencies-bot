export interface BotProvider {
  /**
   * Отправляет сообщение пользователю.
   * @param chatId - Идентификатор чата.
   * @param text - Текст сообщения.
   */
  sendMessage(chatId: string, text: string): Promise<void>;

  /**
   * Устанавливает обработчик входящих сообщений.
   * @param callback - Функция, которая будет вызвана при получении сообщения.
   */
  onMessage(callback: (message: string) => void): Promise<void>;
}