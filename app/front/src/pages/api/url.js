export default function (req, res) {
  res.status(200).json({ url: process.env.NEXT_PUBLIC_HS_REST_API_URL });
}