/* globals window: false */
// polyfill installs fetch on self
global.self = global;

require('tabris');

class ClientMock {

  constructor() {
    this._widgets = {};
  }

  create(cid, type, properties) {
    this._widgets[cid] = {type, props: {}};
    Object.assign(this._widgets[cid].props, properties);
  }

  set(cid, properties) {
    if (!(cid in this._widgets)) {
      this._widgets[cid] = {props: {}};
    }
    Object.assign(this._widgets[cid].props, properties);
  }

  get(cid, name) {
    let value = cid in this._widgets ? this._widgets[cid].props[name] : undefined;
    if (name === 'bounds' && !value) {
      value = [0, 0, 0, 0];
    }
    return value;
  }

  call() {
  }

  listen() {
  }

  destroy() {
  }

}

let clientMock;

export function fakeInput(widget, value) {
  global.tabris.trigger('flush');
  clientMock.set(widget.cid, {text: value});
  global.tabris._notify(widget.cid, 'modify', {text: value});
}

export function fakeBounds(widget, bounds) {
  global.tabris.trigger('flush');
  clientMock.set(widget.cid, {bounds: [bounds.left, bounds.top, bounds.width, bounds.height]});
}

export function fakeRefresh(widget) {
  global.tabris.trigger('flush');
  clientMock.set(widget.cid, {refreshIndicator: true});
  global.tabris._notify(widget.cid, 'refresh');
}

export function fakeVersion(version) {
  global.tabris.trigger('flush');
  setTabrisDeviceProperty('version', version);
  global.device.version = version;
}

export function fakeScaleFactor(scaleFactor) {
  global.tabris.trigger('flush');
  setTabrisDeviceProperty('scaleFactor', scaleFactor);
  window.devicePixelRatio = scaleFactor;
}

export function fakePlatform(platform) {
  global.tabris.trigger('flush');
  setTabrisDeviceProperty('platform', platform);
  global.device.platform = platform;
}

export function fakeModel(model) {
  global.tabris.trigger('flush');
  setTabrisDeviceProperty('model', model);
  global.device.model = model;
}

export function fakeScreenSize(width, height) {
  global.tabris.trigger('flush');
  setTabrisDeviceProperty('screenWidth', width);
  setTabrisDeviceProperty('screenHeight', height);
  global.device.screenWidth = width;
  global.device.screenHeight = height;
}

function setTabrisDeviceProperty(name, value) {
  let widget = clientMock._widgets['tabris.Device'];
  let props = Object.assign({}, widget && widget.props, {[name]: value});
  clientMock.set('tabris.Device', props);
}

export function reset() {
  global.tabris._reset();
  initTabris();
}

function initTabris() {
  for (let key in global.tabris) {
    if (global.tabris[key] instanceof Object) {
      delete global.tabris[key]._rwtId;
    }
  }
  clientMock = new ClientMock();
  global.tabris._init(clientMock);
  global.tabris.ui = global.tabris.create('_UI');
  fakePlatform('test');
  fakeVersion('1.2.3');
  fakeModel('testmodel');
  fakeScreenSize(400, 700);
  fakeScaleFactor(2);
}

initTabris();
