import { EOL } from 'os';

import { Position } from 'unist';
import { VFile } from 'vfile';
import { VFileMessage } from 'vfile-message';

export type VFileWithMessages = Omit<VFile, 'messages'> & {
  messages: Message[];
};

export enum MessageStatus {
  fail = 'fail',
  warning = 'warning',
  info = 'info',
}

export type Message = VFileMessage & {
  status: MessageStatus;
  excerpt?: string;
};

export function createExcerpt(file: VFile, position?: Position) {
  if (!position) {
    return '';
  }
  const { start, end } = position;
  const lines = String(file.value).split(EOL);
  return lines.slice(start.line - 1, end.line).join(EOL);
}

export function failMessage(
  file: VFile,
  message: string,
  position?: Position,
  excerpt?: string
) {
  const status = MessageStatus.fail;
  return createMessage(file, message, status, position, excerpt);
}

export function warnMessage(
  file: VFile,
  message: string,
  position?: Position,
  excerpt?: string
) {
  const status = MessageStatus.warning;
  return createMessage(file, message, status, position, excerpt);
}

export function infoMessage(
  file: VFile,
  message: string,
  position?: Position,
  excerpt?: string
) {
  const status = MessageStatus.info;
  return createMessage(file, message, status, position, excerpt);
}

function createMessage(
  file: VFile,
  message: string,
  status: MessageStatus,
  position?: Position,
  excerpt?: string
) {
  // console.log(message);
  const msg = file.message(message, position) as Message;
  msg.status = status;
  if (excerpt) {
    msg.excerpt = excerpt;
  }
  return msg;
}
