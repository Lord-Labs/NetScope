import { CircleAlert, CircleCheck, Info, type LucideIcon } from 'lucide-react';
import type { FeedbackTone } from './types';

const icons: Record<FeedbackTone, LucideIcon> = {
  info: Info,
  success: CircleCheck,
  error: CircleAlert,
};

export type FeedbackLineProps = {
  tone: FeedbackTone;
  /** Visible name of the tone, so feedback never relies on color alone. */
  toneLabel: string;
  message: string;
  id?: string;
};

/** Short in-place confirmation beside the action it belongs to. */
export function FeedbackLine({ tone, toneLabel, message, id }: FeedbackLineProps) {
  const Icon = icons[tone];
  return (
    <p className="ns-feedback" data-tone={tone} id={id} role="status">
      <Icon size={18} aria-hidden="true" />
      <span className="ns-feedback-tone">{toneLabel}</span>
      <span className="ns-feedback-message">{message}</span>
    </p>
  );
}
