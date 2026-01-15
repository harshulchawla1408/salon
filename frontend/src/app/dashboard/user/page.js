"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import BookingFlow from "@/components/BookingFlow";
import api from "@/lib/api";

export default function UserDashboard() {
  const [bookings, setBookings] = useState([]);
  const [showBookingFlow, setShowBookingFlow] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/bookings?status=booked");
      setBookings(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch bookings");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    try {
      await api.patch(`/api/bookings/${bookingId}/cancel`);
      await fetchBookings();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to cancel booking");
    }
  };

  return (
    <DashboardLayout requiredRole="user">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold">Welcome, Customer</h2>
          <button
            onClick={() => setShowBookingFlow(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Book New Appointment
          </button>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="font-semibold mb-4">Upcoming Appointments</h3>
            {loading ? (
              <p className="text-gray-600">Loading...</p>
            ) : bookings.length === 0 ? (
              <p className="text-gray-600">No upcoming appointments</p>
            ) : (
              <div className="space-y-3">
                {bookings.map((booking) => (
                  <div key={booking._id} className="p-3 border rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">{booking.barberId?.name}</p>
                        <p className="text-sm text-gray-600">
                          {new Date(booking.bookingDate).toLocaleDateString()} at{" "}
                          {booking.slotStartTime} - {booking.slotEndTime}
                        </p>
                        <p className="text-sm text-gray-500">
                          {booking.serviceId?.name} - ${booking.serviceId?.price}
                        </p>
                      </div>
                      <button
                        onClick={() => handleCancelBooking(booking._id)}
                        className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="font-semibold mb-2">Quick Actions</h3>
            <button
              onClick={() => setShowBookingFlow(true)}
              className="w-full mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Book New Appointment
            </button>
          </div>
        </div>
      </div>

      {showBookingFlow && (
        <BookingFlow
          onClose={() => setShowBookingFlow(false)}
          onSuccess={() => {
            setShowBookingFlow(false);
            fetchBookings();
          }}
        />
      )}
    </DashboardLayout>
  );
}
