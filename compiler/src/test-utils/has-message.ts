import { VFile } from 'vfile';

import { Context } from '../context';
import { MessageStatus } from '../utils/message';
import { reportHasFatalErrors } from '../utils/report';

export function createHasFailingMessage(ctx: Context, file: VFile) {
  return function hasFailingMessage(reason: string) {
    const errors = file.messages.filter((o) => o.reason === reason);
    if (errors.length === 0) {
      console.log('Message not found in these messages:');
      console.log(file.messages);
      return false;
    }
    if (errors[0].status !== MessageStatus.fail) {
      console.log('Message does not have status: fail');
      console.log(errors[0]);
      return false;
    }
    return reportHasFatalErrors([file], ctx);
  };
}
