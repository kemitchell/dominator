describe('DOMinator', function() {
    var events;
    var eventType;

    var assert = chai.assert;
    var genericHandler = function(event) {
        events[ (event && event.type) || eventType ] = true;
    };

    beforeEach(function() {
        events = {};
        jQuery('.DOMSelection').empty().append('<div>Part 1</div><div>Part 2</div><div>Part 3</div>');
    });

    afterEach(function() {
    });

    describe('constructor', function() {
      var elements, regetElements, regetSingleElement;

      beforeEach(function() {
        elements = DOMinator('body');
        regetElements = DOMinator(elements);
        regetSingleElement = DOMinator(elements[0]);
      });

      it('finds elements with the given selector', function() {
        assert.equal(1, elements.length);
      });

      it('accepts a DOMinator list of elements', function() {
        assert.equal(1, regetElements.length);
        assert.equal(elements[ 0 ], regetElements[ 0 ]);
      });

      it('accepts a DOM element', function() {
        assert.equal(1, regetSingleElement.length);
        assert.equal(elements[ 0 ], regetSingleElement[ 0 ]);
      });
    });

    describe('find', function() {
      var buttons;

      beforeEach(function() {
        buttons = DOMinator('body').find('.button');
      });

      it('finds descendent elements', function() {
        assert.isNumber(buttons.length);
      });
    });

    describe('findIncludeRoot', function() {
      var divsIncludingRoot;

      beforeEach(function() {
        divsIncludingRoot = DOMinator('.DOMSelection').findIncludeRoot('div');
      });

      it('includes the root, if the root matches the selector', function() {
        assert.equal(4, divsIncludingRoot.length);
      });
    });

    describe('children', function() {
      var children;

      beforeEach(function() {
        jQuery('.DOMSelection').empty().append('<div>Part 1</div><div>Part 2</div><div>Part 3</div>');
        children = DOMinator('.DOMSelection').children();
      });

      it('returns all the children', function() {
        assert.equal(3, children.length);
      });
    });

    describe('nthChild', function() {
      var child;

      beforeEach(function() {
        child = DOMinator('.DOMSelection').nthChild(0);
      });

      it('returns the nth child', function() {
        assert.isObject(child);
      });
    });

    describe('closest', function() {
        var closest;

        beforeEach(function() {
          closest = DOMinator('.list').closest('div');
        });

        it('finds the closest anscestor', function() {
          assert.equal('AFrame_List', $(closest).attr('id'));
        });
    });

    describe('forEach', function() {
      var children, maxIndex, context;

      beforeEach(function() {
        children = DOMinator('.DOMSelection').children();
        maxIndex = -1;
        children.forEach(function(element, index) {
            maxIndex = index;
            context = this;
        }, this);
      });

      it('iterates over all matched items', function() {
          assert.equal(2, maxIndex);
          assert.equal(this, context);
      });
    });

    describe('bindEvent and fireEvent', function() {
      beforeEach(function() {
        events.click = false;
        eventType = null;

        DOMinator('.DOMSelection').bindEvent('click', genericHandler).fireEvent('click');
      });

      it('binds a DOM event handler that is actually fired', function() {
        assert.isTrue(events.click);
      });
    });

    describe('unbindEvent', function() {
      beforeEach(function() {
        events.click = false;
        eventType = null;

        DOMinator('.DOMSelection').unbindEvent('click', genericHandler).fireEvent('click');
      });

      it('removes the DOM event handler', function() {
        assert.isFalse(events.click);
      });
    });

    describe('inner to set on a form field', function() {
      beforeEach(function() {
        DOMinator('#validationField').inner('test element value');
      });

      it('sets the value of the field', function() {
        assert.equal('test element value', jQuery('#validationField').val());
      });
    });

    describe('inner to get a form field', function() {
      beforeEach(function() {
        DOMinator('#validationField').inner('test element value');
      });

      it('gets the value of the field', function() {
        assert.equal('test element value', DOMinator('#validationField').inner());
      });
    });

    describe('inner to set on a non-form field element', function() {
      beforeEach(function() {
        DOMinator('#testSetInnerNonInput').inner('test element value');
      });

      it('sets the HTML of the element', function() {
        assert.equal('test element value', jQuery('#testSetInnerNonInput').html());
      });
    });

    describe('inner to get on a non-form field element', function() {
      beforeEach(function() {
        DOMinator('#testSetInnerNonInput').inner('test element value');
      });

      it('gets the HTML of the element', function() {
        assert.equal('test element value', DOMinator('#testSetInnerNonInput').inner());
      });
    });

    describe('empty', function() {
      beforeEach(function() {
        DOMinator('#testSetInnerNonInput').inner('test element value').empty();
      });

      it('emptys an element of contents', function() {
        assert.equal('', DOMinator('#testSetInnerNonInput').inner());
      });
    });

    describe('attr to set an attribute', function() {
      beforeEach(function() {
        DOMinator('#testSetInnerNonInput').attr('data-attr', 'test attr');
      });

      it('sets the attribute value', function() {
        assert.equal('test attr', jQuery('#testSetInnerNonInput').attr('data-attr'));
      });
    });

    describe('attr to get an attribute', function() {
      beforeEach(function() {
        DOMinator('#testSetInnerNonInput').attr('data-attr', 'test attr');
      });

      it('gets the attribute value', function() {
        assert.equal('test attr', DOMinator('#testSetInnerNonInput').attr('data-attr'));
      });

      it('returns undefined on a non-existent element', function() {
        assert.isUndefined(DOMinator('#nonexistent').attr('data-attr'));
      });
    });

    describe('hasAttr', function() {
      beforeEach(function() {
        DOMinator('#testSetInnerNonInput').attr('data-attr', 'test attr');
      });

      it('returns true if an element has the attribute', function() {
        assert.isTrue(DOMinator('#testSetInnerNonInput').hasAttr('data-attr'));
      });

      it('returns false if an element has the attribute', function() {
        assert.isFalse(DOMinator('body').hasAttr('data-attr'));
      });

      it('returns false on a non-existent element', function() {
        assert.isFalse(DOMinator('#nonexistent').hasAttr('data-attr'));
      });
    });

    describe('removeAttr', function() {
      beforeEach(function() {
        DOMinator('#testSetInnerNonInput').attr('data-attr', 'test attr');
        DOMinator('#testSetInnerNonInput').removeAttr('data-attr');
      });

      it('removes an attribute from an element', function() {
        assert.isFalse(DOMinator('#testSetInnerNonInput').hasAttr('data-attr'));
      });
    });

    describe('addClass', function() {
      beforeEach(function() {
        DOMinator('#testSetInnerNonInput')
            .removeClass('testClass')
            .addClass('testClass');
      });

      it('adds a class to an element', function() {
        assert.isTrue(jQuery('#testSetInnerNonInput').hasClass('testClass'));
      });
    });

    describe('removeClass', function() {
      beforeEach(function() {
        DOMinator('#testSetInnerNonInput')
            .addClass('testClass')
            .removeClass('testClass');
      });

      it('removes a class from an element', function() {
        assert.isFalse(jQuery('#testSetInnerNonInput').hasClass('testClass'));
      });
    });

    describe('hasClass', function() {
      beforeEach(function() {
        DOMinator('#testSetInnerNonInput').addClass('testClass');
      });

      it('returns true if element has the class', function() {
        assert.isTrue(DOMinator('#testSetInnerNonInput').hasClass('testClass'));
      });

      it('returns false if the element does not have the class', function() {
        assert.isFalse(DOMinator('#testSetInnerNonInput').hasClass('nonexistentClass'));
      });
    });

    /*
    it('testCreateElement', function() {
        var contents = 'some <span>html contents</span>';
        var element = DOMunchained.createElement('div', contents);

        assert.isTrue(jQuery(element).is('div'), 'element created');
        assert.equal(contents, jQuery(element).html(), 'element has contents set');
    });
    */

    describe('append', function() {
      beforeEach(function() {
        DOMinator('#addedField').remove();

        var element = DOMinator(DOMunchained.createElement('div', 'added child'))
                            .attr('id', 'addedField');
        DOMinator('body').append(element);
      });

      it('appends the elements to the current selection', function() {
        assert.equal(1, jQuery('#addedField').length);
      });
    });

    describe('appendTo', function() {
      beforeEach(function() {
        DOMinator('.DOMSelection').empty();

        DOMinator(DOMunchained.createElement('div', 'empty div')).appendTo('.DOMSelection');
      });

      it('append selection to selector given in appendTo', function() {
        assert.equal(1, jQuery('.DOMSelection').children().length, 'appendTo appends');
      });
    });

    describe('insertAfter', function() {
      beforeEach(function() {
        DOMinator('.DOMSelection').empty();

        var first = DOMunchained.createElement('div', 'first div');
        DOMinator(first).appendTo('.DOMSelection');
        DOMinator(DOMunchained.createElement('div', 'second div')).insertAfter(first);
      });

      it('inserts selection to selector given in insertAfter', function() {
        assert.equal(2, jQuery('.DOMSelection').children().length);
      });
    });

    describe('insertBefore', function() {
      beforeEach(function() {
        jQuery('.DOMSelection').empty();

        var first = DOMunchained.createElement('div', 'first div');
        DOMinator(first).appendTo('.DOMSelection');
        DOMinator(DOMunchained.createElement('div', 'second div')).insertBefore(first);
      });

      it('inserts selection before selector given in insertBefore', function() {
        assert.equal(2, jQuery('.DOMSelection').children().length);
      });
    });

    describe('insertAsNthChild', function() {
      beforeEach(function() {
        var second = DOMunchained.createElement('div', '2nd child');
        DOMinator(second).addClass('second').insertAsNthChild('.DOMSelection', 1);
      });

      it('inserts into the correct position', function() {
        assert.equal(4, jQuery('.DOMSelection').children().length, 'appendTo appends');
      });
    });

    describe('remove', function() {
      beforeEach(function() {
        DOMinator('#addedField').remove();

        var element = DOMunchained.createElement('div', 'added child');
        DOMinator(element).attr('id', 'addedField').appendTo('body').remove();
      });

      it('removes the element from the DOM', function() {
        assert.equal(0, jQuery('#addedField').length);
      });
    });

    describe('is', function() {
      it('returns true if an element matches selector', function() {
        assert.isTrue(DOMinator('#textAreaField').is('#textAreaField'));
      });

      it('returns false if an element does not match selector', function() {
        assert.isFalse(DOMinator('#textAreaField').is('body'));
      });

      it('returns false if non-existent element', function() {
        assert.isFalse(DOMinator('#nonexistent').is('body'));
      });
    });

    describe('focus', function() {
      beforeEach(function() {
        DOMinator('#textAreaField').focus();
      });

      it('focuses an element', function() {
        /*assert.isTrue(jQuery('#textAreaField').is(':focus'));*/
      });
    });

    describe('show', function() {
      beforeEach(function() {
        DOMinator('#hiddenElement').hide().show();
      });

      it('shows an element', function() {
        assert.isTrue(jQuery('#hiddenElement').is(':visible'));
      });
    });

    describe('hide', function() {
      beforeEach(function() {
        DOMinator('#hiddenElement').show().hide();
      });

      it('hides an element', function() {
        assert.isFalse(jQuery('#hiddenElement').is(':visible'));
      });
    });
});
