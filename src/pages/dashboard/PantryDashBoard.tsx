import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Define the component props
interface PantryDashboardProps {
  user: {
    email: string;
    token: string;
  };
}

// Define the Task interface
interface Task {
  _id: string;
  patientId: string;
  mealType: string;
  instructions: string;
}

const PantryDashboard: React.FC<PantryDashboardProps> = ({ user }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get("/api/pantry-tasks");
        setTasks(response.data.tasks);
      } catch (err) {
        setError("Failed to load tasks");
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, [user.token]);

  const updateTaskStatus = async (taskId: string, status: string) => {
    try {
      await axios.patch(
        `/api/pantry-tasks?taskId=${taskId}`,
        { status },
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );
      alert("Task status updated successfully");
    } catch (error) {
      console.error("Error updating task status", error);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="container mx-auto p-6">
    <h1 className="text-2xl font-bold mb-6">Pantry Dashboard</h1>
    <div className="flex flex-wrap gap-6">
      {tasks.map((task) => (
        <Card key={task._id} className="w-[350px]">
          <CardHeader>
            <CardTitle>Meal Type: {task.mealType}</CardTitle>
          </CardHeader>
          <CardContent>
            <p><strong>Patient ID:</strong> {task.patientId}</p>
            <p><strong>Instructions:</strong> {task.instructions}</p>
            <div className="flex gap-2 mt-4">
              <Button
                onClick={() => updateTaskStatus(task._id, "In Progress")}
                className="bg-yellow-500 text-white hover:bg-yellow-600"
              >
                Mark In Progress
              </Button>
              <Button
                onClick={() => updateTaskStatus(task._id, "Completed")}
                className="bg-green-600 text-white hover:bg-green-700"
              >
                Mark Completed
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  </div>
  );
};

export default PantryDashboard;
