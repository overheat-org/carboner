<h1 align="center">Carboner</h1>
A server-side framework based in Nest, but with meta programming included, to get more development facility and less overhead.
- Comptime decorators: decorators are readed in compilation, reducing memory use with overheads. The code is transformed to a version without decorators, but with helpers for each decorator to handle it.
- Params injection: different of nest, you don't need to use `@Req` decorator to inject param. The carboner detect the data to be passed observing TypeScript type.
- DTS generation: Auto generation of server route types, to use on client. 