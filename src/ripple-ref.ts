import { RippleRenderer } from './ripple-renderer';

import { RippleState } from './Enums';
import { RippleConfig } from './Types';

/**
 * Reference to a previously launched ripple element.
 */
export class RippleRef {
	/** Current state of the ripple. */
	state: RippleState = RippleState.HIDDEN;

	constructor(
		private _renderer: RippleRenderer,
		/** Reference to the ripple HTML element. */
		public element: HTMLElement,
		/** Ripple configuration used for the ripple. */
		public config: RippleConfig
	) {}

	/** Fades out the ripple element. */
	fadeOut(): void {
		this._renderer.fadeOutRipple(this);
	}
}
