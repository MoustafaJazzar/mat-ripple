import { RippleRef } from './ripple-ref';

import { RippleState } from './Enums';
import { RippleTarget } from './Interfaces';
import { RippleConfig } from './Types';

import {
	distanceToFurthestCorner,
	enforceStyleRecalculation,
	isFakeMousedownFromScreenReader
} from './util';

import {
	defaultRippleAnimationConfig,
	ignoreMouseEventsTimeout,
	passiveEventOptions
} from './constants';

/**
 * Helper service that performs DOM manipulations. Not intended to be used outside this module.
 * The constructor takes a reference to the ripple host element and a map of DOM
 * event handlers to be installed on the element that triggers ripple animations.
 */
export class RippleRenderer {
	constructor(
		private _target: RippleTarget,
		elementRef: HTMLElement,
		pathElement: any
	) {
		this._containerElement = elementRef;
		this._pathElement = pathElement;

		// Specify events which need to be registered on the trigger.
		this._triggerEvents
			.set('mousedown', this._onMousedown.bind(this))
			.set('mouseup', this._onPointerUp.bind(this))
			.set('mouseleave', this._onPointerUp.bind(this))

			.set('touchstart', this._onTouchStart.bind(this))
			.set('touchend', this._onPointerUp.bind(this))
			.set('touchcancel', this._onPointerUp.bind(this));
	}
	/** Element where the ripples are being added to. */
	private _containerElement!: HTMLElement;

	/** Element which triggers the ripple elements on mouse events. */
	private _triggerElement!: HTMLElement | null;

	/** Whether the pointer is currently down or not. */
	private _isPointerDown = false;

	/** Events to be registered on the trigger element. */
	private _triggerEvents = new Map<string, any>();

	/** Set of currently active ripple references. */
	private _activeRipples = new Set<RippleRef>();

	/** Latest non-persistent ripple that was triggered. */
	private _mostRecentTransientRipple!: RippleRef | null;

	/** Time in milliseconds when the last touchstart event happened. */
	private _lastTouchStartEvent!: number;

	/**
	 * Cached dimensions of the ripple container. Set when the first
	 * ripple is shown and cleared once no more ripples are visible.
	 */
	private _containerRect!: ClientRect | null;

	/** Element where the ripples are being added to. */
	private _pathElement: any;

	/**
	 * Fades in a ripple at the given coordinates.
	 * @param x Coordinate within the element, along the X axis at which to start the ripple.
	 * @param y Coordinate within the element, along the Y axis at which to start the ripple.
	 * @param config Extra ripple options.
	 */
	fadeInRipple(x: number, y: number, config: RippleConfig = {}): RippleRef {
		const containerRect = (this._containerRect =
			this._containerRect ||
			this._containerElement.getBoundingClientRect());
		const animationConfig = {
			...defaultRippleAnimationConfig,
			...config.animation
		};

		if (config.centered) {
			x = containerRect.left + containerRect.width / 2;
			y = containerRect.top + containerRect.height / 2;
		}

		const radius =
			config.radius || distanceToFurthestCorner(x, y, containerRect);
		const offsetX = x - containerRect.left;
		const offsetY = y - containerRect.top;
		const duration = animationConfig.enterDuration;

		const ripple = document.createElement('div');
		ripple.classList.add('mat-ripple-element');

		ripple.style.left = `${offsetX - radius}px`;
		ripple.style.top = `${offsetY - radius}px`;
		ripple.style.height = `${radius * 2}px`;
		ripple.style.width = `${radius * 2}px`;

		// If the color is not set, the default CSS color will be used.
		ripple.style.background = config.color || null;
		ripple.style.transitionDuration = `${duration}ms`;

		this._pathElement.appendChild(ripple);

		/**
		 * By default the browser does not recalculate the styles of dynamically created
		 * ripple elements. This is critical because then the `scale` would not animate properly.
		 */
		enforceStyleRecalculation(ripple);

		ripple.style.transform = ' translate3d(0,0,0) scale(1)';

		// Exposed reference to the ripple that will be returned.
		const rippleRef = new RippleRef(this, ripple, config);

		rippleRef.state = RippleState.FADING_IN;

		// Add the ripple reference to the list of all active ripples.
		this._activeRipples.add(rippleRef);

		if (!config.persistent) {
			this._mostRecentTransientRipple = rippleRef;
		}

		/**
		 * Wait for the ripple element to be completely faded in.
		 * Once it's faded in, the ripple can be hidden immediately if the mouse is released.
		 */
		setTimeout(() => {
			const isMostRecentTransientRipple =
				rippleRef === this._mostRecentTransientRipple;

			rippleRef.state = RippleState.VISIBLE;

			/**
			 * When the timer runs out while the user has kept their pointer down, we want to
			 * keep only the persistent ripples and the latest transient ripple. We do this,
			 * because we don't want stacked transient ripples to appear after their enter
			 * animation has finished.
			 */
			if (
				!config.persistent &&
				(!isMostRecentTransientRipple || !this._isPointerDown)
			) {
				rippleRef.fadeOut();
			}
		},         duration);

		return rippleRef;
	}
	/** Fades out a ripple reference. */
	fadeOutRipple(rippleRef: RippleRef): void {
		const wasActive = this._activeRipples.delete(rippleRef);

		if (rippleRef === this._mostRecentTransientRipple) {
			this._mostRecentTransientRipple = null;
		}

		// Clear out the cached bounding rect if we have no more ripples.
		if (!this._activeRipples.size) {
			this._containerRect = null;
		}

		// For ripples that are not active anymore, don't re-run the fade-out animation.
		if (!wasActive) return;

		const rippleEl = rippleRef.element;
		const animationConfig = {
			...defaultRippleAnimationConfig,
			...rippleRef.config.animation
		};

		rippleEl.style.transitionDuration = `${animationConfig.exitDuration}ms`;
		rippleEl.style.opacity = `0`;
		rippleRef.state = RippleState.FADING_OUT;

		// Once the ripple faded out, the ripple can be safely removed from the DOM.
		setTimeout(() => {
			rippleRef.state = RippleState.HIDDEN;
			rippleEl.parentNode!.removeChild(rippleEl);
		},         animationConfig.exitDuration);
	}

