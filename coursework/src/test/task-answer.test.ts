import { testProcessor, createHtml, hasFailingMessage } from './helpers';

describe('assertTaskAnswerStructure', () => {
  it('should fail on task with no answer', async () => {
    const { file } = await testProcessor(`
      ::::task
      Hmm, this is the task content?
      ::::
    `);
    expect(hasFailingMessage(file, 'Task has no answer')).toBe(true);
  });

  it('should fail on task with multiple answers', async () => {
    const { file } = await testProcessor(`
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
    const { file } = await testProcessor(`
      :::answer
      My answer to something!
      :::
    `);
    expect(
      hasFailingMessage(file, 'Answer must be nested inside task')
    ).toBe(true);
  });
});

describe('moveAnswersToEnd', () => {
  it('should move answers to end', async () => {
    const { html } = await testProcessor(`
      ::::task[Task title]
      Hmm, this is the *task* content?
      :::answer
      My answer!
      :::
      ::::
    `);

    const expected = createHtml(`
      <div class="boxout task">
        <h3>Task title</h3>
        <p>Hmm, this is the <em>task</em> content?</p>
      </div>
      <div>
        <p>Answer 1</p>
      </div>
    `);

    expect(html).toBe(expected);
  });
});
