/**
* A DOM Manipulation adapter for using native DOM.
* Works great IE10+
* @class window.DOMinator
* @static
*/
window.DOMinator = (function(undefined) {
    function flatten(array) {
      return array.reduce(function(prevValue, currValue) {
        return prevValue.concat(currValue);
      }, []);
    }

    function isString(itemToCheck) {
      return '[object String]' === Object.prototype.toString.apply(itemToCheck);
    }

    function isArray(itemToCheck) {
      return '[object Array]' === Object.prototype.toString.apply(itemToCheck);
    }

    var DOM = {
        /**
        * Get a set of elements that match the selector
        * @method getElements
        * @param {selector || element} selector - if a string, a selector to search for.
        * @return {array} array of elements
        */
        getElements: function(selector) {
            if (! selector) return [];

            if (isString(selector))
                return DOM.getElements(document.querySelectorAll(selector));

            // already an array, just return the array.
            if (isArray(selector))
                return selector;

            // an array-like object, conver to an array.
            if ('length' in selector)
                return [].slice.call(selector, 0);

            return [ selector ];
        },

        /**
        * Get the nth element
        * @method getNthElement
        * @param {selector || element} selector - element to search for
        * @param {number} index - index
        * @return {element} the nth element, if it exists.
        */
        getNthElement: function(selector, index) {
            return DOM.getElements(selector)[ index ];
        },

        /**
        * Get a set of descendent elements that match the selector
        * @method getDescendentElements
        * @param {string} selector - The selector to search for.
        * @param {element} root - root node to search from
        * @return {array} array of elements
        */
        getDescendentElements: function(selector, root) {
            return flatten(DOM.getElements(root).map(function(element) {
                return DOM.getElements(element.querySelectorAll(selector));
            }));
        },

        /**
        * Get a set of descendent elements that match the selector, include the root node if it
        *   matches the selector
        * @method getElementsIncludeRoot
        * @param {string} selector - The selector to search for.
        * @param {element} root - root node to search from
        * @return {array} array of elements
        */
        getElementsIncludeRoot: function(selector, root) {
            var els = DOM.getDescendentElements(selector, root);
            if(DOM.is(root, selector)) {
                els.unshift(root);
            }
            return flatten(els);
        },

        /**
        * Get the children for an element
        * @method getChildren
        * @param {selector || element} selector - element to get children for
        * @return {array} an array of children
        */
        getChildren: function(selector) {
            return flatten(DOM.getElements(selector).map(function(element) {
                return DOM.getElements(element.childNodes);
            }));
        },

        /**
        * Get the nth child element
        * @method getNthChild
        * @param {selector || element} selector - element to get children for
        * @param {number} index - index of the child to get
        * @return {element} the nth child if it exists.
        */
        getNthChild: function(selector, index) {
            return DOM.getChildren(selector)[ index ];
        },

        /**
        * Find the closest ancestor that matches the selector
        * @method closest
        * @param {selector || element} selector - element to get children for
        * @param {selector || element} searchFrom - element to search from
        * @return {array} The closest ancestor matching the selector
        */
        closest: function(selector, searchFrom) {
          var target = DOM.getNthElement(searchFrom, 0);

          while (target) {
            if (DOM.is(target, selector)) return target;
            target = target.parentNode;
          }
        },

        /**
        * Iterate over a set of elements
        * @method forEach
        * @param {Elements} elements - elements to iterate over
        * @param {function} callback - callback to call.  Callback called with: callback(element, index);
        * @param {context} context - context to callback in
        */
        forEach: function(elements, callback, context) {
            DOM.getElements(elements).forEach(function(element, index) {
                callback.call(context, element, index);
            });
        },

        /**
        * Remove an element
        * @method removeElement
        * @param {selector || element} selector - element to remove
        */
        removeElement: function(selector) {
            DOM.forEach(selector, function(element) {
                element.parentNode.removeChild(element);
            });
        },

        /**
        * Bind to an elements DOM Event
        * @method bindEvent
        * @param {selector || element} element to bind on
        * @param {string} eventName - name of event
        * @param {function} callback - callback to call
        */
        bindEvent: function(selector, eventName, callback) {
            DOM.forEach(selector, function(element) {
                element.addEventListener(eventName, callback, false);
            });
        },

        /**
        * Unbind an already bound DOM Event from an element.
        * @method unbindEvent
        * @param {selector || element} element to unbind from
        * @param {string} eventName - name of event
        * @param {function} callback - callback
        */
        unbindEvent: function(selector, eventName, callback) {
            DOM.forEach(selector, function(element) {
                element.removeEventListener(eventName, callback, false);
            });
        },

        /**
        * Fire a DOM event on an element
        * @method fireEvent
        * @param {selector || element} element
        * @param {string} type - event to fire
        */
        fireEvent: function(selector, type) {
            DOM.forEach(selector, function(element) {
                var event = document.createEvent('CustomEvent');
                event.initCustomEvent(type, true, true, undefined);
                element.dispatchEvent(event);
            });
        },

        /**
        * Set the inner value of an element, including input elements
        * @method setInner
        * @param {selector || element} element - element to set
        * @param {string} value - value to set
        */
        setInner: function(selector, value) {
            DOM.forEach(selector, function(element) {
                if(isValBased(element)) {
                    element.value = value;
                }
                else {
                    element.innerHTML = value;
                }
            });
        },

        /**
        * Get the inner value of an element, including input elements
        * @method getInner
        * @param {selector || element} element
        * @return {string} inner value of the element
        */
        getInner: function(selector) {
            var target = DOM.getNthElement(selector, 0);
            if (! target) return;

            if(isValBased(target)) {
                return target.value;
            }

            return target.innerHTML;
        },

        /**
        * Set an element's attribute.
        * @method setAttr
        * @param {selector || element} element
        * @param {string} attrName - the attribute name
        * @param {string} value - value to set
        */
        setAttr: function(selector, attrName, value) {
            DOM.forEach(selector, function(element) {
                element.setAttribute(attrName, value);
            });
        },

        /**
        * Get an element's attribute.
        * @method getAttr
        * @param {selector || element} element
        * @param {string} attrName - the attribute name
        * @return {string} attribute's value
        */
        getAttr: function(selector, attrName) {
            var element = DOM.getNthElement(selector, 0);
            if (! element) return;
            return element.getAttribute(attrName);
        },

        /**
        * Check if the first matched element has an attribute.
        * @method hasAttr
        * @param {selector || element} element
        * @param {string} attrName - the attribute name
        * @return {boolean} true if the element has the attribute, false otw.
        */
        hasAttr: function(selector, attrName) {
            var element = DOM.getNthElement(selector, 0);
            if (! element) return false;
            return !! element.hasAttribute(attrName);
        },

        /**
        * Remove an attribute from an element.
        * @method removeAttr
        * @param {selector || element} element
        * @param {string} attrName - the attribute to remove
        */
        removeAttr: function(selector, attrName) {
            DOM.forEach(selector, function(element) {
              element.removeAttribute(attrName);
            });
        },

        /**
        * Add a class to an element
        * @method addClass
        * @param {selector || element} element
        * @param {string} className
        */
        addClass: function(selector, className) {
            DOM.forEach(selector, function(element) {
                element.classList.add(className);
            });
        },

        /**
        * Remove a class from an element
        * @method removeClass
        * @param {selector || element} element
        * @param {string} className
        */
        removeClass: function(selector, className) {
            DOM.forEach(selector, function(element) {
                element.classList.remove(className);
            });
        },

        /**
        * Check if an element has a class
        * @method hasClass
        * @param {selector || element} element
        * @param {string} className
        * @return {boolean} true if element has class, false otw.
        */
        hasClass: function(selector, className) {
            var element = DOM.getNthElement(selector, 0);
            if (! element) return false;
            return element.classList.contains(className);
        },

        /**
        * Create an element
        * @method createElement
        * @param {string} type - element type
        * @param {string} html (optional) - inner HTML
        * @return {element} created element
        */
        createElement: function(type, html) {
            var element = document.createElement(type);
            if(html) {
                DOM.setInner(element, html);
            }
            return element;
        },

        /**
        * Append an element as the last child of another element
        * @method appendTo
        * @param {selector || element} elementToInsert
        * @param {selector || element} elementToAppendTo
        */
        appendTo: function(elementToInsert, elementToAppendTo) {
            var parentNode = DOM.getNthElement(elementToAppendTo, 0);
            if (! parentNode) return;

            DOM.forEach(elementToInsert, function(element) {
                parentNode.appendChild(element);
            });
        },

        /**
        * Insert an element after another element
        * @method insertAfter
        * @param {selector || element} elementToInsert
        * @param {selector || element} elementToInsertBefore
        */
        insertAfter: function(elementToInsert, elementToInsertAfter) {
            var insertAfter = DOM.getNthElement(elementToInsertAfter, 0);
            if (! insertAfter) return;

            var insertBefore = insertAfter.nextChild || null;
            var parentNode = insertAfter.parentNode;

            DOM.forEach(elementToInsert, function(element) {
                parentNode.insertBefore(element, insertBefore);
            });
        },

        /**
        * Insert an element before another element
        * @method insertBefore
        * @param {selector || element} elementToInsert
        * @param {selector || element} elementToInsertBefore
        */
        insertBefore: function(elementToInsert, elementToInsertBefore) {
            var insertBefore = DOM.getNthElement(elementToInsertBefore, 0);
            if (! insertBefore) return;

            var parentNode = insertBefore.parentNode;

            DOM.forEach(elementToInsert, function(element) {
                parentNode.insertBefore(element, insertBefore);
            });
        },

        /**
        * Insert as the nth child of an element
        * @method insertAsNthChild
        * @param {selector || element} elementToInsert
        * @param {selector || element} parent
        * @param {number} index
        */
        insertAsNthChild: function(elementToInsert, parent, index) {
            var nthChild = DOM.getNthChild(parent, index);
            if (! nthChild) return;

            DOM.forEach(elementToInsert, function(element) {
                nthChild.parentElement.insertBefore(element, nthChild);
            });
        },

        /**
         * Focus an element
         * @method focus
         * @param {selelector || element} elementToFocus
         */
        focus: function(elementToFocus) {
          var target = DOM.getNthElement(parent, 0);
          if (! target) return;
          target.focus();
        },

        /**
         * Check the current matched set of elements against
         * a selector or element and return true if at least
         * one of these elements matches the given arguments.
         * @method is
         * @param {selector || element} elementToCheck
         * @param {string} type
         * @returns {boolean} true if elementToCheck matches the specified
         * type, false otw.
         */
        is: function(elementToCheck, type) {
          var haystack = DOM.getElements(type);

          var needle = DOM.getNthElement(elementToCheck, 0);
          if (! needle) return false;

          return haystack.indexOf(needle) > -1;
        },

        /**
         * Show an element
         * @method show
         * @param {selector || element} elementToShow
         */
        show: function(selector) {
          DOM.forEach(selector, function(element) {
            element.style.display = "block";
          });
        },

        /**
         * Hide an element
         * @method hide
         * @param {selector || element} elementToHide
         */
        hide: function(selector) {
          DOM.forEach(selector, function(element) {
            element.style.display = "none";
          });
        }
    };

    function isValBased(target) {
        var elName = DOM.getNthElement(target, 0).nodeName.toLowerCase();
        return elName === 'input' || elName === 'textarea';
    }

    return DOM;

}());
