/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

define([], function () {
  // This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

/**
 * @class DOMinator
 * @author Shane Tomlinson shane@shanetomlinson.com
 * @version 0.0.3
 */

  'use strict';

  /*global document*/

  var DOMinator = {
    /**
     * Fill the DOMinator object with elements matched by the the selector.
     *
     * @method fill
     * @param {String} selector Selector to match
     * @return {Collection} DOMinator collection
     */
    fill: function (selector) {
      var els = getElements(selector);

      els.forEach(function (item, index) {
        this[index] = item;
      }, this);
      this.length = els.length;

      return this;
    },

    /**
     * Get the nth object in the set.
     *
     * @method nth
     * @param {Number} index Item index
     * @return {Element} element, if it exists in the set
     */
    nth: function (index) {
      return this[index];
    },

    /**
     * Get all the children of all the elements in the set.
     *
     * @method children
     * @return {Collection} DOMinator collection
     */
    children: function () {
      return toDOMinator(flatten(this.toArray().map(function (element) {
        return element.childNodes;
      })));
    },

    /**
     * Get the nth child of all the children of all the elements in the set.
     *
     * @method nthChild
     * @param {Number} index Item index
     * @return {Element} element, if it exists in the set
     */
    nthChild: function (index) {
      return this.children()[index];
    },

    /**
     * Find descendent elements.
     *
     * @method find
     * @param {String} selector Selector to match
     * @return {Collection} DOMinator collection
     */
    find: function (selector) {
      return toDOMinator(flatten(this.toArray().map(function (element) {
        return element.querySelectorAll(selector);
      })));
    },

    /**
     * Find descendent elements and include the root if it.
     * matches the selector.
     *
     * @method findIncludeRoot
     * @param {String} selector Selector to match
     * @return {Collection} DOMinator collection
     */
    findIncludeRoot: function (selector) {
      var els = [].slice.call(this.find(selector), 0);

      this.forEach(function (element) {
        if (toDOMinator(element).is(selector)) {
          // TODO, this is going to put elements on the front in reverse order.
          els.unshift(element);
        }
      });

      return toDOMinator(els);
    },

    /**
     * Check if the first element of the set matches the selector.
     *
     * @method is
     * @param {String} selector Selector to match
     * @return {Boolean} true if element matches the selector, false otw.
     */
    is: function (type) {
      if (isEmpty(this)) return false;

      var haystack = toDOMinator(type).toArray();
      return haystack.indexOf(this[0]) > -1;
    },

    /**
     * Find the closest ancestor of the first element of the set
     * that matches the selector.
     *
     * @method closest
     * @param {String} selector Selector to match
     * @return {Element}
     */
    closest: function (selector) {
      var target = this[0];

      while (target) {
        var chained = toDOMinator(target);
        if (chained.is(selector)) return chained;
        target = target.parentNode;
      }
    },

    /**
     * Remove the set of elements from the DOM.
     *
     * @method remove
     */
    remove: function () {
      return this.forEach(function (element) {
        element.parentNode.removeChild(element);
      });
    },

    /**
     * Add a DOM event handler to the set of elements.
     *
     * @method on
     * @param {String} eventName DOM event name
     * @param {Function} callback Callback to call
     * @param {Boolean} bubble Handle during bubble phase
     * @return {Collection} DOMinator collection
     */
    on: function (eventName, callback, bubble) {
      return this.forEach(function (element) {
        element.addEventListener(eventName, callback, bubble);
      });
    },


    /**
     * Add a DOM event handler that is run once.
     *
     * @method once
     * @param {String} eventName DOM event name
     * @param {Function} callback Callback to call
     * @param {Boolean} bubble Handle during bubble phase
     * @return {Collection} DOMinator collection
     */
    once: function (eventName, callback, bubble) {
      return this.forEach(function (element) {
        element.addEventListener(eventName, function handler(event) {
          element.removeEventListener(eventName, handler, bubble);
          callback(event);
        }, bubble);
      });
    },

    /**
     * Remove a DOM event handler from the set of elements.
     *
     * @method off
     * @param {String} eventName DOM event name
     * @param {Function} callback Callback to call
     * @param {Boolean} bubble Handle during bubble phase
     * @return {Collection} DOMinator collection
     */
    off: function (eventName, callback, bubble) {
      return this.forEach(function (element) {
        element.removeEventListener(eventName, callback, bubble);
      });
    },

    /**
     * Fire a synthetic event on the set of elements.
     *
     * @method trigger
     * @param {String} type Type of event to fire
     * @return {Collection} DOMinator collection
     */
    trigger: function (type) {
      return this.forEach(function (element) {
        var event = document.createEvent('CustomEvent');
        event.initCustomEvent(type, true, true, undefined);
        element.dispatchEvent(event);
      });
    },

    /**
     * Get/Set the innerHTML or value of an element.
     *
     * @method html
     * @param {String} value innerHTML or value
     * @return {Collection} DOMinator collection
     */
    html: function (value) {
      if (arguments.length === 0) {
        var target = this[0];
        if (! target) return;

        return target.innerHTML;
      }

      return this.forEach(function (element) {
        element.innerHTML = value;
      });
    },

    /**
     * Get/Set the value of an input/textarea
     *
     * @method val
     * @param {String} value
     * @return {Collection} DOMinator collection
     */
    val: function (value) {
      if (arguments.length === 0) {
        var target = this[0];
        if (! target) return;

        if(! isValBased(target)) {
          throw new Error('cannot get the value of a non-value based element');
        }

        return target.value;
      }

      return this.forEach(function (element) {
        if(! isValBased(element)) {
          throw new Error('cannot set the value of a non-value based element');
        }

        element.value = value;
      });
    },

    /**
     * Remove all children from the set of elements.
     *
     * @method empty
     * @return {Collection} DOMinator collection
     */
    empty: function () {
      return this.forEach(function (element) {
        toDOMinator(element).html('');
      });
    },

    /**
     * Get/Set an attribute on the set of elements.
     *
     * @method attr
     * @param {String} attrName Attribute name
     * @param {String} value (optional) attribute value
     */
    attr: function (attrName, value) {
      if (arguments.length === 1) {
        var element = this[0];
        if (! element) return;
        return element.getAttribute(attrName);
      }

      return this.forEach(function (element) {
        element.setAttribute(attrName, value);
      });
    },

    /**
     * Check if the first element in the set has an attribute.
     *
     * @method hasAttr
     * @param {String} attrName Attribute name
     * @return {Boolean} true if first element in set has the attribute.
     */
    hasAttr: function (attrName) {
      if (isEmpty(this)) return false;
      return !! this[0].hasAttribute(attrName);
    },

    /**
     * Remove the attribute from all elements in the set.
     *
     * @method removeAttr
     * @param {String} attrName Attribute name
     * @return {Collection} DOMinator collection
     */
    removeAttr: function (attrName) {
      return this.forEach(function (element) {
        element.removeAttribute(attrName);
      });
    },

    /**
     * Add a class to all elements in the set.
     *
     * @method addClass
     * @param {String} className Class name
     * @return {Collection} DOMinator collection
     */
    addClass: function (className) {
      return this.forEach(function (element) {
        element.classList.add(className);
      });
    },

    /**
     * Remove a class from all elements in the set.
     *
     * @method removeClass
     * @param {String} className Class name
     * @return {Collection} DOMinator collection
     */
    removeClass: function (className) {
      return this.forEach(function (element) {
        element.classList.remove(className);
      });
    },

    /**
     * Check if the first element in the set has a class name.
     *
     * @method hasClass
     * @param {String} className Class name
     * @return {Boolean} true if first element has the class name, false otw.
     */
    hasClass: function (className) {
      if (isEmpty(this)) return false;
      return this[0].classList.contains(className);
    },

    /**
     * Iterate over the elements.
     *
     * @method forEach
     * @param {Function} iterator Iterator function
     * @param {Object} context Context to use when calling `iterator`
     * @return {Collection} DOMinator collection
     */
    forEach: function (callback, context) {
      [].forEach.call(this, callback, context);
      return this;
    },

    /**
     * Run map over the set of elements.
     *
     * @method map
     * @param {Function} iterator Iterator function
     * @param {Object} context Context to use when calling `iterator`
     * @return {Array} map results
     */
    map: function (callback, context) {
      return [].map.call(this, callback, context);
    },

    /**
     * Append an element to all elements in the set.
     *
     * @method append
     * @param {String} elementToAppend HTML or element to append
     * @return {Collection} DOMinator collection
     */
    append: function (elementToAppend) {
      return this.forEach(function (parent) {
        toDOMinator(elementToAppend).forEach(function (element) {
          parent.appendChild(element);
        });
      });
    },

    /**
     * Append the current set of elements to another element.
     *
     * @method appendTo
     * @param {String} elementToAppendTo Element to append to
     * @return {Collection} DOMinator collection
     */
    appendTo: function (elementToAppendTo) {
      var parentNode = toDOMinator(elementToAppendTo)[0];
      if (! parentNode) return;

      return this.forEach(function (element) {
        parentNode.appendChild(element);
      });
    },

    /**
     * Insert the current set of elements after another element.
     *
     * @method insertAfter
     * @param {String} elementToInsertAfter Element to insert after
     * @return {Collection} DOMinator collection
     */
    insertAfter: function (elementToInsertAfter) {
      var insertAfter = toDOMinator(elementToInsertAfter)[0];
      if (! insertAfter) return;

      var insertBefore = insertAfter.nextChild || null;
      var parentNode = insertAfter.parentNode;

      return this.forEach(function (element) {
        parentNode.insertBefore(element, insertBefore);
      });
    },

    /**
     * Insert the current set of elements before another element.
     *
     * @method insertBefore
     * @param {String} elementToInsertBefore Element to insert before
     * @return {Collection} DOMinator collection
     */
    insertBefore: function (elementToInsertBefore) {
      var insertBefore = toDOMinator(elementToInsertBefore)[0];
      if (! insertBefore) return;

      var parentNode = insertBefore.parentNode;

      return this.forEach(function (element) {
        parentNode.insertBefore(element, insertBefore);
      });
    },

    /**
     * Insert the current set of elements as the Nth child of another element.
     *
     * @method insertAsNthChild
     * @param {String} parent Parent element
     * @param {Number} index Index where to insert
     * @return {Collection} DOMinator collection
     */
    insertAsNthChild: function (parent, index) {
      var nthChild = toDOMinator(parent).nthChild(index);
      if (! nthChild) return;

      return this.forEach(function (element) {
        nthChild.parentElement.insertBefore(element, nthChild);
      });
    },

    /**
     * Focus the first element in the set.
     *
     * @method focus
     * @return {Collection} DOMinator collection
     */
    focus: function () {
      if (isEmpty(this)) return;

      this[0].focus();
      return this;
    },

    /**
     * Show all elements in the set by setting 'display: block'.
     *
     * @method show
     * @return {Collection} DOMinator collection
     */
    show: function () {
      return this.style('display', 'block');
    },

    /**
     * Hide all elements in the set by setting 'display: none'.
     *
     * @method hide
     * @return {Collection} DOMinator collection
     */
    hide: function () {
      return this.style('display', 'none');
    },

    /**
     * Set a style on all elements in the set.
     *
     * @method style
     * @param {String} name Style name
     * @param {String} value Style value
     * @return {Collection} DOMinator collection
     */
    style: function (name, value) {
      return this.forEach(function (element) {
        element.style[name] = value;
      });
    },

    /**
     * Convert the set to an Array.
     *
     * @method toArray
     * @return {Array}
     */
    toArray: function () {
      return [].slice.call(this, 0);
    }
  };

  function flatten(array) {
    return [].reduce.call(array, function (prevValue, currValue) {
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

  function isEmpty(dominator) {
    return !dominator.length;
  }

  function toDOMinator(selector) {
    var dom = Object.create(DOMinator);
    dom.fill(selector);
    return dom;
  }

  return toDOMinator;



});

