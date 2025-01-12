import report = require('multiple-cucumber-html-reporter')
import si from 'systeminformation'
// const osArray = getOSInfo()

// function getOSInfo() {
//   return si
//     .osInfo()
//     .then((osInfo) => {
//       console.log('OS Name:', osInfo.distro)
//       console.log('OS Version:', osInfo.release)
//       return [osInfo.distro, osInfo.release]
//     })
//     .catch((error) => {
//       console.error('Error retrieving OS information:', error)
//       return null
//     })
// }

// report.generate({
//   jsonDir: 'reports/cucumberReport',
//   reportName: 'Playwright Automation Report',
//   reportPath: './reports/cucumberReport',
//   metadata: {
//     browser: {
//       name: '',
//       version: '',
//     },
//     device: 'Local test machine',
//     platform: {
//       name: osArray[0],
//       version: osArray[1],
//     },
//   },
//   customData: {
//     title: 'Run info',
//     data: [
//       { label: 'Project', value: 'CRSP' },
//       { label: 'Application', value: 'Purple Router' },
//       { label: 'Test Suite', value: 'TECC API and UI' },
//     ],
//   },
// })

async function generateReport(osInfo) {
    report.generate({
        jsonDir: 'reports/cucumberReport',
        reportName: 'Playwright Automation Report',
        reportPath: './reports/cucumberReport',
        metadata: {
            browser: {
                name: '',
                version: '',
            },
            device: osInfo.distro,
            platform: {
                name: '',
                version: osInfo.release,
            },
        },
        customData: {
            title: 'Run info',
            data: [
                { label: 'Project', value: 'CRSP' },
                { label: 'Application', value: 'Purple Router' },
                { label: 'Test Suite', value: 'TECC API and UI' },
            ],
        },
    })
}

async function getOSInfoAndGenerateReport() {
    try {
        const osInfo = await si.osInfo()
        console.log('OS Name:', osInfo.distro)
        console.log('OS Version:', osInfo.release)
        await generateReport(osInfo)
    } catch (error) {
        console.error('Error retrieving OS information:', error)
        // Handle error
    }
}

getOSInfoAndGenerateReport()