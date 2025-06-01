import { START_MESSAGE } from '@src/constants';
import { CommandStrategy } from '@src/types/types';

export class StartCommand implements CommandStrategy {
  async execute(): Promise<string> {
    return START_MESSAGE;
  }
}
