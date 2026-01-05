import DashboardLayout from "@/components/DashboardLayout";

export default function BarberDashboard() {
  return (
    <DashboardLayout requiredRole="barber">
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold">Barber Dashboard</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="font-semibold mb-2">Today's Bookings</h3>
            <p className="text-gray-600">No bookings assigned today.</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="font-semibold mb-2">Client Notes</h3>
            <p className="text-gray-600">No client preferences available.</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="font-semibold mb-2">Availability</h3>
            <button className="mt-2 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700">
              Block Time Slot
            </button>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="font-semibold mb-2">Post-Service Notes</h3>
            <button className="mt-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
              Add Note
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}