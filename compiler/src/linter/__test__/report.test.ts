import { reportTestProcessor } from '../../test-utils/report-test-processor';

describe('assertTaskAnswerStructure', () => {
  it('should fail on task with no answer', async () => {
    const [message] = await reportTestProcessor('report-excerpts', {
      shouldFail: true,
    });

    expect(message.excerpt).toBe(
      `::::task\nHmm, this is the task content?\n::::`
    );
  });
});
