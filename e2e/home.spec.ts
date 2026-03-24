import { test, expect } from '@playwright/test'

test.describe('Home page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('renders the main heading', async ({ page }) => {
    await expect(page.getByRole('heading', { level: 1, name: 'Range Component' })).toBeVisible()
  })

  test('has a link to Exercise 1', async ({ page }) => {
    await expect(
      page.getByRole('link', { name: /exercise 1/i }),
    ).toBeVisible()
  })

  test('has a link to Exercise 2', async ({ page }) => {
    await expect(
      page.getByRole('link', { name: /exercise 2/i }),
    ).toBeVisible()
  })

  test('navigates to Exercise 1 and back', async ({ page }) => {
    await page.getByRole('link', { name: /exercise 1/i }).click()
    await expect(page).toHaveURL('/exercise1')
    await expect(
      page.getByRole('heading', { level: 2, name: 'Normal Range' }),
    ).toBeVisible()

    await page.getByRole('link', { name: /back to home/i }).click()
    await expect(page).toHaveURL('/')
    await expect(page.getByRole('heading', { level: 1, name: 'Range Component' })).toBeVisible()
  })

  test('navigates to Exercise 2 and back', async ({ page }) => {
    await page.getByRole('link', { name: /exercise 2/i }).click()
    await expect(page).toHaveURL('/exercise2')
    await expect(
      page.getByRole('heading', { level: 2, name: 'Fixed Values' }),
    ).toBeVisible()

    await page.getByRole('link', { name: /back to home/i }).click()
    await expect(page).toHaveURL('/')
    await expect(page.getByRole('heading', { level: 1, name: 'Range Component' })).toBeVisible()
  })
})
