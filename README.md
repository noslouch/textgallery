textgallery.js
==============

One morning, one may wake up to a requirement for using text in a slideshow, 
like quotes about how great your website is or inspiring passages from ancient
texts. 

Most carousel plugins work best with images, so here's one that works best with
lines of text. Hooray!

#### [View the docs](http://noslouch.github.io/textgallery)
#### [View the demo](demo/)


Highlights
----------
- No dependencies[\*](#requirements)
- Lightweight
- Selectable text
- Slick test transitions
- Basic, easy-to-overwrite CSS
- Comes with a test suite if you want to extend or modify the source

## <a name="requirements">jQuery Not Required</a>
But you will need ES5, which should be pretty standard by now. Sorry if that
doesn't work for you.

Full browser compatability table coming soon.

Usage
-----

Textgallery works like a standard image gallery, with the addition of the notion
of **blinds**.

A parent container holds one or more slides. Each slide contains one or more
**blinds**. Think of a blind as a line of text. You'll need to figure out a way
to manage line breaks to work with your design.

Here's the sample DOM structure that textgallery works with.

    <div id="container">
        <div class="slide">
            <div class="blind">Winter is coming</div>
            <div class="blind">- Eddard Stark</div>
        </div>
        <div class="slide">
            <div class="blind">In the game of thrones,</div>
            <div class="blind">you win or you die.</div>
            <div class="blind">- Cersei Lannister</div>
        </div>
        <div class="slide">
            <div class="blind">All these quotes and more</div>
            <div class="blind">available for a limited time only!</div>
            <div class="blind"><a href="google.com">Click here for more</a></div>
        </div>
    </div>

Just initialize the Gallery constructor like so: 

    var gallery = new Gallery(document.getElementById('container'))
    gallery.play() // start from the beginning
    gallery.play(2) // start playing from the slide at index 2
    gallery.pause() // pause the animation at the current slide and blind
    gallery.play() // resume playing from where you left off

Browser Compatibility
---------------------

- **IE 9+**
- **Firefox 16+**
- **Safari 6+**
- **Chrome 26+**

Known Bugs
----------

### Safari

There is a bug in Safari where the browser loses track of the gallery if the window becomes inactive. Inactive means the browser is open but made invisible by viewing another tab, switching screens (on OSX), or other things of that nature.
