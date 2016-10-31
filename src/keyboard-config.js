export default {
  'germanLayout': {
    'initial': true,
    'rows': [{
      'keys': [
        '1',
        '2',
        '3',
        '4',
        '5',
        '6',
        '7',
        '8',
        '9',
        '0'
      ]
    }, {
      'keys': [
        'q',
        'w',
        'e',
        'r',
        't',
        'z',
        'u',
        'i',
        'o',
        'p',
        'ü'
      ]
    }, {
      'keys': [
        'a',
        's',
        'd',
        'f',
        'g',
        'h',
        'j',
        'k',
        'l',
        'ö',
        'ä'
      ]
    }, {
      'keys': [{
        'id': 'shift',
        'image': 'images/arrow.png',
        'weight': 1.25
      }, {
        'id': 'switch',
        'target': 'symbolsLayout',
        'text': '.?!',
        'weight': 1.5,
        'background': '#BDBDBD'
      },
        'y',
        'x',
        'c',
        'v',
        'b',
        'n',
        'm', {
          'id': 'remove',
          'image': 'images/remove.png',
          'weight': 1.25
        }
      ]
    }]
  },
  'symbolsLayout': {
    'rows': [{
      'keys': [
        '@',
        '#',
        '$',
        '_',
        '&',
        '-',
        '+',
        '(',
        ')',
        '/'
      ]
    }, {
      'keys': [
        '*',
        '"',
        '\'',
        ':',
        ';',
        '!',
        '?',
        '~',
        '`',
        '|'
      ]
    }, {
      'keys': [
        '·',
        '^',
        '=',
        '{',
        '}',
        '\\',
        '%',
        '[',
        ']',
        '©'
      ]
    }, {
      'keys': [{
        'id': 'switch',
        'target': 'germanLayout',
        'text': 'ABC',
        'weight': 1.75,
        'background': '#BDBDBD'
      },
        '<',
        '>',
        '÷',
        '°',
        '¶',
        '.',
        ',', {
          'id': 'remove',
          'image': 'images/remove.png',
          'weight': 1.25
        }
      ]
    }]
  }
};
