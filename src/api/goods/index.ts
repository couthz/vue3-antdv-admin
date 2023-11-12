import { request } from '@/utils/request';
// import type { BaseResponse } from '@/utils/request';
import Api from '@/core/permission/modules/goods/goods';

export function getRoleInfo(query: { roleId: number }) {
  return request<API.RoleInfoResult>({
    url: Api.info,
    method: 'get',
    params: query,
  });
}

export function getRoleList(data?: API.PageParams) {
  return request<API.RoleListResult>({
    url: Api.list,
    method: 'get',
    data,
  });
}

export function getGoodsListByPage(query: API.PageParams) {
  return request({
    url: Api.page,
    method: 'get',
    params: query,
  });
}

export function createGoods(data: API.CreateGoodsParams) {
  return request(
    {
      url: Api.add,
      method: 'post',
      data,
    },
    {
      successMsg: '创建商品成功',
    },
  );
}

export function updateGoods(data: API.UpdateGoodsParams) {
  return request(
    {
      url: Api.update,
      method: 'post',
      data,
    },
    {
      successMsg: '更新商品成功',
    },
  );
}

export function updateStock(data: { goodsId: number; stock: string }) {
  return request(
    {
      url: Api.updateStock,
      method: 'post',
      data,
    },
    {
      successMsg: '更新库存成功',
    },
  );
}

export function getStock(query: { goodsId: number }) {
  return request<API.GoodsStockResult>({
    url: Api.getStock,
    method: 'get',
    params: query,
  });
}

export function deleteGoods(data: { id: number }) {
  return request(
    {
      url: Api.delete,
      method: 'post',
      data,
    },
    {
      successMsg: '删除商品成功',
    },
  );
}
