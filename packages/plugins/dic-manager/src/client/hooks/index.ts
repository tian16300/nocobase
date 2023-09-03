import { FieldDataSource } from '@formily/core';
import { useField, useForm } from '@formily/react';
import { useAPIClient  } from '@nocobase/client';
/**
   *
   * @param field
   * @param options
   * @returns
   */
export const loadDics = async function (field) {
    const api = useAPIClient();
    return new Promise<FieldDataSource>((resolve) => {
        api.request({
            url: 'dic:list',
            params: {
                paginate: false
            }
        }).then((res) => {
            resolve(res.data?.data.map((item, index) => {
                // item.dicItems =  item.dicItems.map((_item)=>{
                //     return {
                //         ..._item,
                //         label: _item.label,
                //         value: item.value
                //     }
                // });
                return {
                    index,
                    ...item,
                    // value: {"dic":{"code":{"$eq":item.code}}}
                    // value:item.code
                    // value: {"dic":{"code":{"$eq":item.code}}}
                    // value:`dic.code $eq ${item.code}`
                };
            }));
        });
    });
};
const getItemsByCode = (dataSource = [], code) => {
    return (dataSource.filter((item) => { return item.code == code })[0] || {}).dicItems || [];
}
export const useDicItemDataSource = (field, dicField) => {
    const code = field.query('code').get('value');
    if (!code)
        return [];
    const dataSource = field.query('code').get('dataSource') || [];
    const dicItem = dataSource.filter((item) => {
        return item.code == code
    })[0] || {};
    const items = (dicItem.dicItems || []);

    // const tField = field.query('default').setDataSource(items);

    // const fieldPath = field.path.entire.replace('titleField', 'collection');
    // const collectionName = field.query(fieldPath).get('value');
    // const targetFields = getCollectionFields(collectionName);
    // const options = targetFields
    //   .filter((field) => {
    //     return !field.isForeignKey && getInterface(field.interface)?.titleUsable;
    //   })
    //   .map((field) => ({
    //     value: field?.name,
    //     label: compile(field?.uiSchema?.title) || field?.name,
    //   }));
    // field.dataSource = options;
    // field.dataSource = [];
    // field.dataSource = items;
    return items;
};


export const useGetDicItemById = async (dicItemId) => {
    const field = useField();
    if (typeof dicItemId == 'number') {
        // const api = useAPIClient();
        // const { data } = await api.request({
        //     url: 'dicItem:get',
        //     method: 'get',
        //     params: {
        //         id: dicItemId
        //     }
        // });
        // field.setValue(data);

    } else {
        // field.setValue(null);
    }
}
export const loadDicItems = (field, code) => {
    const api = useAPIClient();
    return new Promise<FieldDataSource>((resolve) => {
        api.request({
            url: 'dicItem:list',
            params: {
                // paginate: false,
                // appends: ['dicItems']
            }
        }).then((res) => {
            resolve(res.data?.data.map((item) => {
                // item.dicItems =  item.dicItems.map((_item)=>{
                //     return {
                //         ..._item,
                //         label: _item.title,
                //         value: item.value
                //     }
                // });
                return item;
            }));
        });
    });
};


export const changeDicCode = async function (field, value) {
    // console.log('changeDicCode', field, value);
    const form = useForm();
    // console.log('field',field);
    // const field = useFieldSchema();
    // return [];
    // const dicCode = field.query('code').get('value');
    const api = useAPIClient();
    // const cFilter = { "f_dic": { "code": { "$eq": dicCode || '' } } };
    return new Promise<FieldDataSource>((resolve) => {
        api.request({
            url: 'dicItems:list',
            params: {
                paginate: false,
                // filter: cFilter
            }
        }).then((res) => {
            resolve(res.data?.data.map((item) => {
                return {
                    label: item.title,
                    value: item.value
                }
            }));
        });
    });
}