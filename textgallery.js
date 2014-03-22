/*global Modernizr,Event*/
'use strict';

var openslide = new CustomEvent('openslide', { bubbles: true  })

function Slide(h3, gallery){
    var transEndEventName,
        transEndEventNames

    this.blinds = []
    this.el = h3

    Array.prototype.forEach.call( this.el.children, function(el) {
        if ( el.innerHTML === '*' ) {
            el.innerHTML = ''
        }
        this.blinds.push( el )
    }, this)

    this.open = function(blindIndex){
        if ( blindIndex === this.blinds.length ) {
            return
        } else if ( blindIndex === undefined ) {
            blindIndex = 0
        }

        this.blinds[blindIndex].classList.add('opened')
        setTimeout(this.open.bind(this, blindIndex+1), 110)
    }

    this.close = function(blindIndex){
        if ( blindIndex === this.blinds.length ) {
            return
        } else if ( blindIndex === undefined ) {
            blindIndex = 0
        }

        this.blinds[blindIndex].classList.remove('opened')
        setTimeout(this.close.bind(this, blindIndex+1), 110)
    }

    this.getBlinds = function() {
        return this.blinds
    }

    this.getBlind = function(n){
        return this.blinds[n-1]
    }

    this.lastBlind = function(){
        return this.blinds[this.blinds.length-1]
    }

    transEndEventNames = {
        'WebkitTransition' : 'webkitTransitionEnd',// Saf 6, Android Browser
        'MozTransition'    : 'transitionend',      // only for FF < 15
        'transition'       : 'transitionend'       // IE10, Opera, Chrome, FF 15+, Saf 7+
    }

    transEndEventName = transEndEventNames[ Modernizr.prefixed('transition') ];

    function blindHandler(e) {
        if ( e.target.nodeName === 'DIV' &&
             e.target.classList.contains('blind') ) {
            if ( this.opened ) {
                e.stopImmediatePropagation()
            } else if ( this.blinds.length === this.el.querySelectorAll('.opened').length ) {
                this.opened = true
                this.el.dispatchEvent(openslide)
            }
        }
    }

    this.el.addEventListener(transEndEventName, blindHandler.bind(this), false)

}



Slide.prototype.animate = function(){
    console.log('calling animate on:', this)

    this.g.openSlide = this
    setTimeout(this.staggerClose, 4500)
    this.staggerOpen()
    this.el.classList.remove('closed')
}

