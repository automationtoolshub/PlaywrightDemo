/* eslint-disable @typescript-eslint/no-explicit-any */
 
//import { chromium, expect } from '@playwright/test'
import { expect } from '@playwright/test'
import { commonPage } from '../../hooks/commonPage'
import { ApplicationConstants } from '../constants/ApplicationConstants'
import { Utility } from '../utility/Utility'
import { PageObjectLoginPage } from '../pageObject/PageObjectLoginPage'

export class LoginPage {
  public async navigateToPage(context: any) {
    console.log('Url: ', ApplicationConstants.URL)
    await commonPage.page.goto(ApplicationConstants.URL, {
      timeout: 120000,
    })
    await Utility.attachMessageToReport(
      ` Login:${ApplicationConstants.URL}`,
      context
    )
  }

  public async enterLoginCredentials(context: any) {
    console.log('Loign password:', ApplicationConstants.USER_NAME)
    const elementUserName = await commonPage.page
      .locator(PageObjectLoginPage.USER_NAME)
      const elementPassword = await commonPage.page
      .locator(PageObjectLoginPage.USER_PASSWORD)
    await elementUserName.clear()
    await elementUserName.fill(ApplicationConstants.USER_NAME)
    await elementPassword.clear()
    await elementPassword.fill(ApplicationConstants.USER_PASSWORD)
    await Utility.attachMessageToReport(
      `Login UserName :${ApplicationConstants.USER_NAME}`,
      context
    )
    await Utility.attachMessageToReport(
      `Login Password :${ApplicationConstants.USER_PASSWORD}`,
      context
    )
  }

  public async clickLoginButton() {
    await commonPage.page
      .locator(PageObjectLoginPage.LOGIN_BUTTON)
      .click()
  }

  public async verifyErrorPage() {
    const errorMessage = await commonPage.page
      .locator(PageObjectLoginPage.LOGIN_ERROR_MESSAGE)
      .textContent()
    expect(errorMessage).toContain('Having problems logging')
    console.log(errorMessage)
  }

}
