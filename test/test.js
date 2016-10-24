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

export {expect, spy, stub, mock, restoreSandbox, wait};
