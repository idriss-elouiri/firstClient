import React, { useState, useEffect } from "react";
import axios from "axios";
import FormModal from "./FormModal";

const Expenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const expenseFields = [
    { name: "type", label: "Type" },
    { name: "amount", label: "Amount", type: "number" },
    { name: "description", label: "Description" },
    { name: "date", label: "Date", type: "date" },
  ];

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:5000/api/expenses/get");
      const data = await res.json();
      if (!data.success) {
        setError(data.message);
        setLoading(false);
      }
      setLoading(false);
      setExpenses(data.expenses);
    } catch (error) {
      setError(error);
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditData(null);
    setIsModalOpen(true);
  };

  const handleEdit = (expense) => {
    setEditData(expense);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:5000/api/expenses/delete/${id}`);
    fetchExpenses();
  };

  const handleSubmit = async (data) => {
    if (editData) {
      await axios.put(
        `http://localhost:5000/api/expenses/update/${editData._id}`,
        data
      );
    } else {
      await axios.post("http://localhost:5000/api/expenses/create", data);
    }
    fetchExpenses();
    setIsModalOpen(false);
  };

  return (
    <div>
      <h2>Expenses</h2>
      <button onClick={handleAdd}>Add Expense</button>
      <table>
        <thead>
          <tr>
            <th>Type</th>
            <th>Amount</th>
            <th>Description</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {expenses?.map((expense) => (
            <tr key={expense._id}>
              <td>{expense.type}</td>
              <td>${expense.amount}</td>
              <td>{expense.description}</td>
              <td>{new Date(expense.date).toLocaleDateString()}</td>
              <td>
                <button onClick={() => handleEdit(expense)}>Edit</button>
                <button onClick={() => handleDelete(expense._id)}>
                  Delete
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
        fields={expenseFields}
      />
    </div>
  );
};

export default Expenses;
