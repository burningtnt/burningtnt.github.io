"use strict";
const IMAGE_EXTENSIONS = new Set([
    ".png", ".jpg", "bmp"
]);
self.addEventListener("fetch", (event) => {
    if (!(event instanceof FetchEvent)) {
        return;
    }
    if (event.request.method === "GET") {
        let url = new URL(event.request.url);
        if (IMAGE_EXTENSIONS.has(url.pathname.substring(url.pathname.length - 4)) && url.searchParams.get("mode") === "image.pixel_array") {
            url.searchParams.delete("mode");
            event.respondWith(fetch(url.toString()).then(async (response) => {
                let bitmap = await createImageBitmap(await response.blob());
                let canvas = new OffscreenCanvas(bitmap.width, bitmap.height);
                let ctx = canvas.getContext("2d");
                if (ctx === null) {
                    return new Response(null, {
                        "status": 417,
                        "statusText": "Expectation Failed"
                    });
                }
                ctx.drawImage(bitmap, 0, 0);
                bitmap.close();
                let head = new Uint8ClampedArray(new ArrayBuffer(4));
                for (let i = 0; i < 4; i++) {
                    head[i] = (canvas.width >> (24 - 8 * i)) & 0xFF;
                }
                let data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
                return new Response(new Blob([head, data], {
                    "type": "image/webpygame-raw"
                }), {
                    "status": 200,
                    "statusText": "OK",
                    "headers": response.headers
                });
            }));
        }
    }
});
