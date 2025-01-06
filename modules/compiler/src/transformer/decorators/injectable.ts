import * as T from '@babel/types';
import { NodePath } from "@babel/traverse";
import Transformer from "..";

export function Injectable(this: Transformer, path: NodePath<T.Decorator>) {
	throw new Error("Not implemented")
}

export default Injectable;