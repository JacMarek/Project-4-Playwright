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
        onMainPage.goToContactUsPage()
    ])

    await page2.waitForLoadState('networkidle')

    const poManager2 = new POManager(page2)
    const onContactUsPage = poManager2.getContactUsPageClass()
    
    context.page = page
    context.page2 = page2
    context.poManager = poManager
    context.poManager2 = poManager2
    context.onMainPage = onMainPage
    context.onContactUsPage = onContactUsPage
})

test("Fill in and send the form", async ({context}) => {
    
    //destrukturyzuje obiekt context i tworzy zmienne lokalne, które są zainicjalizowane wartościami odpowiadającymi tym samym kluczom w obiekcie context
    const {onContactUsPage} = context

    await onContactUsPage.fillFormValidData()
    await onContactUsPage.clickSubmitBtn()
    await onContactUsPage.checkConfirmation()
})

test("Reset data in the form", async ({context}) => {
    
    const {onContactUsPage} = context

    await onContactUsPage.fillFormValidData()
    await onContactUsPage.clickResetBtn()
    await expect(onContactUsPage.firstNameField).toBeEmpty()
    await expect(onContactUsPage.lastNameField).toBeEmpty()
    await expect(onContactUsPage.eMailAddressField).toBeEmpty()
    await expect(onContactUsPage.commentsField).toBeEmpty()
})

test("Submit a blank form", async ({context}) => {
    
    const {onContactUsPage} = context

    await onContactUsPage.clickSubmitBtn()
    await onContactUsPage.checkIncompleteErrorMessage()
    await onContactUsPage.checkEmailErrorMessage()
})

test("Submit the form with one blank field", async ({context}) => {

    const {onContactUsPage, page2} = context

    await onContactUsPage.fillFormValidData()

    const inputs = [onContactUsPage.firstNameField, onContactUsPage.lastNameField, onContactUsPage.eMailAddressField, onContactUsPage.commentsField]
    for(let i=0; i<4; i++) {
        let field = await inputs[i]
        //nie wiem czemu nie działa getProperty('value')
        let value = await field.evaluate((element) => element.value)

        await field.clear()
        await onContactUsPage.clickSubmitBtn()
        await onContactUsPage.checkIncompleteErrorMessage()
        if(i==2) {
          onContactUsPage.checkEmailErrorMessage()
        }
        await page2.goBack()
        await field.fill(value)
    }
})

for(const email of testData.validEmail) {
    test(`Verify e-mail - positive scenarios for ${email}`, async ({context}) => {

        const {onContactUsPage} = context

        await onContactUsPage.fillFormValidData()

        await onContactUsPage.eMailAddressField.clear()
        await onContactUsPage.eMailAddressField.fill(email)
        await onContactUsPage.clickSubmitBtn()
        await onContactUsPage.checkConfirmation()
    })
}

for(const email of testData.invalidEmail) {
    test(`Verify e-mail - negative scenarios for ${email}`, async ({context}) => {

        const {onContactUsPage} = context

        await onContactUsPage.fillFormValidData()

        await onContactUsPage.eMailAddressField.clear()
        await onContactUsPage.eMailAddressField.fill(email)
        await onContactUsPage.clickSubmitBtn()
        await onContactUsPage.checkEmailErrorMessage()
    })
}
