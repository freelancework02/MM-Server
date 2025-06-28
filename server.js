const express = require("express");
const app = express();
const PORT = process.env.PORT || 5000;

// Escape HTML for safe rendering
function escapeHtml(str) {
  return str.replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;");
}

// Route with ID and readable title slug
app.get("/share/event/:id/:slug", async (req, res) => {
  const { id } = req.params;

  try {
    const response = await fetch(`https://api.minaramasjid.com/api/events/${id}`);
    if (!response.ok) throw new Error("Failed to fetch event data");

    const event = await response.json();
    const title = event.title || "Islamic Event";
    const safeTitle = escapeHtml(title);
    const encodedTitle = encodeURIComponent(title);
    const imageUrl = `https://api.minaramasjid.com/api/events/image/${id}`;
    const redirectUrl = `https://minaramasjid-eight.vercel.app/newsandevent/${id}/${encodedTitle}`;

    // Set response type
    res.setHeader("Content-Type", "text/html");

    res.send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="utf-8">
        <title>${safeTitle}</title>

        <!-- Open Graph -->
        <meta property="og:title" content="${safeTitle}">
        <meta property="og:description" content="For more Islamic Events, Articles, and Books visit Minaramasjid.com">
        <meta property="og:image" content="${imageUrl}">
        <meta property="og:url" content="${redirectUrl}">
        <meta property="og:type" content="website">

        <!-- Twitter -->
        <meta name="twitter:card" content="summary_large_image">
        <meta name="twitter:title" content="${safeTitle}">
        <meta name="twitter:description" content="For more Islamic Events, Articles, and Books visit Minaramasjid.com">
        <meta name="twitter:image" content="${imageUrl}">

        <!-- Safe redirect -->
        <noscript><meta http-equiv="refresh" content="3;url=${redirectUrl}"></noscript>
      </head>
      <body>
        <p>Redirecting…</p>
        <script>setTimeout(() => window.location.href='${redirectUrl}', 3000)</script>
      </body>
      </html>
    `);
  } catch (error) {
    console.error("❌ Error loading event:", error);
    res.status(500).send("Error loading event");
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
});
