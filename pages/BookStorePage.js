const { expect } = require('@playwright/test');

class BookStorePage {
  constructor(page) {
    this.page = page;
    this.searchInput = page.locator('#searchBox');
    this.logoutButton = page.getByRole('button', { name: 'Log out', exact: true });
  }

  getMatchingRow(bookTitle) {
    return this.page
      .getByRole('row')
      .filter({
        has: this.page.getByRole('link', {
          name: bookTitle,
          exact: true,
        }),
      });
  }

  async searchBook(bookTitle) {
    await this.searchInput.fill(bookTitle);
    const matchingRow = this.getMatchingRow(bookTitle);
    await expect(matchingRow).toHaveCount(1);
    await expect(
      matchingRow.getByRole('link', { name: bookTitle, exact: true })
    ).toBeVisible();
  }

  async getBookDetails(bookTitle) {
    const matchingRow = this.getMatchingRow(bookTitle);
    await expect(matchingRow).toHaveCount(1);

    const cells = matchingRow.getByRole('cell');
    const title = (await cells.nth(1).textContent()).trim();
    const author = (await cells.nth(2).textContent()).trim();
    const publisher = (await cells.nth(3).textContent()).trim();

    return { title, author, publisher };
  }

  async logout() {
    await this.logoutButton.click();
    await expect(this.page.locator('#login')).toBeVisible();
  }
}

module.exports = { BookStorePage };
