import puppeteer from 'puppeteer';

// const footerTemplate = `
//   <div style="font-size: 14px; padding-top: 20px; text-align: center; width: 100%;">
//     Page <span class="pageNumber"></span> of <span class="totalPages"></span>
//   </div>
// `;

export async function convertToPdf(html: string) {
  const browser = await puppeteer.launch({
    headless: true,
    ignoreDefaultArgs: ['--disable-extensions'], // fix for windows
  });
  const page = await browser.newPage();
  await page.setContent(html);
  await page.evaluateHandle('document.fonts.ready');
  const pdf = await page.pdf({
    format: 'a4',
    printBackground: true,
    // displayHeaderFooter: true,
    // footerTemplate,
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
