/*******************************************************************************
 * Copyright (c) 2016 EclipseSource. All rights reserved.
 ******************************************************************************/

import {Composite, TextView, ImageView, device} from 'tabris';

const ROW_HEIGHT = 50;
const ROW_SPACING = 3;
const DEFAULT_KEYS_LENGTH = 11;
const ANDROID_NAVIGATION_BAR_HEIGHT = 48;
const DEFAULT_BACKGROUND = '#E0E0E0';
const DEFAULT_KEY_BACKGROUND = 'white';
const DEFAULT_OPERATIONAL_KEY_BACKGROUND = '#BDBDBD';
const DEFAULT_KEY_FONT = '24px';

export default class KeyboardLayout extends Composite {

  constructor(config) {
    super({
      left: 0,
      right: 0,
      visible: false,
      background: DEFAULT_BACKGROUND
    });
    this._config = config;
    this._innerWidth = this._getInnerWidth();
    this._keyWidth = this._calculateKeyWidth(DEFAULT_KEYS_LENGTH);
    this._createKeys();
    this._createBottomPadding();
  }

  get config() {
    return this._config;
  }

  _calculateLeftPadding(layout, i) {
    let sumWeight = 0;
    let keysLength = layout[i].keys.length;
    for (let j = 0; j < keysLength; j++) {
      let key = layout[i].keys[j];
      sumWeight += key.weight ? key.weight : 1;
    }
    let rowWidth = sumWeight * this._keyWidth + (keysLength + 1) * ROW_SPACING;
    return (this._innerWidth - rowWidth) / 2;
  }

  _createKeys() {
    let layout = this._config.rows;
    let maxKeysLength = 0;
    this._rowCount = layout.length;
    for (let i = 0; i < layout.length; i++) {
      if (maxKeysLength < layout[i].keys.length) {
        maxKeysLength = layout[i].keys.length;
      }
      this._calculateKeyWidth(maxKeysLength);
      let leftPadding = this._calculateLeftPadding(layout, i);
      this._createKey(layout, i, leftPadding);
    }
  }

  _createKey(layout, row, leftPadding) {
    let sumWeight = 0;
    for (let column = 0; column < layout[row].keys.length; column++) {
      let key = layout[row].keys[column];
      if (typeof key === 'string') {
        key = {text: key};
      }
      if (key.image) {
        this._createImageKey(key, row, column, sumWeight, leftPadding);
      } else if (key.text) {
        this._createTextKey(key, row, column, sumWeight, leftPadding);
      }
      sumWeight += key.weight ? key.weight : 1;
    }
  }

  _createImageKey(object, row, column, sumWeight, leftPadding) {
    let view = new ImageView({
      id: object.id,
      class: 'key',
      left: this._keyWidth * sumWeight + (column + 1) * ROW_SPACING + leftPadding,
      top: (ROW_HEIGHT + ROW_SPACING) * row + ROW_SPACING,
      width: this._keyWidth * object.weight, height: ROW_HEIGHT,
      // TODO: find a better method of including images in a module
      image: {src: 'node_modules/tabris-keyboard/dist/' + object.image},
      cornerRadius: 7,
      highlightOnTouch: true,
      background: object.background ? object.background : DEFAULT_OPERATIONAL_KEY_BACKGROUND
    }).on('tap', () => this._processClick(view)).appendTo(this);
    view._key = object.id;
  }

  _createTextKey(object, row, column, sumWeight, leftPadding) {
    let weight = object.weight ? object.weight : 1;
    let textView = new TextView({
      id: object.id,
      class: 'key',
      left: this._keyWidth * sumWeight  + (column + 1) * ROW_SPACING + leftPadding,
      top: (ROW_HEIGHT + ROW_SPACING) * row + ROW_SPACING,
      width: this._keyWidth * weight, height: ROW_HEIGHT,
      text: object.text,
      cornerRadius: 7,
      alignment: 'center',
      highlightOnTouch: true,
      font: DEFAULT_KEY_FONT,
      background: object.background ? object.background : DEFAULT_KEY_BACKGROUND
    }).on('tap', () => this._processClick(textView)).appendTo(this);
    textView._key = object.text;
    if (object.target) {
      textView._target = object.target;
    }
  }

  _processClick(view) {
    if (view._target) {
      this.trigger('layout', view._target);
    } else if (view._key === 'shift') {
      this._shiftCase();
    } else {
      this.trigger('input', view.text || view._key);
      this._decapitalize();
    }
  }

  _shiftCase() {
    if (this._isUpperCase) {
      this._decapitalize();
    } else {
      this._capitalize();
    }
  }

  _capitalize() {
    this._toUpperCase();
    this.find('#shift').set('background', DEFAULT_KEY_BACKGROUND);
  }

  _decapitalize() {
    this._toLowerCase();
    this.find('#shift').set('background', DEFAULT_OPERATIONAL_KEY_BACKGROUND);
  }

  _toLowerCase() {
    this.children().forEach(child => {
      if (child.text && child.text.length === 1) {
        child.text = child.text.toLowerCase();
      }
    });
    this._isUpperCase = false;
  }

  _toUpperCase() {
    this.children().forEach(child => {
      if (child.text && child.text.length === 1) {
        child.text = child.text.toUpperCase();
      }
    });
    this._isUpperCase = true;
  }

  _getInnerWidth() {
    if (device.orientation.startsWith('portrait') || device.platform === 'iOS') {
      return device.screenWidth;
    }
    return device.screenWidth - ANDROID_NAVIGATION_BAR_HEIGHT;
  }

  _calculateKeyWidth(keysLength) {
    this._keyWidth = (this._innerWidth - (keysLength + 1) * ROW_SPACING) / keysLength;
  }

  _createBottomPadding() {
    new Composite({
      id: 'bottomPadding',
      background: DEFAULT_BACKGROUND,
      left: 0, top: (ROW_HEIGHT + ROW_SPACING) * this._rowCount,
      height: ROW_SPACING, right: 0
    }).appendTo(this);
  }

}