	/** Fades out all currently active ripples. */
	fadeOutAll(): void {
		this._activeRipples.forEach((ripple) => ripple.fadeOut());
	}

	/** Sets up the trigger event listeners */
	setupTriggerEvents(element: HTMLElement) {
		if (!element || element === this._triggerElement) {
			return;
		}

		// Remove all previously registered event listeners from the trigger element.
		this.removeTriggerEvents();

		this._triggerEvents.forEach((fn, type) => {
			element.addEventListener(type, fn, passiveEventOptions);
		});

		this._triggerElement = element;
	}

	/** Removes previously registered event listeners from the trigger element. */
	removeTriggerEvents(): void {
		if (this._triggerElement) {
			this._triggerEvents.forEach((fn, type) => {
				this._triggerElement!.removeEventListener(
					type,
					fn,
					passiveEventOptions
				);
			});
		}
	}

	/** Function being called whenever the trigger is being pressed using mouse. */
	private _onMousedown(event: MouseEvent): void {
		/**
		 * Screen readers will fire fake mouse events for space/enter. Skip launching a
		 * ripple in this case for consistency with the non-screen-reader experience.
		 */
		const isFakeMousedown = isFakeMousedownFromScreenReader(event);
		const isSyntheticEvent =
			this._lastTouchStartEvent &&
			Date.now() < this._lastTouchStartEvent + ignoreMouseEventsTimeout;

		if (
			!this._target.rippleDisabled &&
			!isFakeMousedown &&
			!isSyntheticEvent
		) {
			this._isPointerDown = true;
			this.fadeInRipple(
				event.clientX,
				event.clientY,
				this._target.rippleConfig
			);
		}
	}

	/** Function being called whenever the trigger is being pressed using touch. */
	private _onTouchStart(event: TouchEvent): void {
		if (!this._target.rippleDisabled) {
			/**
			 * Some browsers fire mouse events after a `touchstart` event. Those synthetic mouse
			 * events will launch a second ripple if we don't ignore mouse events for a specific
			 * time after a touchstart event.
			 */
			this._lastTouchStartEvent = Date.now();
			this._isPointerDown = true;

			/**
			 * Use `changedTouches` so we skip any touches where the user put
			 * their finger down, but used another finger to tap the element again.
			 */
			const touches: TouchList | any = event.changedTouches;

			for (const touch of touches) {
				this.fadeInRipple(
					touch.clientX,
					touch.clientY,
					this._target.rippleConfig
				);
			}
		}
	}

	/** Function being called whenever the trigger is being released. */
	private _onPointerUp(): void {
		if (!this._isPointerDown) return;

		this._isPointerDown = false;

		// Fade-out all ripples that are visible and not persistent.
		this._activeRipples.forEach((ripple) => {
			/**
			 * By default, only ripples that are completely visible will fade out on pointer release.
			 * If the `terminateOnPointerUp` option is set, ripples that still fade in will also fade out.
			 */
			const isVisible =
				ripple.state === RippleState.VISIBLE ||
				(ripple.config.terminateOnPointerUp &&
					ripple.state === RippleState.FADING_IN);

			if (!ripple.config.persistent && isVisible) {
				ripple.fadeOut();
			}
		});
	}
}
