"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";

// Define types
interface Patient {
  _id: string;
  name: string;
  diseases: string[];
  allergies: string[];
  roomNumber: number;
  bedNumber: number;
  floorNumber: number;
  age: number;
  gender: string;
  phone: string;
  emergencyContact: string;
}

interface Staff {
  _id: string;
  name: string;
  email: string;
  phone: string;
  isAdmin: boolean;
  isPantry: boolean;
  isDelivery: boolean;
}

interface Task {
  _id: string;
  patientId: string;
  mealType: string;
  instructions: string;
  status: string;
}

interface Delivery{
  _id: string;
  taskId: string;
  deliveryPersonnelId: string;
  status: string;
  notes: string;
}

interface ApiResponse {
  message: string;
  patients: Patient[];
  staff: Staff[];
  tasks: Task[];
  deliveries: Delivery[];
}

const AdminDashBoard = () => {
  const router = useRouter();
  const [data, setData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // State variables for assigning tasks
  const [selectedPatientId, setSelectedPatientId] = useState<string>("");
  const [selectedStaffId, setSelectedStaffId] = useState<string>("");
  const [selectedMealType, setSelectedMealType] = useState<string>("Morning");
  const [taskInstructions, setTaskInstructions] = useState<string>("");

  // State variables for assigning delivery tasks
  const [selectedTaskId, setSelectedTaskId] = useState<string>("");
  const [selectedDeliveryPersonnelId, setSelectedDeliveryPersonnelId] =
    useState<string>("");
  const [deliveryNotes, setDeliveryNotes] = useState<string>("");

  const fetchData = async () => {
    try {
      const response = await axios.get<ApiResponse>("/api/admin");
      console.log("API Response:", response); // Log the API response
      setData(response.data);
    } catch (err) {
      console.error("Error fetching data:", err); // Log the error
      setError("An error occurred while fetching data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!data) {
    return <div>Data not received</div>;
  }

  // Function to handle task assignment
  const handleAssignTask = async () => {
    try {
      const response = await axios.post("/api/assign-task", {
        patientId: selectedPatientId,
        staffId: selectedStaffId,
        mealType: selectedMealType,
        instructions: taskInstructions,
      });

      alert(response.data.message);
      fetchData(); // Refresh data after task assignment
    } catch (error) {
      console.error("Error assigning task:", error);
      alert("Failed to assign task.");
    }
  };

  // Function to handle delivery task assignment
  const handleAssignDeliveryTask = async () => {
    try {
      const response = await axios.post("/api/delivery-tasks", {
        taskId: selectedTaskId,
        deliveryPersonnelId: selectedDeliveryPersonnelId,
        notes: deliveryNotes,
      });

      alert(response.data.message);
      fetchData(); // Refresh data after delivery task assignment
    } catch (error) {
      console.error("Error assigning delivery task:", error);
      alert("Failed to assign delivery task.");
    }
  };

  return (
    <div className="flex flex-wrap gap-4 p-4">
      <h2 className="w-full text-xl font-bold mt-4">Assign Task</h2>

      <div className="w-full flex flex-col gap-4">
        {/* Select Patient */}
        <select
          value={selectedPatientId}
          onChange={(e) => setSelectedPatientId(e.target.value)}
          className="p-2 border border-gray-300 rounded"
        >
          <option value="">Select Patient</option>
          {data.patients.map((patient) => (
            <option key={patient._id} value={patient._id}>
              {patient.name} - Room {patient.roomNumber}
            </option>
          ))}
        </select>

        {/* Select Staff */}
        <select
          value={selectedStaffId}
          onChange={(e) => setSelectedStaffId(e.target.value)}
          className="p-2 border border-gray-300 rounded"
        >
          <option value="">Select Pantry Staff</option>
          {data.staff
            .filter((staff) => staff.isPantry)
            .map((staff) => (
              <option key={staff._id} value={staff._id}>
                {staff.name} - {staff.email}
              </option>
            ))}
        </select>

        {/* Select Meal Type */}
        <select
          value={selectedMealType}
          onChange={(e) => setSelectedMealType(e.target.value)}
          className="p-2 border border-gray-300 rounded"
        >
          <option value="Morning">Morning</option>
          <option value="Evening">Evening</option>
          <option value="Night">Night</option>
        </select>

        {/* Task Instructions */}
        <textarea
          value={taskInstructions}
          onChange={(e) => setTaskInstructions(e.target.value)}
          placeholder="Enter task instructions"
          className="p-2 border border-gray-300 rounded"
        />

        {/* Assign Task Button */}
        <Button onClick={handleAssignTask} className="mt-4">
          Assign Task
        </Button>
      </div>

      <h2 className="w-full text-xl font-bold mt-4">Assign Delivery Task</h2>

      <div className="w-full flex flex-col gap-4">
        {/* Select Task */}
        <select
          value={selectedTaskId}
          onChange={(e) => setSelectedTaskId(e.target.value)}
          className="p-2 border border-gray-300 rounded"
        >
          <option value="">Select Task</option>
          {data.tasks.map((task) => (
            <option key={task._id} value={task._id}>
              {task.mealType} - {task.patientId}
            </option>
          ))}
        </select>

        {/* Select Delivery Personnel */}
        <select
          value={selectedDeliveryPersonnelId}
          onChange={(e) => setSelectedDeliveryPersonnelId(e.target.value)}
          className="p-2 border border-gray-300 rounded"
        >
          <option value="">Select Delivery Personnel</option>
          {data.staff
            .filter((staff) => staff.isDelivery)
            .map((staff) => (
              <option key={staff._id} value={staff._id}>
                {staff.name} - {staff.email}
              </option>
            ))}
        </select>

        {/* Delivery Notes */}
        <textarea
          value={deliveryNotes}
          onChange={(e) => setDeliveryNotes(e.target.value)}
          placeholder="Enter delivery notes"
          className="p-2 border border-gray-300 rounded"
        />

        {/* Assign Delivery Task Button */}
        <Button onClick={handleAssignDeliveryTask} className="mt-4">
          Assign Delivery Task
        </Button>
      </div>

      {/* Patient and Staff Display */}
      <h2 className="w-full text-xl font-bold mt-4">Patients</h2>
      <div className="flex flex-wrap gap-4">
        {data.patients.map((patient) => (
          <Card key={patient._id} className="w-[350px]">
            <CardHeader>
              <CardTitle>{patient.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                <strong>Diseases:</strong> {patient.diseases.join(", ")}
              </p>
              <p>
                <strong>Allergies:</strong> {patient.allergies.join(", ")}
              </p>
              <p>
                <strong>Room Number:</strong> {patient.roomNumber}
              </p>
              <p>
                <strong>Bed Number:</strong> {patient.bedNumber}
              </p>
              <p>
                <strong>Floor Number:</strong> {patient.floorNumber}
              </p>
              <p>
                <strong>Age:</strong> {patient.age}
              </p>
              <p>
                <strong>Gender:</strong> {patient.gender}
              </p>
              <p>
                <strong>Phone:</strong> {patient.phone}
              </p>
              <p>
                <strong>Emergency Contact:</strong> {patient.emergencyContact}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <h2 className="w-full text-xl font-bold mt-4">Staff</h2>
      <div className="flex flex-wrap gap-4">
        {data.staff.map((staffMember) => (
          <Card key={staffMember._id} className="w-[350px]">
            <CardHeader>
              <CardTitle>{staffMember.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                <strong>Email:</strong> {staffMember.email}
              </p>
              <p>
                <strong>Phone:</strong> {staffMember.phone}
              </p>
              <p>
                <strong>Roles:</strong>{" "}
                {[
                  staffMember.isAdmin ? "Admin" : null,
                  staffMember.isPantry ? "Pantry" : null,
                  staffMember.isDelivery ? "Delivery" : null,
                ]
                  .filter(Boolean)
                  .join(", ")}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <h2 className="w-full text-xl font-bold mt-4">Pantry Tasks</h2>
      <div className="flex flex-wrap gap-4">
        {data.tasks.map((task) => (
          <Card key={task._id} className="w-[350px]">
            <CardHeader>
              <CardTitle>Meal Type: {task.mealType}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                <strong>Patient ID:</strong> {task.patientId}
              </p>
              <p>
                <strong>Instructions:</strong> {task.instructions}
              </p>
              <p>
                <strong>Preparation Status:</strong> {task.status}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
      <h2 className="w-full text-xl font-bold mt-4">Pantry Tasks</h2>
      <div className="flex flex-wrap gap-4">
        {data?.deliveries?.map((task) => (
          <Card key={task._id} className="w-[350px]">
            <CardHeader>
              <CardTitle>Meal Type: {task.taskId}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                <strong>Patient ID:</strong> {task.deliveryPersonnelId}
              </p>
              <p>
                <strong>Preparation Status:</strong> {task.status}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AdminDashBoard;
