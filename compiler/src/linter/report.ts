import chalk from 'chalk';
import figures from 'figures';
import { VFile } from 'vfile';
import { VFileMessage } from 'vfile-message';

import { Context } from '../context';
import { MessageStatus } from '../utils/message';

export type Report = {
  failed: boolean;
  files: ReportFile[];
};

export type ReportFile = Omit<VFile, 'messages'> & {
  messages: ReportMessage[];
};

export type ReportMessage = {
  status: MessageStatus;
  position: string;
  reason: string;
  line: number;
  column: number;
};

export function printReport(files: VFile[], ctx: Context) {
  const { reportOnlyErrors, shouldFail } = ctx.options;

  if (reportOnlyErrors && shouldFail) {
    return;
  }

  for (const file of files) {
    // console.log(file.messages);
    const messages = reportOnlyErrors
      ? failingMessages(file.messages as any)
      : file.messages;

    if (messages.length !== 0) {
      // if (file.path !== undefined) {
      //   console.log(`\n${getFilePath(file.path)}`);
      // }
      messages.forEach((message) => {
        printMessage(message as any);
      });
    }
  }
}

export function reportHasFatalErrors(files: VFile[]) {
  return files.some((file) => {
    const messages = file.messages as unknown as ReportMessage[];
    return messages.some(
      (message) => message.status === MessageStatus.fail,
    );
  });
}

export function reportHasWarnings(files: VFile[]) {
  return files.some((file) => {
    const messages = file.messages as unknown as ReportMessage[];
    return messages.some(
      (message) => message.status === MessageStatus.warning,
    );
  });
}

function failingMessages(_messages: VFileMessage[]) {
  const messages = _messages as unknown as ReportMessage[];
  return messages.filter(
    (o) => o.status === MessageStatus.fail,
  ) as unknown as VFileMessage[];
}

function printMessage(_message: VFileMessage) {
  const message = _message as unknown as ReportMessage;
  // console.log(message);
  const status = message.status;
  const position = chalk.grey(`${message.line}:${message.column}`);
  const reason = formatReason(message.reason, status);
  console.log(`${formatStatus(status)}  ${position}  ${reason}`);
}

// function getFilePath(filePath: string) {
//   return path.isAbsolute(filePath)
//     ? filePath
//     : path.join(process.cwd(), filePath);
// }

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
