import React, { useState, useEffect } from "react";
import { useAuth } from "../../auth/authAtoms";
import { Scholarship } from "../../types/schema";

export const PreviousScholarships = () => {
  const { user } = useAuth();
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [loading, setLoading] = useState(true);

  const isPreviousScholarship = (sch: Scholarship): boolean => {
    const now = new Date();
    const currentMonthIndex = now.getMonth(); // 0-based
    const currentYear = now.getFullYear();

    const schDate = new Date(`${sch.month} 1, ${sch.year}`);
    const schMonthIndex = schDate.getMonth();
    const schYear = schDate.getFullYear();

    return (
      sch.status === "paid" ||
      sch.status === "rejected" ||
      schYear < currentYear ||
      (schYear === currentYear && schMonthIndex < currentMonthIndex)
    );
  };

  useEffect(() => {
    const mockScholarships: Scholarship[] = [
      {
        id: "1",
        name: "Merit Scholarship 2022-23",
        amount: 45000,
        status: "Completed",
        startDate: new Date("2022-09-01"),
        endDate: new Date("2023-06-30"),
        studentId: user?.username || "",
        courseName: user?.course || "Unknown",
        department: user?.department || "Unknown",
      },
      {
        id: "2",
        name: "Merit Scholarship 2021-22",
        amount: 40000,
        status: "Completed",
        startDate: new Date("2021-09-01"),
        endDate: new Date("2022-06-30"),
        studentId: user?.username || "",
        courseName: user?.course || "Unknown",
        department: user?.department || "Unknown",
      },
    ];

    setScholarships(mockScholarships);
    setLoading(false);
  }, [user]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (scholarships.length === 0) {
    return (
      <div className="p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Previous Scholarships</h2>
        <p className="text-gray-600">
          You don't have any previous scholarships.
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-6">Previous Scholarships</h2>

      <div className="space-y-4">
        {scholarships.map((sch) => (
          <div
            key={sch.id}
            className="bg-gray-50 p-4 rounded-lg border border-gray-200"
          >
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-medium">{sch.name}</h3>
              <span
                className={`px-3 py-1 rounded-full text-sm ${
                  sch.status === "paid"
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {sch.status.charAt(0).toUpperCase() + sch.status.slice(1)}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
              <div>
                <h4 className="text-xs text-gray-500 mb-1">Amount</h4>
                <p className="font-medium">
                  ₹{sch.total_pay?.toLocaleString() || 0}
                </p>
              </div>
              <div>
                <h4 className="text-xs text-gray-500 mb-1">Duration</h4>
                <p>{sch.days ? `${sch.days} days` : "N/A"}</p>
              </div>
              <div>
                <h4 className="text-xs text-gray-500 mb-1">Details</h4>
                <p className="text-gray-700 text-sm">
                  {sch.courseName ? `Course: ${sch.courseName}` : "N/A"}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
