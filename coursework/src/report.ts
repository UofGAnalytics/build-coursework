import path from 'path';
import { VFile } from 'vfile';
import chalk from 'chalk';
import figures from 'figures';
import { MessageStatus, VFileWithStatus } from './message';

export function report(_files: VFile[]) {
  const files = (_files as unknown) as VFileWithStatus[];
  printReport(files);
  assertNoFailures(files);
}

function printReport(files: VFileWithStatus[]) {
  const filtered = files.filter((o) => o.messages.length);

  for (const file of filtered) {
    console.log(`\n${getFilePath(file.path as string)}`);
    for (const message of file.messages) {
      const status = getStatus(message.status);
      const position = chalk.grey(`${message.line}:${message.column}`);
      const reason = getReason(message.reason, message.status);
      console.log(`${status}  ${position}  ${reason}`);
    }
  }
}

function assertNoFailures(files: VFileWithStatus[]) {
  for (const file of files) {
    for (const message of file.messages) {
      if (message.status === MessageStatus.fail) {
        throw new Error('Build failed');
      }
    }
  }
}

function getFilePath(filePath: string) {
  return path.join(process.cwd(), filePath);
}

function getStatus(status: MessageStatus) {
  const statusColour = getStatusColour(status);
  switch (status) {
    case MessageStatus.fail:
      return statusColour(figures.cross);
    default:
      return statusColour(figures.warning);
  }
}

function getReason(reason: string, status: MessageStatus) {
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
