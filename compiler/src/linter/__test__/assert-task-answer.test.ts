import { testProcessor } from '../../test-utils/test-processor';

describe('assertTaskAnswerStructure', () => {
  it.skip('should fail on task with no answer', async () => {
    const { hasFailingMessage } = await testProcessor(
      `
      ::::task
      Hmm, this is the task content?
      ::::
    `,
      { shouldFail: true }
    );
    expect(hasFailingMessage('Task has no answer')).toBe(true);
  });

  it.skip('should fail on task with multiple answers', async () => {
    const { hasFailingMessage } = await testProcessor(
      `
      ::::task
      Hmm, this is the task content?
      :::answer
      My answer!
      :::
      :::answer
      My alternative answer!
      :::
      ::::
    `,
      { shouldFail: true }
    );
    expect(hasFailingMessage('Task has multiple answers')).toBe(true);
  });

  it.skip('should fail on answer outside task', async () => {
    const { hasFailingMessage } = await testProcessor(
      `
      :::answer
      My answer to something!
      :::
    `,
      { shouldFail: true }
    );
    expect(hasFailingMessage('Answer must be nested inside task')).toBe(
      true
    );
  });
});
