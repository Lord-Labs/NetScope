import { useEffect, useState } from 'react';
import { Activity, ArrowDownUp, CirclePause, Laptop, LayoutDashboard, Moon, Sun } from 'lucide-react';
import { Button } from './components/arc/button/button';
import { copy, type Locale } from './copy';

export function App() {
  const [locale, setLocale] = useState<Locale>('ar');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [view, setView] = useState<'overview' | 'devices'>('overview');
  const [showHelp, setShowHelp] = useState(false);
  const text = copy[locale];

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = locale === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.dataset.theme = theme;
  }, [locale, theme]);

  return (
    <div className="app" dir={locale === 'ar' ? 'rtl' : 'ltr'} lang={locale}>
      <a className="skip-link" href="#main">{text.skip}</a>
      <header className="app-header">
        <div className="brand"><Activity size={22} aria-hidden="true" /><span>NetScope</span></div>
        <div className="toolbar">
          <Button variant="ghost" size="lg" onClick={() => setLocale(locale === 'ar' ? 'en' : 'ar')} lang={locale === 'ar' ? 'en' : 'ar'}>
            {locale === 'ar' ? 'English' : 'العربية'}
          </Button>
          <Button variant="ghost" size="lg" aria-label={text.changeTheme} onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
            {theme === 'light' ? <Moon size={20} aria-hidden="true" /> : <Sun size={20} aria-hidden="true" />}
          </Button>
        </div>
      </header>
      <div className="workspace">
        <nav className="navigation" aria-label={text.navigation}>
          <Button variant={view === 'overview' ? 'secondary' : 'ghost'} size="lg" aria-current={view === 'overview' ? 'page' : undefined} onClick={() => setView('overview')}>
            <LayoutDashboard size={20} aria-hidden="true" /><span>{text.overview}</span>
          </Button>
          <Button variant={view === 'devices' ? 'secondary' : 'ghost'} size="lg" aria-current={view === 'devices' ? 'page' : undefined} onClick={() => setView('devices')}>
            <Laptop size={20} aria-hidden="true" /><span>{text.devices}</span>
          </Button>
        </nav>
        <main id="main" tabIndex={-1}>
          <div className="page-heading">
            <h1>{view === 'overview' ? text.title : text.devices}</h1>
            <p>{view === 'overview' ? text.subtitle : text.devicesDescription}</p>
          </div>
          {view === 'overview' ? (
            <>
              <section className="usage-panel" aria-labelledby="usage-title">
                <div className="panel-heading"><h2 id="usage-title">{text.recordedUsage}</h2><ArrowDownUp size={20} aria-hidden="true" /></div>
                <p className="metric" aria-label={text.unknown}>–</p>
                <p>{text.noMeasurements}</p>
                <div className="collector-state">
                  <div className="state-label" role="status"><CirclePause size={18} aria-hidden="true" />{text.notMeasuring}</div>
                  <p>{text.foundation}</p>
                </div>
              </section>
              <section className="explanation" aria-labelledby="coverage-title">
                <h2 id="coverage-title">{text.coverageTitle}</h2>
                <p>{text.coverageDescription}</p>
                <Button variant="primary" size="lg" aria-expanded={showHelp} aria-controls="how-it-works" onClick={() => setShowHelp(!showHelp)}>
                  {text.howItWorks}
                </Button>
                {showHelp && <div id="how-it-works" className="help"><h3>{text.helpTitle}</h3><p>{text.helpDescription}</p></div>}
              </section>
            </>
          ) : (
            <section className="usage-panel" aria-labelledby="empty-devices-title">
              <Laptop size={28} aria-hidden="true" />
              <h2 id="empty-devices-title">{text.noDevices}</h2>
              <p>{text.devicesEmpty}</p>
            </section>
          )}
          <footer className="page-footer">{text.preview}</footer>
        </main>
      </div>
    </div>
  );
}
