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
    label: '颜色\n格式如下:\n红色 蓝色 绿色',
  },
  {
    field: 'size',
    component: 'InputTextArea',
    label: '尺码\n格式如下:\nXL 胸围:xx 腰围:xx\nL 胸围:xx 腰围:xx,',
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
    defaultValue: '中性洗涤剂，常温手洗/干洗',
  },
  {
    field: 'price',
    component: 'Input',
    label: '价格',
  },
];
