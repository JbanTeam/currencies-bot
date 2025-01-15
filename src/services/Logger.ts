export class Logger {
  static log(message: string): void {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${message}`);
  }

  static error(message: string): void {
    const timestamp = new Date().toISOString();
    console.error(`[${timestamp}] ${message}`);
  }

  static warn(message: string): void {
    const timestamp = new Date().toISOString();
    console.warn(`[${timestamp}] WARNING: ${message}`);
  }
}
