import { RippleRef } from './ripple-ref';
import { RippleRenderer } from './ripple-renderer';

import {
	RippleAnimationConfig,
	RippleGlobalOptions,
	RippleTarget
} from './Interfaces';

import { RippleConfig } from './Types';

import { getStyle } from './util';

export class Ripple extends HTMLElement implements RippleTarget {
	/**
	 * Return an array containing the names of the attributes to be observed.
	 */
	static get observedAttributes(): string[] {
		return ['color', 'unbounded', 'centered', 'radius', 'disabled'];
	}
	/** Set custom color for all ripples. */
	set color(val: string) {
		if (val) {
			this._color = val;
		} else {
			this._color = `rgba(0,0,0,.2)`;
		}
	}
	/** Get custom color for all ripples. */
	get color(): string {
		return this._color;
	}
	/** Set whether the ripples should be visible outside the component's bounds. */
	set unbounded(val: boolean) {
		this._unbounded = val;
		if (val) {
			if (this.hasAttribute('unbounded')) return;
			this.setAttribute('unbounded', '');
		} else {
			this.removeAttribute('unbounded');
		}
	}
	/** Get whether the ripples should be visible outside the component's bounds. */
	get unbounded(): boolean {
		return this._unbounded;
	}
	/**
	 * Set whether the ripple always originates from the center of the host element's bounds, rather
	 * than originating from the location of the click event.
	 */
	set centered(val: boolean) {
		this._centered = val;
	}
	/**
	 * Get whether the ripple always originates from the center of the host element's bounds, rather
	 * than originating from the location of the click event.
	 */
	get centered(): boolean {
		return this._centered;
	}

	/**
	 * If set, the radius in pixels of foreground ripples when fully expanded. If unset, the radius
	 * will be the distance from the center of the ripple to the furthest corner of the host element's
	 * bounding rectangle.
	 */
	set radius(val: number) {
		this._radius = val;
	}

	// If set, this will return the radius in pixels of foreground ripples when fully expanded.
	get radius(): number {
		return this._radius;
	}
	/**
	 * Configuration for the ripple animation. Allows modifying the enter and exit animation
	 * duration of the ripples.
	 */
	set animation(val: RippleAnimationConfig) {
		this._animation = val;
	}
	/** Returns the enter and exit animation duration of the ripples. */
	get animation(): RippleAnimationConfig {
		return this._animation;
	}
	/** Set whether click events will not trigger the ripple. */
	set disabled(value: boolean) {
		this._disabled = value;
		this._setupTriggerEventsIfEnabled();
	}
	/** Get whether click events will not trigger the ripple. */
	get disabled(): boolean {
		return this._disabled;
	}
	/** The element that triggers the ripple when click events are received. */
	set trigger(trigger: HTMLElement) {
		this._trigger = trigger;
		this._setupTriggerEventsIfEnabled();
	}
	get trigger(): HTMLElement {
		return this._trigger || this._elementRef;
	}

	/**
	 * Ripple configuration values.
	 * Implemented as part of RippleTarget
	 */
	get rippleConfig(): RippleConfig {
		return {
			centered: this.centered,
			radius: this.radius,
			color: this.color,
			animation: {
				...this._globalOptions.animation,
				...this.animation
			},
			terminateOnPointerUp: this._globalOptions.terminateOnPointerUp
		};
	}

	/**
	 * Whether ripples on pointer-down are disabled or not.
	 * Implemented as part of RippleTarget
	 */
	get rippleDisabled(): boolean {
		return this.disabled || !!this._globalOptions.disabled;
	}

	constructor(globalOptions?: RippleGlobalOptions) {
		super();
		this._globalOptions = globalOptions || {};
	}

	private _color: string = `rgba(0,0,0,.2)`;

	private _unbounded: boolean = false;

	private _centered: boolean = false;

	private _radius: number = 0;

	private _animation!: RippleAnimationConfig;

	private _disabled: boolean = false;

	private _trigger!: HTMLElement;

	/** Renderer for the ripple DOM manipulations. */
	private _rippleRenderer!: RippleRenderer;

	/** Options that are set globally for all ripples. */
	private _globalOptions: RippleGlobalOptions;

