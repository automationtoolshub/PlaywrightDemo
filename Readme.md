**CRSP Purple Router - Portal Page**

This Repository is created for PlayWright

**Prerequisite**

1. Install Visual Studio Code IDE
2. Type node -v command to verify the node version
3. If node is not installed run the following command brew install node (After install just ensure Node vesrion and it should be >16)

**Steps for running Scripts**

1. clone the project from master branch
2. npm install (run this command from where package.json is present)
3. npm run test (Ex: if you run this command via terminal, it will run the scripts.If you want to modify settings, you can edit the details in scripts block in package.json )
4. npm run report (To Generate cucumber report)
5. npm run allure (To Generate allure report)
6. Once run the step 5 command, browser will opened with the following pattern http://<some ip address?:<portnumber> (Ex: http://192.168.0.11:55749/)
7. Just change the url as http://localhost:55749 to view the report.

**PlayWright Folder Structure**

1. **src\tes\pageObject** - Keeping all page object related files for each UI page
2. **src\tes\page** - keeping functions for each UI page
3. **src\tes\stepDefinitions** - keep all step definition files which are generated from feature file
4. **scr\test\Constants** - To maintain all constant variables like url,label text, button text, etc..
5. **scr\test\features** - To write use cases in Gherkin language and save the file in .feature extension
6. **src\test\testData** - To maintain test data files 
7. **src\test\hooks** - Written common function for opening the browser
8. **cucumber.json** - This file is present in the root directory. PlayWright always refer this file while executing the test.