const Page = require("./helpers/page");

let page;

beforeEach(async () => {
  page = await Page.build();
  await page.goto("http://localhost:3000");
});

afterEach(async () => {
  await page.close();
});

test("should render logo correctly", async () => {
  const logo = await page.getContentsOf("a.brand-logo");

  expect(logo).toEqual("Blogster");
});

test("should start oauth flow", async () => {
  await page.click(".right a");
  const url = await page.url();
  expect(url).toContain("accounts.google.com");
});

test("should show logout button when signed in and logout successfully", async () => {
  await page.login();

  const text = await page.getContentsOf(`a[href="/auth/logout"]`);

  expect(text).toEqual("Logout");
});
