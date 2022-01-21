import { Position } from 'unist';
import { VFile } from 'vfile';
import { VFileMessage } from 'vfile-message';

export type VFileWithStatus = Omit<VFile, 'messages'> & {
  messages: MessageWithStatus[];
};

export type MessageWithStatus = VFileMessage & {
  status: MessageStatus;
};

export enum MessageStatus {
  fail = 'fail',
  warning = 'warning',
  info = 'info',
}

export function failMessage(
  file: VFile,
  message: string,
  position?: Position
) {
  const status = MessageStatus.fail;
  return messageWithStatus(file, message, position, status);
}

export function warnMessage(
  file: VFile,
  message: string,
  position: Position | undefined
) {
  const status = MessageStatus.warning;
  return messageWithStatus(file, message, position, status);
}

export function infoMessage(
  file: VFile,
  message: string,
  position: Position | undefined
) {
  const status = MessageStatus.info;
  return messageWithStatus(file, message, position, status);
}

function messageWithStatus(
  file: VFile,
  message: string,
  position: Position | undefined,
  status: MessageStatus
) {
  // console.log(message);
  const msg = file.message(message, position) as MessageWithStatus;
  msg.status = status;
  return msg;
}
