import React, { useEffect, useState } from "react";
import axios from "axios";

const CostAndProfitReport = () => {
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const fetchCostAndProfitReport = async () => {
    try {
      const response = await axios.get(
        `${apiUrl}/api/report/getReports`
      ); // Adjust API endpoint
      return response.data;
    } catch (error) {
      console.error("Error fetching cost and profit report:", error);
      throw error;
    }
  };

  useEffect(() => {
    const getReportData = async () => {
      try {
        const data = await fetchCostAndProfitReport();
        setReportData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    getReportData();
  }, []);

  if (loading)
    return <div className="text-center text-gray-500">جاري التحميل...</div>;
  if (error)
    return <div className="text-center text-red-500">خطأ: {error}</div>;

  return (
    <div className="bg-gray-100 p-6 rounded-lg shadow-md max-w-lg mx-auto">
      <h1 className="text-2xl font-bold text-center mb-4">
        تقرير التكاليف والأرباح
      </h1>
      {reportData ? (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="font-semibold text-gray-700">إجمالي تكلفة الشراء:</p>
            <p className="text-green-600 text-xl font-bold">
              جنيه{reportData.totalPurchaseCost?.toFixed(2) || 0}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="font-semibold text-gray-700">إجمالي الإيرادات:</p>
            <p className="text-blue-600 text-xl font-bold">
              جنيه{reportData.totalRevenue?.toFixed(2) || 0}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="font-semibold text-gray-700">إجمالي الأرباح:</p>
            <p
              className={`text-xl font-bold ${
                reportData.totalProfit >= 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              ${reportData.totalProfit?.toFixed(2) || 0}
            </p>
          </div>
        </div>
      ) : (
        <div className="text-gray-500 text-center">لا توجد بيانات متاحة</div>
      )}
    </div>
  );
};

export default CostAndProfitReport;
