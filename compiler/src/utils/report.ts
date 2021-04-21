import path from 'path';

import chalk from 'chalk';
import figures from 'figures';
import { VFile } from 'vfile';

import { Context } from '../types';
import { MessageStatus } from './message';

export type Report = {
  failed: boolean;
  files: ReportFile[];
};

type ReportFile = {
  path: string;
  messages: ReportMessage[];
};

type ReportMessage = {
  status: MessageStatus;
  position: string;
  reason: string;
};

export function printReport(files: VFile[], ctx: Context) {
  for (const file of files) {
    console.log(`\n${getFilePath(file.path as string)}`);
    for (const message of file.messages) {
      const status = message.status as MessageStatus;
      const position = chalk.grey(`${message.line}:${message.column}`);
      const reason = formatReason(message.reason, status);
      console.log(`${formatStatus(status)}  ${position}  ${reason}`);
    }
  }
}

export function reportHasFatalErrors(files: VFile[], ctx: Context) {
  const passed = files.every((file) =>
    file.messages.every((message) => message.status !== MessageStatus.fail)
  );
  return !passed;
}

function getFilePath(filePath: string) {
  return path.join(process.cwd(), filePath);
}

function formatStatus(status: MessageStatus) {
  const statusColour = getStatusColour(status);
  switch (status) {
    case MessageStatus.fail:
      return statusColour(figures.cross);
    default:
      return statusColour(figures.warning);
    // TODO: fail on unsupported status?
  }
}

function formatReason(reason: string, status: MessageStatus) {
  const statusColour = getStatusColour(status);
  const [first, ...rest] = reason.split('\n');
  const formattedFirst = statusColour(first);
  const formattedRest = rest.map((line) => chalk.grey(line));
  return [formattedFirst, ...formattedRest].join('\n');
}

function getStatusColour(status: MessageStatus) {
  switch (status) {
    case MessageStatus.fail:
      return chalk.red;
    default:
      return chalk.yellow;
  }
}
