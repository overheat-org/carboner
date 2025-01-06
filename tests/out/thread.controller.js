import Fastify from 'fastify'
const fastify = Fastify({})

class ThreadController {
	createThread() {

	}

	deleteThread() {}

	constructor() {
		this.__server__.post("/", this.createThread);
		this.__server__.delete("/:id", this.deleteThread);
	}
}

ThreadController.prototype.__server__ = fastify;