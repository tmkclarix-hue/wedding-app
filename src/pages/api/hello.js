export default function handler(req, res) {
  // සරලවම API එක වැඩ කරනවාද කියලා බලන්න status එකක් යවමු
  res.status(200).json({ 
    status: "Online",
    message: "Wedding Directory API is active",
    timestamp: new Date().toISOString()
  });
}