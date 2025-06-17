export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // Upload handler
    if (request.method === "POST" && url.pathname === "/api/upload") {
      const formData = await request.formData();
      const video = formData.get("video");
      const thumb = formData.get("thumbnail");
      const caption = formData.get("caption");

      const id = crypto.randomUUID();
      await env.VIDEOS.put(`video-${id}`, await video.arrayBuffer());
      await env.VIDEOS.put(`thumb-${id}`, await thumb.arrayBuffer());

      const metadata = {
        id,
        caption,
        url: `/api/video/${id}`,
        thumbnail: `/api/thumb/${id}`
      };

      const videos = JSON.parse(await env.META.get("videos") || "[]");
      videos.push(metadata);
      await env.META.put("videos", JSON.stringify(videos));

      return new Response("Upload successful");
    }

    // Serve video
    if (url.pathname.startsWith("/api/video/")) {
      const id = url.pathname.split("/").pop();
      const video = await env.VIDEOS.get(`video-${id}`, { type: "stream" });
      return new Response(video, {
        headers: { "Content-Type": "video/mp4" }
      });
    }

    // Serve thumbnail
    if (url.pathname.startsWith("/api/thumb/")) {
      const id = url.pathname.split("/").pop();
      const thumb = await env.VIDEOS.get(`thumb-${id}`, { type: "stream" });
      return new Response(thumb, {
        headers: { "Content-Type": "image/jpeg" }
      });
    }

    // Get list of videos
    if (url.pathname === "/api/videos") {
      const videos = await env.META.get("videos");
      return new Response(videos || "[]", {
        headers: { "Content-Type": "application/json" }
      });
    }

    // Static assets (your frontend files)
    return env.ASSETS.fetch(request);
  }
};
