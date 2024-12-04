import Link from "next/link";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import {
  FaTachometerAlt,
  FaUsers,
  FaBoxOpen,
  FaClipboardList,
  FaReceipt,
  FaSupple,
} from "react-icons/fa";
import { MdPeople } from "react-icons/md"; // HRM Icon

const Sidebar = ({ showNav, onClose }) => {
  const { currentUser } = useSelector((state) => state.user);
  const isAdmin = currentUser?.isAdmin;
  const isStaff = currentUser?.isStaff;

  // State to toggle children visibility
  const [showCustomerSubmenu, setShowCustomerSubmenu] = useState(false);
  const [showSuppliberSubmenu, setShowSuppliberSubmenu] = useState(false);

  const toggleCustomerSubmenu = () => {
    setShowCustomerSubmenu((prev) => !prev);
  };
  const toggleSupplierSubmenu = () => {
    setShowSuppliberSubmenu((prev) => !prev);
  };

  return (
    <aside
      className={`fixed lg:relative z-50 lg:z-auto ${
        showNav ? "translate-x-0" : "-translate-x-full"
      } transform transition-transform duration-300 ease-in-out bg-indigo-600 text-white min-h-screen w-64 p-4`}
    >
      {/* Close Button for Small Screens */}
      <button
        className="lg:hidden text-white text-2xl mb-4 focus:outline-none"
        onClick={onClose}
        aria-label="Close Sidebar"
      >
        &times;
      </button>
      <div className="flex items-center mb-8 gap-2">
        <h2 className="text-xl font-semibold">النظام</h2>
      </div>
      <nav className="space-y-4">
        {/* Main Menu */}
        {(isAdmin || isStaff) && (
          <Link
            href="/dashboard"
            className="flex items-center block p-2 rounded hover:bg-indigo-700"
          >
            <FaTachometerAlt className="mr-2" />
            لوحة التحكم
          </Link>
        )}
        {isAdmin && (
          <Link
            href="/hrm"
            className="flex items-center block p-2 rounded hover:bg-indigo-700"
          >
            <MdPeople className="mr-2" />
            قسم التوظيف
          </Link>
        )}

        {/* Supplier Management */}
        {(isAdmin || isStaff) && (
          <div>
            <button
              onClick={toggleCustomerSubmenu}
              className="flex items-center justify-between block p-2 rounded hover:bg-indigo-700 w-full text-left"
            >
              <span className="flex items-center">
                <FaSupple className="mr-2" />
                إدارة الموردين (المزارع)
              </span>
              <span>{showCustomerSubmenu ? "−" : "+"}</span>
            </button>
            {showCustomerSubmenu && (
              <div className="ml-6 mt-2 space-y-2">
                <Link
                  href="/supplierPage"
                  className="block p-2 rounded hover:bg-indigo-700"
                >
                  تسجيل بيانات الموردين
                </Link>
                <Link
                  href="/orderSupplierPage"
                  className="block p-2 rounded hover:bg-indigo-700"
                >
                  انشاء الطلبات من المزارع
                </Link>
                <Link
                  href="/SupplierCostsPage"
                  className="block p-2 rounded hover:bg-indigo-700"
                >
                  تتبع التكاليف الاخري للمزرعة
                </Link>
                <Link
                  href="/stockPage"
                  className="block p-2 rounded hover:bg-indigo-700"
                >
                  المخزون لكل مزرعة
                </Link>
              </div>
            )}
          </div>
        )}

        {/* Customer Management */}
        {(isAdmin || isStaff) && (
          <div>
            <button
              onClick={toggleSupplierSubmenu}
              className="flex items-center justify-between block p-2 rounded hover:bg-indigo-700 w-full text-left"
            >
              <span className="flex items-center">
                <FaUsers className="mr-2" />
                إدارة المحلات (العملاء)
              </span>
              <span>{showSuppliberSubmenu ? "−" : "+"}</span>
            </button>
            {showSuppliberSubmenu && (
              <div className="ml-6 mt-2 space-y-2">
                <Link
                  href="/customerPage"
                  className="block p-2 rounded hover:bg-indigo-700"
                >
                  تسجيل بيانات المحلات
                </Link>
                <Link
                  href="/orderCustomerPage"
                  className="block p-2 rounded hover:bg-indigo-700"
                >
                  إنشاء طلبات توزيع الدجاج
                </Link>
                <Link
                  href="/CustomerCostsPage"
                  className="block p-2 rounded hover:bg-indigo-700"
                >
                  تتبع التكاليف الاخري للدجاج
                </Link>
                <Link
                  href="/DistributionManagementPage"
                  className="block p-2 rounded hover:bg-indigo-700"
                >
                  تتبع طلبات توزيع الدجاج
                </Link>
              </div>
            )}
          </div>
        )}

        {/* Printing Section */}
        <Link
          href="/receipts"
          className="flex items-center block p-2 rounded hover:bg-indigo-700"
        >
          <FaReceipt className="mr-2" />
          قسم الطباعة
        </Link>
      </nav>
    </aside>
  );
};

export default Sidebar;
