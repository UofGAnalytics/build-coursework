import {
  createHtml,
  testProcessor,
} from '../../test-utils/test-processor';

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
