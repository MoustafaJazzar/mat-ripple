# MatRipple

> Material design Ripple effect.

[![npm version](https://badgen.net/npm/v/mat-ripple)](https://www.npmjs.com/package/mat-ripple) [![npm dependencies](https://badgen.net/david/dep/moustafajazzar/mat-ripple)](https://david-dm.org/moustafajazzar/mat-ripple) [![devDependencies Status](https://david-dm.org/moustafajazzar/mat-ripple/dev-status.svg)](https://david-dm.org/moustafajazzar/mat-ripple?type=dev) [![bundle size](https://badgen.net/bundlephobia/minzip/mat-ripple)](https://bundlephobia.com/result?p=mat-ripple) [![Known Vulnerabilities](https://snyk.io/test/github/moustafajazzar/mat-ripple/badge.svg)](https://snyk.io/test/github/moustafajazzar/mat-ripple)

## Install

##### NPM

```bash
$ npm i mat-ripple
```

##### CDN

```html
<script src="https://unpkg.com/mat-ripple"></script>
```

### Import

```javascript
// ES6
import MatRipple from 'mat-ripple';

// CommonJS
const MatRipple = require('mat-ripple');
```

### Usage

MatRipple is a `cusomElement`so it can be used directly in the `html` like so `<mat-ripple>`

```html
<div id="container">
	<button id="myAwesomeBtn">
		Click me
		<mat-ripple></mat-ripple>
	</button>
</div>
```

or

```javascript
// ES6
import MatRipple from 'mat-ripple';

let myAwesomeBtn = document.getElementById('myAwesomeBtn');
let ripple = new MatRipple();

myAwesomeBtn.appendChild(ripple);
```

### Properties

| Name      | Type    | Default     | Description                                                                                                                                                                                                      |
| --------- | ------- | ----------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| color     | string  | `#00000033` | Custom color or any valid `CSS` background property for all ripples.                                                                                                                                             |
| unbounded | boolean | `false`     | Whether the ripples should be visible outside the component's bounds.                                                                                                                                            |
| disabled  | boolean | `false`     | Whether click events will not trigger the ripple. Ripples can be still launched manually by using the `launch` method.                                                                                           |
| centered  | boolean | `false`     | Whether the ripple always originates from the center of the host element's bounds, rather than originating from the location of the click event.                                                                 |
| radius    | number  | `0`         | If set, the radius in pixels of foreground ripples when fully expanded. If unset, the radius will be the distance from the center of the ripple to the furthest corner of the host element's bounding rectangle. |

```html
<div id="container">
	<button id="myAwesomeBtn">
		Click me
		<mat-ripple
			color="#49b3a533"
			disabled
			centered
			unbounded
			radius="70"
		></mat-ripple>
	</button>
</div>
```

#### API

```javascript
// ES6
import MatRipple from 'mat-ripple';

let myAwesomeBtn = document.getElementById('myAwesomeBtn');
let container = document.getElementById('container');

let ripple = new MatRipple();
/**
 * Custom color or any valid `CSS` background property for all ripples.
 * @default `rgba(0,0,0,.2)`.
 */
ripple.color = '#ff000033';

/**
 * Set whether the ripple always originates from the center of the host element's bounds, rather
 * than originating from the location of the click event.
 * @default false
 */
ripple.centered = true;

/** Set whether the ripples should be visible outside the component's bounds.
 * @default false
 */
ripple.unbounded = true;

/**
 * If set, the radius in pixels of ripples when fully expanded.
 * If unset, the radius will be the distance from the center of the ripple
 * to the furthest corner of the host element's bounding rectangle.
 * @default 0
 */
ripple.radius = 70;

/**
 * whether click events will not trigger the ripple.
 * @default false
 */
ripple.disabled = false;

/**
 * Configuration for the ripple animation.
 * Allows modifying the enter and exit animation duration of the ripples.
 * The animation durations will be overwritten if the NoopAnimationsModule is being used.
 */
ripple.animation = {
	/**
	 * Duration in milliseconds for the enter animation (expansion from point of contact).
	 * @default 450
	 */
	enterDuration: 5000,
	/**
	 * Duration in milliseconds for the exit animation (fade-out).
	 * @default 400
	 */
	exitDuration: 1000
};

/**
 * The element that triggers the ripple when click events are received.
 * @default the host element.
 */
ripple.trigger = container;

myAwesomeBtn.appendChild(ripple);
```

#### Global options

Instantiate `MatRipple` using global options.

```javascript
// ES6
import MatRipple from 'mat-ripple';

const globalOptions = {
	/**
	 * Whether ripples should be disabled. Ripples can be still launched manually by using
	 * the `launch` method. Therefore focus indicators will still show up.
	 * @default false
	 */
	disabled: false,

	/**
	 * Configuration for the animation duration of the ripples. There are two phases with different
	 * durations for the ripples.
	 */
	animation: {
		/**
		 * Duration in milliseconds for the enter animation (expansion from point of contact).
		 * @default 450
		 */
		enterDuration: 5000,

		/**
		 * Duration in milliseconds for the exit animation (fade-out).
		 * @default 400
		 */
		exitDuration: 1000
	},

	/**
	 * Whether ripples should start fading out immediately after the mouse or touch is released. By
	 * default, ripples will wait for the enter animation to complete and for mouse or touch release.
	 * @default  false
	 */
	terminateOnPointerUp: false
};

const ripple = new MatRipple(globalOptions);
```

#### Methods

```javascript
/**
 * Launches a manual ripple at the specified coordinates within the element.
 * @param x Coordinate within the element, along the X axis at which to fade-in the ripple.
 * @param y Coordinate within the element, along the Y axis at which to fade-in the ripple.
 * @param config Optional ripple configuration for the manual ripple.
 */
launch(x, y, config);

/**
 * Fades out all currently showing ripple elements.
 */
fadeOutAll();
```

#### Demo

A simple [demo](https://codepen.io/MoustafaJazzar/pen/WBYpLN) using the `UMD` version.

#### License

MIT
