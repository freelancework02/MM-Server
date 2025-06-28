const express = require("express");

const app = express();
const PORT = process.env.PORT || 5000;

// Use native fetch (Node.js v18+)
app.get("/share/event/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const response = await fetch(`https://api.minaramasjid.com/api/events/${id}`);
    if (!response.ok) {
      throw new Error("Failed to fetch event data");
    }

    const event = await response.json();
    const title = event.title || "Islamic Event";
    const encodedTitle = encodeURIComponent(title);
    const imageUrl = `https://api.minaramasjid.com/api/events/image/${id}`;
    const redirectUrl = `https://minaramasjid-eight.vercel.app/newsandevent/${id}/${encodedTitle}`;

    const html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <title>${title}</title>
        <meta property="og:title" content="${title}" />
        <meta property="og:description" content="For more Islamic Events, Articles, and Books visit Minaramasjid.com" />
        <meta property="og:image" content="${imageUrl}" />
        <meta property="og:url" content="${redirectUrl}" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="${title}" />
        <meta name="twitter:description" content="For more Islamic Events, Articles, and Books visit Minaramasjid.com" />
        <meta name="twitter:image" content="${imageUrl}" />
      </head>
      <body>
        <p>Redirecting to the event page...</p>
        <script>
          setTimeout(() => {
            window.location.href = "${redirectUrl}";
          }, 2000);
        </script>
      </body>
      </html>
    `;

    console.log("🔎 Event Fetched:", event);
    res.send(html);
  } catch (error) {
    console.error("❌ Error loading event:", error);
    res.status(500).send("Error loading event");
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
});
