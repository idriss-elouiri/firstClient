import React, { useState, useEffect } from "react";
import axios from "axios";
import FormModal from "./FormModal";

const OrdersSupplier = () => {
  const [ordersSupplier, setOrdersSupplier] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState("All");
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const [currentPage, setCurrentPage] = useState(1); // الصفحة الحالية
  const itemsPerPage = 10; // عدد الطلبات في كل صفحة

  // الحقول الخاصة بمخطط الطلبات
  const orderFields = [
    {
      name: "farm",
      label: "المورد",
      type: "select",
      options: suppliers?.map((supplier) => ({
        value: supplier._id,
        label: supplier.name,
      })),
    },
    { name: "date", label: "التاريخ", type: "date" },
    { name: "quantity", label: "الكمية", type: "number" },
    { name: "unitPrice", label: "سعر الوحدة", type: "number" },
    {
      name: "transportationCost",
      label: "تكاليف النقل",
      type: "number",
    },
    { name: "laborCost", label: "تكاليف العمالة", type: "number" },
    { name: "maintenanceCost", label: "تكاليف الصيانة", type: "number" },
    { name: "operationalCost", label: "التكاليف التشغيلية", type: "number" },
    {
      name: "status",
      label: "الحالة",
      type: "select",
      options: ["قيد الانتظار", "تم التوصيل", "تم الإلغاء"].map((status) => ({
        value: status,
        label: status,
      })),
    },
    {
      name: "paymentStatus",
      label: "حالة الدفع",
      type: "select",
      options: ["مدفوع", "غير مدفوع"].map((status) => ({
        value: status,
        label: status,
      })),
    },
  ];

  useEffect(() => {
    fetchOrders();
    fetchSuppliers();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch(
        `${apiUrl}/api/ordersSupplier/getOrders`
      );
      const data = await response.json();
      if (data.ordersSupplier && Array.isArray(data.ordersSupplier)) {
        setOrdersSupplier(data.ordersSupplier);
      } else {
        setError("البيانات غير صالحة");
      }
    } catch (error) {
      console.error("خطأ في جلب البيانات:", error);
      setError("فشل في جلب البيانات");
    }
  };

  const fetchSuppliers = async () => {
    try {
      const res = await fetch(`${apiUrl}/api/suppliers/getSuppliers`);
      const data = await res.json();
      setSuppliers(data.suppliers || []);
    } catch (error) {
      console.error("خطأ في جلب الموردين:", error);
      setError("فشل في جلب الموردين");
    }
  };

  const handleAdd = () => {
    setEditData(null);
    setIsModalOpen(true);
  };

  const handleEdit = (order) => {
    setEditData(order);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${apiUrl}/api/ordersSupplier/delete/${id}`);
      fetchOrders();
    } catch (error) {
      console.error("خطأ في حذف الطلب:", error);
    }
  };

  const handleSubmit = async (data) => {
    try {
      if (editData) {
        await axios.put(
          `${apiUrl}/api/ordersSupplier/update/${editData._id}`,
          data
        );
      } else {
        await axios.post(`${API_BASE_URL}/api/ordersSupplier/create`, data);
      }
      fetchOrders();
      setIsModalOpen(false);
    } catch (error) {
      console.error("خطأ في إرسال الطلب:", error);
    }
  };

  // تصفية الطلبات بناءً على الفلتر الحالي
  const filteredOrdersSupplier = ordersSupplier.filter((order) => {
    const statusMatches =
      statusFilter === "All" || order.status === statusFilter;
    return statusMatches;
  });

  // منطق التصفح
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentOrders = filteredOrdersSupplier.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const totalPages = Math.ceil(filteredOrdersSupplier.length / itemsPerPage);

  if (loading) return <p>جاري التحميل...</p>;

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-xl font-semibold mb-4">الطلبات</h2>
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
      {error && <p className="text-red-600 mb-4">{error}</p>}
      <table className="min-w-full table-auto border-collapse border border-gray-300">
        <thead>
          <tr>
            <th className="border p-2">المورد</th>
            <th className="border p-2">التاريخ</th>
            <th className="border p-2">الكمية</th>
            <th className="border p-2">سعر الوحدة</th>
            <th className="border p-2">التكلفة</th>
            <th className="border p-2">تكاليف النقل</th>
            <th className="border p-2">تكاليف العمالة</th>
            <th className="border p-2">تكاليف الصيانة</th>
            <th className="border p-2">لتكاليف التشغيلية</th>
            <th className="border p-2">المجموع</th>
            <th className="border p-2">الحالة</th>
            <th className="border p-2">حالة الدفع</th>
            <th className="border p-2">الإجراءات</th>
          </tr>
        </thead>
        <tbody>
          {currentOrders?.map((order) => (
            <tr key={order._id} className="text-center">
              <td className="border p-2">{order.farm?.name}</td>
              <td className="border p-2">
                {new Date(order.date).toLocaleDateString()}
              </td>
              <td className="border p-2">{order.quantity}</td>
              <td className="border p-2">جنيه{order.unitPrice}</td>
              <td className="border p-2">
                جنيه{order.transportationCost || 0}
              </td>
              <td className="border p-2">جنيه{order.totalCost}</td>
              <td className="border p-2">جنيه{order.transportationCost}</td>
              <td className="border p-2">جنيه{order.laborCost}</td>
              <td className="border p-2">جنيه{order.maintenanceCost}</td>
              <td className="border p-2">جنيه{order.totalCost}</td>
              <td className="border p-2">{order.status}</td>
              <td className="border p-2">{order.paymentStatus}</td>
              <td className="border p-2">
                <button
                  onClick={() => handleEdit(order)}
                  className="bg-yellow-500 text-white px-3 py-1 rounded mx-2"
                >
                  تعديل
                </button>
                <button
                  onClick={() => handleDelete(order._id)}
                  className="bg-red-500 text-white px-3 py-1 rounded"
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
      <FormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        initialData={editData}
        fields={orderFields}
        suppliers={suppliers}
      />
    </div>
  );
};

export default OrdersSupplier;
