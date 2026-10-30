import { expect, test } from "@playwright/test";

import { open } from "./app.mjs";

const PROJECT = "/documents/CAD projects";
const PATH = `${PROJECT}/part.py`;
const FILES = { [PATH]: "PART = 1\n" };

for (const argument of [PROJECT, `--open=${PROJECT}`]) {
  test(`startup opens a folder from ${argument}`, async ({ page }) => {
    const { problems } = await open(page, {
      argv: ["/app/build123d-studio", "--load-dir-res", "--path=/app", argument],
      files: FILES,
    });
    await expect(page.locator("#tree-root")).toHaveText("CAD projects");
    await expect(page.locator(".tab")).toHaveCount(0);
    expect(problems).toEqual([]);
  });
}

test("a file argument opens its folder and editor tab", async ({ page }) => {
  const { problems } = await open(page, {
    argv: ["/app/build123d-studio", PATH],
    files: FILES,
  });
  await expect(page.locator("#tree-root")).toHaveText("CAD projects");
  await expect(page.locator(".tab")).toHaveCount(1);
  await expect(page.locator(".monaco-editor .view-lines")).toContainText("PART = 1");
  expect(problems).toEqual([]);
});
