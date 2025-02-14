import * as T from '@babel/types';
import babel from '@babel/parser';
import traverse, { NodePath } from '@babel/traverse';
import { getConstructor, getDeclaration, getDecoratorName, getDecoratorParams } from './utils';
import { Graph, Injectable, Module } from './graph';

/**
 * This node requires transformation
 */
export interface DirtyNode {
	module: Module,
	type: string,
	path: NodePath
}

class Parser {
	constructor(private graph: Graph) {}

	private dirtyNodes = new Array<DirtyNode>;
	
	queueTransformation(node: DirtyNode) {
		this.dirtyNodes.push(node);
	}
	
	parseInjectable(path: NodePath<T.Decorator>, module: Module) {
		this.graph.addInjectable(module);

		this.queueTransformation({ path, module, type: "Injection" });
	}

	parseController(path: NodePath<T.Decorator>, module: Module) {
		let endpoint: string | undefined;
		{
 			const params = getDecoratorParams(path);		
			const str = params?.[0];

			if(str?.isStringLiteral()) {
				endpoint = str.node.value;
			}

			endpoint = undefined;
		}

		let dependencies = new Array<Injectable>;
		{
			const parentClass = path.parentPath;	

			if(parentClass.isClass()) {
				const constructor = getConstructor(parentClass);
				
				for(const param of constructor?.get('params') ?? []) {
					if(!param.isTSParameterProperty()) continue;

					let id: NodePath<T.Identifier>;
					{
						const parameter = param.get('parameter');
						if(parameter.isAssignmentPattern()) {
							id = parameter.get('left') as NodePath<T.Identifier>;
						}
						else {
							id = parameter as NodePath<T.Identifier>;
						}
					}

					const importDecl = getDeclaration<T.ImportDeclaration>(id);
					const source = importDecl.get('source').node.value;

					const module = this.graph.getModule(source) 
						?? this.graph.addModule(source);

					dependencies.push({
						id: id.node.name,
						module,
					})
				}
			}
		}

		this.graph.addController({ 
			module,
			endpoint,
			dependencies
		});

		this.queueTransformation({ path, module, type: "Controller" });
	}

	parseDecorator(path: NodePath<T.Decorator>, module: Module) {
		const name = getDecoratorName(path);

		const methodByDecorator = {
			Controller: this.parseController,
			Injectable: this.parseInjectable,
		}

		methodByDecorator[name]?.(path, module);
	}

	parse() {
		for(const module of this.graph.modules.values()) {
			const file = babel.parse(module.code);

			traverse(file, {
				Decorator: path => this.parseDecorator(path, module),
			})
		}

		return this.dirtyNodes;
	}
}

export default Parser;