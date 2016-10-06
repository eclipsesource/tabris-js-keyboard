/*******************************************************************************
 * Copyright (c) 2016 EclipseSource. All rights reserved.
 ******************************************************************************/

import * as tabrisMock from './tabris-mock.js';
import KeyboardLayout from '../src/widgets/KeyboardLayout.js';
import config from '../src/widgets/keyboard-config.json';
import {expect, stub, restoreSandbox} from './test';
import {device, Composite} from 'tabris';

const GERMAN_LAYOUT = 'germanLayout';

let keyboardLayout, deviceStub;

function fakeDeviceScreen() {
  deviceStub = stub(device, 'get');
  deviceStub.withArgs('orientation').returns('portrait');
  deviceStub.withArgs('screenWidth').returns(443);
}

describe('KeyboardLayout', () => {

  beforeEach(() => {
    fakeDeviceScreen();
    keyboardLayout = new KeyboardLayout(GERMAN_LAYOUT, config[GERMAN_LAYOUT]);
  });

  afterEach(() => {
    tabrisMock.reset();
    restoreSandbox();
  });

  describe('create', () => {

    it('creates keyboardLayout that instance of KeyboardLayout', () => {
      expect(keyboardLayout).to.be.an.instanceof(KeyboardLayout);
    });

    it('sets id', () => {
      expect(keyboardLayout.get('id')).to.equal(GERMAN_LAYOUT);
    });

    it('sets innerWidth', () => {
      expect(keyboardLayout._innerWidth).to.equal(443);
    });

    it('sets keyWidth', () => {
      expect(keyboardLayout._keyWidth).to.equal(37);
    });

    it('sets shiftPressed', () => {
      expect(keyboardLayout._shiftPressed).to.equal(false);
    });

    it('sets rowCount', () => {
      expect(keyboardLayout._rowCount).to.equal(4);
    });

    it('creates composite for bottom padding', () => {
      let bottomPadding = keyboardLayout.find('#bottomPadding').first();

      expect(bottomPadding).to.be.an.instanceof(Composite);
    });

    it('sets left of top left corner key', () => {
      let topLeftCornerKeyLeft = 3;

      expect(getKey(keyboardLayout, '1').get('left')).to.equal(topLeftCornerKeyLeft);
    });

    it('sets left of top right corner key', () => {
      let rightTopCornerKeyLeft = 399;

      expect(getKey(keyboardLayout, '0').get('left')).to.equal(rightTopCornerKeyLeft);
    });

    it('sets left of second row center key', () => {
      let secondRowCenterLeft = 203;
      let secondRowCenterTop = 56;

      expect(getKey(keyboardLayout, 'z').get('left')).to.equal(secondRowCenterLeft);
      expect(getKey(keyboardLayout, 'z').get('top')).to.equal(secondRowCenterTop);
    });

    it('sets left of bottom left corner key', () => {
      let bottomLeftCornerKeyLeft = 4.5;
      let bottomLeftCornerKeyTop = 162;

      expect(geOperationalKey(keyboardLayout,'shift').get('left')).to.equal(bottomLeftCornerKeyLeft);
      expect(geOperationalKey(keyboardLayout,'shift').get('top')).to.equal(bottomLeftCornerKeyTop);
    });

    it('sets left of bottom right corner key', () => {
      let bottomRightCornerKeyLeft = 392.25;
      let bottomRightCornerKeyTop = 162;

      expect(geOperationalKey(keyboardLayout,'remove').get('left')).to.equal(bottomRightCornerKeyLeft);
      expect(geOperationalKey(keyboardLayout,'remove').get('top')).to.equal(bottomRightCornerKeyTop);
    });

  });

  describe('listeners', () => {

    it('capitalizes letter keys', () => {
      let children = keyboardLayout.children('TextView');

      triggerOperationalKey(keyboardLayout, 'shift');

      for (let i = 0; i < children.length; i++) {
        let key = children[i];
        let text = key.get('text');
        if (keyboardLayout._isLetter(text)) {
          expect(text).to.equal(text.toUpperCase());
        }
      }
      expect(geOperationalKey(keyboardLayout, 'shift').get('background')).to.equal('rgba(255, 255, 255, 1)');
    });

    it('decapitalizes letter keys', () => {
      let children = keyboardLayout.children('TextView');

      triggerOperationalKey(keyboardLayout, 'shift');
      triggerOperationalKey(keyboardLayout, 'shift');

      for (let i = 0; i < children.length; i++) {
        let key = children[i];
        let text = key.get('text');
        if (keyboardLayout._isLetter(text)) {
          expect(text).to.equal(text.toLowerCase());
        }
      }
    });

  });

});

function getKey(keyboardLayout, text) {
  return keyboardLayout.find('#id_' + text.toLowerCase().charCodeAt(0)).first();
}

function geOperationalKey(keyboardLayout, id) {
  return keyboardLayout.find('#' + id).first();
}

function triggerOperationalKey(keyboardLayout, id) {
  let key = geOperationalKey(keyboardLayout, id);
  key.trigger('tap', key);
}
