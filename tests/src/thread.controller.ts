import { ThreadsService } from './thread.service';

@Controller("/threads")
export class ThreadController {
	constructor(private threadService: ThreadsService) {}
	
	@Post()
	createThread() {
		this.threadService.create()
	}

	@Delete("/:id")
	deleteThread(req: Request) {
		this.threadService.delete();
	}
}