"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import api from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";

export default function BarberDashboard() {
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const [availability, setAvailability] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAvailabilityModal, setShowAvailabilityModal] = useState(false);
  const [selectedSlots, setSelectedSlots] = useState([]);

  // Generate time slots from 9 AM to 9 PM (1 hour slots)
  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 9; hour < 21; hour++) {
      const startTime = `${hour.toString().padStart(2, "0")}:00`;
      const endTime = `${(hour + 1).toString().padStart(2, "0")}:00`;
      slots.push({ startTime, endTime });
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();

  useEffect(() => {
    if (user?._id) {
      fetchData();
    }
  }, [user, selectedDate]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");

      // Fetch availability
      const availRes = await api.get(
        `/api/availability/${user._id}?date=${selectedDate}`
      );
      setAvailability(availRes.data);

      // Fetch bookings
      const bookingsRes = await api.get(
        `/api/bookings/barber/${user._id}?date=${selectedDate}`
      );
      setBookings(bookingsRes.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch data");
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleSlot = (slot) => {
    const isSelected = selectedSlots.some(
      (s) => s.startTime === slot.startTime && s.endTime === slot.endTime
    );

    if (isSelected) {
      setSelectedSlots(selectedSlots.filter(
        (s) => !(s.startTime === slot.startTime && s.endTime === slot.endTime)
      ));
    } else {
      setSelectedSlots([...selectedSlots, slot]);
    }
  };

  const handleSaveAvailability = async () => {
    try {
      setError("");
      setLoading(true);

      await api.post("/api/availability", {
        barberId: user._id,
        date: selectedDate,
        slots: selectedSlots,
      });

      setShowAvailabilityModal(false);
      setSelectedSlots([]);
      await fetchData();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save availability");
    } finally {
      setLoading(false);
    }
  };

  const handleBlockSlot = async (slot) => {
    try {
      setError("");
      // Remove slot from availability
      const updatedSlots = availability.slots.filter(
        (s) => !(s.startTime === slot.startTime && s.endTime === slot.endTime)
      );

      await api.post("/api/availability", {
        barberId: user._id,
        date: selectedDate,
        slots: updatedSlots,
      });

      await fetchData();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to block slot");
    }
  };

  if (loading && !availability) {
    return (
      <DashboardLayout requiredRole="barber">
        <div className="flex items-center justify-center min-h-[400px]">
          <p className="text-gray-600">Loading...</p>
        </div>
      </DashboardLayout>
    );
  }

  const existingSlots = availability?.slots || [];
  const bookedSlots = existingSlots.filter((s) => s.isBooked);

  return (
    <DashboardLayout requiredRole="barber">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold">Barber Dashboard</h2>
          <div className="flex gap-4 items-center">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-4 py-2 border rounded-lg"
            />
            <button
              onClick={() => setShowAvailabilityModal(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Set Availability
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Today's Bookings */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="font-semibold mb-4 text-lg">Today's Bookings</h3>
            {bookings.length === 0 ? (
              <p className="text-gray-600">No bookings for this date</p>
            ) : (
              <div className="space-y-3">
                {bookings.map((booking) => (
                  <div key={booking._id} className="p-3 border rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">
                          {booking.customerName || booking.userId?.name || "Customer"}
                        </p>
                        <p className="text-sm text-gray-600">
                          {booking.slotStartTime} - {booking.slotEndTime}
                        </p>
                        <p className="text-sm text-gray-500">
                          {booking.serviceId?.name} (${booking.serviceId?.price})
                        </p>
                      </div>
                      <button
                        onClick={async () => {
                          try {
                            await api.patch(`/api/bookings/${booking._id}/complete`);
                            await fetchData();
                          } catch (err) {
                            setError(err.response?.data?.message || "Failed to complete booking");
                          }
                        }}
                        className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700"
                      >
                        Complete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Availability */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="font-semibold mb-4 text-lg">Availability</h3>
            <div className="space-y-2">
              {existingSlots.length === 0 ? (
                <p className="text-gray-600">No availability set for this date</p>
              ) : (
                existingSlots.map((slot, idx) => (
                  <div
                    key={idx}
                    className={`p-2 border rounded flex justify-between items-center ${
                      slot.isBooked ? "bg-gray-100" : "bg-green-50"
                    }`}
                  >
                    <span className="text-sm">
                      {slot.startTime} - {slot.endTime}
                    </span>
                    <div className="flex gap-2">
                      {slot.isBooked ? (
                        <span className="text-xs text-red-600">Booked</span>
                      ) : (
                        <button
                          onClick={() => handleBlockSlot(slot)}
                          className="px-2 py-1 text-xs bg-gray-600 text-white rounded hover:bg-gray-700"
                        >
                          Block
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Availability Modal */}
        {showAvailabilityModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
              <h3 className="text-xl font-semibold mb-4">Set Availability for {selectedDate}</h3>
              <p className="text-sm text-gray-600 mb-4">
                Select time slots (1 hour each, 9 AM - 9 PM)
              </p>
              <div className="grid grid-cols-3 gap-2 mb-4">
                {timeSlots.map((slot) => {
                  const isSelected = selectedSlots.some(
                    (s) => s.startTime === slot.startTime && s.endTime === slot.endTime
                  );
                  const isBooked = existingSlots.some(
                    (s) => s.startTime === slot.startTime && s.endTime === slot.endTime && s.isBooked
                  );

                  return (
                    <button
                      key={`${slot.startTime}-${slot.endTime}`}
                      onClick={() => !isBooked && handleToggleSlot(slot)}
                      disabled={isBooked}
                      className={`p-2 border rounded text-sm ${
                        isBooked
                          ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                          : isSelected
                          ? "bg-blue-600 text-white"
                          : "bg-white hover:bg-gray-50"
                      }`}
                    >
                      {slot.startTime} - {slot.endTime}
                    </button>
                  );
                })}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleSaveAvailability}
                  disabled={selectedSlots.length === 0 || loading}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
                >
                  Save Availability
                </button>
                <button
                  onClick={() => {
                    setShowAvailabilityModal(false);
                    setSelectedSlots([]);
                  }}
                  className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
