export interface Preferences {
    density: 'comfortable' | 'compact';
    autoRefresh: boolean;
    pageSize: 12 | 24 | 48;
    showResolved: boolean;
}
export const defaultPreferences: Preferences = { density: 'comfortable', autoRefresh: false, pageSize: 12, showResolved: true };
