import { I18nextProvider } from 'react-i18next';
import i18n from './src/locales/i18n';
import AppData from './src/views/MainData';

export default function App() {
  return (
    <I18nextProvider i18n={i18n}>
      <AppData />
    </I18nextProvider>
  );
}