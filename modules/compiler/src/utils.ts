import { NodePath } from '@babel/traverse';
import * as T from '@babel/types';

export function getId(path: NodePath<T.Expression>) {
	if(path.isIdentifier()) return path.node.name;
}

export function getDecoratorName(path: NodePath<T.Decorator>) {
	const handle = (path: NodePath) => {
		let id!: string | undefined;
		if (path.isMemberExpression()) {
			id = getId(path.get('object'));
		}
		else if (path.isIdentifier()) {
			id = getId(path);
		}

		if(!id) throw new Error('Cannot get decorator name');

		return id;
	}
	
	if(path.get('expression').isCallExpression()) {
		return handle(path.get('expression'));
	}
	else {
		return handle(path);
	}
}

export function getDecoratorParams(path: NodePath<T.Decorator>) {
	const expr = path.get("expression");
	if(!expr.isCallExpression()) return;

	return expr.get('arguments');
}

export function getConstructor(path: NodePath<T.Class>) {
	return path.get('body').get('body').find(
		(method) => method.isClassMethod({ kind: 'constructor' })
	);
}

export function getDeclaration<R>(path: NodePath<T.Identifier>) {
	const binding = path.scope.getBinding(path.node.name);
	if (!binding) throw new Error(`Binding not found for identifier: ${path.node.name}`);
  
	return binding.path as NodePath<R>;
  }