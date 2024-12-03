import React, { useState } from "react";
import { DateRangePicker } from "react-date-range";
import axios from "axios";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

const DistributionReport = () => {
  const [range, setRange] = useState([
    {
      startDate: null,
      endDate: null,
      key: "selection",
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState(null);
  const [error, setError] = useState(null);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const fetchReport = async () => {
    const startDate = range[0].startDate;
    const endDate = range[0].endDate;

    if (!startDate || !endDate) {
      setError("يرجى اختيار تاريخ البداية والنهاية.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(
        `${apiUrl}/api/report/distribution`,
        {
          params: {
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString(),
          },
        }
      );
      setReport(response.data);
    } catch (err) {
      setError(
        `حدث خطأ أثناء جلب التقرير: ${
          err.response?.data?.message || err.message
        }`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto bg-gray-50 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center text-blue-600 mb-6">
        تقرير الكميات الموزعة والتكاليف
      </h2>

      <div className="flex flex-col items-center mb-6">
        <DateRangePicker
          ranges={range}
          onChange={(item) => setRange([item.selection])}
          editableDateInputs={true}
          moveRangeOnFirstSelection={false}
          className="mb-4"
        />
        <button
          onClick={fetchReport}
          disabled={loading}
          className={`py-2 px-4 font-semibold rounded-lg shadow-md ${
            loading
              ? "bg-gray-300 text-gray-500"
              : "bg-blue-500 hover:bg-blue-700 text-white"
          }`}
        >
          {loading ? "جاري التحميل..." : "عرض التقرير"}
        </button>
      </div>

      {error && <p className="text-red-500 text-center font-medium">{error}</p>}

      {report && (
        <div className="mt-6 p-6 bg-white rounded-lg shadow-md">
          <p className="text-lg font-medium">
            <span className="font-bold text-gray-700">إجمالي الكميات: </span>
            {report.totalQuantity.toLocaleString()}
          </p>
          <p className="text-lg font-medium mt-4">
            <span className="font-bold text-gray-700">إجمالي التكاليف: </span>
            {report.totalCost.toLocaleString(undefined, {
              minimumFractionDigits: 2,
            })}{" "}
            
          </p>
        </div>
      )}
    </div>
  );
};

export default DistributionReport;
