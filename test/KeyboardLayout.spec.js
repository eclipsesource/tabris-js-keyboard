/*******************************************************************************
 * Copyright (c) 2016 EclipseSource. All rights reserved.
 ******************************************************************************/

import * as tabrisMock from './tabris-mock.js';
import KeyboardLayout from '../src/KeyboardLayout.js';
import config from '../src/keyboard-config.js';
import {expect, stub, restoreSandbox} from './test';
import {device, Composite} from 'tabris';

const GERMAN_LAYOUT = 'germanLayout';

let keyboardLayout;

function fakeDeviceScreen() {
  let deviceStub = stub(device, 'get');
  deviceStub.withArgs('orientation').returns('portrait');
  deviceStub.withArgs('screenWidth').returns(443);
}

describe('KeyboardLayout', function() {

  beforeEach(function() {
    fakeDeviceScreen();
    keyboardLayout = new KeyboardLayout(config[GERMAN_LAYOUT]);
  });

  afterEach(function() {
    tabrisMock.reset();
    restoreSandbox();
  });

  describe('constructor', function() {

    it('creates an instance of KeyboardLayout', function() {
      expect(new KeyboardLayout(config[GERMAN_LAYOUT])).to.be.an.instanceof(KeyboardLayout);
    });

    it('keeps config', function() {
      expect(keyboardLayout.config).to.deep.equal(config[GERMAN_LAYOUT]);
    });

    it('creates composite for bottom padding', function() {
      let bottomPadding = keyboardLayout.find('#bottomPadding').first();

      expect(bottomPadding).to.be.an.instanceof(Composite);
    });

    it('sets left of top left corner key', function() {
      expect(keyboardLayout.find('.key').first().left).to.equal(3);
    });

  });

  describe('pressing shift key', function() {

    beforeEach(function() {
      fakeKeyPress(findKey('#shift'));
    });

    it('capitalizes letter keys', function() {
      expect(findKey(key => key.text === 'A')).to.be.ok;
      expect(findKey(key => key.text === 'a')).to.be.undefined;
    });

    it('highlights shift key', function() {
      expect(findKey('#shift').background).to.equal('rgba(255, 255, 255, 1)');
    });

  });

  describe('pressing shift key twice', function() {

    beforeEach(function() {
      fakeKeyPress(findKey('#shift'));
      fakeKeyPress(findKey('#shift'));
    });

    it('de-capitalizes letter keys', function() {
      expect(findKey(key => key.text === 'a')).to.be.ok;
      expect(findKey(key => key.text === 'A')).to.be.undefined;
    });

    it('de-highlights shift key', function() {
      expect(findKey('#shift').background).not.to.equal('rgba(255, 255, 255, 1)');
    });

  });

});

function findKey(selector) {
  return keyboardLayout.find('.key').filter(selector).first();
}

function fakeKeyPress(key) {
  if (key) {
    key.trigger('tap', key);
  }
}
