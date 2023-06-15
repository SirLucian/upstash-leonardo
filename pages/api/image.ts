import { NextApiRequest, NextApiResponse } from "next";
const QSTASH = `https://qstash.upstash.io/v1/publish/`;
const DALL_E = "https://api.openai.com/v1/images/generations";
const LEONARDO = "https://cloud.leonardo.ai/api/rest/v1/generations";
const VERCEL_URL = "https://dalle-2-jade.vercel.app";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { prompt } = req.query;
  try {
    const response = await fetch(`${QSTASH + LEONARDO}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.QSTASH_TOKEN}`,
        // Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "upstash-forward-Authorization": `Bearer ${process.env.LEO_API_KEY}`,
        "Content-Type": "application/json",
        "Upstash-Callback": `${VERCEL_URL}/api/callback`,
      },
      body: JSON.stringify({
        prompt: prompt,
        modelId: process.env.MODEL_ID,
        width: 512,
        height: 512,
        promptMagic: true,
        num_images: 1,
        public: false,
        sd_version: "v2",
      }),
    });
    const json = await response.json();
    return res.status(202).json({ id: json.messageId });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message, type: "Internal server error" });
  }
}
