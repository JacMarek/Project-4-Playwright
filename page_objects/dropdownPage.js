
class DropdownPage {

    constructor(page) {
        
        this.page = page;
        
        this.dropdownMenus = page.locator('.section-title:has(#dropdowm-menu-1)').locator('select')
        this.checkboxes = page.locator('[type="checkbox"]')   
        this.radioBtns = page.locator('#radio-buttons > input')
    }
}

module.exports = {DropdownPage}