import { LocaleProvider } from '../../shared/i18n/LocaleContext.jsx';
import { ThemeProvider } from '../../shared/theme/ThemeContext.jsx';
import { AuthProvider } from '../../shared/auth/AuthContext.jsx';

export default function AppProviders({ children }) {
  return (
    <AuthProvider>
      <LocaleProvider>
        <ThemeProvider>{children}</ThemeProvider>
      </LocaleProvider>
    </AuthProvider>
  );
}
