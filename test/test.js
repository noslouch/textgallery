/*global Gallery,Slide*/
'use strict';

test('DOM structure', function(){
    ok(document.getElementById('quotes'), 'quotes outer wrapper')
    ok(document.getElementById('qContainer'), 'quotes inner container')
    ok(document.getElementsByClassName('slide').length, 'slides in dom')

    var slides = document.getElementsByClassName('slide')
    Array.prototype.forEach.call(slides, function(el, idx){
        var h3 = el.getElementsByTagName('h3')
        ok(h3.length, 'inner h3 on each slide')
        equal(1, h3.length, 'only one h3 per slide')

        Array.prototype.forEach.call(h3[0].children, function(blind, blindIdx){
            ok(blind.classList.contains('blind'), 'slide number: ' + idx + '\nblind number: ' + blindIdx + ' -- all children are blinds')
        })
    })
})

test('Gallery constructor', function(){
    ok(Gallery, 'Gallery constructor exists')
})

test('Gallery API', function(){
    var quotes = document.getElementById('quotes'),
        g = new Gallery(quotes)

    ok(typeof g.init === 'function')
    ok(typeof g.destroy === 'function')
    ok(typeof g.start === 'function')
    ok(typeof g.stop === 'function')
    ok(typeof g.next === 'function')
    ok(typeof g.prev === 'function')
    ok(typeof g.goTo === 'function')
})

test('Slide Created', function(){
    var quotes = document.getElementById('quotes'),
        slide = new Slide(quotes.getElementsByTagName('h3')[0])

    ok(slide, 'slide created')
})

test('Slide API', function(){
    var quotes = document.getElementById('quotes'),
        slide = new Slide(quotes.getElementsByTagName('h3')[0])

    ok(typeof slide.open === 'function')
    ok(typeof slide.close === 'function')
    ok(typeof slide.getBlinds === 'function')
})

test('Slide Blinds initialized properly', function(){
    var quotes = document.getElementById('quotes'),
        slide = new Slide(quotes.getElementsByTagName('h3')[0])

    Array.prototype.forEach.call(slide.getBlinds(), function(el, idx) {
        ok(el.classList.contains('blind'), 'blind number ' + idx + ' should have a blind class')
        ok(el.innerHTML !== '*', 'blinds with asterisks should be emptied')
    })

})

asyncTest('Slide #1 Opens & Closes', function(){
    var quotes = document.getElementById('quotes'),
        slide = new Slide(quotes.getElementsByTagName('h3')[0])

    slide.open()
    setTimeout(function(){
        start()
        Array.prototype.forEach.call(slide.getBlinds(), function(blind, blindIdx){
            ok(blind.classList.contains('opened'), 'blind: ' + blindIdx + ' should have an opened class.')
        })
        stop()
        slide.close()
        setTimeout(function(){
            start()
            Array.prototype.forEach.call(slide.getBlinds(), function(blind, blindIdx){
                ok(!blind.classList.contains('opened'), 'blind: ' + blindIdx + ' should not have an opened class.')
            })
        }, 1000)
    }, 1000)
})

asyncTest('Slide sends open event', function(){
    var quotes = document.getElementById('quotes'),
        slide = new Slide(quotes.getElementsByTagName('h3')[0])

    quotes.addEventListener('openslide', function(){
        ok('blind opened')
        start()
    }, false)
    slide.open()
})

asyncTest('All Slides send open event once per transition', function(){
    expect(1)
    var quotes = document.getElementById('quotes'),
        slides = [],
        openSlides = 0

    Array.prototype.forEach.call(quotes.getElementsByTagName('h3'), function(el){
        slides.push( new Slide(el) )
    })

    quotes.addEventListener('openslide', function(){
        openSlides++
    }, false)

    slides.forEach(function(slide){
        slide.open()
    })

    setTimeout(function(){
        equal(openSlides, slides.length, 'all slides should be open after timeout')
        start()
    }, 1000)

})
