import java.util.Base64

def allNetworkServicesArray = []
def setWifiServiceString = ''
def setEthernetServiceString = ''
def firmwareVersion = ''
def apiUrl = ''
def apiResponse = ''
def jsonResponse = ''
def subject = ''
def buildResult = ''
def updatedEmailSubject = ''
def toEmailAddress = 'test@gmail.com'
def toEmailAddressForError = 'test@gmail.com'
def fromEmailAddress = 'test@gmail.com'

pipeline {
    agent {
        label 'MacMini'
    }
    parameters {
        choice(name: 'browserType', choices: 'chrome\nfirefox\nedge\nsafari', description: 'Choose Browser Type')
        choice(name: 'headless', choices: 'true\nfalse', description: 'Chose headless')
    }
    options {
        skipDefaultCheckout(true)
        buildDiscarder(logRotator(artifactDaysToKeepStr: '720', artifactNumToKeepStr: '-1', daysToKeepStr: '720', numToKeepStr: ''))
    }
    environment {
        PATH = "/usr/local/bin:/opt/homebrew/bin:/usr/sbin:$PATH"
        projName = 'PurpleRouter'
        repository = 'https://gitubu.net/stash/scm/crspqa/playwrightDemo.git'
        EMAIL_SUBJECT = "Playwright - Testing - jobStatus"
        ALTERNATE_EMAIL_SUBJECT = "Playwright - Testing - Testing - jobStatus"
    }
    triggers {
        cron('0 6 * * *')
    }
    stages {
        stage('Connect to LAN Network') {
            steps {
                script {
                    echo '============================== Get List of Services ===================================================='
                    allNetworkServicesArray = getAllNetworkServicesArray()
                    echo "======= Network List: ${allNetworkServicesArray} ============================================================"
                    setWifiServiceString = rearrangeNetworkServices('Wi-Fi', allNetworkServicesArray)
                    echo "============== Formatted Network String for Wifi: ${setWifiServiceString} =============================="
                    setEthernetServiceString = rearrangeNetworkServices('Ethernet', allNetworkServicesArray)
                    echo "============== Formatted Network Network String for Ethernet: ${setEthernetServiceString} ==============="
                    echo '========================== Switching to LAN Network ======================================='
                    sh "networksetup -ordernetworkservices ${setEthernetServiceString}"
                }
            }
        }
        stage('Clean Workspace') {
            steps {
                script {
                    echo '<========== Cleaning the workspace ===========>'
                    cleanWs()  // Clean workspace
                    echo '<========== Successfully Cleaned the workspace ===========>'
                }
            }
        }
        stage('Checkout SCM') {
            steps {
                echo '============================== Check out Source file from Git =========================================='
                checkout scm
            }
        }
        stage('NPM Install') {
            steps {
                script {
                    echo '============================== Set WiFi network for install npm command ============================='
                    sh "networksetup -ordernetworkservices ${setWifiServiceString}"
                    echo '============================== NPM Install ======================================================='
                    sh 'npm cache clean --force'
                    sh 'npm install -f'
                }
            }
        }

        stage('Purple_Regression') {
            steps {
                script {
                    echo '========================== Switching to LAN for running application ======================================='
                    sh "networksetup -ordernetworkservices ${setEthernetServiceString}"
                    echo '============================ Started Running Regression Test Cases ========================='
                    sh "browserType=${params.browserType} headless==${params.headless} ./node_modules/.bin/cucumber-js test --tags '@smoke'"
                }
            }
        }
    }

    post {
        always {
            script {
                try {
                    generateAndPublishReports()
                    buildResult = currentBuild.currentResult
                    firmwareVersion = getSoftwareVersion()
                    echo "Firmware Version: ${firmwareVersion}"
                    if (firmwareVersion != null && firmwareVersion != '' && firmwareVersion != 'undefined') {
                        updatedEmailSubject = env.EMAIL_SUBJECT
                        .replace("appVersion", "${firmwareVersion}")
                        .replace("jobStatus", "${buildResult}")
                    } else {
                        updatedEmailSubject = env.ALTERNATE_EMAIL_SUBJECT.replace("jobStatus", "${buildResult}")
                    }

                    def dataPackageFilePath = "${WORKSPACE}/reports/allure-report/data/packages.json"
                    def dataPackageFileContent = readFile(dataPackageFilePath)
                    def dataPackageJsonData = readJSON text: dataPackageFileContent

                    def widgetSummaryFilePath = "${WORKSPACE}/reports/allure-report/widgets/summary.json"
                    def widgetSummaryFileContent = readFile(widgetSummaryFilePath)
                    def dataSummaryJsonData = readJSON text: widgetSummaryFileContent
                    def statisticObject = dataSummaryJsonData.statistic

                    // Pass/Fail count
                    def totalCount = statisticObject.total
                    def passedCount = statisticObject.passed
                    def failCount = totalCount - passedCount

                    if (buildResult == 'SUCCESS') {
                        sendEmail(statisticObject, dataPackageJsonData, updatedEmailSubject,fromEmailAddress, toEmailAddress)
                    } else if (buildResult == 'FAILURE') {
                        updatedEmailSubject = updatedEmailSubject + " (${failCount} failed out of ${totalCount})"
                        sendEmail(statisticObject, dataPackageJsonData, updatedEmailSubject,fromEmailAddress,toEmailAddress)
                    } else {
                        sendEmail(statisticObject, dataPackageJsonData, updatedEmailSubject,fromEmailAddress, toEmailAddressForError)
                    }
                } catch (Exception e) {
                    updatedEmailSubject = env.ALTERNATE_EMAIL_SUBJECT.replace("jobStatus", "Exception")
                    sendErrorEmail(updatedEmailSubject, fromEmailAddress,toEmailAddressForError, e)
                    echo "Exception: ${e.message}"
                }
                // finally{
                //     echo '<========== Cleaning the workspace ===========>'
                //     cleanWs()  // Clean workspace
                //     echo '<========== Successfully Cleaned the workspace ===========>'
                // }
            }
        }
    }
}

