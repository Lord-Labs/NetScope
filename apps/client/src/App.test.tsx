import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it } from 'vitest';
import { App } from './App';

beforeEach(() => {
  window.localStorage.clear();
});

/** Finds the state card that contains the given visible state heading. */
function findCard(headingName: string): HTMLElement {
  const heading = screen.getByRole('heading', { name: headingName });
  const card = heading.closest('section');
  if (!(card instanceof HTMLElement)) throw new Error(`No state card contains the heading "${headingName}"`);
  return card;
}

function findButtonCard(headingName: string): HTMLElement {
  const heading = screen.getByRole('heading', { name: headingName });
  const card = heading.closest('.ns-demo') ?? heading.closest('section');
  if (!(card instanceof HTMLElement)) throw new Error(`No demo card contains the heading "${headingName}"`);
  return card;
}

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

describe('state gallery', () => {
  it('opens from the keyboard and keeps unknown, measured zero and estimated distinct', async () => {
    const user = userEvent.setup();
    render(<App />);
    const statesButton = screen.getByRole('button', { name: 'الحالات' });
    for (let step = 0; step < 10 && document.activeElement !== statesButton; step += 1) await user.tab();
    expect(statesButton).toHaveFocus();
    await user.keyboard('{Enter}');

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('حالات الواجهة');
    expect(screen.getByRole('note')).toHaveTextContent('قيم توضيحية فقط');

    const unknown = findCard('الاستهلاك غير معروف');
    expect(unknown).toHaveAttribute('data-usage', 'unknown');
    expect(within(unknown).getByText('–')).toBeVisible();
    expect(within(unknown).getByText('لا يوجد رصد لهذه الفترة بعد. لا نعرض صفرًا بدلًا من المجهول.')).toBeVisible();

    const zero = findCard('صفر مقيس');
    expect(zero).toHaveAttribute('data-usage', 'measured-zero');
    expect(within(zero).getByText(/^[\u0660-\u0669\d]+\sB$/)).toBeVisible();

    const estimated = findCard('قيمة تقديرية');
    expect(estimated).toHaveAttribute('data-usage', 'estimated');
    expect(within(estimated).getByText('≈')).toBeVisible();
    expect(within(estimated).getByText('تقديري')).toBeVisible();

    const partial = findCard('تغطية جزئية');
    expect(partial).toHaveAttribute('data-usage', 'partial');
    expect(within(partial).getByText('جزئي')).toBeVisible();

    await user.click(screen.getByRole('button', { name: 'تغيير المظهر' }));
    expect(document.documentElement).toHaveAttribute('data-theme', 'dark');
    await user.click(screen.getByRole('button', { name: 'English' }));
    await waitFor(() => expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Interface states'));
    expect(document.documentElement).toHaveAttribute('dir', 'ltr');
    expect(screen.getByRole('heading', { name: 'Measured zero' })).toBeVisible();
  });

  it('demonstrates collector, freshness, history, setup and feedback states', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole('button', { name: 'الحالات' }));

    for (const name of ['لم يبدأ الجمع', 'جارٍ الجمع', 'الجمع متوقف مؤقتًا', 'إذن مطلوب', 'خطأ في الجمع', 'غير مدعوم على هذا الجهاز']) {
      expect(screen.getByRole('heading', { name })).toBeVisible();
    }
    expect(findCard('لم يبدأ الجمع')).toHaveAttribute('data-status', 'not_started');
    expect(findCard('غير مدعوم على هذا الجهاز')).toHaveAttribute('data-status', 'unsupported');

    expect(findCard('لا رصد بعد')).toHaveAttribute('data-freshness', 'unknown');
    expect(within(findCard('لا رصد بعد')).getAllByText('–')).toHaveLength(2);
    expect(within(findCard('عرض غير متصل')).getByText('غير متصل')).toBeVisible();

    expect(findCard('تحميل الفترات')).toHaveAttribute('data-history', 'loading');
    expect(findCard('لا فترات بعد')).toHaveAttribute('data-history', 'empty');
    expect(findCard('تعذر التحميل')).toHaveAttribute('data-history', 'error');
    const history = findCard('فترات مقيسة وفجوة');
    expect(within(history).getByText('فجوة')).toBeVisible();
    expect(within(history).getByText('لم تُقَس هذه الفترة. تظهر كفجوة ولا تُحسب صفرًا.')).toBeVisible();
    expect(within(history).getAllByText(/^[\u0660-\u0669\d]+\sMB$/)).toHaveLength(2);

    expect(findCard('السياق الحالي')).toHaveAttribute('data-setup', 'context');
    const demo = findButtonCard('عرض تفاعلي');
    await user.click(within(demo).getByRole('button', { name: 'إعادة المحاولة' }));
    expect(within(demo).getByText('نجاح توضيحي — لم يُطلب إذن ولم يبدأ قياس.')).toBeVisible();
    expect(demo).toHaveFocus();
    await user.click(within(demo).getByRole('button', { name: 'إعادة العرض' }));
    expect(within(demo).getByRole('button', { name: 'إعادة المحاولة' })).toBeVisible();
    expect(findCard('نجاح في المكان')).toHaveAttribute('data-setup', 'success');

    const feedback = screen.getByRole('heading', { name: 'التأكيد في المكان' }).closest('section');
    if (!(feedback instanceof HTMLElement)) throw new Error('No feedback section');
    expect(within(feedback).getByText('لم تتغير أي بيانات، ويمكنك المتابعة بأمان.')).toBeVisible();
    expect(within(feedback).getByText('تعذر الحفظ. لم يُفقد شيء، ويمكنك إعادة المحاولة.')).toBeVisible();
  });

  it('persists language and theme preferences across a remount', async () => {
    const user = userEvent.setup();
    const first = render(<App />);
    await user.click(screen.getByRole('button', { name: 'English' }));
    await user.click(screen.getByRole('button', { name: 'Change theme' }));
    first.unmount();
    render(<App />);
    expect(document.documentElement).toHaveAttribute('dir', 'ltr');
    expect(document.documentElement).toHaveAttribute('data-theme', 'dark');
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Your usage, clearly');
    expect(screen.queryByText(/[٠-٩\d]\s?(?:B|KB|MB|GB|TB)/)).not.toBeInTheDocument();
  });
});
