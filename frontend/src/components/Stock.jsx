import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import FormModal from "./FormModal";

const Stock = () => {
  const [stocks, setStocks] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [loading, setLoading] = useState(false);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  // الحقول الخاصة بمخطط المخزون
  const stockFields = [
    {
      name: "farm",
      label: "المورد",
      type: "select",
      options: suppliers.map((supplier) => ({
        value: supplier._id,
        label: supplier.name,
      })),
    },

    { name: "dateReceived", label: "تاريخ الوصول", type: "date" },
    { name: "quantityReceived", label: "الكمية الواردة", type: "number" },
  ];

  // تحميل البيانات

  const fetchStock = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${apiUrl}/api/stock/current-stock`);
      const data = await res.json();
      if (data.success === false) {
        setLoading(false);
        console.log("المخزون:", data.message); // Debugging
        setStocks([]);
      }
      if (res.ok) {
        setLoading(false);
        console.log("المخزون:", data); // Debugging
        setStocks(data || []);
      }
    } catch (error) {
      console.error("حدث خطأ أثناء جلب المخزون:", error);
    }
  }, [apiUrl]);

  const fetchSuppliers = useCallback(async () => {
    try {
      const res = await fetch(`${apiUrl}/api/suppliers/getSuppliers`);
      const data = await res.json();
      if (data.success === false) {
        setLoading(false);
        console.log("الموردون:", data.message); // Debugging
        setSuppliers([]);
      }
      if (res.ok) {
        console.log("الموردون:", data.suppliers); // Debugging
        setSuppliers(data.suppliers || []);
      }
    } catch (error) {
      console.error("حدث خطأ أثناء جلب الموردين:", error);
    }
  }, [apiUrl]);

  useEffect(() => {
    fetchStock();
    fetchSuppliers();
  }, [fetchStock, fetchSuppliers]);

  // إضافة أو تعديل المخزون
  const handleAdd = () => {
    setEditData(null);
    setIsModalOpen(true);
  };

  const handleEdit = (stock) => {
    setEditData(stock);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    await axios.delete(`${apiUrl}/api/stock/delete/${id}`);
    fetchStock();
  };

  const handleSubmit = async (data) => {
    if (editData) {
      await axios.put(`${apiUrl}/api/stock/update/${editData._id}`, data);
    } else {
      await axios.post("http://localhost:5000/api/stock/add-stock", data);
    }
    fetchStock();
    setIsModalOpen(false);
  };

  if (loading) return <p>جاري التحميل...</p>;

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-xl font-semibold mb-4">المخزون</h2>
      <button
        onClick={handleAdd}
        className="bg-blue-500 text-white p-2 rounded mb-4"
      >
        إضافة طلب
      </button>
      <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md overflow-hidden">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2 text-center">المزرعة</th>
            <th className="p-2 text-center">الكمية الواردة</th>
            <th className="p-2 text-center">الكمية المتاحة</th>
            <th className="p-2 text-center">الكمية الموزعة</th>
            <th className="p-2 text-center">تاريخ الوصول</th>
            <th className="p-2 text-center">الإجراءات</th>
          </tr>
        </thead>
        <tbody>
          {stocks?.map((stock) => (
            <tr key={stock._id} className="text-center">
              <td className="p-2">{stock.farm?.name || "غير متاح"}</td>
              <td className="p-2">{stock.quantityReceived}</td>
              <td className="p-2">{stock.quantityAvailable}</td>
              <td className="p-2">{stock.quantityDistributed}</td>
              <td className="p-2">
                {new Date(stock.dateReceived).toLocaleDateString()}
              </td>
              <td className="p-2">
                <button
                  onClick={() => handleEdit(stock)}
                  className="bg-yellow-500 text-white p-1 rounded mr-2"
                >
                  تعديل
                </button>
                <button
                  onClick={() => handleDelete(stock._id)}
                  className="bg-red-500 text-white p-1 rounded"
                >
                  حذف
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <FormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        initialData={editData}
        fields={stockFields}
        suppliers={suppliers}
      />
    </div>
  );
};

export default Stock;
