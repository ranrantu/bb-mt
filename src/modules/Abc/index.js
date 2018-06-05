/**
 * @file
 * @date 2018-6-4
 * @authors 蒋翔 (jiangxiang@meituan.com)
 * @description
 */
import Abc from './Abc.vue';
import * as constants from './AbcConstants';

export default {
  name: constants.NAME,
  path: constants.PATH,
  component: Abc,
  meta: {
    title: constants.TITLE,
    val_cid: constants.VAL_CID
  }
};
