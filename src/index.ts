/**
 * This shim allows elements written in, or compiled to, ES5 to work on native
 * implementations of Custom Elements v1. It sets `new.target` to the value of
 * `this.constructor` so that the native `HTMLElement` constructor can access the
 * current under-construction element's definition.
 */
import { RippleGlobalOptions } from './Interfaces';
import './native-shim';
import { Ripple } from './ripple';

/**
 * Main class to export. can be used to define custom element.
 * It can also be extended to add more functionality or
 * modify any default configuration.
 */
export default class MatRipple extends Ripple {
	constructor(globalOptions?: RippleGlobalOptions) {
		super(globalOptions);
	}
}
/**
 * Define `mat-ripple` as a custom element using
 * the `MatRipple` class.
 */

customElements.define('mat-ripple', MatRipple);
