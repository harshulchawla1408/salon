import DashboardLayout from "@/components/DashboardLayout";

export default function UserDashboard() {
  return (
    <DashboardLayout requiredRole="user">
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold">Welcome, Customer</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="font-semibold mb-2">Upcoming Appointments</h3>
            <p className="text-gray-600">No upcoming appointments.</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="font-semibold mb-2">Last Service</h3>
            <p className="text-gray-600">No previous services.</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="font-semibold mb-2">Favourite Barber</h3>
            <p className="text-gray-600">Not set yet.</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="font-semibold mb-2">Book New Appointment</h3>
            <button className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
              Book Now
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}