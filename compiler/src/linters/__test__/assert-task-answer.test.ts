import { testProcessor } from '../../test-utils/test-processor';

describe('assertTaskAnswerStructure', () => {
  it('should fail on task with no answer', async () => {
    const { file, hasFailingMessage } = await testProcessor(`
      ::::task
      Hmm, this is the task content?
      ::::
    `);
    expect(hasFailingMessage(file, 'Task has no answer')).toBe(true);
  });

  it('should fail on task with multiple answers', async () => {
    const { file, hasFailingMessage } = await testProcessor(`
      ::::task
      Hmm, this is the task content?
      :::answer
      My answer!
      :::
      :::answer
      My alternative answer!
      :::
      ::::
    `);
    expect(hasFailingMessage(file, 'Task has multiple answers')).toBe(
      true
    );
  });

  it('should fail on answer outside task', async () => {
    const { file, hasFailingMessage } = await testProcessor(`
      :::answer
      My answer to something!
      :::
    `);
    expect(
      hasFailingMessage(file, 'Answer must be nested inside task')
    ).toBe(true);
  });
});
