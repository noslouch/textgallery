/*global Modernizr,Event*/
'use strict';


function Slide(h3, gallery){
    var transEndEventName,
        transEndEventNames,
        blinds = [],
        el = h3,
        currentTimer,
        state = 'closed'

    Array.prototype.forEach.call( el.children, function(el) {
        if ( el.nodeName !== 'DIV' || !el.classList.contains('blind') ) {
            throw new Error('Blinds must be wrapped in a <div /> of class blind')
        } else if ( el.innerHTML === '*' ) {
            el.innerHTML = ''
        }
        el.classList.add('closed')
        blinds.push( el )
    }, this)

    function open(blindIndex){
        if ( blindIndex === undefined ) {
            blindIndex = 0
        }

        state = 'opening'
        blinds[blindIndex].classList.add('opened')
        blinds[blindIndex].classList.remove('closed')
        blindIndex++

        if ( blindIndex === blinds.length ) {
            state = 'open'
            return
        } else {
            // 200 ms seems to be the interval floor, otherwise the event handler doubles up
            currentTimer = setTimeout( function() {
                open( blindIndex )
            }, 200 )
        }
    }

    function close(blindIndex){
        if ( blindIndex === undefined ) {
            blindIndex = 0
        }

        state = 'closing'
        blinds[blindIndex].classList.remove('opened')
        blinds[blindIndex].classList.add('closed')
        blindIndex++

        if ( blindIndex === blinds.length ) {
            state = 'closed'
            return
        } else {
            // 200 ms seems to be the interval floor, otherwise the event handler doubles up
            currentTimer = setTimeout( function() {
                close( blindIndex )
            }, 200 )
        }
    }

    function pause() {
        clearTimeout( currentTimer )
        switch (state) {
            case 'opening':
                return el.querySelector('.closed')
                break;
            case 'open':
            case 'closing':
                return el.querySelector('.opened')
                break;
            case 'closed':
                return false
                break;
            default:
                throw new Error('.pause() error.')
        }
    }

    function getBlinds() {
        return blinds
    }

    function getBlind(n){
        return blinds[n]
    }

    function lastBlind(){
        return blinds[blinds.length-1]
    }

    function getEl(){
        return el
    }

    transEndEventNames = {
        'WebkitTransition' : 'webkitTransitionEnd',// Saf 6, Android Browser
        'MozTransition'    : 'transitionend',      // only for FF < 15
        'transition'       : 'transitionend'       // IE10, Opera, Chrome, FF 15+, Saf 7+
    }

    transEndEventName = transEndEventNames[Modernizr.prefixed('transition')]

    function blindHandler(e) {
        /*jshint validthis:true*/
        if ( e.target.nodeName === 'DIV' &&
             e.target.classList.contains('blind') ) {

            if ( blinds.length === el.querySelectorAll('.opened').length ) {
                el.dispatchEvent( new Event('openslide', { bubbles : true }) )
                e.stopImmediatePropagation()
            } else if ( blinds.length === el.querySelectorAll('.closed').length ) {
                el.dispatchEvent( new Event('closeslide', { bubbles : true }) )
                e.stopImmediatePropagation()
            }

        }
    }

    el.addEventListener(transEndEventName, blindHandler.bind(this), false)

    return {
        getBlinds : getBlinds.bind(this),
        getBlind : getBlind.bind(this),
        lastBlind : lastBlind.bind(this),
        open : open.bind(this),
        close : close.bind(this),
        getEl : getEl.bind(this),
        pause : pause.bind(this)
    }
}

/** Gallery constructor
 * @constructor
 */
function Gallery(c) {
    var quotes = c.getElementsByTagName('h3'),
        isPlaying = false,
        currentIndex,
        nextIndex,
        currentSlide,
        nextSlide,
        el = c,
        currentTimer,
        pos,
        li,
        i,
        dotHandler,
        galleryHandler,
        transEndEventName,
        transEndEventNames,
        slides = [],
        q = [],
        resumeFromBlindEl,
        resumeFromBlindIndex

    Array.prototype.forEach.call( quotes, function(slide) {
        slides.push( new Slide(slide) )
    } )

    function slideHandler(e) {
        currentIndex = getSlideIndex(e.target)
        nextIndex = currentIndex + 1 === getSlides().length ? 0 : currentIndex + 1
        currentSlide = getSlide(currentIndex)
        nextSlide = getSlide(nextIndex)

        if (e.type === 'openslide') {
            currentTimer = setTimeout(function() {
                currentSlide.close()
            }, 1000)
        } else if ( e.type === 'closeslide' ) {
            currentTimer = setTimeout(function() {
                nextSlide.open()
            }, 1000)
        }
    }

    el.addEventListener('openslide', slideHandler, false)
    el.addEventListener('closeslide', slideHandler, false)

    function setCurrents() {
        nextIndex = currentIndex + 1 === getSlides().length ? 0 : currentIndex + 1
        currentSlide = getSlide(currentIndex)
        nextSlide = getSlide(nextIndex)
    }

    /**
     * Play the gallery.
     * This method is used to start playing the first time the Gallery loads as
     * well as after calls to {@link Gallery~pause} .pause().
     * Plays from the first slide by default. Optionall include a zero-indexed
     * slide number to start playing from a different slide.
     * @param {string} [index=0] - Begin playing from the slide at the given index
     */
    function play(index){
        var method

        if ( isPlaying ) {
            return 'Already playing.'
        }
        isPlaying = true

        if ( currentIndex !== undefined && !index ) {
            // resuming from a pause
            if ( !resumeFromBlindEl ) {
                // current slide is already closed
                // open nextSlide from beginning
                nextSlide.open()
            } else {
                resumeFromBlindIndex = currentSlide.getBlinds().indexOf(resumeFromBlindEl)

                if ( resumeFromBlindEl.classList.contains('closed') ) {
                    currentSlide.open(resumeFromBlindIndex)
                } else {
                    currentSlide.close(resumeFromBlindIndex)
                }
            }
        } else if ( index !== undefined && !currentIndex ) {
            // initial play; choosing a starting slide
            currentIndex = index
            setCurrents()
            getSlide(index).open()
        } else if ( !index && !currentIndex ) {
            // intial play; default from slide at position 0
            currentIndex = index = 0
            setCurrents()
            getSlide(index).open()
        } else {
            throw new Error('.play() error')
        }
    }

    /**
     * Pauses the gallery at the current slide
     */
    function pause(){
        clearTimeout(currentTimer)
        resumeFromBlindEl = currentSlide.pause()
        isPlaying = false
    }

    function getEl(){
        return el
    }

    function getSlideIndex(slide) {
        if ( slide instanceof Element ) {
            return Array.prototype.indexOf.call(quotes, slide)
        } else {
            return slides.indexOf(slide)
        }
    }


    function getSlide(index) {
        return slides[index]
    }

    function getSlides() {
        return slides
    }

    function getCurrentSlide() {
        return currentSlide
    }

    function getCurrentSlideIndex() {
        return getSlideIndex(getCurrentSlide())
    }

    // start()

    return {
        getEl : getEl.bind(this),
        getCurrentSlide : getCurrentSlide.bind(this),
        getCurrentSlideIndex : getCurrentSlideIndex.bind(this),
        destroy : function() {},
        play : play.bind(this),
        pause : pause.bind(this),
        next : function() {},
        prev : function() {},
        goTo : function() {},
        getSlide : getSlide.bind(this),
        getSlides : getSlides.bind(this),
        getSlideIndex : getSlideIndex.bind(this),
        isPlaying : function() {
            return isPlaying
        }
    }
}
