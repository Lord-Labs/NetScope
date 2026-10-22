import { useId } from 'react';
import type { Locale } from '../../copy';
import { formatBytes } from './types';

export type HistoryInterval =
  | { kind: 'measured'; id: string; label: string; bytes: number }
  | { kind: 'gap'; id: string; label: string };

export type HistoryLabels = {
  loading: string;
  empty: string;
  error: string;
  measuredTag: string;
  gapTag: string;
  gapExplanation: string;
};

export type HistoryListProps = {
  /** Localized state name of this list example. */
  label: string;
  explanation: string;
  state: 'loading' | 'empty' | 'error' | 'ready';
  intervals: HistoryInterval[];
  locale: Locale;
  labels: HistoryLabels;
};

/** Measured intervals and uncovered gaps, with loading, empty and error states. */
export function HistoryList({ label, explanation, state, intervals, locale, labels }: HistoryListProps) {
  const labelId = useId();
  return (
    <section className="ns-state" data-history={state} aria-labelledby={labelId}>
      <h3 className="ns-state-label" id={labelId}>{label}</h3>
      {state === 'loading' && <p className="ns-history-message" role="status">{labels.loading}</p>}
      {state === 'empty' && <p className="ns-history-message">{labels.empty}</p>}
      {state === 'error' && (
        <p className="ns-history-message ns-history-error" data-tone="error">{labels.error}</p>
      )}
      {state === 'ready' && (
        <ul className="ns-history-list">
          {intervals.map((interval) => (
            <li className="ns-history-row" data-kind={interval.kind} key={interval.id}>
              <span className="ns-history-label">{interval.label}</span>
              {interval.kind === 'measured' ? (
                <>
                  <span className="ns-history-value">{formatBytes(interval.bytes, locale)}</span>
                  <span className="ns-tag">{labels.measuredTag}</span>
                </>
              ) : (
                <>
                  <span className="ns-tag" data-tone="gap">{labels.gapTag}</span>
                  <span className="ns-history-gap-explanation">{labels.gapExplanation}</span>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
      <p className="ns-state-explanation">{explanation}</p>
    </section>
  );
}
