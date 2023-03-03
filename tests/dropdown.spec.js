const {test, expect} = require('@playwright/test')
const {POManager} = require('../page_objects/POManager')
const testData =  JSON.parse(JSON.stringify(require("../test_data/testData.json")))

test.beforeEach( async ({context}) => {
  
    const page = await context.newPage()
    const poManager = new POManager(page)
    const onMainPage = poManager.getMainPageClass()

    await page.goto("https://webdriveruniversity.com/")
    const [page2] = await Promise.all([

        context.waitForEvent('page'),
        onMainPage.goToDropdownPage()
    ])

    await page2.waitForLoadState('networkidle')

    const poManager2 = new POManager(page2)
    const onDropdownPage = poManager2.getDropdownPageClass()
    
    context.page = page
    context.page2 = page2
    context.poManager = poManager
    context.poManager2 = poManager2
    context.onMainPage = onMainPage
    context.onDropdownPage = onDropdownPage
})

test("Dropdown values", async ({context}) => {
    
    const {onDropdownPage, page2} = context

    const menus = await onDropdownPage.dropdownMenus
    let menusText = []
    const count = await menus.count()
    
    for(let i=0; i<count; i++) {
        
        const options = await menus.nth(i).locator("option")
        const count2 = await options.count()
        
        for(let y=0; y<count2; y++) {
            
            const dropdownValue = await options.nth(y).textContent()
            await menusText.push(dropdownValue)
            await menus.nth(i).selectOption(dropdownValue)

            const selectedOption = await menus.nth(i).locator("option:checked")
            const selectedText = await selectedOption.innerText()
            await expect(selectedText).toEqual(dropdownValue)
            await expect(testData.dropdownValues).toContain(selectedText)
            await expect (options.nth(y)).toHaveJSProperty('selected', true)
            await expect (options.nth(y)).toHaveJSProperty('text', dropdownValue)
        }
    }
    
    await testData.dropdownValues.forEach(dropdownOption => {
        console.log(menusText)
        expect(menusText).toContain(dropdownOption)
    })
})

test("Checkboxes", async ({context}) => {
    
    const {onDropdownPage, page2} = context
    const checkboxes = await onDropdownPage.checkboxes
    const count = await checkboxes.count()
    
    for(let i=0; i<count; i++) {
        
        const input = checkboxes.nth(i)
        if(!(await input.isChecked())) {
            await input.click()
        }
        expect(await input.isChecked()).toBeTruthy()
    }
    
    for(let i=0; i<count; i++) {
        
        const input = checkboxes.nth(i)
        if(i == 0 || i == 2) {
            await input.click()
            expect(await input.isChecked()).toBeFalsy()
        }
    }
})

test("Radiobuttons", async ({context}) => {
    
    const {onDropdownPage, page2} = context

    const inputs = await onDropdownPage.radioBtns
    const count = await inputs.count()
    

    for(let i=0; i<count; i++) {
        
        const inputToSelect = inputs.nth(i)
        await inputToSelect.click()
        
        for(let y=0; y<count; y++) {
            
            const inputToCheck = inputs.nth(y)
            
            if (i==y) {
                expect(await inputToCheck.isChecked()).toBeTruthy()
            } else {
                expect(await inputToCheck.isChecked()).toBeFalsy()
            }
        }
    }
})
