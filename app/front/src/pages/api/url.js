export default function (req, res) {
  const url = process.env.NEXT_PUBLIC_HS_REST_API_URL;

  if (!url || url === '') {
    res.status(200).json({ url: 'http://localhost:8080' });
    return;
  }
  res.status(200).json({ url: url });
}
