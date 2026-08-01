const { expect } = require('@playwright/test');

class ProfilePage {
  constructor(page) {
    this.page = page;
    this.usernameLabel = page.locator('#userName-value');
    this.logoutButton = page.getByRole('button', { name: 'Logout', exact: true });
    this.goToBookStoreButton = page.getByRole('button', { name: 'Go To Book Store', exact: true });
  }

  async validateSuccessfulLogin(expectedUsername) {
    await expect(this.usernameLabel).toBeVisible();
    await expect(this.usernameLabel).toHaveText(expectedUsername);
    await expect(this.logoutButton).toBeVisible();
  }

  async goToBookStore() {
    await this.goToBookStoreButton.click();
    await expect(this.page.locator('#searchBox')).toBeVisible();
  }
}

module.exports = { ProfilePage };
