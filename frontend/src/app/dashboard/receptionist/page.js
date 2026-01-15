"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import api from "@/lib/api";

export default function ReceptionistDashboard() {
  const [barbers, setBarbers] = useState([]);
  const [walkInCustomers, setWalkInCustomers] = useState([]);
  const [services, setServices] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchData();
  }, [selectedDate]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");

      // Fetch barbers with availability and bookings
      const barbersRes = await api.get(`/api/barbers/with-availability?date=${selectedDate}`);
      setBarbers(barbersRes.data);

      // Fetch services for booking
      const servicesRes = await api.get("/api/services");
      setServices(servicesRes.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch data");
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddWalkIn = () => {
    const name = prompt("Enter customer name:");
    const phone = prompt("Enter customer phone:");
    
    if (name && phone) {
      setWalkInCustomers([
        ...walkInCustomers,
        {
          id: Date.now().toString(),
          name: name.trim(),
          phone: phone.trim(),
          status: "waiting",
        },
      ]);
    }
  };

  const handleBookWalkIn = async (customer, barberId, slot) => {
    try {
      setError("");

      // Get first available service (or prompt for selection)
      if (services.length === 0) {
        setError("No services available. Please add services first.");
        return;
      }

      const serviceId = services[0]._id; // For now, use first service. Can be enhanced with selection

      // Create booking
      const bookingRes = await api.post("/api/bookings", {
        barberId,
        serviceId,
        date: selectedDate,
        startTime: slot.startTime,
        endTime: slot.endTime,
        customerName: customer.name,
        customerPhone: customer.phone,
      });

      // Remove customer from walk-in list
      setWalkInCustomers(walkInCustomers.filter((c) => c.id !== customer.id));

      // Refresh barbers data
      await fetchData();

      alert(`Booking confirmed for ${customer.name} with ${bookingRes.data.barberId.name}`);
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Failed to create booking";
      setError(errorMsg);
      if (errorMsg.includes("already booked")) {
        // Refresh data to show updated availability
        await fetchData();
      }
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
          <div className="flex gap-4 items-center">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-4 py-2 border rounded-lg"
            />
            <button
              onClick={handleAddWalkIn}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Add Walk-in Customer
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Barbers List */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="font-semibold mb-4 text-lg">Barbers</h3>
            <div className="space-y-4">
              {barbers.length === 0 ? (
                <p className="text-gray-600">No barbers available</p>
              ) : (
                barbers.map((barber) => {
                  const freeSlots = barber.availability?.slots.filter((s) => !s.isBooked) || [];
                  const bookedCount = barber.stats?.bookedSlots || 0;
                  const totalCount = barber.stats?.totalSlots || 0;

                  return (
                    <div
                      key={barber._id}
                      className="p-4 border rounded-lg"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-medium">{barber.name}</p>
                          <p className="text-sm text-gray-600">{barber.phone || barber.email}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">
                            {bookedCount}/{totalCount} booked
                          </p>
                          <p className="text-xs text-gray-500">
                            {barber.stats?.utilization || 0}% utilization
                          </p>
                        </div>
                      </div>

                      {freeSlots.length > 0 && (
                        <div className="mt-3">
                          <p className="text-xs text-gray-500 mb-2">Available slots:</p>
                          <div className="flex flex-wrap gap-2">
                            {freeSlots.slice(0, 5).map((slot, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded"
                              >
                                {slot.startTime} - {slot.endTime}
                              </span>
                            ))}
                            {freeSlots.length > 5 && (
                              <span className="px-2 py-1 text-xs text-gray-500">
                                +{freeSlots.length - 5} more
                              </span>
                            )}
                          </div>
                        </div>
                      )}

                      {barber.bookings && barber.bookings.length > 0 && (
                        <div className="mt-3">
                          <p className="text-xs text-gray-500 mb-2">Upcoming bookings:</p>
                          {barber.bookings.slice(0, 3).map((booking) => (
                            <div key={booking._id} className="text-xs text-gray-600">
                              {booking.slotStartTime} - {booking.customerName || booking.userId?.name}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })
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
                    <div className="mt-2">
                      <p className="text-xs text-gray-500 mb-2">Select barber and slot:</p>
                      <div className="space-y-2">
                        {barbers.map((barber) => {
                          const freeSlots = barber.availability?.slots.filter((s) => !s.isBooked) || [];
                          if (freeSlots.length === 0) return null;

                          return (
                            <div key={barber._id} className="border-t pt-2">
                              <p className="text-xs font-medium mb-1">{barber.name}</p>
                              <div className="flex flex-wrap gap-1">
                                {freeSlots.slice(0, 3).map((slot, idx) => (
                                  <button
                                    key={idx}
                                    onClick={() => handleBookWalkIn(customer, barber._id, slot)}
                                    className="px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700"
                                  >
                                    {slot.startTime}
                                  </button>
                                ))}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
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
