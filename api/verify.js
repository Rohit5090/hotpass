const { providers } = require("near-api-js");

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { transactionHash } = req.body;

  if (!transactionHash) {
    return res.status(400).json({ error: "Transaction hash required" });
  }

  try {
    const provider = new providers.JsonRpcProvider({
      url: "https://rpc.testnet.near.org"
    });

    const result = await provider.txStatus(
      transactionHash,
      "testnet"
    );

    if (result && result.status && result.status.SuccessValue !== undefined) {
      return res.json({ success: true, access: "granted" });
    } else {
      return res.json({ success: false });
    }

  } catch (error) {
    return res.status(500).json({ error: "Verification failed" });
  }
};