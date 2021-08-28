import { convertToPdf } from '.';

describe('convertToPdf', () => {
  it('should not error cross platform', async () => {
    const pdf = await convertToPdf(`
      <h1>test</h1>
    `);

    expect(Buffer.isBuffer(pdf)).toBe(true);
  });
});
