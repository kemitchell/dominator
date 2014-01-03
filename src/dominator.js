/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
window.DOMinator = (function() {
  'use strict';

  /*global document*/

  function flatten(array) {
    return [].reduce.call(array, function(prevValue, currValue) {
      return prevValue.concat([].slice.call(currValue, 0));
    }, []);
  }

  function isString(itemToCheck) {
    return '[object String]' === Object.prototype.toString.apply(itemToCheck);
  }

  function getElements(selector) {
    if ( ! selector) return [];

    if (isString(selector)) {
      selector = selector.trim();
      if (selector[0] === "<") {
        // HTML was specified! Create the elements
        var element = document.createElement('div');
        element.innerHTML = selector;
        return getElements(element.childNodes);
      }

      // Just a normal selector
      return getElements(document.querySelectorAll(selector));
    }

    // an array or array-like object, make a copy or convert to an array.
    if ('length' in selector)
        return [].slice.call(selector, 0);

    return [ selector ];
  }

  function isValBased(target) {
    var elName = target.nodeName.toLowerCase();
    return elName === 'input' || elName === 'textarea';
  }

  function toDOMinator(selector) {
    var dom = Object.create(DOMinator);
    dom.init(selector);
    return dom;
  }

  function isEmpty(dominator) {
    return !dominator.length;
  }

  var DOMinator = {
    init: function(selector) {
      var els = getElements(selector);

      els.forEach(function(item, index) {
        this[index] = item;
      }, this);
      this.length = els.length;

      return this;
    },

    nth: function(index) {
      return this[index];
    },

    children: function() {
      return toDOMinator(flatten(this.toArray().map(function(element) {
        return element.childNodes;
      })));
    },

    nthChild: function(index) {
      return this.children()[index];
    },

    find: function(selector) {
      return toDOMinator(flatten(this.toArray().map(function(element) {
        return element.querySelectorAll(selector);
      })));
    },

    findIncludeRoot: function(selector) {
      var els = [].slice.call(this.find(selector), 0);

      this.forEach(function(element) {
        if (toDOMinator(element).is(selector)) {
          // TODO, this is going to put elements on the front in reverse order.
          els.unshift(element);
        }
      });

      return toDOMinator(els);
    },

    is: function(type) {
      if (isEmpty(this)) return false;

      var haystack = toDOMinator(type).toArray();
      return haystack.indexOf(this[0]) > -1;
    },

    closest: function(selector) {
      var target = this[0];

      while (target) {
        var chained = toDOMinator(target);
        if (chained.is(selector)) return chained;
        target = target.parentNode;
      }
    },

    remove: function() {
      return this.forEach(function(element) {
        element.parentNode.removeChild(element);
      });
    },

    bindEvent: function(eventName, callback, bubble) {
      return this.forEach(function(element) {
        element.addEventListener(eventName, callback, bubble);
      });
    },

    unbindEvent: function(eventName, callback, bubble) {
      return this.forEach(function(element) {
        element.removeEventListener(eventName, callback, bubble);
      });
    },

    fireEvent: function(type) {
      return this.forEach(function(element) {
        var event = document.createEvent('CustomEvent');
        event.initCustomEvent(type, true, true, undefined);
        element.dispatchEvent(event);
      });
    },

    inner: function(value) {
      if (arguments.length === 0) {
        var target = this[0];
        if (! target) return;

        if(isValBased(target)) {
            return target.value;
        }

        return target.innerHTML;
      }

      return this.forEach(function(element) {
        if(isValBased(element)) {
          element.value = value;
        }
        else {
          element.innerHTML = value;
        }
      });
    },

    empty: function() {
      return this.forEach(function(element) {
        toDOMinator(element).inner('');
      });
    },

    attr: function(attrName, value) {
      if (arguments.length === 1) {
        var element = this[0];
        if (! element) return;
        return element.getAttribute(attrName);
      }

      return this.forEach(function(element) {
        element.setAttribute(attrName, value);
      });
    },

    hasAttr: function(attrName) {
      if (isEmpty(this)) return false;
      return !! this[0].hasAttribute(attrName);
    },

    removeAttr: function(attrName) {
      return this.forEach(function(element) {
        element.removeAttribute(attrName);
      });
    },

    addClass: function(className) {
      return this.forEach(function(element) {
        element.classList.add(className);
      });
    },

    removeClass: function(className) {
      return this.forEach(function(element) {
        element.classList.remove(className);
      });
    },

    hasClass: function(className) {
      if (isEmpty(this)) return false;
      return this[0].classList.contains(className);
    },

    append: function(elementToAppend) {
      return this.forEach(function(parent) {
        toDOMinator(elementToAppend).forEach(function(element) {
          parent.appendChild(element);
        });
      });
    },

    forEach: function(callback, context) {
      [].forEach.call(this, callback, context);
      return this;
    },

    appendTo: function(elementToAppendTo) {
      var parentNode = toDOMinator(elementToAppendTo)[0];
      if (! parentNode) return;

      return this.forEach(function(element) {
        parentNode.appendChild(element);
      });
    },

    insertAfter: function(elementToInsertAfter) {
      var insertAfter = toDOMinator(elementToInsertAfter)[0];
      if (! insertAfter) return;

      var insertBefore = insertAfter.nextChild || null;
      var parentNode = insertAfter.parentNode;

      return this.forEach(function(element) {
        parentNode.insertBefore(element, insertBefore);
      });
    },

    insertBefore: function(elementToInsertBefore) {
      var insertBefore = toDOMinator(elementToInsertBefore)[0];
      if (! insertBefore) return;

      var parentNode = insertBefore.parentNode;

      return this.forEach(function(element) {
        parentNode.insertBefore(element, insertBefore);
      });
    },

    insertAsNthChild: function(parent, index) {
      var nthChild = toDOMinator(parent).nthChild(index);
      if (! nthChild) return;

      return this.forEach(function(element) {
        nthChild.parentElement.insertBefore(element, nthChild);
      });
    },

    focus: function() {
      if (isEmpty(this)) return;

      this[0].focus();
      return this;
    },

    show: function() {
      return this.style('display', 'block');
    },

    hide: function() {
      return this.style('display', 'none');
    },

    style: function(name, value) {
      return this.forEach(function(element) {
        element.style[name] = value;
      });
    },

    toArray: function() {
      return [].slice.call(this, 0);
    }
  };

  return toDOMinator;

}());

