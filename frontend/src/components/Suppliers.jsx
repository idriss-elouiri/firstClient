"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import FormModal from "./FormModal";

const Suppliers = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const supplierFields = [
    { name: "name", label: "الاسم" },
    { name: "location", label: "الموقع" },
    { name: "contact", label: "التواصل" },
    { name: "email", label: "البريد الإلكتروني" },
  ];

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${apiUrl}/api/suppliers/getSuppliers`);
        const data = await res.json();

        if (data.success === false) {
          setError(data.message);
          setLoading(false);
          return;
        }
        console.log(data);
        setSuppliers(data.suppliers);
        setError(null);
      } catch (err) {
        setError("فشل في جلب الموردين. يرجى المحاولة مرة أخرى لاحقًا.");
      } finally {
        setLoading(false);
      }
    };
    fetchSuppliers();
  }, [apiUrl]);

  const handleAdd = () => {
    setEditData(null);
    setIsModalOpen(true);
  };

  const handleEdit = (supplier) => {
    setEditData(supplier);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${apiUrl}/api/suppliers/delete/${id}`);
      fetchSuppliers();
    } catch (err) {
      setError("فشل في حذف المورد. يرجى المحاولة مرة أخرى.");
    }
  };

  const handleSubmit = async (data) => {
    try {
      if (editData) {
        await axios.put(`${apiUrl}/api/suppliers/update/${editData._id}`, data);
      } else {
        await axios.post(`${apiUrl}/api/suppliers/create`, data);
      }
      fetchSuppliers();
      setIsModalOpen(false);
    } catch (err) {
      setError("فشل في حفظ المورد. يرجى المحاولة مرة أخرى.");
    }
  };

  return (
    <div className="p-6 space-y-6">
      <header className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-800">الموردون</h2>
        <button
          onClick={handleAdd}
          className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 focus:outline-none focus:ring focus:ring-indigo-300"
          aria-label="إضافة مورد جديد"
        >
          إضافة مورد
        </button>
      </header>

      {loading && (
        <p className="text-gray-500 text-center">جاري تحميل الموردين...</p>
      )}
      {error && (
        <p className="text-red-500 text-center" role="alert">
          {error}
        </p>
      )}

      <section className="overflow-x-auto">
        <table className="min-w-full bg-white shadow rounded-lg">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-4 py-2 text-left font-medium text-gray-600">
                الاسم
              </th>
              <th className="px-4 py-2 text-left font-medium text-gray-600">
                الموقع
              </th>
              <th className="px-4 py-2 text-left font-medium text-gray-600">
                التواصل
              </th>
              <th className="px-4 py-2 text-left font-medium text-gray-600">
                البريد الإلكتروني
              </th>
              <th className="px-4 py-2 text-left font-medium text-gray-600">
                الإجراءات
              </th>
            </tr>
          </thead>
          <tbody>
            {suppliers.map((supplier) => (
              <tr key={supplier._id} className="hover:bg-gray-100">
                <td className="px-4 py-2">{supplier.name}</td>
                <td className="px-4 py-2">{supplier.location}</td>
                <td className="px-4 py-2">{supplier.contact}</td>
                <td className="px-4 py-2">{supplier.email}</td>

                <td className="px-4 py-2 space-x-2">
                  <button
                    onClick={() => handleEdit(supplier)}
                    className="px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 focus:outline-none focus:ring focus:ring-yellow-300"
                    aria-label={`تعديل المورد ${supplier.name}`}
                  >
                    تعديل
                  </button>
                  <button
                    onClick={() => handleDelete(supplier._id)}
                    className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 focus:outline-none focus:ring focus:ring-red-300"
                    aria-label={`حذف المورد ${supplier.name}`}
                  >
                    حذف
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <FormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        initialData={editData}
        fields={supplierFields}
      />
    </div>
  );
};

export default Suppliers;
