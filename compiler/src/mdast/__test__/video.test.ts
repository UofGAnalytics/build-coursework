import { testProcessor } from '../../test-utils/test-processor';

describe('youtubeVideos', () => {
  it('should render youtube videos', async () => {
    const { html } = await testProcessor(`
      ::video[Title]{id=AClLyj_Oczc duration=4m2s}
    `);

    expect(html).toContain(
      '<span class="duration"><strong>Duration</strong>4:02</span></span>',
    );
    expect(html).toContain(
      '<a class="boxout video" href="https://youtu.be/AClLyj_Oczc" target="_blank">',
    );
    expect(html).toContain(
      '<img src="http://img.youtube.com/vi/AClLyj_Oczc/mqdefault.jpg" alt="">',
    );
  });

  it('should render echo360 videos', async () => {
    const { html } = await testProcessor(`
      ::video[Title]{url=https://echo360.org.uk/media/c1c391c8-a6a3-4048-9e61-43cbb93cd195/public duration=4m2s}
    `);

    expect(html).toContain(
      '<span class="duration"><strong>Duration</strong>4:02</span></span>',
    );
    expect(html).toContain(
      '<a class="boxout video" href="https://echo360.org.uk/media/c1c391c8-a6a3-4048-9e61-43cbb93cd195/public" target="_blank">',
    );
    expect(html).not.toContain('<img');
  });
});
