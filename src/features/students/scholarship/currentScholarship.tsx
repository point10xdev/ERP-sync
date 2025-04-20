import React, { useState, useEffect } from "react";
import { useAuth } from "../../auth/store/authAtoms";
import { Scholarship } from "../../types/schema";

export const CurrentScholarship = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [currentScholarship, setCurrentScholarship] =
    useState<Scholarship | null>(null);

  useEffect(() => {
    // In a real app, we would fetch scholarship data for the current user
    // For now, we'll use mock data
    const mockScholarship: Scholarship = {
      id: "sch-130",
      name: "April 2024 Scholarship",
      scholar: user?.username || "unknown_student", // Using username as scholar ID for mock data
      month: "April",
      year: "2024",
      days: 20,
      total_pay: 20000,
      total_pay_per_day: 1000,
      basic: 15000,
      hra: 5000,
      status: "pending", // Using the proper ScholarshipStatus
    };

    setCurrentScholarship(mockScholarship);
    setLoading(false);
  }, [user]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (!currentScholarship) {
    return (
      <div className="p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Current Scholarship</h2>
        <p className="text-gray-600">
          You don't have any active scholarships at the moment.
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-6">Current Scholarship</h2>

      <div className="mb-6">
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">{currentScholarship.name}</h3>
            <span
              className={`px-3 py-1 rounded-full text-sm ${
                currentScholarship.status === "paid"
                  ? "bg-green-100 text-green-800"
                  : currentScholarship.status === "pending"
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {currentScholarship.status.charAt(0).toUpperCase() +
                currentScholarship.status.slice(1)}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <h4 className="text-sm text-gray-500 mb-1">Amount</h4>
          <p className="text-xl font-medium">
            ₹{currentScholarship.total_pay.toLocaleString()}
          </p>
        </div>
        <div>
          <h4 className="text-sm text-gray-500 mb-1">Month</h4>
          <p>
            {currentScholarship.month}, {currentScholarship.year}
          </p>
        </div>
      </div>

      <div>
        <h4 className="text-sm text-gray-500 mb-1">Details</h4>
        <p className="text-gray-700">
          Basic: ₹{currentScholarship.basic.toLocaleString()} | HRA: ₹
          {currentScholarship.hra.toLocaleString()} | Per Day: ₹
          {currentScholarship.total_pay_per_day}
        </p>
      </div>
    </div>
  );
};
