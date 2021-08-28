import { testProcessor } from '../../test-utils/test-processor';

describe('youtubeVideos', () => {
  it('should render youtube videos', async () => {
    const { html } = await testProcessor(`
      ::video[Title]{id=AClLyj_Oczc duration=4m2s}
    `);

    expect(html).toContain(
      '<span class="duration"><strong>Duration</strong>4:02</span></span>'
    );
    expect(html).toContain(
      '<a class="boxout video" href="https://youtu.be/AClLyj_Oczc" target="_blank">'
    );
    expect(html).toContain(
      '<img src="http://img.youtube.com/vi/AClLyj_Oczc/mqdefault.jpg" alt="">'
    );
  });
});
