import { createHashRouter, createPanel, RoutesConfig } from '@vkontakte/vk-mini-apps-router';

export const DEFAULT_VIEW_PANELS = {
  HOME: 'home',
  PERSIK: 'persik',
  RESUME: 'resume',
};

export const routes = RoutesConfig.create([
  createPanel(DEFAULT_VIEW_PANELS.HOME, '/'),
  createPanel(DEFAULT_VIEW_PANELS.PERSIK, '/persik'),
  // Define ':id' as an *optional* dynamic parameter in the path
  createPanel(DEFAULT_VIEW_PANELS.RESUME, '/resume/:id?'), // Add '?' here
]);

export const router = createHashRouter(routes.getRoutes());
