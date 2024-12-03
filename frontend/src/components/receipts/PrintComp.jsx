"use client";

import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const PrintComp = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    if (typeof window !== "undefined") {
      const getOrder = async () => {
        try {
          const res = await fetch(`${apiUrl}/api/orders/${id}`);
          const data = await res.json();

          if (!res.ok) {
            throw new Error(data.message || "Failed to fetch Order data");
          }

          setOrder(data);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };
      if (id) {
        getOrder();
      }
    }
  }, [id]);

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  return (
    <div className="min-h-screen p-6 flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-3xl bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-2xl font-bold text-center text-indigo-600 mb-6">
          تفاصيل الطلب
        </h1>

        {loading && <p className="text-center text-gray-500">تحميل...</p>}

        {error && <p className="text-center text-red-500">{error}</p>}

        {order && (
          <>
            <div className="mb-4">
              <p className="text-center text-gray-700">
                <span className="font-semibold">كود الطلب:</span>{" "}
                {order.orderCode}
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border border-gray-200 text-sm text-left">
                <thead>
                  <tr className="bg-gray-100 text-gray-700">
                    <th className="border border-gray-300 px-4 py-2">المورد</th>
                    <th className="border border-gray-300 px-4 py-2">العميل</th>
                    <th className="border border-gray-300 px-4 py-2">
                      التاريخ
                    </th>
                    <th className="border border-gray-300 px-4 py-2">الكمية</th>
                    <th className="border border-gray-300 px-4 py-2">
                      سعر الوحدة
                    </th>
                    <th className="border border-gray-300 px-4 py-2">
                      التكلفة الإجمالية
                    </th>
                    <th className="border border-gray-300 px-4 py-2">الحالة</th>
                    <th className="border border-gray-300 px-4 py-2">
                      حالة الدفع
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b hover:bg-gray-50">
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
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="flex justify-center mt-6">
              <button
                onClick={handlePrint}
                className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow hover:bg-indigo-700 focus:outline-none focus:ring focus:ring-indigo-300"
              >
                طباعة الطلب
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PrintComp;
