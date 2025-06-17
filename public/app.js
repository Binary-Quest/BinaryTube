window.addEventListener("DOMContentLoaded", async () => {
  const res = await fetch('/api/videos');
  const videos = await res.json();
  const container = document.getElementById("video-list");

  videos.forEach(video => {
    const card = document.createElement("div");
    card.className = "video-card";
    card.innerHTML = `
      <img src="${video.thumbnail}" alt="Thumbnail" />
      <div class="caption">${video.caption}</div>
      <video src="${video.url}" controls></video>
    `;
    container.appendChild(card);
  });
});
