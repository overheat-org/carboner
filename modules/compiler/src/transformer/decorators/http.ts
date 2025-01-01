import * as T from '@babel/types';
import { NodePath } from '@babel/traverse';
import { CarbonerError, CarbonerSyntaxError, CarbonerTypeError, ErrorCodes } from '../../reporter';

const id = {
	server: T.identifier("__server__"),
	req: T.identifier("__req__"),
}

const methodsMap = {
	Get: "get",
}

export function HTTP(this: Transformer, path: NodePath<T.Decorator>) {
	const callExpr = path.findParent(p => p.isCallExpression()) as NodePath<T.CallExpression>;
	if(!callExpr) throw new CarbonerSyntaxError(ErrorCodes.ExpectedCallExpression);

	let route: string;
	{
		const stringArgument = (callExpr.get('arguments')[0] as NodePath<T.StringLiteral>);
		if(!stringArgument.isStringLiteral()) throw new CarbonerTypeError(ErrorCodes.ExpectedTypeInParam, "string", "0");
	
		route = stringArgument.node.value;
	}
	
	const methodDecl = path.findParent(p => p.isClassMethod()) as NodePath<T.ClassMethod>;
    if(!methodDecl) throw new CarbonerError(ErrorCodes.IncorrectUseDecorator, "Class Methods");
    
    const classDecl = methodDecl.parentPath.parentPath as NodePath<T.ClassDeclaration>;

	classDecl.traverse({
        ClassMethod(path) {
            if(path.node.kind != 'constructor') return;

			const methodNode = methodDecl.node;

            const eventListener = T.expressionStatement(
				generateRouteListener(
					(methodNode.key as T.Identifier).name,
					route, 
					(path.node.key as T.Identifier).name, 
					methodDecl.node.async
				)
			);
            
            path.get('body').pushContainer('body', eventListener);
        }
    });

	path.remove();
}

function generateRouteListener(member: string, route: string, method: string, async: boolean) {
	const methodAccess = T.memberExpression(
		T.memberExpression(
			T.thisExpression(),
			id.server
		),
		T.identifier(methodsMap[method])
	);

	return T.callExpression(methodAccess, [
		T.stringLiteral(route),
		T.memberExpression(T.thisExpression(), T.identifier(member))
	]);
}