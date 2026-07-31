const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../pages/LoginPage');
const { ProfilePage } = require('../pages/ProfilePage');
const { BookStorePage } = require('../pages/BookStorePage');
const { writeBookDetails } = require('../utils/fileUtils');

test('Login, search book, save details, and logout', async ({ page }) => {
  const username = process.env.DEMOQA_USERNAME;
  const password = process.env.DEMOQA_PASSWORD;

  if (!username || !password) {
    throw new Error('DEMOQA_USERNAME and DEMOQA_PASSWORD must be set in .env');
  }

  const bookTitle = 'Learning JavaScript Design Patterns';

  const loginPage = new LoginPage(page);
  const profilePage = new ProfilePage(page);
  const bookStorePage = new BookStorePage(page);

  await test.step('Login', async () => {
    await loginPage.navigate();
    await loginPage.login(username, password);
  });

  await test.step('Validate login', async () => {
    await profilePage.validateSuccessfulLogin(username);
  });

  let bookDetails;
  await test.step('Search and validate book', async () => {
    await profilePage.goToBookStore();
    await bookStorePage.searchBook(bookTitle);
    bookDetails = await bookStorePage.getBookDetails(bookTitle);

    expect(bookDetails.title).toBe(bookTitle);
    expect(bookDetails.author).toBeTruthy();
    expect(bookDetails.publisher).toBeTruthy();
  });

  await test.step('Save book details', async () => {
    writeBookDetails(bookDetails);

    const fs = require('fs');
    const path = require('path');

    const outputFile = path.join(__dirname, '..', 'output', 'book_details.txt');
    expect(fs.existsSync(outputFile)).toBeTruthy();
  });

  await test.step('Logout', async () => {
    await bookStorePage.logout();
  });
});
