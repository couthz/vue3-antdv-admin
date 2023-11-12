import type { TableColumn } from '@/components/core/dynamic-table';

export type TableListItem = API.GoodsListResultItem;

// 数据项类型
// 使用TableColumn<ListItemType> 将会限制dataIndex的类型，但换来的是dataIndex有类型提示
export const columns: TableColumn[] = [
  {
    title: '品名',
    align: 'center',
    dataIndex: 'goodsName',
    editFormItemProps: {
      component: 'Input',
    },
  },
  {
    title: '颜色(空格分割)',
    align: 'center',
    dataIndex: 'color',
    editFormItemProps: {
      component: 'Input',
    },
  },
  {
    title: '尺码(不同尺码空格分割)',
    align: 'center',
    dataIndex: 'size',
    editFormItemProps: {
      component: 'Input',
    },
  },
  {
    title: '面料',
    align: 'center',
    dataIndex: 'fabric',
    editFormItemProps: {
      component: 'Input',
    },
  },
  {
    title: '其他描述',
    align: 'center',
    dataIndex: 'other',
    editFormItemProps: {
      component: 'Input',
    },
  },
  {
    title: '洗涤建议',
    align: 'center',
    dataIndex: 'wash',

    editFormItemProps: {
      component: 'Input',
    },
  },
  {
    title: '价格',
    align: 'center',
    dataIndex: 'price',
    editFormItemProps: {
      component: 'Input',
    },
  },
];
