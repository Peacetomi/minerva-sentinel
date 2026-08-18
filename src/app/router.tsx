import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AppShell } from '../components/AppShell';
import { CasesPage } from '../features/cases/CasesPage';
import { ActivityPage } from './ActivityPage';
import { SettingsPage } from './SettingsPage';
export const router = createBrowserRouter([{ path: '/', element: <AppShell />, children: [{ index: true, element: <Navigate to="/cases" replace/> }, { path: 'cases', element: <CasesPage /> }, { path: 'activity', element: <ActivityPage /> }, { path: 'settings', element: <SettingsPage /> }] }]);
