//import { Given, setDefaultTimeout, Then, When } from '@cucumber/cucumber'
import { LoginPage } from '../pages/LoginPage'
import {
  Given,
  setDefaultTimeout,
  setWorldConstructor,
  Then,
  When,
} from '@cucumber/cucumber'
import { CucumberAllureWorld } from 'allure-cucumberjs'

setWorldConstructor(CucumberAllureWorld)
setDefaultTimeout(120 * 60 * 1000)
const loginPage = new LoginPage()

Then(/^Click Login Button$/, async function () {
  await loginPage.clickLoginButton()
})

Given(/^Launch the Application$/,  async function ()  {
  await loginPage.navigateToPage(this)
});

When(/^Enter login credentials in the page$/,  async function () {
	await loginPage.enterLoginCredentials(this)
});


Then(/^Verify the error message is displayed$/, async function () {
	await loginPage.verifyErrorPage()
});



