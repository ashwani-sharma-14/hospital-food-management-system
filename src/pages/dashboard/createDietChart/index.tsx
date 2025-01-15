"use client";
import React, { useState } from "react";
import axios from "axios";

interface CreateDietChartProps {
  patientId: string;
  patientName: string;
  onSuccess: () => void;
}

const CreateDietChart: React.FC<CreateDietChartProps> = ({ patientId, patientName, onSuccess }) => {
  const [morningMeal, setMorningMeal] = useState<string>("");
  const [eveningMeal, setEveningMeal] = useState<string>("");
  const [nightMeal, setNightMeal] = useState<string>("");
  const [instructions, setInstructions] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/create-diet-chart", {
        patientId,
        morningMeal,
        eveningMeal,
        nightMeal,
        instructions,
      });
      alert(response.data.message);
      onSuccess(); // Refresh parent data
    } catch (error) {
      console.error("Error creating diet chart:", error);
      alert("Failed to create diet chart.");
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Create Diet Chart for {patientName}</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Morning Meal</label>
          <input
            type="text"
            value={morningMeal}
            onChange={(e) => setMorningMeal(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Evening Meal</label>
          <input
            type="text"
            value={eveningMeal}
            onChange={(e) => setEveningMeal(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Night Meal</label>
          <input
            type="text"
            value={nightMeal}
            onChange={(e) => setNightMeal(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Instructions</label>
          <textarea
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg"
            placeholder="Enter special instructions"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default CreateDietChart;
