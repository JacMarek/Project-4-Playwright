const {ContactUsPage} = require('./contactUsPage');
const {MainPage} = require('./mainPage')
const {DropdownPage} = require('./dropdownPage')


class POManager {
    constructor(page) {
        this.page = page

        this.mainPageClass = new MainPage(this.page)
        this.contactUsPageClass = new ContactUsPage(this.page)
        this.dropdownPageClass = new DropdownPage(this.page)
    }

    getMainPageClass() {
        return this.mainPageClass
    }

    getContactUsPageClass() {
        return this.contactUsPageClass
    }

    getDropdownPageClass() {
        return this.dropdownPageClass
    }

}

module.exports = {POManager};