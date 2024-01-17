import {
  testProcessor,
  unindentString,
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

    const expected = unindentString(`
      <div class="boxout task" id="task-1"><span class="type">Task 1</span>
        <h3 id="my-task-title"><a class="link" href="#my-task-title"><svg class="icon link-icon">
              <use href="#link-icon"></use>
            </svg></a>My task title</h3>
        <p>This is the <em>task</em> content</p>
        <div class="answer"><span class="answer-trigger" data-answer-id="1">Show answer</span>
          <div class="answer-reveal" id="answer-1">
            <p>My answer!</p>
          </div>
        </div>
      </div>
    `);

    expect(html).toBe(expected);
  });
});
