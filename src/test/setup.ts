import '@testing-library/jest-dom/vitest';
import { afterEach, beforeEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import { caseService } from '../services/caseService';
import { activityService } from '../services/activityService';
beforeEach(() => { localStorage.clear(); caseService.reset(); activityService.reset(); });
afterEach(() => cleanup());
