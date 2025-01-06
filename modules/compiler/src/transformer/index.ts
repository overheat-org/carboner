import * as T from '@babel/types';
import traverse, { NodePath } from '@babel/traverse';
import { getDecoratorName } from '../utils';
import decorators from './decorators';

interface ServerInjection {
	path: string
	id: string
}

class Transformer {
	currentFilePath: string;
	
	transform(ast: T.File, options: { path?: string } = {}) {
		if(options.path) this.currentFilePath = options.path;

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

	private injections = new Array<ServerInjection>;
	
	queueServerInjection() {}
}

export default Transformer;