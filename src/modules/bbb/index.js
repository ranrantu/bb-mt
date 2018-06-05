/**
 * @file
 * @date 2018-6-4
 * @authors 蒋翔 (jiangxiang@meituan.com)
 * @description
 */
import bbb from './bbb.vue';
import * as constants from './bbbConstants';

export default {
  name: constants.NAME,
  path: constants.PATH,
  component: bbb,
  meta: {
    title: constants.TITLE,
    val_cid: constants.VAL_CID
  }
};
