import fs from "fs";
import path from "path";
import type { NextApiRequest, NextApiResponse } from "next";

interface ResponseData {
  data?: string[];
  error?: string;
}

export default function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  const folderPath = path.join(process.cwd(), "public", "placeholders");
  fs.readdir(folderPath, (err, files) => {
    if (err) {
      res.status(500).json({ error: "Failed to read placeholders" });
    }

    const data = files
      .filter((file) => path.extname(file).toLowerCase() === ".svg")
      .map((file) => `/placeholders/${file}`);

    res.status(200).json({ data });
  });
}
