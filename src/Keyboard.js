/*******************************************************************************
 * Copyright (c) 2016 EclipseSource. All rights reserved.
 ******************************************************************************/

import {Composite, device} from 'tabris';
import KeyboardLayout from './KeyboardLayout';
import configs from './keyboard-config';

export default class Keyboard extends Composite {

  constructor() {
    super({left: 0, bottom: 0, right: 0});
    let id = this._getInitialLayoutId();
    this._createKeyboardLayout(configs[id]);
    device.on('change:orientation', () => this._replaceLayout(this._layout.config));
  }

  show() {
    this._layout.visible = true;
  }

  hide() {
    this._layout.visible = false;
  }

  _replaceLayout(config) {
    this._layout.dispose();
    this._createKeyboardLayout(config);
    this._layout.visible = true;
  }

  _createKeyboardLayout(config) {
    this._layout = new KeyboardLayout(config).appendTo(this);
    this._layout.on('layout', id => this._replaceLayout(configs[id]));
    this._layout.on('input', key => this.trigger('input', this, key));
  }

  _getInitialLayoutId() {
    for (let id in configs) {
      if (configs[id].initial) {
        return id;
      }
    }
    return Object.keys(configs)[0];
  }

}
