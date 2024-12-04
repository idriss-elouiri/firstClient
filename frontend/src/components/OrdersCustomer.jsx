import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import FormModal from "./FormModal";

const OrdersCustomer = () => {
  const [orders, setOrders] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [statusFilter, setStatusFilter] = useState("All");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1); // الصفحة الحالية
  const itemsPerPage = 10; // عدد الطلبات في كل صفحة
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const orderFields = [
    {
      name: "source",
      label: "المورد",
      type: "select",
      options: suppliers.map((supplier) => ({
        value: supplier._id,
        label: supplier.name,
      })),
    },
    {
      name: "destination",
      label: "العميل",
      type: "select",
      options: customers.map((customer) => ({
        value: customer._id,
        label: customer.name,
      })),
    },
    { name: "date", label: "التاريخ", type: "date" },
    { name: "quantity", label: "الكمية", type: "number" },
    { name: "unitPrice", label: "سعر الوحدة", type: "number" },
    {
      name: "transportationCost",
      label: "تكلفة النقل",
      type: "number",
    },
    { name: "laborCost", label: "تكلفة العمالة", type: "number" },
    { name: "operationalCost", label: "التكاليف التشغيلية", type: "number" },
    {
      name: "status",
      label: "الحالة",
      type: "select",
      options: [
        { value: "قيد الانتظار", label: "قيد الانتظار" },
        { value: "تم التوصيل", label: "تم التسليم" },
        { value: "تم الإلغاء", label: "ملغي" },
      ],
    },
    {
      name: "paymentStatus",
      label: "حالة الدفع",
      type: "select",
      options: [
        { value: "مدفوع", label: "مدفوع" },
        { value: "غير مدفوع", label: "غير مدفوع" },
      ],
    },
  ];

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

  const fetchSuppliers = useCallback(async () => {
    try {
      const { data } = await axios.get(`${apiUrl}/api/suppliers/getSuppliers`);
      setSuppliers(data.suppliers || []);
    } catch {
      setError("فشل في جلب الموردين.");
    }
  }, [apiUrl]);

  const fetchCustomers = useCallback(async () => {
    try {
      const { data } = await axios.get(`${apiUrl}/api/customers/getCustomers`);
      setCustomers(data.customers || []);
    } catch {
      setError("فشل في جلب العملاء.");
    }
  }, [apiUrl]);

  useEffect(() => {
    fetchOrders();
    fetchSuppliers();
    fetchCustomers();
  }, [fetchOrders, fetchSuppliers, fetchCustomers]);

  const handleAdd = () => {
    setEditData(null);
    setIsModalOpen(true);
  };

  const handleEdit = (order) => {
    setEditData(order);
    setIsModalOpen(true);
  };

  const handleDelete = async (order) => {
    try {
      await axios.delete(`${apiUrl}/api/orders/delete/${order._id}`, {
        params: {
          farm: order.source?.name,
          quantity: order.quantity, // Corrected spelling
        },
      });
      fetchOrders(); // Refresh the orders after deletion
    } catch (error) {
      setError("فشل في حذف الطلب."); // Display error message
    }
  };

  const handleSubmit = async (data) => {
    try {
      if (editData) {
        await axios.put(`${apiUrl}/api/orders/update/${editData._id}`, data);
      } else {
        await axios.post("http://localhost:5000/api/orders/create", data);
      }
      fetchOrders();
      setIsModalOpen(false);
    } catch {
      setError("فشل في حفظ الطلب.");
    }
  };

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

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4 text-right">إدارة الطلبات</h2>
      <div className="mb-4 flex justify-between items-center">
        <button
          onClick={handleAdd}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          إضافة طلب
        </button>
        <select
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-md"
        >
          <option value="All">كل الحالات</option>
          <option value="pending">جاري</option>
          <option value="delivered">مكتمل</option>
          <option value="canceled">ملغي</option>
        </select>
      </div>
      <div className="clear-both"></div>
      {loading && <p className="text-center">جاري التحميل...</p>}
      {error && <p className="text-red-500 text-center">{error}</p>}
      <table className="w-full table-auto border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100 text-right">
            <th className="border border-gray-300 px-4 py-2">المورد</th>
            <th className="border border-gray-300 px-4 py-2">العميل</th>
            <th className="border border-gray-300 px-4 py-2">التاريخ</th>
            <th className="border border-gray-300 px-4 py-2">الكمية</th>
            <th className="border border-gray-300 px-4 py-2">سعر الوحدة</th>
            <th className="border border-gray-300 px-4 py-2">
              التكلفة الإجمالية
            </th>
            <th className="border border-gray-300 px-4 py-2">الحالة</th>
            <th className="border border-gray-300 px-4 py-2">حالة الدفع</th>
            <th className="border border-gray-300 px-4 py-2">الإجراءات</th>
          </tr>
        </thead>
        <tbody>
          {currentOrders.map((order) => (
            <tr key={order._id} className="text-right">
              <td className="border border-gray-300 px-4 py-2">
                {order.source?.name}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {order.destination?.name}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {new Date(order.date).toLocaleDateString()}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {order.quantity}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                جنيه{order.unitPrice}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                جنيه
                {(
                  order.quantity * order.unitPrice +
                  (order.transportationCost || 0) +
                  (order.laborCost || 0) +
                  (order.operationalCost || 0)
                ).toFixed(2)}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {order.status}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {order.paymentStatus}
              </td>
              <td className="border border-gray-300 px-4 py-2 flex justify-center gap-2">
                <button
                  onClick={() => handleEdit(order)}
                  className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                >
                  تعديل
                </button>
                <button
                  onClick={() => handleDelete(order)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                >
                  حذف
                </button>
              </td>
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

      {isModalOpen && (
        <FormModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleSubmit}
          initialData={editData}
          fields={orderFields}
          suppliers={suppliers}
        />
      )}
    </div>
  );
};

export default OrdersCustomer;
