import DashboardLayout from "@/components/DashboardLayout";

export default function AdminDashboard() {
  return (
    <DashboardLayout requiredRole="admin">
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold">Admin Dashboard</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="font-semibold mb-2">Manage Barbers</h3>
            <div className="space-x-2 mt-2">
              <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                Add Barber
              </button>
              <button className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
                Deactivate Barber
              </button>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="font-semibold mb-2">User Roles</h3>
            <button className="mt-2 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700">
              Promote to Barber
            </button>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="font-semibold mb-2">Shifts & Schedule</h3>
            <button className="mt-2 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">
              Assign Shifts
            </button>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="font-semibold mb-2">Analytics & Revenue</h3>
            <button className="mt-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
              View Analytics
            </button>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="font-semibold mb-2">Services & Pricing</h3>
            <button className="mt-2 px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700">
              Manage Services
            </button>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="font-semibold mb-2">System Control</h3>
            <button className="mt-2 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700">
              Settings
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}