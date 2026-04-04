const puppeteer = require('puppeteer');

(async () => {
  console.log("Starting Puppeteer test...");
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', error => console.error('PAGE ERROR:', error.message));
  page.on('requestfailed', request => console.error('REQUEST FAILED:', request.url(), request.failure().errorText));
  
  await page.goto('http://localhost:3000/super/dashboard', { waitUntil: 'networkidle0' }).catch(e => console.error(e));
  
  const content = await page.content();
  console.log("Body length:", content.length);
  
  if (content.includes("Platform Master Overview")) {
    console.log("SUCCESS: Dashboard rendered!");
  } else {
    console.log("DOM content doesn't match expected dashboard. HTML snippet:");
    console.log(content.slice(0, 500));
  }
  
  await browser.close();
})();
