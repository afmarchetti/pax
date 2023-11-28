# Pax

Is a free parallax script base on Smooth Parallax by: https://github.com/diegoversiani/smooth-parallax
Parallax that doesn't suck! Parallax everything!
In this new version we have also:

- background parallax animation
- css class system to set the effect

No jQuery required, just plain 'ol javascript.

Smooth Parallax makes it easy to move objects when you scroll, being it images, divs or what-have-you. Use it to add that background or foreground parallax effect to your website or create amazing effects.





## Installation

Setting up is pretty straight-forward. Just download the script from __dist__ folder and include it in your HTML:

```html
<script type="text/javascript" src="path/to/pax.min.js"></script>
```

__Init__

Just call `Pax.init()` to get objects moving and configure elements movement.

```html
<script type="text/javascript">
  window.addEventListener("load", function () {
    Pax.init();
  });
</script>
```

Smooth Parallax will automatically look for all objects with the css class `pax` (ie.: `<img src="images/hippie-van.png" class="pax">`).

__Configure elements movement__

You'll also have to set at least one more css class `start--` or `end--`, see options at [standard options](#standard-options).

## Standard Options

__Global Options__

These options are passed to the `init` function when starting Pax.

- `basePercentageOn` Set how you want to track scroll percentage:
    - `containerVisibility` __default__: scroll percentage for each moving object is calculated only when the element's container is visible in the viewport. This prevents objects from moving while not visible.
    - `pageScroll`: scroll percentage is based on the page scroll and is the same for all moving objects.

__Elements Options__

These options are passed via css class after the double dash -- we have the value to the moving elements and define how that element movement behaves.

All percentage values are in decimal form, ie.: `1 = 100%`. You can also set values greater than 1 and smaller than 0, ie.: `-0.5 = -50%` or `1.25 = 125%`. Example `class="pax start--0  end--1 startx--0.5  bg--0.3"`

- `start--` - define at what scroll percentage to start moving the object. Default value is `0.0`;
- `end--` - define at what scroll percentage to stop moving the object. Default value is `1.0`.
- `startx` - define the horizontal start position of the element in percentage of its the base-size (see option below).
- `starty` - define the vertical start position of the element in percentage of its the base-size (see option below).
- `endx` - define the horizontal end position of the element in percentage of its the base-size (see option below).
- `endy` - define the vertical end position of the element in percentage of its the base-size (see option below).
- `container` - change the elements container element user to calculate its position, default is moving element's parent node.
- `basesize` - define how to calculate the base size of the movement, used to calculate the target position.
    - `elementSize`: calculate based on the element size itself.
    - `containerSize`: calculate based on the elements container size.
- `bg--` - add a background parallax animation to the elemente, the element need to have a background image to work.

## Contributing to Development

This is base on Diego Versani Smooth Parallax by: https://github.com/diegoversiani/smooth-parallax.


## Change Log

__1.0.0__

- Initial release

## License

Licensed under MIT. Enjoy.

## Acknowledgement

Pax was created by [Andrea Marchetti](https://marchettidesign.net) based on Smooth Parallax by [Diego Versiani](https://diegoversiani.me) we work for a better Parallax Effect.
