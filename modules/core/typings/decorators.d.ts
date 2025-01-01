declare global {
	function Injectable(): (target, ctx: ClassDecoratorContext) => void;
	function Controller(route?: string): (target, ctx: ClassDecoratorContext) => void;
	function Get(route?: string): (target, ctx: ClassMethodDecoratorContext) => void;
	function Head(route?: string): (target, ctx: ClassMethodDecoratorContext) => void;
	function Post(route?: string): (target, ctx: ClassMethodDecoratorContext) => void;
	function Put(route?: string): (target, ctx: ClassMethodDecoratorContext) => void;
	function Delete(route?: string): (target, ctx: ClassMethodDecoratorContext) => void;
	function Connect(route?: string): (target, ctx: ClassMethodDecoratorContext) => void;
	function Trace(route?: string): (target, ctx: ClassMethodDecoratorContext) => void;
	function Patch(route?: string): (target, ctx: ClassMethodDecoratorContext) => void;
}

export {}