import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";

const DistributionManagement = () => {
  const [orders, setOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState("All");
  const [paymentFilter, setPaymentFilter] = useState("All");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1); // الصفحة الحالية
  const itemsPerPage = 10; // عدد الطلبات في كل صفحة
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

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

  // Filtering logic
  const filteredOrders = orders.filter((order) => {
    const statusMatches =
      statusFilter === "All" || order.status === statusFilter;
    const paymentMatches =
      paymentFilter === "All" || order.paymentStatus === paymentFilter;
    return statusMatches && paymentMatches;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-center text-xl font-semibold mb-6">إدارة التوزيع</h2>
      <div className="mb-4 flex justify-between items-center">
        {/* Status filter */}
        <select
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-md"
        >
          <option value="All">كل الحالات</option>
          <option value="pending">جاري</option>
          <option value="delivered">مكتمل</option>
          <option value="canceled">ملغي</option>
        </select>
        {/* Payment status filter */}
        <select
          onChange={(e) => setPaymentFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-md"
        >
          <option value="All">كل حالات الدفع</option>
          <option value="paid">مدفوع</option>
          <option value="unpaid">غير مدفوع</option>
          <option value="pending">قيد الانتظار</option>
        </select>
      </div>

      <div className="overflow-x-auto bg-white border border-gray-200 rounded-lg shadow-lg">
        {loading && <p className="text-center">جاري التحميل...</p>}
        {error && <p className="text-red-500 text-center">{error}</p>}
        <table className="min-w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                التاريخ
              </th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                الكمية
              </th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                المحل المستلم
              </th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                الحالة
              </th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                حالة الدفع
              </th>
            </tr>
          </thead>
          <tbody>
            {currentOrders.map((order) => {
              return (
                <tr key={order._id} className="border-t">
                  <td className="px-4 py-2">
                    {new Date(order.date).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-2">{order.quantity}</td>
                  <td className="px-4 py-2">{order.destination.name}</td>
                  <td className="px-4 py-2">
                    {order.status === "pending" ? "جاري" : "مكتمل"}
                  </td>
                  <td className="px-4 py-2">{order.paymentStatus}</td>
                </tr>
              );
            })}
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
    </div>
  );
};

export default DistributionManagement;
