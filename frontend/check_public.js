const puppeteer = require('puppeteer');

(async () => {
  console.log("Testing LeadFlow Public Homepage...");
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('LOG:', msg.text()));
  page.on('pageerror', error => console.error('ERR:', error.message));
  
  try {
    await page.goto('http://localhost:3000/', { waitUntil: 'networkidle0', timeout: 30000 });
    
    // Check for Hero Headline
    const content = await page.content();
    const hasHero = content.includes("Turn Every Call Into a Closed Deal");
    const hasFeatures = content.includes("Everything your sales team needs");
    const hasPricing = content.includes("Simple, honest pricing");
    
    console.log(`Results: Hero=${hasHero}, Features=${hasFeatures}, Pricing=${hasPricing}`);
    console.log("DOM Length:", content.length);
    
    if (hasHero && hasFeatures && hasPricing) {
        console.log("PUBLIC HOMEPAGE: SUCCESSFUL RENDER");
    } else {
        console.log("PUBLIC HOMEPAGE: FAILED TO RENDER PROPERLY");
    }
  } catch (e) {
    console.error("Navigation error:", e.message);
  }
  
  await browser.close();
})();
