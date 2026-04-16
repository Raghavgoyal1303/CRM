const puppeteer = require('puppeteer');

async function testPuppeteer() {
  console.log('Testing Puppeteer launch...');
  let browser;
  try {
    browser = await puppeteer.launch({ 
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    await page.setContent('<h1>Tricity Verified PDF Test</h1>');
    const pdf = await page.pdf({ format: 'A4' });
    console.log('SUCCESS: PDF Buffer generated, size:', pdf.length);
  } catch (err) {
    console.error('FATAL PUPPETEER ERROR:', err.message);
    console.error('Stack:', err.stack);
  } finally {
    if (browser) await browser.close();
  }
}

testPuppeteer();
