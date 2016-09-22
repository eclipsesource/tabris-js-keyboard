/*******************************************************************************
 * Copyright (c) 2016 EclipseSource. All rights reserved.
 ******************************************************************************/

import {Composite, TextView, ImageView, device} from 'tabris';
import config from './keyboard-config.json';

const ROW_HEIGHT = 50;
const ROW_SPACING = 3;
const DEFAULT_WEIGHT_SUM = 11;
const ANDROID_NAVIGATION_BAR_HEIGHT = 48;
const GERMAN_LAYOUT = 'germanLayout';
const SYMBOLS_LAYOUT = 'symbolsLayout';

export default class Keyboard extends Composite {
  constructor() {
    super();
    this.set('layoutData', {left: 0, bottom: 0, right: 0});
    this._createSubWidgets(GERMAN_LAYOUT);
    device.on('change:orientation', () => this._replaceLayout(this._layout.get('id')));
  }

  show() {
    this._layout.set('visible', true);
  }

  hide() {
    this._layout.set('visible', false);
  }

  _createSubWidgets(id) {
    this._innerWidth = this._getInnerWidth();
    this._keyWidth = this._calculateKeyWidth(DEFAULT_WEIGHT_SUM);
    this._shiftPressed = false;
    this._createLayout(id);
    this._createKeys();
    this._createBottomPadding();
  }

  _createLayout(id) {
    this._layout = new Composite({
      id: id,
      layoutData: {left: 0, right: 0},
      visible: false,
      background: '#E0E0E0'
    }).appendTo(this);
  }

  _replaceLayout(id) {
    this._layout.dispose();
    this._createSubWidgets(id);
    this._layout.set('visible', true);
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
    let layout = config[this._layout.get('id')];
    this._rowCount = layout.length;
    for (let i = 0; i < layout.length; i++) {
      this._calculateKeyWidth(layout[i].weightSum);
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
      layoutData: {
        left: sumWeight * this._keyWidth + (column + 1) * ROW_SPACING + leftPadding,
        top: (ROW_SPACING + ROW_HEIGHT) * row + ROW_SPACING,
        width: weight * this._keyWidth, height: ROW_HEIGHT
      },
      text: letter,
      cornerRadius: 7,
      alignment: 'center',
      highlightOnTouch: true,
      font: '24px',
      background: 'white'
    }).on('tap', () => this._processClick(textView.get('text'))).appendTo(this._layout);
  }

  _createOperationalKey(object, row, column, sumWeight, leftPadding) {
    let imageView = new ImageView({
      id: object.id,
      layoutData: {
        left: sumWeight * this._keyWidth + (column + 1) * ROW_SPACING + leftPadding,
        top: (ROW_SPACING + ROW_HEIGHT) * row + ROW_SPACING,
        width: object.weight * this._keyWidth, height: ROW_HEIGHT
      },
      image: {src: object.image},
      cornerRadius: 7,
      highlightOnTouch: true,
      background: '#BDBDBD'
    }).on('tap', () => this._processClick(imageView.get('id'))).appendTo(this._layout);
  }

  _processObject(object, row, column, sumWeight, leftPadding) {
    if (object.image) {
      this._createOperationalKey(object, row, column, sumWeight, leftPadding);
    } else if (object.text) {
      this._createKey(object.text, object.weight ? object.weight : 1, row, column, sumWeight, leftPadding);
    }
  }

  _processClick(key) {
    switch (key) {
      case 'shift': this._processShiftKey(); break;
      case '.?!': this._replaceLayout(SYMBOLS_LAYOUT); break;
      case 'ABC': this._replaceLayout(GERMAN_LAYOUT); break;
      default:
        this.trigger('input', this, key);
    }
  }

  _processShiftKey() {
    if (this._shiftPressed) {
      this._capitalize();
    } else {
      this._decapitalize();
    }
  }

  _capitalize() {
    this._toLowerCase();
    this._layout.find('#shift').first().set('background', '#BDBDBD');
    this._shiftPressed = false;
  }

  _decapitalize() {
    this._toUpperCase();
    this._layout.find('#shift').first().set('background', 'white');
    this._shiftPressed = true;
  }

  _toLowerCase() {
    let children = this._layout.children();
    for (let i = 0; i < children.length; i++) {
      let text = children[i].get('text');
      if (text && this._isLetter(text)) {
        children[i].set('text', children[i].get('text').toLowerCase());
      }
    }
  }

  _toUpperCase() {
    let children = this._layout.children();
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

  _calculateKeyWidth(weightSum) {
    this._keyWidth = (this._innerWidth - (weightSum + 1) * ROW_SPACING) / weightSum;
  }

  _createBottomPadding() {
    new Composite({
      id: 'bottomPadding',
      background: '#E0E0E0',
      layoutData: {
        left: 0, top: (ROW_SPACING + ROW_HEIGHT) * this._rowCount,
        height: ROW_SPACING, right: 0
      }
    }).appendTo(this._layout);
  }

}
