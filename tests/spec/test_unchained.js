describe('DOMunchained', function() {
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
        var elements = DOMunchained.getElements("body");

        assert.equal(1, elements.length, "getElements with a selector returns an array");

        var regetElements = DOMunchained.getElements(elements);
        assert.equal(1, regetElements.length, "getElements with an element returns an array with 1 element");
        assert.equal(elements[ 0 ], regetElements[ 0 ], "getElements with an element returns an array with same element");

        var regetSingleElement = DOMunchained.getElements(elements[ 0 ]);
        assert.equal(1, regetSingleElement.length, "getElements with an element returns an array with 1 element");
        assert.equal(elements[ 0 ], regetSingleElement[ 0 ], "getElements with an element returns an array with same element");
    });

    it('testGetDescendentElements', function() {
        var body = DOMunchained.getElements("body");
        var buttons = DOMunchained.getDescendentElements(".button", body);

        assert.isNumber(buttons.length, "getDescendentElements returns an array like object");
    });

    it('testGetElementsIncludeRoot', function() {
        var root = DOMunchained.getElements(".DOMSelection");
        var divsIncludingRoot = DOMunchained.getElementsIncludeRoot("div", root);

        assert.equal(4, divsIncludingRoot.length, "getElementsIncludeRoot gets the correct number of elements");
    });

    it('testGetChildren', function() {
        jQuery(".DOMSelection").empty().append("<div>Part 1</div><div>Part 2</div><div>Part 3</div>");
        var children = DOMunchained.getChildren(".DOMSelection");
        assert.equal(3, children.length, "getChildren returns the children");
    });

    it('testGetNthChild', function() {
        var child = DOMunchained.getNthChild(".DOMSelection", 0);
        assert.isObject(child, "we got a child");
    });

    it('testClosest', function() {
        var closest = DOMunchained.closest("div", ".list");
        assert.equal("AFrame_List", $(closest).attr("id"), "correct ancestor found");
    });

    it('testIterate', function() {
        var children = DOMunchained.getChildren(".DOMSelection");
        var maxIndex = -1;
        var context;
        DOMunchained.forEach(children, function(element, index) {
            maxIndex = index;
            context = this;
        }, this);

        assert.equal(2, maxIndex, "iterator sending arguments in expected order");
        assert.equal(this, context, "context set correctly");
    });

    it('testBindFireEvent', function() {
        DOMunchained.bindEvent(".DOMSelection", "click", genericHandler);

        eventType = "click";
        DOMunchained.fireEvent(".DOMSelection", "click");
        assert.isTrue(events.click, "fireEvent is working right");
    });

    it('testUnbindEvent', function() {
        DOMunchained.unbindEvent(".DOMSelection", "click", genericHandler);

        eventType = "click";
        DOMunchained.fireEvent(".DOMSelection", "click");

        assert.isUndefined(events.click, "unbindEvent is working right");
    });

    it('testSetInnerInput', function() {
        DOMunchained.setInner("#validationField", "test element value");

        assert.equal("test element value", jQuery("#validationField").val(), "setInner working on input");
    });

    it('testSetInnerNonInput', function() {
        DOMunchained.setInner("#testSetInnerNonInput", "test element value");

        assert.equal("test element value", jQuery("#testSetInnerNonInput").html(), "setInner working on div");
    });

    it('testGetInnerInput', function() {
        DOMunchained.setInner("#validationField", "test element value");

        assert.equal("test element value", DOMunchained.getInner("#validationField"), "getInner working on input");

        DOMunchained.setInner("#validationField", "test element value");

        assert.equal("test element value", DOMunchained.getInner(DOMunchained.getElements("#validationField")), "getInner working with getElements");
    });

    it('testGetInnerNonInput', function() {
        DOMunchained.setInner("#testSetInnerNonInput", "test element value");

        assert.equal("test element value", DOMunchained.getInner("#testSetInnerNonInput"), "getInner working on div");
    });

    it('testSetAttr', function() {
        DOMunchained.setAttr("#testSetInnerNonInput", "data-attr", "test attr");

        assert.equal("test attr", jQuery("#testSetInnerNonInput").attr("data-attr"), "setAttr working");
    });

    it('testGetAttr', function() {
        DOMunchained.setAttr("#testSetInnerNonInput", "data-attr", "test attr");

        assert.equal("test attr", DOMunchained.getAttr("#testSetInnerNonInput", "data-attr"), "getAttr working");
    });

    it('testHasAttr', function() {
        DOMunchained.setAttr("#testSetInnerNonInput", "data-attr", "test attr");
        assert.isTrue(DOMunchained.hasAttr("#testSetInnerNonInput", "data-attr"), "hasAttr working with element with attribute");
        assert.isFalse(DOMunchained.hasAttr("#validationField", "data-attr"), "hasAttr working with element without attribute");
    });

    it('testHasAttrElementNonExistentElement', function() {
        assert.isFalse(DOMunchained.hasAttr("#nonexistent", "data-attr"), "false returned for non-existent element");
    });

    it('testRemoveAttr', function() {
        DOMunchained.setAttr("#testSetInnerNonInput", "data-attr", "test attr");

        DOMunchained.removeAttr("#testSetInnerNonInput", "data-attr");
        var val = jQuery("#testSetInnerNonInput").attr("data-attr");
        assert.equal("undefined", typeof val, "removeAttr removes attribute");
    });

    it('testAddClass', function() {
        DOMunchained.addClass("#testSetInnerNonInput", "testClass");

        assert.isTrue(jQuery("#testSetInnerNonInput").hasClass("testClass"), "addClass is working");
    });

    it('testRemoveClass', function() {
        DOMunchained.addClass("#testSetInnerNonInput", "testClass");
        DOMunchained.removeClass("#testSetInnerNonInput", "testClass");

        assert.isFalse(jQuery("#testSetInnerNonInput").hasClass("testClass"), "removeClass is working");
    });

    it('testHasClass', function() {
        DOMunchained.addClass("#testSetInnerNonInput", "testClass");
        assert.isTrue(DOMunchained.hasClass("#testSetInnerNonInput", "testClass"), "hasClass is working when class exists");

        DOMunchained.removeClass("#testSetInnerNonInput", "testClass");
        assert.isFalse(DOMunchained.hasClass("#testSetInnerNonInput", "testClass"), "hasClass is working when no class");
    });

    it('testCreateElement', function() {
        var contents = "some <span>html contents</span>";
        var element = DOMunchained.createElement("div", contents);

        assert.isTrue(jQuery(element).is("div"), "element created");
        assert.equal(contents, jQuery(element).html(), "element has contents set");
    });

    it('testAppendTo', function() {
        jQuery(".DOMSelection").empty();

        DOMunchained.appendTo(DOMunchained.createElement("div", "empty div"), ".DOMSelection");

        assert.equal(1, jQuery(".DOMSelection").children().length, "appendTo appends");
    });

    it('testInsertAfter', function() {
        jQuery(".DOMSelection").empty();

        var first = DOMunchained.createElement("div", "first div");
        DOMunchained.appendTo(first, ".DOMSelection");
        DOMunchained.insertAfter(DOMunchained.createElement("div", "second div"), first);

        assert.equal(2, jQuery(".DOMSelection").children().length, "insertAfter inserts after");
    });

    it('testInsertBefore', function() {
        jQuery(".DOMSelection").empty();

        var first = DOMunchained.createElement("div", "first div");
        DOMunchained.appendTo(first, ".DOMSelection");
        DOMunchained.insertBefore(DOMunchained.createElement("div", "second div"), first);

        assert.equal(2, jQuery(".DOMSelection").children().length, "insertBefore inserts");
    });

    it('testInsertAsNthChild', function() {
        var second = DOMunchained.createElement("div", "2nd child");
        DOMunchained.addClass(second, "second");

        DOMunchained.insertAsNthChild(second, ".DOMSelection", 1);

        assert.equal(4, jQuery(".DOMSelection").children().length, "appendTo appends");
    });

    it('testRemoveElement', function() {
        DOMunchained.removeElement(".DOMSelection");

        assert.equal(0, jQuery(".DOMSelection").length, "remove has worked");
    });

    it('testIs', function() {
        assert.equal(true, DOMunchained.is("#textAreaField", "textarea"), "is correctly returns true");
        assert.equal(false, DOMunchained.is("#textAreaField", "body"), "is correctly returns false");
    });

    it('testFocus', function() {
        DOMunchained.focus("#textAreaField");
        /*
        assert.equal(true, DOMunchained.is("#textAreaField", ":focus"), "text area field is focused");
        */
    });

    it('testShowHide', function() {
        DOMunchained.show("#hiddenElement");
        assert.equal(true, jQuery("#hiddenElement").is(":visible"));

        DOMunchained.hide("#hiddenElement");
        assert.equal(false, jQuery("#hiddenElement").is(":visible"));
    });
});
