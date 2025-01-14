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
    <div>
      <h1 className="text-xl font-bold">Pantry Dashboard</h1>
      {tasks.map((task) => (
        <Card key={task._id} className="w-[350px]">
          <CardHeader>
            <CardTitle>Meal Type: {task.mealType}</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Patient ID: {task.patientId}</p>
            <p>Instructions: {task.instructions}</p>
            <Button onClick={() => updateTaskStatus(task._id, "In Progress")}>
              Mark In Progress
            </Button>
            <Button onClick={() => updateTaskStatus(task._id, "Completed")}>
              Mark Completed
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default PantryDashboard;