function Gallery(c){
    var quotes = c.getElementsByTagName('h3'),
        pos,
        li,
        i,
        dotHandler,
        galleryHandler,
        transEndEventName,
        transEndEventNames

    // Slides array for reference
    this.slides = []

    // Animation Queue
    this.q = []


    // for ( i = 0; i < quotes.length; i++ ){
    //     this.slides.push( new Slide(quotes[i], self) )
    //     this.q.push(i)
    // }

    // dotHandler = function(dot){
    //     // get current li based on front of queue
    //     li = self.els[self.q[0]]

    //     Array.prototype.forEach.call(self.els, function(el) {
    //         el.classList.remove('active-slide')
    //     })
    //     li.classList.add('active-slide')
    //     pos = li.offsetLeft
    //     var p = $(li).addClass('active-slide').position()
    //     $('#dot').animate({
    //         left: p.left
    //     })
    // }

    // galleryHandler = function(e){
    //     // console.log('tranitionend handler')
    //     if ( e.target.nodeName.toLowerCase() === 'a' &&
    //             !e.target.classList.contains('back') ||
    //             e.target.id === 'bullets' ) {
    //         // console.log('do nothing')
    //         return 
    //     }
    //     // console.log('check slides')
    //     var openSlide = self.getCurrent(),
    //         lastBlind = openSlide.lastBlind(),
    //         thirdFromEnd = openSlide.getBlind(openSlide.blinds.length-1),
    //         currentBlind = e.target

    //     if ( ( self.getCurrent().blinds.length === 1 && $(openSlide.blinds[0]).hasClass('closed') ) ||
    //          currentBlind === thirdFromEnd && $(thirdFromEnd).hasClass('closed') ) {
    //         if (self.q.userChoice){
    //             // userChoice flags when the user selects a specific slide
    //             // the flag notifies us to override the typical update operation,
    //             // which would just load whatever is sequentially next.
    //             self.getNext().animate()
    //             self.q.userChoice = false
    //             openSlide.$el.addClass('closed')
    //         } else {
    //             // otherwise call update(), which updates the queue with the
    //             // following slide in sequential order
    //             //
    //             // there's probably a way to refactor this so we can respect
    //             // user choices without needing to force an override.
    //             // console.log('need to grab next slide in queue and start animation')
    //             self.update().animate()
    //             openSlide.$el.addClass('closed')
    //         }
    //         dotHandler()
    //     }
    // }

    // transEndEventNames = {
    //     'WebkitTransition' : 'webkitTransitionEnd',// Saf 6, Android Browser
    //     'MozTransition'    : 'transitionend',      // only for FF < 15
    //     'transition'       : 'transitionend'       // IE10, Opera, Chrome, FF 15+, Saf 7+
    // }
    // transEndEventName = transEndEventNames[ Modernizr.prefixed('transition') ];

    // c.addEventListener(transEndEventName, galleryHandler, false)
    // // $(c).on(transEndEventName, galleryHandler)
    // // $(c).on('transitionend', galleryHandler)
    // // $(c).on('webkitTransitionEnd', galleryHandler)
    // // $(c).on('transitionEnd', galleryHandler)

    // //$(c).on('click', '.indicators a', function(e){
    // c.addEventListener('click', function(e) {
    //     if ( e.target.tagName.toLowerCase() === 'a' && e.target.parent.classList.contains('indicators') ) {
    //         e.preventDefault()
    //         self.update(e.target.id)
    //         dotHandler()
    //     }
    // })

    return {
        init : function() {
            // var ul = document.createElement('ul'),
            //     dot = document.createElement('div'),
            //     bullets = document.getElementById('bullets'),
            //     i,
            //     li,
            //     a

            // dot.setAttribute('id','dot')
            // dot.classList.add('dot')

            // ul.appendChild(dot)

            // for (i = 0; i < this.slides.length; i++){
            //     li = document.createElement('li')
            //     if (i === 0) {
            //         li.classList.add('active-slide')
            //     }
            //     a = document.createElement('a')
            //     a.setAttribute('id', i) 
            //     li.appendChild(a)
            //     ul.appendChild(li)
            // }
            // bullets.appendChild(ul)

            // // Slide bullets
            // this.els = bullets.getElementsByTagName('li') 

            this.getCurrent().animate()
        },
        destroy : function() {},
        start : function() {},
        stop : function() {},
        next : function() {},
        prev : function() {},
        goTo : function() {},
    }
}

Gallery.prototype.getCurrent = function(){
    return this.openSlide || this.slides[0]
}

Gallery.prototype.getNext = function(){
    if (this.openSlide) {
        return this.slides[this.q[0]]
    } else {
        return this.slides[1]
    }
}

Gallery.prototype.update = function(){
    if (arguments.length < 1) {
        // console.log('calling update')
        // move closed slide to end of queue
        // next slide to open moves to first position
        var justClosed = this.q.shift()
        this.q.push(justClosed)
    } else {
        // move user selected slide to first position
        var nextIndex = parseInt(arguments[0], 10)
        var end = this.q.splice(0, this.q.indexOf(nextIndex))
        this.q = this.q.concat(end)
        // userChoice flag to override standard update calls
        this.q.userChoice = true
    }
    // next slide, either standard sequence or user-selected is in q[0]
    return this.slides[this.q[0]]
}

Gallery.prototype.getQueue = function(){
    return this.q
}

Gallery.prototype.init = function(){
}

function checkQuoteHeight(){
    var quotes = document.getElementById('quotes')

    function inspect() {
        quotes.classList.toggle( 'small', quotes.clientHeight < 370 )
        setTimeout(inspect, 150)
    }

    inspect()
}
