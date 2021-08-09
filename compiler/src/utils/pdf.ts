import puppeteer from 'puppeteer';

export async function convertToPdf(html: string) {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.setContent(html);
  await page.evaluateHandle('document.fonts.ready');
  const pdf = await page.pdf({
    format: 'a4',
    printBackground: true,
    displayHeaderFooter: true,
    margin: {
      top: '20px',
      left: '40px',
      right: '40px',
      bottom: '40px',
    },
  });
  await browser.close();
  return pdf;
}
