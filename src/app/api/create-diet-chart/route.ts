import { NextApiRequest, NextApiResponse } from "next";
import { dbConnection } from "@/lib/dbConnection";
import DietChartModel from "@/model/DietChat";
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await dbConnection();

  if (req.method === "POST") {
    const { patientId, morningMeal, eveningMeal, nightMeal, instructions } =
      req.body;

    try {
      const newDietChart = new DietChartModel({
        patientId,
        morningMeal,
        eveningMeal,
        nightMeal,
        instructions,
      });

      await newDietChart.save();
      return res.status(200).json({ message: "Diet Chart Created Successfully" });
    } catch (error) {
      return res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    return res.status(405).json({ message: "Method Not Allowed" });
  }
}
