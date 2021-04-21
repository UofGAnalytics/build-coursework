import {
  createHtml,
  testProcessor,
} from '../../test-utils/test-processor';

describe('youtubeVideos', () => {
  it('should render youtube videos', async () => {
    const { html } = await testProcessor(`
      ::video{id=AClLyj_Oczc}
    `);

    const expected = createHtml(`
      <div class="video-wrapper"><a href="https://youtu.be/AClLyj_Oczc" target="_blank"><img src="http://img.youtube.com/vi/AClLyj_Oczc/maxresdefault.jpg" alt=""></a></div>
    `);

    expect(html).toBe(expected);
  });
});
