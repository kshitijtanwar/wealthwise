import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

import {
    Container,
    Grid,
    TextField,
    Typography,
    Button,
    Paper,
    Box,
    Alert,
    AlertTitle,
    LinearProgress,
    Divider,
    Chip,
    IconButton,
} from "@mui/material";

import {
    AccountBalanceWallet,
    Savings,
    Receipt,
    Category,
    Settings as SettingsIcon,
    TrendingUp,
    Calculate,
    Info,
    CheckCircle,
    Warning,
} from "@mui/icons-material";

import { useAuth } from "../../hooks/useAuth";
import { budgetAPI } from "../../services/api";
import { useNavigate } from "react-router-dom";

const Settings = () => {
    const { user, checkAuthStatus } = useAuth();
    const navigate = useNavigate();
    const [isCalculating, setIsCalculating] = useState(false);

    const {
        register,
        formState: { errors, isSubmitting },
        handleSubmit,
        watch,
        setValue,
        getValues,
    } = useForm({
        defaultValues: {
            salary: user?.salary || "",
            savings: user?.breakdown?.savings || "",
            expenses: user?.breakdown?.expenses || "",
            misc: user?.breakdown?.misc || "",
        },
    });

    // Watch form values for real-time calculations
    const watchedSalary = watch("salary");
    const watchedSavings = watch("savings");
    const watchedExpenses = watch("expenses");
    const watchedMisc = watch("misc");

    const currentSalary = Number(watchedSalary) || 0;
    const currentSavings = Number(watchedSavings) || 0;
    const currentExpenses = Number(watchedExpenses) || 0;
    const currentMisc = Number(watchedMisc) || 0;

    const totalAllocated = currentSavings + currentExpenses + currentMisc;
    const remaining = currentSalary - totalAllocated;
    const isValid = currentSalary > 0 && totalAllocated === currentSalary;

    useEffect(() => {
        // Update form defaults when user data changes
        if (user) {
            setValue("salary", user.salary || "");
            setValue("savings", user.breakdown?.savings || "");
            setValue("expenses", user.breakdown?.expenses || "");
            setValue("misc", user.breakdown?.misc || "");
        }
    }, [user, setValue]);

    const handleOnSubmit = async (data) => {
        try {
            await budgetAPI.setSalaryBreakdown(data);
            await checkAuthStatus();
            toast.success("💰 Salary breakdown saved successfully!");

            // Navigate after a short delay to show the success message
            setTimeout(() => {
                navigate("/dashboard");
            }, 1500);
        } catch (error) {
            console.error(error);
            toast.error("Failed to save salary breakdown. Please try again.");
        }
    };

    const handleAutoCalculate = () => {
        const salary = Number(getValues("salary"));
        if (!salary || salary <= 0) {
            toast.error("Please enter your salary first");
            return;
        }

        setIsCalculating(true);

        // Simulate calculation delay for better UX
        setTimeout(() => {
            // Smart allocation based on 50-30-20 rule (modified)
            const suggestedSavings = Math.round(salary * 0.3); // 30% savings
            const suggestedExpenses = Math.round(salary * 0.6); // 60% expenses
            const suggestedMisc = salary - suggestedSavings - suggestedExpenses; // Remaining

            setValue("savings", suggestedSavings);
            setValue("expenses", suggestedExpenses);
            setValue("misc", suggestedMisc);

            setIsCalculating(false);
            toast.success(
                "💡 Smart allocation calculated based on 60-30-10 rule!"
            );
        }, 1000);
    };

    return (
        <Container maxWidth={false} sx={{ mt: 4, px: 4 }}>
            {/* Header */}
            <Paper
                sx={{
                    p: 4,
                    mb: 4,
                    borderRadius: 3,
                    background:
                        "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    color: "white",
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                    }}
                >
                    <Box>
                        <Typography variant="h3" gutterBottom fontWeight="bold">
                            ⚙️ Financial Settings
                        </Typography>
                        <Typography variant="h6" sx={{ opacity: 0.9 }}>
                            Configure your salary and monthly breakdown
                        </Typography>
                    </Box>
                    <SettingsIcon sx={{ fontSize: 80, opacity: 0.7 }} />
                </Box>
            </Paper>

            <div className="row g-4">
                {/* Left Column - Form */}
                <div className="col-12 col-lg-8">
                    <Paper sx={{ p: 4, borderRadius: 3, boxShadow: 4 }}>
                        <Typography
                            variant="h5"
                            gutterBottom
                            fontWeight="bold"
                            sx={{ mb: 3 }}
                        >
                            💰 Salary & Budget Configuration
                        </Typography>

                        <form onSubmit={handleSubmit(handleOnSubmit)}>
                            {/* Salary Input */}
                            <Box sx={{ mb: 4 }}>
                                <TextField
                                    fullWidth
                                    type="number"
                                    label="Monthly Salary"
                                    placeholder="Enter your monthly salary"
                                    {...register("salary", {
                                        required: "Salary is required",
                                        min: {
                                            value: 1,
                                            message:
                                                "Salary must be greater than 0",
                                        },
                                    })}
                                    error={!!errors.salary}
                                    helperText={errors.salary?.message}
                                    InputProps={{
                                        startAdornment: (
                                            <Box
                                                sx={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    mr: 1,
                                                }}
                                            >
                                                <AccountBalanceWallet
                                                    sx={{
                                                        mr: 1,
                                                        color: "text.secondary",
                                                    }}
                                                />
                                                <Typography
                                                    sx={{
                                                        color: "text.secondary",
                                                    }}
                                                >
                                                    ₹
                                                </Typography>
                                            </Box>
                                        ),
                                    }}
                                    sx={{
                                        "& .MuiOutlinedInput-root": {
                                            "&:hover fieldset": {
                                                borderColor: "primary.main",
                                            },
                                        },
                                    }}
                                />
                            </Box>

                            <Divider sx={{ my: 3 }}>
                                <Chip
                                    label="Budget Breakdown"
                                    sx={{
                                        px: 2,
                                        background:
                                            "linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)",
                                        color: "white",
                                        fontWeight: "bold",
                                    }}
                                />
                            </Divider>

                            {/* Budget Breakdown Section */}
                            <Box sx={{ mb: 4 }}>
                                <Box
                                    sx={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        mb: 3,
                                    }}
                                >
                                    <Typography variant="h6" fontWeight="bold">
                                        Monthly Budget Allocation
                                    </Typography>
                                    <Button
                                        variant="outlined"
                                        onClick={handleAutoCalculate}
                                        disabled={
                                            isCalculating || !currentSalary
                                        }
                                        startIcon={
                                            isCalculating ? (
                                                <LinearProgress />
                                            ) : (
                                                <Calculate />
                                            )
                                        }
                                        sx={{
                                            borderRadius: 2,
                                            textTransform: "none",
                                            fontWeight: "bold",
                                        }}
                                    >
                                        {isCalculating
                                            ? "Calculating..."
                                            : "Smart Allocation"}
                                    </Button>
                                </Box>

                                <Grid container spacing={3}>
                                    <Grid item xs={12} md={4}>
                                        <TextField
                                            fullWidth
                                            type="number"
                                            label="Savings"
                                            placeholder="Amount to save"
                                            {...register("savings", {
                                                required:
                                                    "Savings amount is required",
                                                min: {
                                                    value: 0,
                                                    message:
                                                        "Savings cannot be negative",
                                                },
                                            })}
                                            error={!!errors.savings}
                                            helperText={errors.savings?.message}
                                            InputProps={{
                                                startAdornment: (
                                                    <Box
                                                        sx={{
                                                            display: "flex",
                                                            alignItems:
                                                                "center",
                                                            mr: 1,
                                                        }}
                                                    >
                                                        <Savings
                                                            sx={{
                                                                mr: 1,
                                                                color: "success.main",
                                                            }}
                                                        />
                                                        <Typography
                                                            sx={{
                                                                color: "text.secondary",
                                                            }}
                                                        >
                                                            ₹
                                                        </Typography>
                                                    </Box>
                                                ),
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={4}>
                                        <TextField
                                            fullWidth
                                            type="number"
                                            label="Expenses"
                                            placeholder="Monthly expenses"
                                            {...register("expenses", {
                                                required:
                                                    "Expenses amount is required",
                                                min: {
                                                    value: 0,
                                                    message:
                                                        "Expenses cannot be negative",
                                                },
                                            })}
                                            error={!!errors.expenses}
                                            helperText={
                                                errors.expenses?.message
                                            }
                                            InputProps={{
                                                startAdornment: (
                                                    <Box
                                                        sx={{
                                                            display: "flex",
                                                            alignItems:
                                                                "center",
                                                            mr: 1,
                                                        }}
                                                    >
                                                        <Receipt
                                                            sx={{
                                                                mr: 1,
                                                                color: "warning.main",
                                                            }}
                                                        />
                                                        <Typography
                                                            sx={{
                                                                color: "text.secondary",
                                                            }}
                                                        >
                                                            ₹
                                                        </Typography>
                                                    </Box>
                                                ),
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={4}>
                                        <TextField
                                            fullWidth
                                            type="number"
                                            label="Miscellaneous"
                                            placeholder="Other expenses"
                                            {...register("misc", {
                                                required:
                                                    "Miscellaneous amount is required",
                                                min: {
                                                    value: 0,
                                                    message:
                                                        "Miscellaneous cannot be negative",
                                                },
                                            })}
                                            error={!!errors.misc}
                                            helperText={errors.misc?.message}
                                            InputProps={{
                                                startAdornment: (
                                                    <Box
                                                        sx={{
                                                            display: "flex",
                                                            alignItems:
                                                                "center",
                                                            mr: 1,
                                                        }}
                                                    >
                                                        <Category
                                                            sx={{
                                                                mr: 1,
                                                                color: "info.main",
                                                            }}
                                                        />
                                                        <Typography
                                                            sx={{
                                                                color: "text.secondary",
                                                            }}
                                                        >
                                                            ₹
                                                        </Typography>
                                                    </Box>
                                                ),
                                            }}
                                        />
                                    </Grid>
                                </Grid>
                            </Box>

                            {/* Submit Button */}
                            <Box sx={{ display: "flex", gap: 2, mt: 4 }}>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    size="large"
                                    disabled={isSubmitting || !isValid}
                                    sx={{
                                        px: 4,
                                        py: 1.5,
                                        background: isValid
                                            ? "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)"
                                            : undefined,
                                        fontWeight: "bold",
                                        textTransform: "none",
                                        borderRadius: 2,
                                    }}
                                >
                                    {isSubmitting
                                        ? "💾 Saving..."
                                        : "💰 Save Budget Settings"}
                                </Button>
                                <Button
                                    variant="outlined"
                                    onClick={() => navigate("/dashboard")}
                                    sx={{
                                        px: 3,
                                        textTransform: "none",
                                        borderRadius: 2,
                                    }}
                                >
                                    Cancel
                                </Button>
                            </Box>
                        </form>
                    </Paper>
                </div>

                {/* Right Column - Preview & Validation */}
                <div className="col-12 col-lg-4">
                    <Paper
                        sx={{
                            p: 3,
                            borderRadius: 3,
                            boxShadow: 4,
                            height: "fit-content",
                        }}
                    >
                        <Typography variant="h6" gutterBottom fontWeight="bold">
                            📊 Budget Summary
                        </Typography>

                        <Box sx={{ mb: 3 }}>
                            <Box
                                sx={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    mb: 1,
                                }}
                            >
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                >
                                    Monthly Salary
                                </Typography>
                                <Typography variant="body2" fontWeight="bold">
                                    ₹{currentSalary.toLocaleString()}
                                </Typography>
                            </Box>
                            <Box
                                sx={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    mb: 1,
                                }}
                            >
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                >
                                    Total Allocated
                                </Typography>
                                <Typography
                                    variant="body2"
                                    fontWeight="bold"
                                    color={
                                        totalAllocated > currentSalary
                                            ? "error"
                                            : "text.primary"
                                    }
                                >
                                    ₹{totalAllocated.toLocaleString()}
                                </Typography>
                            </Box>
                            <Divider sx={{ my: 1 }} />
                            <Box
                                sx={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                }}
                            >
                                <Typography variant="body2" fontWeight="bold">
                                    Remaining
                                </Typography>
                                <Typography
                                    variant="body2"
                                    fontWeight="bold"
                                    color={
                                        remaining < 0
                                            ? "error"
                                            : remaining === 0
                                            ? "success.main"
                                            : "warning.main"
                                    }
                                >
                                    ₹{remaining.toLocaleString()}
                                </Typography>
                            </Box>
                        </Box>

                        {/* Progress Bar */}
                        {currentSalary > 0 && (
                            <Box sx={{ mb: 3 }}>
                                <Typography variant="body2" gutterBottom>
                                    Budget Allocation Progress
                                </Typography>
                                <LinearProgress
                                    variant="determinate"
                                    value={Math.min(
                                        (totalAllocated / currentSalary) * 100,
                                        100
                                    )}
                                    sx={{
                                        height: 12,
                                        borderRadius: 6,
                                        backgroundColor: "#e0e0e0",
                                        "& .MuiLinearProgress-bar": {
                                            background:
                                                totalAllocated > currentSalary
                                                    ? "linear-gradient(45deg, #f44336 30%, #ff5722 90%)"
                                                    : totalAllocated ===
                                                      currentSalary
                                                    ? "linear-gradient(45deg, #4caf50 30%, #8bc34a 90%)"
                                                    : "linear-gradient(45deg, #ff9800 30%, #ffc107 90%)",
                                        },
                                    }}
                                />
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    sx={{ mt: 1 }}
                                >
                                    {(
                                        (totalAllocated / currentSalary) *
                                        100
                                    ).toFixed(1)}
                                    % of salary allocated
                                </Typography>
                            </Box>
                        )}

                        {/* Validation Messages */}
                        {currentSalary > 0 && (
                            <>
                                {remaining === 0 && (
                                    <Alert severity="success" sx={{ mb: 2 }}>
                                        <AlertTitle>
                                            Perfect Balance! ✅
                                        </AlertTitle>
                                        Your budget allocation matches your
                                        salary exactly.
                                    </Alert>
                                )}

                                {remaining > 0 && (
                                    <Alert severity="warning" sx={{ mb: 2 }}>
                                        <AlertTitle>
                                            Unallocated Amount
                                        </AlertTitle>
                                        You have ₹{remaining.toLocaleString()}{" "}
                                        left to allocate.
                                    </Alert>
                                )}

                                {remaining < 0 && (
                                    <Alert severity="error" sx={{ mb: 2 }}>
                                        <AlertTitle>Over Budget! ⚠️</AlertTitle>
                                        You're allocating ₹
                                        {Math.abs(
                                            remaining
                                        ).toLocaleString()}{" "}
                                        more than your salary.
                                    </Alert>
                                )}
                            </>
                        )}
                    </Paper>
                </div>
            </div>

            {/* Bottom Info Section - Smart Budget Tips */}
            <Box sx={{ mt: 4 }}>
                <Paper sx={{ p: 3, borderRadius: 3, boxShadow: 4 }}>
                    <Typography
                        variant="h6"
                        gutterBottom
                        fontWeight="bold"
                        sx={{ display: "flex", alignItems: "center" }}
                    >
                        <Info sx={{ mr: 1 }} /> Smart Budget Tips
                    </Typography>
                    <Box component="ul" sx={{ pl: 2, m: 0 }}>
                        <Typography
                            component="li"
                            variant="body2"
                            sx={{ mb: 1 }}
                        >
                            <strong>60-30-10 Rule:</strong> 60% expenses, 30%
                            savings, 10% miscellaneous
                        </Typography>
                        <Typography
                            component="li"
                            variant="body2"
                            sx={{ mb: 1 }}
                        >
                            <strong>Emergency Fund:</strong> Aim to save 3-6
                            months of expenses
                        </Typography>
                        <Typography
                            component="li"
                            variant="body2"
                            sx={{ mb: 1 }}
                        >
                            <strong>Investment Goal:</strong> Try to save at
                            least 20-30% of income
                        </Typography>
                        <Typography component="li" variant="body2">
                            <strong>Track & Adjust:</strong> Review and adjust
                            your budget monthly
                        </Typography>
                    </Box>
                </Paper>
            </Box>
        </Container>
    );
};

export default Settings;
