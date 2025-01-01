import { NodePath } from '@babel/traverse';
import * as T from '@babel/types';

export function getId(path: NodePath<T.Expression>) {
	if(path.isIdentifier()) return path.node.name;
}

export function getDecoratorName(path: NodePath<T.Decorator>) {
	const handle = (path: NodePath) => {
		if (path.isMemberExpression()) {
			return getId(path.get('object'));
		}
		else if (path.isIdentifier()) {
			return getId(path);
		}
		else {
			return undefined;
		}
	}
	
	if(path.get('expression').isCallExpression()) {
		return handle(path.get('expression'));
	}
	else {
		return handle(path);
	}
}