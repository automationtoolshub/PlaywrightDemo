//import { Given, setDefaultTimeout, Then, When } from '@cucumber/cucumber'
import {
  Given,
  setDefaultTimeout,
  setWorldConstructor,
  Then,
} from '@cucumber/cucumber'
import { CucumberAllureWorld } from 'allure-cucumberjs'
import { GetProductApi, getProductResponse } from '../api/GetProductApi'
import { Utility } from '../utility/Utility'
setWorldConstructor(CucumberAllureWorld)
setDefaultTimeout(120 * 60 * 1000)
const getProdcutApi = new GetProductApi()

Given(/^Hit GetProdcut Api Api endpoint$/,  async function () {
	await getProdcutApi.toGetProdcuts()
  await Utility.attachApiInfoToReport(getProductResponse, this)
})

Then(/^Retrieve prodcut ids from resposne$/, async function()  {
	await getProdcutApi.getListOfIds()
  const ele = (await getProdcutApi.getListOfIds()).toString()
  await Utility.attachMessageToReport(ele,this)
})
