class MainPage {

    constructor(page) {
        this.page = page
        this.contactUsSection = page.locator('#contact-us')
        this.dropdownSection = page.locator('#dropdown-checkboxes-radiobuttons')
    }

    async goToContactUsPage() {
        await this.contactUsSection.click()
    }

    async goToDropdownPage() {
        await this.dropdownSection.click()
    }
}

module.exports = {MainPage};