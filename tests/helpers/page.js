const puppeteer = require("puppeteer");
const sessionFactory = require("../factories/sessionFactory");
const userFactory = require("../factories/userFactory");

class CustomPage {
  static async build() {
    const browser = await puppeteer.launch({
      headless: true, // <== don't launch chromium in a window run it on background
      args: ["--no-sandbox"], // <== decrease the test time
    });
    const page = await browser.newPage();

    const customPage = new CustomPage(page, browser);

    return new Proxy(customPage, {
      get: function (_, property) {
        return customPage[property] || page[property] || browser[property];
      },
    });
  }

  constructor(page, browser) {
    this.page = page;
    this.browser = browser;
  }

  close() {
    this.browser.close();
  }

  async login() {
    const user = await userFactory();

    const { session, sig } = sessionFactory(user);

    await this.page.setCookie({ name: "session", value: session });
    await this.page.setCookie({ name: "session.sig", value: sig });
    await this.page.goto("http://localhost:3000/blogs");

    await this.page.waitFor(`a[href="/auth/logout"]`);
  }

  async getContentsOf(selector) {
    return this.page.$eval(selector, (el) => el.innerHTML);
  }

  async get(path) {
    const response = await this.page.evaluate(async (_path) => {
      const response = await fetch(_path, {
        method: "GET",
        credentials: "same-origin",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const parsedResponse = await response.json();
      return parsedResponse;
    }, path);
    return response;
  }

  async post(path, data) {
    const response = await this.page.evaluate(
      async (_path, _data) => {
        const response = await fetch(_path, {
          method: "POST",
          credentials: "same-origin",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(_data),
        });
        const parsedResponse = await response.json();
        return parsedResponse;
      },
      path,
      data,
    );
    return response;
  }
}

module.exports = CustomPage;
