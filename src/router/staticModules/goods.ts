import type { RouteRecordRaw } from 'vue-router';
import RouterView from '@/layout/routerView/index.vue';
import { t } from '@/hooks/useI18n';

const moduleName = 'goods';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/goods',
    name: moduleName,
    redirect: '/goods/manage',
    component: RouterView,
    meta: {
      title: t('routes.goods.goods'),
      icon: 'icon-yibiaopan',
    },
    children: [
      {
        path: 'manage',
        name: `${moduleName}-manage`,
        meta: {
          title: t('routes.goods.manage'),
          icon: 'icon-shouye',
        },
        component: () =>
          import(/* webpackChunkName: "dashboard-welcome" */ '@/views/goods/manage/index.vue'),
      },
    ],
  },
];

export default routes;
