import multiparty from "multiparty";
import fs from "fs";
import FormData from "form-data";

export const config = { api: { bodyParser: false } };

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const form = new multiparty.Form();

  form.parse(req, async (err, fields, files) => {
    if (err) return res.status(500).json({ error: err.message });

    const file = files.file?.[0];
    if (!file) return res.status(400).json({ error: "No file uploaded" });

    try {
      const fd = new FormData();
      fd.append("file", fs.createReadStream(file.path), file.originalFilename);
      fd.append("model", "whisper-1");

      const response = await fetch("https://api.openai.com/v1/audio/transcriptions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          ...fd.getHeaders(),
        },
        body: fd,
      });

      const data = await response.json();
      res.status(200).json(data);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });
}
