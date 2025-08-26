const fetch = require("node-fetch");

module.exports = async (req, res) => {
  try {
    const response = await fetch("https://saml-sso.improvlearning.com/gettoken");

    if (!response.ok) {
      return res.status(500).json({ error: "Failed to fetch token" });
    }

    const token = await response.text();

    return res.status(200).json({ token });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
