const puppeteer = require("puppeteer");
const ora = require("ora");
require("dotenv").config();

const spinner = ora("Typerace").start();

const getRandomArbitrary = (min, max) => {
  return Math.floor(Math.random() * (max - min) + min);
};

const timeout = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

(async () => {
  const browser = await puppeteer.launch({ headless: false, timeout: 30000 });
  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 800 });
  await page.goto(process.env.TYPERACE_LINK, {
    waitUntil: "networkidle2",
  });

  await page.waitForSelector(".raceAgainLink", {
    visible: true,
  });

  spinner.text = "Got it";
  page.click(".raceAgainLink");

  const element = await page.$(".inputPanel tbody tr td div div");

  spinner.text = "Copy text";
  const content = await element.evaluate((e) => e.textContent);

  await page.waitForSelector(".txtInput:not([disabled])", {
    visible: true,
  });

  spinner.text = "Typing...";

  const splittedContent = content.split(" ");

  for (let word of splittedContent) {
    await timeout(getRandomArbitrary(0.4, 1.2) * 1000);
    await page.type(".txtInput", word + " ", {
      delay: 0.2,
    });
  }
})();
