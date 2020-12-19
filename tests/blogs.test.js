const Page = require("./helpers/page");

let page;

beforeEach(async () => {
  page = await Page.build();
  await page.goto("http://localhost:3000");
});

afterEach(async () => {
  await page.close();
});

describe("When logged in", async () => {
  beforeEach(async () => {
    // Login and go to create blog post page
    await page.login();
    await page.click(`a[href="/blogs/new"]`);
  });

  test("should show blog creation form", async () => {
    const label = await page.getContentsOf("form label");

    expect(label).toEqual("Blog Title");
  });

  describe("and using valid input values", async () => {
    const title = "Test Blog Title";
    const content = "Test blog content.";

    beforeEach(async () => {
      await page.type(`input[name="title"]`, title);
      await page.type(`input[name="content"]`, content);
      await page.click("form button");
    });

    test("submitting should take user to review page", async () => {
      const reviewText = await page.getContentsOf("h5");
      expect(reviewText).toEqual("Please confirm your entries");
    });

    test("after review blog post must be on the home page", async () => {
      await page.click("button.green");
      await page.waitFor(".card");

      const cardTitle = await page.getContentsOf(".card-title");
      const cardContent = await page.getContentsOf("p");

      expect(cardTitle).toEqual(title);
      expect(cardContent).toEqual(content);
    });
  });

  describe("and using invalid input values", async () => {
    beforeEach(async () => {
      await page.click("form button");
    });
    test("inputs should show error messages", async () => {
      const titleError = await page.getContentsOf(".title .red-text");
      const contentError = await page.getContentsOf(".content .red-text");

      expect(titleError).toEqual("You must provide a value");
      expect(contentError).toEqual("You must provide a value");
    });
  });
});

describe("When not logged in", async () => {
  test("user cannot create blog post", async () => {
    const result = await page.post("/api/blogs", {
      title: "My Title",
      content: "My content",
    });

    expect(result).toEqual({ error: "You must log in!" });
  });

  test("user cannot get the list of blog posts", async () => {
    const result = await page.get("/api/blogs");

    expect(result).toEqual({ error: "You must log in!" });
  });
});
