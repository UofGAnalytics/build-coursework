/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 2937:
/***/ ((__unused_webpack_module, exports) => {

"use strict";
/**
 * @licstart The following is the entire license notice for the
 * Javascript code in this page
 *
 * Copyright 2020 Mozilla Foundation
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @licend The above is the entire license notice for the
 * Javascript code in this page
 */


function xmlEncode(s) {
  var i = 0,
    ch;
  s = String(s);

  while (i < s.length && (ch = s[i]) !== "&" && ch !== "<" && ch !== '"' && ch !== "\n" && ch !== "\r" && ch !== "\t") {
    i++;
  }

  if (i >= s.length) {
    return s;
  }

  var buf = s.substring(0, i);

  while (i < s.length) {
    ch = s[i++];

    switch (ch) {
      case "&":
        buf += "&amp;";
        break;

      case "<":
        buf += "&lt;";
        break;

      case '"':
        buf += "&quot;";
        break;

      case "\n":
        buf += "&#xA;";
        break;

      case "\r":
        buf += "&#xD;";
        break;

      case "\t":
        buf += "&#x9;";
        break;

      default:
        buf += ch;
        break;
    }
  }

  return buf;
}

function DOMElement(name) {
  this.nodeName = name;
  this.childNodes = [];
  this.attributes = {};
  this.textContent = "";

  if (name === "style") {
    this.sheet = {
      cssRules: [],
      insertRule: function (rule) {
        this.cssRules.push(rule);
      }
    };
  }
}

DOMElement.prototype = {
  getAttribute: function DOMElement_getAttribute(name) {
    if (name in this.attributes) {
      return this.attributes[name];
    }

    return null;
  },
  getAttributeNS: function DOMElement_getAttributeNS(NS, name) {
    if (name in this.attributes) {
      return this.attributes[name];
    }

    if (NS) {
      var suffix = ":" + name;

      for (var fullName in this.attributes) {
        if (fullName.slice(-suffix.length) === suffix) {
          return this.attributes[fullName];
        }
      }
    }

    return null;
  },
  setAttribute: function DOMElement_setAttribute(name, value) {
    value = value || "";
    value = xmlEncode(value);
    this.attributes[name] = value;
  },
  setAttributeNS: function DOMElement_setAttributeNS(NS, name, value) {
    this.setAttribute(name, value);
  },
  appendChild: function DOMElement_appendChild(element) {
    var childNodes = this.childNodes;

    if (!childNodes.includes(element)) {
      childNodes.push(element);
    }
  },
  hasChildNodes: function DOMElement_hasChildNodes() {
    return this.childNodes.length !== 0;
  },
  cloneNode: function DOMElement_cloneNode() {
    var newNode = new DOMElement(this.nodeName);
    newNode.childNodes = this.childNodes;
    newNode.attributes = this.attributes;
    newNode.textContent = this.textContent;
    return newNode;
  },
  toString: function DOMElement_toString() {
    var buf = [];
    var serializer = this.getSerializer();
    var chunk;

    while ((chunk = serializer.getNext()) !== null) {
      buf.push(chunk);
    }

    return buf.join("");
  },
  getSerializer: function DOMElement_getSerializer() {
    return new DOMElementSerializer(this);
  }
};

function DOMElementSerializer(node) {
  this._node = node;
  this._state = 0;
  this._loopIndex = 0;
  this._attributeKeys = null;
  this._childSerializer = null;
}

DOMElementSerializer.prototype = {
  getNext: function DOMElementSerializer_getNext() {
    var node = this._node;

    switch (this._state) {
      case 0:
        ++this._state;
        return "<" + node.nodeName;

      case 1:
        ++this._state;

        if (node.nodeName === "svg:svg") {
          return ' xmlns:xlink="http://www.w3.org/1999/xlink"' + ' xmlns:svg="http://www.w3.org/2000/svg"';
        }

      case 2:
        ++this._state;
        this._loopIndex = 0;
        this._attributeKeys = Object.keys(node.attributes);

      case 3:
        if (this._loopIndex < this._attributeKeys.length) {
          var name = this._attributeKeys[this._loopIndex++];
          return " " + name + '="' + xmlEncode(node.attributes[name]) + '"';
        }

        ++this._state;
        return ">";

      case 4:
        if (node.nodeName === "svg:tspan" || node.nodeName === "svg:style") {
          this._state = 6;
          return xmlEncode(node.textContent);
        }

        ++this._state;
        this._loopIndex = 0;

      case 5:
        var value;

        while (true) {
          value = this._childSerializer && this._childSerializer.getNext();

          if (value !== null) {
            return value;
          }

          var nextChild = node.childNodes[this._loopIndex++];

          if (nextChild) {
            this._childSerializer = new DOMElementSerializer(nextChild);
          } else {
            this._childSerializer = null;
            ++this._state;
            break;
          }
        }

      case 6:
        ++this._state;
        return "</" + node.nodeName + ">";

      case 7:
        return null;

      default:
        throw new Error("Unexpected serialization state: " + this._state);
    }
  }
};
const document = {
  childNodes: [],

  get currentScript() {
    return {
      src: ""
    };
  },

  get documentElement() {
    return this;
  },

  createElementNS: function (NS, element) {
    var elObject = new DOMElement(element);
    return elObject;
  },
  createElement: function (element) {
    return this.createElementNS("", element);
  },
  getElementsByTagName: function (element) {
    if (element === "head") {
      return [this.head || (this.head = new DOMElement("head"))];
    }

    return [];
  }
};

function Image() {
  this._src = null;
  this.onload = null;
}

Image.prototype = {
  get src() {
    return this._src;
  },

  set src(value) {
    this._src = value;

    if (this.onload) {
      this.onload();
    }
  }

};
exports.document = document;
exports.Image = Image;
exports.Element = DOMElement;
var exported_symbols = Object.keys(exports);

exports.setStubs = function (namespace) {
  exported_symbols.forEach(function (key) {
    console.assert(!(key in namespace), "property should not be set: " + key);
    namespace[key] = exports[key];
  });
};

exports.unsetStubs = function (namespace) {
  exported_symbols.forEach(function (key) {
    console.assert(key in namespace, "property should be set: " + key);
    delete namespace[key];
  });
};


/***/ }),

/***/ 1527:
/***/ ((module) => {

"use strict";


module.exports = bail

function bail(err) {
  if (err) {
    throw err
  }
}


/***/ }),

/***/ 229:
/***/ ((module) => {

"use strict";


var hasOwn = Object.prototype.hasOwnProperty;
var toStr = Object.prototype.toString;
var defineProperty = Object.defineProperty;
var gOPD = Object.getOwnPropertyDescriptor;

var isArray = function isArray(arr) {
	if (typeof Array.isArray === 'function') {
		return Array.isArray(arr);
	}

	return toStr.call(arr) === '[object Array]';
};

var isPlainObject = function isPlainObject(obj) {
	if (!obj || toStr.call(obj) !== '[object Object]') {
		return false;
	}

	var hasOwnConstructor = hasOwn.call(obj, 'constructor');
	var hasIsPrototypeOf = obj.constructor && obj.constructor.prototype && hasOwn.call(obj.constructor.prototype, 'isPrototypeOf');
	// Not own constructor property must be Object
	if (obj.constructor && !hasOwnConstructor && !hasIsPrototypeOf) {
		return false;
	}

	// Own properties are enumerated firstly, so to speed up,
	// if last one is own, then all properties are own.
	var key;
	for (key in obj) { /**/ }

	return typeof key === 'undefined' || hasOwn.call(obj, key);
};

// If name is '__proto__', and Object.defineProperty is available, define __proto__ as an own property on target
var setProperty = function setProperty(target, options) {
	if (defineProperty && options.name === '__proto__') {
		defineProperty(target, options.name, {
			enumerable: true,
			configurable: true,
			value: options.newValue,
			writable: true
		});
	} else {
		target[options.name] = options.newValue;
	}
};

// Return undefined instead of __proto__ if '__proto__' is not an own property
var getProperty = function getProperty(obj, name) {
	if (name === '__proto__') {
		if (!hasOwn.call(obj, name)) {
			return void 0;
		} else if (gOPD) {
			// In early versions of node, obj['__proto__'] is buggy when obj has
			// __proto__ as an own property. Object.getOwnPropertyDescriptor() works.
			return gOPD(obj, name).value;
		}
	}

	return obj[name];
};

module.exports = function extend() {
	var options, name, src, copy, copyIsArray, clone;
	var target = arguments[0];
	var i = 1;
	var length = arguments.length;
	var deep = false;

	// Handle a deep copy situation
	if (typeof target === 'boolean') {
		deep = target;
		target = arguments[1] || {};
		// skip the boolean and the target
		i = 2;
	}
	if (target == null || (typeof target !== 'object' && typeof target !== 'function')) {
		target = {};
	}

	for (; i < length; ++i) {
		options = arguments[i];
		// Only deal with non-null/undefined values
		if (options != null) {
			// Extend the base object
			for (name in options) {
				src = getProperty(target, name);
				copy = getProperty(options, name);

				// Prevent never-ending loop
				if (target !== copy) {
					// Recurse if we're merging plain objects or arrays
					if (deep && copy && (isPlainObject(copy) || (copyIsArray = isArray(copy)))) {
						if (copyIsArray) {
							copyIsArray = false;
							clone = src && isArray(src) ? src : [];
						} else {
							clone = src && isPlainObject(src) ? src : {};
						}

						// Never move original objects, clone them
						setProperty(target, { name: name, newValue: extend(deep, clone, copy) });

					// Don't bring in undefined values
					} else if (typeof copy !== 'undefined') {
						setProperty(target, { name: name, newValue: copy });
					}
				}
			}
		}
	}

	// Return the modified object
	return target;
};


/***/ }),

/***/ 8809:
/***/ ((module) => {

/*!
 * Determine if an object is a Buffer
 *
 * @author   Feross Aboukhadijeh <https://feross.org>
 * @license  MIT
 */

module.exports = function isBuffer (obj) {
  return obj != null && obj.constructor != null &&
    typeof obj.constructor.isBuffer === 'function' && obj.constructor.isBuffer(obj)
}


/***/ }),

/***/ 7760:
/***/ ((module) => {

"use strict";


module.exports = value => {
	if (Object.prototype.toString.call(value) !== '[object Object]') {
		return false;
	}

	const prototype = Object.getPrototypeOf(value);
	return prototype === null || prototype === Object.prototype;
};


/***/ }),

/***/ 469:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var visit = __webpack_require__(2148)

module.exports = getDefinitionFactory

var own = {}.hasOwnProperty

// Get a definition in `node` by `identifier`.
function getDefinitionFactory(node, options) {
  return getterFactory(gather(node, options))
}

// Gather all definitions in `node`
function gather(node) {
  var cache = {}

  if (!node || !node.type) {
    throw new Error('mdast-util-definitions expected node')
  }

  visit(node, 'definition', ondefinition)

  return cache

  function ondefinition(definition) {
    var id = normalise(definition.identifier)
    if (!own.call(cache, id)) {
      cache[id] = definition
    }
  }
}

// Factory to get a node from the given definition-cache.
function getterFactory(cache) {
  return getter

  // Get a node from the bound definition-cache.
  function getter(identifier) {
    var id = identifier && normalise(identifier)
    return id && own.call(cache, id) ? cache[id] : null
  }
}

function normalise(identifier) {
  return identifier.toUpperCase()
}


/***/ }),

/***/ 7275:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


module.exports = fromMarkdown

// These three are compiled away in the `dist/`

var toString = __webpack_require__(8667)
var assign = __webpack_require__(1328)
var own = __webpack_require__(277)
var normalizeIdentifier = __webpack_require__(7243)
var safeFromInt = __webpack_require__(54)
var parser = __webpack_require__(2849)
var preprocessor = __webpack_require__(7500)
var postprocess = __webpack_require__(3153)
var decode = __webpack_require__(9944)
var stringifyPosition = __webpack_require__(9158)

function fromMarkdown(value, encoding, options) {
  if (typeof encoding !== 'string') {
    options = encoding
    encoding = undefined
  }

  return compiler(options)(
    postprocess(
      parser(options).document().write(preprocessor()(value, encoding, true))
    )
  )
}

// Note this compiler only understand complete buffering, not streaming.
function compiler(options) {
  var settings = options || {}
  var config = configure(
    {
      transforms: [],
      canContainEols: [
        'emphasis',
        'fragment',
        'heading',
        'paragraph',
        'strong'
      ],

      enter: {
        autolink: opener(link),
        autolinkProtocol: onenterdata,
        autolinkEmail: onenterdata,
        atxHeading: opener(heading),
        blockQuote: opener(blockQuote),
        characterEscape: onenterdata,
        characterReference: onenterdata,
        codeFenced: opener(codeFlow),
        codeFencedFenceInfo: buffer,
        codeFencedFenceMeta: buffer,
        codeIndented: opener(codeFlow, buffer),
        codeText: opener(codeText, buffer),
        codeTextData: onenterdata,
        data: onenterdata,
        codeFlowValue: onenterdata,
        definition: opener(definition),
        definitionDestinationString: buffer,
        definitionLabelString: buffer,
        definitionTitleString: buffer,
        emphasis: opener(emphasis),
        hardBreakEscape: opener(hardBreak),
        hardBreakTrailing: opener(hardBreak),
        htmlFlow: opener(html, buffer),
        htmlFlowData: onenterdata,
        htmlText: opener(html, buffer),
        htmlTextData: onenterdata,
        image: opener(image),
        label: buffer,
        link: opener(link),
        listItem: opener(listItem),
        listItemValue: onenterlistitemvalue,
        listOrdered: opener(list, onenterlistordered),
        listUnordered: opener(list),
        paragraph: opener(paragraph),
        reference: onenterreference,
        referenceString: buffer,
        resourceDestinationString: buffer,
        resourceTitleString: buffer,
        setextHeading: opener(heading),
        strong: opener(strong),
        thematicBreak: opener(thematicBreak)
      },

      exit: {
        atxHeading: closer(),
        atxHeadingSequence: onexitatxheadingsequence,
        autolink: closer(),
        autolinkEmail: onexitautolinkemail,
        autolinkProtocol: onexitautolinkprotocol,
        blockQuote: closer(),
        characterEscapeValue: onexitdata,
        characterReferenceMarkerHexadecimal: onexitcharacterreferencemarker,
        characterReferenceMarkerNumeric: onexitcharacterreferencemarker,
        characterReferenceValue: onexitcharacterreferencevalue,
        codeFenced: closer(onexitcodefenced),
        codeFencedFence: onexitcodefencedfence,
        codeFencedFenceInfo: onexitcodefencedfenceinfo,
        codeFencedFenceMeta: onexitcodefencedfencemeta,
        codeFlowValue: onexitdata,
        codeIndented: closer(onexitcodeindented),
        codeText: closer(onexitcodetext),
        codeTextData: onexitdata,
        data: onexitdata,
        definition: closer(),
        definitionDestinationString: onexitdefinitiondestinationstring,
        definitionLabelString: onexitdefinitionlabelstring,
        definitionTitleString: onexitdefinitiontitlestring,
        emphasis: closer(),
        hardBreakEscape: closer(onexithardbreak),
        hardBreakTrailing: closer(onexithardbreak),
        htmlFlow: closer(onexithtmlflow),
        htmlFlowData: onexitdata,
        htmlText: closer(onexithtmltext),
        htmlTextData: onexitdata,
        image: closer(onexitimage),
        label: onexitlabel,
        labelText: onexitlabeltext,
        lineEnding: onexitlineending,
        link: closer(onexitlink),
        listItem: closer(),
        listOrdered: closer(),
        listUnordered: closer(),
        paragraph: closer(),
        referenceString: onexitreferencestring,
        resourceDestinationString: onexitresourcedestinationstring,
        resourceTitleString: onexitresourcetitlestring,
        resource: onexitresource,
        setextHeading: closer(onexitsetextheading),
        setextHeadingLineSequence: onexitsetextheadinglinesequence,
        setextHeadingText: onexitsetextheadingtext,
        strong: closer(),
        thematicBreak: closer()
      }
    },

    settings.mdastExtensions || []
  )

  var data = {}

  return compile

  function compile(events) {
    var tree = {type: 'root', children: []}
    var stack = [tree]
    var tokenStack = []
    var listStack = []
    var index = -1
    var handler
    var listStart

    var context = {
      stack: stack,
      tokenStack: tokenStack,
      config: config,
      enter: enter,
      exit: exit,
      buffer: buffer,
      resume: resume,
      setData: setData,
      getData: getData
    }

    while (++index < events.length) {
      // We preprocess lists to add `listItem` tokens, and to infer whether
      // items the list itself are spread out.
      if (
        events[index][1].type === 'listOrdered' ||
        events[index][1].type === 'listUnordered'
      ) {
        if (events[index][0] === 'enter') {
          listStack.push(index)
        } else {
          listStart = listStack.pop(index)
          index = prepareList(events, listStart, index)
        }
      }
    }

    index = -1

    while (++index < events.length) {
      handler = config[events[index][0]]

      if (own.call(handler, events[index][1].type)) {
        handler[events[index][1].type].call(
          assign({sliceSerialize: events[index][2].sliceSerialize}, context),
          events[index][1]
        )
      }
    }

    if (tokenStack.length) {
      throw new Error(
        'Cannot close document, a token (`' +
          tokenStack[tokenStack.length - 1].type +
          '`, ' +
          stringifyPosition({
            start: tokenStack[tokenStack.length - 1].start,
            end: tokenStack[tokenStack.length - 1].end
          }) +
          ') is still open'
      )
    }

    // Figure out `root` position.
    tree.position = {
      start: point(
        events.length ? events[0][1].start : {line: 1, column: 1, offset: 0}
      ),

      end: point(
        events.length
          ? events[events.length - 2][1].end
          : {line: 1, column: 1, offset: 0}
      )
    }

    index = -1
    while (++index < config.transforms.length) {
      tree = config.transforms[index](tree) || tree
    }

    return tree
  }

  function prepareList(events, start, length) {
    var index = start - 1
    var containerBalance = -1
    var listSpread = false
    var listItem
    var tailIndex
    var lineIndex
    var tailEvent
    var event
    var firstBlankLineIndex
    var atMarker

    while (++index <= length) {
      event = events[index]

      if (
        event[1].type === 'listUnordered' ||
        event[1].type === 'listOrdered' ||
        event[1].type === 'blockQuote'
      ) {
        if (event[0] === 'enter') {
          containerBalance++
        } else {
          containerBalance--
        }

        atMarker = undefined
      } else if (event[1].type === 'lineEndingBlank') {
        if (event[0] === 'enter') {
          if (
            listItem &&
            !atMarker &&
            !containerBalance &&
            !firstBlankLineIndex
          ) {
            firstBlankLineIndex = index
          }

          atMarker = undefined
        }
      } else if (
        event[1].type === 'linePrefix' ||
        event[1].type === 'listItemValue' ||
        event[1].type === 'listItemMarker' ||
        event[1].type === 'listItemPrefix' ||
        event[1].type === 'listItemPrefixWhitespace'
      ) {
        // Empty.
      } else {
        atMarker = undefined
      }

      if (
        (!containerBalance &&
          event[0] === 'enter' &&
          event[1].type === 'listItemPrefix') ||
        (containerBalance === -1 &&
          event[0] === 'exit' &&
          (event[1].type === 'listUnordered' ||
            event[1].type === 'listOrdered'))
      ) {
        if (listItem) {
          tailIndex = index
          lineIndex = undefined

          while (tailIndex--) {
            tailEvent = events[tailIndex]

            if (
              tailEvent[1].type === 'lineEnding' ||
              tailEvent[1].type === 'lineEndingBlank'
            ) {
              if (tailEvent[0] === 'exit') continue

              if (lineIndex) {
                events[lineIndex][1].type = 'lineEndingBlank'
                listSpread = true
              }

              tailEvent[1].type = 'lineEnding'
              lineIndex = tailIndex
            } else if (
              tailEvent[1].type === 'linePrefix' ||
              tailEvent[1].type === 'blockQuotePrefix' ||
              tailEvent[1].type === 'blockQuotePrefixWhitespace' ||
              tailEvent[1].type === 'blockQuoteMarker' ||
              tailEvent[1].type === 'listItemIndent'
            ) {
              // Empty
            } else {
              break
            }
          }

          if (
            firstBlankLineIndex &&
            (!lineIndex || firstBlankLineIndex < lineIndex)
          ) {
            listItem._spread = true
          }

          // Fix position.
          listItem.end = point(
            lineIndex ? events[lineIndex][1].start : event[1].end
          )

          events.splice(lineIndex || index, 0, ['exit', listItem, event[2]])
          index++
          length++
        }

        // Create a new list item.
        if (event[1].type === 'listItemPrefix') {
          listItem = {
            type: 'listItem',
            _spread: false,
            start: point(event[1].start)
          }

          events.splice(index, 0, ['enter', listItem, event[2]])
          index++
          length++
          firstBlankLineIndex = undefined
          atMarker = true
        }
      }
    }

    events[start][1]._spread = listSpread
    return length
  }

  function setData(key, value) {
    data[key] = value
  }

  function getData(key) {
    return data[key]
  }

  function point(d) {
    return {line: d.line, column: d.column, offset: d.offset}
  }

  function opener(create, and) {
    return open

    function open(token) {
      enter.call(this, create(token), token)
      if (and) and.call(this, token)
    }
  }

  function buffer() {
    this.stack.push({type: 'fragment', children: []})
  }

  function enter(node, token) {
    this.stack[this.stack.length - 1].children.push(node)
    this.stack.push(node)
    this.tokenStack.push(token)
    node.position = {start: point(token.start)}
    return node
  }

  function closer(and) {
    return close

    function close(token) {
      if (and) and.call(this, token)
      exit.call(this, token)
    }
  }

  function exit(token) {
    var node = this.stack.pop()
    var open = this.tokenStack.pop()

    if (!open) {
      throw new Error(
        'Cannot close `' +
          token.type +
          '` (' +
          stringifyPosition({start: token.start, end: token.end}) +
          '): it’s not open'
      )
    } else if (open.type !== token.type) {
      throw new Error(
        'Cannot close `' +
          token.type +
          '` (' +
          stringifyPosition({start: token.start, end: token.end}) +
          '): a different token (`' +
          open.type +
          '`, ' +
          stringifyPosition({start: open.start, end: open.end}) +
          ') is open'
      )
    }

    node.position.end = point(token.end)
    return node
  }

  function resume() {
    return toString(this.stack.pop())
  }

  //
  // Handlers.
  //

  function onenterlistordered() {
    setData('expectingFirstListItemValue', true)
  }

  function onenterlistitemvalue(token) {
    if (getData('expectingFirstListItemValue')) {
      this.stack[this.stack.length - 2].start = parseInt(
        this.sliceSerialize(token),
        10
      )

      setData('expectingFirstListItemValue')
    }
  }

  function onexitcodefencedfenceinfo() {
    var data = this.resume()
    this.stack[this.stack.length - 1].lang = data
  }

  function onexitcodefencedfencemeta() {
    var data = this.resume()
    this.stack[this.stack.length - 1].meta = data
  }

  function onexitcodefencedfence() {
    // Exit if this is the closing fence.
    if (getData('flowCodeInside')) return
    this.buffer()
    setData('flowCodeInside', true)
  }

  function onexitcodefenced() {
    var data = this.resume()
    this.stack[this.stack.length - 1].value = data.replace(
      /^(\r?\n|\r)|(\r?\n|\r)$/g,
      ''
    )

    setData('flowCodeInside')
  }

  function onexitcodeindented() {
    var data = this.resume()
    this.stack[this.stack.length - 1].value = data
  }

  function onexitdefinitionlabelstring(token) {
    // Discard label, use the source content instead.
    var label = this.resume()
    this.stack[this.stack.length - 1].label = label
    this.stack[this.stack.length - 1].identifier = normalizeIdentifier(
      this.sliceSerialize(token)
    ).toLowerCase()
  }

  function onexitdefinitiontitlestring() {
    var data = this.resume()
    this.stack[this.stack.length - 1].title = data
  }

  function onexitdefinitiondestinationstring() {
    var data = this.resume()
    this.stack[this.stack.length - 1].url = data
  }

  function onexitatxheadingsequence(token) {
    if (!this.stack[this.stack.length - 1].depth) {
      this.stack[this.stack.length - 1].depth = this.sliceSerialize(
        token
      ).length
    }
  }

  function onexitsetextheadingtext() {
    setData('setextHeadingSlurpLineEnding', true)
  }

  function onexitsetextheadinglinesequence(token) {
    this.stack[this.stack.length - 1].depth =
      this.sliceSerialize(token).charCodeAt(0) === 61 ? 1 : 2
  }

  function onexitsetextheading() {
    setData('setextHeadingSlurpLineEnding')
  }

  function onenterdata(token) {
    var siblings = this.stack[this.stack.length - 1].children
    var tail = siblings[siblings.length - 1]

    if (!tail || tail.type !== 'text') {
      // Add a new text node.
      tail = text()
      tail.position = {start: point(token.start)}
      this.stack[this.stack.length - 1].children.push(tail)
    }

    this.stack.push(tail)
  }

  function onexitdata(token) {
    var tail = this.stack.pop()
    tail.value += this.sliceSerialize(token)
    tail.position.end = point(token.end)
  }

  function onexitlineending(token) {
    var context = this.stack[this.stack.length - 1]

    // If we’re at a hard break, include the line ending in there.
    if (getData('atHardBreak')) {
      context.children[context.children.length - 1].position.end = point(
        token.end
      )

      setData('atHardBreak')
      return
    }

    if (
      !getData('setextHeadingSlurpLineEnding') &&
      config.canContainEols.indexOf(context.type) > -1
    ) {
      onenterdata.call(this, token)
      onexitdata.call(this, token)
    }
  }

  function onexithardbreak() {
    setData('atHardBreak', true)
  }

  function onexithtmlflow() {
    var data = this.resume()
    this.stack[this.stack.length - 1].value = data
  }

  function onexithtmltext() {
    var data = this.resume()
    this.stack[this.stack.length - 1].value = data
  }

  function onexitcodetext() {
    var data = this.resume()
    this.stack[this.stack.length - 1].value = data
  }

  function onexitlink() {
    var context = this.stack[this.stack.length - 1]

    // To do: clean.
    if (getData('inReference')) {
      context.type += 'Reference'
      context.referenceType = getData('referenceType') || 'shortcut'
      delete context.url
      delete context.title
    } else {
      delete context.identifier
      delete context.label
      delete context.referenceType
    }

    setData('referenceType')
  }

  function onexitimage() {
    var context = this.stack[this.stack.length - 1]

    // To do: clean.
    if (getData('inReference')) {
      context.type += 'Reference'
      context.referenceType = getData('referenceType') || 'shortcut'
      delete context.url
      delete context.title
    } else {
      delete context.identifier
      delete context.label
      delete context.referenceType
    }

    setData('referenceType')
  }

  function onexitlabeltext(token) {
    this.stack[this.stack.length - 2].identifier = normalizeIdentifier(
      this.sliceSerialize(token)
    ).toLowerCase()
  }

  function onexitlabel() {
    var fragment = this.stack[this.stack.length - 1]
    var value = this.resume()

    this.stack[this.stack.length - 1].label = value

    // Assume a reference.
    setData('inReference', true)

    if (this.stack[this.stack.length - 1].type === 'link') {
      this.stack[this.stack.length - 1].children = fragment.children
    } else {
      this.stack[this.stack.length - 1].alt = value
    }
  }

  function onexitresourcedestinationstring() {
    var data = this.resume()
    this.stack[this.stack.length - 1].url = data
  }

  function onexitresourcetitlestring() {
    var data = this.resume()
    this.stack[this.stack.length - 1].title = data
  }

  function onexitresource() {
    setData('inReference')
  }

  function onenterreference() {
    setData('referenceType', 'collapsed')
  }

  function onexitreferencestring(token) {
    var label = this.resume()
    this.stack[this.stack.length - 1].label = label
    this.stack[this.stack.length - 1].identifier = normalizeIdentifier(
      this.sliceSerialize(token)
    ).toLowerCase()
    setData('referenceType', 'full')
  }

  function onexitcharacterreferencemarker(token) {
    setData('characterReferenceType', token.type)
  }

  function onexitcharacterreferencevalue(token) {
    var data = this.sliceSerialize(token)
    var type = getData('characterReferenceType')
    var value
    var tail

    if (type) {
      value = safeFromInt(
        data,
        type === 'characterReferenceMarkerNumeric' ? 10 : 16
      )

      setData('characterReferenceType')
    } else {
      value = decode(data)
    }

    tail = this.stack.pop()
    tail.value += value
    tail.position.end = point(token.end)
  }

  function onexitautolinkprotocol(token) {
    onexitdata.call(this, token)
    this.stack[this.stack.length - 1].url = this.sliceSerialize(token)
  }

  function onexitautolinkemail(token) {
    onexitdata.call(this, token)
    this.stack[this.stack.length - 1].url =
      'mailto:' + this.sliceSerialize(token)
  }

  //
  // Creaters.
  //

  function blockQuote() {
    return {type: 'blockquote', children: []}
  }

  function codeFlow() {
    return {type: 'code', lang: null, meta: null, value: ''}
  }

  function codeText() {
    return {type: 'inlineCode', value: ''}
  }

  function definition() {
    return {
      type: 'definition',
      identifier: '',
      label: null,
      title: null,
      url: ''
    }
  }

  function emphasis() {
    return {type: 'emphasis', children: []}
  }

  function heading() {
    return {type: 'heading', depth: undefined, children: []}
  }

  function hardBreak() {
    return {type: 'break'}
  }

  function html() {
    return {type: 'html', value: ''}
  }

  function image() {
    return {type: 'image', title: null, url: '', alt: null}
  }

  function link() {
    return {type: 'link', title: null, url: '', children: []}
  }

  function list(token) {
    return {
      type: 'list',
      ordered: token.type === 'listOrdered',
      start: null,
      spread: token._spread,
      children: []
    }
  }

  function listItem(token) {
    return {
      type: 'listItem',
      spread: token._spread,
      checked: null,
      children: []
    }
  }

  function paragraph() {
    return {type: 'paragraph', children: []}
  }

  function strong() {
    return {type: 'strong', children: []}
  }

  function text() {
    return {type: 'text', value: ''}
  }

  function thematicBreak() {
    return {type: 'thematicBreak'}
  }
}

function configure(config, extensions) {
  var index = -1

  while (++index < extensions.length) {
    extension(config, extensions[index])
  }

  return config
}

function extension(config, extension) {
  var key
  var left

  for (key in extension) {
    left = own.call(config, key) ? config[key] : (config[key] = {})

    if (key === 'canContainEols' || key === 'transforms') {
      config[key] = [].concat(left, extension[key])
    } else {
      Object.assign(left, extension[key])
    }
  }
}


/***/ }),

/***/ 3885:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


module.exports = __webpack_require__(7275)


/***/ }),

/***/ 8667:
/***/ ((module) => {

"use strict";


module.exports = toString

// Get the text content of a node.
// Prefer the node’s plain-text fields, otherwise serialize its children,
// and if the given value is an array, serialize the nodes in it.
function toString(node) {
  return (
    (node &&
      (node.value ||
        node.alt ||
        node.title ||
        ('children' in node && all(node.children)) ||
        ('length' in node && all(node)))) ||
    ''
  )
}

function all(values) {
  var result = []
  var index = -1

  while (++index < values.length) {
    result[index] = toString(values[index])
  }

  return result.join('')
}


/***/ }),

/***/ 9376:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

/* unused reexport */ __webpack_require__(8780)


/***/ }),

/***/ 8941:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


module.exports = all

var one = __webpack_require__(8205)

function all(h, parent) {
  var nodes = parent.children || []
  var length = nodes.length
  var values = []
  var index = -1
  var result
  var head

  while (++index < length) {
    result = one(h, nodes[index], parent)

    if (result) {
      if (index && nodes[index - 1].type === 'break') {
        if (result.value) {
          result.value = result.value.replace(/^\s+/, '')
        }

        head = result.children && result.children[0]

        if (head && head.value) {
          head.value = head.value.replace(/^\s+/, '')
        }
      }

      values = values.concat(result)
    }
  }

  return values
}


/***/ }),

/***/ 783:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


module.exports = generateFootnotes

var thematicBreak = __webpack_require__(3699)
var list = __webpack_require__(6054)
var wrap = __webpack_require__(5295)

function generateFootnotes(h) {
  var footnoteById = h.footnoteById
  var footnoteOrder = h.footnoteOrder
  var length = footnoteOrder.length
  var index = -1
  var listItems = []
  var def
  var backReference
  var content
  var tail

  while (++index < length) {
    def = footnoteById[footnoteOrder[index].toUpperCase()]

    if (!def) {
      continue
    }

    content = def.children.concat()
    tail = content[content.length - 1]
    backReference = {
      type: 'link',
      url: '#fnref-' + def.identifier,
      data: {hProperties: {className: ['footnote-backref']}},
      children: [{type: 'text', value: '↩'}]
    }

    if (!tail || tail.type !== 'paragraph') {
      tail = {type: 'paragraph', children: []}
      content.push(tail)
    }

    tail.children.push(backReference)

    listItems.push({
      type: 'listItem',
      data: {hProperties: {id: 'fn-' + def.identifier}},
      children: content,
      position: def.position
    })
  }

  if (listItems.length === 0) {
    return null
  }

  return h(
    null,
    'div',
    {className: ['footnotes']},
    wrap(
      [
        thematicBreak(h),
        list(h, {type: 'list', ordered: true, children: listItems})
      ],
      true
    )
  )
}


/***/ }),

/***/ 4182:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


module.exports = blockquote

var wrap = __webpack_require__(5295)
var all = __webpack_require__(8941)

function blockquote(h, node) {
  return h(node, 'blockquote', wrap(all(h, node), true))
}


/***/ }),

/***/ 2016:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


module.exports = hardBreak

var u = __webpack_require__(2872)

function hardBreak(h, node) {
  return [h(node, 'br'), u('text', '\n')]
}


/***/ }),

/***/ 7021:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


module.exports = code

var u = __webpack_require__(2872)

function code(h, node) {
  var value = node.value ? node.value + '\n' : ''
  // To do: next major, use `node.lang` w/o regex, the splitting’s been going
  // on for years in remark now.
  var lang = node.lang && node.lang.match(/^[^ \t]+(?=[ \t]|$)/)
  var props = {}
  var code

  if (lang) {
    props.className = ['language-' + lang]
  }

  code = h(node, 'code', props, [u('text', value)])

  if (node.meta) {
    code.data = {meta: node.meta}
  }

  return h(node.position, 'pre', [code])
}


/***/ }),

/***/ 4941:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


module.exports = strikethrough

var all = __webpack_require__(8941)

function strikethrough(h, node) {
  return h(node, 'del', all(h, node))
}


/***/ }),

/***/ 5363:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


module.exports = emphasis

var all = __webpack_require__(8941)

function emphasis(h, node) {
  return h(node, 'em', all(h, node))
}


/***/ }),

/***/ 7123:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


module.exports = footnoteReference

var u = __webpack_require__(2872)

function footnoteReference(h, node) {
  var footnoteOrder = h.footnoteOrder
  var identifier = String(node.identifier)

  if (footnoteOrder.indexOf(identifier) === -1) {
    footnoteOrder.push(identifier)
  }

  return h(node.position, 'sup', {id: 'fnref-' + identifier}, [
    h(node, 'a', {href: '#fn-' + identifier, className: ['footnote-ref']}, [
      u('text', node.label || identifier)
    ])
  ])
}


/***/ }),

/***/ 8945:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


module.exports = footnote

var footnoteReference = __webpack_require__(7123)

function footnote(h, node) {
  var footnoteById = h.footnoteById
  var footnoteOrder = h.footnoteOrder
  var identifier = 1

  while (identifier in footnoteById) {
    identifier++
  }

  identifier = String(identifier)

  // No need to check if `identifier` exists in `footnoteOrder`, it’s guaranteed
  // to not exist because we just generated it.
  footnoteOrder.push(identifier)

  footnoteById[identifier] = {
    type: 'footnoteDefinition',
    identifier: identifier,
    children: [{type: 'paragraph', children: node.children}],
    position: node.position
  }

  return footnoteReference(h, {
    type: 'footnoteReference',
    identifier: identifier,
    position: node.position
  })
}


/***/ }),

/***/ 2593:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


module.exports = heading

var all = __webpack_require__(8941)

function heading(h, node) {
  return h(node, 'h' + node.depth, all(h, node))
}


/***/ }),

/***/ 4770:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


module.exports = html

var u = __webpack_require__(2872)

// Return either a `raw` node in dangerous mode, otherwise nothing.
function html(h, node) {
  return h.dangerous ? h.augment(node, u('raw', node.value)) : null
}


/***/ }),

/***/ 1480:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


module.exports = imageReference

var normalize = __webpack_require__(4651)
var revert = __webpack_require__(1704)

function imageReference(h, node) {
  var def = h.definition(node.identifier)
  var props

  if (!def) {
    return revert(h, node)
  }

  props = {src: normalize(def.url || ''), alt: node.alt}

  if (def.title !== null && def.title !== undefined) {
    props.title = def.title
  }

  return h(node, 'img', props)
}


/***/ }),

/***/ 1387:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var normalize = __webpack_require__(4651)

module.exports = image

function image(h, node) {
  var props = {src: normalize(node.url), alt: node.alt}

  if (node.title !== null && node.title !== undefined) {
    props.title = node.title
  }

  return h(node, 'img', props)
}


/***/ }),

/***/ 8995:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


module.exports = {
  blockquote: __webpack_require__(4182),
  break: __webpack_require__(2016),
  code: __webpack_require__(7021),
  delete: __webpack_require__(4941),
  emphasis: __webpack_require__(5363),
  footnoteReference: __webpack_require__(7123),
  footnote: __webpack_require__(8945),
  heading: __webpack_require__(2593),
  html: __webpack_require__(4770),
  imageReference: __webpack_require__(1480),
  image: __webpack_require__(1387),
  inlineCode: __webpack_require__(8611),
  linkReference: __webpack_require__(9285),
  link: __webpack_require__(8037),
  listItem: __webpack_require__(848),
  list: __webpack_require__(6054),
  paragraph: __webpack_require__(1741),
  root: __webpack_require__(3863),
  strong: __webpack_require__(8149),
  table: __webpack_require__(4627),
  text: __webpack_require__(6864),
  thematicBreak: __webpack_require__(3699),
  toml: ignore,
  yaml: ignore,
  definition: ignore,
  footnoteDefinition: ignore
}

// Return nothing for nodes that are ignored.
function ignore() {
  return null
}


/***/ }),

/***/ 8611:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


module.exports = inlineCode

var u = __webpack_require__(2872)

function inlineCode(h, node) {
  var value = node.value.replace(/\r?\n|\r/g, ' ')
  return h(node, 'code', [u('text', value)])
}


/***/ }),

/***/ 9285:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


module.exports = linkReference

var normalize = __webpack_require__(4651)
var revert = __webpack_require__(1704)
var all = __webpack_require__(8941)

function linkReference(h, node) {
  var def = h.definition(node.identifier)
  var props

  if (!def) {
    return revert(h, node)
  }

  props = {href: normalize(def.url || '')}

  if (def.title !== null && def.title !== undefined) {
    props.title = def.title
  }

  return h(node, 'a', props, all(h, node))
}


/***/ }),

/***/ 8037:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var normalize = __webpack_require__(4651)
var all = __webpack_require__(8941)

module.exports = link

function link(h, node) {
  var props = {href: normalize(node.url)}

  if (node.title !== null && node.title !== undefined) {
    props.title = node.title
  }

  return h(node, 'a', props, all(h, node))
}


/***/ }),

/***/ 848:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


module.exports = listItem

var u = __webpack_require__(2872)
var all = __webpack_require__(8941)

function listItem(h, node, parent) {
  var result = all(h, node)
  var head = result[0]
  var loose = parent ? listLoose(parent) : listItemLoose(node)
  var props = {}
  var wrapped = []
  var length
  var index
  var child

  if (typeof node.checked === 'boolean') {
    if (!head || head.tagName !== 'p') {
      head = h(null, 'p', [])
      result.unshift(head)
    }

    if (head.children.length > 0) {
      head.children.unshift(u('text', ' '))
    }

    head.children.unshift(
      h(null, 'input', {
        type: 'checkbox',
        checked: node.checked,
        disabled: true
      })
    )

    // According to github-markdown-css, this class hides bullet.
    // See: <https://github.com/sindresorhus/github-markdown-css>.
    props.className = ['task-list-item']
  }

  length = result.length
  index = -1

  while (++index < length) {
    child = result[index]

    // Add eols before nodes, except if this is a loose, first paragraph.
    if (loose || index !== 0 || child.tagName !== 'p') {
      wrapped.push(u('text', '\n'))
    }

    if (child.tagName === 'p' && !loose) {
      wrapped = wrapped.concat(child.children)
    } else {
      wrapped.push(child)
    }
  }

  // Add a final eol.
  if (length && (loose || child.tagName !== 'p')) {
    wrapped.push(u('text', '\n'))
  }

  return h(node, 'li', props, wrapped)
}

function listLoose(node) {
  var loose = node.spread
  var children = node.children
  var length = children.length
  var index = -1

  while (!loose && ++index < length) {
    loose = listItemLoose(children[index])
  }

  return loose
}

function listItemLoose(node) {
  var spread = node.spread

  return spread === undefined || spread === null
    ? node.children.length > 1
    : spread
}


/***/ }),

/***/ 6054:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


module.exports = list

var wrap = __webpack_require__(5295)
var all = __webpack_require__(8941)

function list(h, node) {
  var props = {}
  var name = node.ordered ? 'ol' : 'ul'
  var items
  var index = -1
  var length

  if (typeof node.start === 'number' && node.start !== 1) {
    props.start = node.start
  }

  items = all(h, node)
  length = items.length

  // Like GitHub, add a class for custom styling.
  while (++index < length) {
    if (
      items[index].properties.className &&
      items[index].properties.className.indexOf('task-list-item') !== -1
    ) {
      props.className = ['contains-task-list']
      break
    }
  }

  return h(node, name, props, wrap(items, true))
}


/***/ }),

/***/ 1741:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


module.exports = paragraph

var all = __webpack_require__(8941)

function paragraph(h, node) {
  return h(node, 'p', all(h, node))
}


/***/ }),

/***/ 3863:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


module.exports = root

var u = __webpack_require__(2872)
var wrap = __webpack_require__(5295)
var all = __webpack_require__(8941)

function root(h, node) {
  return h.augment(node, u('root', wrap(all(h, node))))
}


/***/ }),

/***/ 8149:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


module.exports = strong

var all = __webpack_require__(8941)

function strong(h, node) {
  return h(node, 'strong', all(h, node))
}


/***/ }),

/***/ 4627:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


module.exports = table

var position = __webpack_require__(9725)
var wrap = __webpack_require__(5295)
var all = __webpack_require__(8941)

function table(h, node) {
  var rows = node.children
  var index = rows.length
  var align = node.align || []
  var alignLength = align.length
  var result = []
  var pos
  var row
  var out
  var name
  var cell

  while (index--) {
    row = rows[index].children
    name = index === 0 ? 'th' : 'td'
    pos = alignLength || row.length
    out = []

    while (pos--) {
      cell = row[pos]
      out[pos] = h(cell, name, {align: align[pos]}, cell ? all(h, cell) : [])
    }

    result[index] = h(rows[index], 'tr', wrap(out, true))
  }

  return h(
    node,
    'table',
    wrap(
      [h(result[0].position, 'thead', wrap([result[0]], true))].concat(
        result[1]
          ? h(
              {
                start: position.start(result[1]),
                end: position.end(result[result.length - 1])
              },
              'tbody',
              wrap(result.slice(1), true)
            )
          : []
      ),
      true
    )
  )
}


/***/ }),

/***/ 6864:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


module.exports = text

var u = __webpack_require__(2872)

function text(h, node) {
  return h.augment(
    node,
    u('text', String(node.value).replace(/[ \t]*(\r?\n|\r)[ \t]*/g, '$1'))
  )
}


/***/ }),

/***/ 3699:
/***/ ((module) => {

"use strict";


module.exports = thematicBreak

function thematicBreak(h, node) {
  return h(node, 'hr')
}


/***/ }),

/***/ 8780:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


module.exports = toHast

var u = __webpack_require__(2872)
var visit = __webpack_require__(2148)
var position = __webpack_require__(9725)
var generated = __webpack_require__(8666)
var definitions = __webpack_require__(469)
var one = __webpack_require__(8205)
var footer = __webpack_require__(783)
var handlers = __webpack_require__(8995)

var own = {}.hasOwnProperty

var deprecationWarningIssued = false

// Factory to transform.
function factory(tree, options) {
  var settings = options || {}

  // Issue a warning if the deprecated tag 'allowDangerousHTML' is used
  if (settings.allowDangerousHTML !== undefined && !deprecationWarningIssued) {
    deprecationWarningIssued = true
    console.warn(
      'mdast-util-to-hast: deprecation: `allowDangerousHTML` is nonstandard, use `allowDangerousHtml` instead'
    )
  }

  var dangerous = settings.allowDangerousHtml || settings.allowDangerousHTML
  var footnoteById = {}

  h.dangerous = dangerous
  h.definition = definitions(tree)
  h.footnoteById = footnoteById
  h.footnoteOrder = []
  h.augment = augment
  h.handlers = Object.assign({}, handlers, settings.handlers)
  h.unknownHandler = settings.unknownHandler
  h.passThrough = settings.passThrough

  visit(tree, 'footnoteDefinition', onfootnotedefinition)

  return h

  // Finalise the created `right`, a hast node, from `left`, an mdast node.
  function augment(left, right) {
    var data
    var ctx

    // Handle `data.hName`, `data.hProperties, `data.hChildren`.
    if (left && left.data) {
      data = left.data

      if (data.hName) {
        if (right.type !== 'element') {
          right = {
            type: 'element',
            tagName: '',
            properties: {},
            children: []
          }
        }

        right.tagName = data.hName
      }

      if (right.type === 'element' && data.hProperties) {
        right.properties = Object.assign({}, right.properties, data.hProperties)
      }

      if (right.children && data.hChildren) {
        right.children = data.hChildren
      }
    }

    ctx = left && left.position ? left : {position: left}

    if (!generated(ctx)) {
      right.position = {
        start: position.start(ctx),
        end: position.end(ctx)
      }
    }

    return right
  }

  // Create an element for `node`.
  function h(node, tagName, props, children) {
    if (
      (children === undefined || children === null) &&
      typeof props === 'object' &&
      'length' in props
    ) {
      children = props
      props = {}
    }

    return augment(node, {
      type: 'element',
      tagName: tagName,
      properties: props || {},
      children: children || []
    })
  }

  function onfootnotedefinition(definition) {
    var id = String(definition.identifier).toUpperCase()

    // Mimick CM behavior of link definitions.
    // See: <https://github.com/syntax-tree/mdast-util-definitions/blob/8290999/index.js#L26>.
    if (!own.call(footnoteById, id)) {
      footnoteById[id] = definition
    }
  }
}

// Transform `tree`, which is an mdast node, to a hast node.
function toHast(tree, options) {
  var h = factory(tree, options)
  var node = one(h, tree)
  var foot = footer(h)

  if (foot) {
    node.children = node.children.concat(u('text', '\n'), foot)
  }

  return node
}


/***/ }),

/***/ 8205:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


module.exports = one

var u = __webpack_require__(2872)
var all = __webpack_require__(8941)

var own = {}.hasOwnProperty

// Transform an unknown node.
function unknown(h, node) {
  if (text(node)) {
    return h.augment(node, u('text', node.value))
  }

  return h(node, 'div', all(h, node))
}

// Visit a node.
function one(h, node, parent) {
  var type = node && node.type
  var fn

  // Fail on non-nodes.
  if (!type) {
    throw new Error('Expected node, got `' + node + '`')
  }

  if (own.call(h.handlers, type)) {
    fn = h.handlers[type]
  } else if (h.passThrough && h.passThrough.indexOf(type) > -1) {
    fn = returnNode
  } else {
    fn = h.unknownHandler
  }

  return (typeof fn === 'function' ? fn : unknown)(h, node, parent)
}

// Check if the node should be renderered as a text node.
function text(node) {
  var data = node.data || {}

  if (
    own.call(data, 'hName') ||
    own.call(data, 'hProperties') ||
    own.call(data, 'hChildren')
  ) {
    return false
  }

  return 'value' in node
}

function returnNode(h, node) {
  var clone

  if (node.children) {
    clone = Object.assign({}, node)
    clone.children = all(h, node)
    return clone
  }

  return node
}


/***/ }),

/***/ 1704:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


module.exports = revert

var u = __webpack_require__(2872)
var all = __webpack_require__(8941)

// Return the content of a reference without definition as Markdown.
function revert(h, node) {
  var subtype = node.referenceType
  var suffix = ']'
  var contents
  var head
  var tail

  if (subtype === 'collapsed') {
    suffix += '[]'
  } else if (subtype === 'full') {
    suffix += '[' + (node.label || node.identifier) + ']'
  }

  if (node.type === 'imageReference') {
    return u('text', '![' + node.alt + suffix)
  }

  contents = all(h, node)
  head = contents[0]

  if (head && head.type === 'text') {
    head.value = '[' + head.value
  } else {
    contents.unshift(u('text', '['))
  }

  tail = contents[contents.length - 1]

  if (tail && tail.type === 'text') {
    tail.value += suffix
  } else {
    contents.push(u('text', suffix))
  }

  return contents
}


/***/ }),

/***/ 5295:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


module.exports = wrap

var u = __webpack_require__(2872)

// Wrap `nodes` with line feeds between each entry.
// Optionally adds line feeds at the start and end.
function wrap(nodes, loose) {
  var result = []
  var index = -1
  var length = nodes.length

  if (loose) {
    result.push(u('text', '\n'))
  }

  while (++index < length) {
    if (index) {
      result.push(u('text', '\n'))
    }

    result.push(nodes[index])
  }

  if (loose && nodes.length > 0) {
    result.push(u('text', '\n'))
  }

  return result
}


/***/ }),

/***/ 4651:
/***/ ((module) => {

"use strict";




var encodeCache = {};


// Create a lookup array where anything but characters in `chars` string
// and alphanumeric chars is percent-encoded.
//
function getEncodeCache(exclude) {
  var i, ch, cache = encodeCache[exclude];
  if (cache) { return cache; }

  cache = encodeCache[exclude] = [];

  for (i = 0; i < 128; i++) {
    ch = String.fromCharCode(i);

    if (/^[0-9a-z]$/i.test(ch)) {
      // always allow unencoded alphanumeric characters
      cache.push(ch);
    } else {
      cache.push('%' + ('0' + i.toString(16).toUpperCase()).slice(-2));
    }
  }

  for (i = 0; i < exclude.length; i++) {
    cache[exclude.charCodeAt(i)] = exclude[i];
  }

  return cache;
}


// Encode unsafe characters with percent-encoding, skipping already
// encoded sequences.
//
//  - string       - string to encode
//  - exclude      - list of characters to ignore (in addition to a-zA-Z0-9)
//  - keepEscaped  - don't encode '%' in a correct escape sequence (default: true)
//
function encode(string, exclude, keepEscaped) {
  var i, l, code, nextCode, cache,
      result = '';

  if (typeof exclude !== 'string') {
    // encode(string, keepEscaped)
    keepEscaped  = exclude;
    exclude = encode.defaultChars;
  }

  if (typeof keepEscaped === 'undefined') {
    keepEscaped = true;
  }

  cache = getEncodeCache(exclude);

  for (i = 0, l = string.length; i < l; i++) {
    code = string.charCodeAt(i);

    if (keepEscaped && code === 0x25 /* % */ && i + 2 < l) {
      if (/^[0-9a-f]{2}$/i.test(string.slice(i + 1, i + 3))) {
        result += string.slice(i, i + 3);
        i += 2;
        continue;
      }
    }

    if (code < 128) {
      result += cache[code];
      continue;
    }

    if (code >= 0xD800 && code <= 0xDFFF) {
      if (code >= 0xD800 && code <= 0xDBFF && i + 1 < l) {
        nextCode = string.charCodeAt(i + 1);
        if (nextCode >= 0xDC00 && nextCode <= 0xDFFF) {
          result += encodeURIComponent(string[i] + string[i + 1]);
          i++;
          continue;
        }
      }
      result += '%EF%BF%BD';
      continue;
    }

    result += encodeURIComponent(string[i]);
  }

  return result;
}

encode.defaultChars   = ";/?:@&=+$,-_.!~*'()#";
encode.componentChars = "-_.!~*'()";


module.exports = encode;


/***/ }),

/***/ 5111:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var regexCheck = __webpack_require__(5540)

var asciiAlpha = regexCheck(/[A-Za-z]/)

module.exports = asciiAlpha


/***/ }),

/***/ 6102:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var regexCheck = __webpack_require__(5540)

var asciiAlphanumeric = regexCheck(/[\dA-Za-z]/)

module.exports = asciiAlphanumeric


/***/ }),

/***/ 5860:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var regexCheck = __webpack_require__(5540)

var asciiAtext = regexCheck(/[#-'*+\--9=?A-Z^-~]/)

module.exports = asciiAtext


/***/ }),

/***/ 841:
/***/ ((module) => {

"use strict";


// Note: EOF is seen as ASCII control here, because `null < 32 == true`.
function asciiControl(code) {
  return (
    // Special whitespace codes (which have negative values), C0 and Control
    // character DEL
    code < 32 || code === 127
  )
}

module.exports = asciiControl


/***/ }),

/***/ 9602:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var regexCheck = __webpack_require__(5540)

var asciiDigit = regexCheck(/\d/)

module.exports = asciiDigit


/***/ }),

/***/ 3688:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var regexCheck = __webpack_require__(5540)

var asciiHexDigit = regexCheck(/[\dA-Fa-f]/)

module.exports = asciiHexDigit


/***/ }),

/***/ 6577:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var regexCheck = __webpack_require__(5540)

var asciiPunctuation = regexCheck(/[!-/:-@[-`{-~]/)

module.exports = asciiPunctuation


/***/ }),

/***/ 6430:
/***/ ((module) => {

"use strict";


function markdownLineEndingOrSpace(code) {
  return code < 0 || code === 32
}

module.exports = markdownLineEndingOrSpace


/***/ }),

/***/ 2739:
/***/ ((module) => {

"use strict";


function markdownLineEnding(code) {
  return code < -2
}

module.exports = markdownLineEnding


/***/ }),

/***/ 9225:
/***/ ((module) => {

"use strict";


function markdownSpace(code) {
  return code === -2 || code === -1 || code === 32
}

module.exports = markdownSpace


/***/ }),

/***/ 6516:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var unicodePunctuationRegex = __webpack_require__(3055)
var regexCheck = __webpack_require__(5540)

// In fact adds to the bundle size.

var unicodePunctuation = regexCheck(unicodePunctuationRegex)

module.exports = unicodePunctuation


/***/ }),

/***/ 463:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var regexCheck = __webpack_require__(5540)

var unicodeWhitespace = regexCheck(/\s/)

module.exports = unicodeWhitespace


/***/ }),

/***/ 1328:
/***/ ((module) => {

"use strict";


var assign = Object.assign

module.exports = assign


/***/ }),

/***/ 4428:
/***/ ((module) => {

"use strict";


var fromCharCode = String.fromCharCode

module.exports = fromCharCode


/***/ }),

/***/ 277:
/***/ ((module) => {

"use strict";


var own = {}.hasOwnProperty

module.exports = own


/***/ }),

/***/ 958:
/***/ ((module) => {

"use strict";


// This module is copied from <https://spec.commonmark.org/0.29/#html-blocks>.
var basics = [
  'address',
  'article',
  'aside',
  'base',
  'basefont',
  'blockquote',
  'body',
  'caption',
  'center',
  'col',
  'colgroup',
  'dd',
  'details',
  'dialog',
  'dir',
  'div',
  'dl',
  'dt',
  'fieldset',
  'figcaption',
  'figure',
  'footer',
  'form',
  'frame',
  'frameset',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'head',
  'header',
  'hr',
  'html',
  'iframe',
  'legend',
  'li',
  'link',
  'main',
  'menu',
  'menuitem',
  'nav',
  'noframes',
  'ol',
  'optgroup',
  'option',
  'p',
  'param',
  'section',
  'source',
  'summary',
  'table',
  'tbody',
  'td',
  'tfoot',
  'th',
  'thead',
  'title',
  'tr',
  'track',
  'ul'
]

module.exports = basics


/***/ }),

/***/ 5121:
/***/ ((module) => {

"use strict";


// This module is copied from <https://spec.commonmark.org/0.29/#html-blocks>.
var raws = ['pre', 'script', 'style', 'textarea']

module.exports = raws


/***/ }),

/***/ 7716:
/***/ ((module) => {

"use strict";


var splice = [].splice

module.exports = splice


/***/ }),

/***/ 3055:
/***/ ((module) => {

"use strict";


// This module is generated by `script/`.
//
// CommonMark handles attention (emphasis, strong) markers based on what comes
// before or after them.
// One such difference is if those characters are Unicode punctuation.
// This script is generated from the Unicode data.
var unicodePunctuation = /[!-\/:-@\[-`\{-~\xA1\xA7\xAB\xB6\xB7\xBB\xBF\u037E\u0387\u055A-\u055F\u0589\u058A\u05BE\u05C0\u05C3\u05C6\u05F3\u05F4\u0609\u060A\u060C\u060D\u061B\u061E\u061F\u066A-\u066D\u06D4\u0700-\u070D\u07F7-\u07F9\u0830-\u083E\u085E\u0964\u0965\u0970\u09FD\u0A76\u0AF0\u0C77\u0C84\u0DF4\u0E4F\u0E5A\u0E5B\u0F04-\u0F12\u0F14\u0F3A-\u0F3D\u0F85\u0FD0-\u0FD4\u0FD9\u0FDA\u104A-\u104F\u10FB\u1360-\u1368\u1400\u166E\u169B\u169C\u16EB-\u16ED\u1735\u1736\u17D4-\u17D6\u17D8-\u17DA\u1800-\u180A\u1944\u1945\u1A1E\u1A1F\u1AA0-\u1AA6\u1AA8-\u1AAD\u1B5A-\u1B60\u1BFC-\u1BFF\u1C3B-\u1C3F\u1C7E\u1C7F\u1CC0-\u1CC7\u1CD3\u2010-\u2027\u2030-\u2043\u2045-\u2051\u2053-\u205E\u207D\u207E\u208D\u208E\u2308-\u230B\u2329\u232A\u2768-\u2775\u27C5\u27C6\u27E6-\u27EF\u2983-\u2998\u29D8-\u29DB\u29FC\u29FD\u2CF9-\u2CFC\u2CFE\u2CFF\u2D70\u2E00-\u2E2E\u2E30-\u2E4F\u2E52\u3001-\u3003\u3008-\u3011\u3014-\u301F\u3030\u303D\u30A0\u30FB\uA4FE\uA4FF\uA60D-\uA60F\uA673\uA67E\uA6F2-\uA6F7\uA874-\uA877\uA8CE\uA8CF\uA8F8-\uA8FA\uA8FC\uA92E\uA92F\uA95F\uA9C1-\uA9CD\uA9DE\uA9DF\uAA5C-\uAA5F\uAADE\uAADF\uAAF0\uAAF1\uABEB\uFD3E\uFD3F\uFE10-\uFE19\uFE30-\uFE52\uFE54-\uFE61\uFE63\uFE68\uFE6A\uFE6B\uFF01-\uFF03\uFF05-\uFF0A\uFF0C-\uFF0F\uFF1A\uFF1B\uFF1F\uFF20\uFF3B-\uFF3D\uFF3F\uFF5B\uFF5D\uFF5F-\uFF65]/

module.exports = unicodePunctuation


/***/ }),

/***/ 8847:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({value: true}))

var text$1 = __webpack_require__(663)
var attention = __webpack_require__(9573)
var autolink = __webpack_require__(3613)
var blockQuote = __webpack_require__(893)
var characterEscape = __webpack_require__(6329)
var characterReference = __webpack_require__(5284)
var codeFenced = __webpack_require__(8638)
var codeIndented = __webpack_require__(3761)
var codeText = __webpack_require__(6758)
var definition = __webpack_require__(9767)
var hardBreakEscape = __webpack_require__(3690)
var headingAtx = __webpack_require__(2336)
var htmlFlow = __webpack_require__(6022)
var htmlText = __webpack_require__(6112)
var labelEnd = __webpack_require__(7680)
var labelStartImage = __webpack_require__(1038)
var labelStartLink = __webpack_require__(2484)
var lineEnding = __webpack_require__(7611)
var list = __webpack_require__(9955)
var setextUnderline = __webpack_require__(6468)
var thematicBreak = __webpack_require__(3834)

var document = {
  42: list,
  // Asterisk
  43: list,
  // Plus sign
  45: list,
  // Dash
  48: list,
  // 0
  49: list,
  // 1
  50: list,
  // 2
  51: list,
  // 3
  52: list,
  // 4
  53: list,
  // 5
  54: list,
  // 6
  55: list,
  // 7
  56: list,
  // 8
  57: list,
  // 9
  62: blockQuote // Greater than
}
var contentInitial = {
  91: definition // Left square bracket
}
var flowInitial = {
  '-2': codeIndented,
  // Horizontal tab
  '-1': codeIndented,
  // Virtual space
  32: codeIndented // Space
}
var flow = {
  35: headingAtx,
  // Number sign
  42: thematicBreak,
  // Asterisk
  45: [setextUnderline, thematicBreak],
  // Dash
  60: htmlFlow,
  // Less than
  61: setextUnderline,
  // Equals to
  95: thematicBreak,
  // Underscore
  96: codeFenced,
  // Grave accent
  126: codeFenced // Tilde
}
var string = {
  38: characterReference,
  // Ampersand
  92: characterEscape // Backslash
}
var text = {
  '-5': lineEnding,
  // Carriage return
  '-4': lineEnding,
  // Line feed
  '-3': lineEnding,
  // Carriage return + line feed
  33: labelStartImage,
  // Exclamation mark
  38: characterReference,
  // Ampersand
  42: attention,
  // Asterisk
  60: [autolink, htmlText],
  // Less than
  91: labelStartLink,
  // Left square bracket
  92: [hardBreakEscape, characterEscape],
  // Backslash
  93: labelEnd,
  // Right square bracket
  95: attention,
  // Underscore
  96: codeText // Grave accent
}
var insideSpan = {
  null: [attention, text$1.resolver]
}
var disable = {
  null: []
}

exports.contentInitial = contentInitial
exports.disable = disable
exports.document = document
exports.flow = flow
exports.flowInitial = flowInitial
exports.insideSpan = insideSpan
exports.string = string
exports.text = text


/***/ }),

/***/ 5132:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({value: true}))

var markdownLineEnding = __webpack_require__(2739)
var factorySpace = __webpack_require__(1905)

var tokenize = initializeContent

function initializeContent(effects) {
  var contentStart = effects.attempt(
    this.parser.constructs.contentInitial,
    afterContentStartConstruct,
    paragraphInitial
  )
  var previous
  return contentStart

  function afterContentStartConstruct(code) {
    if (code === null) {
      effects.consume(code)
      return
    }

    effects.enter('lineEnding')
    effects.consume(code)
    effects.exit('lineEnding')
    return factorySpace(effects, contentStart, 'linePrefix')
  }

  function paragraphInitial(code) {
    effects.enter('paragraph')
    return lineStart(code)
  }

  function lineStart(code) {
    var token = effects.enter('chunkText', {
      contentType: 'text',
      previous: previous
    })

    if (previous) {
      previous.next = token
    }

    previous = token
    return data(code)
  }

  function data(code) {
    if (code === null) {
      effects.exit('chunkText')
      effects.exit('paragraph')
      effects.consume(code)
      return
    }

    if (markdownLineEnding(code)) {
      effects.consume(code)
      effects.exit('chunkText')
      return lineStart
    } // Data.

    effects.consume(code)
    return data
  }
}

exports.tokenize = tokenize


/***/ }),

/***/ 4703:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({value: true}))

var markdownLineEnding = __webpack_require__(2739)
var factorySpace = __webpack_require__(1905)
var partialBlankLine = __webpack_require__(921)

var tokenize = initializeDocument
var containerConstruct = {
  tokenize: tokenizeContainer
}
var lazyFlowConstruct = {
  tokenize: tokenizeLazyFlow
}

function initializeDocument(effects) {
  var self = this
  var stack = []
  var continued = 0
  var inspectConstruct = {
    tokenize: tokenizeInspect,
    partial: true
  }
  var inspectResult
  var childFlow
  var childToken
  return start

  function start(code) {
    if (continued < stack.length) {
      self.containerState = stack[continued][1]
      return effects.attempt(
        stack[continued][0].continuation,
        documentContinue,
        documentContinued
      )(code)
    }

    return documentContinued(code)
  }

  function documentContinue(code) {
    continued++
    return start(code)
  }

  function documentContinued(code) {
    // If we’re in a concrete construct (such as when expecting another line of
    // HTML, or we resulted in lazy content), we can immediately start flow.
    if (inspectResult && inspectResult.flowContinue) {
      return flowStart(code)
    }

    self.interrupt =
      childFlow &&
      childFlow.currentConstruct &&
      childFlow.currentConstruct.interruptible
    self.containerState = {}
    return effects.attempt(
      containerConstruct,
      containerContinue,
      flowStart
    )(code)
  }

  function containerContinue(code) {
    stack.push([self.currentConstruct, self.containerState])
    self.containerState = undefined
    return documentContinued(code)
  }

  function flowStart(code) {
    if (code === null) {
      exitContainers(0, true)
      effects.consume(code)
      return
    }

    childFlow = childFlow || self.parser.flow(self.now())
    effects.enter('chunkFlow', {
      contentType: 'flow',
      previous: childToken,
      _tokenizer: childFlow
    })
    return flowContinue(code)
  }

  function flowContinue(code) {
    if (code === null) {
      continueFlow(effects.exit('chunkFlow'))
      return flowStart(code)
    }

    if (markdownLineEnding(code)) {
      effects.consume(code)
      continueFlow(effects.exit('chunkFlow'))
      return effects.check(inspectConstruct, documentAfterPeek)
    }

    effects.consume(code)
    return flowContinue
  }

  function documentAfterPeek(code) {
    exitContainers(
      inspectResult.continued,
      inspectResult && inspectResult.flowEnd
    )
    continued = 0
    return start(code)
  }

  function continueFlow(token) {
    if (childToken) childToken.next = token
    childToken = token
    childFlow.lazy = inspectResult && inspectResult.lazy
    childFlow.defineSkip(token.start)
    childFlow.write(self.sliceStream(token))
  }

  function exitContainers(size, end) {
    var index = stack.length // Close the flow.

    if (childFlow && end) {
      childFlow.write([null])
      childToken = childFlow = undefined
    } // Exit open containers.

    while (index-- > size) {
      self.containerState = stack[index][1]
      stack[index][0].exit.call(self, effects)
    }

    stack.length = size
  }

  function tokenizeInspect(effects, ok) {
    var subcontinued = 0
    inspectResult = {}
    return inspectStart

    function inspectStart(code) {
      if (subcontinued < stack.length) {
        self.containerState = stack[subcontinued][1]
        return effects.attempt(
          stack[subcontinued][0].continuation,
          inspectContinue,
          inspectLess
        )(code)
      } // If we’re continued but in a concrete flow, we can’t have more
      // containers.

      if (childFlow.currentConstruct && childFlow.currentConstruct.concrete) {
        inspectResult.flowContinue = true
        return inspectDone(code)
      }

      self.interrupt =
        childFlow.currentConstruct && childFlow.currentConstruct.interruptible
      self.containerState = {}
      return effects.attempt(
        containerConstruct,
        inspectFlowEnd,
        inspectDone
      )(code)
    }

    function inspectContinue(code) {
      subcontinued++
      return self.containerState._closeFlow
        ? inspectFlowEnd(code)
        : inspectStart(code)
    }

    function inspectLess(code) {
      if (childFlow.currentConstruct && childFlow.currentConstruct.lazy) {
        // Maybe another container?
        self.containerState = {}
        return effects.attempt(
          containerConstruct,
          inspectFlowEnd, // Maybe flow, or a blank line?
          effects.attempt(
            lazyFlowConstruct,
            inspectFlowEnd,
            effects.check(partialBlankLine, inspectFlowEnd, inspectLazy)
          )
        )(code)
      } // Otherwise we’re interrupting.

      return inspectFlowEnd(code)
    }

    function inspectLazy(code) {
      // Act as if all containers are continued.
      subcontinued = stack.length
      inspectResult.lazy = true
      inspectResult.flowContinue = true
      return inspectDone(code)
    } // We’re done with flow if we have more containers, or an interruption.

    function inspectFlowEnd(code) {
      inspectResult.flowEnd = true
      return inspectDone(code)
    }

    function inspectDone(code) {
      inspectResult.continued = subcontinued
      self.interrupt = self.containerState = undefined
      return ok(code)
    }
  }
}

function tokenizeContainer(effects, ok, nok) {
  return factorySpace(
    effects,
    effects.attempt(this.parser.constructs.document, ok, nok),
    'linePrefix',
    this.parser.constructs.disable.null.indexOf('codeIndented') > -1
      ? undefined
      : 4
  )
}

function tokenizeLazyFlow(effects, ok, nok) {
  return factorySpace(
    effects,
    effects.lazy(this.parser.constructs.flow, ok, nok),
    'linePrefix',
    this.parser.constructs.disable.null.indexOf('codeIndented') > -1
      ? undefined
      : 4
  )
}

exports.tokenize = tokenize


/***/ }),

/***/ 8664:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({value: true}))

var content = __webpack_require__(6464)
var factorySpace = __webpack_require__(1905)
var partialBlankLine = __webpack_require__(921)

var tokenize = initializeFlow

function initializeFlow(effects) {
  var self = this
  var initial = effects.attempt(
    // Try to parse a blank line.
    partialBlankLine,
    atBlankEnding, // Try to parse initial flow (essentially, only code).
    effects.attempt(
      this.parser.constructs.flowInitial,
      afterConstruct,
      factorySpace(
        effects,
        effects.attempt(
          this.parser.constructs.flow,
          afterConstruct,
          effects.attempt(content, afterConstruct)
        ),
        'linePrefix'
      )
    )
  )
  return initial

  function atBlankEnding(code) {
    if (code === null) {
      effects.consume(code)
      return
    }

    effects.enter('lineEndingBlank')
    effects.consume(code)
    effects.exit('lineEndingBlank')
    self.currentConstruct = undefined
    return initial
  }

  function afterConstruct(code) {
    if (code === null) {
      effects.consume(code)
      return
    }

    effects.enter('lineEnding')
    effects.consume(code)
    effects.exit('lineEnding')
    self.currentConstruct = undefined
    return initial
  }
}

exports.tokenize = tokenize


/***/ }),

/***/ 663:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({value: true}))

var assign = __webpack_require__(1328)
var shallow = __webpack_require__(286)

var text = initializeFactory('text')
var string = initializeFactory('string')
var resolver = {
  resolveAll: createResolver()
}

function initializeFactory(field) {
  return {
    tokenize: initializeText,
    resolveAll: createResolver(
      field === 'text' ? resolveAllLineSuffixes : undefined
    )
  }

  function initializeText(effects) {
    var self = this
    var constructs = this.parser.constructs[field]
    var text = effects.attempt(constructs, start, notText)
    return start

    function start(code) {
      return atBreak(code) ? text(code) : notText(code)
    }

    function notText(code) {
      if (code === null) {
        effects.consume(code)
        return
      }

      effects.enter('data')
      effects.consume(code)
      return data
    }

    function data(code) {
      if (atBreak(code)) {
        effects.exit('data')
        return text(code)
      } // Data.

      effects.consume(code)
      return data
    }

    function atBreak(code) {
      var list = constructs[code]
      var index = -1

      if (code === null) {
        return true
      }

      if (list) {
        while (++index < list.length) {
          if (
            !list[index].previous ||
            list[index].previous.call(self, self.previous)
          ) {
            return true
          }
        }
      }
    }
  }
}

function createResolver(extraResolver) {
  return resolveAllText

  function resolveAllText(events, context) {
    var index = -1
    var enter // A rather boring computation (to merge adjacent `data` events) which
    // improves mm performance by 29%.

    while (++index <= events.length) {
      if (enter === undefined) {
        if (events[index] && events[index][1].type === 'data') {
          enter = index
          index++
        }
      } else if (!events[index] || events[index][1].type !== 'data') {
        // Don’t do anything if there is one data token.
        if (index !== enter + 2) {
          events[enter][1].end = events[index - 1][1].end
          events.splice(enter + 2, index - enter - 2)
          index = enter + 2
        }

        enter = undefined
      }
    }

    return extraResolver ? extraResolver(events, context) : events
  }
} // A rather ugly set of instructions which again looks at chunks in the input
// stream.
// The reason to do this here is that it is *much* faster to parse in reverse.
// And that we can’t hook into `null` to split the line suffix before an EOF.
// To do: figure out if we can make this into a clean utility, or even in core.
// As it will be useful for GFMs literal autolink extension (and maybe even
// tables?)

function resolveAllLineSuffixes(events, context) {
  var eventIndex = -1
  var chunks
  var data
  var chunk
  var index
  var bufferIndex
  var size
  var tabs
  var token

  while (++eventIndex <= events.length) {
    if (
      (eventIndex === events.length ||
        events[eventIndex][1].type === 'lineEnding') &&
      events[eventIndex - 1][1].type === 'data'
    ) {
      data = events[eventIndex - 1][1]
      chunks = context.sliceStream(data)
      index = chunks.length
      bufferIndex = -1
      size = 0
      tabs = undefined

      while (index--) {
        chunk = chunks[index]

        if (typeof chunk === 'string') {
          bufferIndex = chunk.length

          while (chunk.charCodeAt(bufferIndex - 1) === 32) {
            size++
            bufferIndex--
          }

          if (bufferIndex) break
          bufferIndex = -1
        } // Number
        else if (chunk === -2) {
          tabs = true
          size++
        } else if (chunk === -1);
        else {
          // Replacement character, exit.
          index++
          break
        }
      }

      if (size) {
        token = {
          type:
            eventIndex === events.length || tabs || size < 2
              ? 'lineSuffix'
              : 'hardBreakTrailing',
          start: {
            line: data.end.line,
            column: data.end.column - size,
            offset: data.end.offset - size,
            _index: data.start._index + index,
            _bufferIndex: index
              ? bufferIndex
              : data.start._bufferIndex + bufferIndex
          },
          end: shallow(data.end)
        }
        data.end = shallow(token.start)

        if (data.start.offset === data.end.offset) {
          assign(data, token)
        } else {
          events.splice(
            eventIndex,
            0,
            ['enter', token, context],
            ['exit', token, context]
          )
          eventIndex += 2
        }
      }

      eventIndex++
    }
  }

  return events
}

exports.resolver = resolver
exports.string = string
exports.text = text


/***/ }),

/***/ 2849:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var content = __webpack_require__(5132)
var document = __webpack_require__(4703)
var flow = __webpack_require__(8664)
var text = __webpack_require__(663)
var combineExtensions = __webpack_require__(7450)
var createTokenizer = __webpack_require__(9708)
var miniflat = __webpack_require__(8011)
var constructs = __webpack_require__(8847)

function parse(options) {
  var settings = options || {}
  var parser = {
    defined: [],
    constructs: combineExtensions(
      [constructs].concat(miniflat(settings.extensions))
    ),
    content: create(content),
    document: create(document),
    flow: create(flow),
    string: create(text.string),
    text: create(text.text)
  }
  return parser

  function create(initializer) {
    return creator

    function creator(from) {
      return createTokenizer(parser, initializer, from)
    }
  }
}

module.exports = parse


/***/ }),

/***/ 3153:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var subtokenize = __webpack_require__(8199)

function postprocess(events) {
  while (!subtokenize(events)) {
    // Empty
  }

  return events
}

module.exports = postprocess


/***/ }),

/***/ 7500:
/***/ ((module) => {

"use strict";


var search = /[\0\t\n\r]/g

function preprocess() {
  var start = true
  var column = 1
  var buffer = ''
  var atCarriageReturn
  return preprocessor

  function preprocessor(value, encoding, end) {
    var chunks = []
    var match
    var next
    var startPosition
    var endPosition
    var code
    value = buffer + value.toString(encoding)
    startPosition = 0
    buffer = ''

    if (start) {
      if (value.charCodeAt(0) === 65279) {
        startPosition++
      }

      start = undefined
    }

    while (startPosition < value.length) {
      search.lastIndex = startPosition
      match = search.exec(value)
      endPosition = match ? match.index : value.length
      code = value.charCodeAt(endPosition)

      if (!match) {
        buffer = value.slice(startPosition)
        break
      }

      if (code === 10 && startPosition === endPosition && atCarriageReturn) {
        chunks.push(-3)
        atCarriageReturn = undefined
      } else {
        if (atCarriageReturn) {
          chunks.push(-5)
          atCarriageReturn = undefined
        }

        if (startPosition < endPosition) {
          chunks.push(value.slice(startPosition, endPosition))
          column += endPosition - startPosition
        }

        if (code === 0) {
          chunks.push(65533)
          column++
        } else if (code === 9) {
          next = Math.ceil(column / 4) * 4
          chunks.push(-2)

          while (column++ < next) chunks.push(-1)
        } else if (code === 10) {
          chunks.push(-4)
          column = 1
        } // Must be carriage return.
        else {
          atCarriageReturn = true
          column = 1
        }
      }

      startPosition = endPosition + 1
    }

    if (end) {
      if (atCarriageReturn) chunks.push(-5)
      if (buffer) chunks.push(buffer)
      chunks.push(null)
    }

    return chunks
  }
}

module.exports = preprocess


/***/ }),

/***/ 9573:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var chunkedPush = __webpack_require__(8948)
var chunkedSplice = __webpack_require__(5966)
var classifyCharacter = __webpack_require__(3)
var movePoint = __webpack_require__(930)
var resolveAll = __webpack_require__(5579)
var shallow = __webpack_require__(286)

var attention = {
  name: 'attention',
  tokenize: tokenizeAttention,
  resolveAll: resolveAllAttention
}

function resolveAllAttention(events, context) {
  var index = -1
  var open
  var group
  var text
  var openingSequence
  var closingSequence
  var use
  var nextEvents
  var offset // Walk through all events.
  //
  // Note: performance of this is fine on an mb of normal markdown, but it’s
  // a bottleneck for malicious stuff.

  while (++index < events.length) {
    // Find a token that can close.
    if (
      events[index][0] === 'enter' &&
      events[index][1].type === 'attentionSequence' &&
      events[index][1]._close
    ) {
      open = index // Now walk back to find an opener.

      while (open--) {
        // Find a token that can open the closer.
        if (
          events[open][0] === 'exit' &&
          events[open][1].type === 'attentionSequence' &&
          events[open][1]._open && // If the markers are the same:
          context.sliceSerialize(events[open][1]).charCodeAt(0) ===
            context.sliceSerialize(events[index][1]).charCodeAt(0)
        ) {
          // If the opening can close or the closing can open,
          // and the close size *is not* a multiple of three,
          // but the sum of the opening and closing size *is* multiple of three,
          // then don’t match.
          if (
            (events[open][1]._close || events[index][1]._open) &&
            (events[index][1].end.offset - events[index][1].start.offset) % 3 &&
            !(
              (events[open][1].end.offset -
                events[open][1].start.offset +
                events[index][1].end.offset -
                events[index][1].start.offset) %
              3
            )
          ) {
            continue
          } // Number of markers to use from the sequence.

          use =
            events[open][1].end.offset - events[open][1].start.offset > 1 &&
            events[index][1].end.offset - events[index][1].start.offset > 1
              ? 2
              : 1
          openingSequence = {
            type: use > 1 ? 'strongSequence' : 'emphasisSequence',
            start: movePoint(shallow(events[open][1].end), -use),
            end: shallow(events[open][1].end)
          }
          closingSequence = {
            type: use > 1 ? 'strongSequence' : 'emphasisSequence',
            start: shallow(events[index][1].start),
            end: movePoint(shallow(events[index][1].start), use)
          }
          text = {
            type: use > 1 ? 'strongText' : 'emphasisText',
            start: shallow(events[open][1].end),
            end: shallow(events[index][1].start)
          }
          group = {
            type: use > 1 ? 'strong' : 'emphasis',
            start: shallow(openingSequence.start),
            end: shallow(closingSequence.end)
          }
          events[open][1].end = shallow(openingSequence.start)
          events[index][1].start = shallow(closingSequence.end)
          nextEvents = [] // If there are more markers in the opening, add them before.

          if (events[open][1].end.offset - events[open][1].start.offset) {
            nextEvents = chunkedPush(nextEvents, [
              ['enter', events[open][1], context],
              ['exit', events[open][1], context]
            ])
          } // Opening.

          nextEvents = chunkedPush(nextEvents, [
            ['enter', group, context],
            ['enter', openingSequence, context],
            ['exit', openingSequence, context],
            ['enter', text, context]
          ]) // Between.

          nextEvents = chunkedPush(
            nextEvents,
            resolveAll(
              context.parser.constructs.insideSpan.null,
              events.slice(open + 1, index),
              context
            )
          ) // Closing.

          nextEvents = chunkedPush(nextEvents, [
            ['exit', text, context],
            ['enter', closingSequence, context],
            ['exit', closingSequence, context],
            ['exit', group, context]
          ]) // If there are more markers in the closing, add them after.

          if (events[index][1].end.offset - events[index][1].start.offset) {
            offset = 2
            nextEvents = chunkedPush(nextEvents, [
              ['enter', events[index][1], context],
              ['exit', events[index][1], context]
            ])
          } else {
            offset = 0
          }

          chunkedSplice(events, open - 1, index - open + 3, nextEvents)
          index = open + nextEvents.length - offset - 2
          break
        }
      }
    }
  } // Remove remaining sequences.

  index = -1

  while (++index < events.length) {
    if (events[index][1].type === 'attentionSequence') {
      events[index][1].type = 'data'
    }
  }

  return events
}

function tokenizeAttention(effects, ok) {
  var before = classifyCharacter(this.previous)
  var marker
  return start

  function start(code) {
    effects.enter('attentionSequence')
    marker = code
    return sequence(code)
  }

  function sequence(code) {
    var token
    var after
    var open
    var close

    if (code === marker) {
      effects.consume(code)
      return sequence
    }

    token = effects.exit('attentionSequence')
    after = classifyCharacter(code)
    open = !after || (after === 2 && before)
    close = !before || (before === 2 && after)
    token._open = marker === 42 ? open : open && (before || !close)
    token._close = marker === 42 ? close : close && (after || !open)
    return ok(code)
  }
}

module.exports = attention


/***/ }),

/***/ 3613:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var asciiAlpha = __webpack_require__(5111)
var asciiAlphanumeric = __webpack_require__(6102)
var asciiAtext = __webpack_require__(5860)
var asciiControl = __webpack_require__(841)

var autolink = {
  name: 'autolink',
  tokenize: tokenizeAutolink
}

function tokenizeAutolink(effects, ok, nok) {
  var size = 1
  return start

  function start(code) {
    effects.enter('autolink')
    effects.enter('autolinkMarker')
    effects.consume(code)
    effects.exit('autolinkMarker')
    effects.enter('autolinkProtocol')
    return open
  }

  function open(code) {
    if (asciiAlpha(code)) {
      effects.consume(code)
      return schemeOrEmailAtext
    }

    return asciiAtext(code) ? emailAtext(code) : nok(code)
  }

  function schemeOrEmailAtext(code) {
    return code === 43 || code === 45 || code === 46 || asciiAlphanumeric(code)
      ? schemeInsideOrEmailAtext(code)
      : emailAtext(code)
  }

  function schemeInsideOrEmailAtext(code) {
    if (code === 58) {
      effects.consume(code)
      return urlInside
    }

    if (
      (code === 43 || code === 45 || code === 46 || asciiAlphanumeric(code)) &&
      size++ < 32
    ) {
      effects.consume(code)
      return schemeInsideOrEmailAtext
    }

    return emailAtext(code)
  }

  function urlInside(code) {
    if (code === 62) {
      effects.exit('autolinkProtocol')
      return end(code)
    }

    if (code === 32 || code === 60 || asciiControl(code)) {
      return nok(code)
    }

    effects.consume(code)
    return urlInside
  }

  function emailAtext(code) {
    if (code === 64) {
      effects.consume(code)
      size = 0
      return emailAtSignOrDot
    }

    if (asciiAtext(code)) {
      effects.consume(code)
      return emailAtext
    }

    return nok(code)
  }

  function emailAtSignOrDot(code) {
    return asciiAlphanumeric(code) ? emailLabel(code) : nok(code)
  }

  function emailLabel(code) {
    if (code === 46) {
      effects.consume(code)
      size = 0
      return emailAtSignOrDot
    }

    if (code === 62) {
      // Exit, then change the type.
      effects.exit('autolinkProtocol').type = 'autolinkEmail'
      return end(code)
    }

    return emailValue(code)
  }

  function emailValue(code) {
    if ((code === 45 || asciiAlphanumeric(code)) && size++ < 63) {
      effects.consume(code)
      return code === 45 ? emailValue : emailLabel
    }

    return nok(code)
  }

  function end(code) {
    effects.enter('autolinkMarker')
    effects.consume(code)
    effects.exit('autolinkMarker')
    effects.exit('autolink')
    return ok
  }
}

module.exports = autolink


/***/ }),

/***/ 893:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var markdownSpace = __webpack_require__(9225)
var factorySpace = __webpack_require__(1905)

var blockQuote = {
  name: 'blockQuote',
  tokenize: tokenizeBlockQuoteStart,
  continuation: {
    tokenize: tokenizeBlockQuoteContinuation
  },
  exit: exit
}

function tokenizeBlockQuoteStart(effects, ok, nok) {
  var self = this
  return start

  function start(code) {
    if (code === 62) {
      if (!self.containerState.open) {
        effects.enter('blockQuote', {
          _container: true
        })
        self.containerState.open = true
      }

      effects.enter('blockQuotePrefix')
      effects.enter('blockQuoteMarker')
      effects.consume(code)
      effects.exit('blockQuoteMarker')
      return after
    }

    return nok(code)
  }

  function after(code) {
    if (markdownSpace(code)) {
      effects.enter('blockQuotePrefixWhitespace')
      effects.consume(code)
      effects.exit('blockQuotePrefixWhitespace')
      effects.exit('blockQuotePrefix')
      return ok
    }

    effects.exit('blockQuotePrefix')
    return ok(code)
  }
}

function tokenizeBlockQuoteContinuation(effects, ok, nok) {
  return factorySpace(
    effects,
    effects.attempt(blockQuote, ok, nok),
    'linePrefix',
    this.parser.constructs.disable.null.indexOf('codeIndented') > -1
      ? undefined
      : 4
  )
}

function exit(effects) {
  effects.exit('blockQuote')
}

module.exports = blockQuote


/***/ }),

/***/ 6329:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var asciiPunctuation = __webpack_require__(6577)

var characterEscape = {
  name: 'characterEscape',
  tokenize: tokenizeCharacterEscape
}

function tokenizeCharacterEscape(effects, ok, nok) {
  return start

  function start(code) {
    effects.enter('characterEscape')
    effects.enter('escapeMarker')
    effects.consume(code)
    effects.exit('escapeMarker')
    return open
  }

  function open(code) {
    if (asciiPunctuation(code)) {
      effects.enter('characterEscapeValue')
      effects.consume(code)
      effects.exit('characterEscapeValue')
      effects.exit('characterEscape')
      return ok
    }

    return nok(code)
  }
}

module.exports = characterEscape


/***/ }),

/***/ 5284:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var decodeEntity = __webpack_require__(9944)
var asciiAlphanumeric = __webpack_require__(6102)
var asciiDigit = __webpack_require__(9602)
var asciiHexDigit = __webpack_require__(3688)

function _interopDefaultLegacy(e) {
  return e && typeof e === 'object' && 'default' in e ? e : {default: e}
}

var decodeEntity__default = /*#__PURE__*/ _interopDefaultLegacy(decodeEntity)

var characterReference = {
  name: 'characterReference',
  tokenize: tokenizeCharacterReference
}

function tokenizeCharacterReference(effects, ok, nok) {
  var self = this
  var size = 0
  var max
  var test
  return start

  function start(code) {
    effects.enter('characterReference')
    effects.enter('characterReferenceMarker')
    effects.consume(code)
    effects.exit('characterReferenceMarker')
    return open
  }

  function open(code) {
    if (code === 35) {
      effects.enter('characterReferenceMarkerNumeric')
      effects.consume(code)
      effects.exit('characterReferenceMarkerNumeric')
      return numeric
    }

    effects.enter('characterReferenceValue')
    max = 31
    test = asciiAlphanumeric
    return value(code)
  }

  function numeric(code) {
    if (code === 88 || code === 120) {
      effects.enter('characterReferenceMarkerHexadecimal')
      effects.consume(code)
      effects.exit('characterReferenceMarkerHexadecimal')
      effects.enter('characterReferenceValue')
      max = 6
      test = asciiHexDigit
      return value
    }

    effects.enter('characterReferenceValue')
    max = 7
    test = asciiDigit
    return value(code)
  }

  function value(code) {
    var token

    if (code === 59 && size) {
      token = effects.exit('characterReferenceValue')

      if (
        test === asciiAlphanumeric &&
        !decodeEntity__default['default'](self.sliceSerialize(token))
      ) {
        return nok(code)
      }

      effects.enter('characterReferenceMarker')
      effects.consume(code)
      effects.exit('characterReferenceMarker')
      effects.exit('characterReference')
      return ok
    }

    if (test(code) && size++ < max) {
      effects.consume(code)
      return value
    }

    return nok(code)
  }
}

module.exports = characterReference


/***/ }),

/***/ 8638:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var markdownLineEnding = __webpack_require__(2739)
var markdownLineEndingOrSpace = __webpack_require__(6430)
var prefixSize = __webpack_require__(4510)
var factorySpace = __webpack_require__(1905)

var codeFenced = {
  name: 'codeFenced',
  tokenize: tokenizeCodeFenced,
  concrete: true
}

function tokenizeCodeFenced(effects, ok, nok) {
  var self = this
  var closingFenceConstruct = {
    tokenize: tokenizeClosingFence,
    partial: true
  }
  var initialPrefix = prefixSize(this.events, 'linePrefix')
  var sizeOpen = 0
  var marker
  return start

  function start(code) {
    effects.enter('codeFenced')
    effects.enter('codeFencedFence')
    effects.enter('codeFencedFenceSequence')
    marker = code
    return sequenceOpen(code)
  }

  function sequenceOpen(code) {
    if (code === marker) {
      effects.consume(code)
      sizeOpen++
      return sequenceOpen
    }

    effects.exit('codeFencedFenceSequence')
    return sizeOpen < 3
      ? nok(code)
      : factorySpace(effects, infoOpen, 'whitespace')(code)
  }

  function infoOpen(code) {
    if (code === null || markdownLineEnding(code)) {
      return openAfter(code)
    }

    effects.enter('codeFencedFenceInfo')
    effects.enter('chunkString', {
      contentType: 'string'
    })
    return info(code)
  }

  function info(code) {
    if (code === null || markdownLineEndingOrSpace(code)) {
      effects.exit('chunkString')
      effects.exit('codeFencedFenceInfo')
      return factorySpace(effects, infoAfter, 'whitespace')(code)
    }

    if (code === 96 && code === marker) return nok(code)
    effects.consume(code)
    return info
  }

  function infoAfter(code) {
    if (code === null || markdownLineEnding(code)) {
      return openAfter(code)
    }

    effects.enter('codeFencedFenceMeta')
    effects.enter('chunkString', {
      contentType: 'string'
    })
    return meta(code)
  }

  function meta(code) {
    if (code === null || markdownLineEnding(code)) {
      effects.exit('chunkString')
      effects.exit('codeFencedFenceMeta')
      return openAfter(code)
    }

    if (code === 96 && code === marker) return nok(code)
    effects.consume(code)
    return meta
  }

  function openAfter(code) {
    effects.exit('codeFencedFence')
    return self.interrupt ? ok(code) : content(code)
  }

  function content(code) {
    if (code === null) {
      return after(code)
    }

    if (markdownLineEnding(code)) {
      effects.enter('lineEnding')
      effects.consume(code)
      effects.exit('lineEnding')
      return effects.attempt(
        closingFenceConstruct,
        after,
        initialPrefix
          ? factorySpace(effects, content, 'linePrefix', initialPrefix + 1)
          : content
      )
    }

    effects.enter('codeFlowValue')
    return contentContinue(code)
  }

  function contentContinue(code) {
    if (code === null || markdownLineEnding(code)) {
      effects.exit('codeFlowValue')
      return content(code)
    }

    effects.consume(code)
    return contentContinue
  }

  function after(code) {
    effects.exit('codeFenced')
    return ok(code)
  }

  function tokenizeClosingFence(effects, ok, nok) {
    var size = 0
    return factorySpace(
      effects,
      closingSequenceStart,
      'linePrefix',
      this.parser.constructs.disable.null.indexOf('codeIndented') > -1
        ? undefined
        : 4
    )

    function closingSequenceStart(code) {
      effects.enter('codeFencedFence')
      effects.enter('codeFencedFenceSequence')
      return closingSequence(code)
    }

    function closingSequence(code) {
      if (code === marker) {
        effects.consume(code)
        size++
        return closingSequence
      }

      if (size < sizeOpen) return nok(code)
      effects.exit('codeFencedFenceSequence')
      return factorySpace(effects, closingSequenceEnd, 'whitespace')(code)
    }

    function closingSequenceEnd(code) {
      if (code === null || markdownLineEnding(code)) {
        effects.exit('codeFencedFence')
        return ok(code)
      }

      return nok(code)
    }
  }
}

module.exports = codeFenced


/***/ }),

/***/ 3761:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var markdownLineEnding = __webpack_require__(2739)
var chunkedSplice = __webpack_require__(5966)
var prefixSize = __webpack_require__(4510)
var factorySpace = __webpack_require__(1905)

var codeIndented = {
  name: 'codeIndented',
  tokenize: tokenizeCodeIndented,
  resolve: resolveCodeIndented
}
var indentedContentConstruct = {
  tokenize: tokenizeIndentedContent,
  partial: true
}

function resolveCodeIndented(events, context) {
  var code = {
    type: 'codeIndented',
    start: events[0][1].start,
    end: events[events.length - 1][1].end
  }
  chunkedSplice(events, 0, 0, [['enter', code, context]])
  chunkedSplice(events, events.length, 0, [['exit', code, context]])
  return events
}

function tokenizeCodeIndented(effects, ok, nok) {
  return effects.attempt(indentedContentConstruct, afterPrefix, nok)

  function afterPrefix(code) {
    if (code === null) {
      return ok(code)
    }

    if (markdownLineEnding(code)) {
      return effects.attempt(indentedContentConstruct, afterPrefix, ok)(code)
    }

    effects.enter('codeFlowValue')
    return content(code)
  }

  function content(code) {
    if (code === null || markdownLineEnding(code)) {
      effects.exit('codeFlowValue')
      return afterPrefix(code)
    }

    effects.consume(code)
    return content
  }
}

function tokenizeIndentedContent(effects, ok, nok) {
  var self = this
  return factorySpace(effects, afterPrefix, 'linePrefix', 4 + 1)

  function afterPrefix(code) {
    if (markdownLineEnding(code)) {
      effects.enter('lineEnding')
      effects.consume(code)
      effects.exit('lineEnding')
      return factorySpace(effects, afterPrefix, 'linePrefix', 4 + 1)
    }

    return prefixSize(self.events, 'linePrefix') < 4 ? nok(code) : ok(code)
  }
}

module.exports = codeIndented


/***/ }),

/***/ 6758:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var markdownLineEnding = __webpack_require__(2739)

var codeText = {
  name: 'codeText',
  tokenize: tokenizeCodeText,
  resolve: resolveCodeText,
  previous: previous
}

function resolveCodeText(events) {
  var tailExitIndex = events.length - 4
  var headEnterIndex = 3
  var index
  var enter // If we start and end with an EOL or a space.

  if (
    (events[headEnterIndex][1].type === 'lineEnding' ||
      events[headEnterIndex][1].type === 'space') &&
    (events[tailExitIndex][1].type === 'lineEnding' ||
      events[tailExitIndex][1].type === 'space')
  ) {
    index = headEnterIndex // And we have data.

    while (++index < tailExitIndex) {
      if (events[index][1].type === 'codeTextData') {
        // Then we have padding.
        events[tailExitIndex][1].type = events[headEnterIndex][1].type =
          'codeTextPadding'
        headEnterIndex += 2
        tailExitIndex -= 2
        break
      }
    }
  } // Merge adjacent spaces and data.

  index = headEnterIndex - 1
  tailExitIndex++

  while (++index <= tailExitIndex) {
    if (enter === undefined) {
      if (index !== tailExitIndex && events[index][1].type !== 'lineEnding') {
        enter = index
      }
    } else if (
      index === tailExitIndex ||
      events[index][1].type === 'lineEnding'
    ) {
      events[enter][1].type = 'codeTextData'

      if (index !== enter + 2) {
        events[enter][1].end = events[index - 1][1].end
        events.splice(enter + 2, index - enter - 2)
        tailExitIndex -= index - enter - 2
        index = enter + 2
      }

      enter = undefined
    }
  }

  return events
}

function previous(code) {
  // If there is a previous code, there will always be a tail.
  return (
    code !== 96 ||
    this.events[this.events.length - 1][1].type === 'characterEscape'
  )
}

function tokenizeCodeText(effects, ok, nok) {
  var sizeOpen = 0
  var size
  var token
  return start

  function start(code) {
    effects.enter('codeText')
    effects.enter('codeTextSequence')
    return openingSequence(code)
  }

  function openingSequence(code) {
    if (code === 96) {
      effects.consume(code)
      sizeOpen++
      return openingSequence
    }

    effects.exit('codeTextSequence')
    return gap(code)
  }

  function gap(code) {
    // EOF.
    if (code === null) {
      return nok(code)
    } // Closing fence?
    // Could also be data.

    if (code === 96) {
      token = effects.enter('codeTextSequence')
      size = 0
      return closingSequence(code)
    } // Tabs don’t work, and virtual spaces don’t make sense.

    if (code === 32) {
      effects.enter('space')
      effects.consume(code)
      effects.exit('space')
      return gap
    }

    if (markdownLineEnding(code)) {
      effects.enter('lineEnding')
      effects.consume(code)
      effects.exit('lineEnding')
      return gap
    } // Data.

    effects.enter('codeTextData')
    return data(code)
  } // In code.

  function data(code) {
    if (
      code === null ||
      code === 32 ||
      code === 96 ||
      markdownLineEnding(code)
    ) {
      effects.exit('codeTextData')
      return gap(code)
    }

    effects.consume(code)
    return data
  } // Closing fence.

  function closingSequence(code) {
    // More.
    if (code === 96) {
      effects.consume(code)
      size++
      return closingSequence
    } // Done!

    if (size === sizeOpen) {
      effects.exit('codeTextSequence')
      effects.exit('codeText')
      return ok(code)
    } // More or less accents: mark as data.

    token.type = 'codeTextData'
    return data(code)
  }
}

module.exports = codeText


/***/ }),

/***/ 6464:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var markdownLineEnding = __webpack_require__(2739)
var prefixSize = __webpack_require__(4510)
var subtokenize = __webpack_require__(8199)
var factorySpace = __webpack_require__(1905)

// No name because it must not be turned off.
var content = {
  tokenize: tokenizeContent,
  resolve: resolveContent,
  interruptible: true,
  lazy: true
}
var continuationConstruct = {
  tokenize: tokenizeContinuation,
  partial: true
} // Content is transparent: it’s parsed right now. That way, definitions are also
// parsed right now: before text in paragraphs (specifically, media) are parsed.

function resolveContent(events) {
  subtokenize(events)
  return events
}

function tokenizeContent(effects, ok) {
  var previous
  return start

  function start(code) {
    effects.enter('content')
    previous = effects.enter('chunkContent', {
      contentType: 'content'
    })
    return data(code)
  }

  function data(code) {
    if (code === null) {
      return contentEnd(code)
    }

    if (markdownLineEnding(code)) {
      return effects.check(
        continuationConstruct,
        contentContinue,
        contentEnd
      )(code)
    } // Data.

    effects.consume(code)
    return data
  }

  function contentEnd(code) {
    effects.exit('chunkContent')
    effects.exit('content')
    return ok(code)
  }

  function contentContinue(code) {
    effects.consume(code)
    effects.exit('chunkContent')
    previous = previous.next = effects.enter('chunkContent', {
      contentType: 'content',
      previous: previous
    })
    return data
  }
}

function tokenizeContinuation(effects, ok, nok) {
  var self = this
  return startLookahead

  function startLookahead(code) {
    effects.enter('lineEnding')
    effects.consume(code)
    effects.exit('lineEnding')
    return factorySpace(effects, prefixed, 'linePrefix')
  }

  function prefixed(code) {
    if (code === null || markdownLineEnding(code)) {
      return nok(code)
    }

    if (
      self.parser.constructs.disable.null.indexOf('codeIndented') > -1 ||
      prefixSize(self.events, 'linePrefix') < 4
    ) {
      return effects.interrupt(self.parser.constructs.flow, nok, ok)(code)
    }

    return ok(code)
  }
}

module.exports = content


/***/ }),

/***/ 9767:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var markdownLineEnding = __webpack_require__(2739)
var markdownLineEndingOrSpace = __webpack_require__(6430)
var normalizeIdentifier = __webpack_require__(7243)
var factoryDestination = __webpack_require__(4625)
var factoryLabel = __webpack_require__(7422)
var factorySpace = __webpack_require__(1905)
var factoryWhitespace = __webpack_require__(415)
var factoryTitle = __webpack_require__(2608)

var definition = {
  name: 'definition',
  tokenize: tokenizeDefinition
}
var titleConstruct = {
  tokenize: tokenizeTitle,
  partial: true
}

function tokenizeDefinition(effects, ok, nok) {
  var self = this
  var identifier
  return start

  function start(code) {
    effects.enter('definition')
    return factoryLabel.call(
      self,
      effects,
      labelAfter,
      nok,
      'definitionLabel',
      'definitionLabelMarker',
      'definitionLabelString'
    )(code)
  }

  function labelAfter(code) {
    identifier = normalizeIdentifier(
      self.sliceSerialize(self.events[self.events.length - 1][1]).slice(1, -1)
    )

    if (code === 58) {
      effects.enter('definitionMarker')
      effects.consume(code)
      effects.exit('definitionMarker') // Note: blank lines can’t exist in content.

      return factoryWhitespace(
        effects,
        factoryDestination(
          effects,
          effects.attempt(
            titleConstruct,
            factorySpace(effects, after, 'whitespace'),
            factorySpace(effects, after, 'whitespace')
          ),
          nok,
          'definitionDestination',
          'definitionDestinationLiteral',
          'definitionDestinationLiteralMarker',
          'definitionDestinationRaw',
          'definitionDestinationString'
        )
      )
    }

    return nok(code)
  }

  function after(code) {
    if (code === null || markdownLineEnding(code)) {
      effects.exit('definition')

      if (self.parser.defined.indexOf(identifier) < 0) {
        self.parser.defined.push(identifier)
      }

      return ok(code)
    }

    return nok(code)
  }
}

function tokenizeTitle(effects, ok, nok) {
  return start

  function start(code) {
    return markdownLineEndingOrSpace(code)
      ? factoryWhitespace(effects, before)(code)
      : nok(code)
  }

  function before(code) {
    if (code === 34 || code === 39 || code === 40) {
      return factoryTitle(
        effects,
        factorySpace(effects, after, 'whitespace'),
        nok,
        'definitionTitle',
        'definitionTitleMarker',
        'definitionTitleString'
      )(code)
    }

    return nok(code)
  }

  function after(code) {
    return code === null || markdownLineEnding(code) ? ok(code) : nok(code)
  }
}

module.exports = definition


/***/ }),

/***/ 4625:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var asciiControl = __webpack_require__(841)
var markdownLineEndingOrSpace = __webpack_require__(6430)
var markdownLineEnding = __webpack_require__(2739)

// eslint-disable-next-line max-params
function destinationFactory(
  effects,
  ok,
  nok,
  type,
  literalType,
  literalMarkerType,
  rawType,
  stringType,
  max
) {
  var limit = max || Infinity
  var balance = 0
  return start

  function start(code) {
    if (code === 60) {
      effects.enter(type)
      effects.enter(literalType)
      effects.enter(literalMarkerType)
      effects.consume(code)
      effects.exit(literalMarkerType)
      return destinationEnclosedBefore
    }

    if (asciiControl(code) || code === 41) {
      return nok(code)
    }

    effects.enter(type)
    effects.enter(rawType)
    effects.enter(stringType)
    effects.enter('chunkString', {
      contentType: 'string'
    })
    return destinationRaw(code)
  }

  function destinationEnclosedBefore(code) {
    if (code === 62) {
      effects.enter(literalMarkerType)
      effects.consume(code)
      effects.exit(literalMarkerType)
      effects.exit(literalType)
      effects.exit(type)
      return ok
    }

    effects.enter(stringType)
    effects.enter('chunkString', {
      contentType: 'string'
    })
    return destinationEnclosed(code)
  }

  function destinationEnclosed(code) {
    if (code === 62) {
      effects.exit('chunkString')
      effects.exit(stringType)
      return destinationEnclosedBefore(code)
    }

    if (code === null || code === 60 || markdownLineEnding(code)) {
      return nok(code)
    }

    effects.consume(code)
    return code === 92 ? destinationEnclosedEscape : destinationEnclosed
  }

  function destinationEnclosedEscape(code) {
    if (code === 60 || code === 62 || code === 92) {
      effects.consume(code)
      return destinationEnclosed
    }

    return destinationEnclosed(code)
  }

  function destinationRaw(code) {
    if (code === 40) {
      if (++balance > limit) return nok(code)
      effects.consume(code)
      return destinationRaw
    }

    if (code === 41) {
      if (!balance--) {
        effects.exit('chunkString')
        effects.exit(stringType)
        effects.exit(rawType)
        effects.exit(type)
        return ok(code)
      }

      effects.consume(code)
      return destinationRaw
    }

    if (code === null || markdownLineEndingOrSpace(code)) {
      if (balance) return nok(code)
      effects.exit('chunkString')
      effects.exit(stringType)
      effects.exit(rawType)
      effects.exit(type)
      return ok(code)
    }

    if (asciiControl(code)) return nok(code)
    effects.consume(code)
    return code === 92 ? destinationRawEscape : destinationRaw
  }

  function destinationRawEscape(code) {
    if (code === 40 || code === 41 || code === 92) {
      effects.consume(code)
      return destinationRaw
    }

    return destinationRaw(code)
  }
}

module.exports = destinationFactory


/***/ }),

/***/ 7422:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var markdownLineEnding = __webpack_require__(2739)
var markdownSpace = __webpack_require__(9225)

// eslint-disable-next-line max-params
function labelFactory(effects, ok, nok, type, markerType, stringType) {
  var self = this
  var size = 0
  var data
  return start

  function start(code) {
    effects.enter(type)
    effects.enter(markerType)
    effects.consume(code)
    effects.exit(markerType)
    effects.enter(stringType)
    return atBreak
  }

  function atBreak(code) {
    if (
      code === null ||
      code === 91 ||
      (code === 93 && !data) ||
      /* c8 ignore next */
      (code === 94 &&
        /* c8 ignore next */
        !size &&
        /* c8 ignore next */
        '_hiddenFootnoteSupport' in self.parser.constructs) ||
      size > 999
    ) {
      return nok(code)
    }

    if (code === 93) {
      effects.exit(stringType)
      effects.enter(markerType)
      effects.consume(code)
      effects.exit(markerType)
      effects.exit(type)
      return ok
    }

    if (markdownLineEnding(code)) {
      effects.enter('lineEnding')
      effects.consume(code)
      effects.exit('lineEnding')
      return atBreak
    }

    effects.enter('chunkString', {
      contentType: 'string'
    })
    return label(code)
  }

  function label(code) {
    if (
      code === null ||
      code === 91 ||
      code === 93 ||
      markdownLineEnding(code) ||
      size++ > 999
    ) {
      effects.exit('chunkString')
      return atBreak(code)
    }

    effects.consume(code)
    data = data || !markdownSpace(code)
    return code === 92 ? labelEscape : label
  }

  function labelEscape(code) {
    if (code === 91 || code === 92 || code === 93) {
      effects.consume(code)
      size++
      return label
    }

    return label(code)
  }
}

module.exports = labelFactory


/***/ }),

/***/ 1905:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var markdownSpace = __webpack_require__(9225)

function spaceFactory(effects, ok, type, max) {
  var limit = max ? max - 1 : Infinity
  var size = 0
  return start

  function start(code) {
    if (markdownSpace(code)) {
      effects.enter(type)
      return prefix(code)
    }

    return ok(code)
  }

  function prefix(code) {
    if (markdownSpace(code) && size++ < limit) {
      effects.consume(code)
      return prefix
    }

    effects.exit(type)
    return ok(code)
  }
}

module.exports = spaceFactory


/***/ }),

/***/ 2608:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var markdownLineEnding = __webpack_require__(2739)
var factorySpace = __webpack_require__(1905)

function titleFactory(effects, ok, nok, type, markerType, stringType) {
  var marker
  return start

  function start(code) {
    effects.enter(type)
    effects.enter(markerType)
    effects.consume(code)
    effects.exit(markerType)
    marker = code === 40 ? 41 : code
    return atFirstTitleBreak
  }

  function atFirstTitleBreak(code) {
    if (code === marker) {
      effects.enter(markerType)
      effects.consume(code)
      effects.exit(markerType)
      effects.exit(type)
      return ok
    }

    effects.enter(stringType)
    return atTitleBreak(code)
  }

  function atTitleBreak(code) {
    if (code === marker) {
      effects.exit(stringType)
      return atFirstTitleBreak(marker)
    }

    if (code === null) {
      return nok(code)
    } // Note: blank lines can’t exist in content.

    if (markdownLineEnding(code)) {
      effects.enter('lineEnding')
      effects.consume(code)
      effects.exit('lineEnding')
      return factorySpace(effects, atTitleBreak, 'linePrefix')
    }

    effects.enter('chunkString', {
      contentType: 'string'
    })
    return title(code)
  }

  function title(code) {
    if (code === marker || code === null || markdownLineEnding(code)) {
      effects.exit('chunkString')
      return atTitleBreak(code)
    }

    effects.consume(code)
    return code === 92 ? titleEscape : title
  }

  function titleEscape(code) {
    if (code === marker || code === 92) {
      effects.consume(code)
      return title
    }

    return title(code)
  }
}

module.exports = titleFactory


/***/ }),

/***/ 415:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var markdownLineEnding = __webpack_require__(2739)
var markdownSpace = __webpack_require__(9225)
var factorySpace = __webpack_require__(1905)

function whitespaceFactory(effects, ok) {
  var seen
  return start

  function start(code) {
    if (markdownLineEnding(code)) {
      effects.enter('lineEnding')
      effects.consume(code)
      effects.exit('lineEnding')
      seen = true
      return start
    }

    if (markdownSpace(code)) {
      return factorySpace(
        effects,
        start,
        seen ? 'linePrefix' : 'lineSuffix'
      )(code)
    }

    return ok(code)
  }
}

module.exports = whitespaceFactory


/***/ }),

/***/ 3690:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var markdownLineEnding = __webpack_require__(2739)

var hardBreakEscape = {
  name: 'hardBreakEscape',
  tokenize: tokenizeHardBreakEscape
}

function tokenizeHardBreakEscape(effects, ok, nok) {
  return start

  function start(code) {
    effects.enter('hardBreakEscape')
    effects.enter('escapeMarker')
    effects.consume(code)
    return open
  }

  function open(code) {
    if (markdownLineEnding(code)) {
      effects.exit('escapeMarker')
      effects.exit('hardBreakEscape')
      return ok(code)
    }

    return nok(code)
  }
}

module.exports = hardBreakEscape


/***/ }),

/***/ 2336:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var markdownLineEnding = __webpack_require__(2739)
var markdownLineEndingOrSpace = __webpack_require__(6430)
var markdownSpace = __webpack_require__(9225)
var chunkedSplice = __webpack_require__(5966)
var factorySpace = __webpack_require__(1905)

var headingAtx = {
  name: 'headingAtx',
  tokenize: tokenizeHeadingAtx,
  resolve: resolveHeadingAtx
}

function resolveHeadingAtx(events, context) {
  var contentEnd = events.length - 2
  var contentStart = 3
  var content
  var text // Prefix whitespace, part of the opening.

  if (events[contentStart][1].type === 'whitespace') {
    contentStart += 2
  } // Suffix whitespace, part of the closing.

  if (
    contentEnd - 2 > contentStart &&
    events[contentEnd][1].type === 'whitespace'
  ) {
    contentEnd -= 2
  }

  if (
    events[contentEnd][1].type === 'atxHeadingSequence' &&
    (contentStart === contentEnd - 1 ||
      (contentEnd - 4 > contentStart &&
        events[contentEnd - 2][1].type === 'whitespace'))
  ) {
    contentEnd -= contentStart + 1 === contentEnd ? 2 : 4
  }

  if (contentEnd > contentStart) {
    content = {
      type: 'atxHeadingText',
      start: events[contentStart][1].start,
      end: events[contentEnd][1].end
    }
    text = {
      type: 'chunkText',
      start: events[contentStart][1].start,
      end: events[contentEnd][1].end,
      contentType: 'text'
    }
    chunkedSplice(events, contentStart, contentEnd - contentStart + 1, [
      ['enter', content, context],
      ['enter', text, context],
      ['exit', text, context],
      ['exit', content, context]
    ])
  }

  return events
}

function tokenizeHeadingAtx(effects, ok, nok) {
  var self = this
  var size = 0
  return start

  function start(code) {
    effects.enter('atxHeading')
    effects.enter('atxHeadingSequence')
    return fenceOpenInside(code)
  }

  function fenceOpenInside(code) {
    if (code === 35 && size++ < 6) {
      effects.consume(code)
      return fenceOpenInside
    }

    if (code === null || markdownLineEndingOrSpace(code)) {
      effects.exit('atxHeadingSequence')
      return self.interrupt ? ok(code) : headingBreak(code)
    }

    return nok(code)
  }

  function headingBreak(code) {
    if (code === 35) {
      effects.enter('atxHeadingSequence')
      return sequence(code)
    }

    if (code === null || markdownLineEnding(code)) {
      effects.exit('atxHeading')
      return ok(code)
    }

    if (markdownSpace(code)) {
      return factorySpace(effects, headingBreak, 'whitespace')(code)
    }

    effects.enter('atxHeadingText')
    return data(code)
  }

  function sequence(code) {
    if (code === 35) {
      effects.consume(code)
      return sequence
    }

    effects.exit('atxHeadingSequence')
    return headingBreak(code)
  }

  function data(code) {
    if (code === null || code === 35 || markdownLineEndingOrSpace(code)) {
      effects.exit('atxHeadingText')
      return headingBreak(code)
    }

    effects.consume(code)
    return data
  }
}

module.exports = headingAtx


/***/ }),

/***/ 6022:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var asciiAlpha = __webpack_require__(5111)
var asciiAlphanumeric = __webpack_require__(6102)
var markdownLineEnding = __webpack_require__(2739)
var markdownLineEndingOrSpace = __webpack_require__(6430)
var markdownSpace = __webpack_require__(9225)
var fromCharCode = __webpack_require__(4428)
var htmlBlockNames = __webpack_require__(958)
var htmlRawNames = __webpack_require__(5121)
var partialBlankLine = __webpack_require__(921)

var htmlFlow = {
  name: 'htmlFlow',
  tokenize: tokenizeHtmlFlow,
  resolveTo: resolveToHtmlFlow,
  concrete: true
}
var nextBlankConstruct = {
  tokenize: tokenizeNextBlank,
  partial: true
}

function resolveToHtmlFlow(events) {
  var index = events.length

  while (index--) {
    if (events[index][0] === 'enter' && events[index][1].type === 'htmlFlow') {
      break
    }
  }

  if (index > 1 && events[index - 2][1].type === 'linePrefix') {
    // Add the prefix start to the HTML token.
    events[index][1].start = events[index - 2][1].start // Add the prefix start to the HTML line token.

    events[index + 1][1].start = events[index - 2][1].start // Remove the line prefix.

    events.splice(index - 2, 2)
  }

  return events
}

function tokenizeHtmlFlow(effects, ok, nok) {
  var self = this
  var kind
  var startTag
  var buffer
  var index
  var marker
  return start

  function start(code) {
    effects.enter('htmlFlow')
    effects.enter('htmlFlowData')
    effects.consume(code)
    return open
  }

  function open(code) {
    if (code === 33) {
      effects.consume(code)
      return declarationStart
    }

    if (code === 47) {
      effects.consume(code)
      return tagCloseStart
    }

    if (code === 63) {
      effects.consume(code)
      kind = 3 // While we’re in an instruction instead of a declaration, we’re on a `?`
      // right now, so we do need to search for `>`, similar to declarations.

      return self.interrupt ? ok : continuationDeclarationInside
    }

    if (asciiAlpha(code)) {
      effects.consume(code)
      buffer = fromCharCode(code)
      startTag = true
      return tagName
    }

    return nok(code)
  }

  function declarationStart(code) {
    if (code === 45) {
      effects.consume(code)
      kind = 2
      return commentOpenInside
    }

    if (code === 91) {
      effects.consume(code)
      kind = 5
      buffer = 'CDATA['
      index = 0
      return cdataOpenInside
    }

    if (asciiAlpha(code)) {
      effects.consume(code)
      kind = 4
      return self.interrupt ? ok : continuationDeclarationInside
    }

    return nok(code)
  }

  function commentOpenInside(code) {
    if (code === 45) {
      effects.consume(code)
      return self.interrupt ? ok : continuationDeclarationInside
    }

    return nok(code)
  }

  function cdataOpenInside(code) {
    if (code === buffer.charCodeAt(index++)) {
      effects.consume(code)
      return index === buffer.length
        ? self.interrupt
          ? ok
          : continuation
        : cdataOpenInside
    }

    return nok(code)
  }

  function tagCloseStart(code) {
    if (asciiAlpha(code)) {
      effects.consume(code)
      buffer = fromCharCode(code)
      return tagName
    }

    return nok(code)
  }

  function tagName(code) {
    if (
      code === null ||
      code === 47 ||
      code === 62 ||
      markdownLineEndingOrSpace(code)
    ) {
      if (
        code !== 47 &&
        startTag &&
        htmlRawNames.indexOf(buffer.toLowerCase()) > -1
      ) {
        kind = 1
        return self.interrupt ? ok(code) : continuation(code)
      }

      if (htmlBlockNames.indexOf(buffer.toLowerCase()) > -1) {
        kind = 6

        if (code === 47) {
          effects.consume(code)
          return basicSelfClosing
        }

        return self.interrupt ? ok(code) : continuation(code)
      }

      kind = 7 // Do not support complete HTML when interrupting.

      return self.interrupt
        ? nok(code)
        : startTag
        ? completeAttributeNameBefore(code)
        : completeClosingTagAfter(code)
    }

    if (code === 45 || asciiAlphanumeric(code)) {
      effects.consume(code)
      buffer += fromCharCode(code)
      return tagName
    }

    return nok(code)
  }

  function basicSelfClosing(code) {
    if (code === 62) {
      effects.consume(code)
      return self.interrupt ? ok : continuation
    }

    return nok(code)
  }

  function completeClosingTagAfter(code) {
    if (markdownSpace(code)) {
      effects.consume(code)
      return completeClosingTagAfter
    }

    return completeEnd(code)
  }

  function completeAttributeNameBefore(code) {
    if (code === 47) {
      effects.consume(code)
      return completeEnd
    }

    if (code === 58 || code === 95 || asciiAlpha(code)) {
      effects.consume(code)
      return completeAttributeName
    }

    if (markdownSpace(code)) {
      effects.consume(code)
      return completeAttributeNameBefore
    }

    return completeEnd(code)
  }

  function completeAttributeName(code) {
    if (
      code === 45 ||
      code === 46 ||
      code === 58 ||
      code === 95 ||
      asciiAlphanumeric(code)
    ) {
      effects.consume(code)
      return completeAttributeName
    }

    return completeAttributeNameAfter(code)
  }

  function completeAttributeNameAfter(code) {
    if (code === 61) {
      effects.consume(code)
      return completeAttributeValueBefore
    }

    if (markdownSpace(code)) {
      effects.consume(code)
      return completeAttributeNameAfter
    }

    return completeAttributeNameBefore(code)
  }

  function completeAttributeValueBefore(code) {
    if (
      code === null ||
      code === 60 ||
      code === 61 ||
      code === 62 ||
      code === 96
    ) {
      return nok(code)
    }

    if (code === 34 || code === 39) {
      effects.consume(code)
      marker = code
      return completeAttributeValueQuoted
    }

    if (markdownSpace(code)) {
      effects.consume(code)
      return completeAttributeValueBefore
    }

    marker = undefined
    return completeAttributeValueUnquoted(code)
  }

  function completeAttributeValueQuoted(code) {
    if (code === marker) {
      effects.consume(code)
      return completeAttributeValueQuotedAfter
    }

    if (code === null || markdownLineEnding(code)) {
      return nok(code)
    }

    effects.consume(code)
    return completeAttributeValueQuoted
  }

  function completeAttributeValueUnquoted(code) {
    if (
      code === null ||
      code === 34 ||
      code === 39 ||
      code === 60 ||
      code === 61 ||
      code === 62 ||
      code === 96 ||
      markdownLineEndingOrSpace(code)
    ) {
      return completeAttributeNameAfter(code)
    }

    effects.consume(code)
    return completeAttributeValueUnquoted
  }

  function completeAttributeValueQuotedAfter(code) {
    if (code === 47 || code === 62 || markdownSpace(code)) {
      return completeAttributeNameBefore(code)
    }

    return nok(code)
  }

  function completeEnd(code) {
    if (code === 62) {
      effects.consume(code)
      return completeAfter
    }

    return nok(code)
  }

  function completeAfter(code) {
    if (markdownSpace(code)) {
      effects.consume(code)
      return completeAfter
    }

    return code === null || markdownLineEnding(code)
      ? continuation(code)
      : nok(code)
  }

  function continuation(code) {
    if (code === 45 && kind === 2) {
      effects.consume(code)
      return continuationCommentInside
    }

    if (code === 60 && kind === 1) {
      effects.consume(code)
      return continuationRawTagOpen
    }

    if (code === 62 && kind === 4) {
      effects.consume(code)
      return continuationClose
    }

    if (code === 63 && kind === 3) {
      effects.consume(code)
      return continuationDeclarationInside
    }

    if (code === 93 && kind === 5) {
      effects.consume(code)
      return continuationCharacterDataInside
    }

    if (markdownLineEnding(code) && (kind === 6 || kind === 7)) {
      return effects.check(
        nextBlankConstruct,
        continuationClose,
        continuationAtLineEnding
      )(code)
    }

    if (code === null || markdownLineEnding(code)) {
      return continuationAtLineEnding(code)
    }

    effects.consume(code)
    return continuation
  }

  function continuationAtLineEnding(code) {
    effects.exit('htmlFlowData')
    return htmlContinueStart(code)
  }

  function htmlContinueStart(code) {
    if (code === null) {
      return done(code)
    }

    if (markdownLineEnding(code)) {
      effects.enter('lineEnding')
      effects.consume(code)
      effects.exit('lineEnding')
      return htmlContinueStart
    }

    effects.enter('htmlFlowData')
    return continuation(code)
  }

  function continuationCommentInside(code) {
    if (code === 45) {
      effects.consume(code)
      return continuationDeclarationInside
    }

    return continuation(code)
  }

  function continuationRawTagOpen(code) {
    if (code === 47) {
      effects.consume(code)
      buffer = ''
      return continuationRawEndTag
    }

    return continuation(code)
  }

  function continuationRawEndTag(code) {
    if (code === 62 && htmlRawNames.indexOf(buffer.toLowerCase()) > -1) {
      effects.consume(code)
      return continuationClose
    }

    if (asciiAlpha(code) && buffer.length < 8) {
      effects.consume(code)
      buffer += fromCharCode(code)
      return continuationRawEndTag
    }

    return continuation(code)
  }

  function continuationCharacterDataInside(code) {
    if (code === 93) {
      effects.consume(code)
      return continuationDeclarationInside
    }

    return continuation(code)
  }

  function continuationDeclarationInside(code) {
    if (code === 62) {
      effects.consume(code)
      return continuationClose
    }

    return continuation(code)
  }

  function continuationClose(code) {
    if (code === null || markdownLineEnding(code)) {
      effects.exit('htmlFlowData')
      return done(code)
    }

    effects.consume(code)
    return continuationClose
  }

  function done(code) {
    effects.exit('htmlFlow')
    return ok(code)
  }
}

function tokenizeNextBlank(effects, ok, nok) {
  return start

  function start(code) {
    effects.exit('htmlFlowData')
    effects.enter('lineEndingBlank')
    effects.consume(code)
    effects.exit('lineEndingBlank')
    return effects.attempt(partialBlankLine, ok, nok)
  }
}

module.exports = htmlFlow


/***/ }),

/***/ 6112:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var asciiAlpha = __webpack_require__(5111)
var asciiAlphanumeric = __webpack_require__(6102)
var markdownLineEnding = __webpack_require__(2739)
var markdownLineEndingOrSpace = __webpack_require__(6430)
var markdownSpace = __webpack_require__(9225)
var factorySpace = __webpack_require__(1905)

var htmlText = {
  name: 'htmlText',
  tokenize: tokenizeHtmlText
}

function tokenizeHtmlText(effects, ok, nok) {
  var self = this
  var marker
  var buffer
  var index
  var returnState
  return start

  function start(code) {
    effects.enter('htmlText')
    effects.enter('htmlTextData')
    effects.consume(code)
    return open
  }

  function open(code) {
    if (code === 33) {
      effects.consume(code)
      return declarationOpen
    }

    if (code === 47) {
      effects.consume(code)
      return tagCloseStart
    }

    if (code === 63) {
      effects.consume(code)
      return instruction
    }

    if (asciiAlpha(code)) {
      effects.consume(code)
      return tagOpen
    }

    return nok(code)
  }

  function declarationOpen(code) {
    if (code === 45) {
      effects.consume(code)
      return commentOpen
    }

    if (code === 91) {
      effects.consume(code)
      buffer = 'CDATA['
      index = 0
      return cdataOpen
    }

    if (asciiAlpha(code)) {
      effects.consume(code)
      return declaration
    }

    return nok(code)
  }

  function commentOpen(code) {
    if (code === 45) {
      effects.consume(code)
      return commentStart
    }

    return nok(code)
  }

  function commentStart(code) {
    if (code === null || code === 62) {
      return nok(code)
    }

    if (code === 45) {
      effects.consume(code)
      return commentStartDash
    }

    return comment(code)
  }

  function commentStartDash(code) {
    if (code === null || code === 62) {
      return nok(code)
    }

    return comment(code)
  }

  function comment(code) {
    if (code === null) {
      return nok(code)
    }

    if (code === 45) {
      effects.consume(code)
      return commentClose
    }

    if (markdownLineEnding(code)) {
      returnState = comment
      return atLineEnding(code)
    }

    effects.consume(code)
    return comment
  }

  function commentClose(code) {
    if (code === 45) {
      effects.consume(code)
      return end
    }

    return comment(code)
  }

  function cdataOpen(code) {
    if (code === buffer.charCodeAt(index++)) {
      effects.consume(code)
      return index === buffer.length ? cdata : cdataOpen
    }

    return nok(code)
  }

  function cdata(code) {
    if (code === null) {
      return nok(code)
    }

    if (code === 93) {
      effects.consume(code)
      return cdataClose
    }

    if (markdownLineEnding(code)) {
      returnState = cdata
      return atLineEnding(code)
    }

    effects.consume(code)
    return cdata
  }

  function cdataClose(code) {
    if (code === 93) {
      effects.consume(code)
      return cdataEnd
    }

    return cdata(code)
  }

  function cdataEnd(code) {
    if (code === 62) {
      return end(code)
    }

    if (code === 93) {
      effects.consume(code)
      return cdataEnd
    }

    return cdata(code)
  }

  function declaration(code) {
    if (code === null || code === 62) {
      return end(code)
    }

    if (markdownLineEnding(code)) {
      returnState = declaration
      return atLineEnding(code)
    }

    effects.consume(code)
    return declaration
  }

  function instruction(code) {
    if (code === null) {
      return nok(code)
    }

    if (code === 63) {
      effects.consume(code)
      return instructionClose
    }

    if (markdownLineEnding(code)) {
      returnState = instruction
      return atLineEnding(code)
    }

    effects.consume(code)
    return instruction
  }

  function instructionClose(code) {
    return code === 62 ? end(code) : instruction(code)
  }

  function tagCloseStart(code) {
    if (asciiAlpha(code)) {
      effects.consume(code)
      return tagClose
    }

    return nok(code)
  }

  function tagClose(code) {
    if (code === 45 || asciiAlphanumeric(code)) {
      effects.consume(code)
      return tagClose
    }

    return tagCloseBetween(code)
  }

  function tagCloseBetween(code) {
    if (markdownLineEnding(code)) {
      returnState = tagCloseBetween
      return atLineEnding(code)
    }

    if (markdownSpace(code)) {
      effects.consume(code)
      return tagCloseBetween
    }

    return end(code)
  }

  function tagOpen(code) {
    if (code === 45 || asciiAlphanumeric(code)) {
      effects.consume(code)
      return tagOpen
    }

    if (code === 47 || code === 62 || markdownLineEndingOrSpace(code)) {
      return tagOpenBetween(code)
    }

    return nok(code)
  }

  function tagOpenBetween(code) {
    if (code === 47) {
      effects.consume(code)
      return end
    }

    if (code === 58 || code === 95 || asciiAlpha(code)) {
      effects.consume(code)
      return tagOpenAttributeName
    }

    if (markdownLineEnding(code)) {
      returnState = tagOpenBetween
      return atLineEnding(code)
    }

    if (markdownSpace(code)) {
      effects.consume(code)
      return tagOpenBetween
    }

    return end(code)
  }

  function tagOpenAttributeName(code) {
    if (
      code === 45 ||
      code === 46 ||
      code === 58 ||
      code === 95 ||
      asciiAlphanumeric(code)
    ) {
      effects.consume(code)
      return tagOpenAttributeName
    }

    return tagOpenAttributeNameAfter(code)
  }

  function tagOpenAttributeNameAfter(code) {
    if (code === 61) {
      effects.consume(code)
      return tagOpenAttributeValueBefore
    }

    if (markdownLineEnding(code)) {
      returnState = tagOpenAttributeNameAfter
      return atLineEnding(code)
    }

    if (markdownSpace(code)) {
      effects.consume(code)
      return tagOpenAttributeNameAfter
    }

    return tagOpenBetween(code)
  }

  function tagOpenAttributeValueBefore(code) {
    if (
      code === null ||
      code === 60 ||
      code === 61 ||
      code === 62 ||
      code === 96
    ) {
      return nok(code)
    }

    if (code === 34 || code === 39) {
      effects.consume(code)
      marker = code
      return tagOpenAttributeValueQuoted
    }

    if (markdownLineEnding(code)) {
      returnState = tagOpenAttributeValueBefore
      return atLineEnding(code)
    }

    if (markdownSpace(code)) {
      effects.consume(code)
      return tagOpenAttributeValueBefore
    }

    effects.consume(code)
    marker = undefined
    return tagOpenAttributeValueUnquoted
  }

  function tagOpenAttributeValueQuoted(code) {
    if (code === marker) {
      effects.consume(code)
      return tagOpenAttributeValueQuotedAfter
    }

    if (code === null) {
      return nok(code)
    }

    if (markdownLineEnding(code)) {
      returnState = tagOpenAttributeValueQuoted
      return atLineEnding(code)
    }

    effects.consume(code)
    return tagOpenAttributeValueQuoted
  }

  function tagOpenAttributeValueQuotedAfter(code) {
    if (code === 62 || code === 47 || markdownLineEndingOrSpace(code)) {
      return tagOpenBetween(code)
    }

    return nok(code)
  }

  function tagOpenAttributeValueUnquoted(code) {
    if (
      code === null ||
      code === 34 ||
      code === 39 ||
      code === 60 ||
      code === 61 ||
      code === 96
    ) {
      return nok(code)
    }

    if (code === 62 || markdownLineEndingOrSpace(code)) {
      return tagOpenBetween(code)
    }

    effects.consume(code)
    return tagOpenAttributeValueUnquoted
  } // We can’t have blank lines in content, so no need to worry about empty
  // tokens.

  function atLineEnding(code) {
    effects.exit('htmlTextData')
    effects.enter('lineEnding')
    effects.consume(code)
    effects.exit('lineEnding')
    return factorySpace(
      effects,
      afterPrefix,
      'linePrefix',
      self.parser.constructs.disable.null.indexOf('codeIndented') > -1
        ? undefined
        : 4
    )
  }

  function afterPrefix(code) {
    effects.enter('htmlTextData')
    return returnState(code)
  }

  function end(code) {
    if (code === 62) {
      effects.consume(code)
      effects.exit('htmlTextData')
      effects.exit('htmlText')
      return ok
    }

    return nok(code)
  }
}

module.exports = htmlText


/***/ }),

/***/ 7680:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var markdownLineEndingOrSpace = __webpack_require__(6430)
var chunkedPush = __webpack_require__(8948)
var chunkedSplice = __webpack_require__(5966)
var normalizeIdentifier = __webpack_require__(7243)
var resolveAll = __webpack_require__(5579)
var shallow = __webpack_require__(286)
var factoryDestination = __webpack_require__(4625)
var factoryLabel = __webpack_require__(7422)
var factoryTitle = __webpack_require__(2608)
var factoryWhitespace = __webpack_require__(415)

var labelEnd = {
  name: 'labelEnd',
  tokenize: tokenizeLabelEnd,
  resolveTo: resolveToLabelEnd,
  resolveAll: resolveAllLabelEnd
}
var resourceConstruct = {
  tokenize: tokenizeResource
}
var fullReferenceConstruct = {
  tokenize: tokenizeFullReference
}
var collapsedReferenceConstruct = {
  tokenize: tokenizeCollapsedReference
}

function resolveAllLabelEnd(events) {
  var index = -1
  var token

  while (++index < events.length) {
    token = events[index][1]

    if (
      !token._used &&
      (token.type === 'labelImage' ||
        token.type === 'labelLink' ||
        token.type === 'labelEnd')
    ) {
      // Remove the marker.
      events.splice(index + 1, token.type === 'labelImage' ? 4 : 2)
      token.type = 'data'
      index++
    }
  }

  return events
}

function resolveToLabelEnd(events, context) {
  var index = events.length
  var offset = 0
  var group
  var label
  var text
  var token
  var open
  var close
  var media // Find an opening.

  while (index--) {
    token = events[index][1]

    if (open) {
      // If we see another link, or inactive link label, we’ve been here before.
      if (
        token.type === 'link' ||
        (token.type === 'labelLink' && token._inactive)
      ) {
        break
      } // Mark other link openings as inactive, as we can’t have links in
      // links.

      if (events[index][0] === 'enter' && token.type === 'labelLink') {
        token._inactive = true
      }
    } else if (close) {
      if (
        events[index][0] === 'enter' &&
        (token.type === 'labelImage' || token.type === 'labelLink') &&
        !token._balanced
      ) {
        open = index

        if (token.type !== 'labelLink') {
          offset = 2
          break
        }
      }
    } else if (token.type === 'labelEnd') {
      close = index
    }
  }

  group = {
    type: events[open][1].type === 'labelLink' ? 'link' : 'image',
    start: shallow(events[open][1].start),
    end: shallow(events[events.length - 1][1].end)
  }
  label = {
    type: 'label',
    start: shallow(events[open][1].start),
    end: shallow(events[close][1].end)
  }
  text = {
    type: 'labelText',
    start: shallow(events[open + offset + 2][1].end),
    end: shallow(events[close - 2][1].start)
  }
  media = [
    ['enter', group, context],
    ['enter', label, context]
  ] // Opening marker.

  media = chunkedPush(media, events.slice(open + 1, open + offset + 3)) // Text open.

  media = chunkedPush(media, [['enter', text, context]]) // Between.

  media = chunkedPush(
    media,
    resolveAll(
      context.parser.constructs.insideSpan.null,
      events.slice(open + offset + 4, close - 3),
      context
    )
  ) // Text close, marker close, label close.

  media = chunkedPush(media, [
    ['exit', text, context],
    events[close - 2],
    events[close - 1],
    ['exit', label, context]
  ]) // Reference, resource, or so.

  media = chunkedPush(media, events.slice(close + 1)) // Media close.

  media = chunkedPush(media, [['exit', group, context]])
  chunkedSplice(events, open, events.length, media)
  return events
}

function tokenizeLabelEnd(effects, ok, nok) {
  var self = this
  var index = self.events.length
  var labelStart
  var defined // Find an opening.

  while (index--) {
    if (
      (self.events[index][1].type === 'labelImage' ||
        self.events[index][1].type === 'labelLink') &&
      !self.events[index][1]._balanced
    ) {
      labelStart = self.events[index][1]
      break
    }
  }

  return start

  function start(code) {
    if (!labelStart) {
      return nok(code)
    } // It’s a balanced bracket, but contains a link.

    if (labelStart._inactive) return balanced(code)
    defined =
      self.parser.defined.indexOf(
        normalizeIdentifier(
          self.sliceSerialize({
            start: labelStart.end,
            end: self.now()
          })
        )
      ) > -1
    effects.enter('labelEnd')
    effects.enter('labelMarker')
    effects.consume(code)
    effects.exit('labelMarker')
    effects.exit('labelEnd')
    return afterLabelEnd
  }

  function afterLabelEnd(code) {
    // Resource: `[asd](fgh)`.
    if (code === 40) {
      return effects.attempt(
        resourceConstruct,
        ok,
        defined ? ok : balanced
      )(code)
    } // Collapsed (`[asd][]`) or full (`[asd][fgh]`) reference?

    if (code === 91) {
      return effects.attempt(
        fullReferenceConstruct,
        ok,
        defined
          ? effects.attempt(collapsedReferenceConstruct, ok, balanced)
          : balanced
      )(code)
    } // Shortcut reference: `[asd]`?

    return defined ? ok(code) : balanced(code)
  }

  function balanced(code) {
    labelStart._balanced = true
    return nok(code)
  }
}

function tokenizeResource(effects, ok, nok) {
  return start

  function start(code) {
    effects.enter('resource')
    effects.enter('resourceMarker')
    effects.consume(code)
    effects.exit('resourceMarker')
    return factoryWhitespace(effects, open)
  }

  function open(code) {
    if (code === 41) {
      return end(code)
    }

    return factoryDestination(
      effects,
      destinationAfter,
      nok,
      'resourceDestination',
      'resourceDestinationLiteral',
      'resourceDestinationLiteralMarker',
      'resourceDestinationRaw',
      'resourceDestinationString',
      3
    )(code)
  }

  function destinationAfter(code) {
    return markdownLineEndingOrSpace(code)
      ? factoryWhitespace(effects, between)(code)
      : end(code)
  }

  function between(code) {
    if (code === 34 || code === 39 || code === 40) {
      return factoryTitle(
        effects,
        factoryWhitespace(effects, end),
        nok,
        'resourceTitle',
        'resourceTitleMarker',
        'resourceTitleString'
      )(code)
    }

    return end(code)
  }

  function end(code) {
    if (code === 41) {
      effects.enter('resourceMarker')
      effects.consume(code)
      effects.exit('resourceMarker')
      effects.exit('resource')
      return ok
    }

    return nok(code)
  }
}

function tokenizeFullReference(effects, ok, nok) {
  var self = this
  return start

  function start(code) {
    return factoryLabel.call(
      self,
      effects,
      afterLabel,
      nok,
      'reference',
      'referenceMarker',
      'referenceString'
    )(code)
  }

  function afterLabel(code) {
    return self.parser.defined.indexOf(
      normalizeIdentifier(
        self.sliceSerialize(self.events[self.events.length - 1][1]).slice(1, -1)
      )
    ) < 0
      ? nok(code)
      : ok(code)
  }
}

function tokenizeCollapsedReference(effects, ok, nok) {
  return start

  function start(code) {
    effects.enter('reference')
    effects.enter('referenceMarker')
    effects.consume(code)
    effects.exit('referenceMarker')
    return open
  }

  function open(code) {
    if (code === 93) {
      effects.enter('referenceMarker')
      effects.consume(code)
      effects.exit('referenceMarker')
      effects.exit('reference')
      return ok
    }

    return nok(code)
  }
}

module.exports = labelEnd


/***/ }),

/***/ 1038:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var labelEnd = __webpack_require__(7680)

var labelStartImage = {
  name: 'labelStartImage',
  tokenize: tokenizeLabelStartImage,
  resolveAll: labelEnd.resolveAll
}

function tokenizeLabelStartImage(effects, ok, nok) {
  var self = this
  return start

  function start(code) {
    effects.enter('labelImage')
    effects.enter('labelImageMarker')
    effects.consume(code)
    effects.exit('labelImageMarker')
    return open
  }

  function open(code) {
    if (code === 91) {
      effects.enter('labelMarker')
      effects.consume(code)
      effects.exit('labelMarker')
      effects.exit('labelImage')
      return after
    }

    return nok(code)
  }

  function after(code) {
    /* c8 ignore next */
    return code === 94 &&
      /* c8 ignore next */
      '_hiddenFootnoteSupport' in self.parser.constructs
      ? /* c8 ignore next */
        nok(code)
      : ok(code)
  }
}

module.exports = labelStartImage


/***/ }),

/***/ 2484:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var labelEnd = __webpack_require__(7680)

var labelStartLink = {
  name: 'labelStartLink',
  tokenize: tokenizeLabelStartLink,
  resolveAll: labelEnd.resolveAll
}

function tokenizeLabelStartLink(effects, ok, nok) {
  var self = this
  return start

  function start(code) {
    effects.enter('labelLink')
    effects.enter('labelMarker')
    effects.consume(code)
    effects.exit('labelMarker')
    effects.exit('labelLink')
    return after
  }

  function after(code) {
    /* c8 ignore next */
    return code === 94 &&
      /* c8 ignore next */
      '_hiddenFootnoteSupport' in self.parser.constructs
      ? /* c8 ignore next */
        nok(code)
      : ok(code)
  }
}

module.exports = labelStartLink


/***/ }),

/***/ 7611:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var factorySpace = __webpack_require__(1905)

var lineEnding = {
  name: 'lineEnding',
  tokenize: tokenizeLineEnding
}

function tokenizeLineEnding(effects, ok) {
  return start

  function start(code) {
    effects.enter('lineEnding')
    effects.consume(code)
    effects.exit('lineEnding')
    return factorySpace(effects, ok, 'linePrefix')
  }
}

module.exports = lineEnding


/***/ }),

/***/ 9955:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var asciiDigit = __webpack_require__(9602)
var markdownSpace = __webpack_require__(9225)
var prefixSize = __webpack_require__(4510)
var sizeChunks = __webpack_require__(9333)
var factorySpace = __webpack_require__(1905)
var partialBlankLine = __webpack_require__(921)
var thematicBreak = __webpack_require__(3834)

var list = {
  name: 'list',
  tokenize: tokenizeListStart,
  continuation: {
    tokenize: tokenizeListContinuation
  },
  exit: tokenizeListEnd
}
var listItemPrefixWhitespaceConstruct = {
  tokenize: tokenizeListItemPrefixWhitespace,
  partial: true
}
var indentConstruct = {
  tokenize: tokenizeIndent,
  partial: true
}

function tokenizeListStart(effects, ok, nok) {
  var self = this
  var initialSize = prefixSize(self.events, 'linePrefix')
  var size = 0
  return start

  function start(code) {
    var kind =
      self.containerState.type ||
      (code === 42 || code === 43 || code === 45
        ? 'listUnordered'
        : 'listOrdered')

    if (
      kind === 'listUnordered'
        ? !self.containerState.marker || code === self.containerState.marker
        : asciiDigit(code)
    ) {
      if (!self.containerState.type) {
        self.containerState.type = kind
        effects.enter(kind, {
          _container: true
        })
      }

      if (kind === 'listUnordered') {
        effects.enter('listItemPrefix')
        return code === 42 || code === 45
          ? effects.check(thematicBreak, nok, atMarker)(code)
          : atMarker(code)
      }

      if (!self.interrupt || code === 49) {
        effects.enter('listItemPrefix')
        effects.enter('listItemValue')
        return inside(code)
      }
    }

    return nok(code)
  }

  function inside(code) {
    if (asciiDigit(code) && ++size < 10) {
      effects.consume(code)
      return inside
    }

    if (
      (!self.interrupt || size < 2) &&
      (self.containerState.marker
        ? code === self.containerState.marker
        : code === 41 || code === 46)
    ) {
      effects.exit('listItemValue')
      return atMarker(code)
    }

    return nok(code)
  }

  function atMarker(code) {
    effects.enter('listItemMarker')
    effects.consume(code)
    effects.exit('listItemMarker')
    self.containerState.marker = self.containerState.marker || code
    return effects.check(
      partialBlankLine, // Can’t be empty when interrupting.
      self.interrupt ? nok : onBlank,
      effects.attempt(
        listItemPrefixWhitespaceConstruct,
        endOfPrefix,
        otherPrefix
      )
    )
  }

  function onBlank(code) {
    self.containerState.initialBlankLine = true
    initialSize++
    return endOfPrefix(code)
  }

  function otherPrefix(code) {
    if (markdownSpace(code)) {
      effects.enter('listItemPrefixWhitespace')
      effects.consume(code)
      effects.exit('listItemPrefixWhitespace')
      return endOfPrefix
    }

    return nok(code)
  }

  function endOfPrefix(code) {
    self.containerState.size =
      initialSize + sizeChunks(self.sliceStream(effects.exit('listItemPrefix')))
    return ok(code)
  }
}

function tokenizeListContinuation(effects, ok, nok) {
  var self = this
  self.containerState._closeFlow = undefined
  return effects.check(partialBlankLine, onBlank, notBlank)

  function onBlank(code) {
    self.containerState.furtherBlankLines =
      self.containerState.furtherBlankLines ||
      self.containerState.initialBlankLine // We have a blank line.
    // Still, try to consume at most the items size.

    return factorySpace(
      effects,
      ok,
      'listItemIndent',
      self.containerState.size + 1
    )(code)
  }

  function notBlank(code) {
    if (self.containerState.furtherBlankLines || !markdownSpace(code)) {
      self.containerState.furtherBlankLines = self.containerState.initialBlankLine = undefined
      return notInCurrentItem(code)
    }

    self.containerState.furtherBlankLines = self.containerState.initialBlankLine = undefined
    return effects.attempt(indentConstruct, ok, notInCurrentItem)(code)
  }

  function notInCurrentItem(code) {
    // While we do continue, we signal that the flow should be closed.
    self.containerState._closeFlow = true // As we’re closing flow, we’re no longer interrupting.

    self.interrupt = undefined
    return factorySpace(
      effects,
      effects.attempt(list, ok, nok),
      'linePrefix',
      self.parser.constructs.disable.null.indexOf('codeIndented') > -1
        ? undefined
        : 4
    )(code)
  }
}

function tokenizeIndent(effects, ok, nok) {
  var self = this
  return factorySpace(
    effects,
    afterPrefix,
    'listItemIndent',
    self.containerState.size + 1
  )

  function afterPrefix(code) {
    return prefixSize(self.events, 'listItemIndent') ===
      self.containerState.size
      ? ok(code)
      : nok(code)
  }
}

function tokenizeListEnd(effects) {
  effects.exit(this.containerState.type)
}

function tokenizeListItemPrefixWhitespace(effects, ok, nok) {
  var self = this
  return factorySpace(
    effects,
    afterPrefix,
    'listItemPrefixWhitespace',
    self.parser.constructs.disable.null.indexOf('codeIndented') > -1
      ? undefined
      : 4 + 1
  )

  function afterPrefix(code) {
    return markdownSpace(code) ||
      !prefixSize(self.events, 'listItemPrefixWhitespace')
      ? nok(code)
      : ok(code)
  }
}

module.exports = list


/***/ }),

/***/ 921:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var markdownLineEnding = __webpack_require__(2739)
var factorySpace = __webpack_require__(1905)

var partialBlankLine = {
  tokenize: tokenizePartialBlankLine,
  partial: true
}

function tokenizePartialBlankLine(effects, ok, nok) {
  return factorySpace(effects, afterWhitespace, 'linePrefix')

  function afterWhitespace(code) {
    return code === null || markdownLineEnding(code) ? ok(code) : nok(code)
  }
}

module.exports = partialBlankLine


/***/ }),

/***/ 6468:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var markdownLineEnding = __webpack_require__(2739)
var shallow = __webpack_require__(286)
var factorySpace = __webpack_require__(1905)

var setextUnderline = {
  name: 'setextUnderline',
  tokenize: tokenizeSetextUnderline,
  resolveTo: resolveToSetextUnderline
}

function resolveToSetextUnderline(events, context) {
  var index = events.length
  var content
  var text
  var definition
  var heading // Find the opening of the content.
  // It’ll always exist: we don’t tokenize if it isn’t there.

  while (index--) {
    if (events[index][0] === 'enter') {
      if (events[index][1].type === 'content') {
        content = index
        break
      }

      if (events[index][1].type === 'paragraph') {
        text = index
      }
    } // Exit
    else {
      if (events[index][1].type === 'content') {
        // Remove the content end (if needed we’ll add it later)
        events.splice(index, 1)
      }

      if (!definition && events[index][1].type === 'definition') {
        definition = index
      }
    }
  }

  heading = {
    type: 'setextHeading',
    start: shallow(events[text][1].start),
    end: shallow(events[events.length - 1][1].end)
  } // Change the paragraph to setext heading text.

  events[text][1].type = 'setextHeadingText' // If we have definitions in the content, we’ll keep on having content,
  // but we need move it.

  if (definition) {
    events.splice(text, 0, ['enter', heading, context])
    events.splice(definition + 1, 0, ['exit', events[content][1], context])
    events[content][1].end = shallow(events[definition][1].end)
  } else {
    events[content][1] = heading
  } // Add the heading exit at the end.

  events.push(['exit', heading, context])
  return events
}

function tokenizeSetextUnderline(effects, ok, nok) {
  var self = this
  var index = self.events.length
  var marker
  var paragraph // Find an opening.

  while (index--) {
    // Skip enter/exit of line ending, line prefix, and content.
    // We can now either have a definition or a paragraph.
    if (
      self.events[index][1].type !== 'lineEnding' &&
      self.events[index][1].type !== 'linePrefix' &&
      self.events[index][1].type !== 'content'
    ) {
      paragraph = self.events[index][1].type === 'paragraph'
      break
    }
  }

  return start

  function start(code) {
    if (!self.lazy && (self.interrupt || paragraph)) {
      effects.enter('setextHeadingLine')
      effects.enter('setextHeadingLineSequence')
      marker = code
      return closingSequence(code)
    }

    return nok(code)
  }

  function closingSequence(code) {
    if (code === marker) {
      effects.consume(code)
      return closingSequence
    }

    effects.exit('setextHeadingLineSequence')
    return factorySpace(effects, closingSequenceEnd, 'lineSuffix')(code)
  }

  function closingSequenceEnd(code) {
    if (code === null || markdownLineEnding(code)) {
      effects.exit('setextHeadingLine')
      return ok(code)
    }

    return nok(code)
  }
}

module.exports = setextUnderline


/***/ }),

/***/ 3834:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var markdownLineEnding = __webpack_require__(2739)
var markdownSpace = __webpack_require__(9225)
var factorySpace = __webpack_require__(1905)

var thematicBreak = {
  name: 'thematicBreak',
  tokenize: tokenizeThematicBreak
}

function tokenizeThematicBreak(effects, ok, nok) {
  var size = 0
  var marker
  return start

  function start(code) {
    effects.enter('thematicBreak')
    marker = code
    return atBreak(code)
  }

  function atBreak(code) {
    if (code === marker) {
      effects.enter('thematicBreakSequence')
      return sequence(code)
    }

    if (markdownSpace(code)) {
      return factorySpace(effects, atBreak, 'whitespace')(code)
    }

    if (size < 3 || (code !== null && !markdownLineEnding(code))) {
      return nok(code)
    }

    effects.exit('thematicBreak')
    return ok(code)
  }

  function sequence(code) {
    if (code === marker) {
      effects.consume(code)
      size++
      return sequence
    }

    effects.exit('thematicBreakSequence')
    return atBreak(code)
  }
}

module.exports = thematicBreak


/***/ }),

/***/ 8948:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var chunkedSplice = __webpack_require__(5966)

function chunkedPush(list, items) {
  if (list.length) {
    chunkedSplice(list, list.length, 0, items)
    return list
  }

  return items
}

module.exports = chunkedPush


/***/ }),

/***/ 5966:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var splice = __webpack_require__(7716)

// causes a stack overflow in V8 when trying to insert 100k items for instance.

function chunkedSplice(list, start, remove, items) {
  var end = list.length
  var chunkStart = 0
  var parameters // Make start between zero and `end` (included).

  if (start < 0) {
    start = -start > end ? 0 : end + start
  } else {
    start = start > end ? end : start
  }

  remove = remove > 0 ? remove : 0 // No need to chunk the items if there’s only a couple (10k) items.

  if (items.length < 10000) {
    parameters = Array.from(items)
    parameters.unshift(start, remove)
    splice.apply(list, parameters)
  } else {
    // Delete `remove` items starting from `start`
    if (remove) splice.apply(list, [start, remove]) // Insert the items in chunks to not cause stack overflows.

    while (chunkStart < items.length) {
      parameters = items.slice(chunkStart, chunkStart + 10000)
      parameters.unshift(start, 0)
      splice.apply(list, parameters)
      chunkStart += 10000
      start += 10000
    }
  }
}

module.exports = chunkedSplice


/***/ }),

/***/ 3:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var markdownLineEndingOrSpace = __webpack_require__(6430)
var unicodePunctuation = __webpack_require__(6516)
var unicodeWhitespace = __webpack_require__(463)

// Classify whether a character is unicode whitespace, unicode punctuation, or
// anything else.
// Used for attention (emphasis, strong), whose sequences can open or close
// based on the class of surrounding characters.
function classifyCharacter(code) {
  if (
    code === null ||
    markdownLineEndingOrSpace(code) ||
    unicodeWhitespace(code)
  ) {
    return 1
  }

  if (unicodePunctuation(code)) {
    return 2
  }
}

module.exports = classifyCharacter


/***/ }),

/***/ 7450:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var hasOwnProperty = __webpack_require__(277)
var chunkedSplice = __webpack_require__(5966)
var miniflat = __webpack_require__(8011)

function combineExtensions(extensions) {
  var all = {}
  var index = -1

  while (++index < extensions.length) {
    extension(all, extensions[index])
  }

  return all
}

function extension(all, extension) {
  var hook
  var left
  var right
  var code

  for (hook in extension) {
    left = hasOwnProperty.call(all, hook) ? all[hook] : (all[hook] = {})
    right = extension[hook]

    for (code in right) {
      left[code] = constructs(
        miniflat(right[code]),
        hasOwnProperty.call(left, code) ? left[code] : []
      )
    }
  }
}

function constructs(list, existing) {
  var index = -1
  var before = []

  while (++index < list.length) {
    ;(list[index].add === 'after' ? existing : before).push(list[index])
  }

  chunkedSplice(existing, 0, 0, before)
  return existing
}

module.exports = combineExtensions


/***/ }),

/***/ 9708:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var assign = __webpack_require__(1328)
var markdownLineEnding = __webpack_require__(2739)
var chunkedPush = __webpack_require__(8948)
var chunkedSplice = __webpack_require__(5966)
var miniflat = __webpack_require__(8011)
var resolveAll = __webpack_require__(5579)
var serializeChunks = __webpack_require__(5866)
var shallow = __webpack_require__(286)
var sliceChunks = __webpack_require__(6056)

// Create a tokenizer.
// Tokenizers deal with one type of data (e.g., containers, flow, text).
// The parser is the object dealing with it all.
// `initialize` works like other constructs, except that only its `tokenize`
// function is used, in which case it doesn’t receive an `ok` or `nok`.
// `from` can be given to set the point before the first character, although
// when further lines are indented, they must be set with `defineSkip`.
function createTokenizer(parser, initialize, from) {
  var point = from
    ? shallow(from)
    : {
        line: 1,
        column: 1,
        offset: 0
      }
  var columnStart = {}
  var resolveAllConstructs = []
  var chunks = []
  var stack = []

  var effects = {
    consume: consume,
    enter: enter,
    exit: exit,
    attempt: constructFactory(onsuccessfulconstruct),
    check: constructFactory(onsuccessfulcheck),
    interrupt: constructFactory(onsuccessfulcheck, {
      interrupt: true
    }),
    lazy: constructFactory(onsuccessfulcheck, {
      lazy: true
    })
  } // State and tools for resolving and serializing.

  var context = {
    previous: null,
    events: [],
    parser: parser,
    sliceStream: sliceStream,
    sliceSerialize: sliceSerialize,
    now: now,
    defineSkip: skip,
    write: write
  } // The state function.

  var state = initialize.tokenize.call(context, effects) // Track which character we expect to be consumed, to catch bugs.

  if (initialize.resolveAll) {
    resolveAllConstructs.push(initialize)
  } // Store where we are in the input stream.

  point._index = 0
  point._bufferIndex = -1
  return context

  function write(slice) {
    chunks = chunkedPush(chunks, slice)
    main() // Exit if we’re not done, resolve might change stuff.

    if (chunks[chunks.length - 1] !== null) {
      return []
    }

    addResult(initialize, 0) // Otherwise, resolve, and exit.

    context.events = resolveAll(resolveAllConstructs, context.events, context)
    return context.events
  } //
  // Tools.
  //

  function sliceSerialize(token) {
    return serializeChunks(sliceStream(token))
  }

  function sliceStream(token) {
    return sliceChunks(chunks, token)
  }

  function now() {
    return shallow(point)
  }

  function skip(value) {
    columnStart[value.line] = value.column
    accountForPotentialSkip()
  } //
  // State management.
  //
  // Main loop (note that `_index` and `_bufferIndex` in `point` are modified by
  // `consume`).
  // Here is where we walk through the chunks, which either include strings of
  // several characters, or numerical character codes.
  // The reason to do this in a loop instead of a call is so the stack can
  // drain.

  function main() {
    var chunkIndex
    var chunk

    while (point._index < chunks.length) {
      chunk = chunks[point._index] // If we’re in a buffer chunk, loop through it.

      if (typeof chunk === 'string') {
        chunkIndex = point._index

        if (point._bufferIndex < 0) {
          point._bufferIndex = 0
        }

        while (
          point._index === chunkIndex &&
          point._bufferIndex < chunk.length
        ) {
          go(chunk.charCodeAt(point._bufferIndex))
        }
      } else {
        go(chunk)
      }
    }
  } // Deal with one code.

  function go(code) {
    state = state(code)
  } // Move a character forward.

  function consume(code) {
    if (markdownLineEnding(code)) {
      point.line++
      point.column = 1
      point.offset += code === -3 ? 2 : 1
      accountForPotentialSkip()
    } else if (code !== -1) {
      point.column++
      point.offset++
    } // Not in a string chunk.

    if (point._bufferIndex < 0) {
      point._index++
    } else {
      point._bufferIndex++ // At end of string chunk.

      if (point._bufferIndex === chunks[point._index].length) {
        point._bufferIndex = -1
        point._index++
      }
    } // Expose the previous character.

    context.previous = code // Mark as consumed.
  } // Start a token.

  function enter(type, fields) {
    var token = fields || {}
    token.type = type
    token.start = now()
    context.events.push(['enter', token, context])
    stack.push(token)
    return token
  } // Stop a token.

  function exit(type) {
    var token = stack.pop()
    token.end = now()
    context.events.push(['exit', token, context])
    return token
  } // Use results.

  function onsuccessfulconstruct(construct, info) {
    addResult(construct, info.from)
  } // Discard results.

  function onsuccessfulcheck(construct, info) {
    info.restore()
  } // Factory to attempt/check/interrupt.

  function constructFactory(onreturn, fields) {
    return hook // Handle either an object mapping codes to constructs, a list of
    // constructs, or a single construct.

    function hook(constructs, returnState, bogusState) {
      var listOfConstructs
      var constructIndex
      var currentConstruct
      var info
      return constructs.tokenize || 'length' in constructs
        ? handleListOfConstructs(miniflat(constructs))
        : handleMapOfConstructs

      function handleMapOfConstructs(code) {
        if (code in constructs || null in constructs) {
          return handleListOfConstructs(
            constructs.null
              ? /* c8 ignore next */
                miniflat(constructs[code]).concat(miniflat(constructs.null))
              : constructs[code]
          )(code)
        }

        return bogusState(code)
      }

      function handleListOfConstructs(list) {
        listOfConstructs = list
        constructIndex = 0
        return handleConstruct(list[constructIndex])
      }

      function handleConstruct(construct) {
        return start

        function start(code) {
          // To do: not nede to store if there is no bogus state, probably?
          // Currently doesn’t work because `inspect` in document does a check
          // w/o a bogus, which doesn’t make sense. But it does seem to help perf
          // by not storing.
          info = store()
          currentConstruct = construct

          if (!construct.partial) {
            context.currentConstruct = construct
          }

          if (
            construct.name &&
            context.parser.constructs.disable.null.indexOf(construct.name) > -1
          ) {
            return nok()
          }

          return construct.tokenize.call(
            fields ? assign({}, context, fields) : context,
            effects,
            ok,
            nok
          )(code)
        }
      }

      function ok(code) {
        onreturn(currentConstruct, info)
        return returnState
      }

      function nok(code) {
        info.restore()

        if (++constructIndex < listOfConstructs.length) {
          return handleConstruct(listOfConstructs[constructIndex])
        }

        return bogusState
      }
    }
  }

  function addResult(construct, from) {
    if (construct.resolveAll && resolveAllConstructs.indexOf(construct) < 0) {
      resolveAllConstructs.push(construct)
    }

    if (construct.resolve) {
      chunkedSplice(
        context.events,
        from,
        context.events.length - from,
        construct.resolve(context.events.slice(from), context)
      )
    }

    if (construct.resolveTo) {
      context.events = construct.resolveTo(context.events, context)
    }
  }

  function store() {
    var startPoint = now()
    var startPrevious = context.previous
    var startCurrentConstruct = context.currentConstruct
    var startEventsIndex = context.events.length
    var startStack = Array.from(stack)
    return {
      restore: restore,
      from: startEventsIndex
    }

    function restore() {
      point = startPoint
      context.previous = startPrevious
      context.currentConstruct = startCurrentConstruct
      context.events.length = startEventsIndex
      stack = startStack
      accountForPotentialSkip()
    }
  }

  function accountForPotentialSkip() {
    if (point.line in columnStart && point.column < 2) {
      point.column = columnStart[point.line]
      point.offset += columnStart[point.line] - 1
    }
  }
}

module.exports = createTokenizer


/***/ }),

/***/ 8011:
/***/ ((module) => {

"use strict";


function miniflat(value) {
  return value === null || value === undefined
    ? []
    : 'length' in value
    ? value
    : [value]
}

module.exports = miniflat


/***/ }),

/***/ 930:
/***/ ((module) => {

"use strict";


// chunks (replacement characters, tabs, or line endings).

function movePoint(point, offset) {
  point.column += offset
  point.offset += offset
  point._bufferIndex += offset
  return point
}

module.exports = movePoint


/***/ }),

/***/ 7243:
/***/ ((module) => {

"use strict";


function normalizeIdentifier(value) {
  return (
    value // Collapse Markdown whitespace.
      .replace(/[\t\n\r ]+/g, ' ') // Trim.
      .replace(/^ | $/g, '') // Some characters are considered “uppercase”, but if their lowercase
      // counterpart is uppercased will result in a different uppercase
      // character.
      // Hence, to get that form, we perform both lower- and uppercase.
      // Upper case makes sure keys will not interact with default prototypal
      // methods: no object method is uppercase.
      .toLowerCase()
      .toUpperCase()
  )
}

module.exports = normalizeIdentifier


/***/ }),

/***/ 4510:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var sizeChunks = __webpack_require__(9333)

function prefixSize(events, type) {
  var tail = events[events.length - 1]
  if (!tail || tail[1].type !== type) return 0
  return sizeChunks(tail[2].sliceStream(tail[1]))
}

module.exports = prefixSize


/***/ }),

/***/ 5540:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var fromCharCode = __webpack_require__(4428)

function regexCheck(regex) {
  return check

  function check(code) {
    return regex.test(fromCharCode(code))
  }
}

module.exports = regexCheck


/***/ }),

/***/ 5579:
/***/ ((module) => {

"use strict";


function resolveAll(constructs, events, context) {
  var called = []
  var index = -1
  var resolve

  while (++index < constructs.length) {
    resolve = constructs[index].resolveAll

    if (resolve && called.indexOf(resolve) < 0) {
      events = resolve(events, context)
      called.push(resolve)
    }
  }

  return events
}

module.exports = resolveAll


/***/ }),

/***/ 54:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var fromCharCode = __webpack_require__(4428)

function safeFromInt(value, base) {
  var code = parseInt(value, base)

  if (
    // C0 except for HT, LF, FF, CR, space
    code < 9 ||
    code === 11 ||
    (code > 13 && code < 32) || // Control character (DEL) of the basic block and C1 controls.
    (code > 126 && code < 160) || // Lone high surrogates and low surrogates.
    (code > 55295 && code < 57344) || // Noncharacters.
    (code > 64975 && code < 65008) ||
    (code & 65535) === 65535 ||
    (code & 65535) === 65534 || // Out of range
    code > 1114111
  ) {
    return '\uFFFD'
  }

  return fromCharCode(code)
}

module.exports = safeFromInt


/***/ }),

/***/ 5866:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var fromCharCode = __webpack_require__(4428)

function serializeChunks(chunks) {
  var index = -1
  var result = []
  var chunk
  var value
  var atTab

  while (++index < chunks.length) {
    chunk = chunks[index]

    if (typeof chunk === 'string') {
      value = chunk
    } else if (chunk === -5) {
      value = '\r'
    } else if (chunk === -4) {
      value = '\n'
    } else if (chunk === -3) {
      value = '\r' + '\n'
    } else if (chunk === -2) {
      value = '\t'
    } else if (chunk === -1) {
      if (atTab) continue
      value = ' '
    } else {
      // Currently only replacement character.
      value = fromCharCode(chunk)
    }

    atTab = chunk === -2
    result.push(value)
  }

  return result.join('')
}

module.exports = serializeChunks


/***/ }),

/***/ 286:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var assign = __webpack_require__(1328)

function shallow(object) {
  return assign({}, object)
}

module.exports = shallow


/***/ }),

/***/ 9333:
/***/ ((module) => {

"use strict";


// Counts tabs based on their expanded size, and CR+LF as one character.

function sizeChunks(chunks) {
  var index = -1
  var size = 0

  while (++index < chunks.length) {
    size += typeof chunks[index] === 'string' ? chunks[index].length : 1
  }

  return size
}

module.exports = sizeChunks


/***/ }),

/***/ 6056:
/***/ ((module) => {

"use strict";


function sliceChunks(chunks, token) {
  var startIndex = token.start._index
  var startBufferIndex = token.start._bufferIndex
  var endIndex = token.end._index
  var endBufferIndex = token.end._bufferIndex
  var view

  if (startIndex === endIndex) {
    view = [chunks[startIndex].slice(startBufferIndex, endBufferIndex)]
  } else {
    view = chunks.slice(startIndex, endIndex)

    if (startBufferIndex > -1) {
      view[0] = view[0].slice(startBufferIndex)
    }

    if (endBufferIndex > 0) {
      view.push(chunks[endIndex].slice(0, endBufferIndex))
    }
  }

  return view
}

module.exports = sliceChunks


/***/ }),

/***/ 8199:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var assign = __webpack_require__(1328)
var chunkedSplice = __webpack_require__(5966)
var shallow = __webpack_require__(286)

function subtokenize(events) {
  var jumps = {}
  var index = -1
  var event
  var lineIndex
  var otherIndex
  var otherEvent
  var parameters
  var subevents
  var more

  while (++index < events.length) {
    while (index in jumps) {
      index = jumps[index]
    }

    event = events[index] // Add a hook for the GFM tasklist extension, which needs to know if text
    // is in the first content of a list item.

    if (
      index &&
      event[1].type === 'chunkFlow' &&
      events[index - 1][1].type === 'listItemPrefix'
    ) {
      subevents = event[1]._tokenizer.events
      otherIndex = 0

      if (
        otherIndex < subevents.length &&
        subevents[otherIndex][1].type === 'lineEndingBlank'
      ) {
        otherIndex += 2
      }

      if (
        otherIndex < subevents.length &&
        subevents[otherIndex][1].type === 'content'
      ) {
        while (++otherIndex < subevents.length) {
          if (subevents[otherIndex][1].type === 'content') {
            break
          }

          if (subevents[otherIndex][1].type === 'chunkText') {
            subevents[otherIndex][1].isInFirstContentOfListItem = true
            otherIndex++
          }
        }
      }
    } // Enter.

    if (event[0] === 'enter') {
      if (event[1].contentType) {
        assign(jumps, subcontent(events, index))
        index = jumps[index]
        more = true
      }
    } // Exit.
    else if (event[1]._container || event[1]._movePreviousLineEndings) {
      otherIndex = index
      lineIndex = undefined

      while (otherIndex--) {
        otherEvent = events[otherIndex]

        if (
          otherEvent[1].type === 'lineEnding' ||
          otherEvent[1].type === 'lineEndingBlank'
        ) {
          if (otherEvent[0] === 'enter') {
            if (lineIndex) {
              events[lineIndex][1].type = 'lineEndingBlank'
            }

            otherEvent[1].type = 'lineEnding'
            lineIndex = otherIndex
          }
        } else {
          break
        }
      }

      if (lineIndex) {
        // Fix position.
        event[1].end = shallow(events[lineIndex][1].start) // Switch container exit w/ line endings.

        parameters = events.slice(lineIndex, index)
        parameters.unshift(event)
        chunkedSplice(events, lineIndex, index - lineIndex + 1, parameters)
      }
    }
  }

  return !more
}

function subcontent(events, eventIndex) {
  var token = events[eventIndex][1]
  var context = events[eventIndex][2]
  var startPosition = eventIndex - 1
  var startPositions = []
  var tokenizer =
    token._tokenizer || context.parser[token.contentType](token.start)
  var childEvents = tokenizer.events
  var jumps = []
  var gaps = {}
  var stream
  var previous
  var index
  var entered
  var end
  var adjust // Loop forward through the linked tokens to pass them in order to the
  // subtokenizer.

  while (token) {
    // Find the position of the event for this token.
    while (events[++startPosition][1] !== token) {
      // Empty.
    }

    startPositions.push(startPosition)

    if (!token._tokenizer) {
      stream = context.sliceStream(token)

      if (!token.next) {
        stream.push(null)
      }

      if (previous) {
        tokenizer.defineSkip(token.start)
      }

      if (token.isInFirstContentOfListItem) {
        tokenizer._gfmTasklistFirstContentOfListItem = true
      }

      tokenizer.write(stream)

      if (token.isInFirstContentOfListItem) {
        tokenizer._gfmTasklistFirstContentOfListItem = undefined
      }
    } // Unravel the next token.

    previous = token
    token = token.next
  } // Now, loop back through all events (and linked tokens), to figure out which
  // parts belong where.

  token = previous
  index = childEvents.length

  while (index--) {
    // Make sure we’ve at least seen something (final eol is part of the last
    // token).
    if (childEvents[index][0] === 'enter') {
      entered = true
    } else if (
      // Find a void token that includes a break.
      entered &&
      childEvents[index][1].type === childEvents[index - 1][1].type &&
      childEvents[index][1].start.line !== childEvents[index][1].end.line
    ) {
      add(childEvents.slice(index + 1, end))
      // Help GC.
      token._tokenizer = token.next = undefined
      token = token.previous
      end = index + 1
    }
  }

  // Help GC.
  tokenizer.events = token._tokenizer = token.next = undefined // Do head:

  add(childEvents.slice(0, end))
  index = -1
  adjust = 0

  while (++index < jumps.length) {
    gaps[adjust + jumps[index][0]] = adjust + jumps[index][1]
    adjust += jumps[index][1] - jumps[index][0] - 1
  }

  return gaps

  function add(slice) {
    var start = startPositions.pop()
    jumps.unshift([start, start + slice.length - 1])
    chunkedSplice(events, start, 2, slice)
  }
}

module.exports = subtokenize


/***/ }),

/***/ 9944:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var characterEntities = __webpack_require__(1622)

module.exports = decodeEntity

var own = {}.hasOwnProperty

function decodeEntity(characters) {
  return own.call(characterEntities, characters)
    ? characterEntities[characters]
    : false
}


/***/ }),

/***/ 3850:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


module.exports = parse

var fromMarkdown = __webpack_require__(3885)

function parse(options) {
  var self = this

  this.Parser = parse

  function parse(doc) {
    return fromMarkdown(
      doc,
      Object.assign({}, self.data('settings'), options, {
        // Note: these options are not in the readme.
        // The goal is for them to be set by plugins on `data` instead of being
        // passed by users.
        extensions: self.data('micromarkExtensions') || [],
        mdastExtensions: self.data('fromMarkdownExtensions') || []
      })
    )
  }
}


/***/ }),

/***/ 613:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var wrap = __webpack_require__(6622)

module.exports = trough

trough.wrap = wrap

var slice = [].slice

// Create new middleware.
function trough() {
  var fns = []
  var middleware = {}

  middleware.run = run
  middleware.use = use

  return middleware

  // Run `fns`.  Last argument must be a completion handler.
  function run() {
    var index = -1
    var input = slice.call(arguments, 0, -1)
    var done = arguments[arguments.length - 1]

    if (typeof done !== 'function') {
      throw new Error('Expected function as last argument, not ' + done)
    }

    next.apply(null, [null].concat(input))

    // Run the next `fn`, if any.
    function next(err) {
      var fn = fns[++index]
      var params = slice.call(arguments, 0)
      var values = params.slice(1)
      var length = input.length
      var pos = -1

      if (err) {
        done(err)
        return
      }

      // Copy non-nully input into values.
      while (++pos < length) {
        if (values[pos] === null || values[pos] === undefined) {
          values[pos] = input[pos]
        }
      }

      input = values

      // Next or done.
      if (fn) {
        wrap(fn, next).apply(null, input)
      } else {
        done.apply(null, [null].concat(input))
      }
    }
  }

  // Add `fn` to the list.
  function use(fn) {
    if (typeof fn !== 'function') {
      throw new Error('Expected `fn` to be a function, not ' + fn)
    }

    fns.push(fn)

    return middleware
  }
}


/***/ }),

/***/ 6622:
/***/ ((module) => {

"use strict";


var slice = [].slice

module.exports = wrap

// Wrap `fn`.
// Can be sync or async; return a promise, receive a completion handler, return
// new values and errors.
function wrap(fn, callback) {
  var invoked

  return wrapped

  function wrapped() {
    var params = slice.call(arguments, 0)
    var callback = fn.length > params.length
    var result

    if (callback) {
      params.push(done)
    }

    try {
      result = fn.apply(null, params)
    } catch (error) {
      // Well, this is quite the pickle.
      // `fn` received a callback and invoked it (thus continuing the pipeline),
      // but later also threw an error.
      // We’re not about to restart the pipeline again, so the only thing left
      // to do is to throw the thing instead.
      if (callback && invoked) {
        throw error
      }

      return done(error)
    }

    if (!callback) {
      if (result && typeof result.then === 'function') {
        result.then(then, done)
      } else if (result instanceof Error) {
        done(result)
      } else {
        then(result)
      }
    }
  }

  // Invoke `next`, only once.
  function done() {
    if (!invoked) {
      invoked = true

      callback.apply(null, arguments)
    }
  }

  // Invoke `done` with one value.
  // Tracks if an error is passed, too.
  function then(value) {
    done(null, value)
  }
}


/***/ }),

/***/ 4338:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var bail = __webpack_require__(1527)
var buffer = __webpack_require__(8809)
var extend = __webpack_require__(229)
var plain = __webpack_require__(7760)
var trough = __webpack_require__(613)
var vfile = __webpack_require__(9566)

// Expose a frozen processor.
module.exports = unified().freeze()

var slice = [].slice
var own = {}.hasOwnProperty

// Process pipeline.
var pipeline = trough()
  .use(pipelineParse)
  .use(pipelineRun)
  .use(pipelineStringify)

function pipelineParse(p, ctx) {
  ctx.tree = p.parse(ctx.file)
}

function pipelineRun(p, ctx, next) {
  p.run(ctx.tree, ctx.file, done)

  function done(error, tree, file) {
    if (error) {
      next(error)
    } else {
      ctx.tree = tree
      ctx.file = file
      next()
    }
  }
}

function pipelineStringify(p, ctx) {
  var result = p.stringify(ctx.tree, ctx.file)

  if (result === undefined || result === null) {
    // Empty.
  } else if (typeof result === 'string' || buffer(result)) {
    if ('value' in ctx.file) {
      ctx.file.value = result
    }

    ctx.file.contents = result
  } else {
    ctx.file.result = result
  }
}

// Function to create the first processor.
function unified() {
  var attachers = []
  var transformers = trough()
  var namespace = {}
  var freezeIndex = -1
  var frozen

  // Data management.
  processor.data = data

  // Lock.
  processor.freeze = freeze

  // Plugins.
  processor.attachers = attachers
  processor.use = use

  // API.
  processor.parse = parse
  processor.stringify = stringify
  processor.run = run
  processor.runSync = runSync
  processor.process = process
  processor.processSync = processSync

  // Expose.
  return processor

  // Create a new processor based on the processor in the current scope.
  function processor() {
    var destination = unified()
    var index = -1

    while (++index < attachers.length) {
      destination.use.apply(null, attachers[index])
    }

    destination.data(extend(true, {}, namespace))

    return destination
  }

  // Freeze: used to signal a processor that has finished configuration.
  //
  // For example, take unified itself: it’s frozen.
  // Plugins should not be added to it.
  // Rather, it should be extended, by invoking it, before modifying it.
  //
  // In essence, always invoke this when exporting a processor.
  function freeze() {
    var values
    var transformer

    if (frozen) {
      return processor
    }

    while (++freezeIndex < attachers.length) {
      values = attachers[freezeIndex]

      if (values[1] === false) {
        continue
      }

      if (values[1] === true) {
        values[1] = undefined
      }

      transformer = values[0].apply(processor, values.slice(1))

      if (typeof transformer === 'function') {
        transformers.use(transformer)
      }
    }

    frozen = true
    freezeIndex = Infinity

    return processor
  }

  // Data management.
  // Getter / setter for processor-specific informtion.
  function data(key, value) {
    if (typeof key === 'string') {
      // Set `key`.
      if (arguments.length === 2) {
        assertUnfrozen('data', frozen)
        namespace[key] = value
        return processor
      }

      // Get `key`.
      return (own.call(namespace, key) && namespace[key]) || null
    }

    // Set space.
    if (key) {
      assertUnfrozen('data', frozen)
      namespace = key
      return processor
    }

    // Get space.
    return namespace
  }

  // Plugin management.
  //
  // Pass it:
  // *   an attacher and options,
  // *   a preset,
  // *   a list of presets, attachers, and arguments (list of attachers and
  //     options).
  function use(value) {
    var settings

    assertUnfrozen('use', frozen)

    if (value === null || value === undefined) {
      // Empty.
    } else if (typeof value === 'function') {
      addPlugin.apply(null, arguments)
    } else if (typeof value === 'object') {
      if ('length' in value) {
        addList(value)
      } else {
        addPreset(value)
      }
    } else {
      throw new Error('Expected usable value, not `' + value + '`')
    }

    if (settings) {
      namespace.settings = extend(namespace.settings || {}, settings)
    }

    return processor

    function addPreset(result) {
      addList(result.plugins)

      if (result.settings) {
        settings = extend(settings || {}, result.settings)
      }
    }

    function add(value) {
      if (typeof value === 'function') {
        addPlugin(value)
      } else if (typeof value === 'object') {
        if ('length' in value) {
          addPlugin.apply(null, value)
        } else {
          addPreset(value)
        }
      } else {
        throw new Error('Expected usable value, not `' + value + '`')
      }
    }

    function addList(plugins) {
      var index = -1

      if (plugins === null || plugins === undefined) {
        // Empty.
      } else if (typeof plugins === 'object' && 'length' in plugins) {
        while (++index < plugins.length) {
          add(plugins[index])
        }
      } else {
        throw new Error('Expected a list of plugins, not `' + plugins + '`')
      }
    }

    function addPlugin(plugin, value) {
      var entry = find(plugin)

      if (entry) {
        if (plain(entry[1]) && plain(value)) {
          value = extend(true, entry[1], value)
        }

        entry[1] = value
      } else {
        attachers.push(slice.call(arguments))
      }
    }
  }

  function find(plugin) {
    var index = -1

    while (++index < attachers.length) {
      if (attachers[index][0] === plugin) {
        return attachers[index]
      }
    }
  }

  // Parse a file (in string or vfile representation) into a unist node using
  // the `Parser` on the processor.
  function parse(doc) {
    var file = vfile(doc)
    var Parser

    freeze()
    Parser = processor.Parser
    assertParser('parse', Parser)

    if (newable(Parser, 'parse')) {
      return new Parser(String(file), file).parse()
    }

    return Parser(String(file), file) // eslint-disable-line new-cap
  }

  // Run transforms on a unist node representation of a file (in string or
  // vfile representation), async.
  function run(node, file, cb) {
    assertNode(node)
    freeze()

    if (!cb && typeof file === 'function') {
      cb = file
      file = null
    }

    if (!cb) {
      return new Promise(executor)
    }

    executor(null, cb)

    function executor(resolve, reject) {
      transformers.run(node, vfile(file), done)

      function done(error, tree, file) {
        tree = tree || node
        if (error) {
          reject(error)
        } else if (resolve) {
          resolve(tree)
        } else {
          cb(null, tree, file)
        }
      }
    }
  }

  // Run transforms on a unist node representation of a file (in string or
  // vfile representation), sync.
  function runSync(node, file) {
    var result
    var complete

    run(node, file, done)

    assertDone('runSync', 'run', complete)

    return result

    function done(error, tree) {
      complete = true
      result = tree
      bail(error)
    }
  }

  // Stringify a unist node representation of a file (in string or vfile
  // representation) into a string using the `Compiler` on the processor.
  function stringify(node, doc) {
    var file = vfile(doc)
    var Compiler

    freeze()
    Compiler = processor.Compiler
    assertCompiler('stringify', Compiler)
    assertNode(node)

    if (newable(Compiler, 'compile')) {
      return new Compiler(node, file).compile()
    }

    return Compiler(node, file) // eslint-disable-line new-cap
  }

  // Parse a file (in string or vfile representation) into a unist node using
  // the `Parser` on the processor, then run transforms on that node, and
  // compile the resulting node using the `Compiler` on the processor, and
  // store that result on the vfile.
  function process(doc, cb) {
    freeze()
    assertParser('process', processor.Parser)
    assertCompiler('process', processor.Compiler)

    if (!cb) {
      return new Promise(executor)
    }

    executor(null, cb)

    function executor(resolve, reject) {
      var file = vfile(doc)

      pipeline.run(processor, {file: file}, done)

      function done(error) {
        if (error) {
          reject(error)
        } else if (resolve) {
          resolve(file)
        } else {
          cb(null, file)
        }
      }
    }
  }

  // Process the given document (in string or vfile representation), sync.
  function processSync(doc) {
    var file
    var complete

    freeze()
    assertParser('processSync', processor.Parser)
    assertCompiler('processSync', processor.Compiler)
    file = vfile(doc)

    process(file, done)

    assertDone('processSync', 'process', complete)

    return file

    function done(error) {
      complete = true
      bail(error)
    }
  }
}

// Check if `value` is a constructor.
function newable(value, name) {
  return (
    typeof value === 'function' &&
    value.prototype &&
    // A function with keys in its prototype is probably a constructor.
    // Classes’ prototype methods are not enumerable, so we check if some value
    // exists in the prototype.
    (keys(value.prototype) || name in value.prototype)
  )
}

// Check if `value` is an object with keys.
function keys(value) {
  var key
  for (key in value) {
    return true
  }

  return false
}

// Assert a parser is available.
function assertParser(name, Parser) {
  if (typeof Parser !== 'function') {
    throw new Error('Cannot `' + name + '` without `Parser`')
  }
}

// Assert a compiler is available.
function assertCompiler(name, Compiler) {
  if (typeof Compiler !== 'function') {
    throw new Error('Cannot `' + name + '` without `Compiler`')
  }
}

// Assert the processor is not frozen.
function assertUnfrozen(name, frozen) {
  if (frozen) {
    throw new Error(
      'Cannot invoke `' +
        name +
        '` on a frozen processor.\nCreate a new processor first, by invoking it: use `processor()` instead of `processor`.'
    )
  }
}

// Assert `node` is a unist node.
function assertNode(node) {
  if (!node || typeof node.type !== 'string') {
    throw new Error('Expected node, got `' + node + '`')
  }
}

// Assert that `complete` is `true`.
function assertDone(name, asyncName, complete) {
  if (!complete) {
    throw new Error(
      '`' + name + '` finished async. Use `' + asyncName + '` instead'
    )
  }
}


/***/ }),

/***/ 2872:
/***/ ((module) => {

"use strict";


module.exports = u

function u(type, props, value) {
  var node

  if (
    (value === null || value === undefined) &&
    (typeof props !== 'object' || Array.isArray(props))
  ) {
    value = props
    props = {}
  }

  node = Object.assign({type: String(type)}, props)

  if (Array.isArray(value)) {
    node.children = value
  } else if (value !== null && value !== undefined) {
    node.value = String(value)
  }

  return node
}


/***/ }),

/***/ 8666:
/***/ ((module) => {

"use strict";


module.exports = generated

function generated(node) {
  return (
    !node ||
    !node.position ||
    !node.position.start ||
    !node.position.start.line ||
    !node.position.start.column ||
    !node.position.end ||
    !node.position.end.line ||
    !node.position.end.column
  )
}


/***/ }),

/***/ 9725:
/***/ ((module) => {

"use strict";


var start = factory('start')
var end = factory('end')

module.exports = position

position.start = start
position.end = end

function position(node) {
  return {start: start(node), end: end(node)}
}

function factory(type) {
  point.displayName = type

  return point

  function point(node) {
    var point = (node && node.position && node.position[type]) || {}

    return {
      line: point.line || null,
      column: point.column || null,
      offset: isNaN(point.offset) ? null : point.offset
    }
  }
}


/***/ }),

/***/ 9158:
/***/ ((module) => {

"use strict";


var own = {}.hasOwnProperty

module.exports = stringify

function stringify(value) {
  // Nothing.
  if (!value || typeof value !== 'object') {
    return ''
  }

  // Node.
  if (own.call(value, 'position') || own.call(value, 'type')) {
    return position(value.position)
  }

  // Position.
  if (own.call(value, 'start') || own.call(value, 'end')) {
    return position(value)
  }

  // Point.
  if (own.call(value, 'line') || own.call(value, 'column')) {
    return point(value)
  }

  // ?
  return ''
}

function point(point) {
  if (!point || typeof point !== 'object') {
    point = {}
  }

  return index(point.line) + ':' + index(point.column)
}

function position(pos) {
  if (!pos || typeof pos !== 'object') {
    pos = {}
  }

  return point(pos.start) + '-' + point(pos.end)
}

function index(value) {
  return value && typeof value === 'number' ? value : 1
}


/***/ }),

/***/ 9053:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var stringify = __webpack_require__(9158)

module.exports = VMessage

// Inherit from `Error#`.
function VMessagePrototype() {}
VMessagePrototype.prototype = Error.prototype
VMessage.prototype = new VMessagePrototype()

// Message properties.
var proto = VMessage.prototype

proto.file = ''
proto.name = ''
proto.reason = ''
proto.message = ''
proto.stack = ''
proto.fatal = null
proto.column = null
proto.line = null

// Construct a new VMessage.
//
// Note: We cannot invoke `Error` on the created context, as that adds readonly
// `line` and `column` attributes on Safari 9, thus throwing and failing the
// data.
function VMessage(reason, position, origin) {
  var parts
  var range
  var location

  if (typeof position === 'string') {
    origin = position
    position = null
  }

  parts = parseOrigin(origin)
  range = stringify(position) || '1:1'

  location = {
    start: {line: null, column: null},
    end: {line: null, column: null}
  }

  // Node.
  if (position && position.position) {
    position = position.position
  }

  if (position) {
    // Position.
    if (position.start) {
      location = position
      position = position.start
    } else {
      // Point.
      location.start = position
    }
  }

  if (reason.stack) {
    this.stack = reason.stack
    reason = reason.message
  }

  this.message = reason
  this.name = range
  this.reason = reason
  this.line = position ? position.line : null
  this.column = position ? position.column : null
  this.location = location
  this.source = parts[0]
  this.ruleId = parts[1]
}

function parseOrigin(origin) {
  var result = [null, null]
  var index

  if (typeof origin === 'string') {
    index = origin.indexOf(':')

    if (index === -1) {
      result[1] = origin
    } else {
      result[0] = origin.slice(0, index)
      result[1] = origin.slice(index + 1)
    }
  }

  return result
}


/***/ }),

/***/ 9566:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


module.exports = __webpack_require__(888)


/***/ }),

/***/ 5050:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var p = __webpack_require__(7688)
var proc = __webpack_require__(2702)
var buffer = __webpack_require__(8809)

module.exports = VFile

var own = {}.hasOwnProperty

// Order of setting (least specific to most), we need this because otherwise
// `{stem: 'a', path: '~/b.js'}` would throw, as a path is needed before a
// stem can be set.
var order = ['history', 'path', 'basename', 'stem', 'extname', 'dirname']

VFile.prototype.toString = toString

// Access full path (`~/index.min.js`).
Object.defineProperty(VFile.prototype, 'path', {get: getPath, set: setPath})

// Access parent path (`~`).
Object.defineProperty(VFile.prototype, 'dirname', {
  get: getDirname,
  set: setDirname
})

// Access basename (`index.min.js`).
Object.defineProperty(VFile.prototype, 'basename', {
  get: getBasename,
  set: setBasename
})

// Access extname (`.js`).
Object.defineProperty(VFile.prototype, 'extname', {
  get: getExtname,
  set: setExtname
})

// Access stem (`index.min`).
Object.defineProperty(VFile.prototype, 'stem', {get: getStem, set: setStem})

// Construct a new file.
function VFile(options) {
  var prop
  var index

  if (!options) {
    options = {}
  } else if (typeof options === 'string' || buffer(options)) {
    options = {contents: options}
  } else if ('message' in options && 'messages' in options) {
    return options
  }

  if (!(this instanceof VFile)) {
    return new VFile(options)
  }

  this.data = {}
  this.messages = []
  this.history = []
  this.cwd = proc.cwd()

  // Set path related properties in the correct order.
  index = -1

  while (++index < order.length) {
    prop = order[index]

    if (own.call(options, prop)) {
      this[prop] = options[prop]
    }
  }

  // Set non-path related properties.
  for (prop in options) {
    if (order.indexOf(prop) < 0) {
      this[prop] = options[prop]
    }
  }
}

function getPath() {
  return this.history[this.history.length - 1]
}

function setPath(path) {
  assertNonEmpty(path, 'path')

  if (this.path !== path) {
    this.history.push(path)
  }
}

function getDirname() {
  return typeof this.path === 'string' ? p.dirname(this.path) : undefined
}

function setDirname(dirname) {
  assertPath(this.path, 'dirname')
  this.path = p.join(dirname || '', this.basename)
}

function getBasename() {
  return typeof this.path === 'string' ? p.basename(this.path) : undefined
}

function setBasename(basename) {
  assertNonEmpty(basename, 'basename')
  assertPart(basename, 'basename')
  this.path = p.join(this.dirname || '', basename)
}

function getExtname() {
  return typeof this.path === 'string' ? p.extname(this.path) : undefined
}

function setExtname(extname) {
  assertPart(extname, 'extname')
  assertPath(this.path, 'extname')

  if (extname) {
    if (extname.charCodeAt(0) !== 46 /* `.` */) {
      throw new Error('`extname` must start with `.`')
    }

    if (extname.indexOf('.', 1) > -1) {
      throw new Error('`extname` cannot contain multiple dots')
    }
  }

  this.path = p.join(this.dirname, this.stem + (extname || ''))
}

function getStem() {
  return typeof this.path === 'string'
    ? p.basename(this.path, this.extname)
    : undefined
}

function setStem(stem) {
  assertNonEmpty(stem, 'stem')
  assertPart(stem, 'stem')
  this.path = p.join(this.dirname || '', stem + (this.extname || ''))
}

// Get the value of the file.
function toString(encoding) {
  return (this.contents || '').toString(encoding)
}

// Assert that `part` is not a path (i.e., does not contain `p.sep`).
function assertPart(part, name) {
  if (part && part.indexOf(p.sep) > -1) {
    throw new Error(
      '`' + name + '` cannot be a path: did not expect `' + p.sep + '`'
    )
  }
}

// Assert that `part` is not empty.
function assertNonEmpty(part, name) {
  if (!part) {
    throw new Error('`' + name + '` cannot be empty')
  }
}

// Assert `path` exists.
function assertPath(path, name) {
  if (!path) {
    throw new Error('Setting `' + name + '` requires `path` to be set too')
  }
}


/***/ }),

/***/ 888:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var VMessage = __webpack_require__(9053)
var VFile = __webpack_require__(5050)

module.exports = VFile

VFile.prototype.message = message
VFile.prototype.info = info
VFile.prototype.fail = fail

// Create a message with `reason` at `position`.
// When an error is passed in as `reason`, copies the stack.
function message(reason, position, origin) {
  var message = new VMessage(reason, position, origin)

  if (this.path) {
    message.name = this.path + ':' + message.name
    message.file = this.path
  }

  message.fatal = false

  this.messages.push(message)

  return message
}

// Fail: creates a vmessage, associates it with the file, and throws it.
function fail() {
  var message = this.message.apply(this, arguments)

  message.fatal = true

  throw message
}

// Info: creates a vmessage, associates it with the file, and marks the fatality
// as null.
function info() {
  var message = this.message.apply(this, arguments)

  message.fatal = null

  return message
}


/***/ }),

/***/ 7688:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


module.exports = __webpack_require__(5622)


/***/ }),

/***/ 2702:
/***/ ((module) => {

"use strict";


module.exports = process


/***/ }),

/***/ 5622:
/***/ ((module) => {

"use strict";
module.exports = require("path");

/***/ }),

/***/ 2148:
/***/ ((module) => {

"use strict";
module.exports = require("unist-util-visit");

/***/ }),

/***/ 1622:
/***/ ((module) => {

"use strict";
module.exports = JSON.parse('{"AEli":"Æ","AElig":"Æ","AM":"&","AMP":"&","Aacut":"Á","Aacute":"Á","Abreve":"Ă","Acir":"Â","Acirc":"Â","Acy":"А","Afr":"𝔄","Agrav":"À","Agrave":"À","Alpha":"Α","Amacr":"Ā","And":"⩓","Aogon":"Ą","Aopf":"𝔸","ApplyFunction":"⁡","Arin":"Å","Aring":"Å","Ascr":"𝒜","Assign":"≔","Atild":"Ã","Atilde":"Ã","Aum":"Ä","Auml":"Ä","Backslash":"∖","Barv":"⫧","Barwed":"⌆","Bcy":"Б","Because":"∵","Bernoullis":"ℬ","Beta":"Β","Bfr":"𝔅","Bopf":"𝔹","Breve":"˘","Bscr":"ℬ","Bumpeq":"≎","CHcy":"Ч","COP":"©","COPY":"©","Cacute":"Ć","Cap":"⋒","CapitalDifferentialD":"ⅅ","Cayleys":"ℭ","Ccaron":"Č","Ccedi":"Ç","Ccedil":"Ç","Ccirc":"Ĉ","Cconint":"∰","Cdot":"Ċ","Cedilla":"¸","CenterDot":"·","Cfr":"ℭ","Chi":"Χ","CircleDot":"⊙","CircleMinus":"⊖","CirclePlus":"⊕","CircleTimes":"⊗","ClockwiseContourIntegral":"∲","CloseCurlyDoubleQuote":"”","CloseCurlyQuote":"’","Colon":"∷","Colone":"⩴","Congruent":"≡","Conint":"∯","ContourIntegral":"∮","Copf":"ℂ","Coproduct":"∐","CounterClockwiseContourIntegral":"∳","Cross":"⨯","Cscr":"𝒞","Cup":"⋓","CupCap":"≍","DD":"ⅅ","DDotrahd":"⤑","DJcy":"Ђ","DScy":"Ѕ","DZcy":"Џ","Dagger":"‡","Darr":"↡","Dashv":"⫤","Dcaron":"Ď","Dcy":"Д","Del":"∇","Delta":"Δ","Dfr":"𝔇","DiacriticalAcute":"´","DiacriticalDot":"˙","DiacriticalDoubleAcute":"˝","DiacriticalGrave":"`","DiacriticalTilde":"˜","Diamond":"⋄","DifferentialD":"ⅆ","Dopf":"𝔻","Dot":"¨","DotDot":"⃜","DotEqual":"≐","DoubleContourIntegral":"∯","DoubleDot":"¨","DoubleDownArrow":"⇓","DoubleLeftArrow":"⇐","DoubleLeftRightArrow":"⇔","DoubleLeftTee":"⫤","DoubleLongLeftArrow":"⟸","DoubleLongLeftRightArrow":"⟺","DoubleLongRightArrow":"⟹","DoubleRightArrow":"⇒","DoubleRightTee":"⊨","DoubleUpArrow":"⇑","DoubleUpDownArrow":"⇕","DoubleVerticalBar":"∥","DownArrow":"↓","DownArrowBar":"⤓","DownArrowUpArrow":"⇵","DownBreve":"̑","DownLeftRightVector":"⥐","DownLeftTeeVector":"⥞","DownLeftVector":"↽","DownLeftVectorBar":"⥖","DownRightTeeVector":"⥟","DownRightVector":"⇁","DownRightVectorBar":"⥗","DownTee":"⊤","DownTeeArrow":"↧","Downarrow":"⇓","Dscr":"𝒟","Dstrok":"Đ","ENG":"Ŋ","ET":"Ð","ETH":"Ð","Eacut":"É","Eacute":"É","Ecaron":"Ě","Ecir":"Ê","Ecirc":"Ê","Ecy":"Э","Edot":"Ė","Efr":"𝔈","Egrav":"È","Egrave":"È","Element":"∈","Emacr":"Ē","EmptySmallSquare":"◻","EmptyVerySmallSquare":"▫","Eogon":"Ę","Eopf":"𝔼","Epsilon":"Ε","Equal":"⩵","EqualTilde":"≂","Equilibrium":"⇌","Escr":"ℰ","Esim":"⩳","Eta":"Η","Eum":"Ë","Euml":"Ë","Exists":"∃","ExponentialE":"ⅇ","Fcy":"Ф","Ffr":"𝔉","FilledSmallSquare":"◼","FilledVerySmallSquare":"▪","Fopf":"𝔽","ForAll":"∀","Fouriertrf":"ℱ","Fscr":"ℱ","GJcy":"Ѓ","G":">","GT":">","Gamma":"Γ","Gammad":"Ϝ","Gbreve":"Ğ","Gcedil":"Ģ","Gcirc":"Ĝ","Gcy":"Г","Gdot":"Ġ","Gfr":"𝔊","Gg":"⋙","Gopf":"𝔾","GreaterEqual":"≥","GreaterEqualLess":"⋛","GreaterFullEqual":"≧","GreaterGreater":"⪢","GreaterLess":"≷","GreaterSlantEqual":"⩾","GreaterTilde":"≳","Gscr":"𝒢","Gt":"≫","HARDcy":"Ъ","Hacek":"ˇ","Hat":"^","Hcirc":"Ĥ","Hfr":"ℌ","HilbertSpace":"ℋ","Hopf":"ℍ","HorizontalLine":"─","Hscr":"ℋ","Hstrok":"Ħ","HumpDownHump":"≎","HumpEqual":"≏","IEcy":"Е","IJlig":"Ĳ","IOcy":"Ё","Iacut":"Í","Iacute":"Í","Icir":"Î","Icirc":"Î","Icy":"И","Idot":"İ","Ifr":"ℑ","Igrav":"Ì","Igrave":"Ì","Im":"ℑ","Imacr":"Ī","ImaginaryI":"ⅈ","Implies":"⇒","Int":"∬","Integral":"∫","Intersection":"⋂","InvisibleComma":"⁣","InvisibleTimes":"⁢","Iogon":"Į","Iopf":"𝕀","Iota":"Ι","Iscr":"ℐ","Itilde":"Ĩ","Iukcy":"І","Ium":"Ï","Iuml":"Ï","Jcirc":"Ĵ","Jcy":"Й","Jfr":"𝔍","Jopf":"𝕁","Jscr":"𝒥","Jsercy":"Ј","Jukcy":"Є","KHcy":"Х","KJcy":"Ќ","Kappa":"Κ","Kcedil":"Ķ","Kcy":"К","Kfr":"𝔎","Kopf":"𝕂","Kscr":"𝒦","LJcy":"Љ","L":"<","LT":"<","Lacute":"Ĺ","Lambda":"Λ","Lang":"⟪","Laplacetrf":"ℒ","Larr":"↞","Lcaron":"Ľ","Lcedil":"Ļ","Lcy":"Л","LeftAngleBracket":"⟨","LeftArrow":"←","LeftArrowBar":"⇤","LeftArrowRightArrow":"⇆","LeftCeiling":"⌈","LeftDoubleBracket":"⟦","LeftDownTeeVector":"⥡","LeftDownVector":"⇃","LeftDownVectorBar":"⥙","LeftFloor":"⌊","LeftRightArrow":"↔","LeftRightVector":"⥎","LeftTee":"⊣","LeftTeeArrow":"↤","LeftTeeVector":"⥚","LeftTriangle":"⊲","LeftTriangleBar":"⧏","LeftTriangleEqual":"⊴","LeftUpDownVector":"⥑","LeftUpTeeVector":"⥠","LeftUpVector":"↿","LeftUpVectorBar":"⥘","LeftVector":"↼","LeftVectorBar":"⥒","Leftarrow":"⇐","Leftrightarrow":"⇔","LessEqualGreater":"⋚","LessFullEqual":"≦","LessGreater":"≶","LessLess":"⪡","LessSlantEqual":"⩽","LessTilde":"≲","Lfr":"𝔏","Ll":"⋘","Lleftarrow":"⇚","Lmidot":"Ŀ","LongLeftArrow":"⟵","LongLeftRightArrow":"⟷","LongRightArrow":"⟶","Longleftarrow":"⟸","Longleftrightarrow":"⟺","Longrightarrow":"⟹","Lopf":"𝕃","LowerLeftArrow":"↙","LowerRightArrow":"↘","Lscr":"ℒ","Lsh":"↰","Lstrok":"Ł","Lt":"≪","Map":"⤅","Mcy":"М","MediumSpace":" ","Mellintrf":"ℳ","Mfr":"𝔐","MinusPlus":"∓","Mopf":"𝕄","Mscr":"ℳ","Mu":"Μ","NJcy":"Њ","Nacute":"Ń","Ncaron":"Ň","Ncedil":"Ņ","Ncy":"Н","NegativeMediumSpace":"​","NegativeThickSpace":"​","NegativeThinSpace":"​","NegativeVeryThinSpace":"​","NestedGreaterGreater":"≫","NestedLessLess":"≪","NewLine":"\\n","Nfr":"𝔑","NoBreak":"⁠","NonBreakingSpace":" ","Nopf":"ℕ","Not":"⫬","NotCongruent":"≢","NotCupCap":"≭","NotDoubleVerticalBar":"∦","NotElement":"∉","NotEqual":"≠","NotEqualTilde":"≂̸","NotExists":"∄","NotGreater":"≯","NotGreaterEqual":"≱","NotGreaterFullEqual":"≧̸","NotGreaterGreater":"≫̸","NotGreaterLess":"≹","NotGreaterSlantEqual":"⩾̸","NotGreaterTilde":"≵","NotHumpDownHump":"≎̸","NotHumpEqual":"≏̸","NotLeftTriangle":"⋪","NotLeftTriangleBar":"⧏̸","NotLeftTriangleEqual":"⋬","NotLess":"≮","NotLessEqual":"≰","NotLessGreater":"≸","NotLessLess":"≪̸","NotLessSlantEqual":"⩽̸","NotLessTilde":"≴","NotNestedGreaterGreater":"⪢̸","NotNestedLessLess":"⪡̸","NotPrecedes":"⊀","NotPrecedesEqual":"⪯̸","NotPrecedesSlantEqual":"⋠","NotReverseElement":"∌","NotRightTriangle":"⋫","NotRightTriangleBar":"⧐̸","NotRightTriangleEqual":"⋭","NotSquareSubset":"⊏̸","NotSquareSubsetEqual":"⋢","NotSquareSuperset":"⊐̸","NotSquareSupersetEqual":"⋣","NotSubset":"⊂⃒","NotSubsetEqual":"⊈","NotSucceeds":"⊁","NotSucceedsEqual":"⪰̸","NotSucceedsSlantEqual":"⋡","NotSucceedsTilde":"≿̸","NotSuperset":"⊃⃒","NotSupersetEqual":"⊉","NotTilde":"≁","NotTildeEqual":"≄","NotTildeFullEqual":"≇","NotTildeTilde":"≉","NotVerticalBar":"∤","Nscr":"𝒩","Ntild":"Ñ","Ntilde":"Ñ","Nu":"Ν","OElig":"Œ","Oacut":"Ó","Oacute":"Ó","Ocir":"Ô","Ocirc":"Ô","Ocy":"О","Odblac":"Ő","Ofr":"𝔒","Ograv":"Ò","Ograve":"Ò","Omacr":"Ō","Omega":"Ω","Omicron":"Ο","Oopf":"𝕆","OpenCurlyDoubleQuote":"“","OpenCurlyQuote":"‘","Or":"⩔","Oscr":"𝒪","Oslas":"Ø","Oslash":"Ø","Otild":"Õ","Otilde":"Õ","Otimes":"⨷","Oum":"Ö","Ouml":"Ö","OverBar":"‾","OverBrace":"⏞","OverBracket":"⎴","OverParenthesis":"⏜","PartialD":"∂","Pcy":"П","Pfr":"𝔓","Phi":"Φ","Pi":"Π","PlusMinus":"±","Poincareplane":"ℌ","Popf":"ℙ","Pr":"⪻","Precedes":"≺","PrecedesEqual":"⪯","PrecedesSlantEqual":"≼","PrecedesTilde":"≾","Prime":"″","Product":"∏","Proportion":"∷","Proportional":"∝","Pscr":"𝒫","Psi":"Ψ","QUO":"\\"","QUOT":"\\"","Qfr":"𝔔","Qopf":"ℚ","Qscr":"𝒬","RBarr":"⤐","RE":"®","REG":"®","Racute":"Ŕ","Rang":"⟫","Rarr":"↠","Rarrtl":"⤖","Rcaron":"Ř","Rcedil":"Ŗ","Rcy":"Р","Re":"ℜ","ReverseElement":"∋","ReverseEquilibrium":"⇋","ReverseUpEquilibrium":"⥯","Rfr":"ℜ","Rho":"Ρ","RightAngleBracket":"⟩","RightArrow":"→","RightArrowBar":"⇥","RightArrowLeftArrow":"⇄","RightCeiling":"⌉","RightDoubleBracket":"⟧","RightDownTeeVector":"⥝","RightDownVector":"⇂","RightDownVectorBar":"⥕","RightFloor":"⌋","RightTee":"⊢","RightTeeArrow":"↦","RightTeeVector":"⥛","RightTriangle":"⊳","RightTriangleBar":"⧐","RightTriangleEqual":"⊵","RightUpDownVector":"⥏","RightUpTeeVector":"⥜","RightUpVector":"↾","RightUpVectorBar":"⥔","RightVector":"⇀","RightVectorBar":"⥓","Rightarrow":"⇒","Ropf":"ℝ","RoundImplies":"⥰","Rrightarrow":"⇛","Rscr":"ℛ","Rsh":"↱","RuleDelayed":"⧴","SHCHcy":"Щ","SHcy":"Ш","SOFTcy":"Ь","Sacute":"Ś","Sc":"⪼","Scaron":"Š","Scedil":"Ş","Scirc":"Ŝ","Scy":"С","Sfr":"𝔖","ShortDownArrow":"↓","ShortLeftArrow":"←","ShortRightArrow":"→","ShortUpArrow":"↑","Sigma":"Σ","SmallCircle":"∘","Sopf":"𝕊","Sqrt":"√","Square":"□","SquareIntersection":"⊓","SquareSubset":"⊏","SquareSubsetEqual":"⊑","SquareSuperset":"⊐","SquareSupersetEqual":"⊒","SquareUnion":"⊔","Sscr":"𝒮","Star":"⋆","Sub":"⋐","Subset":"⋐","SubsetEqual":"⊆","Succeeds":"≻","SucceedsEqual":"⪰","SucceedsSlantEqual":"≽","SucceedsTilde":"≿","SuchThat":"∋","Sum":"∑","Sup":"⋑","Superset":"⊃","SupersetEqual":"⊇","Supset":"⋑","THOR":"Þ","THORN":"Þ","TRADE":"™","TSHcy":"Ћ","TScy":"Ц","Tab":"\\t","Tau":"Τ","Tcaron":"Ť","Tcedil":"Ţ","Tcy":"Т","Tfr":"𝔗","Therefore":"∴","Theta":"Θ","ThickSpace":"  ","ThinSpace":" ","Tilde":"∼","TildeEqual":"≃","TildeFullEqual":"≅","TildeTilde":"≈","Topf":"𝕋","TripleDot":"⃛","Tscr":"𝒯","Tstrok":"Ŧ","Uacut":"Ú","Uacute":"Ú","Uarr":"↟","Uarrocir":"⥉","Ubrcy":"Ў","Ubreve":"Ŭ","Ucir":"Û","Ucirc":"Û","Ucy":"У","Udblac":"Ű","Ufr":"𝔘","Ugrav":"Ù","Ugrave":"Ù","Umacr":"Ū","UnderBar":"_","UnderBrace":"⏟","UnderBracket":"⎵","UnderParenthesis":"⏝","Union":"⋃","UnionPlus":"⊎","Uogon":"Ų","Uopf":"𝕌","UpArrow":"↑","UpArrowBar":"⤒","UpArrowDownArrow":"⇅","UpDownArrow":"↕","UpEquilibrium":"⥮","UpTee":"⊥","UpTeeArrow":"↥","Uparrow":"⇑","Updownarrow":"⇕","UpperLeftArrow":"↖","UpperRightArrow":"↗","Upsi":"ϒ","Upsilon":"Υ","Uring":"Ů","Uscr":"𝒰","Utilde":"Ũ","Uum":"Ü","Uuml":"Ü","VDash":"⊫","Vbar":"⫫","Vcy":"В","Vdash":"⊩","Vdashl":"⫦","Vee":"⋁","Verbar":"‖","Vert":"‖","VerticalBar":"∣","VerticalLine":"|","VerticalSeparator":"❘","VerticalTilde":"≀","VeryThinSpace":" ","Vfr":"𝔙","Vopf":"𝕍","Vscr":"𝒱","Vvdash":"⊪","Wcirc":"Ŵ","Wedge":"⋀","Wfr":"𝔚","Wopf":"𝕎","Wscr":"𝒲","Xfr":"𝔛","Xi":"Ξ","Xopf":"𝕏","Xscr":"𝒳","YAcy":"Я","YIcy":"Ї","YUcy":"Ю","Yacut":"Ý","Yacute":"Ý","Ycirc":"Ŷ","Ycy":"Ы","Yfr":"𝔜","Yopf":"𝕐","Yscr":"𝒴","Yuml":"Ÿ","ZHcy":"Ж","Zacute":"Ź","Zcaron":"Ž","Zcy":"З","Zdot":"Ż","ZeroWidthSpace":"​","Zeta":"Ζ","Zfr":"ℨ","Zopf":"ℤ","Zscr":"𝒵","aacut":"á","aacute":"á","abreve":"ă","ac":"∾","acE":"∾̳","acd":"∿","acir":"â","acirc":"â","acut":"´","acute":"´","acy":"а","aeli":"æ","aelig":"æ","af":"⁡","afr":"𝔞","agrav":"à","agrave":"à","alefsym":"ℵ","aleph":"ℵ","alpha":"α","amacr":"ā","amalg":"⨿","am":"&","amp":"&","and":"∧","andand":"⩕","andd":"⩜","andslope":"⩘","andv":"⩚","ang":"∠","ange":"⦤","angle":"∠","angmsd":"∡","angmsdaa":"⦨","angmsdab":"⦩","angmsdac":"⦪","angmsdad":"⦫","angmsdae":"⦬","angmsdaf":"⦭","angmsdag":"⦮","angmsdah":"⦯","angrt":"∟","angrtvb":"⊾","angrtvbd":"⦝","angsph":"∢","angst":"Å","angzarr":"⍼","aogon":"ą","aopf":"𝕒","ap":"≈","apE":"⩰","apacir":"⩯","ape":"≊","apid":"≋","apos":"\'","approx":"≈","approxeq":"≊","arin":"å","aring":"å","ascr":"𝒶","ast":"*","asymp":"≈","asympeq":"≍","atild":"ã","atilde":"ã","aum":"ä","auml":"ä","awconint":"∳","awint":"⨑","bNot":"⫭","backcong":"≌","backepsilon":"϶","backprime":"‵","backsim":"∽","backsimeq":"⋍","barvee":"⊽","barwed":"⌅","barwedge":"⌅","bbrk":"⎵","bbrktbrk":"⎶","bcong":"≌","bcy":"б","bdquo":"„","becaus":"∵","because":"∵","bemptyv":"⦰","bepsi":"϶","bernou":"ℬ","beta":"β","beth":"ℶ","between":"≬","bfr":"𝔟","bigcap":"⋂","bigcirc":"◯","bigcup":"⋃","bigodot":"⨀","bigoplus":"⨁","bigotimes":"⨂","bigsqcup":"⨆","bigstar":"★","bigtriangledown":"▽","bigtriangleup":"△","biguplus":"⨄","bigvee":"⋁","bigwedge":"⋀","bkarow":"⤍","blacklozenge":"⧫","blacksquare":"▪","blacktriangle":"▴","blacktriangledown":"▾","blacktriangleleft":"◂","blacktriangleright":"▸","blank":"␣","blk12":"▒","blk14":"░","blk34":"▓","block":"█","bne":"=⃥","bnequiv":"≡⃥","bnot":"⌐","bopf":"𝕓","bot":"⊥","bottom":"⊥","bowtie":"⋈","boxDL":"╗","boxDR":"╔","boxDl":"╖","boxDr":"╓","boxH":"═","boxHD":"╦","boxHU":"╩","boxHd":"╤","boxHu":"╧","boxUL":"╝","boxUR":"╚","boxUl":"╜","boxUr":"╙","boxV":"║","boxVH":"╬","boxVL":"╣","boxVR":"╠","boxVh":"╫","boxVl":"╢","boxVr":"╟","boxbox":"⧉","boxdL":"╕","boxdR":"╒","boxdl":"┐","boxdr":"┌","boxh":"─","boxhD":"╥","boxhU":"╨","boxhd":"┬","boxhu":"┴","boxminus":"⊟","boxplus":"⊞","boxtimes":"⊠","boxuL":"╛","boxuR":"╘","boxul":"┘","boxur":"└","boxv":"│","boxvH":"╪","boxvL":"╡","boxvR":"╞","boxvh":"┼","boxvl":"┤","boxvr":"├","bprime":"‵","breve":"˘","brvba":"¦","brvbar":"¦","bscr":"𝒷","bsemi":"⁏","bsim":"∽","bsime":"⋍","bsol":"\\\\","bsolb":"⧅","bsolhsub":"⟈","bull":"•","bullet":"•","bump":"≎","bumpE":"⪮","bumpe":"≏","bumpeq":"≏","cacute":"ć","cap":"∩","capand":"⩄","capbrcup":"⩉","capcap":"⩋","capcup":"⩇","capdot":"⩀","caps":"∩︀","caret":"⁁","caron":"ˇ","ccaps":"⩍","ccaron":"č","ccedi":"ç","ccedil":"ç","ccirc":"ĉ","ccups":"⩌","ccupssm":"⩐","cdot":"ċ","cedi":"¸","cedil":"¸","cemptyv":"⦲","cen":"¢","cent":"¢","centerdot":"·","cfr":"𝔠","chcy":"ч","check":"✓","checkmark":"✓","chi":"χ","cir":"○","cirE":"⧃","circ":"ˆ","circeq":"≗","circlearrowleft":"↺","circlearrowright":"↻","circledR":"®","circledS":"Ⓢ","circledast":"⊛","circledcirc":"⊚","circleddash":"⊝","cire":"≗","cirfnint":"⨐","cirmid":"⫯","cirscir":"⧂","clubs":"♣","clubsuit":"♣","colon":":","colone":"≔","coloneq":"≔","comma":",","commat":"@","comp":"∁","compfn":"∘","complement":"∁","complexes":"ℂ","cong":"≅","congdot":"⩭","conint":"∮","copf":"𝕔","coprod":"∐","cop":"©","copy":"©","copysr":"℗","crarr":"↵","cross":"✗","cscr":"𝒸","csub":"⫏","csube":"⫑","csup":"⫐","csupe":"⫒","ctdot":"⋯","cudarrl":"⤸","cudarrr":"⤵","cuepr":"⋞","cuesc":"⋟","cularr":"↶","cularrp":"⤽","cup":"∪","cupbrcap":"⩈","cupcap":"⩆","cupcup":"⩊","cupdot":"⊍","cupor":"⩅","cups":"∪︀","curarr":"↷","curarrm":"⤼","curlyeqprec":"⋞","curlyeqsucc":"⋟","curlyvee":"⋎","curlywedge":"⋏","curre":"¤","curren":"¤","curvearrowleft":"↶","curvearrowright":"↷","cuvee":"⋎","cuwed":"⋏","cwconint":"∲","cwint":"∱","cylcty":"⌭","dArr":"⇓","dHar":"⥥","dagger":"†","daleth":"ℸ","darr":"↓","dash":"‐","dashv":"⊣","dbkarow":"⤏","dblac":"˝","dcaron":"ď","dcy":"д","dd":"ⅆ","ddagger":"‡","ddarr":"⇊","ddotseq":"⩷","de":"°","deg":"°","delta":"δ","demptyv":"⦱","dfisht":"⥿","dfr":"𝔡","dharl":"⇃","dharr":"⇂","diam":"⋄","diamond":"⋄","diamondsuit":"♦","diams":"♦","die":"¨","digamma":"ϝ","disin":"⋲","div":"÷","divid":"÷","divide":"÷","divideontimes":"⋇","divonx":"⋇","djcy":"ђ","dlcorn":"⌞","dlcrop":"⌍","dollar":"$","dopf":"𝕕","dot":"˙","doteq":"≐","doteqdot":"≑","dotminus":"∸","dotplus":"∔","dotsquare":"⊡","doublebarwedge":"⌆","downarrow":"↓","downdownarrows":"⇊","downharpoonleft":"⇃","downharpoonright":"⇂","drbkarow":"⤐","drcorn":"⌟","drcrop":"⌌","dscr":"𝒹","dscy":"ѕ","dsol":"⧶","dstrok":"đ","dtdot":"⋱","dtri":"▿","dtrif":"▾","duarr":"⇵","duhar":"⥯","dwangle":"⦦","dzcy":"џ","dzigrarr":"⟿","eDDot":"⩷","eDot":"≑","eacut":"é","eacute":"é","easter":"⩮","ecaron":"ě","ecir":"ê","ecirc":"ê","ecolon":"≕","ecy":"э","edot":"ė","ee":"ⅇ","efDot":"≒","efr":"𝔢","eg":"⪚","egrav":"è","egrave":"è","egs":"⪖","egsdot":"⪘","el":"⪙","elinters":"⏧","ell":"ℓ","els":"⪕","elsdot":"⪗","emacr":"ē","empty":"∅","emptyset":"∅","emptyv":"∅","emsp13":" ","emsp14":" ","emsp":" ","eng":"ŋ","ensp":" ","eogon":"ę","eopf":"𝕖","epar":"⋕","eparsl":"⧣","eplus":"⩱","epsi":"ε","epsilon":"ε","epsiv":"ϵ","eqcirc":"≖","eqcolon":"≕","eqsim":"≂","eqslantgtr":"⪖","eqslantless":"⪕","equals":"=","equest":"≟","equiv":"≡","equivDD":"⩸","eqvparsl":"⧥","erDot":"≓","erarr":"⥱","escr":"ℯ","esdot":"≐","esim":"≂","eta":"η","et":"ð","eth":"ð","eum":"ë","euml":"ë","euro":"€","excl":"!","exist":"∃","expectation":"ℰ","exponentiale":"ⅇ","fallingdotseq":"≒","fcy":"ф","female":"♀","ffilig":"ﬃ","fflig":"ﬀ","ffllig":"ﬄ","ffr":"𝔣","filig":"ﬁ","fjlig":"fj","flat":"♭","fllig":"ﬂ","fltns":"▱","fnof":"ƒ","fopf":"𝕗","forall":"∀","fork":"⋔","forkv":"⫙","fpartint":"⨍","frac1":"¼","frac12":"½","frac13":"⅓","frac14":"¼","frac15":"⅕","frac16":"⅙","frac18":"⅛","frac23":"⅔","frac25":"⅖","frac3":"¾","frac34":"¾","frac35":"⅗","frac38":"⅜","frac45":"⅘","frac56":"⅚","frac58":"⅝","frac78":"⅞","frasl":"⁄","frown":"⌢","fscr":"𝒻","gE":"≧","gEl":"⪌","gacute":"ǵ","gamma":"γ","gammad":"ϝ","gap":"⪆","gbreve":"ğ","gcirc":"ĝ","gcy":"г","gdot":"ġ","ge":"≥","gel":"⋛","geq":"≥","geqq":"≧","geqslant":"⩾","ges":"⩾","gescc":"⪩","gesdot":"⪀","gesdoto":"⪂","gesdotol":"⪄","gesl":"⋛︀","gesles":"⪔","gfr":"𝔤","gg":"≫","ggg":"⋙","gimel":"ℷ","gjcy":"ѓ","gl":"≷","glE":"⪒","gla":"⪥","glj":"⪤","gnE":"≩","gnap":"⪊","gnapprox":"⪊","gne":"⪈","gneq":"⪈","gneqq":"≩","gnsim":"⋧","gopf":"𝕘","grave":"`","gscr":"ℊ","gsim":"≳","gsime":"⪎","gsiml":"⪐","g":">","gt":">","gtcc":"⪧","gtcir":"⩺","gtdot":"⋗","gtlPar":"⦕","gtquest":"⩼","gtrapprox":"⪆","gtrarr":"⥸","gtrdot":"⋗","gtreqless":"⋛","gtreqqless":"⪌","gtrless":"≷","gtrsim":"≳","gvertneqq":"≩︀","gvnE":"≩︀","hArr":"⇔","hairsp":" ","half":"½","hamilt":"ℋ","hardcy":"ъ","harr":"↔","harrcir":"⥈","harrw":"↭","hbar":"ℏ","hcirc":"ĥ","hearts":"♥","heartsuit":"♥","hellip":"…","hercon":"⊹","hfr":"𝔥","hksearow":"⤥","hkswarow":"⤦","hoarr":"⇿","homtht":"∻","hookleftarrow":"↩","hookrightarrow":"↪","hopf":"𝕙","horbar":"―","hscr":"𝒽","hslash":"ℏ","hstrok":"ħ","hybull":"⁃","hyphen":"‐","iacut":"í","iacute":"í","ic":"⁣","icir":"î","icirc":"î","icy":"и","iecy":"е","iexc":"¡","iexcl":"¡","iff":"⇔","ifr":"𝔦","igrav":"ì","igrave":"ì","ii":"ⅈ","iiiint":"⨌","iiint":"∭","iinfin":"⧜","iiota":"℩","ijlig":"ĳ","imacr":"ī","image":"ℑ","imagline":"ℐ","imagpart":"ℑ","imath":"ı","imof":"⊷","imped":"Ƶ","in":"∈","incare":"℅","infin":"∞","infintie":"⧝","inodot":"ı","int":"∫","intcal":"⊺","integers":"ℤ","intercal":"⊺","intlarhk":"⨗","intprod":"⨼","iocy":"ё","iogon":"į","iopf":"𝕚","iota":"ι","iprod":"⨼","iques":"¿","iquest":"¿","iscr":"𝒾","isin":"∈","isinE":"⋹","isindot":"⋵","isins":"⋴","isinsv":"⋳","isinv":"∈","it":"⁢","itilde":"ĩ","iukcy":"і","ium":"ï","iuml":"ï","jcirc":"ĵ","jcy":"й","jfr":"𝔧","jmath":"ȷ","jopf":"𝕛","jscr":"𝒿","jsercy":"ј","jukcy":"є","kappa":"κ","kappav":"ϰ","kcedil":"ķ","kcy":"к","kfr":"𝔨","kgreen":"ĸ","khcy":"х","kjcy":"ќ","kopf":"𝕜","kscr":"𝓀","lAarr":"⇚","lArr":"⇐","lAtail":"⤛","lBarr":"⤎","lE":"≦","lEg":"⪋","lHar":"⥢","lacute":"ĺ","laemptyv":"⦴","lagran":"ℒ","lambda":"λ","lang":"⟨","langd":"⦑","langle":"⟨","lap":"⪅","laqu":"«","laquo":"«","larr":"←","larrb":"⇤","larrbfs":"⤟","larrfs":"⤝","larrhk":"↩","larrlp":"↫","larrpl":"⤹","larrsim":"⥳","larrtl":"↢","lat":"⪫","latail":"⤙","late":"⪭","lates":"⪭︀","lbarr":"⤌","lbbrk":"❲","lbrace":"{","lbrack":"[","lbrke":"⦋","lbrksld":"⦏","lbrkslu":"⦍","lcaron":"ľ","lcedil":"ļ","lceil":"⌈","lcub":"{","lcy":"л","ldca":"⤶","ldquo":"“","ldquor":"„","ldrdhar":"⥧","ldrushar":"⥋","ldsh":"↲","le":"≤","leftarrow":"←","leftarrowtail":"↢","leftharpoondown":"↽","leftharpoonup":"↼","leftleftarrows":"⇇","leftrightarrow":"↔","leftrightarrows":"⇆","leftrightharpoons":"⇋","leftrightsquigarrow":"↭","leftthreetimes":"⋋","leg":"⋚","leq":"≤","leqq":"≦","leqslant":"⩽","les":"⩽","lescc":"⪨","lesdot":"⩿","lesdoto":"⪁","lesdotor":"⪃","lesg":"⋚︀","lesges":"⪓","lessapprox":"⪅","lessdot":"⋖","lesseqgtr":"⋚","lesseqqgtr":"⪋","lessgtr":"≶","lesssim":"≲","lfisht":"⥼","lfloor":"⌊","lfr":"𝔩","lg":"≶","lgE":"⪑","lhard":"↽","lharu":"↼","lharul":"⥪","lhblk":"▄","ljcy":"љ","ll":"≪","llarr":"⇇","llcorner":"⌞","llhard":"⥫","lltri":"◺","lmidot":"ŀ","lmoust":"⎰","lmoustache":"⎰","lnE":"≨","lnap":"⪉","lnapprox":"⪉","lne":"⪇","lneq":"⪇","lneqq":"≨","lnsim":"⋦","loang":"⟬","loarr":"⇽","lobrk":"⟦","longleftarrow":"⟵","longleftrightarrow":"⟷","longmapsto":"⟼","longrightarrow":"⟶","looparrowleft":"↫","looparrowright":"↬","lopar":"⦅","lopf":"𝕝","loplus":"⨭","lotimes":"⨴","lowast":"∗","lowbar":"_","loz":"◊","lozenge":"◊","lozf":"⧫","lpar":"(","lparlt":"⦓","lrarr":"⇆","lrcorner":"⌟","lrhar":"⇋","lrhard":"⥭","lrm":"‎","lrtri":"⊿","lsaquo":"‹","lscr":"𝓁","lsh":"↰","lsim":"≲","lsime":"⪍","lsimg":"⪏","lsqb":"[","lsquo":"‘","lsquor":"‚","lstrok":"ł","l":"<","lt":"<","ltcc":"⪦","ltcir":"⩹","ltdot":"⋖","lthree":"⋋","ltimes":"⋉","ltlarr":"⥶","ltquest":"⩻","ltrPar":"⦖","ltri":"◃","ltrie":"⊴","ltrif":"◂","lurdshar":"⥊","luruhar":"⥦","lvertneqq":"≨︀","lvnE":"≨︀","mDDot":"∺","mac":"¯","macr":"¯","male":"♂","malt":"✠","maltese":"✠","map":"↦","mapsto":"↦","mapstodown":"↧","mapstoleft":"↤","mapstoup":"↥","marker":"▮","mcomma":"⨩","mcy":"м","mdash":"—","measuredangle":"∡","mfr":"𝔪","mho":"℧","micr":"µ","micro":"µ","mid":"∣","midast":"*","midcir":"⫰","middo":"·","middot":"·","minus":"−","minusb":"⊟","minusd":"∸","minusdu":"⨪","mlcp":"⫛","mldr":"…","mnplus":"∓","models":"⊧","mopf":"𝕞","mp":"∓","mscr":"𝓂","mstpos":"∾","mu":"μ","multimap":"⊸","mumap":"⊸","nGg":"⋙̸","nGt":"≫⃒","nGtv":"≫̸","nLeftarrow":"⇍","nLeftrightarrow":"⇎","nLl":"⋘̸","nLt":"≪⃒","nLtv":"≪̸","nRightarrow":"⇏","nVDash":"⊯","nVdash":"⊮","nabla":"∇","nacute":"ń","nang":"∠⃒","nap":"≉","napE":"⩰̸","napid":"≋̸","napos":"ŉ","napprox":"≉","natur":"♮","natural":"♮","naturals":"ℕ","nbs":" ","nbsp":" ","nbump":"≎̸","nbumpe":"≏̸","ncap":"⩃","ncaron":"ň","ncedil":"ņ","ncong":"≇","ncongdot":"⩭̸","ncup":"⩂","ncy":"н","ndash":"–","ne":"≠","neArr":"⇗","nearhk":"⤤","nearr":"↗","nearrow":"↗","nedot":"≐̸","nequiv":"≢","nesear":"⤨","nesim":"≂̸","nexist":"∄","nexists":"∄","nfr":"𝔫","ngE":"≧̸","nge":"≱","ngeq":"≱","ngeqq":"≧̸","ngeqslant":"⩾̸","nges":"⩾̸","ngsim":"≵","ngt":"≯","ngtr":"≯","nhArr":"⇎","nharr":"↮","nhpar":"⫲","ni":"∋","nis":"⋼","nisd":"⋺","niv":"∋","njcy":"њ","nlArr":"⇍","nlE":"≦̸","nlarr":"↚","nldr":"‥","nle":"≰","nleftarrow":"↚","nleftrightarrow":"↮","nleq":"≰","nleqq":"≦̸","nleqslant":"⩽̸","nles":"⩽̸","nless":"≮","nlsim":"≴","nlt":"≮","nltri":"⋪","nltrie":"⋬","nmid":"∤","nopf":"𝕟","no":"¬","not":"¬","notin":"∉","notinE":"⋹̸","notindot":"⋵̸","notinva":"∉","notinvb":"⋷","notinvc":"⋶","notni":"∌","notniva":"∌","notnivb":"⋾","notnivc":"⋽","npar":"∦","nparallel":"∦","nparsl":"⫽⃥","npart":"∂̸","npolint":"⨔","npr":"⊀","nprcue":"⋠","npre":"⪯̸","nprec":"⊀","npreceq":"⪯̸","nrArr":"⇏","nrarr":"↛","nrarrc":"⤳̸","nrarrw":"↝̸","nrightarrow":"↛","nrtri":"⋫","nrtrie":"⋭","nsc":"⊁","nsccue":"⋡","nsce":"⪰̸","nscr":"𝓃","nshortmid":"∤","nshortparallel":"∦","nsim":"≁","nsime":"≄","nsimeq":"≄","nsmid":"∤","nspar":"∦","nsqsube":"⋢","nsqsupe":"⋣","nsub":"⊄","nsubE":"⫅̸","nsube":"⊈","nsubset":"⊂⃒","nsubseteq":"⊈","nsubseteqq":"⫅̸","nsucc":"⊁","nsucceq":"⪰̸","nsup":"⊅","nsupE":"⫆̸","nsupe":"⊉","nsupset":"⊃⃒","nsupseteq":"⊉","nsupseteqq":"⫆̸","ntgl":"≹","ntild":"ñ","ntilde":"ñ","ntlg":"≸","ntriangleleft":"⋪","ntrianglelefteq":"⋬","ntriangleright":"⋫","ntrianglerighteq":"⋭","nu":"ν","num":"#","numero":"№","numsp":" ","nvDash":"⊭","nvHarr":"⤄","nvap":"≍⃒","nvdash":"⊬","nvge":"≥⃒","nvgt":">⃒","nvinfin":"⧞","nvlArr":"⤂","nvle":"≤⃒","nvlt":"<⃒","nvltrie":"⊴⃒","nvrArr":"⤃","nvrtrie":"⊵⃒","nvsim":"∼⃒","nwArr":"⇖","nwarhk":"⤣","nwarr":"↖","nwarrow":"↖","nwnear":"⤧","oS":"Ⓢ","oacut":"ó","oacute":"ó","oast":"⊛","ocir":"ô","ocirc":"ô","ocy":"о","odash":"⊝","odblac":"ő","odiv":"⨸","odot":"⊙","odsold":"⦼","oelig":"œ","ofcir":"⦿","ofr":"𝔬","ogon":"˛","ograv":"ò","ograve":"ò","ogt":"⧁","ohbar":"⦵","ohm":"Ω","oint":"∮","olarr":"↺","olcir":"⦾","olcross":"⦻","oline":"‾","olt":"⧀","omacr":"ō","omega":"ω","omicron":"ο","omid":"⦶","ominus":"⊖","oopf":"𝕠","opar":"⦷","operp":"⦹","oplus":"⊕","or":"∨","orarr":"↻","ord":"º","order":"ℴ","orderof":"ℴ","ordf":"ª","ordm":"º","origof":"⊶","oror":"⩖","orslope":"⩗","orv":"⩛","oscr":"ℴ","oslas":"ø","oslash":"ø","osol":"⊘","otild":"õ","otilde":"õ","otimes":"⊗","otimesas":"⨶","oum":"ö","ouml":"ö","ovbar":"⌽","par":"¶","para":"¶","parallel":"∥","parsim":"⫳","parsl":"⫽","part":"∂","pcy":"п","percnt":"%","period":".","permil":"‰","perp":"⊥","pertenk":"‱","pfr":"𝔭","phi":"φ","phiv":"ϕ","phmmat":"ℳ","phone":"☎","pi":"π","pitchfork":"⋔","piv":"ϖ","planck":"ℏ","planckh":"ℎ","plankv":"ℏ","plus":"+","plusacir":"⨣","plusb":"⊞","pluscir":"⨢","plusdo":"∔","plusdu":"⨥","pluse":"⩲","plusm":"±","plusmn":"±","plussim":"⨦","plustwo":"⨧","pm":"±","pointint":"⨕","popf":"𝕡","poun":"£","pound":"£","pr":"≺","prE":"⪳","prap":"⪷","prcue":"≼","pre":"⪯","prec":"≺","precapprox":"⪷","preccurlyeq":"≼","preceq":"⪯","precnapprox":"⪹","precneqq":"⪵","precnsim":"⋨","precsim":"≾","prime":"′","primes":"ℙ","prnE":"⪵","prnap":"⪹","prnsim":"⋨","prod":"∏","profalar":"⌮","profline":"⌒","profsurf":"⌓","prop":"∝","propto":"∝","prsim":"≾","prurel":"⊰","pscr":"𝓅","psi":"ψ","puncsp":" ","qfr":"𝔮","qint":"⨌","qopf":"𝕢","qprime":"⁗","qscr":"𝓆","quaternions":"ℍ","quatint":"⨖","quest":"?","questeq":"≟","quo":"\\"","quot":"\\"","rAarr":"⇛","rArr":"⇒","rAtail":"⤜","rBarr":"⤏","rHar":"⥤","race":"∽̱","racute":"ŕ","radic":"√","raemptyv":"⦳","rang":"⟩","rangd":"⦒","range":"⦥","rangle":"⟩","raqu":"»","raquo":"»","rarr":"→","rarrap":"⥵","rarrb":"⇥","rarrbfs":"⤠","rarrc":"⤳","rarrfs":"⤞","rarrhk":"↪","rarrlp":"↬","rarrpl":"⥅","rarrsim":"⥴","rarrtl":"↣","rarrw":"↝","ratail":"⤚","ratio":"∶","rationals":"ℚ","rbarr":"⤍","rbbrk":"❳","rbrace":"}","rbrack":"]","rbrke":"⦌","rbrksld":"⦎","rbrkslu":"⦐","rcaron":"ř","rcedil":"ŗ","rceil":"⌉","rcub":"}","rcy":"р","rdca":"⤷","rdldhar":"⥩","rdquo":"”","rdquor":"”","rdsh":"↳","real":"ℜ","realine":"ℛ","realpart":"ℜ","reals":"ℝ","rect":"▭","re":"®","reg":"®","rfisht":"⥽","rfloor":"⌋","rfr":"𝔯","rhard":"⇁","rharu":"⇀","rharul":"⥬","rho":"ρ","rhov":"ϱ","rightarrow":"→","rightarrowtail":"↣","rightharpoondown":"⇁","rightharpoonup":"⇀","rightleftarrows":"⇄","rightleftharpoons":"⇌","rightrightarrows":"⇉","rightsquigarrow":"↝","rightthreetimes":"⋌","ring":"˚","risingdotseq":"≓","rlarr":"⇄","rlhar":"⇌","rlm":"‏","rmoust":"⎱","rmoustache":"⎱","rnmid":"⫮","roang":"⟭","roarr":"⇾","robrk":"⟧","ropar":"⦆","ropf":"𝕣","roplus":"⨮","rotimes":"⨵","rpar":")","rpargt":"⦔","rppolint":"⨒","rrarr":"⇉","rsaquo":"›","rscr":"𝓇","rsh":"↱","rsqb":"]","rsquo":"’","rsquor":"’","rthree":"⋌","rtimes":"⋊","rtri":"▹","rtrie":"⊵","rtrif":"▸","rtriltri":"⧎","ruluhar":"⥨","rx":"℞","sacute":"ś","sbquo":"‚","sc":"≻","scE":"⪴","scap":"⪸","scaron":"š","sccue":"≽","sce":"⪰","scedil":"ş","scirc":"ŝ","scnE":"⪶","scnap":"⪺","scnsim":"⋩","scpolint":"⨓","scsim":"≿","scy":"с","sdot":"⋅","sdotb":"⊡","sdote":"⩦","seArr":"⇘","searhk":"⤥","searr":"↘","searrow":"↘","sec":"§","sect":"§","semi":";","seswar":"⤩","setminus":"∖","setmn":"∖","sext":"✶","sfr":"𝔰","sfrown":"⌢","sharp":"♯","shchcy":"щ","shcy":"ш","shortmid":"∣","shortparallel":"∥","sh":"­","shy":"­","sigma":"σ","sigmaf":"ς","sigmav":"ς","sim":"∼","simdot":"⩪","sime":"≃","simeq":"≃","simg":"⪞","simgE":"⪠","siml":"⪝","simlE":"⪟","simne":"≆","simplus":"⨤","simrarr":"⥲","slarr":"←","smallsetminus":"∖","smashp":"⨳","smeparsl":"⧤","smid":"∣","smile":"⌣","smt":"⪪","smte":"⪬","smtes":"⪬︀","softcy":"ь","sol":"/","solb":"⧄","solbar":"⌿","sopf":"𝕤","spades":"♠","spadesuit":"♠","spar":"∥","sqcap":"⊓","sqcaps":"⊓︀","sqcup":"⊔","sqcups":"⊔︀","sqsub":"⊏","sqsube":"⊑","sqsubset":"⊏","sqsubseteq":"⊑","sqsup":"⊐","sqsupe":"⊒","sqsupset":"⊐","sqsupseteq":"⊒","squ":"□","square":"□","squarf":"▪","squf":"▪","srarr":"→","sscr":"𝓈","ssetmn":"∖","ssmile":"⌣","sstarf":"⋆","star":"☆","starf":"★","straightepsilon":"ϵ","straightphi":"ϕ","strns":"¯","sub":"⊂","subE":"⫅","subdot":"⪽","sube":"⊆","subedot":"⫃","submult":"⫁","subnE":"⫋","subne":"⊊","subplus":"⪿","subrarr":"⥹","subset":"⊂","subseteq":"⊆","subseteqq":"⫅","subsetneq":"⊊","subsetneqq":"⫋","subsim":"⫇","subsub":"⫕","subsup":"⫓","succ":"≻","succapprox":"⪸","succcurlyeq":"≽","succeq":"⪰","succnapprox":"⪺","succneqq":"⪶","succnsim":"⋩","succsim":"≿","sum":"∑","sung":"♪","sup":"⊃","sup1":"¹","sup2":"²","sup3":"³","supE":"⫆","supdot":"⪾","supdsub":"⫘","supe":"⊇","supedot":"⫄","suphsol":"⟉","suphsub":"⫗","suplarr":"⥻","supmult":"⫂","supnE":"⫌","supne":"⊋","supplus":"⫀","supset":"⊃","supseteq":"⊇","supseteqq":"⫆","supsetneq":"⊋","supsetneqq":"⫌","supsim":"⫈","supsub":"⫔","supsup":"⫖","swArr":"⇙","swarhk":"⤦","swarr":"↙","swarrow":"↙","swnwar":"⤪","szli":"ß","szlig":"ß","target":"⌖","tau":"τ","tbrk":"⎴","tcaron":"ť","tcedil":"ţ","tcy":"т","tdot":"⃛","telrec":"⌕","tfr":"𝔱","there4":"∴","therefore":"∴","theta":"θ","thetasym":"ϑ","thetav":"ϑ","thickapprox":"≈","thicksim":"∼","thinsp":" ","thkap":"≈","thksim":"∼","thor":"þ","thorn":"þ","tilde":"˜","time":"×","times":"×","timesb":"⊠","timesbar":"⨱","timesd":"⨰","tint":"∭","toea":"⤨","top":"⊤","topbot":"⌶","topcir":"⫱","topf":"𝕥","topfork":"⫚","tosa":"⤩","tprime":"‴","trade":"™","triangle":"▵","triangledown":"▿","triangleleft":"◃","trianglelefteq":"⊴","triangleq":"≜","triangleright":"▹","trianglerighteq":"⊵","tridot":"◬","trie":"≜","triminus":"⨺","triplus":"⨹","trisb":"⧍","tritime":"⨻","trpezium":"⏢","tscr":"𝓉","tscy":"ц","tshcy":"ћ","tstrok":"ŧ","twixt":"≬","twoheadleftarrow":"↞","twoheadrightarrow":"↠","uArr":"⇑","uHar":"⥣","uacut":"ú","uacute":"ú","uarr":"↑","ubrcy":"ў","ubreve":"ŭ","ucir":"û","ucirc":"û","ucy":"у","udarr":"⇅","udblac":"ű","udhar":"⥮","ufisht":"⥾","ufr":"𝔲","ugrav":"ù","ugrave":"ù","uharl":"↿","uharr":"↾","uhblk":"▀","ulcorn":"⌜","ulcorner":"⌜","ulcrop":"⌏","ultri":"◸","umacr":"ū","um":"¨","uml":"¨","uogon":"ų","uopf":"𝕦","uparrow":"↑","updownarrow":"↕","upharpoonleft":"↿","upharpoonright":"↾","uplus":"⊎","upsi":"υ","upsih":"ϒ","upsilon":"υ","upuparrows":"⇈","urcorn":"⌝","urcorner":"⌝","urcrop":"⌎","uring":"ů","urtri":"◹","uscr":"𝓊","utdot":"⋰","utilde":"ũ","utri":"▵","utrif":"▴","uuarr":"⇈","uum":"ü","uuml":"ü","uwangle":"⦧","vArr":"⇕","vBar":"⫨","vBarv":"⫩","vDash":"⊨","vangrt":"⦜","varepsilon":"ϵ","varkappa":"ϰ","varnothing":"∅","varphi":"ϕ","varpi":"ϖ","varpropto":"∝","varr":"↕","varrho":"ϱ","varsigma":"ς","varsubsetneq":"⊊︀","varsubsetneqq":"⫋︀","varsupsetneq":"⊋︀","varsupsetneqq":"⫌︀","vartheta":"ϑ","vartriangleleft":"⊲","vartriangleright":"⊳","vcy":"в","vdash":"⊢","vee":"∨","veebar":"⊻","veeeq":"≚","vellip":"⋮","verbar":"|","vert":"|","vfr":"𝔳","vltri":"⊲","vnsub":"⊂⃒","vnsup":"⊃⃒","vopf":"𝕧","vprop":"∝","vrtri":"⊳","vscr":"𝓋","vsubnE":"⫋︀","vsubne":"⊊︀","vsupnE":"⫌︀","vsupne":"⊋︀","vzigzag":"⦚","wcirc":"ŵ","wedbar":"⩟","wedge":"∧","wedgeq":"≙","weierp":"℘","wfr":"𝔴","wopf":"𝕨","wp":"℘","wr":"≀","wreath":"≀","wscr":"𝓌","xcap":"⋂","xcirc":"◯","xcup":"⋃","xdtri":"▽","xfr":"𝔵","xhArr":"⟺","xharr":"⟷","xi":"ξ","xlArr":"⟸","xlarr":"⟵","xmap":"⟼","xnis":"⋻","xodot":"⨀","xopf":"𝕩","xoplus":"⨁","xotime":"⨂","xrArr":"⟹","xrarr":"⟶","xscr":"𝓍","xsqcup":"⨆","xuplus":"⨄","xutri":"△","xvee":"⋁","xwedge":"⋀","yacut":"ý","yacute":"ý","yacy":"я","ycirc":"ŷ","ycy":"ы","ye":"¥","yen":"¥","yfr":"𝔶","yicy":"ї","yopf":"𝕪","yscr":"𝓎","yucy":"ю","yum":"ÿ","yuml":"ÿ","zacute":"ź","zcaron":"ž","zcy":"з","zdot":"ż","zeetrf":"ℨ","zeta":"ζ","zfr":"𝔷","zhcy":"ж","zigrarr":"⇝","zopf":"𝕫","zscr":"𝓏","zwj":"‍","zwnj":"‌"}');

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";

// UNUSED EXPORTS: rMarkdown

// EXTERNAL MODULE: external "path"
var external_path_ = __webpack_require__(5622);
;// CONCATENATED MODULE: external "chalk"
const external_chalk_namespaceObject = require("chalk");
// EXTERNAL MODULE: ../node_modules/vfile/index.js
var vfile = __webpack_require__(9566);
;// CONCATENATED MODULE: external "rehype-raw"
const external_rehype_raw_namespaceObject = require("rehype-raw");
;// CONCATENATED MODULE: external "remark-rehype"
const external_remark_rehype_namespaceObject = require("remark-rehype");
// EXTERNAL MODULE: ../node_modules/unified/index.js
var node_modules_unified = __webpack_require__(4338);
var unified_default = /*#__PURE__*/__webpack_require__.n(node_modules_unified);
;// CONCATENATED MODULE: external "mime/lite"
const lite_namespaceObject = require("mime/lite");
;// CONCATENATED MODULE: external "node-fetch"
const external_node_fetch_namespaceObject = require("node-fetch");
// EXTERNAL MODULE: external "unist-util-visit"
var external_unist_util_visit_ = __webpack_require__(2148);
;// CONCATENATED MODULE: external "rehype-parse"
const external_rehype_parse_namespaceObject = require("rehype-parse");
var external_rehype_parse_default = /*#__PURE__*/__webpack_require__.n(external_rehype_parse_namespaceObject);
;// CONCATENATED MODULE: external "rehype-stringify"
const external_rehype_stringify_namespaceObject = require("rehype-stringify");
var external_rehype_stringify_default = /*#__PURE__*/__webpack_require__.n(external_rehype_stringify_namespaceObject);
;// CONCATENATED MODULE: external "sandboxed-module"
const external_sandboxed_module_namespaceObject = require("sandboxed-module");
var external_sandboxed_module_default = /*#__PURE__*/__webpack_require__.n(external_sandboxed_module_namespaceObject);
;// CONCATENATED MODULE: external "svgo"
const external_svgo_namespaceObject = require("svgo");
// EXTERNAL MODULE: ./src/pdf/domstubs.js
var domstubs = __webpack_require__(2937);
;// CONCATENATED MODULE: ./src/pdf/pdf-to-svg.ts





 // @ts-expect-error

 // inject globals into pdf.js in a non-leaky way

const pdfjsLib = external_sandboxed_module_default().require('pdfjs-dist/legacy/build/pdf', {
  globals: {
    document: domstubs.document,
    Image: domstubs.Image,
    Element: domstubs.Element,
    console,
    process,
    URL
  }
});

async function pdf_to_svg_pdfToSvg(filePath) {
  const doc = await pdfjsLib.getDocument({
    url: filePath,
    fontExtraProperties: true,
    verbosity: 0 // cMapUrl: '../node_modules/pdfjs-dist/cmaps/',
    // cMapPacked: true,

  }).promise; // may come in handy again...
  // const metadata = await doc.getMetadata();
  // if (!isPdfTexDocument(metadata.info)) {
  //   throw new Error('Unhandled pdf file: was not produced by PdfTeX');
  // }

  const page = await doc.getPage(1);
  const opList = await page.getOperatorList();
  const viewport = page.getViewport({
    scale: 1.0
  });
  const svgGfx = new pdfjsLib.SVGGraphics(page.commonObjs, page.objs);
  svgGfx.embedFonts = true;
  const svg = await svgGfx.getSVG(opList, viewport);
  const result = await formatSvg(svg.toString());
  return result;
} // function isPdfTexDocument(info: Record<string, string> = {}) {
//   return info['Producer']?.startsWith('pdfTeX');
// }

async function formatSvg(_str) {
  const str = _str.replace(/svg:/g, '');

  const optimised = optimize(str, {
    multipass: true
  }).data;
  const processor = unified().use(rehype, {
    fragment: true
  }).use(addWrapper).use(stringify);
  const parsed = processor.parse(optimised);
  const transformed = await processor.run(parsed);
  return transformed.children[0];
}

function addWrapper() {
  return tree => {
    visit(tree, 'element', node => {
      if (node.tagName === 'svg') {
        const properties = node.properties || {};
        node.properties = {
          // width: properties.width,
          // height: properties.height,
          viewBox: getViewBox(properties),
          className: 'pdftex'
        };
      }
    });
  };
}

function getViewBox(properties) {
  if (properties.viewBox) {
    return properties.viewBox;
  }

  return `0 0 ${properties.width} ${properties.height}`;
}
;// CONCATENATED MODULE: external "hash-sum"
const external_hash_sum_namespaceObject = require("hash-sum");
;// CONCATENATED MODULE: external "fs"
const external_fs_namespaceObject = require("fs");
;// CONCATENATED MODULE: ./src/utils/utils.ts





// import visit from 'unist-util-visit';
const utils_rehypeParser = unified_default()().use((external_rehype_parse_default()), {
  fragment: true
}).use((external_rehype_stringify_default()));
function utils_readFile(filePath, encoding = 'utf-8') {
  return fs.promises.readFile(filePath, encoding);
}
function utils_writeFile(filePath, contents) {
  return fs.promises.writeFile(filePath, contents);
}
async function utils_checkLocalFileExists(filePath) {
  try {
    await fs.promises.access(filePath, fs.constants.F_OK);
    return true;
  } catch (err) {
    return false;
  }
}
async function utils_rmFile(filePath) {
  return fs.promises.unlink(filePath);
}
function utils_mkdir(dirPath) {
  return fs.promises.mkdir(dirPath, {
    recursive: true
  });
}
function rmdir(dirPath) {
  return fs.promises.rmdir(dirPath, {
    recursive: true
  });
}
function utils_getBuildDir(dirPath) {
  return path.join(process.cwd(), dirPath, 'build');
}
function utils_getCacheDir(dirPath) {
  return path.join(process.cwd(), dirPath, 'cache');
}
function utils_getLibraryDir() {
  return __dirname;
}
function combineMdastTrees(mdasts) {
  const children = mdasts.flatMap(mdast => mdast.children || []);
  return {
    type: 'root',
    children
  };
}
function inspect() {
  return tree => {
    console.log(JSON.stringify(tree, null, 2)); // console.dir(tree, { depth: null });
    // visit(tree, 'leafDirective', (node) => {
    //   console.log('---------------------');
    //   console.dir(node, { depth: null });
    // });

    return tree;
  };
}
;// CONCATENATED MODULE: ./src/utils/cache-to-file.ts
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }




async function cache_to_file_cacheToFile(options) {
  const {
    ctx,
    prefix,
    key,
    execFn,
    json
  } = options;

  if (ctx.options.noCache === true) {
    return execFn(key);
  }

  const filePath = `${prefix}-${hashSum(key)}.txt`;
  const cachedFilePath = path.join(ctx.cacheDir, filePath);
  const exists = await checkLocalFileExists(cachedFilePath);

  if (exists) {
    const str = await readFile(cachedFilePath); // ignore cache if json is corrupt

    if (json) {
      try {
        return JSON.parse(str);
      } catch (err) {
        return execAndCache(options, cachedFilePath);
      }
    }

    return str;
  }

  return execAndCache(options, cachedFilePath);
}
async function cacheJsonToFile(options) {
  return cache_to_file_cacheToFile(_objectSpread(_objectSpread({}, options), {}, {
    json: true
  }));
}

async function execAndCache({
  ctx,
  key,
  execFn,
  json
}, cachedFilePath) {
  const out = await execFn(key);
  const str = json ? JSON.stringify(out, null, 2) : out;
  await mkdir(ctx.cacheDir);
  await writeFile(cachedFilePath, str);
  return out;
}
;// CONCATENATED MODULE: external "to-vfile"
const external_to_vfile_namespaceObject = require("to-vfile");
var external_to_vfile_default = /*#__PURE__*/__webpack_require__.n(external_to_vfile_namespaceObject);
;// CONCATENATED MODULE: ./src/utils/get-asset-hast.ts
// @ts-expect-error

 // export async function getAssetHast(name: string) {
//   const contents = await getAsset(name);
//   const vfile = toVFile({ contents }) as VFile;
//   const parsed = rehypeParser().parse(vfile) as Parent;
//   return parsed.children[0];
// }

function get_asset_hast_getAssetHast(contents) {
  const vfile = external_to_vfile_default()({
    contents
  });
  const parsed = utils_rehypeParser().parse(vfile);
  return parsed.children[0];
}
;// CONCATENATED MODULE: ./src/utils/message.ts
let message_MessageStatus;

(function (MessageStatus) {
  MessageStatus["fail"] = "fail";
  MessageStatus["warning"] = "warning";
  MessageStatus["info"] = "info";
})(message_MessageStatus || (message_MessageStatus = {}));

function message_failMessage(file, message, position) {
  const status = message_MessageStatus.fail;
  return messageWithStatus(file, message, position, status);
}
function message_warnMessage(file, message, position) {
  const status = message_MessageStatus.warning;
  return messageWithStatus(file, message, position, status);
}
function infoMessage(file, message, position) {
  const status = message_MessageStatus.info;
  return messageWithStatus(file, message, position, status);
}

function messageWithStatus(file, message, position, status) {
  // console.log(message);
  const msg = file.message(message, position);
  msg.status = status;
  return msg;
}
;// CONCATENATED MODULE: ./src/hast/embed-assets.ts
function embed_assets_ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function embed_assets_objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { embed_assets_ownKeys(Object(source), true).forEach(function (key) { embed_assets_defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { embed_assets_ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function embed_assets_defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }



 // import { optimize } from 'svgo';







function embed_assets_embedAssets(ctx) {
  async function embed(node, file) {
    const src = getImageSrc(node);
    const parsed = path.parse(src);

    try {
      switch (parsed.ext) {
        case '.png':
        case '.jpg':
        case '.gif':
          return embedImage(node, ctx, file);

        case '.svg':
          return embedSvg(node, ctx);

        case '.pdf':
          return embedPdfSvg(node);

        default:
          throw new Error(`Unhandled file extension: ${parsed.ext}`);
      }
    } catch (err) {
      failMessage(file, (err === null || err === void 0 ? void 0 : err.message) || '', node.position);
    }
  }

  return async (tree, file) => {
    const transformations = [];
    visit(tree, 'element', node => {
      if (node.tagName === 'img') {
        transformations.push(embed(node, file));
      }
    });
    await Promise.all(transformations);
  };
}

async function embedImage(node, ctx, file) {
  const src = getImageSrc(node);
  const mime = mimes.getType(path.extname(src));

  try {
    const image = await getImage(src, ctx);
    node.properties = embed_assets_objectSpread(embed_assets_objectSpread({}, node.properties), {}, {
      src: `data:${mime};base64,${image}`
    });
  } catch (err) {
    failMessage(file, `Image not found: ${src}`);
  }
}

async function embedSvg(imgNode, ctx) {
  const src = getImageSrc(imgNode);
  const contents = await readFile(src);
  const idx = contents.indexOf('<svg');
  const svg = idx === -1 ? contents : contents.slice(idx); // const optimised = optimize(svg, { multipass: true }).data;

  const svgNode = getAssetHast(svg);

  const properties = embed_assets_objectSpread(embed_assets_objectSpread({}, imgNode.properties), svgNode.properties);

  delete properties.src;
  Object.assign(imgNode, svgNode, {
    properties
  });
}

function getImageSrc(node) {
  const properties = node.properties || {};

  if (!properties.src) {
    throw new Error('Image has no src');
  }

  return properties.src;
}

async function getImage(src, ctx) {
  if (src.startsWith('http')) {
    return cacheToFile({
      ctx,
      prefix: 'youtube',
      key: src,
      execFn: getImageDataFromWeb
    });
  }

  return readFile(src, 'base64');
}

async function getImageDataFromWeb(src) {
  const response = await fetch(src);
  const buffer = await response.buffer();
  return buffer.toString('base64');
}

async function embedPdfSvg(imgNode) {
  const src = getImageSrc(imgNode);
  const svgNode = await pdfToSvg(src);

  const properties = embed_assets_objectSpread(embed_assets_objectSpread({}, imgNode.properties), svgNode.properties);

  delete properties.src;
  Object.assign(imgNode, svgNode, {
    properties
  });
}
;// CONCATENATED MODULE: external "lodash"
const external_lodash_namespaceObject = require("lodash");
;// CONCATENATED MODULE: ./src/hast/responsive-tables.ts


function responsive_tables_responsiveTables() {
  return async (tree, file) => {
    visit(tree, 'element', (node, idx, _parent) => {
      if (node.tagName !== 'table') {
        return;
      }

      const parent = _parent;
      const properties = (parent === null || parent === void 0 ? void 0 : parent.properties) || {};
      const className = properties.className || [];

      if (!className.includes('table-wrapper')) {
        Object.assign(node, {
          tagName: 'div',
          properties: {
            className: 'table-wrapper'
          },
          children: [cloneDeep(node)]
        });
      }
    });
  };
}
;// CONCATENATED MODULE: ./src/hast/index.ts



// import { moveAnswersToEnd } from '../mdast/move-answers-to-end';


async function hast_hastPhase(mdast, ctx, file, targetPdf) {
  const processor = unified().use(remark2rehype, {
    allowDangerousHtml: true
  }).use(rehypeRaw).use(responsiveTables); // if (targetPdf) {
  //   // although an mdast transform, has been put here as
  //   // it needs the full document to work correctly
  //   processor.use(moveAnswersToEnd);
  // }

  if (!ctx.options.noEmbedAssets) {
    processor.use(embedAssets, ctx);
  }

  return processor.run(mdast, file);
}
;// CONCATENATED MODULE: external "rehype-document"
const external_rehype_document_namespaceObject = require("rehype-document");
;// CONCATENATED MODULE: external "rehype-format"
const external_rehype_format_namespaceObject = require("rehype-format");
;// CONCATENATED MODULE: ./src/utils/icons.ts
/* babel-plugin-inline-import '../../assets/hamburger-icon.svg' */
const hamburgerSvg = "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"448\" height=\"392\" viewBox=\"0 0 448 392\">\n  <defs>\n    <style>\n      .cls-1 {\n        fill-rule: evenodd;\n      }\n    </style>\n  </defs>\n  <path id=\"Color_Fill_1\" data-name=\"Color Fill 1\" class=\"cls-1\" d=\"M16,62H432a15.8,15.8,0,0,0,16-16V16A15.8,15.8,0,0,0,432,0H16A15.8,15.8,0,0,0,0,16V46A15.8,15.8,0,0,0,16,62Zm0,165H432a15.8,15.8,0,0,0,16-16V181a15.8,15.8,0,0,0-16-16H16A15.8,15.8,0,0,0,0,181v30A15.8,15.8,0,0,0,16,227Zm0,165H432a15.8,15.8,0,0,0,16-16V346a15.8,15.8,0,0,0-16-16H16A15.8,15.8,0,0,0,0,346v30A15.8,15.8,0,0,0,16,392Z\"/>\n</svg>\n";

/* babel-plugin-inline-import '../../assets/link-icon.svg' */
const linkSvg = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 16 16\">\n  <path\n    d=\"M7.775 3.275a.75.75 0 001.06 1.06l1.25-1.25a2 2 0 112.83 2.83l-2.5 2.5a2 2 0 01-2.83 0 .75.75 0 00-1.06 1.06 3.5 3.5 0 004.95 0l2.5-2.5a3.5 3.5 0 00-4.95-4.95l-1.25 1.25zm-4.69 9.64a2 2 0 010-2.83l2.5-2.5a2 2 0 012.83 0 .75.75 0 001.06-1.06 3.5 3.5 0 00-4.95 0l-2.5 2.5a3.5 3.5 0 004.95 4.95l1.25-1.25a.75.75 0 00-1.06-1.06l-1.25 1.25a2 2 0 01-2.83 0z\">\n  </path>\n</svg>\n";

const svgs = [createStoredSvg('hamburger-icon', hamburgerSvg), createStoredSvg('link-icon', linkSvg)];
function icons_createSvg(name) {
  const {
    id,
    viewBox
  } = getSvg(name);
  return {
    type: 'element',
    tagName: 'svg',
    properties: {
      className: ['icon', id],
      viewBox
    },
    children: [{
      type: 'element',
      tagName: 'use',
      properties: {
        href: `#${id}`
      },
      children: []
    }]
  };
}
function icons_createDefs() {
  return {
    type: 'element',
    tagName: 'svg',
    properties: {
      style: 'display: none'
    },
    children: [{
      type: 'element',
      tagName: 'defs',
      children: svgs.map(createGroup)
    }]
  };
}

function createStoredSvg(id, svg) {
  const hast = get_asset_hast_getAssetHast(svg);
  const children = hast.children;
  const properties = hast.properties;
  const viewBox = properties.viewBox;
  return {
    id,
    viewBox,
    children
  };
}

function getSvg(id) {
  const stored = svgs.find(o => o.id === id);

  if (stored === undefined) {
    throw new Error(`svg icon not found: ${id}`);
  }

  return stored;
}

function createGroup({
  id,
  children
}) {
  return {
    type: 'element',
    tagName: 'g',
    properties: {
      id
    },
    children
  };
}
;// CONCATENATED MODULE: ./src/html/pdf.ts
// import { UnitTitles } from '../course/types';


function pdf_pdfWrapper(unit) {
  return async tree => {
    const main = await createMain(unit.titles, tree.children);
    const iconDefs = createDefs();
    return {
      type: 'root',
      children: [{
        type: 'element',
        tagName: 'div',
        properties: {
          id: 'root',
          className: ['hide-sidebar', 'font-default', 'pdf']
        },
        children: [iconDefs, main]
      }]
    };
  };
}
// EXTERNAL MODULE: ../node_modules/mdast-util-to-hast/index.js
var mdast_util_to_hast = __webpack_require__(9376);
;// CONCATENATED MODULE: external "mdast-util-toc"
const external_mdast_util_toc_namespaceObject = require("mdast-util-toc");
;// CONCATENATED MODULE: ./src/html/wrapper/view-options/readability.ts
const options = [{
  value: 'fontSize',
  label: 'Font-size',
  min: 0.6,
  max: 2,
  increment: 0.1
}, {
  value: 'lineSpacing',
  label: 'Line spacing',
  min: 0.6,
  max: 2,
  increment: 0.1
}, {
  value: 'letterSpacing',
  label: 'Letter spacing',
  min: -0.1,
  max: 0.2,
  increment: 0.05
}, {
  value: 'lineWidth',
  label: 'Line width',
  min: 0.6,
  max: 1.2,
  increment: 0.05
}];
function readability_createReadabilityList() {
  return {
    type: 'element',
    tagName: 'ul',
    properties: {
      id: 'readability'
    },
    children: options.map(createOption)
  };
}

function createOption(item) {
  return {
    type: 'element',
    tagName: 'li',
    properties: {
      className: [item.value],
      'data-min': item.min,
      'data-max': item.max,
      'data-increment': item.increment
    },
    children: [{
      type: 'element',
      tagName: 'span',
      properties: {
        className: ['label']
      },
      children: [{
        type: 'text',
        value: item.label
      }]
    }, {
      type: 'element',
      tagName: 'span',
      properties: {
        className: ['actions']
      },
      children: [{
        type: 'element',
        tagName: 'span',
        properties: {
          className: ['btn', 'minus']
        },
        children: [{
          type: 'text',
          value: '−'
        }]
      }, {
        type: 'element',
        tagName: 'span',
        properties: {
          className: ['btn', 'plus']
        },
        children: [{
          type: 'text',
          value: '+'
        }]
      }, {
        type: 'element',
        tagName: 'span',
        properties: {
          className: ['btn', 'reset']
        },
        children: [{
          type: 'text',
          value: 'Reset'
        }]
      }]
    }]
  };
}
;// CONCATENATED MODULE: ./src/html/wrapper/view-options/theme.ts
const themes = [{
  value: 'light',
  label: 'Light'
}, {
  value: 'dark',
  label: 'Dark'
}, {
  value: 'yellow-on-black',
  label: 'Yellow on Black'
}, {
  value: 'black-on-yellow',
  label: 'Black on Yellow'
}, {
  value: 'black-on-red',
  label: 'Black on Red'
}, {
  value: 'black-on-blue',
  label: 'Black on Blue'
}];
function theme_createThemeList() {
  return {
    type: 'element',
    tagName: 'ul',
    properties: {
      id: 'themes'
    },
    children: themes.map(createThemeButton)
  };
}

function createThemeButton(theme) {
  return {
    type: 'element',
    tagName: 'li',
    properties: {
      className: [theme.value]
    },
    children: [{
      type: 'text',
      value: theme.label
    }]
  };
}
;// CONCATENATED MODULE: ./src/html/wrapper/view-options/index.ts
// import { createFontList } from './font';


function view_options_createViewOptionsButton() {
  return {
    type: 'element',
    tagName: 'div',
    properties: {
      id: 'view-options-toggle'
    },
    children: [{
      type: 'text',
      value: 'View options'
    }]
  };
}
function view_options_createViewOptions() {
  return [createTitle('Theme'), createThemeList(), // createTitle('Font'),
  // createFontList(),
  createTitle('Readability'), createReadabilityList()];
}

function createTitle(value) {
  return {
    type: 'element',
    tagName: 'h3',
    children: [{
      type: 'text',
      value
    }]
  };
}
;// CONCATENATED MODULE: ./src/html/wrapper/sidebar.ts



/* babel-plugin-inline-import '../../../assets/crest.svg' */
const crestSvg = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 483.08 738.15\" class=\"crest\">\n  <path fill=\"#13385E\"\n    d=\"M477.26 392.43c0 119.82-147.87 251.55-236.25 256.22C143.28 641 5.19 503.76 5.19 393.71V6.19h472.08c-.01 0 .42 223.93-.01 386.24zM18.66 634.45c15.73-8.5 39.97-13.61 53.15-31.89 4.68 18.71-7.23 31.4-6.8 58.62l351.64-.01c2.64-13.83-11.46-40.33-6.35-58.61 13.18 18.28 37 23.39 52.73 31.89 13.61 7.23 14.03 11.06 14.03 34.87v48.48c0 9.36-11.06 14.88-23.81 14.46H27.59c-12.76.43-23.39-5.1-23.39-14.46v-48.48c0-22.96 0-28.06 14.46-34.87z\" />\n  <path fill=\"#9ADAF8\"\n    d=\"M447.72 661.24h-31.5c.27-1.43.58-2.93.89-4.6.01.68.01 1.36 0 2.05 11.48-20.84 2.13-26.36 3.83-36.14 8.93 11.48 22.54 13.18 32.32 18.28 11.89 6.38 19.55 20.41-5.54 20.41zm-83.06-204.65c12.75-12.32 21.67 0 19.12 9.35 0 .42-.42.85-.42 1.27-14.87 42.92-52.26 71.38-95.61 83.71 2.12 4.25 8.5 8.5 15.3 13.17-33.99 5.52-61.19-2.12-73.08-6.37-32.29-1.27-64.16-10.62-89.23-29.32-26.77-14.87-35.69-31.02-47.59-55.66-1.27-2.97-3.82-5.95-6.8-11.05-1.7-3.4-2.12-9.35 6.8-6.37 8.07 2.55 18.27 4.67 21.67.42.42-.85.42-1.27.42-1.7-.42-1.27 2.12-4.25 5.52-2.55 5.95-2.12 9.35-5.95 11.05-8.07 2.97.85 5.95 1.27 9.35 2.55 11.05 4.25 33.14 15.3 38.67 36.97 0-16.15-6.37-25.49-12.75-30.59 26.39.31 49.75 5.74 70.96 11.81v-15.89c6.31 2.82 11.45 6.33 14.87 8.99v11.3c2.29.69 4.56 1.38 6.8 2.06 8.07-.85 26.77-2.55 48.44.42-2.12 2.12-5.1 6.37-6.37 8.92 17.85 1.7 34.84-1.27 52.26-12.75 19.55-12.75-15.3-22.52-15.3-70.54 18.27 15.3 35.27 8.5 49.29 17.42 15.3-8.92 39.09-18.27 63.31-5.95-26.34 8.07-45.89 29.32-60.76 49.29 3.83-16.13-14.87-27.61-25.92-.84zm-237.52 19.55c-2.55 0-4.67 2.12-4.67 4.25 0 2.12 2.12 3.82 4.67 3.82s4.67-1.7 4.67-3.82c0-2.13-2.12-4.25-4.67-4.25zm110.9-307.21h14.87v24.52h-14.87v-24.52zm14.87 250.42h-14.87v-60.12c6.38 2.91 11.53 6.5 14.87 9.13v50.99zm-14.87-147.88c6.46 3 11.62 6.67 14.87 9.28v51.23h-14.87v-60.51zm2.97-141.21s-28.89-15.3-60.34-4.67c-.85-3.4-2.55-11.47-3.82-14.02 21.25-5.52 54.39-1.7 64.59 7.65 10.2-8.92 43.34-12.75 63.74-7.65-1.27 2.55-2.97 10.62-3.82 14.02-31.03-10.63-60.35 4.67-60.35 4.67zm-7.22-24.22c-3.4-2.55-8.5-5.1-15.3-5.95 10.62-20.4 11.47-27.62 14.87-62.46 3.82 2.12 5.95 5.1 8.07 8.92v7.22s-10.19 22.95-7.64 52.27zm-118.98 342.9c-2.55-.85-8.5-2.55-15.3-2.55-5.1 0-9.77-2.97-9.77-4.67.43-.85 1.7-1.7 3.82-1.7 4.67-.85 15.3 0 26.77 1.7-.84 2.55-2.54 5.1-5.52 7.22zM29.86 640.83c9.36-5.1 23.39-6.8 32.32-18.71 1.67 9.59-7.28 14.7 3.2 34.94.17 1.44.42 2.84.78 4.18H35.82c-25.94 0-18.29-14.03-5.96-20.41zm223.05-65.69h-14.87v-6.74c5.45 1.51 10.59 2.5 14.87 3.16v3.58z\" />\n  <path fill=\"#FFF\"\n    d=\"m445.32 712.41-1.56-5.63h-12.13l-1.64 5.63h-8.49l10.83-31.35h10.7l10.82 31.35h-8.53zm-6.58-22c-.12-.53-.46-1.94-1.02-4.24-.61 2.3-.95 3.71-1.09 4.24l-3.14 10.31h8.46l-3.21-10.31zm-26.92 22h-8.52v-23.93h-6.95v-7.42h22.49v7.42h-7.02v23.93zm-28.04-275.79c-1.7-9.35 4.25-26.77 30.17-30.17-12.32 4.25-24.22 17.43-30.17 30.17zm5.95 275.79h-8.63v-31.35h8.63v31.35zm-60.76-200.58c-28.47 7.65-75.63 20.4-145.32 2.97-18.7-4.67-62.46-16.15-80.31-39.09-3.4-4.67-4.67-13.17-4.67-14.45 0-1.7.85-2.55 4.67-1.7 12.32 2.12 14.45-2.55 19.12-7.65 5.52-.85 22.95-3.82 36.97 5.52 15.3 10.2 20.4 25.07 20.4 25.07s5.1-12.75-2.12-22.52c14.02-3.82 38.24 2.12 59.91 10.62 31.87 12.32 56.09 16.57 80.31 12.32s36.97-9.35 45.04-21.25c4.25-6.37 16.57-5.1 13.17 4.67-3.4 9.8-18.7 37.42-47.17 45.49zm-201.83-35.69c-2.55 0-4.67 2.12-4.67 4.25 0 2.12 2.12 3.82 4.67 3.82s4.67-1.7 4.67-3.82c0-2.13-2.12-4.25-4.67-4.25zm232.85-65.86c5.95 14.87 6.8 33.57 6.8 33.57s-14.45-23.37-6.8-33.57zm-15.3-3.83c6.8 10.2 16.57 41.22 16.57 41.22s-21.67-23.37-16.57-41.22zM241.44 111.57V46.56c11.05-21.67 26.77-5.1 54.39-13.6 5.1 22.52 9.77 62.89 11.05 70.11-20.83 5.95-39.1-16.15-65.44 8.5zm-.06-64.93-.01-.21.06.12c-.03.13-.05.28-.08.42.02-.12.03-.24.03-.33zm-1.25 6.7c.2-.91.54-2.45.81-3.85-.21 1.4-.36 2.59-.36 2.59s-.16.44-.45 1.26zm-5.07 393.7c1.12.43 2.22.89 3.27 1.36v16.83c-1.08-.31-2.18-.62-3.27-.92v-17.27zm0-89.03h.1c1.08.43 2.14.88 3.17 1.35v58.98h-3.27v-60.33zm0-87.83c1.13.46 2.21.94 3.27 1.44v60.35h-3.27v-61.79zm0-101.25h3.27v24.52h-3.27v-24.52zm-13.56-68.48c5.23.99 9.32 2.98 12.28 5.05 0 .04 0 .07.01.11-4.3-2.75-8.37-4.34-12.29-5.16zm-45.5 2.62c1.27-7.22 6.37-47.59 11.05-70.11 22.04 6.78 36.49-2.11 47.05 4.8-3.39 34.72-4.25 41.96-14.85 62.31-15.63-2.15-28.8 7.26-43.25 3zm-61.75 609.34h-8.5l-1.55-5.63H92.07l-1.65 5.63h-8.48l10.8-31.35h10.7l10.81 31.35zm-15.06-22c-.14-.53-.51-1.94-1.05-4.24-.57 2.3-.96 3.71-1.1 4.24l-3.17 10.31h8.52l-3.2-10.31zm-31.29-9.35h8.67v31.35H67.9v-31.35zm-24.54 31.35-13.15-31.35h9.05l6.29 17.53c.14.39.48 1.79 1.02 4.22.6-2.44.98-3.83 1.14-4.22l6.14-17.53h9.11l-13.12 31.35h-6.48zm103.14-13.82c.14.39.45 1.79 1.04 4.22.55-2.44.96-3.83 1.08-4.22l6.24-17.53h9.05l-13.11 31.35h-6.49l-13.16-31.35h9.09l6.26 17.53zm41.33-10.63h-10.89v5.44h10.26v6.68h-10.26v5.35h10.89v6.99h-19.19v-31.35h19.19v6.89zm17.28-6.9c4.32 0 7.67.04 10.37 2.13 2.24 1.76 3.47 4.42 3.47 7.68 0 4.83-2.44 7.93-6.99 8.92l8.54 12.63h-9.65l-7.19-12.28v12.28h-8.01v-31.35h8.93c.19-.01.35-.01.53-.01zm-1.46 14.83h1.61c3.56 0 5.28-1.13 5.28-3.92 0-3.27-1.61-4.27-5.18-4.27h-1.72v8.19zm31.12 16.52h-8.64v-31.35h8.64v31.35zm3.57-137.27h-3.27v-7.61c1.1.34 2.19.65 3.27.95v6.66zm25.54 113.33h-7.02v23.93h-8.52v-23.93h-6.98v-7.42h22.52v7.42zm24.14-7.41 10.82 31.35h-8.46l-1.61-5.63h-12.11l-1.6 5.63h-8.52l10.83-31.35h10.65zM287 700.72l-3.2-10.31c-.13-.53-.48-1.94-1.05-4.24-.55 2.3-.97 3.71-1.11 4.24l-3.14 10.31h8.5zm25.9 5.83c2.32 0 3.89-1.35 3.89-3.21 0-2.51-1.73-3.27-5.28-4.18-5.62-1.47-8.37-3.77-8.37-8.63 0-5.83 4.23-10.17 10.79-10.17 3.51 0 6.58.91 9.26 2.79l-2.66 6.12c-1.97-1.65-4.06-2.48-5.99-2.48-2.1 0-3.49 1.14-3.49 2.6 0 2.27 2.2 2.74 5 3.5 5.55 1.48 8.65 3.51 8.65 9.32 0 6.46-4.66 11.02-11.99 11.02-4.43 0-7.78-1.39-11.13-4.6l3.83-6.33c2.53 2.87 5 4.25 7.49 4.25zm45.84-7.96c.12.39.47 1.79 1.01 4.22.59-2.44.99-3.83 1.11-4.22l6.21-17.53h9.09l-13.15 31.35h-6.47l-13.16-31.35h9.08l6.28 17.53z\" />\n  <path fill=\"#0499D6\"\n    d=\"M374.44 472.74c-29.32 72.66-153.82 91.36-228.18 48.44-25.07-5.52-54.81-57.36-45.47-58.21 4.9-.31 13.11 4.46 22.4 10.17-3.06 1.76-4.87 4.93-4.56 8.1.42 4.25 4.67 7.65 9.35 7.22 5.1-.42 8.5-4.25 8.07-8.92-.42-2.3-1.66-4.18-3.31-5.5 6.31 1.3 9.26 5.53 9.26 10.18 12.32 5.95 23.79 9.35 31.44.85 3.82 7.22 10.62 11.05 17.42 13.6 15.72 3.4 44.19 5.95 47.59 1.7-9.35-12.32-28.47-16.15-44.19-19.55-2.97-4.25-2.55-12.32-8.92-17.85 8.92 2.97 9.77 8.5 13.6 12.75 19.55.85 47.17 12.75 50.14 28.89-7.65 2.97-20.82 3.82-33.57 2.55 15.3 3.82 32.72 5.95 50.14 5.52 42.92-1.27 84.13-7.65 105.38-48.01 4.68-8.93 8.08-2.13 3.41 8.07z\" />\n  <path fill=\"#FFCF39\"\n    d=\"M412.25 312.12h-74.36c-7.22 0-8.07 2.55-17 14.87-2.55 2.97-.42 5.95 4.25 6.37 8.5.43 20.82.85 35.27 1.7-2.55-3.82-2.97-8.5-2.12-11.05 4.25-3.4 10.2-3.4 12.75-3.4-5.52 18.27 17 19.97 18.7 2.55.42 1.27.85 7.65-2.97 12.32 10.62 0 22.1.42 33.99.85-14.02.42-25.92.85-36.54 1.27-2.12 1.27-5.1 2.55-9.35 2.55s-7.22-.85-9.77-2.12c-25.92.42-41.22.42-54.39-.42-6.8-.42-5.95-3.82-5.52-8.07.42-2.55 5.95-47.17 9.77-80.31 2.55-19.55 8.07-42.49 24.64-48.01-2.12-6.37-7.65-19.55-10.62-27.62-4.25-10.62 2.12-19.12 15.72-19.12h52.69c3.82 0 8.92 0 13.17 2.55 5.1 2.97 7.65 8.92 5.1 15.3-4.67 12.32-10.62 27.62-11.05 28.89 6.37 2.97 8.07 4.67 11.05 8.5 9.77 11.9 12.32 31.02 13.17 38.24 3.4 27.19 8.07 64.59 8.92 71.81-1.7-4.67-3.4-7.65-25.5-7.65zm-18.27-145.74h-49.29c-5.52 0-4.25 5.1-1.7 10.62 4.25 9.77 7.65 17.85 10.2 23.37h37.39c2.55-5.1 7.65-17 11.05-25.49 3.82-9.78-3.4-8.5-7.65-8.5zM209.99 607.86c1.27-1.7 6.37-6.8 9.35-9.35-2.12-2.55-3.4-5.52-3.4-9.35 0-7.65 6.37-14.02 14.02-14.02h23.79c7.65 0 14.02 6.37 14.02 14.02 0 3.82-1.27 7.22-3.82 9.77l8.92 8.92c-16.98 6.39-47.15 6.81-62.88.01zm43.77-161.46h-23.79c-7.65 0-14.02-6.37-14.02-14.02s6.37-14.02 14.02-14.02h23.79c7.65.42 14.02 6.37 14.02 14.02s-6.37 14.02-14.02 14.02zm-24.22-116.43h23.8c7.65 0 14.02 5.95 14.02 14.02 0 7.65-6.37 14.02-14.02 14.02h-23.8c-7.65 0-14.02-6.37-14.02-14.02 0-7.65 6.37-14.02 14.02-14.02zm24.22-60.34h-23.79c-7.65 0-14.02-6.37-14.02-14.02s6.37-14.02 14.02-14.02h23.79c7.65 0 14.02 6.37 14.02 14.02s-6.37 14.02-14.02 14.02zm-33.57-78.18h42.49v41.64h-42.49v-41.64zm13.6-40.37h15.3v17.85h-15.3v-17.85zm8.07-16.99 7.22 13.17-15.3.42 8.08-13.59zM114.81 455.32c-3.4 1.27-6.8 1.7-9.77.42-2.97-1.27-5.52-3.4-6.8-6.8-.4-.88-.7-1.8-.95-2.74.72.12 1.47.19 2.23.19 1.34 0 2.64.07 3.9.18.48 1.25 1.72 2.83 3.75 3.64 2.12.85 4.25.43 5.1-.42.64-.27 1.27-.64 1.89-1.06.24.07.46.15.65.21 2.97-2.12 4.67-4.67 5.52-7.22l-.81-.12c.82-2.09 1.23-4.16 1.23-5.83 0-4.25-1.7-7.65-4.67-8.92-2.12-.42-4.25 0-5.52.42-2.97 1.27-5.52 4.25-7.22 8.07-.48 1.45-.78 2.97-.9 4.45-2.15-.11-4.08-.14-5.71-.08.18-2.04.68-4.09 1.51-6.07 2.12-5.52 5.95-9.35 10.2-11.47 3.4-1.27 6.8-1.7 9.77 0 7.22 2.97 10.62 12.75 6.8 22.1-2.12 5.1-5.95 9.35-10.2 11.05z\" />\n  <path fill=\"#E2A034\"\n    d=\"M359.99 227.57c-1.7 12.75-1.7 57.79-2.12 76.91-9.35.42-22.1 0-24.64.85 1.7-19.97 2.97-66.71 3.82-80.73.85-14.45 7.65-17.85 17-17.42h31.87c-10.63.84-24.23 6.36-25.93 20.39zm-104.1 15.29h-28.47c0-.85.43-8.92-7.22-9.77h25.07v-41.64h11.47v41.64h5.95c-7.23 1.7-6.8 7.65-6.8 9.77zm-14.03-91.78h4.67v17.85h-4.67v-17.85zm0-16.99 4.67 13.6-4.67-.42v-13.18zm-110.05-29.32c3.82 27.62-18.27 35.69-25.07 36.12-4.67 1.27-2.12 5.95-2.12 5.95 2.12 2.97 3.82 4.25 11.05 8.92 2.12 2.55-2.97 4.25-2.97 4.25s-9.35-8.92-14.02-11.47c-2.12-.85 1.27-3.82-1.27-4.67-.85-.42-9.35-.85-10.62-1.7 16.15-1.7 41.64-15.72 26.34-35.27 11.47 24.64-31.87 32.72-35.27 33.14-12.75 2.12-21.67 15.3-25.92 11.05-4.67 4.67-14.87 5.52-10.62 2.97 3.82-2.55 17.85-14.02 27.62-27.19 21.25-28.89 39.94-31.02 41.22-36.54 2.55-14.45 26.34-19.12 30.59-2.55 2.12.42 5.1 1.27 8.5 4.25-3.4 0-6.8 0-8.92.85-5.54 2.54-8.94 7.21-8.52 11.89zm2.55-18.7c-1.27 0-2.55 1.27-2.55 2.55 0 1.27 1.27 2.55 2.55 2.55 1.27 0 2.55-.85 2.55-2.55s-1.27-2.97-2.55-2.55zm117.7 510.74c-17.42 1.27-25.92-.42-25.92-.42s23.37-2.55 32.29-14.45c2.13 2.55 3.4 14.02-6.37 14.87zm.85-155.09h-26.34s19.97-1.27 32.29-14.45c3.82 2.13 4.25 14.45-5.95 14.45zm0-88.81h-26.34s19.97-1.27 32.29-14.45c3.4 2.13 4.25 14.45-5.95 14.45zm.43-88.38H227s19.97-1.27 32.29-14.45c3.39 2.13 4.24 14.45-5.95 14.45z\" />\n  <path fill=\"#EE422D\" d=\"M132.66 111.14c0 21.25-16.57 28.04-20.82 28.89 1.28-4.67 8.07-26.76 20.82-28.89\" />\n  <path fill=\"#81C341\"\n    d=\"M174.3 274.31s21.25-10.62 23.37-21.25c-6.37-6.37-22.95-6.8-22.95-6.8s19.12-14.45 18.27-24.64c-9.35-4.25-26.34-1.7-26.34-1.7 7.65-10.62 9.77-19.55 9.77-26.77-9.77-1.7-25.07 4.25-25.07 4.25s5.1-18.27 0-27.62c-8.92-2.55-21.67 13.6-21.67 13.6s-4.67-19.97-15.3-30.17c-10.62 10.62-15.3 30.17-15.3 30.17s-12.75-16.15-22.1-13.6c-5.1 9.35 0 27.62 0 27.62s-15.3-5.95-25.07-4.25c-.42 7.65 2.12 16.15 9.77 26.77 0 0-17-2.55-26.34 1.7-.85 10.62 18.27 24.64 18.27 24.64s-16.57.42-22.95 6.8c2.12 10.62 22.95 21.25 22.95 21.25s-12.32 2.55-20.4 11.47c5.1 6.37 15.72 12.75 24.64 14.02-7.22 5.52-11.47 10.2-13.6 14.02 11.9 9.77 37.39 11.05 62.46 3.4 0 4.67 0 43.77-5.95 61.61h25.49c-5.95-17.85-5.95-56.94-5.95-61.61 25.07 7.65 50.56 6.37 62.46-3.4-1.7-3.4-5.95-8.07-13.6-14.02 8.5-1.27 19.55-7.65 24.22-14.02-6.76-8.92-19.08-11.47-19.08-11.47\" />\n  <path fill=\"#07974B\"\n    d=\"M151.36 274.73c2.55-1.27 14.45-5.1 20.82-16.15-6.37-5.95-20.82-6.37-20.82-6.37s13.17-8.5 17.42-21.25c-11.05-3.4-22.52 0-22.52 0s9.35-13.6 10.62-24.64c-10.62 1.27-22.1 6.8-22.1 6.8 3.4-7.22 4.67-17 3.4-25.49-5.1.85-10.2 7.22-13.17 11.05-2.55-8.5-7.22-11.47-10.62-13.17-5.1 7.65-6.37 12.75-5.52 22.95 1.7-1.7 4.67-4.67 8.92-7.22 2.55 14.87-2.55 25.92-2.55 25.92s6.37-4.25 15.3-5.1c.42 8.07-2.55 17-11.47 26.77 0 0 7.65-4.67 16.57-5.1-1.27 11.47-8.5 19.55-15.72 25.92 4.67-2.12 13.17-2.12 19.12-.42-2.97 8.92-9.77 13.17-19.97 18.7 6.37 0 12.75.85 16.15 3.4-4.25 7.65-14.02 11.05-20.82 13.17 15.72 5.95 31.02 8.5 45.89 5.1-.85-4.67-6.8-9.77-13.17-13.6 5.95-1.27 14.87-3.4 22.95-9.77-4.69-5.97-11.06-9.37-18.71-11.5\" />\n  <path fill=\"#fff\" fill-rule=\"evenodd\" class=\"dark-only\"\n    d=\"M483.06 0 .4.05v390.87c-.09 125.7 152.44 256.62 241.01 261.36l.32.02.33-.02c88.59-4.74 241.11-135.66 241.02-261.35L483.06 0zm-12.2 12.23-458.23.05v378.65c-.08 117.34 146.75 244.4 229.1 249.09 82.37-4.69 229.2-131.77 229.12-249.11.5-145.16.09-341.72.01-378.68zM16.27 636.17s3.41-1.95 3.41-1.98c.02 0 2.13-.92 2.22-.98 0 0 5.82-2.63 6.09-2.71 0 0 6.24-2.89 6.2-2.86 13.22-5.57 28.15-11.85 37.64-24.83l1.12-1.53c.25.98.49 1.85.49 1.85.78 3.13 1.17 6.19 1.17 9.14 0 5.78-1.47 11.25-3.04 17.11-1.7 6.31-3.83 14.16-4.19 24.5l-.05 1.63h348.32l-.05-1.63c-.36-10.36-2.48-18.21-4.29-24.9-1.57-5.92-2.91-11.01-2.91-16.7 0-3.12.39-6.09 1.18-9.13 0 0 .26-.98.48-1.83.57.82 1.07 1.5 1.07 1.5 9.51 12.97 24.46 19.26 37.63 24.8 0 0 5.17 2.32 5 2.18 0 0 .49.29.7.42 0 0 8.74 3.94 8.77 3.95 0 0 7.44 4.72 7.61 4.84 7.71 4.68 12.19 10.28 12.19 24.89 0 0-.19 5.98-.19 6.04l.01 8.42-.05 39.39c0 4.68-1.86 8.99-5.42 12.4-5.44 5.31-14.31 8.25-24.36 7.99H30.13c-10.14.26-19.08-2.68-24.5-7.99-3.56-3.47-5.44-7.72-5.44-12.29l-.02-39.19v-8.33L0 665.37c0-16.97 6.46-23.92 16.27-29.2zm46.72 17.15c-2.06-5.06-3.07-9.42-3.07-13.32 0-3.27.63-5.96 1.17-8.31l.21-1.32.8-5.37-3.32 2.95c-5.94 5.31-13.12 8.01-18.97 10.2 0 0-7.6 3.18-7.8 3.28 0 0-2.55 1.3-2.89 1.48-4.16 2.53-7.27 5.84-8.31 8.77l-.56 1.63 1.65.45c4.14 1.15 9.14 1.73 14.88 1.73h27.13l-.92-2.17zm398.9-2.25c-1.04-2.36-3.32-4.9-6.41-7.01 0 0-6-3.26-6.14-3.33 0 0-6.22-2.56-6.28-2.57-5.77-2.21-12.95-4.92-18.87-10.2l-3.24-2.83.7 5.13s.22 1.38.32 1.8c.53 2.41 1.1 4.91 1.1 7.95 0 3.8-1.03 8.16-3.14 13.32l-.91 2.18h27.13c7.68 0 12.34-1.26 14.89-2.3l1.51-.64-.66-1.5zM11.7 664.69s.2 5.36.2 5.24l-.02 8.72.02 39.09c0 1.48.61 2.75 1.86 3.97 3.05 3.06 9.29 4.84 16.24 4.66h423.17c6.84.18 12.97-1.6 15.96-4.62 1.32-1.21 1.96-2.53 1.96-4.09l.01-48.13.4-9.17-2.58 1.56c-5.65 3.45-13.53 5.28-22.77 5.28H36.79c-9.4 0-17.07-1.38-22.79-4.1l-2.38-1.08.08 2.67z\" />\n  </svg>\n";

/* babel-plugin-inline-import '../../../assets/uofg.svg' */
const uOfGSvg = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 117.18 48.02\" class=\"uofg\">\n  <path fill=\"#003865\"\n    d=\"m114.74 32-3.83 9.36h-.8l-3.54-8.38-3.57 8.38h-.83l-4.43-9.99c-.41-.92-.83-1.37-2.2-1.51v-.54h5.77v.54c-1.75.09-1.87.59-1.25 1.99l3.21 7.16 2.91-6.9c-.65-1.51-1.16-2.05-2.2-2.17l-.71-.09v-.54h6.15v.54c-1.46.03-1.9.47-1.28 1.96l2.91 7.07 2.85-6.95c.65-1.58.15-2.08-1.72-2.08v-.54h4.99v.54c-1.12.13-1.83.7-2.43 2.15zm-.03-21.93-5.05 12.6c-.89 2.2-1.57 3.18-2.61 3.18-.71 0-1.22-.45-1.22-1.04 0-1.22 1.72-.92 2.46-1.67.33-.33.77-1.1 1.01-1.69l.89-2.23-4.6-9.77c-.57-1.22-1.1-1.73-2.35-1.75v-.54h5.97v.54c-1.81.03-2.02.56-1.43 1.81l3.36 7.25 2.52-6.3c.89-2.26.33-2.7-1.43-2.76v-.54h4.93v.54c-1.2.14-1.88.98-2.45 2.37zm-14.79 9.22c-1.75 0-3-1.46-3-3.45V8.47h-1.37v-.48c1.16-.56 2.17-1.93 2.85-3.77h.51v2.94h3.67l-.47 1.31h-3.2v6.92c0 1.87 1.34 2.5 1.96 2.5.66 0 1.25-.51 1.81-1.49l.48.45c-.72 1.54-1.88 2.44-3.24 2.44zm-11.72-.92c1.82 0 2.47-.6 2.47-2.17v-5.97c0-1.16-.15-1.31-.92-1.46l-1.4-.27v-.48l3.86-1.34h.45v9.98c0 1.04.56 1.7 2.14 1.7v.56h-6.6v-.55zm3.24-16.11c-.71 0-1.28-.51-1.28-1.13C90.17.5 90.73 0 91.44 0c.71 0 1.31.5 1.31 1.13 0 .62-.59 1.13-1.31 1.13zM86.77 15.9c0 1.93-1.61 3.39-3.69 3.39-.56 0-.98-.09-1.31-.21-.33-.09-.57-.18-.8-.18-.18 0-.36.12-.51.35h-.45l-.33-3.33h.48c.35 1.79 1.48 2.79 2.82 2.79 1.19 0 2.11-.89 2.11-1.96 0-.62-.15-1.01-.95-1.81-2.11-2.11-4.46-2.32-4.46-4.78 0-1.96 1.55-3.33 3.8-3.33.8 0 1.63.18 2.38.48l.06 2.7h-.51c-.21-1.52-1.19-2.46-2.38-2.46-.98 0-1.81.68-1.81 1.66.03 2.62 5.55 3.06 5.55 6.69zm-3.86 15.87c-.45-.03-1.84-.15-2.97-.36.18.33.5.95.5 1.9 0 2.2-1.9 4.31-5.2 4.31-.56 0-.83-.06-1.37-.24-.47.51-1.81.83-1.81 1.51 0 .75 1.28 1.04 4.25 1.07 3.36.03 4.52.18 5.41 1.07.71.71.89 1.46.89 2.08 0 1.93-2.61 4.9-8.11 4.9-3.09 0-4.57-1.37-4.57-2.82 0-1.72 1.81-1.99 3.18-3.65-1.6-.15-2.82-1.16-2.82-2.11 0-1.37 1.99-1.43 3.03-2.2-1.81-.71-2.85-1.99-2.85-3.69 0-2.56 2.29-4.55 5.23-4.55 1.37 0 2.53.42 3.33 1.19 1.34 0 2.58-.15 3.89-.3v1.89zM71.77 44.21c0 1.4 1.96 2.97 4.4 2.97 2.53 0 4.9-1.66 4.9-3.54 0-1.1-.92-1.66-1.99-1.75-.77-.09-4.51-.12-5.38-.24-.83.99-1.93 1.41-1.93 2.56zm3.57-14.64c-1.13 0-2.88.62-2.88 3.39 0 1.75.89 4.1 3.15 4.1 1.72 0 2.85-1.43 2.85-3.48 0-2.56-1.31-4.01-3.12-4.01zm.87-20.54c-.32-.15-.68-.29-1.04-.29-.53 0-.86.36-1.16.77-.39.53-.71 1.04-.95 1.48v5.76c0 1.22.45 1.61 1.93 1.61h1.13v.56h-7.04v-.56c1.52-.03 1.99-.65 1.99-2.23V9.27l-1.99-.72v-.5l3.39-1.19h.6v3.15h.06c1.48-2.44 1.84-3 2.82-3 .36 0 .45.03 1.01.27.3.12.83.24 1.54.44l-.71 1.79a5.47 5.47 0 0 1-1.58-.48zm-7.56 29.04c0 1.93-1.61 3.39-3.68 3.39-.56 0-.98-.09-1.31-.21-.32-.09-.56-.18-.8-.18-.18 0-.35.12-.5.36h-.45l-.32-3.33h.47c.36 1.78 1.49 2.8 2.83 2.8 1.19 0 2.11-.9 2.11-1.96 0-.63-.15-1.01-.95-1.82-2.11-2.11-4.46-2.32-4.46-4.78 0-1.96 1.54-3.33 3.8-3.33.8 0 1.63.18 2.38.48l.06 2.7h-.5c-.21-1.52-1.19-2.47-2.38-2.47-.98 0-1.81.68-1.81 1.66-.01 2.61 5.51 3.06 5.51 6.69zm-9.79-25.44c0 3.09 2.17 5.17 4.51 5.17 1.49 0 2.65-.59 3.78-1.93l.33.36c-1.25 1.58-3.12 3.06-5.29 3.06-2.91 0-5.17-2.65-5.17-6.09 0-3.15 2.11-6.36 5.73-6.36 4.01 0 3.92 2.88 4.9 3.86v.68h-8.68c-.05.45-.11.86-.11 1.25zm6.3-2.02c-.33-1.93-1.51-3.21-2.94-3.21-.98 0-2.46.45-3.15 3.21h6.09zm-10.33-.74-4.1 9.33h-.86l-4.31-9.86c-.45-1.04-.83-1.4-1.31-1.49l-.92-.15v-.54h6.06v.54c-1.81.06-2.38.29-1.67 1.69l3.15 7.4 3.03-6.86c.54-1.22.27-2.08-1.9-2.23v-.54h5.17v.54c-1.12.2-1.77.86-2.34 2.17zm-11.01 9.06h-6.6v-.56c1.81 0 2.47-.6 2.47-2.17v-5.97c0-1.16-.15-1.31-.92-1.46l-1.4-.27v-.48l3.86-1.34h.45v9.98c0 1.04.56 1.7 2.14 1.7v.57zM40.46 2.26c-.72 0-1.28-.51-1.28-1.13 0-.63.57-1.13 1.28-1.13.71 0 1.31.5 1.31 1.13 0 .62-.6 1.13-1.31 1.13zM29.98 18.37c.86-.03 1.36-.24 1.69-.57.56-.57.62-2.74.62-6.69 0-2.38-1.16-3.12-2.35-3.12-.95 0-2.4.83-3.95 1.9v6.45c0 1.63.39 2.02 1.99 2.02v.56h-5.97v-.56c1.31 0 1.99-.72 1.99-1.87v-6.24c0-1.1-.12-1.31-.89-1.46l-1.01-.2v-.48l3.42-1.25H26v2.32c1.99-1.25 3.65-2.35 5.11-2.35 2.02 0 3.18 1.48 3.18 4.45 0 3.95-.21 4.72-.24 5.89-.03.8.44 1.19 1.66 1.19h.65v.56h-6.39v-.55zM19.94 3.74v8.02c0 3.68-2.35 7.64-8.8 7.64-5.67 0-8.59-3.24-8.59-7.49V3.24c0-1.9-.53-2.2-2.56-2.23V.45h7.64v.56h-.26c-1.63 0-2.35.45-2.35 2.17v8.26c0 4.01 2.35 6.42 6.77 6.42 3.36 0 6.78-1.4 6.78-6.44V4.49c0-2.85-.45-3.36-2.91-3.48V.45h6.98v.56c-1.99.03-2.7.83-2.7 2.73zM3.66 41.45c-1.4 0-2.64-2.23-2.64-4.7 0-4.81 5.17-7.79 6.95-7.79.86 0 2.7 1.19 2.7 4.37 0 5.66-5.62 8.12-7.01 8.12zm2.79-11.38c-1.87 0-3.54 3.59-3.54 6.57 0 2.49 1.07 3.71 2.08 3.71 2.38 0 3.77-3.86 3.77-6.6.01-2.08-1-3.68-2.31-3.68zm5.37-.32c.71-.09 1.43-.21 2.17-.39.45-2.44 1.34-4.99 3-6.65 1.04-1.04 2.35-1.6 3.51-1.6 1.16 0 2.11.65 2.11 1.43 0 .47-.36.86-.83.86-.98 0-1.78-1.22-2.64-1.22-1.16 0-2.11 1.31-2.53 3.27l-.8 3.89h2.55l-.3.98h-2.44L14.11 39c-1.16 6.66-4.55 9.03-7.34 9.03-1.25 0-2.29-.62-2.29-1.37 0-.48.48-.89.98-.89 1.1 0 1.69 1.31 2.82 1.31.68 0 1.28-.33 1.81-.86 1.48-1.49 2.05-6.56 2.17-7.28l1.52-8.62h-2.05l.09-.57zm23.44 3.95h-1.1v-.53h8.02v.53c-1.48.09-2.08.6-2.08 1.87v4.13c-2.94 1.52-6.71 1.87-7.96 1.87-6.51 0-9.54-5.02-9.54-9.36 0-4.46 3.12-10.04 10.37-10.04 3.18 0 5.29 1.01 5.91 1.01.27 0 .51-.06.68-.21h.42v4.81h-.59c-.81-3.71-3.33-4.87-6.09-4.87-5.23 0-7.9 4.34-7.9 9.12 0 6.09 4.28 8.79 7.7 8.79 1.37 0 2.88-.3 4.55-1.13v-3.74c-.01-1.69-.61-2.25-2.39-2.25zM43.74 23l-1.34-.15v-.5l3.8-1.22h.44v17.62c0 1.22.57 1.78 1.72 1.78h.51v.57h-6.68v-.57c1.9 0 2.46-.56 2.46-1.99V24.19c.01-.83-.08-1.1-.91-1.19zm6.6 9.87c-.06-.18-.09-.27-.09-.42 0-1.04 2.47-3.45 4.4-3.45.89 0 2.29.42 3.12 1.58.45.62.45 1.01.45 2.55v3.98c0 2.38 0 2.91.77 2.91.32 0 .71-.03 1.45-.65l.15.45c-1.6 1.31-2.44 1.63-2.94 1.63-1.22 0-1.34-1.34-1.37-1.81-2.05 1.69-2.64 1.81-3.45 1.81-1.72 0-2.76-.98-2.76-2.44 0-1.81 1.6-2.44 3.51-2.91.62-.15 1.6-.51 2.64-1.13v-2.35c0-.83 0-1.31-.51-1.9-.38-.48-1.01-.86-1.66-.86-.98 0-1.84.83-1.84 1.45 0 .18.03.3.15.57l-2.02.99zm4.13 3.53c-1.81.74-2.5 1.04-2.5 2.26 0 1.07.86 1.75 1.75 1.75.47 0 .83-.15 2.5-1.31v-3.54c-.56.34-1.03.55-1.75.84zm29.05-1.1c0-4.1 3.33-6.3 6.42-6.3 3.63 0 6.39 2.7 6.39 6.24 0 3.5-2.76 6.21-6.3 6.21-3.69 0-6.51-2.67-6.51-6.15zm10.57.69c0-3.39-2.08-6.27-4.57-6.27-1.96 0-3.78 2.02-3.78 4.58 0 3.6 2.05 6.45 4.61 6.45 1.75-.01 3.74-1.79 3.74-4.76z\" />\n</svg>\n";



async function sidebar_createSidebar(mdast) {
  const logo = await createLogo();
  const toc = getToc(mdast, {
    maxDepth: 3
  }).map;
  const tocChildren = toc === null ? [] : [toHast(toc)];
  return {
    type: 'element',
    tagName: 'aside',
    children: [logo, createViewOptionsButton(), {
      type: 'element',
      tagName: 'nav',
      properties: {
        id: 'toc'
      },
      children: tocChildren
    }, {
      type: 'element',
      tagName: 'div',
      properties: {
        id: 'view-options'
      },
      children: createViewOptions()
    }]
  };
}

async function createLogo() {
  const crest = getAssetHast(crestSvg);
  const uofg = getAssetHast(uOfGSvg);
  const hamburgerIcon = createSvg('hamburger-icon');
  return {
    type: 'element',
    tagName: 'div',
    properties: {
      className: 'logo'
    },
    children: [{
      type: 'element',
      tagName: 'div',
      properties: {
        className: 'logo-wrapper'
      },
      children: [crest, uofg]
    }, hamburgerIcon]
  };
}
;// CONCATENATED MODULE: ./src/html/wrapper/index.ts



function wrapper_htmlWrapper(unit, mdast) {
  return async tree => {
    const hamburgerIcon = createSvg('hamburger-icon');
    const sidebar = await createSidebar(mdast);
    const main = await createMain(unit.titles, tree.children);
    const iconDefs = createDefs();
    return {
      type: 'root',
      children: [{
        type: 'element',
        tagName: 'div',
        properties: {
          id: 'root',
          className: ['hide-sidebar']
        },
        children: [iconDefs, main, hamburgerIcon, sidebar]
      }]
    };
  };
}
;// CONCATENATED MODULE: ./src/html/index.ts


 // @ts-expect-error







async function html_htmlPhase(hast, mdast, file, unit, ctx, targetPdf) {
  const processor = unified().use(format).use(stringify, {
    allowDangerousHtml: true
  });

  if (!ctx.options.noDoc) {
    const templateCss = await readFile(path.join(getLibraryDir(), 'template.css'));
    const docOptions = {
      title: unit.titles.docTitle,
      style: `\n${templateCss}\n`
    };

    if (!targetPdf) {
      const templateJs = await readFile(path.join(getLibraryDir(), 'template.js2'));
      docOptions.script = `\n${templateJs}\n`;
      processor.use(htmlWrapper, unit, mdast);
    } else {
      processor.use(pdfWrapper, unit);
    }

    processor.use(doc, docOptions);
  }

  const transformed = await processor.run(hast, file);
  const result = processor.stringify(transformed, file);
  return referenceTransform(result, ctx.refStore);
}

function referenceTransform(html, refStore) {
  return html.replace(/ref:\/\/(\w+)/gms, (...match) => {
    const key = match[1];
    const link = refStore[key];
    const name = startCase(link);
    return `<a href="${link}">${name}</a>`;
  });
}
;// CONCATENATED MODULE: external "child_process"
const external_child_process_namespaceObject = require("child_process");
;// CONCATENATED MODULE: ./src/knitr/index.ts



 // import hashSum from 'hash-sum';



async function knitr_knitr(file, ctx) {
  const result = await execKnitr(file, ctx);
  file.contents = result;
  return file;
} // TODO: see what can be done with output when "quiet" turned off

async function execKnitr(file, ctx) {
  const filePath = file.path || '';
  const baseDir = file.dirname || '';
  const md = file.contents;
  const fileName = getUniqueTempFileName(md);
  const cachedFilePath = path.join(ctx.cacheDir, fileName);
  await mkdir(ctx.cacheDir);
  await writeFile(cachedFilePath, md);
  return new Promise((resolve, reject) => {
    const rFile = path.join(__dirname, 'knitr.R');
    const cmd = `Rscript ${rFile} ${filePath} ${baseDir}/ ${ctx.cacheDir}/`;
    exec(cmd, async (err, response, stdErr) => {
      if (stdErr) {
        console.log(chalk.grey(`[knitr] ${stdErr.trim()}`));
      }

      if (err) {
        console.error('ERROR', err);
        reject(err);
      } else {
        knitr_reportErrors(response, file);
        resolve(formatResponse(response));
      }

      await rmFile(cachedFilePath);
    });
  });
}

function getUniqueTempFileName(md) {
  const hash = hashSum(md);
  const ts = new Date().getTime().toString();
  return `knitr-${hash}-${ts}.Rmd`;
}

async function formatResponse(response) {
  let result = response;
  result = removeEmptyLog(result);
  result = addNewLineAfterKable(result);
  return result;
}

function knitr_reportErrors(response, file) {
  response.split('\n').forEach((line, idx) => {
    const trimmed = line.trim();

    if (trimmed.startsWith('## Error')) {
      failMessage(file, trimmed.replace('##', ''), {
        start: {
          line: idx + 1,
          column: 0
        },
        end: {
          line: idx + 1,
          column: line.length
        }
      });
    }
  });
}

function removeEmptyLog(md) {
  return md.replace(/\[1\]\s""$/gm, '').trim();
}

function addNewLineAfterKable(md) {
  return md.split('\n').reduce((acc, line, idx) => {
    var _acc;

    if ((_acc = acc[idx - 1]) !== null && _acc !== void 0 && _acc.startsWith('|') && !line.startsWith('|')) {
      acc.push('', line);
    } else {
      acc.push(line);
    }

    return acc;
  }, []).join('\n');
} // attempt at changing knitr output. doesn't completely work
// const hooks = `
//   knit_hooks$set(
//     source = function(x, options) {
//       paste(c("\`\`\`r", x, "\`\`\`"), collapse = "\n")
//     },
//     output = function(x, options) {
//       paste(c("\`\`\`", x, "\`\`\`"), collapse = "\n")
//     },
//     error = function(x, options) {
//       paste(
//         c(
//           "\`\`\`plaintext error",
//           gsub("## Error", "\#\# Error", x),
//           "\`\`\`"
//         ),
//         collapse = "\n"
//       )
//     }
//   )
// `;
;// CONCATENATED MODULE: external "mathjax-full/js/adaptors/liteAdaptor.js"
const liteAdaptor_js_namespaceObject = require("mathjax-full/js/adaptors/liteAdaptor.js");
;// CONCATENATED MODULE: external "mathjax-full/js/core/MathItem"
const MathItem_namespaceObject = require("mathjax-full/js/core/MathItem");
;// CONCATENATED MODULE: external "mathjax-full/js/core/MmlTree/SerializedMmlVisitor.js"
const SerializedMmlVisitor_js_namespaceObject = require("mathjax-full/js/core/MmlTree/SerializedMmlVisitor.js");
;// CONCATENATED MODULE: external "mathjax-full/js/handlers/html.js"
const html_js_namespaceObject = require("mathjax-full/js/handlers/html.js");
;// CONCATENATED MODULE: external "mathjax-full/js/input/tex.js"
const tex_js_namespaceObject = require("mathjax-full/js/input/tex.js");
;// CONCATENATED MODULE: external "mathjax-full/js/input/tex/AllPackages.js"
const AllPackages_js_namespaceObject = require("mathjax-full/js/input/tex/AllPackages.js");
;// CONCATENATED MODULE: external "mathjax-full/js/mathjax.js"
const mathjax_js_namespaceObject = require("mathjax-full/js/mathjax.js");
;// CONCATENATED MODULE: ./src/latex/tex-to-directive.ts
// import parser from 'fast-xml-parser';







 // Extract all LaTeX using MathJax "page" process (doesn't need delimiters).
// https://github.com/mathjax/MathJax-demos-node/blob/f70342b69533dbc24b460f6d6ef341dfa7856414/direct/tex2mml-page
// Convert Tex to directive alias ie. :blockMath[13] or :inlineMath[42] and build ctx.mmlStore array
// (Alias is replaced with SVG in ./directive-to-svg.ts in mdast phase)
// Avoids typesetting issues:
// If I leave the LaTeX in it gets munged
// If I convert to SVG it gets munged
// If I convert to MathML it gets munged

function tex_to_directive_texToAliasDirective(file, ctx) {
  const md = file.contents;
  const adaptor = liteAdaptor();
  RegisterHTMLHandler(adaptor);
  const tex = new TeX({
    packages: AllPackages.filter(name => name !== 'bussproofs'),
    // Busproofs requires an output jax
    tags: 'ams',
    inlineMath: [['$', '$'], ['\\(', '\\)']],
    displayMath: [['$$', '$$'], [`\\[`, `\\]`]],
    processEscapes: true // ignoreClass: 'r-output',

  });
  const visitor = new SerializedMmlVisitor();
  const store = [];

  function storeTexAndDisplayAlias({
    math
  }) {
    const items = Array.from(math);

    for (const item of items) {
      // debug
      // console.log(item.math);
      let newMarkdown = ''; // convert to MML

      const mml = visitor.visitTree(item.root);
      assertNoMmlError(mml, file); // escaped dollar sign...

      if (item.math === '$') {
        newMarkdown = '$';
      } else if (isReferenceLink(item.math)) {
        // convert tex to text link
        const refNum = extractRefNumFromMml(mml, item.math, file);
        const anchor = extractAnchorLinkFromMml(mml, item.math);
        newMarkdown = `[${refNum}](${anchor})`;
      } else {
        // insert alias as a custom directive and build store of mml
        store.push(mml);
        const type = item.display ? 'blockMath' : 'inlineMath';
        const idx = store.length - 1;
        newMarkdown = `:${type}[${idx}]`;
      }

      const tree = adaptor.parse(newMarkdown, 'text/html');
      item.typesetRoot = adaptor.firstChild(adaptor.body(tree));
    }
  } // add store to ctx


  ctx.mmlStore = store;
  const doc = mathjax.document(md, {
    InputJax: tex,
    renderActions: {
      typeset: [MathItem.STATE.TYPESET, storeTexAndDisplayAlias]
    }
  });
  doc.render();
  const result = adaptor.innerHTML(adaptor.body(doc.document));
  file.contents = postParse(result);
  return file;
}

function assertNoMmlError(mml, file) {
  const match = mml.match(/<merror.*?title="(.+?)"/);

  if (match !== null) {
    failMessage(file, `LaTeX error: "${match[1]}".`);
  }
}

function isReferenceLink(tex) {
  return /^\\ref\{(.+)\}$/.test(tex);
}

function extractRefNumFromMml(mml, tex, file) {
  const match = mml.match(/<mtext>(.+)<\/mtext>/);

  if (match === null) {
    failMessage(file, `Invalid reference: ${tex}`);
    return;
  }

  if (match[1] === '???') {
    failMessage(file, `Invalid reference: ${tex}. You may only reference numbered sections.`);
  }

  return match[1];
}

function extractAnchorLinkFromMml(mml, tex) {
  const match = mml.match(/<mrow href="(.+)" class="MathJax_ref">/);

  if (match === null) {
    throw new Error(`Reference has no anchor link: ${tex}`);
  }

  return decodeURIComponent(match[1] || '');
}

function postParse(html) {
  let result = html;
  result = unprotectHtml(result);
  result = removeUnresolvedLabels(result);
  return result;
} // https://github.com/mathjax/MathJax-src/blob/41565a97529c8de57cb170e6a67baf311e61de13/ts/adaptors/lite/Parser.ts#L399-L403


function unprotectHtml(html) {
  return html.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
}

function removeUnresolvedLabels(html) {
  return html.replace(/\\label{def:.*?}/gm, '');
}
;// CONCATENATED MODULE: external "@double-great/remark-lint-alt-text"
const remark_lint_alt_text_namespaceObject = require("@double-great/remark-lint-alt-text");
;// CONCATENATED MODULE: external "@mapbox/remark-lint-link-text"
const remark_lint_link_text_namespaceObject = require("@mapbox/remark-lint-link-text");
;// CONCATENATED MODULE: external "dictionary-en-gb"
const external_dictionary_en_gb_namespaceObject = require("dictionary-en-gb");
;// CONCATENATED MODULE: external "remark-retext"
const external_remark_retext_namespaceObject = require("remark-retext");
;// CONCATENATED MODULE: external "retext-english"
const external_retext_english_namespaceObject = require("retext-english");
;// CONCATENATED MODULE: external "retext-spell"
const external_retext_spell_namespaceObject = require("retext-spell");
;// CONCATENATED MODULE: ./src/linter/assert-asset-exists.ts



function assert_asset_exists_assertAssetExists() {
  async function getAssetUrl(node, file) {
    const url = node.url || '';

    if (!file.dirname) {
      throw new Error('VFile dirname undefined');
    }

    if (!url.startsWith('http')) {
      const exists = await checkLocalFileExists(url);

      if (!exists) {
        failMessage(file, `No asset found at ${url}`, node.position);
      }
    }
  }

  return async (tree, file) => {
    const transformations = [];
    visit(tree, 'image', node => {
      transformations.push(getAssetUrl(node, file));
    });
    await Promise.all(transformations);
  };
}
;// CONCATENATED MODULE: ./src/linter/assert-no-h1.ts


function assert_no_h1_assertNoH1() {
  return (tree, file) => {
    visit(tree, 'heading', node => {
      if (node.depth === 1) {
        failMessage(file, 'Level 1 heading found. Only one Level 1 heading can be used in the document and it is automatically generated from .yaml file and should not be found in .Rmd file.  Please use Level 2 (## Example) and below.', node.position);
        return;
      }
    });
  };
}
;// CONCATENATED MODULE: ./src/linter/assert-task-answer.ts


function assert_task_answer_assertTaskAnswerStructure() {
  return (tree, file) => {
    let count = 0;
    visit(tree, 'containerDirective', (node, index, _parent) => {
      if (node.name === 'task') {
        count++;
        const children = node.children;
        const answers = children.filter(o => o.name === 'answer');

        if (answers.length < 1) {
          failMessage(file, `Task ${count} has no answer`, node.position);
        }

        if (answers.length > 1) {
          failMessage(file, 'Task has multiple answers', node.position);
        }
      }

      if (node.name === 'answer') {
        const parent = _parent;

        if (!parent || parent.name !== 'task') {
          failMessage(file, 'Answer must be nested inside task', node.position);
        }
      }
    });
  };
}
;// CONCATENATED MODULE: ./src/linter/assert-video-attributes.ts


function assert_video_attributes_assertVideoAttributes() {
  return async (tree, file) => {
    visit(tree, 'leafDirective', node => {
      if (node.name === 'video') {
        if (!node.attributes.id) {
          failMessage(file, 'id attribute is required', node.position);
        }

        if (!node.attributes.duration) {
          failMessage(file, 'duration attribute is required', node.position);
        }

        const title = getTitle(node);

        if (!title) {
          failMessage(file, 'title is required', node.position);
        }
      }
    });
  };
}

function getTitle(node) {
  const children = node.children;
  const firstChild = children[0];
  return (firstChild === null || firstChild === void 0 ? void 0 : firstChild.value) || '';
}
;// CONCATENATED MODULE: ./src/linter/assert-weblink-target.ts


function assert_weblink_target_assertWeblinkTarget() {
  return (tree, file) => {
    visit(tree, 'containerDirective', node => {
      if (node.name === 'weblink') {
        if (node.attributes.target === undefined) {
          failMessage(file, 'Weblink has no target attribute', node.position);
        }
      }
    });
  };
}
;// CONCATENATED MODULE: ./src/linter/lint-latex.ts


function lint_latex_lintLatex() {
  return async (tree, file) => {
    const transformations = [];
    visit(tree, 'math', node => {
      transformations.push(chktex(node, file));
    });
    await Promise.all(transformations);
    return tree;
  };
}

async function chktex(node, file) {
  return new Promise((resolve, reject) => {
    exec(`chktex -q <<< "${node.value}"`, (err, response) => {
      if (err) {
        reject(err);
      } else {
        const messages = lint_latex_formatResponse(response);
        const position = node.position;
        messages.forEach(({
          line,
          column,
          message
        }) => {
          file.message(message, {
            line: position.start.line + line,
            column: position.start.column + column
          });
        });
        resolve();
      }
    });
  });
}

function lint_latex_formatResponse(response) {
  if (response.trim() === '') {
    return [];
  }

  function formatMessage(message) {
    return message.replace(/'/g, '').replace(/`/g, '');
  }

  return response.split(/Warning \d+ in stdin line /).filter(Boolean).reduce((acc, s) => {
    const [key, value] = s.split(':');
    const line = Number(key);
    const trimmed = value.trim();
    const match = trimmed.match(/(.*)\n(.*)\n(\s*)\^/m);

    if (Array.isArray(match)) {
      const message = formatMessage(match[1]);
      acc.push({
        line,
        column: match[3].length,
        message: `${message}\n\n${match[2]}\n${match[3]}^`
      });
    } else {
      acc.push({
        line,
        column: 0,
        message: formatMessage(trimmed)
      });
    }

    return acc;
  }, []);
}
;// CONCATENATED MODULE: external "figures"
const external_figures_namespaceObject = require("figures");
;// CONCATENATED MODULE: ./src/linter/report.ts



function report_printReport(files, ctx) {
  const {
    reportOnlyErrors,
    shouldFail
  } = ctx.options;

  if (reportOnlyErrors && shouldFail) {
    return;
  }

  for (const file of files) {
    // console.log(file.messages);
    const messages = reportOnlyErrors ? failingMessages(file.messages) : file.messages;

    if (messages.length !== 0) {
      // if (file.path !== undefined) {
      //   console.log(`\n${getFilePath(file.path)}`);
      // }
      messages.map(printMessage);
    }
  }
}
function report_reportHasFatalErrors(files, ctx) {
  return files.some(file => file.messages.some(message => message.status === MessageStatus.fail));
}
function reportHasWarnings(files, ctx) {
  return files.some(file => file.messages.some(message => message.status === MessageStatus.warning));
}

function failingMessages(messages) {
  return messages.filter(o => o.status === MessageStatus.fail);
}

function printMessage(message) {
  // console.log(message);
  const status = message.status;
  const position = chalk.grey(`${message.line}:${message.column}`);
  const reason = formatReason(message.reason, status);
  console.log(`${formatStatus(status)}  ${position}  ${reason}`);
} // function getFilePath(filePath: string) {
//   return path.isAbsolute(filePath)
//     ? filePath
//     : path.join(process.cwd(), filePath);
// }


function formatStatus(status) {
  const statusColour = getStatusColour(status);

  switch (status) {
    case MessageStatus.fail:
      return statusColour(figures.cross);

    default:
      return statusColour(figures.warning);
    // TODO: fail on unsupported status?
  }
}

function formatReason(reason, status) {
  const statusColour = getStatusColour(status);
  const [first, ...rest] = reason.split('\n');
  const formattedFirst = statusColour(first);
  const formattedRest = rest.map(line => chalk.grey(line));
  return [formattedFirst, ...formattedRest].join('\n');
}

function getStatusColour(status) {
  switch (status) {
    case MessageStatus.fail:
      return chalk.red;

    default:
      return chalk.yellow;
  }
}
;// CONCATENATED MODULE: ./src/linter/index.ts
function linter_ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function linter_objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { linter_ownKeys(Object(source), true).forEach(function (key) { linter_defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { linter_ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function linter_defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// @ts-expect-error
 // @ts-expect-error

 // @ts-expect-error


// @ts-expect-error
 // @ts-expect-error

 // @ts-expect-error










function linter_reportErrors(files, ctx) {
  if (!ctx.options.noReport) {
    printReport(files, ctx);
  }

  if (reportHasFatalErrors(files, ctx)) {
    if (ctx.options.noReport) {
      printReport(files, linter_objectSpread(linter_objectSpread({}, ctx), {}, {
        options: linter_objectSpread(linter_objectSpread({}, ctx.options), {}, {
          reportOnlyErrors: true
        })
      }));
    }

    console.log('Report has fatal errors');

    if (ctx.options.force) {
      console.log('Compiling using force option...');
    } else {
      process.exit();
    }
  }
}
async function linter_createReport(file, mdast, ctx) {
  const processor = unified().use(assertAssetExists).use(assertVideoAttributes).use(assertTaskAnswerStructure).use(assertWeblinkTarget).use(assertNoH1).use(lintLatex).use(lintAltText).use(lintLinkText);

  if (ctx.options.spelling) {
    const retextProcessor = unified().use(english).use(spell, {
      dictionary,
      max: 1
    });
    processor.use(remark2retext, retextProcessor);
  }

  await processor.run(mdast, file);
}
;// CONCATENATED MODULE: ./src/linter/assert-no-kbl.ts

function assert_no_kbl_assertNoKbl(file) {
  const md = file.contents;
  md.split('\n').forEach((line, idx) => {
    if (line.includes('kbl()')) {
      warnMessage(file, 'kbl() was found. Please note: table styles may not look the same in HTML output', {
        start: {
          line: idx + 1,
          column: 0
        },
        end: {
          line: idx + 1,
          column: line.length
        }
      });
    }
  });
}
;// CONCATENATED MODULE: ./src/linter/assert-no-tex-tabular.ts
 // TODO: could possibly try converting to array here
// https://stackoverflow.com/questions/51803244

function assert_no_tex_tabular_assertNoTexTabular(file) {
  const md = file.contents;
  md.split('\n').forEach((line, idx) => {
    if (line.includes('\\begin{tabular}')) {
      failMessage(file, 'LaTeX tables are not allowed, please use Markdown syntax', {
        start: {
          line: idx + 1,
          column: 0
        },
        end: {
          line: idx + 1,
          column: line.length
        }
      });
    }
  });
}
;// CONCATENATED MODULE: external "remark-autolink-headings"
const external_remark_autolink_headings_namespaceObject = require("remark-autolink-headings");
;// CONCATENATED MODULE: external "remark-directive"
const external_remark_directive_namespaceObject = require("remark-directive");
;// CONCATENATED MODULE: external "remark-footnotes"
const external_remark_footnotes_namespaceObject = require("remark-footnotes");
;// CONCATENATED MODULE: external "remark-frontmatter"
const external_remark_frontmatter_namespaceObject = require("remark-frontmatter");
;// CONCATENATED MODULE: external "remark-gfm"
const external_remark_gfm_namespaceObject = require("remark-gfm");
// EXTERNAL MODULE: ../node_modules/remark-parse/index.js
var remark_parse = __webpack_require__(3850);
;// CONCATENATED MODULE: external "remark-slug"
const external_remark_slug_namespaceObject = require("remark-slug");
;// CONCATENATED MODULE: external "mathjax-full/js/core/MathItem.js"
const MathItem_js_namespaceObject = require("mathjax-full/js/core/MathItem.js");
;// CONCATENATED MODULE: external "mathjax-full/js/handlers/html/HTMLDocument.js"
const HTMLDocument_js_namespaceObject = require("mathjax-full/js/handlers/html/HTMLDocument.js");
;// CONCATENATED MODULE: external "mathjax-full/js/input/mathml.js"
const mathml_js_namespaceObject = require("mathjax-full/js/input/mathml.js");
;// CONCATENATED MODULE: external "mathjax-full/js/output/svg.js"
const svg_js_namespaceObject = require("mathjax-full/js/output/svg.js");
;// CONCATENATED MODULE: external "speech-rule-engine"
const external_speech_rule_engine_namespaceObject = require("speech-rule-engine");
;// CONCATENATED MODULE: ./src/latex/mathjax-tex.ts









 // @ts-expect-error


function texToMml(tex = '') {
  const adaptor = liteAdaptor(); //  Busproofs requires an output jax, which we aren't using

  const packages = AllPackages.filter(name => name !== 'bussproofs');
  const input = new TeX({
    packages
  });
  const doc = new HTMLDocument('', adaptor, {
    InputJax: input
  });
  const node = doc.convert(tex, {
    end: STATE.CONVERT
  });
  const visitor = new SerializedMmlVisitor();
  return visitor.visitTree(node);
}
function mathjax_tex_mmlToSvg(mml) {
  const adaptor = liteAdaptor();
  RegisterHTMLHandler(adaptor);
  const input = new MathML();
  const output = new SVG({
    fontCache: 'local'
  });
  const doc = mathjax.document('', {
    InputJax: input,
    OutputJax: output
  });
  const node = doc.convert(mml, {
    em: 25
  });
  return adaptor.outerHTML(node);
}
function mathjax_tex_mmlToSpeech(mml) {
  return toSpeech(mml);
}
;// CONCATENATED MODULE: ./src/latex/directive-to-svg.ts
function directive_to_svg_ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function directive_to_svg_objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { directive_to_svg_ownKeys(Object(source), true).forEach(function (key) { directive_to_svg_defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { directive_to_svg_ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function directive_to_svg_defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }




function directive_to_svg_aliasDirectiveToSvg(ctx) {
  return tree => {
    visit(tree, 'textDirective', node => {
      if (!ctx.mmlStore || ctx.options.noTexSvg) {
        return;
      }

      switch (node.name) {
        case 'inlineMath':
        case 'blockMath':
          {
            const idx = getTexIdx(node);
            const mml = ctx.mmlStore[idx]; // console.log(mml);

            const svg = renderSvg(mml);

            const properties = directive_to_svg_objectSpread(directive_to_svg_objectSpread({}, svg.properties), {}, {
              className: node.name === 'inlineMath' ? 'inline-math' : 'block-math',
              id: getRefId(mml)
            });

            node.data = {
              hName: svg.tagName,
              hProperties: properties,
              hChildren: svg.children
            };
          }
      }
    });
  };
}

function getTexIdx(node) {
  return Number(node.children[0].value);
}

function getRefId(mml) {
  const match = mml.match(/<mtd.+?id="(.*?)"/);

  if (match === null) {
    return undefined;
  }

  return match[1];
}

function renderSvg(mml) {
  const label = mmlToSpeech(mml);
  const svg = mmlToSvg(mml);
  return createAccessibleSvg(svg, label);
}

function createAccessibleSvg(mathjaxSvg, label = '') {
  const tree = rehypeParser.parse(mathjaxSvg);
  const parent = tree.children[0];
  const svg = parent.children[0];
  const properties = svg.properties;
  const newProperties = {
    width: properties.width,
    height: properties.height,
    viewBox: properties.viewBox,
    role: 'img'
  };

  if (label !== '') {
    const uniqueId = `math-${Math.random().toString(16).slice(2)}`;
    newProperties['aria-labelledby'] = uniqueId;
    svg.children.unshift({
      type: 'element',
      tagName: 'title',
      properties: {
        id: uniqueId
      },
      children: [{
        type: 'text',
        value: label
      }]
    });
  }

  svg.properties = newProperties;
  return svg;
}
;// CONCATENATED MODULE: external "refractor"
const external_refractor_namespaceObject = require("refractor");
;// CONCATENATED MODULE: ./src/mdast/code-blocks.ts
// @ts-expect-error


function code_blocks_codeBlocks(ctx) {
  return async (tree, file) => {
    const codeBlocks = [];
    visit(tree, 'code', node => {
      codeBlocks.push(node);
    });

    for (const codeBlock of codeBlocks) {
      customCode(codeBlock, ctx, file);
    }
  };
}

function customCode(node, ctx, file) {
  // const { language, options, value } = parseCodeParams(node);
  const language = parseLanguage(node);
  const klass = parseClass(node);
  const meta = node.meta || '';
  const codeProps = {};

  if (meta !== '') {
    codeProps.className = meta;
  }

  const children = [];
  const trimmed = node.value.trim();

  if (ctx.options.noSyntaxHighlight || language === '') {
    children.push({
      type: 'text',
      value: trimmed
    });
  } else {
    children.push(...refractor.highlight(trimmed, language));
  }

  Object.assign(node, {
    type: 'custom-code',
    data: {
      hName: 'div',
      hProperties: {
        className: ['code-wrapper', klass]
      },
      hChildren: [klass !== 'r-output' ? null : {
        type: 'element',
        tagName: 'h6',
        properties: {
          className: 'r-console'
        },
        children: [{
          type: 'text',
          value: 'R Console'
        }]
      }, {
        type: 'element',
        tagName: 'pre',
        children: [{
          type: 'element',
          tagName: 'code',
          properties: codeProps,
          children
        }]
      }]
    }
  });
}

function parseLanguage(node) {
  const lang = node.lang || '';

  if (lang === 'plaintext' || lang.startsWith('{')) {
    return '';
  }

  return lang.toLowerCase();
}

function parseClass(node) {
  const lang = node.lang || '';

  if (!lang.startsWith('{.')) {
    return '';
  }

  return lang.slice(2, -1);
}
;// CONCATENATED MODULE: ./src/mdast/embed-asset-url.ts
const _excluded = (/* unused pure expression or super */ null && (["src"]));

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }



// import { failMessage } from '../utils/message';
function embed_asset_url_embedAssetUrl() {
  return async (tree, file) => {
    const dirname = file.dirname || ''; // if (dirname === undefined) {
    //   failMessage(file, `File dirname is undefined`);
    //   return;
    // }

    visit(tree, 'image', node => {
      node.url = getPath(node.url, dirname);
    }); // also fix for raw html nodes sometimes output by knitr

    visit(tree, ['html'], node => {
      const props = getProps(node.value);

      if (props !== null && props.src) {
        const {
          src
        } = props,
              otherProps = _objectWithoutProperties(props, _excluded);

        Object.assign(node, {
          type: 'image',
          url: getPath(src, dirname),
          value: '',
          data: otherProps
        });
      }
    });
  };
}

function getPath(url, dirname) {
  return path.isAbsolute(url) || url.startsWith('http') ? url : path.join(process.cwd(), dirname, url);
}

function getProps(value) {
  const matchImg = value.match(/^<img.*?src="(.+?)".*?>$/);

  if (matchImg !== null) {
    return propsToObject(value.slice(5, -1));
  }

  const matchPdf = value.match(/^<embed.*?src="(.+?)".*?>$/);

  if (matchPdf !== null) {
    return propsToObject(value.slice(7, -1));
  }

  return null;
}

function propsToObject(str) {
  return str.split(/(\w+)="(.*?)"/).filter(s => s.trim() !== '').reduce((acc, value, idx, arr) => {
    if (idx % 2 === 1) {
      const key = arr[idx - 1];
      acc[key] = value;
    }

    return acc;
  }, {});
}
;// CONCATENATED MODULE: ./src/mdast/images.ts
function images_ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function images_objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { images_ownKeys(Object(source), true).forEach(function (key) { images_defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { images_ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function images_defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }


function images_images() {
  let count = 0;
  return tree => {
    visit(tree, 'image', node => {
      template(node, ++count);
    });
  };
}

function template(node, count) {
  var _node$data;

  const image = {
    type: 'element',
    tagName: 'img',
    properties: {
      src: node.url,
      alt: node.alt
    },
    children: []
  };

  if ((_node$data = node.data) !== null && _node$data !== void 0 && _node$data.width) {
    image.properties = images_objectSpread(images_objectSpread({}, image.properties), {}, {
      style: `width: ${node.data.width};`
    });
  }

  const caption = createCaption(node, count);
  Object.assign(node, {
    type: 'custom-image',
    data: {
      hName: 'figure',
      hProperties: {
        className: ['img-wrapper']
      },
      hChildren: [image, caption]
    }
  });
}

function createCaption(node, count) {
  const result = {
    type: 'element',
    tagName: 'figcaption',
    children: [{
      type: 'element',
      tagName: 'span',
      properties: {
        className: 'caption-count'
      },
      children: [{
        type: 'text',
        value: `Figure ${count}`
      }]
    }]
  };
  const altText = node.alt || '';

  if (altText !== '' && !altText.includes('unnamed-chunk')) {
    const currentCaption = result.children[result.children.length - 1];
    currentCaption.value += ':';
    result.children.push({
      type: 'text',
      value: `${node.alt}`
    });
  }

  return result;
}
;// CONCATENATED MODULE: ./src/mdast/pagebreaks.ts

function pagebreaks_pagebreaks() {
  return async tree => {
    visit(tree, 'leafDirective', node => {
      if (node.name === 'pagebreak') {
        node.data = {
          hName: 'hr',
          hProperties: {
            className: 'pagebreak'
          }
        };
      }
    });
  };
}
;// CONCATENATED MODULE: ./src/mdast/youtube-videos.ts


function youtube_videos_youtubeVideos() {
  return async (tree, file) => {
    visit(tree, 'leafDirective', node => {
      if (node.name === 'video') {
        const attributes = node.attributes;
        const title = youtube_videos_getTitle(node, file);
        node.data = {
          hName: 'a',
          hProperties: {
            className: ['boxout', 'video'],
            href: getYoutubeUrl(attributes.id),
            title: attributes.title || null,
            target: '_blank'
          },
          hChildren: [{
            type: 'element',
            tagName: 'span',
            properties: {
              className: 'content'
            },
            children: [{
              type: 'element',
              tagName: 'span',
              properties: {
                className: 'type'
              },
              children: [{
                type: 'text',
                value: 'Video'
              }]
            }, {
              type: 'element',
              tagName: 'span',
              properties: {
                className: 'title'
              },
              children: [{
                type: 'text',
                value: title
              }]
            }, {
              type: 'element',
              tagName: 'span',
              properties: {
                className: 'duration'
              },
              children: [{
                type: 'element',
                tagName: 'strong',
                children: [{
                  type: 'text',
                  value: 'Duration'
                }]
              }, {
                type: 'text',
                value: formatDuration(attributes.duration)
              }]
            }]
          }, {
            type: 'element',
            tagName: 'span',
            properties: {
              className: 'thumbnail'
            },
            children: [{
              type: 'element',
              tagName: 'img',
              properties: {
                src: getYoutubeThumbnailUrl(attributes.id),
                alt: ''
              },
              children: []
            }]
          }]
        };
      }
    });
  };
}

function youtube_videos_getTitle(node, file) {
  const children = node.children;
  const firstChild = children[0];
  const title = (firstChild === null || firstChild === void 0 ? void 0 : firstChild.value) || '';

  if (title.trim() === '') {
    failMessage(file, 'Video has no title', node.position);
  }

  return title;
}

function getYoutubeUrl(id) {
  return `https://youtu.be/${id}`;
}

function getYoutubeThumbnailUrl(id) {
  return `http://img.youtube.com/vi/${id}/mqdefault.jpg`;
}

function formatDuration(duration = '') {
  const match = duration.match(/^(\d+)m(\d+)s$/);

  if (match === null) {
    return '';
  }

  return `${match[1]}:${match[2].padStart(2, '0')}`;
}
;// CONCATENATED MODULE: ./src/mdast/index.ts
// @ts-expect-error






 // @ts-expect-error









async function mdast_mdastPhase(file, ctx) {
  // https://github.com/unifiedjs/unified
  // convert markdown to syntax tree: complex transforms
  // should be more robust and straightforward
  const processor = unified() // third-party plugins:
  .use(markdown).use(directive).use(frontmatter).use(footnotes, {
    inlineNotes: true
  }).use(gfm) // .use(sectionize)
  .use(slug).use(headings, {
    content: createSvg('link-icon'),
    linkProperties: {
      className: 'link'
    }
  }) // custom plugins:
  .use(embedAssetUrl).use(youtubeVideos).use(aliasDirectiveToSvg, ctx).use(codeBlocks, ctx).use(images).use(pagebreaks);
  const parsed = processor.parse(file);
  return processor.run(parsed, file);
}
;// CONCATENATED MODULE: ./src/mdast/boxouts.ts




function boxouts_boxouts(refStore) {
  const counter = createCounter();
  return async tree => {
    visit(tree, 'containerDirective', node => {
      switch (node.name) {
        case 'example':
        case 'error':
        case 'supplement':
        case 'background':
        case 'definition':
        case 'weblink':
        case 'theorem':
        case 'task':
        case 'proposition':
        case 'answer':
          {
            const name = node.name;
            const count = counter.increment(name);
            node.data = {
              hProperties: createAttributes(node, count, refStore),
              hChildren: createBoxout(node, count)
            };
          }
      }
    });
  };
}

function createAttributes(node, count, refStore) {
  const name = node.name;
  const id = `${name}-${count}`;
  const attributes = node.attributes;
  const className = ['boxout', name];

  if (attributes.icon) {
    className.push(`${attributes.icon}-icon`);
  }

  if (node.attributes.label !== undefined) {
    refStore[node.attributes.label] = id;
  }

  return {
    className,
    id
  };
}

function createBoxout(node, count) {
  const typeTitle = createBoxoutType(node, count);
  const titles = [typeTitle];
  const titleValue = getTitleValue(node);

  if (titleValue.length > 0) {
    const title = boxouts_createTitle(node);
    titles.push(title);
  }

  const children = node.children;
  const content = children.filter(o => {
    var _o$data;

    return !((_o$data = o.data) !== null && _o$data !== void 0 && _o$data.directiveLabel);
  }).filter(o => o.type !== 'containerDirective' && o.name !== 'answer').map(o => toHast(o, {
    allowDangerousHtml: true
  })).filter(Boolean);

  if (node.name === 'task') {
    const answer = children.find(o => o.type === 'containerDirective' && o.name === 'answer');

    if (answer) {
      content.push(createAnswer(answer, count));
    }
  }

  return [...titles, ...content];
}

function createAnswer(node, count) {
  const {
    children
  } = toHast(node);
  return {
    type: 'element',
    tagName: 'div',
    properties: {
      className: ['answer']
    },
    children: [{
      type: 'element',
      tagName: 'span',
      properties: {
        className: ['answer-trigger'],
        'data-answer-id': count
      },
      children: [{
        type: 'text',
        value: 'Show answer'
      }]
    }, {
      type: 'element',
      tagName: 'div',
      properties: {
        className: ['answer-reveal'],
        id: `answer-${count}`
      },
      children
    }]
  };
}

function createBoxoutType(node, count) {
  const name = node.name;
  const label = startCase(name);
  let value = `${label} ${count}`;

  if (node.attributes.optional !== undefined) {
    value += ` (Optional)`;
  }

  return {
    type: 'element',
    tagName: 'span',
    properties: {
      className: ['type']
    },
    children: [{
      type: 'text',
      value
    }]
  };
}

function boxouts_createTitle(node) {
  return {
    type: 'element',
    tagName: 'h3',
    children: createTitleValue(node)
  };
}

function createTitleValue(node) {
  const name = node.name;
  const newRoot = {
    type: 'root',
    children: getTitleValue(node)
  };
  const {
    children = []
  } = toHast(newRoot);

  if (name !== 'weblink') {
    return children;
  }

  const {
    target
  } = node.attributes;
  return [{
    type: 'element',
    tagName: 'a',
    properties: {
      href: target,
      target: '_blank',
      className: ['target']
    },
    children
  }];
}

function getTitleValue(node) {
  var _parent$data;

  const children = node.children || [];
  const parent = children[0] || {};

  if (!((_parent$data = parent.data) !== null && _parent$data !== void 0 && _parent$data.directiveLabel)) {
    if (node.name === 'weblink') {
      const attributes = node.attributes;
      return [{
        type: 'text',
        value: attributes.target
      }];
    }

    return [];
  }

  return parent.children || [];
}
;// CONCATENATED MODULE: ./src/mdast/move-answers-to-end.ts

function move_answers_to_end_moveAnswersToEnd() {
  return tree => {
    visit(tree, 'containerDirective', (node, index, parent) => {
      // remove answer from task rehype
      if (node.name === 'task' && node.data) {
        const children = node.data.hChildren || [];
        node.data.hChildren = children.filter(o => o.name !== 'answer');
      }

      if (node.name === 'answer') {
        // these nodes have already been moved to the end
        if (node.movedToEnd) {
          return;
        } // remove answer block from task node


        const parentChildren = (parent === null || parent === void 0 ? void 0 : parent.children) || [];
        parentChildren.splice(index, 1); // add to root node

        const treeParent = tree;
        const treeChildren = treeParent.children || [];
        node.movedToEnd = true;
        treeChildren.push(node);
      }
    });
  };
}
;// CONCATENATED MODULE: ./src/mdast/combined.ts



async function combined_combinedMdastPhase(mdast, ctx, file, targetPdf) {
  const processor = unified().use(boxouts, ctx.refStore);

  if (targetPdf) {
    processor.use(moveAnswersToEnd);
  }

  return processor.run(mdast, file);
}
;// CONCATENATED MODULE: external "puppeteer"
const external_puppeteer_namespaceObject = require("puppeteer");
;// CONCATENATED MODULE: ./src/pdf/index.ts
 // const footerTemplate = `
//   <div style="font-size: 14px; padding-top: 20px; text-align: center; width: 100%;">
//     Page <span class="pageNumber"></span> of <span class="totalPages"></span>
//   </div>
// `;

async function pdf_convertToPdf(html) {
  const browser = await puppeteer.launch({
    headless: true,
    ignoreDefaultArgs: ['--disable-extensions'] // fix for windows

  });
  const page = await browser.newPage();
  await page.setContent(html);
  await page.evaluateHandle('document.fonts.ready');
  const pdf = await page.pdf({
    format: 'a4',
    printBackground: true,
    // displayHeaderFooter: true,
    // footerTemplate,
    margin: {
      top: '20px',
      left: '40px',
      right: '40px',
      bottom: '40px'
    }
  });
  await browser.close();
  return pdf;
}
;// CONCATENATED MODULE: external "os"
const external_os_namespaceObject = require("os");
;// CONCATENATED MODULE: external "markdown-table"
const external_markdown_table_namespaceObject = require("markdown-table");
;// CONCATENATED MODULE: ./src/pre-parse/reformat-pandoc-simple-tables.ts
 // @ts-expect-error


function reformat_pandoc_simple_tables_reformatPandocSimpleTables(contents) {
  const lines = contents.split(EOL); // operate on array backwards as length may change with transformation,
  // preserving index in loop

  for (var idx = lines.length - 1; idx >= 0; idx--) {
    const line = lines[idx];

    if (isValidPandocSimpleTableSeparator(line, idx)) {
      const {
        startIdx,
        count
      } = getTableBounds(lines, idx);
      const currentLines = lines.slice(startIdx, startIdx + count + 1);
      const newLines = convertLines(currentLines);
      lines.splice(startIdx, count + 1, ...newLines);
    }
  }

  return lines.join(EOL);
}

function isValidPandocSimpleTableSeparator(line, idx) {
  if (idx === 0 || !/-{2,}/g.test(line) || !/^[\s|-]+$/.test(line)) {
    return false;
  }

  return getColumnIndexes(line).length > 1;
}

function convertLines(lines) {
  const table = parseTable(lines);
  const align = getColumnAlignment(table[0]);
  const result = markdownTable(table, {
    align
  });
  return [...result.split(EOL), ''];
}

function getTableBounds(arr, idx) {
  const startIdx = idx - 1;
  const endIdx = arr.slice(startIdx).findIndex(l => l.trim() === '');
  const count = endIdx === -1 ? arr.length - 1 : endIdx;
  return {
    startIdx,
    count
  };
}

function parseTable(tableLines) {
  const [titles, separator, ...body] = tableLines;
  const columnIndexes = getColumnIndexes(separator);
  const titleCells = parseTitleRow(titles, columnIndexes);
  const bodyCells = body.map(line => parseBodyRow(line, columnIndexes)).reduce(multilineReducer, []);
  return [titleCells, ...bodyCells];
}

function getColumnIndexes(line) {
  return line.split('').reduce((acc, str, idx) => {
    if (str === '-' && (idx === 0 || line[idx - 1] === ' ')) {
      acc.push([idx]);
    } else if (idx !== line.length - 1 && str === ' ' && line[idx - 1] === '-') {
      acc[acc.length - 1].push(idx);
    }

    return acc;
  }, []);
}

function getColumnAlignment(titleCells) {
  return titleCells.map(title => {
    if (title[0] === ' ') {
      if (title[title.length - 1] === ' ') {
        return 'center';
      }

      return 'right';
    }

    return 'left';
  });
}

function parseTitleRow(line, columnIndexes) {
  return columnIndexes.map(tuple => line.slice(...tuple));
}

function parseBodyRow(line, columnIndexes) {
  return columnIndexes.map(tuple => {
    const end = tuple[1] === undefined ? tuple[1] : tuple[1] + 1;
    return line.slice(tuple[0], end).trim();
  });
}

function multilineReducer(acc, row) {
  if (row.some(cell => cell.trim() === '')) {
    const prevIdx = acc.length - 1;
    acc[prevIdx].forEach((cell, i) => {
      const trimmed = row[i].trim();

      if (trimmed !== '') {
        acc[prevIdx][i] = cell + ' ' + trimmed;
      }
    });
  } else {
    acc.push(row);
  }

  return acc;
}
;// CONCATENATED MODULE: ./src/pre-parse/index.ts




 // Some of the original coursework syntax can't easily be parsed by
// existing plugins for unified.js, so in a "pre-parse" phase
// I transform some syntax using regex so it can be parsed.
// A successful generic approach I found is to convert problem syntax to a
// custom markdown directive: https://github.com/remarkjs/remark-directive

function pre_parse_preParsePhase(file) {
  let result = file.contents;
  result = removeCommentedSections(result);
  result = escapeDollarsInCodeBlocks(result);
  result = allowNoWhitespaceBeforeHeading(result);
  result = convertMacroToDirective(result);
  result = convertTextBfToMd(result);
  result = convertUrlToMd(result);
  result = convertNewPageToDirective(result);
  result = reformatPandocSimpleTables(result);
  file.contents = result;
  return file;
}

function removeCommentedSections(md) {
  return md.replace(/<\!--.*?-->/g, '');
}

function escapeDollarsInCodeBlocks(md) {
  return md.replace(/(```.+?```)/gms, match => {
    return '\n' + match.replace(/\$/g, '\\$') + '\n';
  });
}
;// CONCATENATED MODULE: ./src/build-unit.ts
function build_unit_ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function build_unit_objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { build_unit_ownKeys(Object(source), true).forEach(function (key) { build_unit_defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { build_unit_ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function build_unit_defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }








 // import { warnOnIncludeGraphics } from './linter/warn-on-include-graphics';





async function build_unit_buildUnit(unit, ctx) {
  const mdasts = [];

  for (const file of unit.files) {
    const mdast = await inSituTransforms(file, ctx);
    await createReport(file, mdast, ctx);
    mdasts.push(mdast);
  }

  const unifiedFile = VFile();
  const result = {
    unit,
    md: combineMdFiles(unit),
    files: [...unit.files, unifiedFile]
  };
  const mdast = build_unit_combineMdastTrees(mdasts);

  if (!ctx.options.noHtml) {
    result.html = await syntaxTreeTransforms(mdast, unifiedFile, unit, ctx);
  }

  if (!ctx.options.noPdf) {
    const transformed = await syntaxTreeTransforms(mdast, unifiedFile, unit, ctx, true);
    result.pdf = build_unit_objectSpread(build_unit_objectSpread({}, transformed), {}, {
      pdf: await convertToPdf(transformed.html)
    });
  }

  if (!ctx.options.noReport) {
    reportErrors(result.files, ctx);
  }

  return result;
}

async function inSituTransforms(file, ctx) {
  // simple regex tests
  assertNoTexTabular(file);
  assertNoKbl(file); // warnOnIncludeGraphics(file);

  await knitr(file, ctx);
  preParsePhase(file);
  texToAliasDirective(file, ctx);
  return mdastPhase(file, ctx);
}

function combineMdFiles(unit) {
  return unit.files.map(o => o.contents).join('\n\n');
}

function build_unit_combineMdastTrees(mdasts) {
  return {
    type: 'root',
    children: mdasts.flatMap(o => o.children)
  };
}

async function syntaxTreeTransforms(_mdast, file, unit, ctx, targetPdf) {
  const mdast = await combinedMdastPhase(_mdast, ctx, file, targetPdf);
  const hast = await hastPhase(mdast, ctx, file, targetPdf);
  const html = await htmlPhase(hast, mdast, file, unit, ctx, targetPdf);
  return {
    mdast,
    hast,
    html
  };
}
;// CONCATENATED MODULE: external "js-yaml"
const external_js_yaml_namespaceObject = require("js-yaml");
;// CONCATENATED MODULE: external "yup"
const external_yup_namespaceObject = require("yup");
;// CONCATENATED MODULE: ./src/course/load-course.ts




const courseSchema = external_yup_namespaceObject.object().shape({
  title: external_yup_namespaceObject.string().required(),
  units: external_yup_namespaceObject.array().of(external_yup_namespaceObject.object().shape({
    src: external_yup_namespaceObject.string().required()
  }))
});
async function load_course_loadCourseYaml(dirPath) {
  const fileContents = await readFile(path.join(dirPath, 'course.yaml'));
  const course = yaml.load(fileContents);
  return courseSchema.validateSync(course);
}
;// CONCATENATED MODULE: ./src/course/load-unit.ts




const unitSchema = external_yup_namespaceObject.object().shape({
  name: external_yup_namespaceObject.string().required(),
  title: external_yup_namespaceObject.string().required(),
  content: external_yup_namespaceObject.array().of(external_yup_namespaceObject.object().shape({
    src: external_yup_namespaceObject.string().required()
  }))
});
async function load_unit_loadUnitYaml(dirPath, src) {
  const fileContents = await readFile(path.join(dirPath, src));
  const unit = yaml.load(fileContents);
  return unitSchema.validateSync(unit);
}
;// CONCATENATED MODULE: ./src/course/index.ts
function course_ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function course_objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { course_ownKeys(Object(source), true).forEach(function (key) { course_defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { course_ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function course_defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }


 // @ts-expect-error




async function course_collectCoursework(dirPath) {
  const course = await loadCourseYaml(dirPath);
  const units = await Promise.all(course.units.map(unit => collectUnit(unit, course, dirPath)));
  return course_objectSpread(course_objectSpread({}, course), {}, {
    units
  });
}

async function collectUnit(unit, course, dirPath) {
  const yaml = await loadUnitYaml(dirPath, unit.src);
  const parts = yaml.content;
  const files = await Promise.all(yaml.content.map(c => {
    const filePath = path.join(dirPath, unit.src, '..', c.src);
    return toVFile.read(filePath, 'utf-8');
  }));
  const titles = getUnitTitles({
    courseTitle: course.title,
    unitName: yaml.name,
    unitTitle: yaml.title
  });
  return course_objectSpread(course_objectSpread({}, yaml), {}, {
    parts,
    files,
    titles
  });
}

function getUnitTitles({
  courseTitle,
  unitName,
  unitTitle
}) {
  return {
    courseTitle,
    unitTitle: `${unitName}: ${unitTitle}`,
    unitName,
    docTitle: `${unitTitle} | ${courseTitle}`,
    fileName: kebabCase(unitName)
  };
}
;// CONCATENATED MODULE: ./src/context.ts


async function context_createContext(dirPath, options = {}) {
  return {
    course: await collectCoursework(dirPath),
    dirPath,
    buildDir: getBuildDir(dirPath),
    cacheDir: getCacheDir(dirPath),
    options,
    refStore: {}
  };
}
;// CONCATENATED MODULE: ./src/utils/check-for-latest-version.ts


const repo = 'UofGAnalytics/build-coursework';
async function check_for_latest_version_checkForLatestVersion() {
  if (false) {}

  const response = await fetch(`https://api.github.com/repos/${repo}/releases/latest`);
  const json = await response.json();
  const latestTag = json.tag_name.replace('v', '');
  const currentVersion = "1.1.8";

  if (latestTag !== currentVersion) {
    console.log(chalk.yellow.bold('New version available'));
    console.log(chalk.yellow(`Current version: ${currentVersion}`));
    console.log(chalk.yellow(`Latest version: ${latestTag}`));
    console.log(chalk.yellow(`Run the following command to update:`));
    console.log(chalk.yellow(`npm install -g ${repo}`));
    console.log('');
  }
}
;// CONCATENATED MODULE: ./src/index.ts







async function rMarkdown(dirPath, options = {}) {
  await checkForLatestVersion();
  const timer = createTimer();
  const ctx = await createContext(dirPath, options);
  const result = [];

  if (ctx.options.week) {
    // write single week
    const idx = ctx.options.week - 1;
    const input = ctx.course.units[idx];

    if (input === undefined) {
      const courseYaml = path.join(ctx.dirPath, 'course.yaml');
      throw new Error(`Week ${ctx.options.week} not found in ${courseYaml}`);
    }

    const built = await buildUnit(input, ctx);
    await writeUnit(built, ctx, timer);
    result.push(built);
  } else {
    // write full course
    for (const input of ctx.course.units) {
      const built = await buildUnit(input, ctx);
      await writeUnit(built, ctx, timer);
      result.push(built);
    }
  }

  return result;
}

async function writeUnit(built, ctx, timer) {
  if (ctx.options.noWrite) {
    return;
  }

  await mkdir(ctx.buildDir);
  const filePath = path.join(ctx.buildDir, built.unit.titles.fileName);

  if (built.html) {
    await writeFile(filePath + '.html', built.html.html);
    const status = chalk.green.bold(`Complete in ${timer.seconds()}s`);
    console.log(`✨ ${status} ${filePath}.html`);
  }

  if (built.pdf) {
    await writeFile(filePath + '.pdf', built.pdf.pdf); // debug
    // await writeFile(filePath + '.pdf.html', built.pdf.html);

    const status = chalk.green.bold(`Complete in ${timer.seconds()}s`);
    console.log(`✨ ${status} ${filePath}.pdf`);
  }
}
})();

/******/ })()
;