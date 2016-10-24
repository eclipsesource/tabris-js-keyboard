/*******************************************************************************
 * Copyright (c) 2016 EclipseSource. All rights reserved.
 ******************************************************************************/

import {Composite, device} from 'tabris';
import KeyboardLayout from './KeyboardLayout';
import config from './keyboard-config';

export default class Keyboard extends Composite {
  constructor() {
    super({left: 0, bottom: 0, right: 0});
    this._createKeyboardLayout(this._getInitialLayoutId());
    device.on('change:orientation', () => this._replaceLayout(this._layout.get('id')));
  }

  show() {
    this._layout.set('visible', true);
  }

  hide() {
    this._layout.set('visible', false);
  }

  _replaceLayout(id) {
    this._layout.dispose();
    this._createKeyboardLayout(id);
    this._layout.set('visible', true);
  }

  _createKeyboardLayout(id) {
    this._layout = new KeyboardLayout(id, config[id]).appendTo(this);
    this._layout.on('change:layout', (layout, id) => this._replaceLayout(id));
    this._layout.on('change:input', (layout, key) => this.trigger('input', this, key));
  }

  _getInitialLayoutId() {
    for (let id in config) {
      if (config[id].initial) {
        return id;
      }
    }
    return Object.keys(config)[0];
  }

}
