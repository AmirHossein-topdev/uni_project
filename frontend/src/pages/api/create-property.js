// frontend\src\pages\api\create-property.js
import dbConnect from "../../../../backend/lib/dbConnect";
import Property from "../../../../backend/model/Property";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    await dbConnect();

    const {
      status,
      identity,
      location,
      legalStatus,
      ownership,
      boundaries,
      additionalInfo,
    } = req.body;

    const property = await Property.create({
      status,
      identity,
      location,
      legalStatus,
      ownership,
      boundaries,
      additionalInfo,
    });

    res.status(201).json({
      success: true,
      propertyId: property._id,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "خطا در ثبت ملک" });
  }
}
