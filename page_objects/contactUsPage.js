const {expect} = require('@playwright/test')
const testData =  JSON.parse(JSON.stringify(require("../test_data/testData.json")))

class ContactUsPage {

    constructor(page) {
        
        this.page = page;
        
        this.firstNameField = page.locator('[placeholder="First Name"]');
        this.lastNameField = page.locator('[placeholder="Last Name"]');
        this.eMailAddressField = page.locator('[placeholder="Email Address"]');
        this.commentsField = page.locator('[placeholder="Comments"]');
        this.resetBtn = page.locator('[type="reset"]');
        this.submitBtn = page.locator('[type="submit"]');
        this.confirmation = page.locator('#contact_reply');
        this.errorMsg = page.locator('body')
    }

    async clickResetBtn() {
        await this.resetBtn.click()
    }

    async clickSubmitBtn() {
        await this.submitBtn.click()
    }   

    async fillForm (firstName, lastName, eMail, comments) {
        await this.firstNameField.type(firstName)
        await this.lastNameField.type(lastName)
        await this.eMailAddressField.type(eMail)
        await this.commentsField.type(comments)
    }

    async fillFormValidData () {
        await this.firstNameField.type(testData.firstName)
        await this.lastNameField.type(testData.lastName)
        await this.eMailAddressField.type(testData.eMail)
        await this.commentsField.type(testData.comments)
    }

    async checkConfirmation() {
        await expect(this.confirmation).toContainText('Thank You for your Message!')
    }

    async checkIncompleteErrorMessage() {
        await expect(this.errorMsg).toContainText('Error: all fields are required')
    }

    async checkEmailErrorMessage() {
        await expect(this.errorMsg).toContainText('Error: Invalid email address')
    }
}

module.exports = {ContactUsPage};