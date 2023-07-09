import React, { useState, useEffect, useRef } from "react";
import { getInvoices, deleteInvoice, createInvoice, updateInvoice } from "../services/invoiceService";
import Invoice from "../models/invoice";
import "./invoiceList.css";
import InvoiceStatus from "../models/invoiceStatus";
import { faEllipsisV } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import InvoiceForm from "./invoiceForm";
import { v4 as uuid } from 'uuid';

const InvoiceList: React.FC = () => {
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [selectedInvoice, setSelectedInvoice] = useState<string | null>(null);
    const [isAddInvoicePopupOpen, setIsAddInvoicePopupOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [invoiceEditMode, setInvoiceEditMode] = useState<Invoice>();
    const popupRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    useEffect(() => {
        fetchInvoices();
    }, []);

    const fetchInvoices = async () => {
        try {
            const invoicesData = await getInvoices();
            setInvoices(invoicesData);
        } catch (error) {
            console.log(error);
        }
    };

    const handleOptionsClick = (invoiceId?: string) => {
        if (invoiceId !== undefined) {
            setSelectedInvoice(invoiceId);
        }
    };

    const handleClickOutside = (event: MouseEvent) => {
        if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
            setSelectedInvoice(null);
        }
    };

    const handleDeleteInvoice = async (invoiceId?: string) => {
        if (!invoiceId) {
            console.log("can't delete invoice with id 0");
            return;
        }
        try {
            await deleteInvoice(invoiceId);
            fetchInvoices();
        } catch (error) {
            console.log(error);
        }
    };

    const closeAddInvoicePopup = () => {
        setIsAddInvoicePopupOpen(false);
        setTimeout(() => {
            setIsEditMode(false);
            setInvoiceEditMode(undefined);
        }, 200); // waiting for animation
    };

    const handleAddInvoice = async (invoice: Invoice) => {
        try {
            invoice.id = uuid();
            await createInvoice(invoice);
            fetchInvoices();
            closeAddInvoicePopup();
        } catch (error) {
            console.log(error);
        }
    };

    const handleEditInvoice = (invoice: Invoice) => {
        setInvoiceEditMode({
            ...invoice,
            status: invoice.status.toString(),
        });
        setIsEditMode(true);
        setIsAddInvoicePopupOpen(true);
    };

    const editInvoice = async (invoice: Invoice) => {
        if (!invoice) {
            console.log("can't edit empty invoice");
            return;
        }

        try {
            const updatedInvoice = await updateInvoice(invoice);
            setInvoices((prevInvoices) =>
                prevInvoices.map((prevInvoice) =>
                    prevInvoice.id === updatedInvoice.id
                        ? { ...prevInvoice, ...updatedInvoice, user: prevInvoice.user }
                        : prevInvoice
                )
            );
            closeAddInvoicePopup();
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="invoice-list-container">
            <h1>Invoices</h1>
            <p>Total Invoices: {invoices.length}</p>
            <div className="button-container">
                <button className="add-invoice-button" onClick={() => setIsAddInvoicePopupOpen(true)}>
                    <span className="add-invoice-icon">+</span> Add New Invoice
                </button>
            </div>
            <ul className="invoice-list">
                {invoices.map((invoice) => (
                    <li key={invoice.id} className="invoice-item">
                        <div className="invoice-card">
                            <div className="invoice-options">
                                <button
                                    className="option-button"
                                    onClick={() => handleOptionsClick(invoice.id)}
                                >
                                    <div className="option-square">
                                        <FontAwesomeIcon icon={faEllipsisV} className="option-icon" />
                                    </div>
                                </button>
                                {selectedInvoice === invoice.id && (
                                    <div className="options-popup" ref={popupRef}>
                                        <button
                                            className="popup-option"
                                            onClick={() => handleDeleteInvoice(invoice.id)}
                                        >
                                            Delete
                                        </button>
                                        <button
                                            className="popup-option"
                                            onClick={() => handleEditInvoice(invoice)}>
                                            Edit
                                        </button>
                                    </div>
                                )}
                            </div>
                            <div>
                                <span className="invoice-header">Bill To:</span>
                                <span className="invoice-content">{invoice.user?.name}</span>
                            </div>
                            <div>
                                <span className="invoice-header">Date:</span>
                                <span className="invoice-content">{invoice.date.substring(0, 10)}</span>
                            </div>
                            <div>
                                <span className="invoice-header">Status:</span>
                                <span className="invoice-content">
                                    {InvoiceStatus[invoice.status as number]}
                                </span>
                            </div>
                            <div>
                                <span className="invoice-header">Item Name:</span>
                                <span className="invoice-content">{invoice.item}</span>
                            </div>
                            <div>
                                <span className="invoice-header">Amount:</span>
                                <span className="invoice-content">{invoice.amount}</span>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
            <div className={`invoice-popup ${isAddInvoicePopupOpen ? "open" : ""}`}>
                <div className="invoice-popup-content">
                    <InvoiceForm invoice={isEditMode ? invoiceEditMode : undefined} onCancel={closeAddInvoicePopup} onSubmit={isEditMode ? editInvoice : handleAddInvoice} />
                </div>
            </div>
        </div>
    );
};

export default InvoiceList;
