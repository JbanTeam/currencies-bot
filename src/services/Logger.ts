export class Logger {
  static log(message: string): void {
    const timestamp = new Date().toISOString();
    console.log(`\x1b[32m[${timestamp}]\x1b[0m ${message}`);
  }

  static error(err: any): void {
    const timestamp = new Date().toISOString();
    console.error(`\x1b[31m[${timestamp}]\x1b[0m`);
    console.error(err);
  }

  static warn(message: string): void {
    const timestamp = new Date().toISOString();
    console.warn(`\x1b[33m[${timestamp}]\x1b[0m ${message}`);
  }
}
