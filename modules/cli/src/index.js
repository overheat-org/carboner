import pkg from '../package.json' assert { type: "json" };
import { program } from 'commander';

program
	.name("carboner")
	.version(pkg.version);

program
	.command("dev")
	.description("Starts a dev mode")
	.action(() => {console.log('dev')})

program
	.command("start")
	.description("Starts a recently generated build")
	.action()

program.parse();