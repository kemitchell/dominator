/**
* A DOM Manipulation adapter for using native DOM.
* Works great IE10+
* @class window.DOMinator
* @static
*/
window.DOMunchained = (function(undefined) {
    'use strict';
    /*global DOMinator*/

    var DOM = {
        /**
        * Get a set of elements that match the selector
        * @method getElements
        * @param {selector || element} selector - if a string, a selector to search for.
        * @return {array} array of elements
        */
        getElements: function(selector) {
            return DOMinator(selector);
        },

        /**
        * Get the nth element
        * @method getNthElement
        * @param {selector || element} selector - element to search for
        * @param {number} index - index
        * @return {element} the nth element, if it exists.
        */
        getNthElement: function(selector, index) {
            return DOMinator(selector).nth(index);
        },

        /**
        * Get a set of descendent elements that match the selector
        * @method getDescendentElements
        * @param {string} selector - The selector to search for.
        * @param {element} root - root node to search from
        * @return {array} array of elements
        */
        getDescendentElements: function(selector, root) {
            return DOMinator(root).find(selector);
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
          return DOMinator(root).findIncludeRoot(selector);
        },

        /**
        * Get the children for an element
        * @method getChildren
        * @param {selector || element} selector - element to get children for
        * @return {array} an array of children
        */
        getChildren: function(selector) {
            return DOMinator(selector).children();
        },

        /**
        * Get the nth child element
        * @method getNthChild
        * @param {selector || element} selector - element to get children for
        * @param {number} index - index of the child to get
        * @return {element} the nth child if it exists.
        */
        getNthChild: function(selector, index) {
            return DOMinator(selector).nthChild( index );
        },

        /**
        * Find the closest ancestor that matches the selector
        * @method closest
        * @param {selector || element} selector - element to get children for
        * @param {selector || element} searchFrom - element to search from
        * @return {array} The closest ancestor matching the selector
        */
        closest: function(selector, searchFrom) {
          return DOMinator(searchFrom).closest(selector);
        },

        /**
        * Iterate over a set of elements
        * @method forEach
        * @param {Elements} elements - elements to iterate over
        * @param {function} callback - callback to call.  Callback called with: callback(element, index);
        * @param {context} context - context to callback in
        */
        forEach: function(elements, callback, context) {
            return DOMinator(elements).forEach(callback, context);
        },

        /**
        * Remove an element
        * @method removeElement
        * @param {selector || element} selector - element to remove
        */
        removeElement: function(selector) {
            return DOMinator(selector).remove();
        },

        /**
        * Bind to an elements DOM Event
        * @method bindEvent
        * @param {selector || element} element to bind on
        * @param {string} eventName - name of event
        * @param {function} callback - callback to call
        */
        bindEvent: function(selector, eventName, callback) {
            return DOMinator(selector).bindEvent(eventName, callback);
        },

        /**
        * Unbind an already bound DOM Event from an element.
        * @method unbindEvent
        * @param {selector || element} element to unbind from
        * @param {string} eventName - name of event
        * @param {function} callback - callback
        */
        unbindEvent: function(selector, eventName, callback) {
            return DOMinator(selector).unbindEvent(eventName, callback);
        },

        /**
        * Fire a DOM event on an element
        * @method fireEvent
        * @param {selector || element} element
        * @param {string} type - event to fire
        */
        fireEvent: function(selector, type) {
            return DOMinator(selector).fireEvent(type);
        },

        /**
        * Set the inner value of an element, including input elements
        * @method setInner
        * @param {selector || element} element - element to set
        * @param {string} value - value to set
        */
        setInner: function(selector, value) {
            return DOMinator(selector).inner(value);
        },

        /**
        * Get the inner value of an element, including input elements
        * @method getInner
        * @param {selector || element} element
        * @return {string} inner value of the element
        */
        getInner: function(selector) {
            return DOMinator(selector).inner();
        },

        /**
        * Set an element's attribute.
        * @method setAttr
        * @param {selector || element} element
        * @param {string} attrName - the attribute name
        * @param {string} value - value to set
        */
        setAttr: function(selector, attrName, value) {
            return DOMinator(selector).attr(attrName, value);
        },

        /**
        * Get an element's attribute.
        * @method getAttr
        * @param {selector || element} element
        * @param {string} attrName - the attribute name
        * @return {string} attribute's value
        */
        getAttr: function(selector, attrName) {
            return DOMinator(selector).attr(attrName);
        },

        /**
        * Check if the first matched element has an attribute.
        * @method hasAttr
        * @param {selector || element} element
        * @param {string} attrName - the attribute name
        * @return {boolean} true if the element has the attribute, false otw.
        */
        hasAttr: function(selector, attrName) {
            return DOMinator(selector).hasAttr(attrName);
        },

        /**
        * Remove an attribute from an element.
        * @method removeAttr
        * @param {selector || element} element
        * @param {string} attrName - the attribute to remove
        */
        removeAttr: function(selector, attrName) {
            return DOMinator(selector).removeAttr(attrName);
        },

        /**
        * Add a class to an element
        * @method addClass
        * @param {selector || element} element
        * @param {string} className
        */
        addClass: function(selector, className) {
            return DOMinator(selector).addClass(className);
        },

        /**
        * Remove a class from an element
        * @method removeClass
        * @param {selector || element} element
        * @param {string} className
        */
        removeClass: function(selector, className) {
            return DOMinator(selector).removeClass(className);
        },

        /**
        * Check if an element has a class
        * @method hasClass
        * @param {selector || element} element
        * @param {string} className
        * @return {boolean} true if element has class, false otw.
        */
        hasClass: function(selector, className) {
            return DOMinator(selector).hasClass(className);
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
                DOMinator(element).inner(html);
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
            return DOMinator(elementToInsert).appendTo(elementToAppendTo);
        },

        /**
        * Insert an element after another element
        * @method insertAfter
        * @param {selector || element} elementToInsert
        * @param {selector || element} elementToInsertBefore
        */
        insertAfter: function(elementToInsert, elementToInsertAfter) {
            return DOMinator(elementToInsert).insertAfter(elementToInsertAfter);
        },

        /**
        * Insert an element before another element
        * @method insertBefore
        * @param {selector || element} elementToInsert
        * @param {selector || element} elementToInsertBefore
        */
        insertBefore: function(elementToInsert, elementToInsertBefore) {
            return DOMinator(elementToInsert).insertBefore(elementToInsertBefore);
        },

        /**
        * Insert as the nth child of an element
        * @method insertAsNthChild
        * @param {selector || element} elementToInsert
        * @param {selector || element} parent
        * @param {number} index
        */
        insertAsNthChild: function(elementToInsert, parent, index) {
            return DOMinator(elementToInsert).insertAsNthChild(parent, index);
        },

        /**
         * Focus an element
         * @method focus
         * @param {selelector || element} elementToFocus
         */
        focus: function(elementToFocus) {
          return DOMinator(elementToFocus).focus();
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
          return DOMinator(elementToCheck).is(type);
        },

        /**
         * Show an element
         * @method show
         * @param {selector || element} elementToShow
         */
        show: function(selector) {
          return DOMinator(selector).show();
        },

        /**
         * Hide an element
         * @method hide
         * @param {selector || element} elementToHide
         */
        hide: function(selector) {
          return DOMinator(selector).hide();
        }
    };

    function isValBased(target) {
        var elName = DOM.getNthElement(target, 0).nodeName.toLowerCase();
        return elName === 'input' || elName === 'textarea';
    }

    return DOM;

}());
