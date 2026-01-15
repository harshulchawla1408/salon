"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";

export default function BookingFlow({ onClose, onSuccess }) {
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [services, setServices] = useState([]);
  const [barbers, setBarbers] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedBarber, setSelectedBarber] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [availability, setAvailability] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchServices();
    fetchBarbers();
  }, []);

  useEffect(() => {
    if (selectedBarber && selectedDate) {
      fetchAvailability();
    }
  }, [selectedBarber, selectedDate]);

  const fetchServices = async () => {
    try {
      const res = await api.get("/api/services");
      setServices(res.data);
    } catch (err) {
      setError("Failed to fetch services");
    }
  };

  const fetchBarbers = async () => {
    try {
      const res = await api.get("/api/barbers");
      setBarbers(res.data);
    } catch (err) {
      setError("Failed to fetch barbers");
    }
  };

  const fetchAvailability = async () => {
    try {
      setLoading(true);
      const res = await api.get(
        `/api/availability/${selectedBarber._id}?date=${selectedDate}`
      );
      setAvailability(res.data);
    } catch (err) {
      setError("Failed to fetch availability");
    } finally {
      setLoading(false);
    }
  };

  const handleBook = async () => {
    try {
      setError("");
      setLoading(true);

      await api.post("/api/bookings", {
        barberId: selectedBarber._id,
        serviceId: selectedService._id,
        date: selectedDate,
        startTime: selectedSlot.startTime,
        endTime: selectedSlot.endTime,
      });

      if (onSuccess) onSuccess();
      if (onClose) onClose();
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Failed to create booking";
      setError(errorMsg);
      if (errorMsg.includes("already booked")) {
        // Refresh availability
        await fetchAvailability();
      }
    } finally {
      setLoading(false);
    }
  };

  const availableSlots = availability?.slots?.filter((s) => !s.isBooked) || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
      <div className="bg-black rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">Book Appointment</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            ✕
          </button>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* Step 1: Select Service */}
        {step === 1 && (
          <div>
            <h3 className="font-semibold mb-4">Select Service</h3>
            <div className="space-y-2">
              {services.map((service) => (
                <button
                  key={service._id}
                  onClick={() => {
                    setSelectedService(service);
                    setStep(2);
                  }}
                  className="w-full p-4 border rounded-lg hover:bg-gray-50 text-left"
                >
                  <div className="flex justify-between">
                    <div>
                      <p className="font-medium">{service.name}</p>
                      <p className="text-sm text-gray-600">{service.description}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">${service.price}</p>
                      <p className="text-xs text-gray-500">{service.duration} min</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Select Barber */}
        {step === 2 && (
          <div>
            <button onClick={() => setStep(1)} className="text-blue-600 mb-4">
              ← Back
            </button>
            <h3 className="font-semibold mb-4">Select Barber</h3>
            <div className="space-y-2">
              {barbers.map((barber) => (
                <button
                  key={barber._id}
                  onClick={() => {
                    setSelectedBarber(barber);
                    setStep(3);
                  }}
                  className="w-full p-4 border rounded-lg hover:bg-gray-50 text-left"
                >
                  <p className="font-medium">{barber.name}</p>
                  <p className="text-sm text-gray-600">{barber.phone || barber.email}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Select Date & Slot */}
        {step === 3 && (
          <div>
            <button onClick={() => setStep(2)} className="text-blue-600 mb-4">
              ← Back
            </button>
            <h3 className="font-semibold mb-4">Select Date & Time</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Date</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                min={new Date().toISOString().split("T")[0]}
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>
            {loading ? (
              <p className="text-gray-600">Loading availability...</p>
            ) : availableSlots.length === 0 ? (
              <p className="text-gray-600">No available slots for this date</p>
            ) : (
              <div>
                <label className="block text-sm font-medium mb-2">Available Slots</label>
                <div className="grid grid-cols-3 gap-2">
                  {availableSlots.map((slot, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedSlot(slot)}
                      className={`p-3 border rounded-lg ${
                        selectedSlot?.startTime === slot.startTime
                          ? "bg-blue-600 text-white"
                          : "bg-white hover:bg-gray-50"
                      }`}
                    >
                      {slot.startTime} - {slot.endTime}
                    </button>
                  ))}
                </div>
                {selectedSlot && (
                  <button
                    onClick={handleBook}
                    disabled={loading}
                    className="mt-4 w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
                  >
                    {loading ? "Booking..." : "Confirm Booking"}
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
