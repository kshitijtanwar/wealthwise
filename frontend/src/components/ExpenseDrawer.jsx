import React, { useState } from "react";
import {
    Drawer,
    Box,
    Typography,
    TextField,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Button,
    IconButton,
    InputAdornment,
    CircularProgress,
    Stack,
    Divider,
    Alert,
    Snackbar,
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import { expenseAPI } from "../services/api";

const ExpenseDrawer = ({ isOpen, onClose, onExpenseAdded }) => {
    const [formData, setFormData] = useState({
        amount: "",
        description: "",
        category: "",
        merchant: "",
        date: new Date().toISOString().split("T")[0],
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const [notification, setNotification] = useState({
        open: false,
        message: "",
        severity: "success", // success, error, warning, info
    });

    const categories = [
        "Food & Dining",
        "Groceries",
        "Transportation",
        "Gas & Fuel",
        "Shopping",
        "Entertainment",
        "Bills & Utilities",
        "Healthcare",
        "Medical",
        "Travel",
        "Education",
        "Home & Garden",
        "Personal Care",
        "Gifts & Donations",
        "Business Services",
        "Insurance",
        "Taxes",
        "Other",
    ];

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.amount || !formData.description || !formData.category) {
            setNotification({
                open: true,
                message: "Please fill in all required fields",
                severity: "error",
            });
            return;
        }

        setIsSubmitting(true);
        try {
            await expenseAPI.addExpense({
                amount: parseFloat(formData.amount),
                description: formData.description,
                category: formData.category,
                merchant: formData.merchant || undefined, // Only send if provided
                date: formData.date,
                source: "manual",
            });

            // Reset form after successful submission
            setFormData({
                amount: "",
                description: "",
                category: "",
                merchant: "",
                date: new Date().toISOString().split("T")[0],
            });

            setNotification({
                open: true,
                message: "Expense added successfully!",
                severity: "success",
            });

            // Call callback to refresh parent data if provided
            if (onExpenseAdded) {
                onExpenseAdded();
            }

            // Close drawer after a short delay to show success message
            setTimeout(() => {
                onClose();
            }, 1000);
        } catch (error) {
            console.error("Error submitting expense:", error);
            setNotification({
                open: true,
                message: "Failed to add expense. Please try again.",
                severity: "error",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Drawer
            anchor="right"
            open={isOpen}
            onClose={onClose}
            PaperProps={{
                sx: {
                    width: 400,
                    padding: 0,
                },
            }}
        >
            <Box
                sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                }}
            >
                {/* Header */}
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        p: 3,
                        borderBottom: 1,
                        borderColor: "divider",
                    }}
                >
                    <Typography variant="h6" component="h2">
                        Add New Expense
                    </Typography>
                    <IconButton
                        onClick={onClose}
                        disabled={isSubmitting}
                        size="small"
                    >
                        <CloseIcon />
                    </IconButton>
                </Box>

                {/* Form */}
                <Box sx={{ flex: 1, p: 3 }}>
                    <Box component="form" onSubmit={handleSubmit}>
                        <Stack spacing={3}>
                            <TextField
                                label="Amount"
                                name="amount"
                                type="number"
                                value={formData.amount}
                                onChange={handleInputChange}
                                placeholder="0.00"
                                inputProps={{
                                    step: "0.01",
                                    min: "0",
                                }}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            $
                                        </InputAdornment>
                                    ),
                                }}
                                required
                                disabled={isSubmitting}
                                fullWidth
                            />

                            <TextField
                                label="Description"
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                placeholder="Enter expense description"
                                required
                                disabled={isSubmitting}
                                fullWidth
                            />

                            <TextField
                                label="Merchant"
                                name="merchant"
                                value={formData.merchant}
                                onChange={handleInputChange}
                                placeholder="Store or merchant name (optional)"
                                disabled={isSubmitting}
                                fullWidth
                                helperText="Optional: Where did you make this purchase?"
                            />

                            <FormControl
                                fullWidth
                                required
                                disabled={isSubmitting}
                            >
                                <InputLabel>Category</InputLabel>
                                <Select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleInputChange}
                                    label="Category"
                                >
                                    {categories.map((category) => (
                                        <MenuItem
                                            key={category}
                                            value={category}
                                        >
                                            {category}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            <TextField
                                label="Date"
                                name="date"
                                type="date"
                                value={formData.date}
                                onChange={handleInputChange}
                                disabled={isSubmitting}
                                fullWidth
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />

                            <Box sx={{ mt: 4 }}>
                                <Stack direction="row" spacing={2}>
                                    <Button
                                        type="button"
                                        variant="outlined"
                                        onClick={onClose}
                                        disabled={isSubmitting}
                                        fullWidth
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        disabled={isSubmitting}
                                        fullWidth
                                        startIcon={
                                            isSubmitting ? (
                                                <CircularProgress
                                                    size={16}
                                                    color="inherit"
                                                />
                                            ) : null
                                        }
                                    >
                                        {isSubmitting
                                            ? "Adding..."
                                            : "Add Expense"}
                                    </Button>
                                </Stack>
                            </Box>
                        </Stack>
                    </Box>
                </Box>
            </Box>

            {/* Notification Snackbar */}
            <Snackbar
                open={notification.open}
                autoHideDuration={4000}
                onClose={() =>
                    setNotification({ ...notification, open: false })
                }
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
            >
                <Alert
                    onClose={() =>
                        setNotification({ ...notification, open: false })
                    }
                    severity={notification.severity}
                    sx={{ width: "100%" }}
                >
                    {notification.message}
                </Alert>
            </Snackbar>
        </Drawer>
    );
};

export default ExpenseDrawer;