// Get list of all network services
def getAllNetworkServicesArray() {
    def networkServices = sh(returnStdout: true, script: 'networksetup -listallnetworkservices')
    def lines = networkServices.trim().split('\n')[1..-1]
    def networkServiceArray = lines.collect { service -> service.contains(' ') ? "\"${service}\"" : service }
    return networkServiceArray
}

// Reorder network services
def rearrangeNetworkServices(serviceToMove, serviceArray) {
    def rearrangedArray = serviceArray.clone()
    def index = rearrangedArray.indexOf(serviceToMove)
    if (index >= 0) {
        rearrangedArray.remove(index)
        rearrangedArray = [serviceToMove] + rearrangedArray
    }
    return rearrangedArray.join(' ')
}

// Get software version from router API
// def getSoftwareVersion(apiUrl, routerPassword) {
//     def authString = "admin:"+routerPassword
    
//     // Encode the authorization string using Java's Base64 encoder
//     def encodedAuth = "Basic " + Base64.getEncoder().encodeToString(authString.getBytes("UTF-8"))
//     // Execute the curl command to make a GET request with the Authorization header
//     def response = sh(script: """
//         curl --location --request GET '${apiUrl}' \\
//         --header 'Authorization: ${encodedAuth}' --insecure
//     """, returnStdout: true).trim()
    
//     // Return the response
//     return response
// }

def getSoftwareVersion() {
    // Read the properties file and return only the SoftwareVersion
    def props = readProperties file: "${WORKSPACE}/reports/allure-results/environment.properties"
      // Print the properties for debugging
    echo "Properties file content: ${props}"
    return props['SoftwareVersion']  // Return just the SoftwareVersion property
}

// Calculate pass percentage
def calculatePassPercentage(passed, total) {
    return total == 0 ? 0 : Math.round((passed * 100.0 / total) as double)
}

// Generate the email subject dynamically
def getEmailSubject(firmwareVersion, buildResult) {
    if (firmwareVersion && firmwareVersion != 'undefined') {
        return env.EMAIL_SUBJECT.replace("appVersion", firmwareVersion).replace("jobStatus", buildResult)
    } else {
        return env.ALTERNATE_EMAIL_SUBJECT.replace("jobStatus", buildResult)
    }
}

