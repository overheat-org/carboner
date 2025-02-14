import Graph from "./graph";
import Parser from "./parser";
import Transformer from "./transformer";

const graph = new Graph();
const parser = new Parser(graph);
const transformer = new Transformer();

const nodes = parser.parse();
transformer.transform(nodes);