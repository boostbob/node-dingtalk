'use strict';

const assert = require('assert');

/**
 * 待办相关 API
 * @type {User}
 */
module.exports = class User {
  constructor(client, options) {
    this.client = client;
    this.options = options;
  }

  /**
  * 创建待办
  *  - workrecord/create
  * @param {Object} opts 待办信息, { userid, create_time, title, url, formItemList, ... }
  * @return {Object} 操作结果 { workrecordid }
  */
  async create(opts) {
    assert(opts.userid, 'options.userid required');
    assert(opts.create_time, 'options.create_time required');
    assert(opts.url, 'options.url required');
    assert(opts.formItemList, 'options.formItemList required, Array<Object>');
    return this.client.post('topapi/workrecord/add', opts);
  }

  /**
   * 更新待办状态(用户的待办事项列表页面消失)
   *  - workrecord/update
   * @param {Object} opts 待办信息 { userid, record_id, ... }
   * @return {Object} 操作结果
   */
  async update(opts) {
    assert(opts.userid, 'options.userid required');
    assert(opts.record_id, 'options.record_id required');
    return this.client.post('topapi/workrecord/update', opts);
  }

  /**
  * 获取待办列表, 分页
  *   - user/list
  * @param {String} userid - 用户id
  * @param {String} status - 状态
  * @param {Object} [opts] - 其他扩展参数
  * @return {Array} 待办列表 { records: [] }
  */
  async list(userid, status, opts) {
    return this.client.post('topapi/workrecord/getbyuserid', Object.assign({}, { userid, status }, opts));
  }
};
