export class BotError extends Error {
  constructor(
    message: string,
    public readonly userMessage: string,
    public readonly statusCode: number,
  ) {
    super(message);
    this.name = 'BotError';
  }
}
