// Inspired on discord.js errors

export enum ErrorCodes {
	ExpectedCallExpression,
	ExpectedTypeInParam,
	IncorrectUseDecorator,
	ShouldBeInGlobal,
}

const Messages = {
	[ErrorCodes.ExpectedCallExpression]: "Expected call expression",
	[ErrorCodes.ExpectedTypeInParam]: (x, y) => `Expected type '${x}' in param of index ${y}`,
	[ErrorCodes.IncorrectUseDecorator]: (x) => `This decorator only supports ${Array.isArray(x) ? x.join(',') : x}`,
	[ErrorCodes.ShouldBeInGlobal]: (x) => `${x} should be in global scope`,
}

export const CarbonerError = makeFrameworkError(Error);
export const CarbonerTypeError = makeFrameworkError(TypeError);
export const CarbonerSyntaxError = makeFrameworkError(SyntaxError);

function makeFrameworkError(Base) {
	return class DiscordjsError extends Base {
		constructor(code, ...args) {
			super(message(code, args));
			this.code = code;
			Error.captureStackTrace?.(this, DiscordjsError);
		}

		get name() {
			return `${super.name} [${this.code}]`;
		}
	};
}

function message(code, args) {
	if (!(code in ErrorCodes)) throw new Error('Error code must be a valid DiscordjsErrorCodes');
	const msg = Messages[code];
	if (!msg) throw new Error(`No message associated with error code: ${code}.`);
	if (typeof msg === 'function') return msg(...args);
	if (!args?.length) return msg;
	args.unshift(msg);
	return String(...args);
}