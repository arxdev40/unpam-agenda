/**
 * Lightweight, zero-overhead Control Flow Utility Components for Preact
 * Inspired by Solid.js & Preact Signals declarative flow
 */

/**
 * Conditional rendering component
 * @template T
 * @param {{ when: T | boolean | import("@preact/signals").Signal<T | boolean>, fallback?: import("preact").ComponentChildren, children: import("preact").ComponentChildren | ((item: T) => import("preact").ComponentChildren) }} props
 */
export function Show({ when, fallback = null, children }) {
	const condition =
		when && typeof when === "object" && "value" in when ? when.value : when;

	if (!condition) {
		return fallback;
	}

	if (typeof children === "function") {
		return children(condition);
	}

	return children;
}

/**
 * Loop / Iteration rendering component
 * @template T
 * @param {{ each: T[] | import("@preact/signals").Signal<T[]>, fallback?: import("preact").ComponentChildren, children: (item: T, index: number) => import("preact").ComponentChildren }} props
 */
export function For({ each, fallback = null, children }) {
	const list =
		each && typeof each === "object" && "value" in each ? each.value : each;

	if (!list || !Array.isArray(list) || list.length === 0) {
		return fallback;
	}

	return list.map((item, index) => children(item, index));
}

/**
 * Switch & Match multi-condition component
 */
export function Switch({ fallback = null, children }) {
	const matchChildren = Array.isArray(children) ? children : [children];

	for (const child of matchChildren) {
		if (child && child.props) {
			const when = child.props.when;
			const isMatch =
				when && typeof when === "object" && "value" in when
					? when.value
					: when;
			if (isMatch) {
				const inner = child.props.children;
				return typeof inner === "function" ? inner(isMatch) : inner;
			}
		}
	}

	return fallback;
}

export function Match({ when, children }) {
	const condition =
		when && typeof when === "object" && "value" in when ? when.value : when;
	if (!condition) return null;
	return typeof children === "function" ? children(condition) : children;
}
