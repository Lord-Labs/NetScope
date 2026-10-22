import { useEffect, useRef, useState } from 'react';
import { CollectorStatus } from './components/netscope/CollectorStatus';
import { FeedbackLine } from './components/netscope/FeedbackLine';
import { Freshness } from './components/netscope/Freshness';
import { HistoryList } from './components/netscope/HistoryList';
import { SetupState } from './components/netscope/SetupState';
import { UsageValue } from './components/netscope/UsageValue';
import type { CollectorStatus as CollectorStatusKind } from './components/netscope/types';
import { copy, type Locale } from './copy';

/**
 * State gallery: every NetScope UI state as a labeled example.
 * It only demonstrates presentation. It collects nothing and shows no household data.
 */
export function StateGallery({ locale }: { locale: Locale }) {
  const text = copy[locale];
  const [setup, setSetup] = useState<'denied' | 'success'>('denied');
  const [interacted, setInteracted] = useState(false);
  const demoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (interacted) demoRef.current?.focus();
  }, [setup, interacted]);

  const collectorStates: Array<{ status: CollectorStatusKind; label: string; explanation: string }> = [
    { status: 'not_started', label: text.collectorNotStartedLabel, explanation: text.collectorNotStartedExplanation },
    { status: 'collecting', label: text.collectorCollectingLabel, explanation: text.collectorCollectingExplanation },
    { status: 'paused', label: text.collectorPausedLabel, explanation: text.collectorPausedExplanation },
    { status: 'permission_required', label: text.collectorPermissionLabel, explanation: text.collectorPermissionExplanation },
    { status: 'error', label: text.collectorErrorLabel, explanation: text.collectorErrorExplanation },
    { status: 'unsupported', label: text.collectorUnsupportedLabel, explanation: text.collectorUnsupportedExplanation },
  ];

  return (
    <div className="state-gallery">
      <p className="gallery-note" role="note">{text.galleryExampleNote}</p>

      <section className="gallery-section" aria-labelledby="gallery-usage-title">
        <h2 id="gallery-usage-title">{text.usageSectionTitle}</h2>
        <p>{text.usageSectionDescription}</p>
        <div className="ns-grid">
          <UsageValue
            label={text.usageUnknownLabel}
            explanation={text.usageUnknownExplanation}
            reading={{ status: 'unknown' }}
            locale={locale}
            labels={{ measuredTag: text.usageMeasuredTag, estimatedTag: text.usageEstimatedTag, partialTag: text.usagePartialTag }}
          />
          <UsageValue
            label={text.usageZeroLabel}
            explanation={text.usageZeroExplanation}
            reading={{ status: 'value', bytes: 0, provenance: 'measured', coverage: 'complete' }}
            locale={locale}
            labels={{ measuredTag: text.usageMeasuredTag, estimatedTag: text.usageEstimatedTag, partialTag: text.usagePartialTag }}
          />
          <UsageValue
            label={text.usageMeasuredLabel}
            explanation={text.usageMeasuredExplanation}
            reading={{ status: 'value', bytes: 240_000_000, provenance: 'measured', coverage: 'complete' }}
            locale={locale}
            labels={{ measuredTag: text.usageMeasuredTag, estimatedTag: text.usageEstimatedTag, partialTag: text.usagePartialTag }}
          />
          <UsageValue
            label={text.usageEstimatedLabel}
            explanation={text.usageEstimatedExplanation}
            reading={{ status: 'value', bytes: 1_500_000_000, provenance: 'estimated', coverage: 'complete' }}
            locale={locale}
            labels={{ measuredTag: text.usageMeasuredTag, estimatedTag: text.usageEstimatedTag, partialTag: text.usagePartialTag }}
          />
          <UsageValue
            label={text.usagePartialLabel}
            explanation={text.usagePartialExplanation}
            reading={{ status: 'value', bytes: 128_000_000, provenance: 'measured', coverage: 'partial' }}
            locale={locale}
            labels={{ measuredTag: text.usageMeasuredTag, estimatedTag: text.usageEstimatedTag, partialTag: text.usagePartialTag }}
          />
        </div>
      </section>

      <section className="gallery-section" aria-labelledby="gallery-collector-title">
        <h2 id="gallery-collector-title">{text.collectorSectionTitle}</h2>
        <p>{text.collectorSectionDescription}</p>
        <div className="ns-grid">
          {collectorStates.map((state) => (
            <CollectorStatus key={state.status} status={state.status} label={state.label} explanation={state.explanation} />
          ))}
        </div>
      </section>

      <section className="gallery-section" aria-labelledby="gallery-freshness-title">
        <h2 id="gallery-freshness-title">{text.freshnessSectionTitle}</h2>
        <p>{text.freshnessSectionDescription}</p>
        <div className="ns-grid">
          <Freshness
            label={text.freshnessNotYetLabel}
            explanation={text.freshnessNotYetExplanation}
            lastObservation={null}
            lastSync={null}
            offline={false}
            labels={{ lastObservation: text.freshnessLastObservation, lastSync: text.freshnessLastSync, unknown: text.freshnessNone, offline: text.freshnessOffline }}
          />
          <Freshness
            label={text.freshnessKnownLabel}
            explanation={text.freshnessKnownExplanation}
            lastObservation={text.freshnessObservationExample}
            lastSync={text.freshnessSyncExample}
            offline={false}
            labels={{ lastObservation: text.freshnessLastObservation, lastSync: text.freshnessLastSync, unknown: text.freshnessNone, offline: text.freshnessOffline }}
          />
          <Freshness
            label={text.freshnessOfflineLabel}
            explanation={text.freshnessOfflineExplanation}
            lastObservation={text.freshnessObservationExample}
            lastSync={text.freshnessSyncExample}
            offline
            labels={{ lastObservation: text.freshnessLastObservation, lastSync: text.freshnessLastSync, unknown: text.freshnessNone, offline: text.freshnessOffline }}
          />
        </div>
      </section>

      <section className="gallery-section" aria-labelledby="gallery-history-title">
        <h2 id="gallery-history-title">{text.historySectionTitle}</h2>
        <p>{text.historySectionDescription}</p>
        <div className="ns-grid">
          <HistoryList
            label={text.historyLoadingLabel}
            explanation={text.historyLoadingExplanation}
            state="loading"
            intervals={[]}
            locale={locale}
            labels={{ loading: text.historyLoading, empty: text.historyEmpty, error: text.historyError, measuredTag: text.historyMeasuredTag, gapTag: text.historyGapTag, gapExplanation: text.historyGapExplanation }}
          />
          <HistoryList
            label={text.historyEmptyLabel}
            explanation={text.historyEmptyExplanation}
            state="empty"
            intervals={[]}
            locale={locale}
            labels={{ loading: text.historyLoading, empty: text.historyEmpty, error: text.historyError, measuredTag: text.historyMeasuredTag, gapTag: text.historyGapTag, gapExplanation: text.historyGapExplanation }}
          />
          <HistoryList
            label={text.historyErrorLabel}
            explanation={text.historyErrorExplanation}
            state="error"
            intervals={[]}
            locale={locale}
            labels={{ loading: text.historyLoading, empty: text.historyEmpty, error: text.historyError, measuredTag: text.historyMeasuredTag, gapTag: text.historyGapTag, gapExplanation: text.historyGapExplanation }}
          />
          <HistoryList
            label={text.historyReadyLabel}
            explanation={text.historyReadyExplanation}
            state="ready"
            intervals={[
              { kind: 'measured', id: 'morning', label: text.historyIntervalMorning, bytes: 240_000_000 },
              { kind: 'measured', id: 'noon', label: text.historyIntervalNoon, bytes: 128_000_000 },
              { kind: 'gap', id: 'evening', label: text.historyIntervalEvening },
            ]}
            locale={locale}
            labels={{ loading: text.historyLoading, empty: text.historyEmpty, error: text.historyError, measuredTag: text.historyMeasuredTag, gapTag: text.historyGapTag, gapExplanation: text.historyGapExplanation }}
          />
        </div>
      </section>

      <section className="gallery-section" aria-labelledby="gallery-setup-title">
        <h2 id="gallery-setup-title">{text.setupSectionTitle}</h2>
        <p>{text.setupSectionDescription}</p>
        <div className="ns-grid">
          <SetupState
            kind="context"
            label={text.setupContextLabel}
            title={text.setupContextTitle}
            explanation={text.setupContextExplanation}
          />
          <div className="ns-demo" ref={demoRef} tabIndex={-1} role="group" aria-label={text.setupDemoLabel}>
            <SetupState
              kind={setup}
              label={text.setupDemoLabel}
              title={setup === 'success' ? text.setupSuccessTitle : text.setupDeniedTitle}
              explanation={setup === 'success' ? text.setupSuccessExplanation : text.setupDemoExplanation}
              action={
                setup === 'success'
                  ? { label: text.setupReset, onClick: () => { setSetup('denied'); setInteracted(true); } }
                  : { label: text.setupRetry, onClick: () => { setSetup('success'); setInteracted(true); }, variant: 'primary' }
              }
            />
            {setup === 'success' && (
              <FeedbackLine tone="success" toneLabel={text.feedbackSuccessLabel} message={text.setupDemoSuccess} />
            )}
          </div>
          <div className="ns-demo">
            <SetupState
              kind="success"
              label={text.setupSuccessLabel}
              title={text.setupSuccessTitle}
              explanation={text.setupSuccessExplanation}
            />
            <FeedbackLine tone="success" toneLabel={text.feedbackSuccessLabel} message={text.feedbackSuccess} />
          </div>
        </div>
      </section>

      <section className="gallery-section" aria-labelledby="gallery-feedback-title">
        <h2 id="gallery-feedback-title">{text.feedbackSectionTitle}</h2>
        <p>{text.feedbackSectionDescription}</p>
        <div className="ns-grid">
          <FeedbackLine tone="info" toneLabel={text.feedbackInfoLabel} message={text.feedbackInfo} />
          <FeedbackLine tone="success" toneLabel={text.feedbackSuccessLabel} message={text.feedbackSuccess} />
          <FeedbackLine tone="error" toneLabel={text.feedbackErrorLabel} message={text.feedbackError} />
        </div>
      </section>
    </div>
  );
}
