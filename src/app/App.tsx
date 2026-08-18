import { RouterProvider } from 'react-router-dom';
import { PreferencesProvider } from '../features/preferences/PreferencesContext';
import { SelectionProvider } from '../features/selection/SelectionContext';
import { router } from './router';
export function App() { return <PreferencesProvider><SelectionProvider><RouterProvider router={router}/></SelectionProvider></PreferencesProvider>; }
