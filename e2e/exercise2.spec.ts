import { test, expect } from '@playwright/test'
const STOPS = [1.99, 5.99, 10.99, 30.99, 50.99, 70.99]

test.describe('Exercise 2 — Fixed Range', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/exercise2')
    await expect(page.getByRole('group', { name: 'Fixed price range slider' })).toBeVisible()
    await expect(page.getByRole('slider').first()).toBeVisible()
  })

  test('renders the page heading', async ({ page }) => {
    await expect(page.getByRole('heading', { level: 2, name: 'Fixed Values' })).toBeVisible()
  })

  test('renders both slider thumbs', async ({ page }) => {
    await expect(page.getByRole('slider')).toHaveCount(2)
  })

  test('min thumb initial aria-valuenow is 1.99', async ({ page }) => {
    const minThumb = page.getByRole('slider', { name: 'Minimum price' })
    await expect(minThumb).toHaveAttribute('aria-valuenow', String(STOPS[0]))
  })

  test('max thumb initial aria-valuenow is 70.99', async ({ page }) => {
    const maxThumb = page.getByRole('slider', { name: 'Maximum price' })
    await expect(maxThumb).toHaveAttribute('aria-valuenow', String(STOPS[STOPS.length - 1]))
  })

  test('aria-valuetext shows formatted currency for min thumb', async ({ page }) => {
    const minThumb = page.getByRole('slider', { name: 'Minimum price' })
    const valuetext = await minThumb.getAttribute('aria-valuetext')
    expect(valuetext).toMatch(/1[.,]99/)
  })

  test('aria-valuetext shows formatted currency for max thumb', async ({ page }) => {
    const maxThumb = page.getByRole('slider', { name: 'Maximum price' })
    const valuetext = await maxThumb.getAttribute('aria-valuetext')
    expect(valuetext).toMatch(/70[.,]99/)
  })

  test('ArrowRight on min thumb snaps from 1.99 to 5.99', async ({ page }) => {
    const minThumb = page.getByRole('slider', { name: 'Minimum price' })
    await minThumb.focus()
    await page.keyboard.press('ArrowRight')
    await expect(minThumb).toHaveAttribute('aria-valuenow', String(STOPS[1]))
  })

  test('ArrowRight on min thumb advances through all stops', async ({ page }) => {
    const minThumb = page.getByRole('slider', { name: 'Minimum price' })
    await minThumb.focus()

    for (let i = 1; i < STOPS.length - 1; i++) {
      await page.keyboard.press('ArrowRight')
      await expect(minThumb).toHaveAttribute('aria-valuenow', String(STOPS[i]))
    }
  })

  test('ArrowRight on min thumb at stop before max stays clamped', async ({ page }) => {
    const minThumb = page.getByRole('slider', { name: 'Minimum price' })
    await minThumb.focus()
    for (let i = 0; i < 4; i++) {
      await page.keyboard.press('ArrowRight')
    }
    await expect(minThumb).toHaveAttribute('aria-valuenow', String(STOPS[4]))

    await page.keyboard.press('ArrowRight')
    await expect(minThumb).toHaveAttribute('aria-valuenow', String(STOPS[5]))
  })

  test('ArrowRight on max thumb at last stop (70.99) keeps it at 70.99', async ({ page }) => {
    const maxThumb = page.getByRole('slider', { name: 'Maximum price' })
    await maxThumb.focus()
    await page.keyboard.press('ArrowRight')
    await expect(maxThumb).toHaveAttribute('aria-valuenow', String(STOPS[STOPS.length - 1]))
  })

  test('ArrowLeft on min thumb at first stop (1.99) keeps it at 1.99', async ({ page }) => {
    const minThumb = page.getByRole('slider', { name: 'Minimum price' })
    await minThumb.focus()
    await page.keyboard.press('ArrowLeft')
    await expect(minThumb).toHaveAttribute('aria-valuenow', String(STOPS[0]))
  })

  test('ArrowLeft on max thumb snaps from 70.99 to 50.99', async ({ page }) => {
    const maxThumb = page.getByRole('slider', { name: 'Maximum price' })
    await maxThumb.focus()
    await page.keyboard.press('ArrowLeft')
    await expect(maxThumb).toHaveAttribute('aria-valuenow', String(STOPS[4]))
  })

  test('ArrowLeft on max thumb advances backwards through all stops', async ({ page }) => {
    const maxThumb = page.getByRole('slider', { name: 'Maximum price' })
    await maxThumb.focus()

    for (let i = STOPS.length - 2; i >= 1; i--) {
      await page.keyboard.press('ArrowLeft')
      await expect(maxThumb).toHaveAttribute('aria-valuenow', String(STOPS[i]))
    }
  })

  test('Home key moves min thumb back to 1.99', async ({ page }) => {
    const minThumb = page.getByRole('slider', { name: 'Minimum price' })
    await minThumb.focus()
    await page.keyboard.press('ArrowRight')
    await page.keyboard.press('ArrowRight')
    await expect(minThumb).toHaveAttribute('aria-valuenow', String(STOPS[2]))

    await page.keyboard.press('Home')
    await expect(minThumb).toHaveAttribute('aria-valuenow', String(STOPS[0]))
  })

  test('End key moves max thumb to absolute max (70.99)', async ({ page }) => {
    const maxThumb = page.getByRole('slider', { name: 'Maximum price' })
    await maxThumb.focus()
    await page.keyboard.press('ArrowLeft')
    await page.keyboard.press('ArrowLeft')
    await expect(maxThumb).toHaveAttribute('aria-valuenow', String(STOPS[3]))

    await page.keyboard.press('End')
    await expect(maxThumb).toHaveAttribute('aria-valuenow', String(STOPS[5]))
  })

  test('min label is NOT a button (read-only)', async ({ page }) => {
    const minBtn = page.getByRole('button', { name: /minimum price/i })
    await expect(minBtn).toHaveCount(0)
  })

  test('max label is NOT a button (read-only)', async ({ page }) => {
    const maxBtn = page.getByRole('button', { name: /maximum price/i })
    await expect(maxBtn).toHaveCount(0)
  })

  test('clicking label area does not open a number input', async ({ page }) => {
    const input = page.getByRole('spinbutton')
    await expect(input).toHaveCount(0)
  })

  test('back to home link navigates to /', async ({ page }) => {
    await page.getByRole('link', { name: /back to home/i }).click()
    await expect(page).toHaveURL('/')
  })
})
