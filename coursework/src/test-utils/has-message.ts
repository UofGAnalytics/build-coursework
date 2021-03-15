import { VFile } from 'vfile';

import { MessageStatus } from '../utils/message';
import { reportHasFatalErrors } from '../utils/report';

export function hasFailingMessage(file: VFile, reason: string) {
  const errors = file.messages.filter((o) => o.reason === reason);
  if (errors.length !== 1) {
    console.log('Message not found in these messages:');
    console.log(file.messages);
    return false;
  }
  if (errors[0].status !== MessageStatus.fail) {
    console.log('Message does not have status: fail');
    console.log(errors[0]);
    return false;
  }
  return reportHasFatalErrors([file]);
}
