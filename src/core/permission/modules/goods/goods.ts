export const goods = {
  list: 'goods/manage/list',
  page: 'goods/manage/page',
  add: 'goods/manage/add',
  update: 'goods/manage/update',
  updateStock: 'goods/manage/updateStock',
  getStock: 'goods/manage/getStock',
  delete: 'goods/manage/delete',
  info: 'goods/manage/info',
} as const;

export const values = Object.values(goods);

export type GoodsPerms = (typeof values)[number];

export default goods;
