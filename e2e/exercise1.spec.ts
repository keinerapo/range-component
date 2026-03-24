import { test, expect } from '@playwright/test'

test.describe('Exercise 1 — Normal Range', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/exercise1')
    await expect(page.getByRole('group', { name: 'Price range slider' })).toBeVisible()
    await expect(page.getByRole('slider').first()).toBeVisible()
  })

  test('renders the page heading', async ({ page }) => {
    await expect(page.getByRole('heading', { level: 2, name: 'Normal Range' })).toBeVisible()
  })

  test('renders both slider thumbs', async ({ page }) => {
    const sliders = page.getByRole('slider')
    await expect(sliders).toHaveCount(2)
  })

  test('both thumbs are focusable via Tab', async ({ page }) => {
    await page.keyboard.press('Tab')
    const minThumb = page.getByRole('slider', { name: 'Minimum price' })
    const maxThumb = page.getByRole('slider', { name: 'Maximum price' })

    await minThumb.focus()
    await expect(minThumb).toBeFocused()

    await maxThumb.focus()
    await expect(maxThumb).toBeFocused()
  })

  test('min thumb initial aria-valuenow is 1', async ({ page }) => {
    const minThumb = page.getByRole('slider', { name: 'Minimum price' })
    await expect(minThumb).toHaveAttribute('aria-valuenow', '1')
  })

  test('max thumb initial aria-valuenow is 100', async ({ page }) => {
    const maxThumb = page.getByRole('slider', { name: 'Maximum price' })
    await expect(maxThumb).toHaveAttribute('aria-valuenow', '100')
  })

  test('ArrowRight increases min thumb value by 1', async ({ page }) => {
    const minThumb = page.getByRole('slider', { name: 'Minimum price' })
    await minThumb.focus()
    await page.keyboard.press('ArrowRight')
    await expect(minThumb).toHaveAttribute('aria-valuenow', '2')
  })

  test('ArrowRight increases min thumb value by 3 when pressed 3 times', async ({ page }) => {
    const minThumb = page.getByRole('slider', { name: 'Minimum price' })
    await minThumb.focus()
    await page.keyboard.press('ArrowRight')
    await page.keyboard.press('ArrowRight')
    await page.keyboard.press('ArrowRight')
    await expect(minThumb).toHaveAttribute('aria-valuenow', '4')
  })

  test('ArrowRight on max thumb at max (100) keeps it at 100', async ({ page }) => {
    const maxThumb = page.getByRole('slider', { name: 'Maximum price' })
    await maxThumb.focus()
    await page.keyboard.press('ArrowRight')
    await expect(maxThumb).toHaveAttribute('aria-valuenow', '100')
  })

  test('ArrowLeft decreases min thumb value by 1', async ({ page }) => {
    const minThumb = page.getByRole('slider', { name: 'Minimum price' })
    await minThumb.focus()
    await page.keyboard.press('ArrowRight')
    await page.keyboard.press('ArrowRight')
    await expect(minThumb).toHaveAttribute('aria-valuenow', '3')

    await page.keyboard.press('ArrowLeft')
    await expect(minThumb).toHaveAttribute('aria-valuenow', '2')
  })

  test('ArrowLeft on min thumb at min (1) keeps it at 1', async ({ page }) => {
    const minThumb = page.getByRole('slider', { name: 'Minimum price' })
    await minThumb.focus()
    await page.keyboard.press('ArrowLeft')
    await expect(minThumb).toHaveAttribute('aria-valuenow', '1')
  })

  test('PageUp increases min thumb value by 10', async ({ page }) => {
    const minThumb = page.getByRole('slider', { name: 'Minimum price' })
    await minThumb.focus()
    await page.keyboard.press('PageUp')
    await expect(minThumb).toHaveAttribute('aria-valuenow', '11')
  })

  test('PageDown decreases min thumb value by 10', async ({ page }) => {
    const minThumb = page.getByRole('slider', { name: 'Minimum price' })
    await minThumb.focus()
    await page.keyboard.press('PageUp')
    await page.keyboard.press('PageUp')
    await expect(minThumb).toHaveAttribute('aria-valuenow', '21')

    await page.keyboard.press('PageDown')
    await expect(minThumb).toHaveAttribute('aria-valuenow', '11')
  })

  test('Home key moves min thumb to absolute min (1)', async ({ page }) => {
    const minThumb = page.getByRole('slider', { name: 'Minimum price' })
    await minThumb.focus()
    await page.keyboard.press('PageUp')
    await page.keyboard.press('PageUp')
    await expect(minThumb).toHaveAttribute('aria-valuenow', '21')

    await page.keyboard.press('Home')
    await expect(minThumb).toHaveAttribute('aria-valuenow', '1')
  })

  test('End key moves min thumb to current maxValue', async ({ page }) => {
    const minThumb = page.getByRole('slider', { name: 'Minimum price' })
    const maxThumb = page.getByRole('slider', { name: 'Maximum price' })

    await maxThumb.focus()
    for (let i = 0; i < 50; i++) {
      await page.keyboard.press('ArrowLeft')
    }
    await expect(maxThumb).toHaveAttribute('aria-valuenow', '50')

    await minThumb.focus()
    await page.keyboard.press('End')
    await expect(minThumb).toHaveAttribute('aria-valuenow', '50')
  })

  test('End key moves max thumb to absolute max (100)', async ({ page }) => {
    const maxThumb = page.getByRole('slider', { name: 'Maximum price' })
    await maxThumb.focus()
    await page.keyboard.press('PageDown')
    await expect(maxThumb).toHaveAttribute('aria-valuenow', '90')

    await page.keyboard.press('End')
    await expect(maxThumb).toHaveAttribute('aria-valuenow', '100')
  })

  test('clicking the min label opens an input', async ({ page }) => {
    const minLabelBtn = page.getByRole('button', { name: /minimum price/i })
    await minLabelBtn.click()
    const input = page.getByRole('spinbutton', { name: /minimum price/i })
    await expect(input).toBeVisible()
    await expect(input).toBeFocused()
  })

  test('editing min label and pressing Enter updates slider value', async ({ page }) => {
    const minLabelBtn = page.getByRole('button', { name: /minimum price/i })
    await minLabelBtn.click()

    const input = page.getByRole('spinbutton', { name: /minimum price/i })
    await input.fill('25')
    await input.press('Enter')

    await expect(input).not.toBeVisible()
    const minThumb = page.getByRole('slider', { name: 'Minimum price' })
    await expect(minThumb).toHaveAttribute('aria-valuenow', '25')
  })

  test('editing min label and pressing Escape reverts the value', async ({ page }) => {
    const minLabelBtn = page.getByRole('button', { name: /minimum price/i })
    await minLabelBtn.click()

    const input = page.getByRole('spinbutton', { name: /minimum price/i })
    await input.fill('99')
    await input.press('Escape')

    await expect(input).not.toBeVisible()
    const minThumb = page.getByRole('slider', { name: 'Minimum price' })
    await expect(minThumb).toHaveAttribute('aria-valuenow', '1')
  })

  test('back to home link navigates to /', async ({ page }) => {
    await page.getByRole('link', { name: /back to home/i }).click()
    await expect(page).toHaveURL('/')
  })
})
