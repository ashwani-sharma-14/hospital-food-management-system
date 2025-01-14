'use client';
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Delivery {
  _id: string;
  patientId: string;
  mealType: string;
  instructions: string;
}

interface User {
  token: string;
}

interface DeliveryDashboardProps {
  user: User | null;
}

const DeliveryDashboard: React.FC<DeliveryDashboardProps> = ({ user }) => {
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return; // Ensure user is defined

    const fetchDeliveries = async () => {
      try {
        const response = await axios.get("/api/delivery-tasks", {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setDeliveries(response.data.deliveries);
      } catch (err) {
        setError("Failed to load delivery tasks");
      } finally {
        setLoading(false);
      }
    };
    fetchDeliveries();
  }, [user]);

  const markDelivered = async (deliveryId: string) => {
    if (!user) return;
  
    try {
      await axios.patch(
        `/api/delivery-tasks?deliveryId=${deliveryId}`, // Correct the URL
        { status: "Delivered" },
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );
      alert("Delivery marked as completed");
      // Optionally, refresh deliveries data
    
    } catch (error) {
      console.error("Error marking delivery", error);
      alert("Failed to mark delivery as completed.");
    }
  };
  

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1 className="text-xl font-bold">Delivery Dashboard</h1>
      {deliveries.map((delivery) => (
        <Card key={delivery._id} className="w-[350px]">
          <CardHeader>
            <CardTitle>Delivery for Patient: {delivery.patientId}</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Meal Type: {delivery.mealType}</p>
            <p>Instructions: {delivery.instructions}</p>
            <Button onClick={() => markDelivered(delivery._id)}>Mark as Delivered</Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default DeliveryDashboard;
