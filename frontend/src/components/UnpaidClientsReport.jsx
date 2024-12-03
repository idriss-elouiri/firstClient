import React, { useEffect, useState } from "react";
import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  CircularProgress,
  Alert,
  AlertTitle,
  Button,
  Typography,
} from "@mui/material";
import axios from "axios";

const UnpaidClientsReport = () => {
  const [loading, setLoading] = useState(false);
  const [clients, setClients] = useState([]);
  const [error, setError] = useState(null);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const [currentPage, setCurrentPage] = useState(1); // Current page
  const itemsPerPage = 10; // Items per page

  useEffect(() => {
    fetchUnpaidClients();
  }, []);

  const fetchUnpaidClients = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${apiUrl}/api/report/unpaid-clients`);
      // Formatting the data for the table
      const formattedClients = response.data.map((item) => {
        const source = item.source || {};
        return {
          _id: item._id,
          name: source.name || "غير معروف",
          totalCost: item.totalCost || 0,
          contact: source.contact || "غير متوفر",
        };
      });
      setClients(formattedClients);
    } catch (err) {
      setError("حدث خطأ أثناء جلب البيانات. حاول مرة أخرى لاحقًا.");
    } finally {
      setLoading(false);
    }
  };

  // Data pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentClients = clients.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(clients.length / itemsPerPage);

  return (
    <div className="p-4">
      <Typography variant="h4" gutterBottom>
        تقرير العملاء غير المسددين
      </Typography>
      {loading && <CircularProgress />}
      {error && (
        <Alert severity="error" className="mb-4">
          <AlertTitle>خطأ</AlertTitle>
          {error}
        </Alert>
      )}
      {!loading && !error && clients.length === 0 && (
        <Alert severity="info" className="mb-4">
          لا يوجد عملاء غير مسددين حاليًا.
        </Alert>
      )}
      {!loading && !error && clients.length > 0 && (
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>اسم العميل</TableCell>
                <TableCell>المبلغ المستحق</TableCell>
                <TableCell>رقم الهاتف</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {currentClients.map((client) => (
                <TableRow key={client._id}>
                  <TableCell>{client.name}</TableCell>
                  <TableCell>{client.totalCost}</TableCell>
                  <TableCell>{client.contact}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      {/* Pagination controls */}
      {clients.length > itemsPerPage && (
        <div className="flex justify-between mt-4">
          <Button
            variant="contained"
            color="primary"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            السابق
          </Button>
          <Typography>
            الصفحة {currentPage} من {totalPages}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
          >
            التالي
          </Button>
        </div>
      )}
    </div>
  );
};

export default UnpaidClientsReport;
