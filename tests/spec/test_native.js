describe('DOMinator - native', function() {
    var events;
    var eventType;

    var assert = chai.assert;
    var genericHandler = function(event) {
        events[ (event && event.type) || eventType ] = true;
    };

    beforeEach(function() {
        events = {};
        jQuery(".DOMSelection").empty().append("<div>Part 1</div><div>Part 2</div><div>Part 3</div>");
    });

    afterEach(function() {
    });

    it('testGetElements', function() {
        var elements = DOMinator.getElements("body");

        assert.equal(1, elements.length, "getElements with a selector returns an array");

        var regetElements = DOMinator.getElements(elements);
        assert.equal(1, regetElements.length, "getElements with an element returns an array with 1 element");
        assert.equal(elements[ 0 ], regetElements[ 0 ], "getElements with an element returns an array with same element");

        var regetSingleElement = DOMinator.getElements(elements[ 0 ]);
        assert.equal(1, regetSingleElement.length, "getElements with an element returns an array with 1 element");
        assert.equal(elements[ 0 ], regetSingleElement[ 0 ], "getElements with an element returns an array with same element");
    });

    it('testGetDescendentElements', function() {
        var body = DOMinator.getElements("body");
        var buttons = DOMinator.getDescendentElements(".button", body);

        assert.isNumber(buttons.length, "getDescendentElements returns an array like object");
    });

    it('testGetElementsIncludeRoot', function() {
        var root = DOMinator.getElements(".DOMSelection");
        var divsIncludingRoot = DOMinator.getElementsIncludeRoot("div", root);

        assert.equal(4, divsIncludingRoot.length, "getElementsIncludeRoot gets the correct number of elements");
    });

    it('testGetChildren', function() {
        var children = DOMinator.getChildren(".DOMSelection");
        assert.equal(3, children.length, "getChildren returns the children");
    });

    it('testGetNthChild', function() {
        var child = DOMinator.getNthChild(".DOMSelection", 0);
        assert.isObject(child, "we got a child");
    });

    it('testClosest', function() {
        var closest = DOMinator.closest("div", ".list");
        assert.equal("AFrame_List", $(closest).attr("id"), "correct ancestor found");
    });

    it('testIterate', function() {
        var children = DOMinator.getChildren(".DOMSelection");
        var maxIndex = -1;
        var context;
        DOMinator.forEach(children, function(element, index) {
            maxIndex = index;
            context = this;
        }, this);

        assert.equal(2, maxIndex, "iterator sending arguments in expected order");
        assert.equal(this, context, "context set correctly");
    });

    it('testBindFireEvent', function() {
        DOMinator.bindEvent(".DOMSelection", "click", genericHandler);

        eventType = "click";
        DOMinator.fireEvent(".DOMSelection", "click");
        assert.isTrue(events.click, "fireEvent is working right");
    });

    it('testUnbindEvent', function() {
        DOMinator.unbindEvent(".DOMSelection", "click", genericHandler);

        eventType = "click";
        DOMinator.fireEvent(".DOMSelection", "click");

        assert.isUndefined(events.click, "unbindEvent is working right");
    });

    it('testSetInnerInput', function() {
        DOMinator.setInner("#validationField", "test element value");

        assert.equal("test element value", jQuery("#validationField").val(), "setInner working on input");
    });

    it('testSetInnerNonInput', function() {
        DOMinator.setInner("#testSetInnerNonInput", "test element value");

        assert.equal("test element value", jQuery("#testSetInnerNonInput").html(), "setInner working on div");
    });

    it('testGetInnerInput', function() {
        DOMinator.setInner("#validationField", "test element value");

        assert.equal("test element value", DOMinator.getInner("#validationField"), "getInner working on input");

        DOMinator.setInner("#validationField", "test element value");

        assert.equal("test element value", DOMinator.getInner(DOMinator.getElements("#validationField")), "getInner working with getElements");
    });

    it('testGetInnerNonInput', function() {
        DOMinator.setInner("#testSetInnerNonInput", "test element value");

        assert.equal("test element value", DOMinator.getInner("#testSetInnerNonInput"), "getInner working on div");
    });

    it('testSetAttr', function() {
        DOMinator.setAttr("#testSetInnerNonInput", "data-attr", "test attr");

        assert.equal("test attr", jQuery("#testSetInnerNonInput").attr("data-attr"), "setAttr working");
    });

    it('testGetAttr', function() {
        DOMinator.setAttr("#testSetInnerNonInput", "data-attr", "test attr");

        assert.equal("test attr", DOMinator.getAttr("#testSetInnerNonInput", "data-attr"), "getAttr working");
    });

    it('testHasAttr', function() {
        DOMinator.setAttr("#testSetInnerNonInput", "data-attr", "test attr");
        assert.isTrue(DOMinator.hasAttr("#testSetInnerNonInput", "data-attr"), "hasAttr working with element with attribute");
        assert.isFalse(DOMinator.hasAttr("#validationField", "data-attr"), "hasAttr working with element without attribute");
    });

    it('testHasAttrElementNonExistentElement', function() {
        assert.isFalse(DOMinator.hasAttr("#nonexistent", "data-attr"), "false returned for non-existent element");
    });

    it('testRemoveAttr', function() {
        DOMinator.setAttr("#testSetInnerNonInput", "data-attr", "test attr");

        DOMinator.removeAttr("#testSetInnerNonInput", "data-attr");
        var val = jQuery("#testSetInnerNonInput").attr("data-attr");
        assert.equal("undefined", typeof val, "removeAttr removes attribute");
    });

    it('testAddClass', function() {
        DOMinator.addClass("#testSetInnerNonInput", "testClass");

        assert.isTrue(jQuery("#testSetInnerNonInput").hasClass("testClass"), "addClass is working");
    });

    it('testRemoveClass', function() {
        DOMinator.addClass("#testSetInnerNonInput", "testClass");
        DOMinator.removeClass("#testSetInnerNonInput", "testClass");

        assert.isFalse(jQuery("#testSetInnerNonInput").hasClass("testClass"), "removeClass is working");
    });

    it('testHasClass', function() {
        DOMinator.addClass("#testSetInnerNonInput", "testClass");
        assert.isTrue(DOMinator.hasClass("#testSetInnerNonInput", "testClass"), "hasClass is working when class exists");

        DOMinator.removeClass("#testSetInnerNonInput", "testClass");
        assert.isFalse(DOMinator.hasClass("#testSetInnerNonInput", "testClass"), "hasClass is working when no class");
    });

    it('testCreateElement', function() {
        var contents = "some <span>html contents</span>";
        var element = DOMinator.createElement("div", contents);

        assert.isTrue(jQuery(element).is("div"), "element created");
        assert.equal(contents, jQuery(element).html(), "element has contents set");
    });

    it('testAppendTo', function() {
        jQuery(".DOMSelection").empty();

        DOMinator.appendTo(DOMinator.createElement("div", "empty div"), ".DOMSelection");

        assert.equal(1, jQuery(".DOMSelection").children().length, "appendTo appends");
    });

    it('testInsertAfter', function() {
        jQuery(".DOMSelection").empty();

        var first = DOMinator.createElement("div", "first div");
        DOMinator.appendTo(first, ".DOMSelection");
        DOMinator.insertAfter(DOMinator.createElement("div", "second div"), first);

        assert.equal(2, jQuery(".DOMSelection").children().length, "insertAfter inserts after");
    });

    it('testInsertBefore', function() {
        jQuery(".DOMSelection").empty();

        var first = DOMinator.createElement("div", "first div");
        DOMinator.appendTo(first, ".DOMSelection");
        DOMinator.insertBefore(DOMinator.createElement("div", "second div"), first);

        assert.equal(2, jQuery(".DOMSelection").children().length, "insertBefore inserts");
    });

    it('testInsertAsNthChild', function() {
        var second = DOMinator.createElement("div", "2nd child");
        DOMinator.addClass(second, "second");

        DOMinator.insertAsNthChild(second, ".DOMSelection", 1);

        assert.equal(4, jQuery(".DOMSelection").children().length, "appendTo appends");
    });

    it('testRemoveElement', function() {
        DOMinator.removeElement(".DOMSelection");

        assert.equal(0, jQuery(".DOMSelection").length, "remove has worked");
    });

    it('testIs', function() {
        assert.equal(true, DOMinator.is("#textAreaField", "textarea"), "is correctly returns true");
        assert.equal(false, DOMinator.is("#textAreaField", "body"), "is correctly returns false");
    });

    it('testFocus', function() {
        DOMinator.focus("#textAreaField");
        /*
        assert.equal(true, DOMinator.is("#textAreaField", ":focus"), "text area field is focused");
        */
    });

    it('testShowHide', function() {
        DOMinator.show("#hiddenElement");
        assert.equal(true, jQuery("#hiddenElement").is(":visible"));

        DOMinator.hide("#hiddenElement");
        assert.equal(false, jQuery("#hiddenElement").is(":visible"));
    });
});