	/** Whether ripple directive is initialized and the input bindings are set. */
	private _isInitialized: boolean = false;

	/** The element that triggers the ripple when click events are received. */
	private _elementRef!: HTMLElement;

	/** Callback to fire when an attribute changes. */
	attributeChangedCallback(name: string, oldValue: any, newValue: any) {
		switch (name) {
			case 'color':
				if (oldValue !== newValue) {
					this.color = newValue;
				}
				break;
			case 'unbounded':
				if (this.hasAttribute('unbounded')) {
					this.unbounded = true;
				} else {
					this.unbounded = false;
				}
				break;
			case 'centered':
				if (this.hasAttribute('centered')) {
					this.centered = true;
				} else {
					this.centered = false;
				}
				break;
			case 'radius':
				if (oldValue !== newValue) {
					this.radius = JSON.parse(newValue);
				}

				break;
			case 'disabled':
				if (this.hasAttribute('disabled')) {
					this.disabled = true;
				} else {
					this.disabled = false;
				}
				break;

			default:
				break;
		}
	}

	/** Function invoked each time the custom element is appended into a document-connected element */
	connectedCallback(): void {
		this._isInitialized = true;
		this._setup();
		this._setupTriggerEventsIfEnabled();
	}

	/** Function is invoked each time the custom element is disconnected from the document's DOM. */
	disconnectedCallback(): void {
		this._rippleRenderer.removeTriggerEvents();
	}

	/** Fades out all currently showing ripple elements. */
	fadeOutAll(): void {
		this._rippleRenderer.fadeOutAll();
	}

	/**
	 * Launches a manual ripple using the specified ripple configuration.
	 * @param config Configuration for the manual ripple.
	 */
	launch(config: RippleConfig): RippleRef;

	/**
	 * Launches a manual ripple at the specified coordinates within the element.
	 * @param x Coordinate within the element, along the X axis at which to fade-in the ripple.
	 * @param y Coordinate within the element, along the Y axis at which to fade-in the ripple.
	 * @param config Optional ripple configuration for the manual ripple.
	 */
	launch(x: number, y: number, config?: RippleConfig): RippleRef;

	/** Launches a manual ripple at the specified coordinated or just by the ripple config. */
	launch(
		configOrX: number | RippleConfig,
		y: number = 0,
		config?: RippleConfig
	): RippleRef {
		if (typeof configOrX === 'number') {
			return this._rippleRenderer.fadeInRipple(configOrX, y, {
				...this.rippleConfig,
				...config
			});
		} else {
			return this._rippleRenderer.fadeInRipple(0, 0, {
				...this.rippleConfig,
				...configOrX
			});
		}
	}

	/** Sets up the trigger event listeners if ripples are enabled. */
	private _setupTriggerEventsIfEnabled() {
		if (!this.disabled && this._isInitialized) {
			this._rippleRenderer.setupTriggerEvents(this.trigger);
		}
	}

	/**
	 * Function to creat the `template` for the Ripple and
	 * attaching the shadow DOM to the root
	 */
	private _setup() {
		const tmp = document.createElement('template');
		tmp.innerHTML = `
			<style>
                :host{
					position: absolute !important;
					border-radius: inherit;
                    top: 0;
                    left: 0;
                    bottom: 0;
					right: 0;
					overflow: hidden;
					pointer-events: none
                }

				.mat-ripple-element {
					position: absolute;
					border-radius: 50%;
					pointer-events: none;
					transition: opacity, transform 0ms cubic-bezier(0, 0, 0.2, 1);
					transform:  translate3d(0,0,0) scale(0);
					will-change: transform, opacity;
				}
				
				:host([unbounded]) {
					overflow: visible;
				}
				
            </style>
            <slot></slot>
        `;
		const shadowRoot = this.attachShadow({ mode: 'open' });
		shadowRoot.appendChild(tmp.content.cloneNode(true));

		this._elementRef = this.parentElement!;

		this._rippleRenderer = new RippleRenderer(
			this,
			this._elementRef,
			this.shadowRoot
		);

		/** Parent style */
		const parentElementPositionStyle: string = getStyle(
			this.parentElement!,
			'position'
		);
		if (parentElementPositionStyle === 'static') {
			this.parentElement!.style.position = 'relative';
		}
	}
}
