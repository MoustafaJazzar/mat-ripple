import { RippleConfig } from './Types';

/**
 * Interface that describes the configuration for the animation of a ripple.
 * There are two animation phases with different durations for the ripples.
 */
export interface RippleAnimationConfig {
	/** Duration in milliseconds for the enter animation (expansion from point of contact). */
	enterDuration?: number;
	/** Duration in milliseconds for the exit animation (fade-out). */
	exitDuration?: number;
}

/**
 * Configurable options for `MatRipple`.
 */
export interface RippleGlobalOptions {
	/**
	 * Whether ripples should be disabled. Ripples can be still launched manually by using
	 * the `launch()` method. Therefore focus indicators will still show up.
	 */
	disabled?: boolean;

	/**
	 * Configuration for the animation duration of the ripples. There are two phases with different
	 * durations for the ripples.
	 */
	animation?: RippleAnimationConfig;

	/**
	 * Whether ripples should start fading out immediately after the mouse or touch is released. By
	 * default, ripples will wait for the enter animation to complete and for mouse or touch release.
	 */
	terminateOnPointerUp?: boolean;
}

/**
 * Interface that describes the target for launching ripples.
 * It defines the ripple configuration and disabled state for interaction ripples.
 */
export interface RippleTarget {
	/** Configuration for ripples that are launched on pointer down. */
	rippleConfig: RippleConfig;
	/** Whether ripples on pointer down should be disabled. */
	rippleDisabled: boolean;
}
