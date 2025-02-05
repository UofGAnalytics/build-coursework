import { VFile } from 'vfile';
import { VFileMessage } from 'vfile-message';

import { Context } from '../context';
import {
  ReportMessage,
  reportHasFatalErrors,
  reportHasWarnings,
} from '../linter/report';
import { MessageStatus } from '../utils/message';

export function createHasFailingMessage(ctx: Context, files: VFile[]) {
  return function hasFailingMessage(reason: string) {
    const fileMessages = files.reduce((acc: VFileMessage[], o) => {
      return [...acc, ...o.messages];
    }, []);

    const errors = fileMessages.filter((o) =>
      o.reason.includes(reason),
    ) as unknown as ReportMessage[];
    if (errors.length === 0) {
      console.log('Message not found in these messages:');
      console.log(fileMessages);
      return false;
    }
    if (errors[0].status !== MessageStatus.fail) {
      console.log('Message does not have status: fail');
      console.log(errors[0]);
      return false;
    }
    return reportHasFatalErrors(files);
  };
}

export function createHasWarningMessage(ctx: Context, files: VFile[]) {
  return function hasWarningMessage(reason: string) {
    const fileMessages = files.reduce(
      (acc: VFileMessage[], o) => [...acc, ...o.messages],
      [],
    );
    const errors = fileMessages.filter((o) =>
      o.reason.includes(reason),
    ) as unknown as ReportMessage[];
    if (errors.length === 0) {
      console.log('Message not found in these messages:');
      console.log(fileMessages);
      return false;
    }
    if (errors[0].status !== MessageStatus.warning) {
      console.log('Message does not have status: warning');
      console.log(errors[0]);
      return false;
    }
    return reportHasWarnings(files);
  };
}

export function createMessageReasons(files: VFile[]) {
  return files.reduce((acc: string[], o) => {
    const reasons = o.messages.map((m) => m.reason);
    return [...acc, ...reasons];
  }, []);
}
