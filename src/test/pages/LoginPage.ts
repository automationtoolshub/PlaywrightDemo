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

  public async clickUserIcon() {
    await commonPage.page.locator(PageObjectRouterLoginPage.USER_ICON).click()
  }
  public async clickSignOut() {
    await commonPage.page
      .locator(PageObjectRouterLoginPage.SIGN_OUT_LINK)
      .click()
  }

  public async clickShowPasswordIcon() {
    const element = await commonPage.page
      .locator(PageObjectRouterLoginPage.SHOW_PASSWORD_ICON)
    await element.isVisible()
    await element.click()
  }

  public async verifyPasswordIsNotMasked(context: any) {
    const element = await commonPage.page
      .locator(PageObjectRouterLoginPage.PASSWORD)
    let elementText = await element.getAttribute('type')
    if (elementText.toUpperCase().includes('PASSWORD')) {
      await this.clickShowPasswordIcon()
      elementText = await element.getAttribute('type')
      console.log("await element.getAttribute('type')", elementText)
    }
    await Utility.attachMessageToReport('Password is Visible', context)
    expect(elementText.toUpperCase().includes('TEXT')).toEqual(true)
  }

  public async verifyPasswordIsMasked(context: any) {
    const element = await commonPage.page
      .locator(PageObjectRouterLoginPage.PASSWORD)
    let elementText = await element.getAttribute('type')
    if (elementText.toUpperCase().includes('TEXT')) {
      await this.clickShowPasswordIcon()
      elementText = await element.getAttribute('type')
    }
    await Utility.attachMessageToReport('Password is Masked', context)
    expect(elementText.toUpperCase().includes('PASSWORD')).toEqual(true)
  }

}
