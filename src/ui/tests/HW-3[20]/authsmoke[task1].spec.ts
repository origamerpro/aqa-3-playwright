import test, { expect } from "@playwright/test";
import { error } from "console";

test.describe("[UI] [AKGit] Authentication", () => {
  const validCredentials = {
    name: "AKDemo01",
    password: "AKDemonstration01"
  }

  const invalidCredentials = {
    name: ["AK", "Thisislogin41simbols1Thisislogin41simbols", " AK", "AK ", "   "],
    password: ["AKademy", "Thisislogin41simbols1", "ahkakoisensei", "             ", "505505505"],   
  }
  
  enum Notifications {
    Bug = '',
    SuccessRegister = 'Successfully registered! Please, click Back to return on login page',
    UsernameUse = 'Username is in use',
    Username3symbols = 'Username should contain at least 3 characters',
    Username40symbols = 'Username can\'t exceed 40 characters',
    UsernamePrefixPostfixSpaces = 'Prefix and postfix spaces are not allowed is username',
    Password8symbols = 'Password should contain at least 8 characters',
    Password20symbols = 'Password can\'t exceed 20 characters',
    PasswordInvalidData = 'Please, provide valid data'
  }

  async function fillLoginForm(page: any, username?: string, password?: string) {
    if (username !== undefined) await page.locator('#userNameOnRegister').fill(username);
    if (password !== undefined) await page.locator('#passwordOnRegister').fill(password);
    await page.locator('#register').click();
      
  }

  async function errorMessageOnRegister(page: any, message: Notifications) {
    const errorMessage = page.locator('#errorMessageOnRegister');
    await expect(errorMessage).toContainText(message) 
  }
  
  test.beforeEach(async ({ page }) => {
    //arrange
    await page.goto('https://anatoly-karpovich.github.io/demo-login-form/')//step 1
    await page.locator('#registerOnLogin').click();//step 2
  })

  test("Should authenticate with valid credentials and check it", async ({ page }) => {
    //act
    await fillLoginForm(page, validCredentials.name, validCredentials.password);//step 3-4
    await errorMessageOnRegister(page, Notifications.SuccessRegister);//step 5

    //assert
    await fillLoginForm(page, validCredentials.name, validCredentials.password + "123");
    await errorMessageOnRegister(page, Notifications.UsernameUse);//step 7

    await page.locator('#backOnRegister').click();
    await page.locator('#userName').fill(validCredentials.name);
    await page.locator('#password').fill(validCredentials.password);
    await page.locator('#submit').click();
    const successMessage = page.locator('#successMessage');
    await expect(successMessage).toContainText(`Hello, ${validCredentials.name}!`);//step 6
  })

  test('Should NOT authenticate with invalid username', async ({ page }) => {
    const clear = page.locator('#userNameOnRegister').clear();
    //act
    await fillLoginForm(page, invalidCredentials.name[0], validCredentials.password);
    await errorMessageOnRegister(page, Notifications.Username3symbols);//step8

    await page.evaluate(() => {
      const inputUsername:any = document.querySelector('#userNameOnRegister');
      inputUsername.setAttribute('maxlength', '41');
    });
    await clear;
    await fillLoginForm (page, invalidCredentials.name[1])
    await errorMessageOnRegister(page, Notifications.Username40symbols);//step 9
    
    await clear;
    await fillLoginForm (page, invalidCredentials.name[2])
    await errorMessageOnRegister(page, Notifications.UsernamePrefixPostfixSpaces);//step 10

    await clear;
    await fillLoginForm (page, invalidCredentials.name[3])
    await errorMessageOnRegister(page, Notifications.UsernamePrefixPostfixSpaces);//step 11

    await clear;
    await fillLoginForm (page, invalidCredentials.name[4])
    await errorMessageOnRegister(page, Notifications.UsernamePrefixPostfixSpaces);//step 12
  })

  test('Should NOT authenticate with invalid password', async ({ page }) => {
    const clear = page.locator('#passwordOnRegister').clear();
    //act
    await fillLoginForm(page, validCredentials.name, invalidCredentials.password[0]);
    await errorMessageOnRegister(page, Notifications.Password8symbols);//step 13
    await clear;

    await page.evaluate(() => {
      const inputPassword:any = document.querySelector('#passwordOnRegister');
      inputPassword.setAttribute('maxlength', '21');
    });
    await fillLoginForm(page, undefined, invalidCredentials.password[1]);
    await errorMessageOnRegister(page, Notifications.Password20symbols);//step 14
    await clear;

    await fillLoginForm(page, undefined, invalidCredentials.password[2]);
    await errorMessageOnRegister(page, Notifications.Bug);//step 15
    /*'Do you need have one Upper letter in password'
    Step 15: Найден баг. Ожидался негативный результат, а получился положительный. Регистрация с паролем в нижем регистре прошла, хотя в требованиях
    было указано, что пароль должен содержать хотя бы одну заглавную букву.*/
    await clear;

    await fillLoginForm(page, undefined, invalidCredentials.password[3]);
    await errorMessageOnRegister(page, Notifications.PasswordInvalidData);//step 16
    await clear;

    await fillLoginForm(page, undefined, invalidCredentials.password[4]);
    await errorMessageOnRegister(page, Notifications.PasswordInvalidData);//step 17
  })
});