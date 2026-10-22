import { useId } from 'react';
import type { Locale } from '../../copy';
import { formatBytes, UNKNOWN_VALUE, type UsageReading } from './types';

export type UsageValueLabels = {
  measuredTag: string;
  estimatedTag: string;
  partialTag: string;
};

export type UsageValueProps = {
  /** Name of the demonstrated value state, e.g. "Measured value". */
  label: string;
  /** Localized explanation shown under the value. */
  explanation: string;
  reading: UsageReading;
  locale: Locale;
  labels: UsageValueLabels;
};

/** Usage amount with honest unknown, measured-zero, estimated and partial-coverage states. */
export function UsageValue({ label, explanation, reading, locale, labels }: UsageValueProps) {
  const labelId = useId();
  const unknown = reading.status === 'unknown';
  const zero = reading.status === 'value' && reading.bytes === 0;
  const estimated = reading.status === 'value' && reading.provenance === 'estimated';
  const partial = reading.status === 'value' && reading.coverage === 'partial';
  const state = unknown ? 'unknown' : zero ? 'measured-zero' : estimated ? 'estimated' : partial ? 'partial' : 'measured';

  return (
    <section className="ns-state" data-usage={state} aria-labelledby={labelId}>
      <h3 className="ns-state-label" id={labelId}>{label}</h3>
      <p className="ns-value">
        {unknown ? (
          <span className="ns-value-number ns-dash" aria-hidden="true">{UNKNOWN_VALUE}</span>
        ) : (
          <>
            {estimated && <span className="ns-value-approx" aria-hidden="true">≈</span>}
            <span className="ns-value-number">{formatBytes(reading.bytes, locale)}</span>
          </>
        )}
        {estimated && <span className="ns-tag" data-tone="estimated">{labels.estimatedTag}</span>}
        {partial && <span className="ns-tag" data-tone="partial">{labels.partialTag}</span>}
        {!unknown && !estimated && <span className="ns-tag">{labels.measuredTag}</span>}
      </p>
      <p className="ns-state-explanation">{explanation}</p>
    </section>
  );
}
