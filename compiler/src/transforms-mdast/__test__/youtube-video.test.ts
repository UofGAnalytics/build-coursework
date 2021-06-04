import {
  createHtml,
  testProcessor,
} from '../../test-utils/test-processor';

describe('youtubeVideos', () => {
  it('should render youtube videos', async () => {
    const { html } = await testProcessor(`
      ::video[Title]{id=AClLyj_Oczc}
    `);

    expect(html).toContain(
      '<a class="boxout video" href="https://youtu.be/AClLyj_Oczc" target="_blank">'
    );
    expect(html).toContain(
      '<img src="http://img.youtube.com/vi/AClLyj_Oczc/maxresdefault.jpg" alt="">'
    );
  });
});
