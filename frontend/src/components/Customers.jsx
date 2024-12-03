import React, { useState, useEffect } from "react";
import axios from "axios";
import FormModal from "./FormModal";

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [orderModalOpen, setOrderModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const customerFields = [
    { name: "name", label: "الاسم" },
    { name: "address", label: "العنوان" },
    { name: "contact", label: "التواصل" },
  ];

  useEffect(() => {
    fetchCustomers();
    fetchSuppliers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const res = await fetch(
        "http://localhost:5000/api/customers/getCustomers"
      );
      const data = await res.json();
      setCustomers(data.customers || []);
    } catch (error) {
      console.error("Error fetching customers:", error);
    }
  };

  const fetchSuppliers = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/suppliers");
      const data = await res.json();
      setSuppliers(data.suppliers || []);
    } catch (error) {
      console.error("Error fetching suppliers:", error);
    }
  };

  const handleAdd = () => {
    setEditData(null);
    setIsModalOpen(true);
  };

  const handleEdit = (customer) => {
    setEditData(customer);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:5000/api/customers/delete/${id}`);
    fetchCustomers();
  };

  const handleSubmit = async (data) => {
    if (editData) {
      await axios.put(
        `http://localhost:5000/api/customers/update/${editData._id}`,
        data
      );
    } else {
      await axios.post(
        "http://localhost:5000/api/customers/registerCustomer",
        data
      );
    }
    fetchCustomers();
    setIsModalOpen(false);
  };

  return (
    <div className="p-5 rtl text-right">
      <h2 className="text-xl font-bold mb-5">العملاء</h2>
      <button
        onClick={handleAdd}
        className="bg-blue-500 text-white py-2 px-4 rounded mb-5"
      >
        إضافة عميل
      </button>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2">الاسم</th>
              <th className="border p-2">العنوان</th>
              <th className="border p-2">التواصل</th>
              <th className="border p-2">الطلبات</th>
              <th className="border p-2">الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer) => (
              <tr key={customer._id}>
                <td className="border p-2">{customer.name}</td>
                <td className="border p-2">{customer.address}</td>
                <td className="border p-2">{customer.contact}</td>
                <td className="border p-2">
                  <ul className="list-disc pl-5">
                    {customer.orders.map((order, index) => (
                      <li key={index}>
                        {order.date} - {order.quantity} - {order.totalCost} -{" "}
                        {order.status} - {order.paymentStatus}
                      </li>
                    ))}
                  </ul>
                </td>
                <td className="border p-2">
                  <button
                    onClick={() => handleEdit(customer)}
                    className="bg-yellow-500 text-white py-1 px-3 rounded mr-2"
                  >
                    تعديل
                  </button>
                  <button
                    onClick={() => handleDelete(customer._id)}
                    className="bg-red-500 text-white py-1 px-3 rounded mr-2"
                  >
                    حذف
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <FormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        initialData={editData}
        fields={customerFields}
      />
      {selectedCustomer && (
        <FormModal
          isOpen={orderModalOpen}
          onClose={() => setOrderModalOpen(false)}
          onSubmit={handleOrderSubmit}
          initialData={{
            date: "",
            quantity: 0,
            unitPrice: 0,
            totalCost: 0,
            status: "معلق",
            paymentStatus: "غير مدفوع",
          }}
          fields={orderFields}
        />
      )}
    </div>
  );
};

export default Customers;
