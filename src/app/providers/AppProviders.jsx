import { LocaleProvider } from '../../shared/i18n/LocaleContext.jsx';
import { ThemeProvider } from '../../shared/theme/ThemeContext.jsx';

export default function AppProviders({ children }) {
  return (
    <LocaleProvider>
      <ThemeProvider>{children}</ThemeProvider>
    </LocaleProvider>
  );
}
