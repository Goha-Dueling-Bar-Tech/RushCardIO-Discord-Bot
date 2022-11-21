const puppeteer = require('puppeteer')

const fetchData = async () => {
  const browser = await puppeteer.launch({ 
    headless: true,
    defaultViewport: null,
    args: [
        "--no-sandbox",
        '--disable-setuid-sandbox',
    ],
  });

  const page = await browser.newPage();
  page.on('console', msg => console.log(msg.text()));

  await page.goto('https://rushcard.io/deck-search/?&offset=0', {timeout: 0});
  await page.setDefaultNavigationTimeout(0);

  const final = await page.waitForSelector('.card-img-overlay').then(async () => {
    return await page.evaluate(() => {
      const { children } = document.querySelector('.deck-list')
      return Array.from(children).map(child => {
        const allText = child.querySelector('.card-title').textContent
        const latterText = child.querySelector('.card-title span').textContent
        return {
            url: child.querySelector('a').href,
            title: allText.slice(0, allText?.length - latterText?.length),
            latter: latterText,
            author: latterText.split(' ').reverse()[0]
        }
      })
    })
  })
  browser.close();
  return final.filter(obj => !obj.author?.toLowerCase()?.includes('spikek'))
};

module.exports.fetchData = fetchData