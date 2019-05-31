/**
 * This shim allows elements written in, or compiled to, ES5 to work on native
 * implementations of Custom Elements v1. It sets new.target to the value of
 * `this.constructor` so that the native HTMLElement constructor can access the
 * current under-construction element's definition.
 */
const NATIVE_SHIM = (() => {
	const _window = window as any;
	if (
		// No Reflect, no classes, no need for shim because native custom elements
		// require ES2015 classes or Reflect.
		_window.Reflect === undefined ||
		_window.customElements === undefined
	) {
		return;
	}
	const BuiltInHTMLElement = HTMLElement;
	/**
	 * With jscompiler's RECOMMENDED_FLAGS the function name will be optimized away.
	 * However, if we declare the function as a property on an object literal, and
	 * use quotes for the property name, then closure will leave that much intact,
	 * which is enough for the JS VM to correctly set Function.prototype.name.
	 */
	const wrapperForTheName = {
		HTMLElement: /** @this {!Object} */ function HTMLElement() {
			return Reflect.construct(
				BuiltInHTMLElement,
				[],
				/** @type {!Function} */
				(this.constructor)
			);
		}
	};

	_window.HTMLElement = wrapperForTheName['HTMLElement'];
	HTMLElement.prototype = BuiltInHTMLElement.prototype;
	HTMLElement.prototype.constructor = HTMLElement;
	Object.setPrototypeOf(HTMLElement, BuiltInHTMLElement);
})();
