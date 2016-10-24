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
  constructor(id, config) {
    super({
      id: id,
      left: 0,
      right: 0,
      visible: false,
      background: DEFAULT_BACKGROUND
    });
    this._config = config;
    this._shiftPressed = false;
    this._innerWidth = this._getInnerWidth();
    this._keyWidth = this._calculateKeyWidth(DEFAULT_KEYS_LENGTH);
    this._createKeys();
    this._createBottomPadding();
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
      this._processKey(layout, i, leftPadding);
    }
  }

  _processKey(layout, i, leftPadding) {
    let sumWeight = 0;
    for (let j = 0; j < layout[i].keys.length; j++) {
      let key = layout[i].keys[j];
      if (typeof key === 'string') {
        this._createKey(key, 1, i, j, sumWeight, leftPadding);
        sumWeight += 1;
      } else if (typeof key === 'object') {
        this._processObject(key, i, j, sumWeight, leftPadding);
        sumWeight += key.weight ? key.weight : 1;
      }
    }
  }

  _createKey(letter, weight, row, column, sumWeight, leftPadding) {
    let textView = new TextView({
      id: 'id_' + letter.toLowerCase().charCodeAt(0),
      left: this._keyWidth * sumWeight  + (column + 1) * ROW_SPACING + leftPadding,
      top: (ROW_HEIGHT + ROW_SPACING) * row + ROW_SPACING,
      width: this._keyWidth * weight, height: ROW_HEIGHT,
      text: letter,
      cornerRadius: 7,
      alignment: 'center',
      highlightOnTouch: true,
      font: DEFAULT_KEY_FONT,
      background: DEFAULT_KEY_BACKGROUND
    }).on('tap', () => this._processClick(textView, textView.get('text'))).appendTo(this);
  }

  _createObjectKey(object, row, column, sumWeight, leftPadding) {
    let weight = object.weight ? object.weight : 1;
    let textView = new TextView({
      id: object.id ? object.id : 'id_' + object.text.toLowerCase().charCodeAt(0),
      left: this._keyWidth * sumWeight  + (column + 1) * ROW_SPACING + leftPadding,
      top: (ROW_HEIGHT + ROW_SPACING) * row + ROW_SPACING,
      width: this._keyWidth * weight, height: ROW_HEIGHT,
      text: object.text,
      cornerRadius: 7,
      alignment: 'center',
      highlightOnTouch: true,
      font: DEFAULT_KEY_FONT,
      background: object.background ? object.background : DEFAULT_KEY_BACKGROUND
    }).on('tap', () => this._processClick(textView, textView.get('text'))).appendTo(this);
    if (object.target) { textView.set('target', object.target); }
  }

  _createOperationalKey(object, row, column, sumWeight, leftPadding) {
    let imageView = new ImageView({
      id: object.id,
      left: this._keyWidth * sumWeight + (column + 1) * ROW_SPACING + leftPadding,
      top: (ROW_HEIGHT + ROW_SPACING) * row + ROW_SPACING,
      width: this._keyWidth * object.weight, height: ROW_HEIGHT,
      // TODO: find a better method of including images in a module
      image: {src: 'node_modules/tabris-keyboard/dist/' + object.image},
      cornerRadius: 7,
      highlightOnTouch: true,
      background: object.background ? object.background : DEFAULT_OPERATIONAL_KEY_BACKGROUND
    }).on('tap', () => this._processClick(imageView, imageView.get('id'))).appendTo(this);
  }

  _processObject(object, row, column, sumWeight, leftPadding) {
    if (object.image) {
      this._createOperationalKey(object, row, column, sumWeight, leftPadding);
    } else if (object.text) {
      this._createObjectKey(object, row, column, sumWeight, leftPadding);
    }
  }

  _processClick(key, text) {
    if (key.get('target')) {
      this.set('layout', key.get('target'));
    } else if (text === 'shift') {
      this._processShiftKey();
    } else {
      this.set('input', text);
      this._decapitalize();
    }
  }

  _processShiftKey() {
    if (this._shiftPressed) {
      this._decapitalize();
    } else {
      this._capitalize();
    }
  }

  _capitalize() {
    this._toUpperCase();
    this.find('#shift').first().set('background', DEFAULT_KEY_BACKGROUND);
    this._shiftPressed = true;
  }

  _decapitalize() {
    if (this._shiftPressed) {
      this._toLowerCase();
      this.find('#shift').first().set('background', DEFAULT_OPERATIONAL_KEY_BACKGROUND);
      this._shiftPressed = false;
    }
  }

  _toLowerCase() {
    let children = this.children();
    for (let i = 0; i < children.length; i++) {
      let text = children[i].get('text');
      if (text && this._isLetter(text)) {
        children[i].set('text', children[i].get('text').toLowerCase());
      }
    }
  }

  _toUpperCase() {
    let children = this.children();
    for (let i = 0; i < children.length; i++) {
      let text = children[i].get('text');
      if (text && this._isLetter(text)) {
        children[i].set('text', children[i].get('text').toUpperCase());
      }
    }
  }

  _isLetter(letter) {
    return letter.toLowerCase() !== letter.toUpperCase();
  }

  _getInnerWidth() {
    if (device.get('orientation').startsWith('portrait') || device.get('platform') === 'iOS') {
      return device.get('screenWidth');
    }
    return device.get('screenWidth') - ANDROID_NAVIGATION_BAR_HEIGHT;
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
