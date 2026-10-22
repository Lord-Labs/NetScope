import { CircleAlert, CirclePause, CirclePlay, PlugZap, ShieldAlert, type LucideIcon } from 'lucide-react';
import type { CollectorStatus as CollectorStatusKind } from './types';

const icons: Record<CollectorStatusKind, LucideIcon> = {
  not_started: CirclePause,
  collecting: CirclePlay,
  paused: CirclePause,
  permission_required: ShieldAlert,
  error: CircleAlert,
  unsupported: PlugZap,
};

export type CollectorStatusProps = {
  status: CollectorStatusKind;
  /** Localized status name shown as visible text. */
  label: string;
  /** Localized explanation; color is never the only signal. */
  explanation: string;
};

/** Whether local collection is running, paused, blocked or unavailable. */
export function CollectorStatus({ status, label, explanation }: CollectorStatusProps) {
  const Icon = icons[status];
  return (
    <section className="ns-state" data-status={status} role="status">
      <h3 className="ns-state-label">
        <Icon className="ns-state-icon" size={18} aria-hidden="true" />
        <span>{label}</span>
      </h3>
      <p className="ns-state-explanation">{explanation}</p>
    </section>
  );
}
