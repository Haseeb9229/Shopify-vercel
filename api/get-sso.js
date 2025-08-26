const fetch = require("node-fetch");

module.exports = async (req, res) => {
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization"
    );
    return res.status(200).end();
  }

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  try {
    const response = await fetch(
      "https://saml-sso.improvlearning.com/gettoken"
    );

    if (!response.ok) {
      return res.status(500).json({ error: "Failed to fetch token" });
    }

    const token = await response.text();

    return res.status(200).json({ token });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
