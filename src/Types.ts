import { RippleAnimationConfig } from './Interfaces';

/** Configuration for ripples that are launched on pointer down. */
export interface RippleConfig {
	color?: string;
	centered?: boolean;
	radius?: number;
	persistent?: boolean;
	animation?: RippleAnimationConfig;
	terminateOnPointerUp?: boolean;
}
