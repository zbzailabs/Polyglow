export function GET() {
	return new Response("OK\n", {
		headers: {
			"content-type": "text/plain; charset=utf-8",
			"cache-control": "no-store",
		},
	});
}
