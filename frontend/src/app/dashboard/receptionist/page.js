"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import api from "@/lib/api";

export default function ReceptionistDashboard() {
  const [barbers, setBarbers] = useState([]);
  const [walkInCustomers, setWalkInCustomers] = useState([]);
  const [activeAppointments, setActiveAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch barbers and walk-in customers
    // This is a placeholder - actual API endpoints would be implemented
    const fetchData = async () => {
      try {
        // Mock data for now - replace with actual API calls
        setBarbers([
          { id: "1", name: "John Barber", status: "available", currentAppointment: null },
          { id: "2", name: "Jane Barber", status: "busy", currentAppointment: "Customer A" },
        ]);

        setWalkInCustomers([
          { id: "1", name: "Walk-in Customer 1", phone: "+61400000001", status: "waiting" },
          { id: "2", name: "Walk-in Customer 2", phone: "+61400000002", status: "waiting" },
        ]);

        setActiveAppointments([
          { id: "1", customer: "Customer A", barber: "Jane Barber", status: "active" },
        ]);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAssignToBarber = async (customerId, barberId) => {
    try {
      // TODO: Implement API call to assign customer to barber
      console.log(`Assigning customer ${customerId} to barber ${barberId}`);
      
      // Update local state
      const customer = walkInCustomers.find(c => c.id === customerId);
      const barber = barbers.find(b => b.id === barberId);
      
      if (customer && barber) {
        setActiveAppointments([...activeAppointments, {
          id: Date.now().toString(),
          customer: customer.name,
          barber: barber.name,
          status: "active",
        }]);

        setWalkInCustomers(walkInCustomers.filter(c => c.id !== customerId));
        setBarbers(barbers.map(b => 
          b.id === barberId ? { ...b, status: "busy", currentAppointment: customer.name } : b
        ));
      }
    } catch (err) {
      console.error("Error assigning customer:", err);
    }
  };

  const handleMarkActive = (appointmentId) => {
    // Mark appointment as active
    setActiveAppointments(activeAppointments.map(apt => 
      apt.id === appointmentId ? { ...apt, status: "active" } : apt
    ));
  };

  const handleAddWalkIn = () => {
    const name = prompt("Enter customer name:");
    const phone = prompt("Enter customer phone:");
    
    if (name && phone) {
      setWalkInCustomers([...walkInCustomers, {
        id: Date.now().toString(),
        name,
        phone,
        status: "waiting",
      }]);
    }
  };

  if (loading) {
    return (
      <DashboardLayout requiredRole="receptionist">
        <div className="flex items-center justify-center min-h-[400px]">
          <p className="text-gray-600">Loading...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout requiredRole="receptionist">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold">Receptionist Dashboard</h2>
          <button
            onClick={handleAddWalkIn}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Add Walk-in Customer
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Barbers List */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="font-semibold mb-4 text-lg">Barbers</h3>
            <div className="space-y-3">
              {barbers.length === 0 ? (
                <p className="text-gray-600">No barbers available</p>
              ) : (
                barbers.map((barber) => (
                  <div
                    key={barber.id}
                    className="p-3 border rounded-lg flex justify-between items-center"
                  >
                    <div>
                      <p className="font-medium">{barber.name}</p>
                      <p className={`text-sm ${barber.status === "available" ? "text-green-600" : "text-red-600"}`}>
                        {barber.status === "available" ? "Available" : `Busy - ${barber.currentAppointment}`}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Walk-in Customers */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="font-semibold mb-4 text-lg">Walk-in Customers</h3>
            <div className="space-y-3">
              {walkInCustomers.length === 0 ? (
                <p className="text-gray-600">No walk-in customers waiting</p>
              ) : (
                walkInCustomers.map((customer) => (
                  <div
                    key={customer.id}
                    className="p-3 border rounded-lg"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-medium">{customer.name}</p>
                        <p className="text-sm text-gray-600">{customer.phone}</p>
                        <p className="text-sm text-yellow-600">Status: Waiting</p>
                      </div>
                    </div>
                    <div className="mt-2 space-x-2">
                      {barbers
                        .filter(b => b.status === "available")
                        .map((barber) => (
                          <button
                            key={barber.id}
                            onClick={() => handleAssignToBarber(customer.id, barber.id)}
                            className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                          >
                            Assign to {barber.name}
                          </button>
                        ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Active Appointments */}
          <div className="bg-white p-6 rounded-lg shadow lg:col-span-2">
            <h3 className="font-semibold mb-4 text-lg">Active Appointments</h3>
            <div className="space-y-3">
              {activeAppointments.length === 0 ? (
                <p className="text-gray-600">No active appointments</p>
              ) : (
                activeAppointments.map((appointment) => (
                  <div
                    key={appointment.id}
                    className="p-3 border rounded-lg flex justify-between items-center"
                  >
                    <div>
                      <p className="font-medium">{appointment.customer}</p>
                      <p className="text-sm text-gray-600">Barber: {appointment.barber}</p>
                      <p className={`text-sm ${appointment.status === "active" ? "text-green-600" : "text-yellow-600"}`}>
                        Status: {appointment.status}
                      </p>
                    </div>
                    {appointment.status !== "active" && (
                      <button
                        onClick={() => handleMarkActive(appointment.id)}
                        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                      >
                        Mark as Active
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
