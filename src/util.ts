/** Cached result of whether the user's browser supports passive event listeners. */
let supportsPassiveEvents: boolean;
/**
 * Checks whether the user's browser supports passive event listeners.
 * See: https://github.com/WICG/EventListenerOptions/blob/gh-pages/explainer.md
 */
function supportsPassiveEventListeners(): boolean {
	if (supportsPassiveEvents == null && typeof window !== 'undefined') {
		try {
			window.addEventListener(
				'test',
				null!,
				Object.defineProperty({}, 'passive', {
					get: () => (supportsPassiveEvents = true)
				})
			);
		} finally {
			supportsPassiveEvents = supportsPassiveEvents || false;
		}
	}

	return supportsPassiveEvents;
}

/**
 * Normalizes an `AddEventListener` object to something that can be passed
 * to `addEventListener` on any browser, no matter whether it supports the
 * `options` parameter.
 * @param options Object to be normalized.
 */

export function normalizePassiveListenerOptions(
	options: AddEventListenerOptions
): AddEventListenerOptions | boolean {
	return supportsPassiveEventListeners() ? options : !!options.capture;
}

/**
 * Screen readers will often fire fake mousedown events when a focusable element
 * is activated using the keyboard. We can typically distinguish between these faked
 * mousedown events and real mousedown events using the "buttons" property. While
 * real mousedown will indicate the mouse button that was pressed (e.g. `1` for
 * the left mouse button), faked mousedown will usually set the property value to 0.
 */
export function isFakeMousedownFromScreenReader(event: MouseEvent): boolean {
	return event.buttons === 0;
}

/** Enforces a style recalculation of a DOM element by computing its styles. */
export function enforceStyleRecalculation(element: HTMLElement) {
	/**
	 * Enforce a style recalculation by calling `getComputedStyle` and accessing any property.
	 * Calling `getPropertyValue` is important to let optimizer know that this is not a noop.
	 * See: `https://gist.github.com/paulirish/5d52fb081b3570c81e3a`
	 */
	window.getComputedStyle(element).getPropertyValue('opacity');
}

/**
 * Returns the distance from the point (x, y) to the furthest corner of a rectangle.
 */
export function distanceToFurthestCorner(
	x: number,
	y: number,
	rect: ClientRect
) {
	const distX = Math.max(Math.abs(x - rect.left), Math.abs(x - rect.right));
	const distY = Math.max(Math.abs(y - rect.top), Math.abs(y - rect.bottom));
	return Math.sqrt(distX * distX + distY * distY);
}
