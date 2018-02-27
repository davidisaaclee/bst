import * as R from 'ramda';

export const messages = {
	leftChildOutOfOrder: parentNode => (
		`Left child is out of order: ${JSON.stringify(parentNode)}`
	),

	rightChildOutOfOrder: parentNode => (
		`Right child is out of order: ${JSON.stringify(parentNode)}`
	),
};


