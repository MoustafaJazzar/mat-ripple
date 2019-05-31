import { normalizePassiveListenerOptions } from './util';

/**
 * Default ripple animation configuration for ripples without an explicit
 * animation config specified.
 */
export const defaultRippleAnimationConfig = {
	enterDuration: 450,
	exitDuration: 400
};

/**
 * Timeout for ignoring mouse events. Mouse events will be temporary ignored after touch
 * events to avoid synthetic mouse events.
 */
export const ignoreMouseEventsTimeout = 800;

/** Options that apply to all the event listeners that are bound by the ripple renderer. */
export const passiveEventOptions = normalizePassiveListenerOptions({
	passive: true
});
