import { Webhook } from "svix";
import User from "../models/User.js";

export const clerkWebhooks = async (req, res) => {
  try {
    console.log("🔥 Clerk webhook hit hua");

    const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

    // ✅ VERIFY USING RAW BODY (BUFFER)
    const payload = req.body;

    const headers = {
      "svix-id": req.headers["svix-id"],
      "svix-timestamp": req.headers["svix-timestamp"],
      "svix-signature": req.headers["svix-signature"],
    };

    const evt = whook.verify(payload, headers);

    const { data, type } = evt;

    if (!data) {
      return res.status(400).json({ success: false });
    }

    switch (type) {
      case "user.created":
        await User.create({
          clerkId: data.id,
          email: data.email_addresses[0].email_address,
          name: `${data.first_name || ""} ${data.last_name || ""}`,
          image: data.image_url,
          resume: "",
        });
        break;

      case "user.updated":
        await User.findOneAndUpdate(
          { clerkId: data.id },
          {
            email: data.email_addresses[0].email_address,
            name: `${data.first_name || ""} ${data.last_name || ""}`,
            image: data.image_url,
          }
        );
        break;

      case "user.deleted":
        await User.findOneAndDelete({ clerkId: data.id });
        break;
    }

    res.status(200).json({ success: true });

  } catch (err) {
    console.error("Webhook Error:", err.message);
    res.status(400).json({ success: false });
  }
};
