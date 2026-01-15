"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import api from "@/lib/api";

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [barbers, setBarbers] = useState([]);
  const [services, setServices] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalBarbers: 0,
    totalBookings: 0,
    totalRevenue: 0,
  });

  useEffect(() => {
    fetchData();
  }, [selectedDate]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");

      // Fetch all users
      const usersRes = await api.get("/api/users");
      setUsers(usersRes.data);

      // Fetch barbers with availability
      const barbersRes = await api.get(`/api/barbers/with-availability?date=${selectedDate}`);
      setBarbers(barbersRes.data);

      // Fetch services
      const servicesRes = await api.get("/api/services");
      setServices(servicesRes.data);

      // Calculate stats
      const totalBookings = barbersRes.data.reduce(
        (sum, barber) => sum + (barber.bookings?.length || 0),
        0
      );
      const totalRevenue = barbersRes.data.reduce((sum, barber) => {
        return (
          sum +
          (barber.bookings?.reduce(
            (bookingSum, booking) => bookingSum + (booking.serviceId?.price || 0),
            0
          ) || 0)
        );
      }, 0);

      setStats({
        totalUsers: usersRes.data.length,
        totalBarbers: barbersRes.data.length,
        totalBookings,
        totalRevenue,
      });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch data");
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handlePromoteToBarber = async (userId) => {
    try {
      setError("");
      await api.patch(`/api/users/${userId}/role`, { role: "barber" });
      await fetchData();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to promote user");
    }
  };

  const handleDeactivateBarber = async (barberId) => {
    try {
      setError("");
      await api.patch(`/api/users/${barberId}`, { isActive: false });
      await fetchData();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to deactivate barber");
    }
  };

  if (loading) {
    return (
      <DashboardLayout requiredRole="admin">
        <div className="flex items-center justify-center min-h-[400px]">
          <p className="text-gray-600">Loading...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout requiredRole="admin">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold">Admin Dashboard</h2>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-4 py-2 border rounded-lg"
          />
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-sm text-gray-600">Total Users</p>
            <p className="text-2xl font-bold">{stats.totalUsers}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-sm text-gray-600">Total Barbers</p>
            <p className="text-2xl font-bold">{stats.totalBarbers}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-sm text-gray-600">Today's Bookings</p>
            <p className="text-2xl font-bold">{stats.totalBookings}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-sm text-gray-600">Today's Revenue</p>
            <p className="text-2xl font-bold">${stats.totalRevenue}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Barbers Management */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="font-semibold mb-4 text-lg">Barbers</h3>
            <div className="space-y-3">
              {barbers.length === 0 ? (
                <p className="text-gray-600">No barbers</p>
              ) : (
                barbers.map((barber) => (
                  <div key={barber._id} className="p-3 border rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">{barber.name}</p>
                        <p className="text-sm text-gray-600">{barber.phone || barber.email}</p>
                        <p className="text-xs text-gray-500">
                          {barber.stats?.bookedSlots || 0}/{barber.stats?.totalSlots || 0} slots booked
                          ({barber.stats?.utilization || 0}% utilization)
                        </p>
                      </div>
                      <button
                        onClick={() => handleDeactivateBarber(barber._id)}
                        className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
                      >
                        Deactivate
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Users Management */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="font-semibold mb-4 text-lg">Users</h3>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {users.filter((u) => u.role === "user").length === 0 ? (
                <p className="text-gray-600">No users</p>
              ) : (
                users
                  .filter((u) => u.role === "user")
                  .map((user) => (
                    <div key={user._id} className="p-3 border rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">{user.name || "No name"}</p>
                          <p className="text-sm text-gray-600">{user.phone || user.email}</p>
                          <p className="text-xs text-gray-500">Role: {user.role}</p>
                        </div>
                        <button
                          onClick={() => handlePromoteToBarber(user._id)}
                          className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                          Promote to Barber
                        </button>
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
