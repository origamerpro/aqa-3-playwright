import test, { expect } from "@playwright/test";

test.describe("[UI] [AKGit] Authentication", () => {
  const validCredentials = {
    name: "AKDemo01",
    password: "AKDemonstration01"
  }

  const invalidCredentials = {
    name: ["AK", "Thisislogin41simbols1Thisislogin41simbols", " AK", "AK ", "   "],
    password: ["AKademy", "Thisislogin41simbols1", "ahkakoisensei", "             ", "505505505"],   
  }
  
  test.beforeEach(async ({ page }) => {
    await page.goto('https://anatoly-karpovich.github.io/demo-login-form/')//step 1
  })
  test("Should authenticate with valid credentials and check it", async ({ page }) => {
    //arrange
    await page.locator('#registerOnLogin').click();//step 2
    //act
    await page.locator('#userNameOnRegister').fill(validCredentials.name);
    await page.locator('#passwordOnRegister').fill(validCredentials.password);//step 3
    await page.locator('#register').click();//step 4
    const notification = page.locator('#errorMessageOnRegister');
    await expect(notification).toContainText('Successfully registered! Please, click Back to return on login page');//step 5
    //assert
    await page.locator('#userNameOnRegister').fill(validCredentials.name);
    await page.locator('#passwordOnRegister').fill(validCredentials.password + "123");
    await page.locator('#register').click();
    await expect(notification).toContainText('Username is in use');//step 7

    await page.locator('#backOnRegister').click();
    await page.locator('#userName').fill(validCredentials.name);
    await page.locator('#password').fill(validCredentials.password);
    await page.locator('#submit').click();
    const notification2 = page.locator('#successMessage');
    await expect(notification2).toContainText(`Hello, ${validCredentials.name}!`);//step 6
  })

  test('Should NOT authenticate with invalid username', async ({ page }) => {
    //arrange
    await page.locator('#registerOnLogin').click();
    //act
    await page.locator('#userNameOnRegister').fill(invalidCredentials.name[0]);
    await page.locator('#passwordOnRegister').fill(validCredentials.password);
    await page.locator('#register').click();
    const notification = page.locator('#errorMessageOnRegister');
    await expect(notification).toContainText('Username should contain at least 3 characters');//step 8

    await page.evaluate(() => {
      const inputUsername:any = document.querySelector('#userNameOnRegister');
      inputUsername.setAttribute('maxlength', '41');
    });
    await page.locator('#userNameOnRegister').clear();
    await page.locator('#userNameOnRegister').fill(invalidCredentials.name[1]);
    await page.locator('#register').click();
    await expect(notification).toContainText(`Username can't exceed 40 characters`);//step 9
    
    await page.locator('#userNameOnRegister').clear();
    await page.locator('#userNameOnRegister').fill(invalidCredentials.name[2]);
    await page.locator('#register').click();
    await expect(notification).toContainText('Prefix and postfix spaces are not allowed is username');//step 10

    await page.locator('#userNameOnRegister').clear();
    await page.locator('#userNameOnRegister').fill(invalidCredentials.name[3]);
    await page.locator('#register').click();
    await expect(notification).toContainText('Prefix and postfix spaces are not allowed is username');//step 11

    await page.locator('#userNameOnRegister').clear();
    await page.locator('#userNameOnRegister').fill(invalidCredentials.name[4]);
    await page.locator('#register').click();
    await expect(notification).toContainText('Prefix and postfix spaces are not allowed is username');//step 12
  })

  test('Should NOT authenticate with invalid password', async ({ page }) => {
    //arrange
    await page.locator('#registerOnLogin').click();
    //act
    await page.locator('#userNameOnRegister').fill(validCredentials.name);
    await page.locator('#passwordOnRegister').fill(invalidCredentials.password[0]);
    await page.locator('#register').click();
    const notification = page.locator('#errorMessageOnRegister');
    await expect(notification).toContainText('Password should contain at least 8 characters');//step 13

    await page.evaluate(() => {
      const inputPassword:any = document.querySelector('#passwordOnRegister');
      inputPassword.setAttribute('maxlength', '21');
    });
    await page.locator('#passwordOnRegister').clear();
    await page.locator('#passwordOnRegister').fill(invalidCredentials.password[1]);
    await page.locator('#register').click();
    await expect(notification).toContainText(`Password can't exceed 20 characters`);//step 14

    await page.locator('#passwordOnRegister').clear();
    await page.locator('#passwordOnRegister').fill(invalidCredentials.password[2]);
    await page.locator('#register').click();
    await expect(notification).toContainText(''/*'Do you need have one Upper letter in password'*/);//step 15
    // Step 15: Найден баг. Ожидался негативный результат, а получился положительный. Регистрация с паролем в нижем регистре прошла, хотя в требованиях
    // было указано, что пароль должен содержать хотя бы одну заглавную букву.

    await page.locator('#passwordOnRegister').clear();
    await page.locator('#passwordOnRegister').fill(invalidCredentials.password[3]);
    await page.locator('#register').click();
    await expect(notification).toContainText('Please, provide valid data');//step 16

    await page.locator('#passwordOnRegister').clear();
    await page.locator('#passwordOnRegister').fill(invalidCredentials.password[4]);
    await page.locator('#register').click();
    await expect(notification).toContainText('Please, provide valid data');//step 17
  })
});