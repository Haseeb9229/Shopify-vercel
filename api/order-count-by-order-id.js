import fetch from "node-fetch";

export default async function handler(req, res) {
  const { id } = req.query; // get order id from URL

  if (!id) {
    return res.status(400).json({ error: "id is required" });
  }

  const shop = "8b4e7e-9b.myshopify.com";
  const token = process.env.SHOPIFY_API_TOKEN;

  try {
    // Step 1: Get the order
    const orderResponse = await fetch(
      `https://${shop}/admin/api/2023-07/orders/${id}.json`,
      {
        headers: {
          "X-Shopify-Access-Token": token,
          "Content-Type": "application/json",
        },
      }
    );

    if (!orderResponse.ok) {
      return res.status(500).json({ error: "Failed to fetch order" });
    }

    const orderData = await orderResponse.json();
    const customerId = orderData?.order?.customer?.id;

    if (!customerId) {
      return res.status(404).json({ error: "Customer ID not found in order" });
    }

    // Step 2: Fetch all orders for this customer
    const ordersResponse = await fetch(
      `https://${shop}/admin/api/2023-07/orders.json?customer_id=${customerId}`,
      {
        headers: {
          "X-Shopify-Access-Token": token,
          "Content-Type": "application/json",
        },
      }
    );

    if (!ordersResponse.ok) {
      return res.status(500).json({ error: "Failed to fetch orders" });
    }

    const ordersData = await ordersResponse.json();
    const orders = ordersData?.orders ?? [];

    return res.status(200).json({ orderCount: orders.length });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
