import Fastify, { FastifyInstance } from 'fastify';

class Carboner {
	private server: FastifyInstance
	
	static create() {
		const server = Fastify();
		const instance = new this;

		instance.server = server;

		return instance;
	}

	listen(host?, port?) {
		return this.server.listen({ host, port });
	}

	private constructor() {}
}

export default Carboner;