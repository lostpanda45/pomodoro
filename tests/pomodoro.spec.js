const { test, expect } = require('@playwright/test');

test.describe('Pomodoro Timer', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  test('start/pause/resume', async ({ page }) => {
    const startPauseBtn = page.locator('#startPauseBtn');
    const minutesEl = page.locator('#minutes');
    
    await expect(startPauseBtn).toHaveText('Start');
    await startPauseBtn.click();
    await expect(startPauseBtn).toHaveText('Pause');
    
    await page.waitForTimeout(1500);
    
    await startPauseBtn.click();
    await expect(startPauseBtn).toHaveText('Start');
    const minutesAtPause = await minutesEl.textContent();
    await page.waitForTimeout(1500);
    const minutesAfterPause = await minutesEl.textContent();
    expect(minutesAfterPause).toBe(minutesAtPause);
    
    await startPauseBtn.click();
    await expect(startPauseBtn).toHaveText('Pause');
  });

  test('timer accuracy across 2-second sprint with shortened durations', async ({ page }) => {
    await page.fill('#workDuration', '1');
    await page.fill('#shortBreakDuration', '1');
    await page.fill('#longBreakDuration', '1');
    
    await page.click('#resetBtn');
    await page.waitForTimeout(500);
    
    const startPauseBtn = page.locator('#startPauseBtn');
    const secondsEl = page.locator('#seconds');
    const minutesEl = page.locator('#minutes');
    
    await startPauseBtn.click();
    
    await page.waitForTimeout(100);
    const initialMins = await minutesEl.textContent();
    const initialSecs = await secondsEl.textContent();
    const initialTotal = parseInt(initialMins) * 60 + parseInt(initialSecs);
    
    await page.waitForTimeout(2100);
    
    const afterMins = await minutesEl.textContent();
    const afterSecs = await secondsEl.textContent();
    const afterTotal = parseInt(afterMins) * 60 + parseInt(afterSecs);
    
    const diff = initialTotal - afterTotal;
    expect(diff).toBeGreaterThanOrEqual(1);
    expect(diff).toBeLessThanOrEqual(4);
  });

  test('localStorage persistence after reload', async ({ page }) => {
    await page.fill('#workDuration', '10');
    await page.fill('#shortBreakDuration', '3');
    
    await page.click('#startPauseBtn');
    await page.waitForTimeout(1000);
    
    await page.reload();
    
    const workVal = await page.inputValue('#workDuration');
    const shortVal = await page.inputValue('#shortBreakDuration');
    expect(workVal).toBe('10');
    expect(shortVal).toBe('3');
  });

  test('cycle counter advancing', async ({ page }) => {
    const sessionCountEl = page.locator('#sessionCount');
    await expect(sessionCountEl).toHaveText('0');
    
    // Set very short durations - 1 minute work
    await page.fill('#workDuration', '1');
    await page.fill('#shortBreakDuration', '1');
    await page.click('#resetBtn');
    await page.waitForTimeout(500);
    
    // Manually trigger completion by manipulating the page
    await page.evaluate(() => {
      // Simulate completion
      if (window.handleTimerComplete) {
        window.handleTimerComplete();
      } else {
        // Fallback - directly call the logic
        const event = new Event('click');
      }
    });
    
    await page.waitForTimeout(500);
    
    const count = await sessionCountEl.textContent();
    expect(parseInt(count)).toBeGreaterThanOrEqual(1);
  });

  test('pause not drifting', async ({ page }) => {
    await page.fill('#workDuration', '5');
    await page.click('#resetBtn');
    await page.waitForTimeout(500);
    
    const startPauseBtn = page.locator('#startPauseBtn');
    const secondsEl = page.locator('#seconds');
    
    await startPauseBtn.click();
    await page.waitForTimeout(500);
    
    await startPauseBtn.click();
    const timeAtPause = await secondsEl.textContent();
    
    await page.waitForTimeout(2000);
    
    const timeStillPaused = await secondsEl.textContent();
    expect(timeStillPaused).toBe(timeAtPause);
  });
});
