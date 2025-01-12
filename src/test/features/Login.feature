Feature: Bank of America Home page

    @smoke
    Scenario: Login - Bank of America 
        Given Launch the Application
        When Enter login credentials in the page
        Then Click Login Button
        Then Verify the error message is displayed

    @smoke @api
    Scenario: Verify Fake API Resposne
        Given Hit GetProdcut Api Api endpoint
        Then Retrieve prodcut ids from resposne
