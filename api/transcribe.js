import formidable from "formidable";

export const config = { api: { bodyParser: false } };

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).send("Method not allowed");

  const form = formidable({ multiples: false });
  form.parse(req, (err, fields, files) => {
    if (err) return res.status(500).json({ error: err.message });
    console.log("Files received:", files);
    res.status(200).json({ message: "File received", files });
  });
}
