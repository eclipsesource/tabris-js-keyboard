/*******************************************************************************
 * Copyright (c) 2016 EclipseSource. All rights reserved.
 ******************************************************************************/

import * as tabrisMock from './tabris-mock.js';
import Keyboard from '../src/widgets/Keyboard.js';
import {expect, stub, restoreSandbox} from './test';
import {device, Composite} from 'tabris';

const GERMAN_LAYOUT = 'germanLayout';
const SYMBOLS_LAYOUT = 'symbolsLayout';

let keyboard, deviceStub, layout;

function fakeDeviceScreen() {
  deviceStub = stub(device, 'get');
  deviceStub.withArgs('orientation').returns('portrait');
  deviceStub.withArgs('screenWidth').returns(443);
}

describe('Keyboard', () => {

  beforeEach(() => {
    fakeDeviceScreen();
    keyboard = new Keyboard();
    layout = keyboard._layout;
  });

  afterEach(() => {
    tabrisMock.reset();
    restoreSandbox();
  });

  describe('create', () => {

    it('creates keyboard that instance of Keyboard', () => {
      expect(keyboard).to.be.an.instanceof(Keyboard);
    });

    it('creates layout that instance of Composite', () => {
      expect(layout).to.be.an.instanceof(Composite);
    });

    it('sets initial layout id ', () => {
      expect(layout.get('id')).to.equal(GERMAN_LAYOUT);
    });

    it('sets innerWidth', () => {
      expect(keyboard._innerWidth).to.equal(443);
    });

    it('sets keyWidth', () => {
      expect(keyboard._keyWidth).to.equal(37);
    });

    it('sets shiftPressed', () => {
      expect(keyboard._shiftPressed).to.equal(false);
    });

    it('sets rowCount', () => {
      expect(keyboard._rowCount).to.equal(4);
    });

    it('creates composite for bottom padding', () => {
      let bottomPadding = layout.find('#bottomPadding').first();

      expect(bottomPadding).to.be.an.instanceof(Composite);
    });

    it('sets left of top left corner key', () => {
      let topLeftCornerKeyLeft = 3;

      expect(getKey(layout, '1').get('left')).to.equal(topLeftCornerKeyLeft);
    });

    it('sets left of top right corner key', () => {
      let rightTopCornerKeyLeft = 399;

      expect(getKey(layout, '0').get('left')).to.equal(rightTopCornerKeyLeft);
    });

    it('sets left of second row center key', () => {
      let secondRowCenterLeft = 203;
      let secondRowCenterTop = 56;

      expect(getKey(layout, 'z').get('left')).to.equal(secondRowCenterLeft);
      expect(getKey(layout, 'z').get('top')).to.equal(secondRowCenterTop);
    });

    it('sets left of bottom left corner key', () => {
      let bottomLeftCornerKeyLeft = 4.5;
      let bottomLeftCornerKeyTop = 162;

      expect(geOperationalKey(layout,'shift').get('left')).to.equal(bottomLeftCornerKeyLeft);
      expect(geOperationalKey(layout,'shift').get('top')).to.equal(bottomLeftCornerKeyTop);
    });

    it('sets left of bottom right corner key', () => {
      let bottomRightCornerKeyLeft = 392.25;
      let bottomRightCornerKeyTop = 162;

      expect(geOperationalKey(layout,'remove').get('left')).to.equal(bottomRightCornerKeyLeft);
      expect(geOperationalKey(layout,'remove').get('top')).to.equal(bottomRightCornerKeyTop);
    });

  });

  describe('listeners', () => {

    it('registers orientation listener', () => {
      let oldLayout = layout;

      device.trigger('change:orientation', device, 'landscape');
      let newLayout = keyboard._layout;

      expect(oldLayout).not.equal(newLayout);
    });

    it('registers listeners for letter keys', () => {
      let clickedKeyText;
      let children = layout.children('TextView');
      keyboard.on('input', (keyboard, key) => { clickedKeyText = key; });

      for (let i = 0; i < children.length; i++) {
        let key = children[i];
        if (keyboard._isLetter(key.get('text'))) {
          key.trigger('tap', key);
          expect(key.get('text')).to.equal(clickedKeyText);
        }
      }
    });

    it('switches to symbol layout', () => {
      triggerClickKey(layout, '.?!');

      expect(layout.get('id')).to.equal(SYMBOLS_LAYOUT);
    });

    it('registers listeners for operational keys', () => {
      let clickedKeyId;
      keyboard.on('input', (keyboard, key) => { clickedKeyId = key; });

      triggerOperationalKey(layout, 'remove');

      expect(clickedKeyId).to.equal('remove');
    });

    it('capitalizes letter keys', () => {
      let children = layout.children('TextView');

      triggerOperationalKey(layout, 'shift');

      for (let i = 0; i < children.length; i++) {
        let key = children[i];
        let text = key.get('text');
        if (keyboard._isLetter(text)) {
          expect(text).to.equal(text.toUpperCase());
        }
      }
    });

    it('decapitalizes letter keys', () => {
      let children = layout.children('TextView');

      triggerOperationalKey(layout, 'shift');
      triggerOperationalKey(layout, 'shift');

      for (let i = 0; i < children.length; i++) {
        let key = children[i];
        let text = key.get('text');
        if (keyboard._isLetter(text)) {
          expect(text).to.equal(text.toLowerCase());
        }
      }
    });

    it('registers listeners for symbol keys', () => {
      triggerClickKey(layout, '.?!');

      let clickedKeyText;
      let children = layout.children('TextView');
      keyboard.on('input', (keyboard, key) => { clickedKeyText = key; });

      for (let i = 0; i < children.length; i++) {
        let key = children[i];
        let text = key.get('text');
        if (keyboard._isLetter(text) && text !== 'ABC') {
          key.trigger('tap', key);
          expect(text).to.equal(clickedKeyText);
        }
      }
    });

    it('switches to german layout', () => {
      triggerClickKey(layout, '.?!');
      triggerClickKey(layout, 'ABC');

      expect(layout.get('id')).to.equal(GERMAN_LAYOUT);
    });

  });

  describe('show', () => {

    it('shows keyboard', () => {
      keyboard.show();

      expect(layout.get('visible')).to.equal(true);
    });

  });

  describe('hide', () => {

    it('hides keyboard', () => {
      keyboard.hide();

      expect(layout.get('visible')).to.equal(false);
    });

  });

});

function getKey(layout, text) {
  return layout.find('#id_' + text.toLowerCase().charCodeAt(0)).first();
}

function geOperationalKey(layout, id) {
  return layout.find('#' + id).first();
}

function triggerClickKey(_layout, text) {
  let key = getKey(_layout, text);
  key.trigger('tap', key);
  layout = keyboard._layout;
}

function triggerOperationalKey(_layout, id) {
  let key = geOperationalKey(_layout, id);
  key.trigger('tap', key);
  layout = keyboard._layout;
}
