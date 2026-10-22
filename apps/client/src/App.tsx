import { useEffect, useState } from 'react';
import { Activity, ArrowDownUp, CirclePause, Laptop, LayoutDashboard, Moon, Shapes, Sun } from 'lucide-react';
import { Button } from './components/arc/button/button';
import { copy, type Locale } from './copy';
import { StateGallery } from './state-gallery';

type View = 'overview' | 'devices' | 'states';
type Theme = 'light' | 'dark';

const localePreference = 'netscope.locale';
const themePreference = 'netscope.theme';

/** Preferences are optional; a blocked or missing localStorage must not break the UI. */
function storedPreference<T extends string>(key: string, allowed: readonly T[], fallback: T): T {
  try {
    const stored = window.localStorage.getItem(key);
    return allowed.includes(stored as T) ? (stored as T) : fallback;
  } catch {
    return fallback;
  }
}

export function App() {
  const [locale, setLocale] = useState<Locale>(() => storedPreference<Locale>(localePreference, ['ar', 'en'], 'ar'));
  const [theme, setTheme] = useState<Theme>(() => storedPreference<Theme>(themePreference, ['light', 'dark'], 'light'));
  const [view, setView] = useState<View>('overview');
  const [showHelp, setShowHelp] = useState(false);
  const text = copy[locale];

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = locale === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.dataset.theme = theme;
    try {
      window.localStorage.setItem(localePreference, locale);
      window.localStorage.setItem(themePreference, theme);
    } catch {
      // The preference is a convenience; the current session still works without storage.
    }
  }, [locale, theme]);

  const heading = view === 'overview' ? text.title : view === 'devices' ? text.devices : text.galleryTitle;
  const subtitle = view === 'overview' ? text.subtitle : view === 'devices' ? text.devicesDescription : text.gallerySubtitle;

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
            <h1>{heading}</h1>
            <p>{subtitle}</p>
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
          ) : view === 'devices' ? (
            <section className="usage-panel" aria-labelledby="empty-devices-title">
              <Laptop size={28} aria-hidden="true" />
              <h2 id="empty-devices-title">{text.noDevices}</h2>
              <p>{text.devicesEmpty}</p>
            </section>
          ) : (
            <StateGallery locale={locale} />
          )}
          <footer className="page-footer">
            <span>{text.preview}</span>
            <Button variant="ghost" size="sm" aria-current={view === 'states' ? 'page' : undefined} onClick={() => setView('states')}>
              <Shapes size={18} aria-hidden="true" /><span>{text.statesNav}</span>
            </Button>
          </footer>
        </main>
      </div>
    </div>
  );
}
