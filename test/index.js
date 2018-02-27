import test from 'ava';
import * as R from 'ramda';
import { instantiate as instantiateBST } from '../src';

// TestBST ::= BST<{ id: string, value: number }>
const TestBST = instantiateBST({
	shouldBeLeftChild: (parent, child) => child.value < parent.value
});
const TestBSTIndexer = R.prop('id');

const fixtures = (() => {
	/*
	 * a {
	 *	b {
	 *		c {
	 *			_
	 *			e
	 *		}
	 *		f
	 *	}
	 *	d {
	 *		g
	 *		_
	 *	}
	 * }
	 */
	const normalTreeItems = [
		{ id: 'a', value: 5 },
		{ id: 'b', value: 3 },
		{ id: 'c', value: 1 },
		{ id: 'd', value: 8 },
		{ id: 'e', value: 2 },
		{ id: 'f', value: 4 },
		{ id: 'g', value: 5 }
	];
	const normalTree =
		R.pipe(...R.map(TestBST.insert, normalTreeItems))(TestBST.empty);

	const singleNodeTreeItems = [
		{ id: 'a', value: 5 }
	];
	const singleNodeTree =
		TestBST.insert(singleNodeTreeItems[0], TestBST.empty);
	
	return {
		normal: { tree: normalTree, items: normalTreeItems },
		singleNode: { tree: singleNodeTree, items: singleNodeTreeItems }
	};
})();

test('constructing BST', t => {
	t.deepEqual(
		TestBST.toObject(
			TestBSTIndexer,
			TestBST.empty),
		{});

	t.deepEqual(
		TestBST.toObject(
			TestBSTIndexer,
			fixtures.singleNode.tree),
		R.pipe(
			R.indexBy(R.prop('id')),
			R.mergeAll
		)(fixtures.singleNode.items));

	const itemForID = id => fixtures.normal.items.find(item => item.id === id);
	t.deepEqual(
		fixtures.normal.tree,
		TestBST.node(
			itemForID('a'),
			TestBST.node(
				itemForID('b'),
				TestBST.node(
					itemForID('c'),
					null,
					TestBST.node(itemForID('e'))),
				TestBST.node(itemForID('f'))),
			TestBST.node(
				itemForID('d'),
				TestBST.node(itemForID('g')),
				null)));

	t.deepEqual(
		TestBST.toObject(
			TestBSTIndexer,
			fixtures.normal.tree),
		R.pipe(
			R.indexBy(R.prop('id')),
			R.mergeAll
		)(fixtures.normal.items));
});

test('removing only node in tree', t => {
	t.deepEqual(
		R.pipe(
			TestBST.remove(({ id }) => id === fixtures.singleNode.items[0].id),
			TestBST.validate,
			TestBST.toObject(TestBSTIndexer)
		)(fixtures.singleNode.tree),
		{});
});

test('removing left leaf', t => {
	t.deepEqual(
		R.pipe(
			TestBST.remove(({ id }) => id === 'g'),
			TestBST.validate,
			TestBST.toObject(TestBSTIndexer),
		)(fixtures.normal.tree),
		R.pipe(
			TestBST.toObject(TestBSTIndexer),
			R.dissoc('g')
		)(fixtures.normal.tree));
});

test('removing right leaf', t => {
	t.deepEqual(
		R.pipe(
			TestBST.remove(({ id }) => id === 'e'),
			TestBST.validate,
			TestBST.toObject(TestBSTIndexer)
		)(fixtures.normal.tree),
		R.pipe(
			TestBST.toObject(TestBSTIndexer),
			R.dissoc('e')
		)(fixtures.normal.tree));
});

test('removing mid node with two children', t => {
	t.deepEqual(
		R.pipe(
			TestBST.remove(({ id }) => id === 'b'),
			TestBST.validate,
			TestBST.toObject(TestBSTIndexer)
		)(fixtures.normal.tree),
		R.pipe(
			TestBST.toObject(TestBSTIndexer),
			R.dissoc('b')
		)(fixtures.normal.tree));
});

test('removing mid node with only left child', t => {
	t.deepEqual(
		R.pipe(
			TestBST.remove(({ id }) => id === 'd'),
			TestBST.validate,
			TestBST.toObject(TestBSTIndexer)
		)(fixtures.normal.tree),
		R.pipe(
			TestBST.toObject(TestBSTIndexer),
			R.dissoc('d')
		)(fixtures.normal.tree));
});

test('removing mid node with only right child', t => {
	t.deepEqual(
		R.pipe(
			TestBST.remove(({ id }) => id === 'c'),
			TestBST.validate,
			TestBST.toObject(TestBSTIndexer)
		)(fixtures.normal.tree),
		R.pipe(
			TestBST.toObject(TestBSTIndexer),
			R.dissoc('c')
		)(fixtures.normal.tree));
});

test.todo('validate throws');
