import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { SelectionProvider } from '../features/selection/SelectionContext';
import { PreferencesProvider } from '../features/preferences/PreferencesContext';
export function renderApp(ui: React.ReactNode, { route = '/cases' } = {}) { return render(<MemoryRouter initialEntries={[route]}><PreferencesProvider><SelectionProvider>{ui}</SelectionProvider></PreferencesProvider></MemoryRouter>); }
