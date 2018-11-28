'use strict';

const Mock = require('mockjs');
const assert = require('power-assert');

const DingTalk = require('../../../lib/dingtalk');
const options = require('./../../fixtures/test.config');

describe('test/lib/api/workrecord.test.js', () => {
  let dingtalk;

  before(function* () {
    dingtalk = new DingTalk(options);
  });

  function getRandomMobile() {
    return '134444' + Mock.mock('@string("number", 5)');
  }

  function* createUser(mobile) {
    const userId = mobile || getRandomMobile();
    yield dingtalk.user.create({
      userid: userId,
      name: 'user-' + userId,
      mobile: userId,
      department: [ 1 ],
    });
    return yield dingtalk.user.get(userId);
  }

  it('create', function* () {
    const user = yield createUser();
    const workrecord = yield dingtalk.workrecord.create({
      userid: user.userid,
      create_time: new Date().getTime(),
      title: 'todo sth',
      url: 'https://oa.dingtalk.com',
      formItemList: [
        { title: 'todo1', content: 'buy milk' },
      ],
    });
    assert(workrecord.record_id);
    console.log('%j', workrecord);

    yield dingtalk.user.delete(user.userid);
  });

  it('update', function* () {
    const user = yield createUser();
    let workrecord = yield dingtalk.workrecord.create({
      userid: user.userid,
      create_time: new Date().getTime(),
      title: 'todo sth',
      url: 'https://oa.dingtalk.com',
      formItemList: [
        { title: 'todo1', content: 'buy milk' },
      ],
    });

    workrecord = yield dingtalk.workrecord.update({
      userid: user.userid,
      record_id: workrecord.record_id,
    });
    assert(workrecord.result);
  });

  it('list', function* () {
    const user = yield createUser();
    yield dingtalk.workrecord.create({
      userid: user.userid,
      create_time: new Date().getTime(),
      title: 'todo sth',
      url: 'https://oa.dingtalk.com',
      formItemList: [
        { title: 'todo1', content: 'buy milk' },
      ],
    });

    const result = yield dingtalk.workrecord.list(user.userid, 0, {
      offset: 0,
      limit: 10,
    });

    // console.log(result);
    assert(result.records.list.length > 0);
  });
});
