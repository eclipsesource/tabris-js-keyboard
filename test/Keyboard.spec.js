/*******************************************************************************
 * Copyright (c) 2016 EclipseSource. All rights reserved.
 ******************************************************************************/

import * as tabrisMock from './tabris-mock.js';
import Keyboard from '../src/widgets/Keyboard.js';
import KeyboardLayout from '../src/widgets/KeyboardLayout.js';
import {expect, stub, restoreSandbox} from './test';
import {device} from 'tabris';

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

    it('creates layout that instance of KeyboardLayout', () => {
      expect(layout).to.be.an.instanceof(KeyboardLayout);
    });

    it('sets initial layout id', () => {
      expect(layout.get('id')).to.equal(GERMAN_LAYOUT);
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
        if (layout._isLetter(key.get('text'))) {
          key.trigger('tap', key);
          expect(key.get('text')).to.equal(clickedKeyText);
        }
      }
    });

    it('switches to symbol layout', () => {
      triggerObjectKey(layout, 'switch');

      expect(layout.get('id')).to.equal(SYMBOLS_LAYOUT);
    });

    it('registers listeners for operational keys', () => {
      let clickedKeyId;
      keyboard.on('input', (keyboard, key) => { clickedKeyId = key; });

      triggerOperationalKey(layout, 'remove');

      expect(clickedKeyId).to.equal('remove');
    });

    it('registers listeners for symbol keys', () => {
      triggerObjectKey(layout, 'switch');

      let clickedKeyText;
      let children = layout.children('TextView');
      keyboard.on('input', (keyboard, key) => { clickedKeyText = key; });

      for (let i = 0; i < children.length; i++) {
        let key = children[i];
        let text = key.get('text');
        if (layout._isLetter(text) && text !== 'ABC') {
          key.trigger('tap', key);
          expect(text).to.equal(clickedKeyText);
        }
      }
    });

    it('switches to german layout', () => {
      triggerObjectKey(layout, 'switch');
      triggerObjectKey(layout, 'switch');

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

function getObjectKey(layout, id) {
  return layout.find('#' + id).first();
}

function geOperationalKey(layout, id) {
  return layout.find('#' + id).first();
}

function triggerObjectKey(_layout, id) {
  let key = getObjectKey(_layout, id);
  key.trigger('tap', key);
  layout = keyboard._layout;
}

function triggerOperationalKey(_layout, id) {
  let key = geOperationalKey(_layout, id);
  key.trigger('tap', key);
  layout = keyboard._layout;
}
