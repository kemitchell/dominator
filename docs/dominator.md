

<!-- Start /Users/stomlinson/development/dominator/src/dominator.js -->

Author: Shane Tomlinson shane@shanetomlinson.com

Version: 0.0.2

License: This Source Code Form is subject to the terms of the Mozilla Public
License, v. 2.0. If a copy of the MPL was not distributed with this
file, You can obtain one at http://mozilla.org/MPL/2.0/.

## DOMinator

## fill(selector)

Fill the DOMinator object with elements matched by the the selector.

### Params:

* **String** *selector* Selector to match

### Return:

* **Collection** DOMinator collection

## nth(index)

Get the nth object in the set.

### Params:

* **Number** *index* Item index

### Return:

* **Element** element, if it exists in the set

## children()

Get all the children of all the elements in the set.

### Return:

* **Collection** DOMinator collection

## nthChild(index)

Get the nth child of all the children of all the elements in the set.

### Params:

* **Number** *index* Item index

### Return:

* **Element** element, if it exists in the set

## find(selector)

Find descendent elements.

### Params:

* **String** *selector* Selector to match

### Return:

* **Collection** DOMinator collection

## findIncludeRoot(selector)

Find descendent elements and include the root if it.
matches the selector.

### Params:

* **String** *selector* Selector to match

### Return:

* **Collection** DOMinator collection

## is(selector)

Check if the first element of the set matches the selector.

### Params:

* **String** *selector* Selector to match

### Return:

* **Boolean** true if element matches the selector, false otw.

## closest(selector)

Find the closest ancestor of the first element of the set
that matches the selector.

### Params:

* **String** *selector* Selector to match

### Return:

* **Element**

## remove()

Remove the set of elements from the DOM.

## bindEvent(eventName, callback, bubble)

Add a DOM event handler to the set of elements.

### Params:

* **String** *eventName* DOM event name
* **Function** *callback* Callback to call
* **Boolean** *bubble* Handle during bubble phase

### Return:

* **Collection** DOMinator collection

## unbindEvent(eventName, callback, bubble)

Remove a DOM event handler from the set of elements.

### Params:

* **String** *eventName* DOM event name
* **Function** *callback* Callback to call
* **Boolean** *bubble* Handle during bubble phase

### Return:

* **Collection** DOMinator collection

## fireEvent(type)

Fire a synthetic event on the set of elements.

### Params:

* **String** *type* Type of event to fire

### Return:

* **Collection** DOMinator collection

## inner(value)

Get/Set the innerHTML or value of an element.

### Params:

* **String** *value* innerHTML or value

### Return:

* **Collection** DOMinator collection

## empty()

Remove all children from the set of elements.

### Return:

* **Collection** DOMinator collection

## attr(attrName, value)

Get/Set an attribute on the set of elements.

### Params:

* **String** *attrName* Attribute name
* **String** *value* (optional) attribute value

## hasAttr(attrName)

Check if the first element in the set has an attribute.

### Params:

* **String** *attrName* Attribute name

### Return:

* **Boolean** true if first element in set has the attribute.

## removeAttr(attrName)

Remove the attribute from all elements in the set.

### Params:

* **String** *attrName* Attribute name

### Return:

* **Collection** DOMinator collection

## addClass(className)

Add a class to all elements in the set.

### Params:

* **String** *className* Class name

### Return:

* **Collection** DOMinator collection

## removeClass(className)

Remove a class from all elements in the set.

### Params:

* **String** *className* Class name

### Return:

* **Collection** DOMinator collection

## hasClass(className)

Check if the first element in the set has a class name.

### Params:

* **String** *className* Class name

### Return:

* **Boolean** true if first element has the class name, false otw.

## forEach(iterator, context)

Iterate over the elements.

### Params:

* **Function** *iterator* Iterator function
* **Object** *context* Context to use when calling `iterator`

### Return:

* **Collection** DOMinator collection

## map(iterator, context)

Run map over the set of elements.

### Params:

* **Function** *iterator* Iterator function
* **Object** *context* Context to use when calling `iterator`

### Return:

* **Array** map results

## append(elementToAppend)

Append an element to all elements in the set.

### Params:

* **String** *elementToAppend* HTML or element to append

### Return:

* **Collection** DOMinator collection

## appendTo(elementToAppendTo)

Append the current set of elements to another element.

### Params:

* **String** *elementToAppendTo* Element to append to

### Return:

* **Collection** DOMinator collection

## insertAfter(elementToInsertAfter)

Insert the current set of elements after another element.

### Params:

* **String** *elementToInsertAfter* Element to insert after

### Return:

* **Collection** DOMinator collection

## insertBefore(elementToInsertBefore)

Insert the current set of elements before another element.

### Params:

* **String** *elementToInsertBefore* Element to insert before

### Return:

* **Collection** DOMinator collection

## insertAsNthChild(parent, index)

Insert the current set of elements as the Nth child of another element.

### Params:

* **String** *parent* Parent element
* **Number** *index* Index where to insert

### Return:

* **Collection** DOMinator collection

## focus()

Focus the first element in the set.

### Return:

* **Collection** DOMinator collection

## show()

Show all elements in the set by setting 'display: block'.

### Return:

* **Collection** DOMinator collection

## hide()

Hide all elements in the set by setting 'display: none'.

### Return:

* **Collection** DOMinator collection

## style(name, value)

Set a style on all elements in the set.

### Params:

* **String** *name* Style name
* **String** *value* Style value

### Return:

* **Collection** DOMinator collection

## toArray()

Convert the set to an Array.

### Return:

* **Array**

<!-- End /Users/stomlinson/development/dominator/src/dominator.js -->

