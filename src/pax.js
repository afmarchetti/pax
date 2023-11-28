/**
 * Pax 1.0.0
 * 
 * File pax.js.
 *
 * Yet another parallax script. Pax is intended to make it a lot easier to
 * make objects move vertically or horizontally when scroll, being it images,
 * divs or what-have-you. Use this script to add background or foreground parallax
 * effect to your website.
 *
 * Website: https://www.marchettidesign.net
 * Github: https://github.com/afmarchetti/pax
 *
 * Based on Diego Versani Smooth Parallax: https://github.com/diegoversiani/smooth-parallax
 * And the work of Rachel Smith: https://codepen.io/rachsmith/post/how-to-move-elements-on-scroll-in-a-way-that-doesn-t-suck-too-bad
 */

(function (root, factory) {
  if ( typeof define === 'function' && define.amd ) {
    define([], factory(root));
  } else if ( typeof exports === 'object' ) {
    module.exports = factory(root);
  } else {
    root.Pax = factory(root);
  }
})(typeof global !== 'undefined' ? global : this.window || this.global, function (root) {

  'use strict';

  //
  // Variables
  //

  let window = root; // Map window to root to avoid confusion
  let _container;
  let _height, _viewPortHeight;
  let _scrollPercent = 0;
  let _scrollOffset = 0;
  let _movingElements = [];
  let _positions = [];
  let _basePercentageOnOptions = [ 'containerVisibility', 'pageScroll' ];
  let _settings;
  let publicMethods = {}; // Placeholder for public methods

  // Default settings
  let defaults = {
    basePercentageOn: 'containerVisibility', // See `_basePercentageOnOptions` for more options
    decimalPrecision: 2
  };


  //
  // Methods
  //

  /**
   * Merge two or more objects. Returns a new object.
   * @private
   * @param {Boolean}  deep     If true, do a deep (or recursive) merge [optional]
   * @param {Object}   objects  The objects to merge together
   * @returns {Object}          Merged values of defaults and options
   */
  let extend = function () {
    // Variables
    let extended = {};
    let deep = false;
    let i = 0;
    let length = arguments.length;

    // Check if a deep merge
    if ( Object.prototype.toString.call( arguments[0] ) === '[object Boolean]' ) {
      deep = arguments[0];
      i++;
    }

    // Merge the object into the extended object
    let merge = function (obj) {
      for ( let prop in obj ) {
        if ( Object.prototype.hasOwnProperty.call( obj, prop ) ) {
          // If deep merge and property is an object, merge properties
          if ( deep && Object.prototype.toString.call(obj[prop]) === '[object Object]' ) {
            extended[prop] = extend( true, extended[prop], obj[prop] );
          } else {
            extended[prop] = obj[prop];
          }
        }
      }
    };

    // Loop through each object and conduct a merge
    for ( ; i < length; i++ ) {
      let obj = arguments[i];
      merge(obj);
    }

    return extended;
  };


  /**
   * Get movable element container
   * @private
   */
  let getElementContainer = function ( element ) {
    let containerSelector = element.getAttribute( 'container' );
    _container = element.parentNode;

    if ( containerSelector != '' && document.querySelector( containerSelector ) ) {
      _container = document.querySelector( containerSelector );
    }

    return _container;
  };


  /**
   * Calculate page percent scrolled.
   * @private
   */
  let calculatePageScrollPercent = function () {
    let documentElement = document.documentElement || document.body;
    _height = documentElement.scrollHeight;
    _scrollOffset = window.pageYOffset || documentElement.scrollTop;
    return _scrollOffset / ( _height - documentElement.clientHeight );
  };



  /**
   * Calculate variables used to determine elements position
   * @private
   */
  let calculatePercent = function ( positionData ) {
    _viewPortHeight = window.innerHeight;

    // Based on `containerVisibility`
    if ( _settings.basePercentageOn == 'containerVisibility' ) {  
      _height = positionData.container.scrollHeight;
      _scrollOffset = _viewPortHeight - positionData.container.getBoundingClientRect().top;
      _scrollPercent = _scrollOffset / _height;
    }

    // Based on `pageScroll`
    if ( _settings.basePercentageOn == 'pageScroll' ) {
      _scrollPercent = calculatePageScrollPercent();
    }

    // Normalize scrollPercentage from 0 to 1
    if ( _scrollPercent < 0 ) {
      _scrollPercent = 0;
    }
    else if ( _scrollPercent > 1 ) {
      _scrollPercent = 1;
    }
  };



  /**
   * Get position data object for the element.
   * @returns {Object} Position data object for element or false if not found.
   */
  let getPositionDataByElement = function ( el ) {
    for (let i = 0; i < _positions.length; i++) {
      if ( _positions[i].element == el ) {
        return _positions[i];
      }
    }
    
    // Return false if not found
    return false;
  }



  /**
   * Initializes positions for each moving element.
   * @private
   */
  let initializeMovingElementsPosition = function () {
    let startPercent,
        startX,
        startY,
        endPercent,
        endX,
        endY,
        baseSizeOn,
        bgParallaxInfo,
        baseSizeOnOptions = [ 'elementsize', 'containerSize' ];

    _movingElements = document.querySelectorAll('.pax'); // activation css class
	  
    for (let i = 0; i < _movingElements.length; i++) {
		

		
	const myArray = Array.from(_movingElements[i].classList);
    
    //get css value
  	const startMovement = myArray.find((string) => string.startsWith("start--"));
		const endMovement = myArray.find((string) => string.startsWith("end--"));
    const startPositionX = myArray.find((string) => string.startsWith("startx--"));
    const startPositionY = myArray.find((string) => string.startsWith("starty--"));
    const endPositionX = myArray.find((string) => string.startsWith("endx--"));
    const endPositionY = myArray.find((string) => string.startsWith("endy--"));
    const baseSize = myArray.find((string) => string.startsWith("basesize--"));
    const bgParallax = myArray.find((string) => string.startsWith("bg--"));

      //extract css value
      startPercent = startMovement ? parseFloat(startMovement.split("--")[1]) : 0;
      startX = startPositionX ? parseFloat(startPositionX.split("--")[1]) : 0;
      startY = startPositionY ? parseFloat(startPositionY.split("--")[1]) : 0;
      endPercent =  endMovement ? parseFloat(endMovement.split("--")[1]) : 0;
      endX = endPositionX ? parseFloat(endPositionX.split("--")[1]) : 0;
      endY = endPositionY ? parseFloat(endPositionY.split("--")[1]) : 0;
      baseSizeOn = baseSize ? parseFloat(baseSize.split("--")[1]) : 0;
      bgParallaxInfo = bgParallax ? parseFloat(bgParallax.split("--")[1]) : 0;

      if ( baseSizeOnOptions.indexOf( baseSizeOn ) == -1 ) {
        baseSizeOn = 'elementSize'; // Default value
      }

      let elementPosition = {
        element: _movingElements[i],
        container: getElementContainer( _movingElements[i] ),
        baseSizeOn: baseSizeOn,
        bgParallaxInfo : bgParallaxInfo,
        start: {
          percent: startPercent,
          x: startX,
          y: startY
        },
        end: {
          percent: endPercent,
          x: endX,
          y: endY
        },
        diff: {
          percent: endPercent - startPercent,
          x: endX - startX,
          y: endY - startY,
        },
        target: {},
        current: {}
      };

      _positions.push( elementPosition );
    }
  };

  /**
   * Updates moving elements position.
   * @private
   */
  let updateElementsPosition = function () {
    for (let i = 0; i < _movingElements.length; i++) {
      let p = _positions[i],
          baseWidth,
          baseHeight,
          bgParallaxPos;

      // Try get element's size with `scrollWidth` and `scrollHeight`
      // otherwise use `getComputedStyle` which is more expensive
      if ( p.baseSizeOn == 'elementSize' ) {
        baseWidth = _movingElements[i].scrollWidth || parseFloat( window.getComputedStyle( _movingElements[i] ).width );
        baseHeight = _movingElements[i].scrollHeight || parseFloat( window.getComputedStyle( _movingElements[i] ).height );
      }
      else if ( p.baseSizeOn == 'containerSize' ) {
        baseWidth = p.container.scrollWidth - (_movingElements[i].scrollWidth || parseFloat( window.getComputedStyle( _movingElements[i] ).width ) );
        baseHeight = p.container.scrollHeight - (_movingElements[i].scrollHeight  || parseFloat( window.getComputedStyle( _movingElements[i] ).height ) );
      }

      // Need to calculate percentage for each element
      // when based on `containerVisibility`
      calculatePercent( p );
      
      // calculate target position
      if(_scrollPercent <= p.start.percent) {
        p.target.x = p.start.x * baseWidth;
        p.target.y = p.start.y * baseHeight;
      }
      else if(_scrollPercent >= p.end.percent) {
        p.target.x = p.end.x * baseWidth;
        p.target.y = p.end.y * baseHeight;
      }
      else {
        p.target.x = p.start.x * baseWidth + ( p.diff.x * ( _scrollPercent - p.start.percent ) / p.diff.percent * baseWidth );
        p.target.y = p.start.y * baseHeight + ( p.diff.y * ( _scrollPercent - p.start.percent ) / p.diff.percent * baseHeight );
      }
      
      // easing with linear interpolation
      if( !p.current.x || !p.current.y) {
        p.current.x = p.target.x;
        p.current.y = p.target.y;
      } else {
        p.current.x = p.current.x + (p.target.x - p.current.x) * 0.1;
        p.current.y = p.current.y + (p.target.y - p.current.y) * 0.1;
      }

      // Round to decimal precision to prevent
      // too many calculation trips
      p.current.x = parseFloat( p.current.x.toFixed( _settings.decimalPrecision ) );
      p.current.y = parseFloat( p.current.y.toFixed( _settings.decimalPrecision ) );

      // update element style
      _movingElements[i].style.transform = 'translate3d(' + p.current.x + 'px, ' + p.current.y + 'px, 0)';
      
      //update background (Bg Parallax)
      if(p.bgParallaxInfo){
  
        bgParallaxPos = p.bgParallaxInfo * _scrollPercent * 1000; // change position star when element enter and sto 
        bgParallaxPos = parseFloat( bgParallaxPos.toFixed( _settings.decimalPrecision ) ); // Round to decimal precision to prevent for perfomance
        
        _movingElements[i].style.backgroundPosition = 'center '+ '-' + bgParallaxPos + 'px'; // set backgorund position
        _movingElements[i].style.backgroundSize= ' auto ' +' 1'+ p.bgParallaxInfo * 100+'vh'; // set backgorund height size

      }      

    }
  };

  /**
   * Keep updating elements position infinitelly.
   * @private
   */
  let loopUpdatePositions = function () {
    updateElementsPosition();
    requestAnimationFrame( loopUpdatePositions );
  };

  /**
   * Keep updating elements position infinitelly.
   * @private
   */
  let isSupported = function () {
    let supported = true;

    // Test basePercentageOn settings
    if ( _basePercentageOnOptions.indexOf( _settings.basePercentageOn ) == -1 ) {
      supported = false;
      console.error( 'Value not supported for setting basePercentageOn: ' + _settings.basePercentageOn );
    }

    // TODO: ADD feature test for `querySelector`
    // TODO: ADD feature test for css property `translate3d`

    return supported;
  };

  /**
   * Initializes plugin
   */
  publicMethods.init = function ( options ) {
    // Merge user options with defaults
    _settings = extend( defaults, options || {} );
    _settings.decimalPrecision = parseInt( _settings.decimalPrecision ) || defaults.decimalPrecision;

    // Bail early if not supported
    if ( !isSupported() ) { return; }

    // Initialize variables
    initializeMovingElementsPosition();
    loopUpdatePositions();
  };

  /**
   * Get scroll percentage for the element or page.
   * @param {string} el Target element css selector.
   * @return {float} Scroll percentage for the element or the page.
   */
  publicMethods.getScrollPercent = function ( selector ) {
    // Calculate page scroll if no selector was passed
    if ( selector == undefined ) {
      return calculatePageScrollPercent();
    }

    // Find element
    // Return false if not found
    let el = document.querySelector( selector );
    if ( el == null ) return false;

    // Calculate element scroll percent
    let positionData = getPositionDataByElement( el );
    if ( positionData ) {
      calculatePercent( positionData );
      return _scrollPercent;
    }

    // Return false otherwise
    return false;
  };


  //
  // Public APIs
  //
  return publicMethods;

});

window.addEventListener("load", function () {
    Pax.init({ basePercentageOn: "containerVisibility" });
});
