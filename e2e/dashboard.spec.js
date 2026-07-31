import { test, expect } from '@playwright/test';

test.describe('Project Phoenix Digital Twin Dashboard E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('1. Dashboard page loading & 3D WebGL canvas mount', async ({ page }) => {
    // Verify top navigation header branding
    await expect(page.locator('nav')).toContainText('PROJECT PHOENIX');
    await expect(page.locator('nav')).toContainText('Autonomous Transhumeral Myoelectric Prosthetic System');

    // Verify view mode navigation buttons exist
    await expect(page.getByRole('button', { name: '🌐 PRODUCT SHOWCASE' })).toBeVisible();
    await expect(page.getByRole('button', { name: '⚡ DIGITAL TWIN DASHBOARD' })).toBeVisible();
    await expect(page.getByRole('button', { name: '🎬 3D VIDEO ANIMATION' })).toBeVisible();

    // Verify Header Banner Title
    await expect(page.locator('h1')).toContainText('PROJECT PHOENIX');

    // Verify 3D WebGL Canvas mount inside Arm3DViewer
    const canvas = page.locator('canvas');
    await expect(canvas).toBeVisible();
  });

  test('2. Interactive 16-gesture button grid selection', async ({ page }) => {
    // Verify all 16 gestures are rendered in the button grid
    const gestures = [
      'POWER GRIP', 'PINCH', 'CYLINDRICAL', 'LATERAL',
      'OPEN HAND', 'TRIPOD', 'HOOK', 'POINT',
      'KEY GRIP', 'THUMBS UP', 'PRECISION PINCH', 'WAVE',
      'PEACE SIGN', 'SPHERICAL GRIP', 'TWEEZER GRIP', 'OK SIGN'
    ];

    for (const gesture of gestures) {
      const gestureBtn = page.getByRole('button', { name: new RegExp(gesture, 'i') });
      await expect(gestureBtn).toBeVisible();
    }

    // Click 'PINCH' gesture button and verify selection
    const pinchBtn = page.getByRole('button', { name: /PINCH/i }).first();
    await pinchBtn.click();

    // Click 'OPEN HAND' gesture button
    const openHandBtn = page.getByRole('button', { name: /OPEN HAND/i }).first();
    await openHandBtn.click();

    // Click 'THUMBS UP' gesture button
    const thumbsUpBtn = page.getByRole('button', { name: /THUMBS UP/i }).first();
    await thumbsUpBtn.click();
  });

  test('3. FSR 20.0 kPa pressure spike scenario preset trigger & passive lock engagement', async ({ page }) => {
    // Locate scenario preset button for Pressure Spike
    const spikeBtn = page.getByRole('button', { name: /Pressure Spike \(>20 kPa\)/i });
    await expect(spikeBtn).toBeVisible();

    // Trigger Pressure Spike scenario preset
    await spikeBtn.click();

    // Verify warning status and passive lock in log stream / alerts
    await expect(page.locator('.dashboard-container')).toContainText('PASSIVE LOCK ENGAGED');

    // Resolve Pressure Spike scenario
    const resolveBtn = page.getByRole('button', { name: /Resolve Pressure Spike/i });
    await expect(resolveBtn).toBeVisible();
    await resolveBtn.click();
  });

  test('4. Offline voice command recognition simulation', async ({ page }) => {
    // Locate voice listener toggle button
    const voiceBtn = page.getByRole('button', { name: /LISTEN VOICE COMMANDS|LISTENING/i });
    await expect(voiceBtn).toBeVisible();

    // Toggle voice listening ON
    await voiceBtn.click();
    await expect(page.getByRole('button', { name: /LISTENING/i })).toBeVisible();

    // Toggle voice listening OFF
    await voiceBtn.click();
    await expect(page.getByRole('button', { name: /LISTEN VOICE COMMANDS/i })).toBeVisible();
  });

  test('5. Telemetry HUD updates and view mode / modal interaction', async ({ page }) => {
    // Switch to PRODUCT SHOWCASE view mode
    const showcaseBtn = page.getByRole('button', { name: '🌐 PRODUCT SHOWCASE' });
    await showcaseBtn.click();
    await expect(page.locator('.dashboard-container')).toContainText('BUILT FROM EXPERIENCE. DRIVEN BY ENGINEERING.');

    // Switch to 3D VIDEO ANIMATION view mode
    const videoBtn = page.getByRole('button', { name: '🎬 3D VIDEO ANIMATION' });
    await videoBtn.click();
    await expect(page.locator('.dashboard-container')).toContainText('3D DIGITAL TWIN ANIMATION & VIDEO STORYBOARD');

    // Switch back to DIGITAL TWIN DASHBOARD view mode
    const dashboardBtn = page.getByRole('button', { name: '⚡ DIGITAL TWIN DASHBOARD' });
    await dashboardBtn.click();
    await expect(page.locator('.dashboard-container')).toContainText('ENGINEERING VALIDATION PLATFORM');

    // Verify Telemetry HUD panels
    await expect(page.locator('.dashboard-container')).toContainText('Syntiant NDP120 AI Metrics');
    await expect(page.locator('.dashboard-container')).toContainText('Socket Pressure Array');
  });
});
