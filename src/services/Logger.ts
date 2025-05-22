export class Logger {
  static log(message?: any, ...optionalParams: any[]): void {
    const timestamp = new Date().toISOString();
    console.log(`\x1b[32m[${timestamp}]\x1b[0m`, message, ...optionalParams);
  }

  static error(message?: any, ...optionalParams: any[]): void {
    const timestamp = new Date().toISOString();
    console.error(`\x1b[31m[${timestamp}]\x1b[0m`, message, ...optionalParams);
  }

  static warn(message?: any, ...optionalParams: any[]): void {
    const timestamp = new Date().toISOString();
    console.warn(`\x1b[33m[${timestamp}]\x1b[0m`, message, ...optionalParams);
  }
}
