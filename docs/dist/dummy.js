/*!
 * DummyJS v1.1.7
 * http://dummyjs.com/
 */

(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.Dummy = factory());
}(this, (function () { 'use strict';

var rand = function (min, max) {
  if(!min || !max) { return min; }
  min = Math.floor(min);
  max = Math.floor(max) + 1;
  return Math.floor(Math.random() * (max - min)) + min;
};

// repeat polyfill
var repeat = function (str, count) {
  return (function (str, count, rpt) {
    for (var i = 0; i < count; i++) { rpt += (typeof str == 'function' ? str() : String(str)); }

    return rpt;
  })(str, Math.floor(count), '');
};

// array.from polyfill (!IE)
var arr = function (nodelist) {
  return Array.from ? Array.from(nodelist) : Array.prototype.slice.call(nodelist);
};

var $$ = function (querySelector) {
    return arr(document.querySelectorAll(querySelector))
};

var text = function () {
  var args = [], len = arguments.length;
  while ( len-- ) args[ len ] = arguments[ len ];

  var wordCount = args.join(',').split(','); // allow for mixed argument input ie. ('20,30') or (20, 30)
  wordCount = rand(wordCount[0], wordCount[1]) || 10;

  var lib = 'lorem ipsum dolor sit amet consectetur adipiscing elit nunc euismod vel ' +
    'dolor nec viverra nullam auctor enim condimentum odio laoreet libero ' +
    'libero tincidunt est sagittis curabitur vitae';

  if(wordCount > 3) { lib += (' ' + 'a in id id at'); }

  var libRepeat = Math.ceil(wordCount/lib.split(' ').length);

  lib = repeat(lib, libRepeat).split(' ').sort(function () { return 0.5 - Math.random(); }).slice(0, wordCount).join(' ');

  return lib.charAt(0).toUpperCase() + lib.slice(1);
};

var src = function () {
  var args = [], len = arguments.length;
  while ( len-- ) args[ len ] = arguments[ len ];

  // allow for mixed argument input ie. (200, 200, el) ('200x200', el), ('200')
  var el = args[args.length - 1] instanceof HTMLImageElement ? args.pop() : null;
  var size = args.splice(0, 2).join('x');

  if(!size && el) {
    size = [parseInt(el.getAttribute('width') || el.offsetWidth), parseInt(el.getAttribute('height') || el.offsetHeight)].filter(function (v) {return !!v}).join('x');
    size =  size || (el.parentNode && el.parentNode.offsetWidth);
  }

  // split size to allow for random ranges
  size = (size + '' || '404').split('x').map(function (a){ return rand(a.split(',')[0] || '404', a.split(',')[1]); });

  var w = size[0];
  var h = size[1] || size[0];

  // Getting a little messy, but idea is to test next argument to see if it isn't a color (not #..) then remove it from the arguments list and return. Otherwise fallback..
  var text = args[0] && /^\w{2,}/.test(args[0]) ? args.splice(0, 1).pop() : ( el && el.getAttribute('data-text') || (w + '×' + h) );
  var bgColor = (el && el.getAttribute('data-color') || args[0] || '#ccc');
  var textColor = (el && el.getAttribute('data-text-color') || args[1] || '#888');

  // Better logic out there?
  var fontSize = (w / 3.5 / (text.length * 0.3)) - text.length;

  return 'data:image/svg+xml,'
    + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="'+ w + 'px" height="' + h + 'px">'
    + '<rect x="0" y="0" width="100%" height="100%" fill="' + bgColor + '"/>'
    + '<line opacity="0.5" x1="0%" y1="0%" x2="100%" y2="100%" stroke="' + textColor + '" stroke-width="2" />'
    + '<line opacity="0.5" x1="100%" y1="0%" x2="0%" y2="100%" stroke="' + textColor + '" stroke-width="2" />'
    + '<text stroke="' + bgColor + '" stroke-width="2em" x="50%" y="50%" alignment-baseline="middle" text-anchor="middle" font-size="'+fontSize+'" font-family="sans-serif">' + text + '</text>'
    + '<text fill="' + textColor + '" x="50%" y="50%" alignment-baseline="middle" text-anchor="middle" font-size="'+fontSize+'" font-family="sans-serif">' + text + '</text>'
    + '</svg>');
};

var table = function (rows, rowsTo, cols, colsTo) {
  if ( rows === void 0 ) rows = 3;
  if ( rowsTo === void 0 ) rowsTo = 6;
  if ( cols === void 0 ) cols = 3;
  if ( colsTo === void 0 ) colsTo = 6;

  cols = rand(cols, colsTo || cols);
  rows = rand(rows, rowsTo || rows);
  return "<table><thead><tr>"
    + repeat(function () { return ("<th>" + (text(1,3)) + "</th>"); }, cols)
    + "</tr></thead><tbody>"
    + repeat(("<tr>" + (repeat(function () { return ("<td>" + (text(3,10)) + "</td>"); }, cols)) + "</tr>"), rows)
    + "</tbody></table>";
};

var html = function (usersTags) {
  var tags = usersTags ? String(usersTags).split(',') : 'h1,h2,h3,h4,h5,ul,ol,table,blockquote,img,form'.split(',').join(',p,').split(',');
  var liFn = function () { return repeat(function () { return ("<li>" + (text(4, 10)) + "</li>"); }, rand(2, 5)); };

  var special = {
    a: function () { return ("<a href=\"#\">" + (text(2, 4)) + "</a>"); },
    ul: function () { return ("<ul>" + (liFn()) + "</ul>"); },
    ol: function (){ return ("<ol>" + (liFn()) + "</ol>"); },
    table: function () { return table(); },
    img: function () { return ("<img src=\"" + (src('400,1200x200,800')) + "\" />"); },
    select: function () { return ("<select>" + (repeat(function () { return ("<option>" + (text(2,4)) + "</option>"); }, 4, 10)) + "</select>"); },
    p: function () { return ("<p>" + (text(20, 50)) + "</p>"); },
    button: function () { return ("<button>" + (text(1, 4)) + "</button>"); },
    input: function () { return ("<input placeholder=\"" + (text(1,3)) + "\" />"); },
    form: function () { return ("<form action=\"#\">" + (html('label,input,label,select,button')) + "</form>"); }
  };

  tags = tags
    .map(function (tag) { return tag.trim().toLowerCase(); })
    .map(function (tag) { return special[tag] ? special[tag]() : ("<" + tag + ">" + (text(5, 15)) + "</" + tag + ">"); }).join('');

  // few extra tags for default
  tags += usersTags ? '' :
    "<hr /><p>" + (text(1, 3)) + " <strong>bold text</strong>. " + (text(1, 3)) + " <em>italic text</em>. " + (text(1, 3)) + " <a href=\"#\">a link</a>. " + (text(150, 250)) + "</p>"
    + repeat(function () { return ("<p>" + (text(50, 100)) + "</p>"); }, rand(1, 3));

  return tags;
};

// Undocumented but you could simply do:
// Dummy(123) instead of Dummy.text(123)
// or Dummy('100x100')
// or Dummy('table')
var expt = function () {
  var args = [], len = arguments.length;
  while ( len-- ) args[ len ] = arguments[ len ];

  var fn = String(args[0]).indexOf('x') > 0 ? src : parseInt(args[0]) > 0 ? text : html;

  return fn.apply(void 0, args);
};
expt.t = expt.txt = expt.text = text;
expt.src = expt.image = expt.img = src;
expt.html = html;

var parseDom = (function () {
  var parseOrder = [];
  var parsers = {};

  return {
    parsers: parsers,
    add: function(name, fn) {
      parsers[name] = fn;
      parseOrder.push(name);
    },
    all: function(opts) {
      if ( opts === void 0 ) opts = {};

      parseOrder.forEach(function (name) { return parsers[name](); });
    }
  };
})();

parseDom.add('copy', function (attr) {
  if ( attr === void 0 ) attr = 'data-copy';

  for (var i = 0; i < 3; i++) { $$(("[" + attr + "]"))
  .sort(function (a, b) { return a.compareDocumentPosition(b) & 2 ? 1 : -1; }) // inner first then parents
  .forEach(function (el) {
    var selector = el.getAttribute(attr);
    var elToCopy = document.querySelector(selector) || document.getElementById(selector) || document.getElementsByClassName(selector)[0];

    if(!elToCopy) {
      elToCopy = {outerHTML: (attr + "=\"" + selector + "\" element not found")};
    }

    el.outerHTML = elToCopy[elToCopy.tagName == 'SCRIPT' || elToCopy.tagName == 'TEMPLATE' ? 'innerHTML' : 'outerHTML'];
  }); }
});

parseDom.add('shorthand', function (textAttr, repeatAttr, htmlAttr) {
  if ( textAttr === void 0 ) textAttr = 'data-dummy';
  if ( repeatAttr === void 0 ) repeatAttr = 'data-repeat';
  if ( htmlAttr === void 0 ) htmlAttr = 'data-html';

  // kitchen sink
  $$(("[" + htmlAttr + "]")).forEach(function (el) {
    var tags = el.getAttribute(htmlAttr);
    el.removeAttribute(htmlAttr);

    el.innerHTML += expt.html(tags);
  });

  // list support
  $$(("ul[" + textAttr + "], ol[" + textAttr + "]")).forEach(function (el) {
    el.removeAttribute(textAttr);

    el.innerHTML += expt.html('ul').replace(/<\/?ul>/g, ''); // generate li's
  });

  // select support
  $$(("select[" + textAttr + "]")).forEach(function (el) {
    el.removeAttribute(textAttr);

    el.innerHTML += expt.html('select').replace(/<\/?select>/g, '');
  });

  // table support
  $$(("table[" + textAttr + "]")).forEach(function (el) {
    el.removeAttribute(textAttr);

    el.innerHTML = expt.html('table').replace(/<\/?table>/g, '');
  });
});

parseDom.add('repeat', function (attr) {
  if ( attr === void 0 ) attr = 'data-repeat';

  $$(("[" + attr + "]"))
  .sort(function (a, b) { return a.compareDocumentPosition(b) & 2 ? -1 : 1; })
  .forEach(function (el) {
    var amount = el.getAttribute(attr);
    el.outerHTML = repeat(el.outerHTML.replace(attr, attr + '-did'), rand(amount.split(',')[0], amount.split(',')[1]) || 4);
  });
});

parseDom.add('image', function (attr) {
  if ( attr === void 0 ) attr = 'data-dummy';

  $$(("img[" + attr + "]")).forEach(function (el) {
    el.src = expt.src(el.getAttribute(attr), el);

    el.removeAttribute(attr);
  });
});

parseDom.add('text', function (attr) {
  if ( attr === void 0 ) attr = 'data-dummy';

  var dummyTextEls = $$(("[" + attr + "]"));

  // prevent chromes latin translation prompt for pages with majority dummy text
  var meta = document.createElement('meta');
  meta.name = 'google';
  meta.content = 'notranslate';
  dummyTextEls.length && document.querySelector('head').appendChild(meta);

  // text support (works with inputs as well)
  dummyTextEls
    .sort(function (a, b) { return a.compareDocumentPosition(b) & 2 ? -1 : 1; }) // needed?
    .forEach(function (el) {
      el[el.tagName === 'INPUT' ? 'value' : 'innerHTML'] += expt.text(el.getAttribute(attr));
      el.removeAttribute(attr);
    });
});

parseDom.add('props', function (attr) {
  if ( attr === void 0 ) attr = 'data-dummy';

  // eg. data-dummy:placeholder or data-dummy:title
  var props = (document.body.innerHTML.match(new RegExp((attr + ":([a-zA-Z-]+)"), 'g'))||[]).map(function (e) { return e.replace((attr + ":"),''); });
  props.forEach(function (prop) { return $$(("[" + attr + "\\:" + prop + "]")).forEach(function (el) {
    el.setAttribute(prop, expt.text(el.getAttribute((attr + ":" + prop)))); // set attribute used instead of prop to allow for data-psudo-el="sdfsdf"
    el.removeAttribute((attr + ":" + prop));
  }); });
});

parseDom.add('tags', function (tag) {
  if ( tag === void 0 ) tag = 'dummy';

  // tag support for text <dummy text="23"></dummy> & <dummy 23></dummy>
  $$(tag).forEach(function (el) {
    el.outerHTML = expt.text(el.attributes[0]
      ? el.attributes[0].value || (parseInt(el.attributes[0].name) ? el.attributes[0].name : '')
      : '');
  });
});

if(document && document.addEventListener) {
  if(window.dummy_auto !== false) {
    document.createElement('dummy'); // still needed for IE support?
    document.addEventListener('DOMContentLoaded', parseDom.all);
  }

  // Expose parser and allows for selective parsing
  // eg. Dummy.parse.text('data-dummy')
  expt.parse = parseDom.parsers;
  expt.parse.all = parseDom.all;
}

if(window && window.jQuery) {
  window.jQuery.fn.dummy = function() {
    var args = [].slice.call(arguments);

    window.jQuery(this).each(function() {
      this.nodeName.toLowerCase() === 'img'
        ? this.src = expt.src.apply(null, args.concat(this))
        : this.innerHTML = expt.text.apply(null, args);
    });
  };
}

return expt;

})));
