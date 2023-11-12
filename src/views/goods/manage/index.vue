<template>
  <div>
    <Alert message="可编辑行表格" type="info" show-icon>
      <template #description> 可编辑行表格-可编辑行表格使用示例 </template>
    </Alert>
    <Card title="可编辑行表格基本使用示例" style="margin-top: 20px">
      <DynamicTable
        size="small"
        bordered
        :data-request="getGoodsListByPage"
        :columns="tableColumns"
        :editable-type="editableType"
        :on-save="handleSave"
        :on-cancel="handleCancelSave"
        row-key="id"
      >
        <template #toolbar>
          <a-button type="primary" :disabled="!$auth('sys.user.add')" @click="openGoodsModal({})">
            <PlusOutlined /> 新增
          </a-button>
          <Select ref="select" v-model:value="editableType">
            <Select.Option value="single">单行编辑</Select.Option>
            <Select.Option value="multiple">多行编辑</Select.Option>
            <Select.Option value="cell">可编辑单元格</Select.Option>
          </Select>
        </template>
      </DynamicTable>
    </Card>
  </div>
</template>

<script lang="ts" setup>
  import { ref, computed } from 'vue';
  import html2canvas from 'html2canvas';
  import { Alert, Card, Select, message, Modal } from 'ant-design-vue';
  import { type TableListItem } from './columns';
  import { columns } from './columns';
  import { goodsSchemas } from './formSchemas';
  import type { EditableType, OnSave, OnCancel } from '@/components/core/dynamic-table';
  import type { FormSchema } from '@/components/core/schema-form';
  import {
    getGoodsListByPage,
    createGoods,
    deleteGoods,
    updateGoods,
    updateStock,
    getStock,
  } from '@/api/goods';

  import { useTable } from '@/components/core/dynamic-table';
  import { useFormModal } from '@/hooks/useModal/useFormModal';
  import { waitTime } from '@/utils/common';

  defineOptions({
    name: 'EditRowTable',
  });

  function unsecuredCopyToClipboard(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand('copy');
    } catch (err) {
      console.error('Unable to copy to clipboard', err);
    }
    document.body.removeChild(textArea);
  }

  const [showModal] = useFormModal();

  const [DynamicTable, dynamicTableInstance] = useTable({ formProps: { autoSubmitOnEnter: true } });

  const editableType = ref<EditableType>('single');

  const tableColumns = computed<typeof columns>(() => [
    ...columns,
    {
      title: '操作',
      align: 'center',
      hideInTable: editableType.value === 'cell',
      width: 200,
      dataIndex: 'ACTION',
      actions: ({ record }) => {
        return [
          {
            label: '编辑',
            onClick: () => {
              openGoodsModal(record);
            },
          },
          {
            label: '删除',
            onClick: () => {
              Modal.confirm({
                title: '您确定要删除商品吗？',
                centered: true,
                onOk: async () => {
                  await deleteGoods({ id: record.id });
                  dynamicTableInstance?.reload();
                },
              });
            },
          },
          {
            label: '复制文案',
            onClick: async () => {
              const goodsStr = record.details;
              try {
                if (window.isSecureContext && navigator.clipboard) {
                  await navigator.clipboard.writeText(goodsStr);
                } else {
                  unsecuredCopyToClipboard(goodsStr);
                }
                message.success({ content: '复制成功!', duration: 2 });
              } catch (err) {
                message.success({ content: '复制失败!', duration: 2 });
              }
            },
          },
          {
            label: '库存编辑',
            onClick: async () => {
              const stockRecord = await getStock({ goodsId: record.id });
              console.log('完成');
              openStocksModal(record, stockRecord);
            },
          },
          {
            label: '淘宝上架',
            onClick: () => {},
          },
          {
            label: '下载库存',
            onClick: async () => {
              // 创建一个隐藏的 div
              const div = document.createElement('div');
              div.style.position = 'absolute';
              div.style.left = '-9999px';
              document.body.appendChild(div);

              // 创建表格
              const table = document.createElement('table');
              table.style.border = '1px solid black';
              table.style.borderCollapse = 'collapse';
              div.appendChild(table);

              //表头
              const thead = document.createElement('thead');
              const headTr = document.createElement('tr');
              const headTdOne = document.createElement('td');
              headTdOne.textContent = '仓库库存';
              headTdOne.style.border = '1px solid black';
              headTdOne.style.padding = '10px';
              headTr.appendChild(headTdOne);
              const headTdTwo = document.createElement('td');
              headTdTwo.textContent = '颜色';
              headTdTwo.style.border = '1px solid black';
              headTdTwo.style.padding = '10px';
              headTr.appendChild(headTdTwo);
              const headTdThree = document.createElement('td');
              headTdThree.textContent = '尺码';
              headTdThree.style.border = '1px solid black';
              headTdThree.style.padding = '10px';
              headTr.appendChild(headTdThree);
              thead.appendChild(headTr);
              table.appendChild(thead);

              // 使用split()方法将字符串转换为数组
              //["红色,s码:1","绿色,s码:1"]
              const stockStrArr = record.goodsStock.stock.split('|');

              // 使用reduce()方法将数组转换为对象
              const stockTotalObj = stockStrArr.reduce(
                (acc, item) => {
                  const [colorAndSize, stock] = item.split(':');
                  const [color, size] = colorAndSize.split(',');
                  const stockNum = parseInt(stock);
                  if (stockNum > 0) {
                    if (!(color in acc.colorStock)) {
                      acc.colorStock[color] = 0;
                      acc.sizeStock[color] = '';
                    }
                    acc.colorStock[color] += stockNum;
                    acc.sizeStock[color] += `${size}:(${stockNum}),`;
                    acc.totalStock += stockNum;
                  }
                  return acc;
                },
                { colorStock: {}, sizeStock: {}, totalStock: 0 },
              );
              const { colorStock, sizeStock, totalStock } = stockTotalObj;

              Object.keys(colorStock).forEach((color, index) => {
                const tr = document.createElement('tr');
                //tr.style.borderBottom = '1px solid black';
                table.appendChild(tr);
                if (index === 0) {
                  console.log(`遍历次数${index}`);
                  const totalTd = document.createElement('td');
                  totalTd.setAttribute('rowspan', Object.keys(colorStock).length.toString());
                  totalTd.textContent = `小计: ${totalStock}`;
                  tr.appendChild(totalTd);
                  //totalTd.style.border = '1px solid black'; // 添加边框
                  totalTd.style.border = 'none';
                  totalTd.style.padding = '10px';
                }

                //颜色及库存
                const tdName = document.createElement('td');
                tdName.style.border = '1px solid black'; // 添加边框
                tdName.style.padding = '30px';
                const div = document.createElement('div');
                div.style.textAlign = 'center'; // 设置文本居中对齐
                const p1 = document.createElement('p');
                p1.textContent = color;
                p1.style.margin = '0';
                div.appendChild(p1);
                const p2 = document.createElement('p');
                p2.textContent = `(${colorStock[color]})`;
                p2.style.margin = '0';
                div.appendChild(p2);
                tdName.appendChild(div);

                tr.appendChild(tdName);

                const sizeArr = sizeStock[color].split(',');
                sizeArr.forEach((size) => {
                  const sizeArrSingle = size.split(':');
                  if (sizeArrSingle == 'undefined') {
                    return;
                  }
                  const tdValue = document.createElement('td');
                  tdValue.style.border = '1px solid black'; // 添加边框
                  tdValue.style.borderRight = 'none';
                  tdValue.style.borderLeft = 'none';
                  tdValue.style.padding = '10px';
                  const span = document.createElement('span');
                  span.style.textAlign = 'center'; // 设置文本居中对齐
                  const p1 = document.createElement('p');
                  p1.textContent = sizeArrSingle[0];
                  p1.style.margin = '0';
                  span.appendChild(p1);
                  const p2 = document.createElement('p');
                  p2.textContent = sizeArrSingle[1];
                  p2.style.margin = '0';
                  span.appendChild(p2);
                  tdValue.appendChild(span);
                  tr.appendChild(tdValue);
                });
              });

              //合并尾列
              let maxCols = 0;
              for (let i = 0; i < table.rows.length; i++) {
                const row = table.rows[i];
                const cols = row.cells.length;
                if (cols > maxCols) {
                  maxCols = cols;
                }
              }
              for (let i = 0; i < table.rows.length; i++) {
                const row = table.rows[i];
                const cols = row.cells.length;
                const lastTd = row.lastElementChild as HTMLTableCellElement;
                lastTd!.colSpan = maxCols - cols + 1;
              }

              // 将表格转换为图片
              const canvas = await html2canvas(div);
              const imgData = canvas.toDataURL('image/png');

              // 创建下载链接并点击
              const link = document.createElement('a');
              link.href = imgData;
              link.download = `${record.goodsName}.png`;
              link.click();

              // 删除隐藏的 div
              document.body.removeChild(div);
            },
          },
        ];
      },
    },
  ]);

  const openGoodsModal = async (record: Partial<TableListItem> = {}) => {
    const [formRef] = await showModal<any>({
      modalProps: {
        title: `${record.id ? '编辑' : '新增'}文案`,
        width: 700,
        onFinish: async (values) => {
          console.log('新增文案', values);
          values.id = record.id;
          await (record.id ? updateGoods : createGoods)(values);
          dynamicTableInstance?.reload();
        },
      },
      formProps: {
        labelWidth: 100,
        schemas: goodsSchemas,
        autoSubmitOnEnter: true,
      },
    });
    formRef?.setFieldsValue(record);
  };

  const openStocksModal = async (
    record: Partial<TableListItem> = {},
    stockRecord: API.GoodsStockResult,
  ) => {
    const colors = record.color?.split(' ');

    const sizeLines = record.size?.split('\n');
    const sizes = sizeLines?.map((line) => line.split(' ')[0]);

    const colorAndSize: string[] = [];
    colors?.forEach((color) => {
      sizes?.forEach((size) => {
        colorAndSize.push(`${color},${size}`);
      });
    });

    const stockSchemas: FormSchema<any>[] = colorAndSize.map((field) => ({
      field,
      component: 'Input',
      label: field,
      rules: [{ required: true }],
    }));

    const [formRef] = await showModal<any>({
      modalProps: {
        title: `编辑库存`,
        width: 700,
        onFinish: async (values) => {
          console.log('编辑库存', values);
          const stockStr = Object.entries(values)
            .map(([key, value]) => `${key}:${value}`)
            .join('|');
          await updateStock({ goodsId: record.id!, stock: stockStr });
          dynamicTableInstance?.reload();
        },
      },
      formProps: {
        labelWidth: 100,
        schemas: stockSchemas,
        autoSubmitOnEnter: true,
      },
    });

    if (stockRecord) {
      const stockStr = stockRecord.stock;

      // 使用split()方法将字符串转换为数组
      const stockStrArr = stockStr.split('|');

      // 使用reduce()方法将数组转换为对象
      const stockStrObj = stockStrArr.reduce((acc, item) => {
        const [key, value] = item.split(':');
        acc[key] = value;
        return acc;
      }, {});
      //TODO 序列化
      formRef?.setFieldsValue(stockStrObj);
    }
  };

  const handleCancelSave: OnCancel = (rowKey, record, originRow) => {
    console.log('handleCancelSave', rowKey, record, originRow);
  };

  const handleSave: OnSave = async (rowKey, record, originRow) => {
    console.log('handleSave', rowKey, record, originRow);
    await waitTime(2000);
  };
</script>

<style lang="less" scoped></style>
