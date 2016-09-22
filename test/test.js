import chai, {expect} from 'chai';
import * as sinon from 'sinon';
import sinonChai from 'sinon-chai';

chai.use(sinonChai);

let sandbox = sinon.sandbox.create();
let spy = sandbox.spy.bind(sandbox);
let stub = sandbox.stub.bind(sandbox);
let mock = sandbox.mock.bind(sandbox);
let restoreSandbox = sandbox.restore.bind(sandbox);

function wait(delay) {
  return new Promise((func) => {
    setTimeout(func, delay);
  });
}

export function fakeNetworkInformation() {
  global.Connection = {
    WIFI: 'wifi',
    CELL_2G: '2g',
    CELL_3G: '3g',
    CELL_4G: '4g',
    CELL: 'cellular'
  };
  navigator.connection = {
    type: Connection.WIFI
  };
}

export {expect, spy, stub, mock, restoreSandbox, wait};
