/*******************************************************************************
 * Copyright (c) 2016 EclipseSource. All rights reserved.
 ******************************************************************************/

import * as tabrisMock from './tabris-mock.js';
import Keyboard from '../src/Keyboard.js';
import KeyboardLayout from '../src/KeyboardLayout.js';
import {expect, spy, stub, restoreSandbox} from './test';
import {device} from 'tabris';

let keyboard;

describe('Keyboard', function() {

  beforeEach(function() {
    fakeDeviceScreen();
    keyboard = new Keyboard();
  });

  afterEach(function() {
    tabrisMock.reset();
    restoreSandbox();
  });

  describe('constructor', function() {

    it('creates an instance of Keyboard', function() {
      expect(keyboard).to.be.an.instanceof(Keyboard);
    });

    it('creates an initial keyboard layout', function() {
      let layout = keyboard.children().first();
      expect(layout).to.be.an.instanceof(KeyboardLayout);
      expect(layout.children().first().get('text')).to.equal('1');
    });

  });

  describe('input event', function() {

    let listener;

    beforeEach(function() {
      listener = spy();
      keyboard.on('input', listener);
    });

    it('is triggered by letter key', function() {
      fakeKeyPress(findKeyByText('a'));

      expect(listener).to.have.been.calledWith(keyboard, 'a');
    });

    it('is triggered by numerical key', function() {
      fakeKeyPress(findKeyByText('1'));

      expect(listener).to.have.been.calledWith(keyboard, '1');
    });

    it('is triggered by backspace key', function() {
      fakeKeyPress(findKey('#remove'));

      expect(listener).to.have.been.calledWith(keyboard, 'remove');
    });

    it('is not triggered by switch key', function() {
      fakeKeyPress(findKey('#switch'));

      expect(listener).to.not.have.been.called;
    });

  });

  describe('switch key', function() {

    it('switches to symbol layout', function() {
      fakeKeyPress(findKey('#switch'));

      expect(findKeyByText('@')).to.be.ok;
    });

    it('switches back to german layout', function() {
      fakeKeyPress(findKey('#switch'));
      fakeKeyPress(findKey('#switch'));

      expect(keyboard.find('.key').first().text).to.equal('1');
    });

  });

  describe('show', function() {

    it('shows keyboard', function() {
      let layout = keyboard.children().first();

      keyboard.show();

      expect(layout.get('visible')).to.equal(true);
    });

  });

  describe('hide', function() {

    it('hides keyboard', function() {
      let layout = keyboard.children().first();

      keyboard.hide();

      expect(layout.get('visible')).to.equal(false);
    });

  });

});

function fakeDeviceScreen() {
  let deviceStub = stub(device, 'get');
  deviceStub.withArgs('orientation').returns('portrait');
  deviceStub.withArgs('screenWidth').returns(443);
}

function findKey(selector) {
  return keyboard.find('.key').filter(selector).first();
}

function findKeyByText(text) {
  return keyboard.find('.key').filter(key => key.text === text).first();
}

function fakeKeyPress(key) {
  if (key) {
    key.trigger('tap', key);
  }
}
