"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";

const OrdersTable = ({ orders }) => {
  return (
    <table className="w-full text-left">
      <thead>
        <tr className="bg-gray-100">
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
          <th className="border border-gray-300 px-4 py-2">طباعة التوصيل</th>
        </tr>
      </thead>
      <tbody>
        {orders?.map((order) => (
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
            <td className="border border-gray-300 px-4 py-2">{order.status}</td>
            <td className="border border-gray-300 px-4 py-2">
              {order.paymentStatus}
            </td>
            <td>
              <Link href={`/receipts/جنيه{order._id}/print`}>
                <button className="px-6 py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 focus:outline-none focus:ring focus:ring-indigo-300">
                  طباعة التوصيل
                </button>
              </Link>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

const ReceiptComp = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const isAdmin = currentUser?.isAdmin;
  const isStaff = currentUser?.isStaff;

  useEffect(() => {
    fetchOrders();
  }, []);
  const fetchOrders = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(
        `${apiUrl}/api/orders/getOrders`
      );
      setOrders(data.orders || []);
    } catch (err) {
      setError("فشل في جلب البيانات.");
    } finally {
      setLoading(false);
    }
  };
  console.log(orders);

  if (loading) return <p>تحميل...</p>;

  return (
    <section className="my-6 bg-white p-4 rounded-lg shadow-lg">
      <div className="flex justify-between items-center w-full h-full">
        <h2 className="text-xl font-semibold mb-4">الطلبات الأخيرة</h2>
      </div>
      <div className="overflow-x-auto">
        {(isAdmin || isStaff) && <OrdersTable orders={orders} />}
      </div>
    </section>
  );
};

export default ReceiptComp;
