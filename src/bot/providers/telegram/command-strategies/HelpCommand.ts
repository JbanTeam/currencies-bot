import { HELP_MESSAGE } from '@src/constants';
import { CommandStrategy } from '@src/types/types';

export class HelpCommand implements CommandStrategy {
  async execute(): Promise<string> {
    return HELP_MESSAGE;
  }
}
