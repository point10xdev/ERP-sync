import React, { useState, useEffect } from 'react';
import { useAuth } from '../../auth/AuthContext';
import { Scholarship } from '../../types/schema';

export const PreviousScholarships = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [previousScholarships, setPreviousScholarships] = useState<Scholarship[]>([]);

  const isPreviousScholarship = (sch: Scholarship): boolean => {
    const now = new Date();
    const currentMonthIndex = now.getMonth(); // 0-based
    const currentYear = now.getFullYear();

    const schDate = new Date(`${sch.month} 1, ${sch.year}`);
    const schMonthIndex = schDate.getMonth();
    const schYear = schDate.getFullYear();

    return (
      sch.status === 'paid' ||
      sch.status === 'rejected' ||
      schYear < currentYear ||
      (schYear === currentYear && schMonthIndex < currentMonthIndex)
    );
  };

  useEffect(() => {
    const mockScholarships: Scholarship[] = [
      {
        id: 'sch-128',
        name: 'March 2025 Scholarship',
        scholar: 'stu101',
        month: 'March',
        year: '2025',
        days: 20,
        total_pay: 20000,
        total_pay_per_day: 1000,
        basic: 15000,
        hra: 5000,
        status: 'paid',
      },
      {
        id: 'sch-127',
        name: 'January 2025 Scholarship',
        scholar: 'stu101',
        month: 'January',
        year: '2025',
        days: 18,
        total_pay: 18000,
        total_pay_per_day: 1000,
        basic: 13000,
        hra: 5000,
        status: 'paid',
      },
      {
        id: 'sch-126',
        name: 'February 2024 Grant',
        scholar: 'stu101',
        month: 'February',
        year: '2024',
        days: 22,
        total_pay: 22000,
        total_pay_per_day: 1000,
        basic: 17000,
        hra: 5000,
        status: 'rejected',
      }
    ];

    const filtered = mockScholarships.filter(isPreviousScholarship);
    setPreviousScholarships(filtered);
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (previousScholarships.length === 0) {
    return (
      <div className="p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Previous Scholarships</h2>
        <p className="text-gray-600">You don't have any previous scholarships.</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-6">Previous Scholarships</h2>

      <div className="space-y-4">
        {previousScholarships.map((sch) => (
          <div key={sch.id} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-medium">{sch.name}</h3>
              <span className={`px-3 py-1 rounded-full text-sm ${
                sch.status === 'paid' ? 'bg-green-100 text-green-800' :
                'bg-red-100 text-red-800'
              }`}>
                {sch.status.charAt(0).toUpperCase() + sch.status.slice(1)}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
              <div>
                <h4 className="text-xs text-gray-500 mb-1">Amount</h4>
                <p className="font-medium">₹{sch.total_pay.toLocaleString()}</p>
              </div>
              <div>
                <h4 className="text-xs text-gray-500 mb-1">Duration</h4>
                <p>{sch.days} days in {sch.month}, {sch.year}</p>
              </div>
              <div>
                <h4 className="text-xs text-gray-500 mb-1">Details</h4>
                <p className="text-gray-700 text-sm">
                  Basic: ₹{sch.basic.toLocaleString()} + HRA: ₹{sch.hra.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
