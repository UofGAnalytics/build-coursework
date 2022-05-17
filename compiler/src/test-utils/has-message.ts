import { VFile } from 'vfile';
import { VFileMessage } from 'vfile-message';

import { Context } from '../context';
import {
  ReportMessage,
  reportHasFatalErrors,
  reportHasWarnings,
} from '../linter/report';
import {
  Message,
  MessageStatus,
  VFileWithMessages,
} from '../utils/message';

export function createHasFailingMessage(ctx: Context, files: VFile[]) {
  return function hasFailingMessage(reason: string) {
    const fileMessages = files.reduce(
      (acc: VFileMessage[], o) => [...acc, ...o.messages],
      []
    );
    const errors = fileMessages.filter(
      (o) => o.reason === reason
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
    return reportHasFatalErrors(files, ctx);
  };
}

export function createHasWarningMessage(ctx: Context, files: VFile[]) {
  return function hasWarningMessage(reason: string) {
    const fileMessages = files.reduce(
      (acc: VFileMessage[], o) => [...acc, ...o.messages],
      []
    );
    const errors = fileMessages.filter(
      (o) => o.reason === reason
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
    return reportHasWarnings(files, ctx);
  };
}

export function createMessages(files: VFileWithMessages[]) {
  return files.reduce((acc: Message[], file) => {
    return [...acc, ...file.messages];
  }, []);
}

export function createMessageReasons(files: VFileWithMessages[]) {
  return createMessages(files).map((o) => o.reason);
}
