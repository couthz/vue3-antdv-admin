declare namespace API {
  /** 新增角色 */
  type CreateGoodsParams = {
    goodsName: string;
    color: string;
    size: string;
    fabric: string;
    other: string;
    wash: string;
    price: string;
  };
  /** 更新角色 */
  type UpdateGoodsParams = CreateGoodsParams & {
    id: number;
  };

  /** 角色列表项 */
  type GoodsListResultItem = {
    id: number;
    goodsName: string;
    color: string;
    size: string;
    fabric: string;
    other: string;
    wash: string;
    price: string;
  };

  type GoodsStockResult = {
    id: number;
    goodsId: number;
    stock: string;
  };

  /** 角色列表 */
  type RoleListResult = RoleListResultItem[];

  /** 角色详情 */
  type RoleInfoResult = {
    roleInfo: {
      createTime: string;
      updateTime: string;
      id: number;
      userId: string;
      name: string;
      label: string;
      remark: string;
    };
    menus: {
      createTime: string;
      updateTime: string;
      id: number;
      roleId: number;
      menuId: number;
    }[];
    depts: {
      createTime: string;
      updateTime: string;
      id: number;
      roleId: number;
      departmentId: number;
    }[];
  };
}
