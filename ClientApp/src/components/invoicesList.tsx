import React, { useState, useEffect, useRef } from "react";
import { getInvoices, deleteInvoice, createInvoice, updateInvoice } from "../services/invoiceService";
import Invoice from "../models/invoice";
import "./invoiceList.css";
import InvoiceStatus from "../models/invoiceStatus";
import { faEdit, faEllipsisV, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import InvoiceForm from "./invoiceForm";
import { v4 as uuid } from 'uuid';
import LoadingIndicator from "./loadingIndicator";

const InvoiceList: React.FC = () => {
    const [isLoading, setIsLoading] = useState(false);
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
        setIsLoading(true);
        try {
            const invoicesData = await getInvoices();
            setInvoices((prevInvoices) => [...prevInvoices, ...invoicesData]);
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleScroll = () => {
        if (
            window.innerHeight + document.documentElement.scrollTop !==
            document.documentElement.offsetHeight
        ) {
            return;
        }
    };

    useEffect(() => {
        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

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
        setIsLoading(true);
        try {
            const isDeleted = await deleteInvoice(invoiceId);
            if (isDeleted) {
                setInvoices((prevInvoices) =>
                    prevInvoices.filter((prevInvoice) =>
                        prevInvoice.id !== invoiceId
                    )
                );
            } else {
                console.log('Error while deleting invoice', invoiceId);
            }
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
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
        closeAddInvoicePopup();
        setIsLoading(true);
        try {
            invoice.id = uuid();
            const createdInvoice = await createInvoice(invoice);
            setInvoices((prevInvoices) => [...prevInvoices, createdInvoice]);
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
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
        closeAddInvoicePopup();
        if (!invoice) {
            console.log("can't edit empty invoice");
            return;
        }

        setIsLoading(true);
        try {
            const updatedInvoice = await updateInvoice(invoice);
            setInvoices((prevInvoices) =>
                prevInvoices.map((prevInvoice) =>
                    prevInvoice.id === updatedInvoice.id
                        ? { ...prevInvoice, ...updatedInvoice, user: prevInvoice.user }
                        : prevInvoice
                )
            );
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    };

    const addInvoice = () => {
        setInvoiceEditMode(undefined);
        setIsEditMode(false);
        setIsAddInvoicePopupOpen(true)
    }

    return (
        <div className="invoice-list-container">
            <h1>Invoices</h1>
            <p>Total Invoices: {invoices.length}</p>
            <div className="button-container">
                <button className="add-invoice-button" onClick={() => addInvoice()}>
                    <span className="add-invoice-icon">+</span> Add New Invoice
                </button>
            </div>
            <div>
                {isLoading ? (
                    <LoadingIndicator />
                ) : (
                    invoices.length > 0 ? (
                        <ul className="invoice-list">
                            {invoices.map((invoice) => (
                                <li key={invoice.id} className="invoice-item">
                                    <div className={`invoice-card ${InvoiceStatus[invoice.status as number].toLowerCase()}`}>
                                        {/* <div className="invoice-options">
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
                                    </div> */}
                                        <div className="options-wrapper">
                                            <button
                                                className="popup-option"
                                                onClick={() => handleDeleteInvoice(invoice.id)}
                                            >
                                                <FontAwesomeIcon icon={faTrashAlt} className="popup-icon" />
                                            </button>
                                            <button
                                                className="popup-option"
                                                onClick={() => handleEditInvoice(invoice)}
                                            >
                                                <FontAwesomeIcon icon={faEdit} className="popup-icon" />
                                            </button>
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
                    ) : (
                        <div>
                            <span className="no-invoices">Sorry! No Invoices found :(</span>
                            <span className="no-invoices-button">please start by clicking on Add new invoice button</span>
                        </div>
                    )
                )}
            </div>
            <div className={`invoice-popup ${isAddInvoicePopupOpen ? "open" : ""}`}>
                <div className="invoice-popup-content">
                    <InvoiceForm invoice={isEditMode ? invoiceEditMode : undefined} onCancel={closeAddInvoicePopup} onSubmit={isEditMode ? editInvoice : handleAddInvoice} />
                </div>
            </div>
        </div>
    );
};

export default InvoiceList;
