import * as T from '@babel/types';
import traverse, { NodePath } from '@babel/traverse';
import { getDecoratorName } from '../utils';
import decorators from './decorators';

class Transformer {
	transform(ast: T.File) {
		traverse(ast, {
			Decorator: this.transformDecorator
		})
	}

	transformDecorator(path: NodePath<T.Decorator>) {
		const name = getDecoratorName(path);
		if(!name) return;

		const fn: Function = decorators[name];
		fn?.bind(this, path);
	}

	queueServerInjection() {}
}

export default Transformer;