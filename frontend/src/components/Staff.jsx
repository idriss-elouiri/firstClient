import React, { useState, useEffect } from "react";
import axios from "axios";
import FormModal from "./FormModal";

const Staffs = () => {
  const [staffs, setStaffs] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const customerFields = [
    { name: "nameStaff", label: "الاسم" },
    { name: "passwordStaff", label: "كلمة السر" },
    { name: "address", label: "العنوان" },
    { name: "contact", label: "التواصل" },
  ];

  useEffect(() => {
    fetchStaffs();
  }, []);
  const fetchStaffs = async () => {
    try {
      const res = await fetch(`${apiUrl}/api/hrm/getStaffs`, {
        method: "GET",
        credentials: "include",
      });
      const data = await res.json();
      setStaffs(data.staffs || []);
    } catch (error) {
      console.error("Error fetching staffs:", error);
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
    await axios.delete(`${apiUrl}/api/user/adminDeleteStaff/${id}`);
    fetchStaffs();
  };

  const handleSubmit = async (data) => {
    if (editData) {
      await axios.put(
        `${apiUrl}/api/user/adminUpdateStaff/${editData._id}`,
        data
      );
    } else {
      await axios.post(`${apiUrl}/api/hrm/registerStaff`, data);
    }
    fetchStaffs();
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
            </tr>
          </thead>
          <tbody>
            {staffs.map((staff) => (
              <tr key={staff._id}>
                <td className="border p-2">{staff.nameStaff}</td>
                <td className="border p-2">{staff.address}</td>
                <td className="border p-2">{staff.contact}</td>
                <td className="border p-2">
                  <button
                    onClick={() => handleEdit(staff)}
                    className="bg-yellow-500 text-white py-1 px-3 rounded mr-2"
                  >
                    تعديل
                  </button>
                  <button
                    onClick={() => handleDelete(staff._id)}
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
    </div>
  );
};

export default Staffs;
