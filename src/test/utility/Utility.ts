/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
export let dataModelResponse: any
//export let allActiveDeviceListFromDataModel: any = {}
import fs = require('fs/promises')
import fs1 = require('fs')
import path = require('path')
import moment from 'moment'
import { commonPage } from '../../hooks/commonPage'
export const cpuArray: any = []
export const memoryArray: any = []
import * as crypto from 'crypto'
import https from 'https'
import axios from 'axios'
import { expect } from '@playwright/test'
import { exec } from 'child_process'
//import fsExtra = require('fs-extra')
let token: any
export let logFilePath: string
export class Utility {
  //private conn: Client
 // static conn: Client

  public static sortObject(jsonObject: { [key: string]: any }): {
    [key: string]: any
  } {
    const sortedKeys = Object.keys(jsonObject).sort()
    const sortedJson: { [key: string]: any } = {}
    sortedKeys.forEach((key) => {
      sortedJson[key] = jsonObject[key]
    })
    return sortedJson
  }

  public async writeToJSON(fileName: string, data: any) {
    try {
      const folderPath = './output'
      const filePath = path.join('./output', fileName)
      await fs.mkdir(folderPath, { recursive: true })
      await fs.writeFile(filePath, JSON.stringify(data, null, 2))
    } catch (error) {
      console.log(error)
    }
  }

  public convertDataModelContentToJson(content: any) {
    // Split the content into lines
    const lines = content.trim().split('\n')

    // Initialize an empty object to store key-value pairs
    const jsonObj: { [key: string]: string } = {}

    // Process each line to extract key-value pairs
    lines.forEach((line) => {
      line = line.replace('>', '').trim()
      const keyValue = line.split('=')
      if (keyValue.length === 2) {
        const key = keyValue[0].trim()
        const value = keyValue[1].trim()
        jsonObj[key] = value
      } else {
        const key = line.trim()
        jsonObj[key] = '' // If no value is present, set it to an empty string
      }
    })
    return jsonObj
  }

  public async getDatamodevalue() {
    return await dataModelResponse?.[
      'Device.WiFi.AccessPoint.1.Security.X_VZ-COM_KeyPassphrase'
    ]
  }

  public static async generateSessionAuthFromUI() {
    const cookies = await commonPage.page.context().cookies()
    const targetCookie = cookies.find(
      (cookie) => cookie.name === 'MyNetworkSettingsAuth'
    ) // Find the cookie with the specified name
    const sessionAuth = targetCookie ? targetCookie.value : null
    console.log('sessionAuth:', sessionAuth)
    return sessionAuth
  }

  public static async generateUserNamePassword(input: string) {
    return new Promise((resolve, reject) => {
      // Construct the command
      const command = `openssl passwd -6 --salt ${token} ${input}`

      // Execute the command
      exec(command, (error, stdout, stderr) => {
        if (error) {
          console.error(`Error executing command: ${error.message}`)
          reject(error)
        } else if (stderr) {
          console.error(`Command stderr: ${stderr}`)
          reject(new Error(stderr))
        } else {
          // Resolve with the generated password hash
          resolve(stdout.trim())
        }
      })
    })
  }

  public static async attachApiInfoToReport(response: any, context: any) {
    const message =
      `URL: ${response?.config?.url}\n\n` +
       `Headers: ${JSON.stringify(response?.config.headers)}\n\n` +
      `Body: ${response?.config.data}\n\n` +
      `Response: \n${JSON.stringify(response?.data, null, 2)}`
    await context.attach(message)
  }

  public static async attachMessageToReport(message: string, context: any) {
    await context.attach(message)
  }


  public static async execCommandWithoutSSH(command: string): Promise<void> {
    return new Promise<void>((resolve) => {
      exec(command, (error, stdout, stderr) => {
        if (error) {
          // Log error details but don't reject the promise
          console.error(`Error executing command: ${command}`)
          console.error(`stderr: ${stderr}`)
          // Resolve the promise to continue execution
        }
        if (stderr) {
          console.warn(`stderr: ${stderr}`)
        }
        // Log successful execution if no errors
        if (!error) {
          console.log(`${command} is successfully executed`)
        }
        resolve() // Always resolve to continue execution
      })
    })
  }
}

