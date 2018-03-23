/**
 * ZUIX - Gesture Controller
 *
 * @version 1.0.0 (2018-03-11)
 * @author Gene
 *
 */

zuix.controller(function (cp) {

    var touchPointer = null, ignoreSession = false;

    cp.init = function () {
        cp.options().html = false;
        cp.options().css = false;
    };

    cp.create = function () {
        cp.view().on('dragstart', function(e) {
            if (!ignoreSession)
                e.preventDefault();
        }).on('mousedown', function (e) {
            var targetElement = zuix.$(e.target);
            if (targetElement.parent('[class*="no-gesture"]').length() === 0) {
                ignoreSession = false;
                touchStart(e, e.x, e.y);
            } else ignoreSession = true;
        }).on('mousemove', function (e) {
            if (!ignoreSession)
                touchMove(e, e.x, e.y);
        }).on('mouseup', function (e) {
            if (!ignoreSession)
                touchStop(e);
        }).on('touchstart', function (e) {
            var targetElement = zuix.$(e.target);
            if (targetElement.parent('[class*="no-gesture"]').length() === 0) {
                ignoreSession = false;
                touchStart(e, e.touches[0].clientX, e.touches[0].clientY);
            } else ignoreSession = true;
        }).on('touchmove', function (e) {
            if (!ignoreSession)
                touchMove(e, e.touches[0].clientX, e.touches[0].clientY);
        }).on('touchend', function (e) {
            if (!ignoreSession)
                touchStop(e);
        });
    };

    function touchStart(e, x, y) {
        touchPointer = {
            event: e,
            cancel: function () {
                touchPointer.event.cancelBubble = true;
                touchPointer.event.preventDefault();
            },
            startTime: new Date().getTime(),
            endTime: 0,
            startX: x,
            startY: y,
            shiftX: 0,
            shiftY: 0,
            'x': x,
            'y': y
        };
        cp.trigger('gesture:touch', touchPointer);
    }
    function touchMove(e, x, y) {
        if (touchPointer != null) {
            touchPointer.event = e;
            touchPointer.x = x;
            touchPointer.y = y;
            touchPointer.shiftX = (x - touchPointer.startX);
            touchPointer.shiftY = (y - touchPointer.startY);
            cp.trigger('gesture:pan', touchPointer);
        }
    }
    function touchStop(e) {
        touchPointer.event = e;
        touchPointer.endTime = new Date().getTime();
        var elapsedTime = touchPointer.endTime - touchPointer.startTime;
        if (touchPointer.shiftX === 0 && touchPointer.shiftY === 0 && elapsedTime < 1000) {
            // gesture TAP
            cp.trigger('gesture:tap', touchPointer);
        } else if (touchPointer.shiftX > 30 && Math.abs(touchPointer.shiftY) < 80) {
            // gesture swipe LEFT
            touchPointer.direction = 'left';
            touchPointer.velocity = touchPointer.shiftX / elapsedTime;
            cp.trigger('gesture:swipe', touchPointer);
        } else if (touchPointer.shiftX < -30 && Math.abs(touchPointer.shiftY) < 80) {
            // gesture swipe RIGHT
            touchPointer.direction = 'right';
            touchPointer.velocity = touchPointer.shiftX / elapsedTime;
            cp.trigger('gesture:swipe', touchPointer);
        } else if (touchPointer.shiftY > 30 && Math.abs(touchPointer.shiftX) < 80) {
            // gesture swipe UP
            touchPointer.direction = 'up';
            touchPointer.velocity = touchPointer.shiftY / elapsedTime;
            cp.trigger('gesture:swipe', touchPointer);
        } else if (touchPointer.shiftY < -30 && Math.abs(touchPointer.shiftX) < 80) {
            // gesture swipe DOWN
            touchPointer.direction = 'down';
            touchPointer.velocity = touchPointer.shiftY / elapsedTime;
            cp.trigger('gesture:swipe', touchPointer);
        } else cp.trigger('gesture:release', touchPointer);
        touchPointer = null;
    }

});