// Generate and publish reports (Allure)
def generateAndPublishReports() {
    sh './node_modules/.bin/allure generate allure-results --clean -o allure-report'
    allure([
        includeProperties: false,
        jdk: '',
        reportBuildPolicy: 'ALWAYS',
        results: [[path: 'allure-results']]
    ])
    sh 'npx ts-node src/helper/report/cucumberReport.ts'
    publishHTML([
        allowMissing: false,
        alwaysLinkToLastBuild: true,
        keepAll: true,
        reportDir: 'reports/cucumberReport',
        reportFiles: 'index.html',
        reportName: 'Cucumber HTML Report'
    ])
    archiveArtifacts artifacts: 'reports/cucumberReport/**', allowEmptyArchive: true
}

// Create email body (HTML) for the results
def createEmailBody(Map statisticObject, Map dataPackageJsonData) {
    def totalCount = statisticObject.total
    def passedCount = statisticObject.passed
    def failedCount = statisticObject.failed
    def brokenCount = statisticObject.broken
    def skippedCount = statisticObject.skipped
    def unknownCount = statisticObject.unknown
    def passPercentage = calculatePassPercentage(passedCount, totalCount)
    def failPercentage = 100 - passPercentage

    def body = """
    <html>
    <body>
        <p><strong><span style="color:blue">Build:</span></strong> <a href="${BUILD_URL}">${BUILD_URL}</a></p>
        <p><strong><span style="color:blue">Refer the below link to view more information above execution Details:</span></strong></p>
        <p><strong><span style="color:blue">Allure Report:</span></strong> <a href="${env.BUILD_URL}allure">${env.BUILD_URL}allure</a></p><br>
        <table border="1">
            <tr>
                <th>Testing Type</th>
                <th>Total</th>
                <th>Passed</th>
                <th>Failed</th>
                <th>Broken</th>
                <th>Skipped</th>
                <th>Unknown</th>
                <th>Pass%</th>
                <th>Fail%</th>
            </tr>
            <tr>
                <td><strong><span style="color:blue">PSanity</span></strong></td>
                <td><strong>${totalCount}</strong></td>
                <td><strong><span style="color:green">${passedCount}</span></strong></td>
                <td><strong><span style="color:red">${failedCount}</span></strong></td>
                <td><strong><span style="color:red">${brokenCount}</span></strong></td>
                <td><strong><span style="color:red">${skippedCount}</span></strong></td>
                <td><strong><span style="color:red">${unknownCount}</span></strong></td>
                <td><strong><span style="color:green">${passPercentage}%</span></strong></td>
                <td><strong><span style="color:red">${failPercentage}%</span></strong></td>
            </tr>
        </table>

        <br><table border="1">
            <tr>
                <th>S.No</th>
                <th>TestCase Name</th>
                <th>Status</th>
            </tr>
    """
    def serialNumber = 1
    dataPackageJsonData.children.each { item ->
        def name = item.name.toUpperCase()
        def status = item.status.toUpperCase()
        def statusColor = status == 'PASSED' ? 'green' : 'red'
        body += """
            <tr>
                <td style="text-align: center;"><strong><span style="color:black">${serialNumber}</span></strong></td>
                <td style="text-align: left;"><strong><span style="color:green">${name}</span></strong></td>
                <td style="text-align: left;"><strong><span style="color:${statusColor}">${status}</span></strong></td>
            </tr>
        """
        serialNumber++
    }
    body += """
        </table>
    </body>
    </html>
    """
    return body
}

// Send the email notification
def sendEmail(Map statisticObject, Map dataPackageJsonData, String emailSubject, String fromEmailAddress,String toEmailAddress) {
    def body = createEmailBody(statisticObject, dataPackageJsonData)
    emailext(
        to: toEmailAddress,
        subject: emailSubject,
        body: body,
        mimeType: 'text/html',
        from: fromEmailAddress
    )
}

// Error Email Notification
def sendErrorEmail(String emailSubject,String fromEmailAddress, String toEmailAddress, Exception e) {
    def errorMessage = """
    An error occurred during pipeline execution:
    ${e.message}  
    Build URL: ${BUILD_URL}
    """
    emailext(
        to: toEmailAddress,
        subject: emailSubject,
        body: errorMessage,
        mimeType: 'text/html',
        from: fromEmailAddress
    )
}
