/* globals window: false */
// polyfill installs fetch on self
global.self = global;

import tabris from 'tabris';

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
  tabris.trigger('flush');
  clientMock.set(widget.cid, {text: value});
  tabris._notify(widget.cid, 'modify', {text: value});
}

export function fakeBounds(widget, bounds) {
  tabris.trigger('flush');
  clientMock.set(widget.cid, {bounds: [bounds.left, bounds.top, bounds.width, bounds.height]});
}

export function fakeRefresh(widget) {
  tabris.trigger('flush');
  clientMock.set(widget.cid, {refreshIndicator: true});
  tabris._notify(widget.cid, 'refresh');
}

export function fakeVersion(version) {
  tabris.trigger('flush');
  setTabrisDeviceProperty('version', version);
}

export function fakeScaleFactor(scaleFactor) {
  tabris.trigger('flush');
  setTabrisDeviceProperty('scaleFactor', scaleFactor);
  window.devicePixelRatio = scaleFactor;
}

export function fakePlatform(platform) {
  tabris.trigger('flush');
  setTabrisDeviceProperty('platform', platform);
}

export function fakeModel(model) {
  tabris.trigger('flush');
  setTabrisDeviceProperty('model', model);
}

export function fakeScreenSize(width, height) {
  tabris.trigger('flush');
  setTabrisDeviceProperty('screenWidth', width);
  setTabrisDeviceProperty('screenHeight', height);
}

export function fakeOrientation(orientation) {
  tabris.trigger('flush');
  setTabrisDeviceProperty('orientation', orientation);
}

function setTabrisDeviceProperty(name, value) {
  let widget = clientMock._widgets['tabris.Device'];
  let props = Object.assign({}, widget && widget.props, {[name]: value});
  clientMock.set('tabris.Device', props);
}

export function reset() {
  initTabris();
}

function initTabris() {
  clientMock = new ClientMock();
  tabris._proxies._proxies = {};
  tabris._init(clientMock);
  fakePlatform('test');
  fakeVersion('1.2.3');
  fakeModel('testmodel');
  fakeScreenSize(400, 700);
  fakeOrientation('portrait');
  fakeScaleFactor(2);
}

initTabris();
