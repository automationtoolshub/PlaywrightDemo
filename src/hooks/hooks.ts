/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  BeforeAll,
  AfterAll,
  After,
  Before,
  AfterStep,
} from '@cucumber/cucumber'
import {
  chromium,
  Browser,
  BrowserContext,
  webkit,
  firefox,
} from '@playwright/test'
import { commonPage } from './commonPage'
import fs = require('fs-extra')
import path = require('path')

let browser: Browser
let context: BrowserContext
const headlessFlag =
  process.env.headless == undefined ? 'false' : process.env.headless
let browserType = process.env.browserType == undefined ? 'chrome' : process.env.browserType

BeforeAll(async () => {
  browserType = browserType.toUpperCase()
  if(browserType.toUpperCase()=='CHROME'){
    browser = await chromium.launch({
      //args: ['--start-maximized'],
      channel: 'chrome',
      headless: JSON.parse(headlessFlag),
      slowMo: 100,
    })
  }
  if(browserType.toUpperCase()=='FIREFOX'){
  browser = await firefox.launch({
    channel: 'firefox',
    headless: JSON.parse(headlessFlag),
    slowMo: 100,
  })
  }
  if(browserType.toUpperCase()=='EDGE'){
  browser = await chromium.launch({
    channel: 'msedge',
    headless: false,
    slowMo: 100,
  })
  }
  if(browserType.toUpperCase()=='SAFARI'){
  browser = await webkit.launch({
    headless: false,
    slowMo: 100,
  })
  }
})

Before(async function () {
  //await Utility.deleteDebugLog()
  context = await browser.newContext({
    ignoreHTTPSErrors: true,
    viewport: { width: 1920, height: 1080 },
  })
  const page = await context.newPage()

  //const page = await browser.newPage()
  commonPage.page = page
  //await commonPage.page.setDefaultTimeout(40000) //set global timeout for element
})

After(async function ({ pickle, result }) {
  await commonPage.page.waitForTimeout(5000)
  await context.clearCookies()
  await commonPage.page.close()
  await context.close()
})

AfterAll(async function () {
  //await Utility.createPropertiesFile()
  await browser.close()
})


AfterStep(async function ({ pickle }) {
  const img: Buffer = await commonPage.page.screenshot({
    path: `reports/screenshots/${pickle.name}.png`,
    type: 'png',
  })
  //videoPath = await commonPage.page.video().path()
  this.attach(img, 'image/png')
  //this.attach(fs.readFileSync(videoPath), 'video/webm')
})
