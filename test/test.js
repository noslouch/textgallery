/*global Gallery,Slide,quotes,g,slides,slideObj,blinds*/
'use strict';

QUnit.testStart(function(){
    window.quotes = document.getElementById('quotes')
    window.g = new Gallery(quotes)
    window.slides = document.querySelectorAll('#quotes h3')
    window.slideObj = new Slide( slides[0] )
    window.blinds = document.querySelectorAll('.blind')
})

test('DOM structure', function(){
    ok(document.getElementById('quotes'), 'quotes outer wrapper')
    ok(document.getElementById('qContainer'), 'quotes inner container')
    ok(document.getElementsByClassName('slide').length, 'slides in dom')

    Array.prototype.forEach.call(slides, function(slide, idx){
        Array.prototype.forEach.call(slide.children, function(blind, blindIdx){
            ok(blind.classList.contains('blind'), 'slide number: ' + idx + '\nblind number: ' + blindIdx + ' -- all children are blinds')
        })
    })

    Array.prototype.forEach.call(blinds, function(blind){
        ok(blind.nodeName === 'DIV', 'All blinds must be divs')
    })
})

test('Gallery constructor', function(){
    ok(Gallery, 'Gallery constructor exists')
})

test('Gallery API', function(){
    equal( slides.length, g.getSlides().length, 'getSlides returns proper number of slides' )
    deepEqual( document.getElementById('quotes'), g.getEl(), 'getEl returns Gallery DOM elements')

    g.getSlides().forEach(function(slide, idx){
        deepEqual( slides[idx], slide.getEl(), 'getSlides returns proper DOM elements')
        deepEqual( slides[idx], g.getSlide(idx).getEl(), 'getSlide(i) returns proper DOM element')
        deepEqual(idx, g.getSlideIndex(slide), 'getSlideIndex() works with slide instance')
        deepEqual(idx, g.getSlideIndex(slides[idx]), 'getSlideIndex() works with DOM element')
    })

    g.play()
    ok( g.isPlaying(), 'isPlaying should be true after calling play()' )
    deepEqual( g.getCurrentSlide(), g.getSlide(0), 'getCurrentSlide should return first slide right after playing')
    stop()
    setTimeout(function() {
        g.pause()
        ok( !g.isPlaying(), 'isPlaying should be false after calling pause()' )
        var currentSlide = g.getCurrentSlide(),
            el = currentSlide.getEl()
        start()
        stop()
        setTimeout(function(){
            Array.prototype.forEach.call(slides, function(slide){
                if ( slide !== el ) {
                    Array.prototype.forEach.call( slide.querySelectorAll('.blind'), function(blind) {
                        ok( !blind.classList.contains('opened'), 'all blinds in other slides should be closed' )
                    } )
                }
            })
            function testHandler(e) {
                start()
                ok(true, e.type + ' event triggered after resuming play')
                document.removeEventListener('openslide', testHandler)
                document.removeEventListener('closeslide', testHandler)
            }
            document.addEventListener('openslide', testHandler, false)
            document.addEventListener('closeslide', testHandler, false)
            g.play()
            deepEqual( g.getCurrentSlide(), currentSlide, 'resuming should restart on correct slide' )
        }, 2000)
    }, 6000)
})

asyncTest('Pausing in between slides', function() {
    function closeHandler() {
        g.pause()
        document.removeEventListener('closeslide', closeHandler)
        document.addEventListener('openslide', openHandler, false)
        setTimeout(function() {
            g.play()
        }, 1000)
    }

    function openHandler() {
        equal(1, g.getSlideIndex(g.getCurrentSlide()), 'should be on slide #2 after pausing between slides')
        document.removeEventListener('openslide', openHandler)
        start()
    }

    document.addEventListener('closeslide', closeHandler, false)
    g.play()
})
test('Slide Created', function(){
    ok(slideObj, 'slide created')
})

test('Slide API', function(){
    var i,
        allBlinds

    deepEqual( slides[0].querySelectorAll('.blind')[slides[0].querySelectorAll('.blind').length - 1], slideObj.lastBlind(), 'lastBlind returns last blind')

    equal( slides[0].querySelectorAll('.blind').length, slideObj.getBlinds().length )
    allBlinds = slideObj.getBlinds()
    allBlinds.forEach(function(blind, idx){
        deepEqual(slides[0].querySelectorAll('.blind')[idx], blind, 'getBlinds returns proper blinds')
    })

    for ( i = 0; i < slideObj.getBlinds().length - 1; i++ ) {
        deepEqual( slides[0].querySelectorAll('.blind')[i], slideObj.getBlind(i), 'getBlind(i) returns proper blind')
    }

    stop()
    slideObj.open()
    setTimeout(function(){
        slideObj.getBlinds().forEach(function(blind){
            ok(blind.classList.contains('opened'), 'opened class added to blind')
            ok(!blind.classList.contains('closed'), 'closed class not on blind')
        })

        start()
        stop()

        slideObj.close()
        setTimeout(function(){
            slideObj.getBlinds().forEach(function(blind){
                ok(blind.classList.contains('closed'), 'closed class added to blind')
                ok(!blind.classList.contains('opened'), 'opened class not on blind')
            })

            start()
        }, 1750)
    }, 1750)
})

test('Slide Blinds initialized properly', function(){
    Array.prototype.forEach.call(slideObj.getBlinds(), function(el) {
        ok(el.innerHTML !== '*', 'blinds with asterisks should be emptied')
    })
})

asyncTest('Slide sends open event', function(){
    expect(1)

    quotes.addEventListener('openslide', function(){
        ok('blind opened')
        start()
    }, false)
    slideObj.open()
})

asyncTest('All Slides send open event once per transition', function(){
    var slideObjs = [],
        openSlides = 0

    Array.prototype.forEach.call(slides, function(el){
        slideObjs.push( new Slide(el) )
    })

    quotes.addEventListener('openslide', function(){
        openSlides++
    }, false)

    slideObjs.forEach(function(slide){
        slide.open()
    })

    setTimeout(function(){
        equal(openSlides, slideObjs.length, 'all slides should be open after timeout')
        start()
    }, 2000)

})

asyncTest('Slide sends close event', function(){
    expect(1)

    quotes.addEventListener('closeslide', function(){
        ok('blind closed')
        start()
    }, false)

    slideObj.open()
    setTimeout(function(){
        slideObj.close()
    }, 1000)
})

asyncTest('All Slides send close event once per transition', function(){
    expect(1)
    var closedSlides = 0,
        slideObjs = []

    Array.prototype.forEach.call(slides, function(el){
        slideObjs.push( new Slide(el) )
    })

    quotes.addEventListener('closeslide', function(){
        closedSlides++
    }, false)

    slideObjs.forEach(function(slide){
        slide.open()
    })

    setTimeout(function(){
        slideObjs.forEach(function(slide){
            slide.close()
        })

        setTimeout(function(){
            equal(closedSlides, slideObjs.length, 'all slides should be closed after timeout')
            start()
        }, 2000)
    }, 1000)
})
