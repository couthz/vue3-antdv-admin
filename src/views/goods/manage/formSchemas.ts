import type { FormSchema } from '@/components/core/schema-form/';

export const goodsSchemas: FormSchema<API.CreateGoodsParams>[] = [
  {
    field: 'goodsName',
    component: 'Input',
    label: '品名',
  },
  {
    field: 'color',
    component: 'Input',
    label: '颜色',
  },
  {
    field: 'size',
    component: 'InputTextArea',
    label: '尺码',
  },
  {
    field: 'fabric',
    component: 'Input',
    label: '面料',
  },
  {
    field: 'other',
    component: 'InputTextArea',
    label: '其他描述',
  },
  {
    field: 'wash',
    component: 'Input',
    label: '洗涤建议',
  },
  {
    field: 'price',
    component: 'Input',
    label: '价格',
  },
];
