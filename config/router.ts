import type { defineConfig } from '@umijs/max';

type Routes = NonNullable<Parameters<typeof defineConfig>[0]['routes']>;

const routes: Routes = [
  { path: '/login', component: './Login', layout: false },
  { path: '/', redirect: '/login' },
];

export default routes;
