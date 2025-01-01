import { NodePath } from '@babel/traverse';
import * as T from '@babel/types';
import { CarbonerError, CarbonerSyntaxError, ErrorCodes } from '../../reporter';
import Transformer from '../';

export function Controller(this: Transformer, path: NodePath<T.Decorator>) {
	const callExpr = path.findParent(p => p.isCallExpression()) as NodePath<T.CallExpression>;
	if(!callExpr) throw new CarbonerSyntaxError(ErrorCodes.ExpectedCallExpression);

	let route: string;
	{
		const stringArgument = (callExpr.get('arguments')[0] as NodePath<T.StringLiteral>);
		if(!stringArgument.isStringLiteral()) throw new Error('Expected string on first param of decorator');
	
		route = stringArgument.node.value;
	}

	const classDecl = path.findParent(p => p.isClassDeclaration()) as NodePath<T.ClassDeclaration>;
	if(!classDecl) throw new CarbonerError(ErrorCodes.IncorrectUseDecorator, "Classes");

	classDecl.traverse({
		ClassMethod: (path) => {
			if(path.node.kind != 'constructor') return;

			
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

            if(!exported) {
                if(
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
	
	this.queueServerInjection();
}