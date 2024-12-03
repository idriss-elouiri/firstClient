import React, { useState } from "react";
import { DateRangePicker } from "react-date-range";
import axios from "axios";
import "react-date-range/dist/styles.css"; // CSS الأساسية
import "react-date-range/dist/theme/default.css"; // ثيم الافتراضي

const ProfitAnalysis = () => {
  const [range, setRange] = useState([
    {
      startDate: null,
      endDate: null,
      key: "selection",
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  // Fetching profit data based on selected dates
  const fetchProfitData = async () => {
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
        `${apiUrl}/api/report/profit-analysis`,
        {
          params: {
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString(),
          },
        }
      );
      setData(response.data);
    } catch (err) {
      setError("حدث خطأ أثناء تحليل الأرباح.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>تحليل الأرباح</h2>

      <div style={{ display: "flex", justifyContent: "center", marginBottom: "20px" }}>
        <DateRangePicker
          ranges={range}
          onChange={(item) => setRange([item.selection])}
          editableDateInputs={true}
          moveRangeOnFirstSelection={false}
        />
      </div>

      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <button
          onClick={fetchProfitData}
          style={{
            padding: "10px 20px",
            backgroundColor: "#007BFF",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
          disabled={loading}
        >
          {loading ? "جاري التحميل..." : "عرض التحليل"}
        </button>
      </div>

      {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}

      {data && (
        <div>
          <h3>الإيرادات: {data.totalRevenue} جنيه</h3>
          <h3>المصاريف: {data.totalExpense} جنيه</h3>
          <h3
            style={{
              color: data.profit >= 0 ? "green" : "red",
            }}
          >
            الأرباح الصافية: {data.profit} جنيه
          </h3>
        </div>
      )}
    </div>
  );
};

export default ProfitAnalysis;
