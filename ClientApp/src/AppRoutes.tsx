import React from "react";
import { Route, Routes } from "react-router-dom";

import InvoiceList from "./components/invoicesList";
import InvoiceForm from "./components/invoiceForm";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<InvoiceList />} />
      <Route path="/invoices" element={<InvoiceList />} />
      <Route path="/invoices/new" element={<InvoiceForm onCancel={() => {}} onSubmit={() => {}} />} />
      <Route path="/invoices/:id" element={<InvoiceForm onCancel={() => {}} onSubmit={() => {}} />} />
    </Routes>
  );
};

export default AppRoutes;