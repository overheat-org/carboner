export class Module {
	path: string
	code: string
}

export class Controller {
	endpoint?: string;
	dependencies: Injectable[];
	module: Module;
}

export class Injectable {
	id: string
	module: Module
}

export class Graph {
	modules = new Map<string, Module>;
	injections = new Array<Injectable>;
	controllers = new Array<Controller>;

	addModule() {

	}

	getModule() {
		
	}

	addInjectable() {

	}

	addController(controller: Controller) {
		this.controllers.push(controller);
	}

	build() {}
}

export default Graph;