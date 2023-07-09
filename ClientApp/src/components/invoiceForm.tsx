import React, { useEffect, useState } from "react";
import Invoice from "../models/invoice";
import Select from "react-select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./invoiceForm.css";
import InvoiceStatus from "../models/invoiceStatus";
import { getUsers } from "../services/userService";
import User from "../models/user";

interface InvoiceFormProps {
    invoice?: Invoice;
    onSubmit: (invoice: Invoice) => void;
    onCancel: () => void;
}

const InvoiceForm: React.FC<InvoiceFormProps> = ({ invoice, onSubmit, onCancel }) => {
    const [formData, setFormData] = useState<Invoice>({
        id: '',
        userId: '',
        date: '',
        status: 0,
        item: '',
        amount: 0,
    });
    const [users, setUsers] = useState<User[]>([]);

    useEffect(() => {
        fetchUsers();
    }, []);

    useEffect(() => {
        if (invoice) {
            setFormData((prevFormData) => ({
                ...prevFormData,
                ...invoice,
                user: invoice?.user ? { ...prevFormData.user, ...(invoice?.user || {}) } : undefined,
            }));
        } else {
            setFormData({
                id: '',
                userId: '',
                date: '',
                status: 0,
                item: '',
                amount: 0,
            });
        }
    }, [invoice]);

    const fetchUsers = async () => {
        try {
            const usersData = await getUsers();
            setUsers(usersData);
        } catch (error) {
            console.log(error);
        }
    };

    const usersOptions = users.map((user) => ({
        value: user.id,
        label: user.name
    }));

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSelectChange = (selectedOption: any) => {
        setFormData({
            ...formData,
            userId: selectedOption.value,
        });
    };

    const statusOptions = Object.keys(InvoiceStatus).filter(value => isNaN(Number(value)) === false).map(statusKey => ({
        value: statusKey,
        label: InvoiceStatus[+statusKey].charAt(0).toUpperCase() + InvoiceStatus[+statusKey].slice(1)
    }));

    const handleStatusChange = (selectedOption: any) => {
        setFormData({
            ...formData,
            status: parseInt(selectedOption.value),
        });
    };

    const handleDateChange = (date: any) => {
        setFormData({
            ...formData,
            date: date.toISOString(),
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <div className="invoice-form-container">
            <h2>{invoice ? "Edit Invoice" : "Create New Invoice"}</h2>
            <form onSubmit={handleSubmit}>
                <label>
                    <span className="title">Bill To:</span>
                    <Select
                        options={usersOptions}
                        value={usersOptions.find((option) => option.value === formData.userId)}
                        onChange={handleSelectChange}
                    />
                </label>
                <label>
                    <span className="title">Date:</span>
                    <DatePicker
                        selected={formData.date ? new Date(formData.date) : null}
                        onChange={handleDateChange}
                    />
                </label>
                <label>
                    <span className="title">Status:</span>
                    <Select
                        options={statusOptions}
                        value={statusOptions.find((option) => option.value === formData.status.toString())}
                        onChange={handleStatusChange}
                    />
                </label>
                <label>
                    <span className="title">Item name:</span>
                    <input
                        name="item"
                        value={formData.item}
                        onChange={handleChange}
                    />
                </label>
                <label>
                    <span className="title">Amount:</span>
                    <input
                        type="number"
                        name="amount"
                        value={formData.amount}
                        onChange={handleChange}
                    />
                </label>
                <div className="form-buttons">
                    <button className="save-button" type="submit">
                        Save
                    </button>
                    <button className="cancel-button" type="button" onClick={onCancel}>
                        Back
                    </button>
                </div>
            </form>
        </div>
    );
};

export default InvoiceForm;
