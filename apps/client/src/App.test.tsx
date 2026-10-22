import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { App } from './App';

describe('truthful foundation', () => {
  it('keeps unknown distinct from measured zero and switches locale/theme', async () => {
    const user = userEvent.setup();
    render(<App />);
    expect(screen.getByText('لا توجد قياسات بعد')).toBeVisible();
    expect(screen.getByRole('status')).toHaveTextContent('لم يبدأ القياس');
    expect(screen.queryByText('0 GB')).not.toBeInTheDocument();
    expect(document.documentElement).toHaveAttribute('dir', 'rtl');
    await user.click(screen.getByRole('button', { name: 'English' }));
    await waitFor(() => expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Your usage, clearly'));
    expect(document.documentElement).toHaveAttribute('dir', 'ltr');
    await user.click(screen.getByRole('button', { name: 'Change theme' }));
    expect(document.documentElement).toHaveAttribute('data-theme', 'dark');
  });

  it('explains collection and device limitations without pretending to pair', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole('button', { name: 'طريقة العمل' }));
    expect(screen.getByRole('heading', { name: 'شبكة السكن فقط' })).toBeVisible();
    await user.click(screen.getByRole('button', { name: 'الأجهزة' }));
    expect(screen.getByRole('heading', { name: 'لا توجد بيانات أجهزة بعد' })).toBeVisible();
    expect(screen.queryByRole('button', { name: /pair|ربط/i })).not.toBeInTheDocument();
  });
});
