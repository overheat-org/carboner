import { Controller } from './controller';
import Injectable from './injectable';
import { HTTP } from './http';

export default { 
	Injectable,
	Controller,
	Get: HTTP,
	Head: HTTP,
	Post: HTTP,
	Put: HTTP,
	Delete: HTTP,
	Connect: HTTP,
	Trace: HTTP,
	Patch: HTTP,
}