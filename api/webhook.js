export default function handler(req, res) {
  if (req.method === 'GET') {
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    if (mode === 'subscribe' && token === process.env.WHATSAPP_VERIFY_TOKEN) {
      res.status(200).send(challenge);
    } else {
      res.status(403).end();
    }
  }

  if (req.method === 'POST') {
    console.log('Incoming:', JSON.stringify(req.body));
    res.status(200).json({ status: 'ok' });
  }
}
