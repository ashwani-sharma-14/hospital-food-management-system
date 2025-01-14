"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
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

  const handleAssignTask = async () => {
    try {
      const response = await axios.post("/api/assign-task", {
        patientId: selectedPatientId,
        staffId: selectedStaffId,
        mealType: selectedMealType,
        instructions: taskInstructions,
      });

      alert(response.data.message);
      fetchData();
    } catch (error) {
      console.error("Error assigning task:", error);
      alert("Failed to assign task.");
    }
  };

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
<div className="container mx-auto p-6 space-y-8">
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold text-blue-600 text-center mb-4">
        Assign Task
      </h2>
      <form className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Select Patient
          </label>
          <select
            value={selectedPatientId}
            onChange={(e) => setSelectedPatientId(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select Patient</option>
            {data.patients.map((patient) => (
              <option key={patient._id} value={patient._id}>
                {patient.name} - Room {patient.roomNumber}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Select Pantry Staff
          </label>
          <select
            value={selectedStaffId}
            onChange={(e) => setSelectedStaffId(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
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
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Select Meal Type
          </label>
          <select
            value={selectedMealType}
            onChange={(e) => setSelectedMealType(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="Morning">Morning</option>
            <option value="Evening">Evening</option>
            <option value="Night">Night</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Task Instructions
          </label>
          <textarea
            value={taskInstructions}
            onChange={(e) => setTaskInstructions(e.target.value)}
            placeholder="Enter task instructions"
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <button
          onClick={handleAssignTask}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-300"
        >
          Assign Task
        </button>
      </form>
    </div>

    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold text-green-600 text-center mb-4">
        Assign Delivery Task
      </h2>
      <form className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Select Task
          </label>
          <select
            value={selectedTaskId}
            onChange={(e) => setSelectedTaskId(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
          >
            <option value="">Select Task</option>
            {data.tasks.map((task) => (
              <option key={task._id} value={task._id}>
                {task.mealType} - {task.patientId}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Select Delivery Personnel
          </label>
          <select
            value={selectedDeliveryPersonnelId}
            onChange={(e) => setSelectedDeliveryPersonnelId(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
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
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Delivery Notes
          </label>
          <textarea
            value={deliveryNotes}
            onChange={(e) => setDeliveryNotes(e.target.value)}
            placeholder="Enter delivery notes"
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
          />
        </div>

        <button
          onClick={handleAssignDeliveryTask}
          className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 focus:outline-none focus:ring focus:ring-green-300"
        >
          Assign Delivery Task
        </button>
      </form>
    </div>
  </div>

  <div>
    <h2 className="text-xl font-bold mb-4">Patients</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {data.patients.map((patient) => (
        <div
          key={patient._id}
          className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg"
        >
          <h3 className="text-lg font-semibold text-gray-800">
            {patient.name}
          </h3>
          <p className="text-sm text-gray-600">
            <strong>Room:</strong> {patient.roomNumber}, Floor:{" "}
            {patient.floorNumber}
          </p>
          <p className="text-sm text-gray-600">
            <strong>Diseases:</strong> {patient.diseases.join(", ")}
          </p>
        </div>
      ))}
    </div>
    <button
      onClick={() => router.replace("/dashboard/patientDetails")}
      className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
    >
      Add Patient Detail
    </button>
  </div>

  <div>
    <h2 className="text-xl font-bold mb-4">Staff</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {data.staff.map((staff) => (
        <div
          key={staff._id}
          className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg"
        >
          <h3 className="text-lg font-semibold text-gray-800">
            {staff.name}
          </h3>
          <p className="text-sm text-gray-600">
            <strong>Email:</strong> {staff.email}
          </p>
          <p className="text-sm text-gray-600">
            <strong>Roles:</strong>{" "}
            {[staff.isAdmin && "Admin", staff.isPantry && "Pantry", staff.isDelivery && "Delivery"]
              .filter(Boolean)
              .join(", ")}
          </p>
        </div>
      ))}
    </div>
  </div>
  <h2 className="text-xl font-bold mt-4">Pantry Tasks</h2>
  <div className="flex flex-wrap gap-4">
    {data.tasks.map((task) => (
      <div key={task._id} className="w-[350px] bg-white rounded-lg shadow-md p-4 hover:shadow-lg">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          Meal Type: {task.mealType}
        </h3>
        <p className="text-sm text-gray-600">
          <strong>Patient ID:</strong> {task.patientId}
        </p>
        <p className="text-sm text-gray-600">
          <strong>Instructions:</strong> {task.instructions}
        </p>
        <p className="text-sm text-gray-600">
          <strong>Preparation Status:</strong> {task.status}
        </p>
      </div>
    ))}
  </div>


  <h2 className="text-xl font-bold mt-4">Delivery Tasks</h2>
  <div className="flex flex-wrap gap-4">
    {data?.deliveries?.map((task) => (
      <div key={task._id} className="w-[350px] bg-white rounded-lg shadow-md p-4 hover:shadow-lg">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          Meal Type: {task.taskId}
        </h3>
        <p className="text-sm text-gray-600">
          <strong>Patient ID:</strong> {task.deliveryPersonnelId}
        </p>
        <p className="text-sm text-gray-600">
          <strong>Preparation Status:</strong> {task.status}
        </p>
      </div>
    ))}
  </div>
</div>

  );
};

export default AdminDashBoard;
