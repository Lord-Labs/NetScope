import { useId } from 'react';
import { WifiOff } from 'lucide-react';
import { UNKNOWN_VALUE } from './types';

export type FreshnessLabels = {
  lastObservation: string;
  lastSync: string;
  unknown: string;
  offline: string;
};

export type FreshnessProps = {
  /** Localized state name, e.g. "Last observation and sync". */
  label: string;
  explanation: string;
  lastObservation: string | null;
  lastSync: string | null;
  offline: boolean;
  labels: FreshnessLabels;
};

/** Age of the data: last observation stays separate from last sync, and offline is explicit. */
export function Freshness({ label, explanation, lastObservation, lastSync, offline, labels }: FreshnessProps) {
  const labelId = useId();
  return (
    <section
      className="ns-state"
      data-freshness={offline ? 'offline' : lastObservation === null ? 'unknown' : 'known'}
      aria-labelledby={labelId}
    >
      <h3 className="ns-state-label" id={labelId}>{label}</h3>
      <dl className="ns-freshness">
        <div className="ns-freshness-row">
          <dt>{labels.lastObservation}</dt>
          <dd className={lastObservation === null ? 'ns-dash' : undefined}>
            {lastObservation ?? <span aria-hidden="true">{UNKNOWN_VALUE}</span>}
            {lastObservation === null && <span className="ns-visually-hidden">{labels.unknown}</span>}
          </dd>
        </div>
        <div className="ns-freshness-row">
          <dt>{labels.lastSync}</dt>
          <dd className={lastSync === null ? 'ns-dash' : undefined}>
            {lastSync ?? <span aria-hidden="true">{UNKNOWN_VALUE}</span>}
            {lastSync === null && <span className="ns-visually-hidden">{labels.unknown}</span>}
          </dd>
        </div>
      </dl>
      {offline && (
        <p className="ns-offline">
          <WifiOff size={18} aria-hidden="true" />
          <span>{labels.offline}</span>
        </p>
      )}
      <p className="ns-state-explanation">{explanation}</p>
    </section>
  );
}
