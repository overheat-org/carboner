import * as T from '@babel/types';
import traverse, { NodePath } from '@babel/traverse';
import { getDecoratorName } from '../utils';
import decorators from './decorators';
import { DirtyNode } from '../parser';
import { CarbonerError, CarbonerSyntaxError, ErrorCodes } from '../reporter';

interface ServerInjection {
	path: string
	id: string
}

class Transformer {
	currentFilePath: string;

	transform(nodes: DirtyNode[]) {
		for (const node of nodes) {
			const methodByNode = {
				Controller: this.transformController
			}

			methodByNode[node.type]?.(node.path, node.module);
		}
	}

	transformController(path: NodePath<T.Decorator>) {
		const callExpr = path.findParent(p => p.isCallExpression()) as NodePath<T.CallExpression>;
		if (!callExpr) throw new CarbonerSyntaxError(ErrorCodes.ExpectedCallExpression);

		let route: string;
		{
			const stringArgument = (callExpr.get('arguments')[0] as NodePath<T.StringLiteral>);
			if (!stringArgument.isStringLiteral()) throw new Error('Expected string on first param of decorator');

			route = stringArgument.node.value;
		}

		const classDecl = path.findParent(p => p.isClassDeclaration()) as NodePath<T.ClassDeclaration>;
		if (!classDecl) throw new CarbonerError(ErrorCodes.IncorrectUseDecorator, "Classes");

		classDecl.traverse({
			ClassMethod: (path) => {
				if (path.node.kind != 'constructor') return;


			}
		})

		const className = classDecl.get('id').node!.name;
		let parent = classDecl.parentPath;
		let exported = false;

		switch (true) {
			case parent.isExportNamedDeclaration():
				parent = parent.parentPath;
				exported = true;

			case parent.isProgram():
				const program = parent as NodePath<T.Program>;

				if (!exported) {
					if (
						!program.get('body').some(node =>
							node.isExportNamedDeclaration() &&
							node.get('specifiers').some(specifier =>
								specifier.isExportSpecifier() &&
								specifier.get('local').node.name === className
							)
						)
					) {
						classDecl.replaceWith(T.exportNamedDeclaration(classDecl.node));
					};
				}

				break;

			default: throw new CarbonerSyntaxError(ErrorCodes.ShouldBeInGlobal, 'Controllers');
		}
	}
}

export default Transformer;