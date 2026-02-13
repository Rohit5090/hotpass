import { providers } from "near-api-js";

export default async function handler(req, res) {
  // 1. Only allow POST requests
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { transactionHash, accountId } = req.body;

  // 2. Validation: NEAR RPC needs both the hash and the sender's account ID
  if (!transactionHash || !accountId) {
    return res.status(400).json({ 
      error: "Both transactionHash and accountId are required." 
    });
  }

  try {
    const provider = new providers.JsonRpcProvider({
      url: "https://rpc.testnet.near.org"
    });

    // 3. Fetch transaction status
    // provider.txStatus(hash, accountId) is the standard for near-api-js
    const result = await provider.txStatus(transactionHash, accountId);

    // 4. Robust Success Check
    // SuccessValue can be an empty string "", so we check if the key exists
    if (result && result.status && typeof result.status.SuccessValue === 'string') {
      return res.status(200).json({ 
        success: true, 
        access: "granted" 
      });
    }

    return res.status(200).json({ 
      success: false, 
      message: "Transaction is either failed or still processing." 
    });

  } catch (error) {
    // Log the error for debugging
    console.error("NEAR Verification Error:", error);
    
    return res.status(500).json({ 
      error: "Verification failed", 
      details: error.message 
    });
  }
}