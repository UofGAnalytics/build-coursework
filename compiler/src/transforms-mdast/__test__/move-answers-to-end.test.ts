import {
  createHtml,
  testProcessor,
} from '../../test-utils/test-processor';

describe('moveAnswersToEnd', () => {
  it('should move answers to end', async () => {
    const { html } = await testProcessor(`
      ::::task[My task title]
      This is the *task* content
      :::answer
      My answer!
      :::
      ::::
    `);

    const expected = createHtml(`
      <div class="boxout task" id="task-1">
        <h3>Task 1 (My task title)</h3>
        <p>This is the <em>task</em> content</p>
      </div>
      <div class="boxout answer" id="answer-1">
        <h3>Answer 1</h3>
        <p>My answer!</p>
      </div>
    `);

    expect(html).toBe(expected);
  });
});
