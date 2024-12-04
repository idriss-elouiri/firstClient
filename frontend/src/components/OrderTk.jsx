import React, { useState, useEffect, useCallback } from "react";

const OrdersTk = () => {
  const [orders, setOrders] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState("All");
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const [currentPage, setCurrentPage] = useState(1); // الصفحة الحالية
  const itemsPerPage = 10; // عدد الطلبات في كل صفحة

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${apiUrl}/api/orders/getOrders`);
      setOrders(data.orders || []);
    } catch (err) {
      setError("فشل في جلب البيانات.");
    } finally {
      setLoading(false);
    }
  }, [apiUrl]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);
  // تصفية الطلبات بناءً على الفلتر الحالي
  const filteredOrders = orders.filter((order) => {
    const statusMatches =
      statusFilter === "All" || order.status === statusFilter;
    return statusMatches;
  });

  // منطق التصفح
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);

  if (loading) return <p>جاري التحميل...</p>;

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-xl font-semibold mb-4">التكاليف الاخري</h2>
      {error && <p className="text-red-600 mb-4">{error}</p>}
      <table className="min-w-full table-auto border-collapse border border-gray-300">
        <thead>
          <tr>
            <th className="border p-2">المورد</th>
            <th className="border p-2">التاريخ</th>
            <th className="border p-2">تكاليف النقل</th>
            <th className="border p-2">تكاليف العمالة</th>
            <th className="border p-2">لتكاليف التشغيلية</th>
          </tr>
        </thead>
        <tbody>
          {currentOrders?.map((order) => (
            <tr key={order._id} className="text-center">
              <td className="border p-2">{order.destination?.name}</td>
              <td className="border p-2">
                {new Date(order.date).toLocaleDateString()}
              </td>
              <td className="border p-2">جنيه{order.transportationCost}</td>
              <td className="border p-2">جنيه{order.laborCost}</td>
              <td className="border p-2">جنيه{order.operationalCost}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* التحكم في التصفح */}
      <div className="flex justify-between mt-4">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className={`px-3 py-1 bg-gray-300 rounded-md ${
            currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          السابق
        </button>
        <span>
          الصفحة {currentPage} من {totalPages}
        </span>
        <button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
          className={`px-3 py-1 bg-gray-300 rounded-md ${
            currentPage === totalPages ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          التالي
        </button>
      </div>
    </div>
  );
};

export default OrdersTk;
