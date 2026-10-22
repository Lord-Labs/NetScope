import { useId, type Ref } from 'react';
import { CircleCheck, Laptop, ShieldAlert, type LucideIcon } from 'lucide-react';
import { Button } from '../arc/button/button';

export type SetupKind = 'context' | 'denied' | 'success';

export type SetupAction = {
  label: string;
  onClick: () => void;
  /** At most one primary action per surface. */
  variant?: 'primary' | 'secondary';
};

export type SetupStateProps = {
  kind: SetupKind;
  /** Localized state name shown above the title. */
  label: string;
  title: string;
  explanation: string;
  action?: SetupAction;
  /** Optional element ref for focus return after an in-place update. */
  regionRef?: Ref<HTMLElement>;
};

const icons: Record<SetupKind, LucideIcon> = {
  context: Laptop,
  denied: ShieldAlert,
  success: CircleCheck,
};

/** Household network context, permission outcome and in-place confirmation. */
export function SetupState({ kind, label, title, explanation, action, regionRef }: SetupStateProps) {
  const labelId = useId();
  const Icon = icons[kind];
  return (
    <section className="ns-state" data-setup={kind} aria-labelledby={labelId} ref={regionRef} tabIndex={regionRef ? -1 : undefined}>
      <h3 className="ns-state-label" id={labelId}>{label}</h3>
      <p className="ns-setup-title">
        <Icon className="ns-state-icon" size={20} aria-hidden="true" />
        <span>{title}</span>
      </p>
      <p className="ns-state-explanation">{explanation}</p>
      {action && (
        <p className="ns-actions">
          <Button variant={action.variant ?? 'secondary'} size="lg" onClick={action.onClick}>{action.label}</Button>
        </p>
      )}
    </section>
  );
}
