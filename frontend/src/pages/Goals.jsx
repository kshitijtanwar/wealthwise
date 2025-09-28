import React, { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";

import {
    Container,
    Grid,
    TextField,
    Typography,
    Button,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    LinearProgress,
    Divider,
    Box,
    Card,
    CardContent,
    IconButton,
    Alert,
    AlertTitle,
} from "@mui/material";

import {
    Edit,
    Delete,
    AccountBalanceWallet,
    TrendingUp,
    Info,
    Settings,
} from "@mui/icons-material";

import { goalAPI } from "../../services/api";
import { useAuth } from "../../hooks/useAuth";

const Goal = () => {
    const { user } = useAuth();

    // State management
    const [activeTab, setActiveTab] = useState("view"); // 'view' or 'create'
    const [goalName, setGoalName] = useState("");
    const [targetAmount, setTargetAmount] = useState("");
    const [duration, setDuration] = useState("");
    const [sip, setSip] = useState(0);
    const [fd, setFd] = useState(0);
    const [gold, setGold] = useState(0);
    const [goals, setGoals] = useState([]);
    const [editingGoal, setEditingGoal] = useState(null);
    const [showValidationErrors, setShowValidationErrors] = useState(false);

    // Check if salary is filled
    const hasSalary = user && user.salary && user.salary > 0;
    const totalSavings = user?.breakdown?.savings || 0;

    const allocated = sip + fd + gold;
    const remaining = totalSavings - allocated;

    // Investment calculation functions
    const calculateReturns = (amount, rate, years = 1) =>
        (amount * rate * years) / 100;

    const calculateCompoundGrowth = (principal, rate, years) => {
        return principal * Math.pow(1 + rate / 100, years) - principal;
    };

    const returns = {
        sip: calculateReturns(sip, 8),
        fd: calculateReturns(fd, 5),
        gold: calculateReturns(gold, 6),
    };

    const totals = {
        invested: allocated,
        returns: returns.sip + returns.fd + returns.gold,
        value: allocated + returns.sip + returns.fd + returns.gold,
    };

    // Calculate goal projection
    const calculateGoalProjection = (goal) => {
        if (!goal || !goal.allocation) return null;

        const { sip: goalSip, fd: goalFd, gold: goalGold } = goal.allocation;
        const monthlyInvestment = goalSip + goalFd + goalGold;

        // Calculate compound growth for each investment type over the goal duration
        const sipGrowth = calculateCompoundGrowth(
            goalSip * 12,
            8,
            goal.durationYears
        );
        const fdGrowth = calculateCompoundGrowth(
            goalFd * 12,
            5,
            goal.durationYears
        );
        const goldGrowth = calculateCompoundGrowth(
            goalGold * 12,
            6,
            goal.durationYears
        );

        const totalInvested = monthlyInvestment * 12 * goal.durationYears;
        const totalGrowth = sipGrowth + fdGrowth + goldGrowth;
        const finalValue = totalInvested + totalGrowth;

        // One year projection
        const oneYearSipGrowth = calculateReturns(goalSip * 12, 8);
        const oneYearFdGrowth = calculateReturns(goalFd * 12, 5);
        const oneYearGoldGrowth = calculateReturns(goalGold * 12, 6);
        const oneYearTotal =
            monthlyInvestment * 12 +
            oneYearSipGrowth +
            oneYearFdGrowth +
            oneYearGoldGrowth;

        return {
            monthlyInvestment,
            totalInvested,
            totalGrowth,
            finalValue,
            oneYearTotal,
            oneYearGrowth:
                oneYearSipGrowth + oneYearFdGrowth + oneYearGoldGrowth,
            achievementPercentage: (finalValue / goal.targetAmount) * 100,
            shortfall: Math.max(0, goal.targetAmount - finalValue),
        };
    };

    const fetchGoals = async () => {
        try {
            const res = await goalAPI.getGoals();
            setGoals(res.data);
        } catch (err) {
            console.error(err);
            toast.error("Failed to fetch goals");
        }
    };

    useEffect(() => {
        if (hasSalary) {
            fetchGoals();
        }
    }, [hasSalary]);

    const resetForm = () => {
        setGoalName("");
        setTargetAmount("");
        setDuration("");
        setSip(0);
        setFd(0);
        setGold(0);
        setEditingGoal(null);
        setShowValidationErrors(false);
    };

    const handleCreateGoal = async () => {
        setShowValidationErrors(true);

        if (!goalName.trim() || !targetAmount || !duration) {
            toast.error("Please fill in all goal details");
            return;
        }

        if (allocated === 0) {
            toast.error("Please allocate some amount to investments");
            return;
        }

        if (allocated > totalSavings) {
            toast.error("Allocation exceeds available savings!");
            return;
        }

        try {
            const payload = {
                name: goalName,
                targetAmount: Number(targetAmount),
                durationYears: Number(duration),
                allocation: { sip, fd, gold },
            };

            if (editingGoal) {
                await goalAPI.updateGoal(editingGoal._id, payload);
                toast.success(
                    `🎉 Goal "${goalName}" has been updated successfully!`
                );
            } else {
                await goalAPI.createGoal(payload);
                toast.success(
                    `🎉 Goal "${goalName}" has been created successfully!`
                );
            }

            resetForm();
            setActiveTab("view");
            fetchGoals();
        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.message || "Failed to save goal");
        }
    };

    const handleEditGoal = (goal) => {
        setGoalName(goal.name);
        setTargetAmount(goal.targetAmount.toString());
        setDuration(goal.durationYears.toString());
        setSip(goal.allocation.sip);
        setFd(goal.allocation.fd);
        setGold(goal.allocation.gold);
        setEditingGoal(goal);
        setShowValidationErrors(false);
        setActiveTab("create");
        toast.info(`Editing goal: ${goal.name}`);
    };

    const handleDeleteGoal = async (id) => {
        if (window.confirm("Are you sure you want to delete this goal?")) {
            try {
                await goalAPI.deleteGoal(id);
                toast.success("🗑️ Goal deleted successfully!");
                fetchGoals();
            } catch (err) {
                console.error(err);
                toast.error("Failed to delete goal");
            }
        }
    };

    const isFormValid =
        goalName.trim() &&
        targetAmount &&
        duration &&
        allocated > 0 &&
        allocated <= totalSavings;

    // If no salary, show salary setup message
    if (!hasSalary) {
        return (
            <Container maxWidth="md" sx={{ mt: 4 }}>
                <Toaster position="top-right" reverseOrder={false} />

                <Paper
                    sx={{
                        p: 4,
                        textAlign: "center",
                        borderRadius: 3,
                        background:
                            "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                        color: "white",
                    }}
                >
                    <AccountBalanceWallet
                        sx={{ fontSize: 80, mb: 2, opacity: 0.8 }}
                    />
                    <Typography variant="h3" gutterBottom fontWeight="bold">
                        Set Your Salary First! 💰
                    </Typography>
                    <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
                        Before creating financial goals, we need to know your
                        income details.
                    </Typography>
                </Paper>

                <Alert severity="info" sx={{ mt: 3, borderRadius: 2 }}>
                    <AlertTitle>
                        <strong>Why do we need your salary information?</strong>
                    </AlertTitle>
                    <Box component="ul" sx={{ mt: 1, pl: 2 }}>
                        <li>
                            Calculate your available savings for goal planning
                        </li>
                        <li>Provide personalized investment recommendations</li>
                        <li>Set realistic and achievable financial targets</li>
                        <li>
                            Track your progress towards financial independence
                        </li>
                    </Box>
                </Alert>

                <Card sx={{ mt: 3, borderRadius: 3, boxShadow: 3 }}>
                    <CardContent sx={{ p: 4 }}>
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                mb: 2,
                            }}
                        >
                            <Settings sx={{ mr: 2, color: "primary.main" }} />
                            <Typography variant="h6" fontWeight="bold">
                                How to set up your salary:
                            </Typography>
                        </Box>
                        <Typography variant="body1" sx={{ mb: 2 }}>
                            1. Navigate to the <strong>Settings</strong> page
                        </Typography>
                        <Typography variant="body1" sx={{ mb: 2 }}>
                            2. Enter your monthly salary amount
                        </Typography>
                        <Typography variant="body1" sx={{ mb: 3 }}>
                            3. The system will calculate your breakdown
                            automatically
                        </Typography>

                        <Button
                            variant="contained"
                            size="large"
                            startIcon={<Settings />}
                            sx={{
                                background:
                                    "linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)",
                                borderRadius: 2,
                                px: 4,
                            }}
                        >
                            Go to Settings
                        </Button>
                    </CardContent>
                </Card>
            </Container>
        );
    }

    return (
        <Container maxWidth="xl" sx={{ mt: 4 }}>
            <Toaster position="top-right" reverseOrder={false} />

            {/* Header */}
            <Paper
                sx={{
                    p: 3,
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
                        <Typography variant="h4" gutterBottom fontWeight="bold">
                            🎯 Financial Goals Dashboard
                        </Typography>
                        <Typography variant="h6" sx={{ opacity: 0.9 }}>
                            Track, create, and achieve your financial dreams
                        </Typography>
                    </Box>
                    <TrendingUp sx={{ fontSize: 60, opacity: 0.7 }} />
                </Box>
            </Paper>

            {/* Salary Breakdown Cards */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} md={3}>
                    <Card
                        sx={{
                            background:
                                "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)",
                            color: "white",
                        }}
                    >
                        <CardContent sx={{ textAlign: "center", p: 3 }}>
                            <Typography variant="h6" gutterBottom>
                                Monthly Salary
                            </Typography>
                            <Typography variant="h4" fontWeight="bold">
                                ₹{user.salary?.toLocaleString()}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={3}>
                    <Card
                        sx={{
                            background:
                                "linear-gradient(45deg, #4CAF50 30%, #8BC34A 90%)",
                            color: "white",
                        }}
                    >
                        <CardContent sx={{ textAlign: "center", p: 3 }}>
                            <Typography variant="h6" gutterBottom>
                                Available Savings
                            </Typography>
                            <Typography variant="h4" fontWeight="bold">
                                ₹{totalSavings.toLocaleString()}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={3}>
                    <Card
                        sx={{
                            background:
                                "linear-gradient(45deg, #FF9800 30%, #FFC107 90%)",
                            color: "white",
                        }}
                    >
                        <CardContent sx={{ textAlign: "center", p: 3 }}>
                            <Typography variant="h6" gutterBottom>
                                Monthly Expenses
                            </Typography>
                            <Typography variant="h4" fontWeight="bold">
                                ₹
                                {user.breakdown?.expenses?.toLocaleString() ||
                                    0}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={3}>
                    <Card
                        sx={{
                            background:
                                "linear-gradient(45deg, #9C27B0 30%, #E91E63 90%)",
                            color: "white",
                        }}
                    >
                        <CardContent sx={{ textAlign: "center", p: 3 }}>
                            <Typography variant="h6" gutterBottom>
                                Miscellaneous
                            </Typography>
                            <Typography variant="h4" fontWeight="bold">
                                ₹{user.breakdown?.misc?.toLocaleString() || 0}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Tab Navigation */}
            <Paper sx={{ mb: 3, borderRadius: 3, overflow: "hidden" }}>
                <Box sx={{ display: "flex", bgcolor: "#f5f5f5" }}>
                    <Button
                        onClick={() => setActiveTab("view")}
                        sx={{
                            flex: 1,
                            py: 2,
                            borderRadius: 0,
                            bgcolor:
                                activeTab === "view" ? "white" : "transparent",
                            color:
                                activeTab === "view"
                                    ? "primary.main"
                                    : "text.secondary",
                            fontWeight:
                                activeTab === "view" ? "bold" : "normal",
                            boxShadow: activeTab === "view" ? 2 : 0,
                        }}
                    >
                        📊 View Goals ({goals.length})
                    </Button>
                    <Button
                        onClick={() => {
                            setActiveTab("create");
                            if (!editingGoal) {
                                resetForm();
                            } else {
                                setShowValidationErrors(false);
                            }
                        }}
                        sx={{
                            flex: 1,
                            py: 2,
                            borderRadius: 0,
                            bgcolor:
                                activeTab === "create"
                                    ? "white"
                                    : "transparent",
                            color:
                                activeTab === "create"
                                    ? "primary.main"
                                    : "text.secondary",
                            fontWeight:
                                activeTab === "create" ? "bold" : "normal",
                            boxShadow: activeTab === "create" ? 2 : 0,
                        }}
                    >
                        ➕ {editingGoal ? "Edit Goal" : "Create New Goal"}
                    </Button>
                </Box>
            </Paper>

            {/* View Goals Tab */}
            {activeTab === "view" && (
                <>
                    {goals.length === 0 ? (
                        <Paper
                            sx={{ p: 6, textAlign: "center", borderRadius: 3 }}
                        >
                            <Typography
                                variant="h5"
                                color="text.secondary"
                                gutterBottom
                            >
                                🎯 No goals created yet
                            </Typography>
                            <Typography
                                variant="body1"
                                color="text.secondary"
                                sx={{ mb: 3 }}
                            >
                                Start your financial journey by creating your
                                first goal!
                            </Typography>
                            <Button
                                variant="contained"
                                onClick={() => setActiveTab("create")}
                                sx={{
                                    background:
                                        "linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)",
                                    px: 4,
                                    py: 1.5,
                                }}
                            >
                                Create Your First Goal
                            </Button>
                        </Paper>
                    ) : (
                        <div className="row g-4">
                            {goals.map((goal) => {
                                const projection =
                                    calculateGoalProjection(goal);
                                return (
                                    <div
                                        className="col-12 col-md-4"
                                        xs={12}
                                        lg={6}
                                        key={goal._id}
                                    >
                                        <Card
                                            sx={{
                                                borderRadius: 3,
                                                boxShadow: 4,
                                                transition: "all 0.3s ease",
                                                "&:hover": {
                                                    transform:
                                                        "translateY(-4px)",
                                                    boxShadow: 8,
                                                },
                                                height: "100%",
                                            }}
                                        >
                                            <CardContent sx={{ p: 4 }}>
                                                {/* Goal Header */}
                                                <Box
                                                    sx={{
                                                        display: "flex",
                                                        justifyContent:
                                                            "space-between",
                                                        alignItems:
                                                            "flex-start",
                                                        mb: 3,
                                                    }}
                                                >
                                                    <Box>
                                                        <Typography
                                                            variant="h5"
                                                            fontWeight="bold"
                                                            gutterBottom
                                                        >
                                                            🎯 {goal.name}
                                                        </Typography>
                                                        <Typography
                                                            variant="h4"
                                                            color="primary"
                                                            fontWeight="bold"
                                                        >
                                                            ₹
                                                            {goal.targetAmount?.toLocaleString()}
                                                        </Typography>
                                                        <Typography
                                                            variant="body2"
                                                            color="text.secondary"
                                                        >
                                                            Target in{" "}
                                                            {goal.durationYears}{" "}
                                                            years
                                                        </Typography>
                                                    </Box>
                                                    <Box
                                                        sx={{
                                                            display: "flex",
                                                            gap: 1,
                                                        }}
                                                    >
                                                        <IconButton
                                                            color="primary"
                                                            onClick={() =>
                                                                handleEditGoal(
                                                                    goal
                                                                )
                                                            }
                                                            size="small"
                                                        >
                                                            <Edit />
                                                        </IconButton>
                                                        <IconButton
                                                            color="error"
                                                            onClick={() =>
                                                                handleDeleteGoal(
                                                                    goal._id
                                                                )
                                                            }
                                                            size="small"
                                                        >
                                                            <Delete />
                                                        </IconButton>
                                                    </Box>
                                                </Box>

                                                {projection && (
                                                    <>
                                                        {/* Progress Bar */}
                                                        <Box sx={{ mb: 3 }}>
                                                            <Box
                                                                sx={{
                                                                    display:
                                                                        "flex",
                                                                    justifyContent:
                                                                        "space-between",
                                                                    mb: 1,
                                                                }}
                                                            >
                                                                <Typography
                                                                    variant="body2"
                                                                    fontWeight="bold"
                                                                >
                                                                    Goal
                                                                    Achievement
                                                                    Progress
                                                                </Typography>
                                                                <Typography
                                                                    variant="body2"
                                                                    fontWeight="bold"
                                                                    color="primary"
                                                                >
                                                                    {Math.min(
                                                                        projection.achievementPercentage,
                                                                        100
                                                                    ).toFixed(
                                                                        1
                                                                    )}
                                                                    %
                                                                </Typography>
                                                            </Box>
                                                            <LinearProgress
                                                                variant="determinate"
                                                                value={Math.min(
                                                                    projection.achievementPercentage,
                                                                    100
                                                                )}
                                                                sx={{
                                                                    height: 12,
                                                                    borderRadius: 6,
                                                                    bgcolor:
                                                                        "#e0e0e0",
                                                                    "& .MuiLinearProgress-bar":
                                                                        {
                                                                            background:
                                                                                projection.achievementPercentage >=
                                                                                100
                                                                                    ? "linear-gradient(45deg, #4CAF50 30%, #8BC34A 90%)"
                                                                                    : "linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)",
                                                                        },
                                                                }}
                                                            />
                                                        </Box>

                                                        {/* Investment Allocation */}
                                                        <Box sx={{ mb: 3 }}>
                                                            <Typography
                                                                variant="body2"
                                                                color="text.secondary"
                                                                gutterBottom
                                                                fontWeight="bold"
                                                            >
                                                                Monthly
                                                                Investment Plan:
                                                            </Typography>
                                                            <Box
                                                                sx={{
                                                                    display:
                                                                        "flex",
                                                                    flexWrap:
                                                                        "wrap",
                                                                    gap: 1,
                                                                    mb: 2,
                                                                }}
                                                            >
                                                                {goal.allocation
                                                                    .sip >
                                                                    0 && (
                                                                    <Box
                                                                        sx={{
                                                                            bgcolor:
                                                                                "#e3f2fd",
                                                                            px: 2,
                                                                            py: 1,
                                                                            borderRadius: 1,
                                                                        }}
                                                                    >
                                                                        <Typography
                                                                            variant="body2"
                                                                            fontWeight="bold"
                                                                        >
                                                                            💹
                                                                            SIP:
                                                                            ₹
                                                                            {goal.allocation.sip.toLocaleString()}
                                                                        </Typography>
                                                                    </Box>
                                                                )}
                                                                {goal.allocation
                                                                    .fd > 0 && (
                                                                    <Box
                                                                        sx={{
                                                                            bgcolor:
                                                                                "#f3e5f5",
                                                                            px: 2,
                                                                            py: 1,
                                                                            borderRadius: 1,
                                                                        }}
                                                                    >
                                                                        <Typography
                                                                            variant="body2"
                                                                            fontWeight="bold"
                                                                        >
                                                                            🏦
                                                                            FD:
                                                                            ₹
                                                                            {goal.allocation.fd.toLocaleString()}
                                                                        </Typography>
                                                                    </Box>
                                                                )}
                                                                {goal.allocation
                                                                    .gold >
                                                                    0 && (
                                                                    <Box
                                                                        sx={{
                                                                            bgcolor:
                                                                                "#fff3e0",
                                                                            px: 2,
                                                                            py: 1,
                                                                            borderRadius: 1,
                                                                        }}
                                                                    >
                                                                        <Typography
                                                                            variant="body2"
                                                                            fontWeight="bold"
                                                                        >
                                                                            🥇
                                                                            Gold:
                                                                            ₹
                                                                            {goal.allocation.gold.toLocaleString()}
                                                                        </Typography>
                                                                    </Box>
                                                                )}
                                                            </Box>
                                                            <Typography
                                                                variant="body1"
                                                                fontWeight="bold"
                                                                color="success.main"
                                                            >
                                                                Total Monthly: ₹
                                                                {projection.monthlyInvestment.toLocaleString()}
                                                            </Typography>
                                                        </Box>

                                                        {/* Growth Projections */}
                                                        <Divider
                                                            sx={{ my: 2 }}
                                                        />
                                                        <Grid
                                                            container
                                                            spacing={2}
                                                        >
                                                            <Grid item xs={6}>
                                                                <Paper
                                                                    sx={{
                                                                        p: 2,
                                                                        bgcolor:
                                                                            "#f8f9fa",
                                                                        textAlign:
                                                                            "center",
                                                                    }}
                                                                >
                                                                    <Typography
                                                                        variant="body2"
                                                                        color="text.secondary"
                                                                        gutterBottom
                                                                    >
                                                                        After 1
                                                                        Year
                                                                    </Typography>
                                                                    <Typography
                                                                        variant="h6"
                                                                        fontWeight="bold"
                                                                        color="success.main"
                                                                    >
                                                                        ₹
                                                                        {projection.oneYearTotal
                                                                            .toFixed(
                                                                                0
                                                                            )
                                                                            .toLocaleString()}
                                                                    </Typography>
                                                                    <Typography
                                                                        variant="body2"
                                                                        color="text.secondary"
                                                                    >
                                                                        Growth:
                                                                        +₹
                                                                        {projection.oneYearGrowth
                                                                            .toFixed(
                                                                                0
                                                                            )
                                                                            .toLocaleString()}
                                                                    </Typography>
                                                                </Paper>
                                                            </Grid>
                                                            <Grid item xs={6}>
                                                                <Paper
                                                                    sx={{
                                                                        p: 2,
                                                                        bgcolor:
                                                                            "#f8f9fa",
                                                                        textAlign:
                                                                            "center",
                                                                    }}
                                                                >
                                                                    <Typography
                                                                        variant="body2"
                                                                        color="text.secondary"
                                                                        gutterBottom
                                                                    >
                                                                        Final
                                                                        Value (
                                                                        {
                                                                            goal.durationYears
                                                                        }
                                                                        Y)
                                                                    </Typography>
                                                                    <Typography
                                                                        variant="h6"
                                                                        fontWeight="bold"
                                                                        color="primary"
                                                                    >
                                                                        ₹
                                                                        {projection.finalValue
                                                                            .toFixed(
                                                                                0
                                                                            )
                                                                            .toLocaleString()}
                                                                    </Typography>
                                                                    <Typography
                                                                        variant="body2"
                                                                        color="text.secondary"
                                                                    >
                                                                        Growth:
                                                                        +₹
                                                                        {projection.totalGrowth
                                                                            .toFixed(
                                                                                0
                                                                            )
                                                                            .toLocaleString()}
                                                                    </Typography>
                                                                </Paper>
                                                            </Grid>
                                                        </Grid>

                                                        {/* Shortfall Alert */}
                                                        {projection.shortfall >
                                                            0 && (
                                                            <Alert
                                                                severity="warning"
                                                                sx={{ mt: 2 }}
                                                            >
                                                                <Typography variant="body2">
                                                                    <strong>
                                                                        Shortfall:
                                                                    </strong>{" "}
                                                                    ₹
                                                                    {projection.shortfall
                                                                        .toFixed(
                                                                            0
                                                                        )
                                                                        .toLocaleString()}
                                                                </Typography>
                                                                <Typography variant="body2">
                                                                    Consider
                                                                    increasing
                                                                    your monthly
                                                                    investment
                                                                    or extending
                                                                    the
                                                                    duration.
                                                                </Typography>
                                                            </Alert>
                                                        )}

                                                        {projection.achievementPercentage >=
                                                            100 && (
                                                            <Alert
                                                                severity="success"
                                                                sx={{ mt: 2 }}
                                                            >
                                                                <Typography variant="body2">
                                                                    🎉{" "}
                                                                    <strong>
                                                                        Congratulations!
                                                                    </strong>{" "}
                                                                    Your
                                                                    investment
                                                                    plan will
                                                                    exceed your
                                                                    target!
                                                                </Typography>
                                                            </Alert>
                                                        )}
                                                    </>
                                                )}
                                            </CardContent>
                                        </Card>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </>
            )}

            {/* Create/Edit Goal Tab */}
            {activeTab === "create" && (
                <>
                    {editingGoal && (
                        <Alert severity="info" sx={{ mb: 3 }}>
                            <Typography variant="body1">
                                <strong>Editing Goal:</strong>{" "}
                                {editingGoal.name}
                            </Typography>
                            <Button
                                size="small"
                                onClick={() => {
                                    setEditingGoal(null);
                                    resetForm();
                                }}
                                sx={{ mt: 1 }}
                            >
                                Cancel Edit
                            </Button>
                        </Alert>
                    )}

                    {/* Goal Form */}
                    <Paper sx={{ p: 4, mb: 4, borderRadius: 3, boxShadow: 4 }}>
                        <Typography
                            variant="h5"
                            gutterBottom
                            fontWeight="bold"
                            sx={{ mb: 3 }}
                        >
                            {editingGoal
                                ? "✏️ Edit Goal Details"
                                : "🎯 Goal Details"}
                        </Typography>
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={4}>
                                <TextField
                                    fullWidth
                                    label="Goal Name"
                                    placeholder="e.g., Dream House, New Car, Vacation"
                                    value={goalName}
                                    onChange={(e) =>
                                        setGoalName(e.target.value)
                                    }
                                    variant="outlined"
                                    error={
                                        showValidationErrors && !goalName.trim()
                                    }
                                    helperText={
                                        showValidationErrors && !goalName.trim()
                                            ? "Goal name is required"
                                            : ""
                                    }
                                />
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <TextField
                                    fullWidth
                                    type="number"
                                    label="Target Amount (₹)"
                                    placeholder="e.g., 500000"
                                    value={targetAmount}
                                    onChange={(e) =>
                                        setTargetAmount(e.target.value)
                                    }
                                    variant="outlined"
                                    error={
                                        showValidationErrors && !targetAmount
                                    }
                                    helperText={
                                        showValidationErrors && !targetAmount
                                            ? "Target amount is required"
                                            : ""
                                    }
                                    InputProps={{
                                        startAdornment: (
                                            <Typography
                                                sx={{
                                                    mr: 1,
                                                    color: "text.secondary",
                                                }}
                                            >
                                                ₹
                                            </Typography>
                                        ),
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <TextField
                                    fullWidth
                                    type="number"
                                    label="Duration (Years)"
                                    placeholder="e.g., 5"
                                    value={duration}
                                    onChange={(e) =>
                                        setDuration(e.target.value)
                                    }
                                    variant="outlined"
                                    error={showValidationErrors && !duration}
                                    helperText={
                                        showValidationErrors && !duration
                                            ? "Duration is required"
                                            : ""
                                    }
                                />
                            </Grid>
                        </Grid>
                    </Paper>

                    {/* Investment Allocation */}
                    <Grid container spacing={4}>
                        <Grid item xs={12} md={6}>
                            <Paper
                                sx={{
                                    p: 4,
                                    borderRadius: 3,
                                    boxShadow: 4,
                                    height: "fit-content",
                                }}
                            >
                                <Typography
                                    variant="h6"
                                    gutterBottom
                                    fontWeight="bold"
                                    sx={{ mb: 3 }}
                                >
                                    💰 Investment Allocation
                                </Typography>

                                <Box
                                    sx={{
                                        background:
                                            "linear-gradient(45deg, #e3f2fd 30%, #bbdefb 90%)",
                                        p: 3,
                                        borderRadius: 2,
                                        mb: 3,
                                        textAlign: "center",
                                    }}
                                >
                                    <Typography
                                        variant="body1"
                                        color="primary"
                                        gutterBottom
                                    >
                                        Available Monthly Savings
                                    </Typography>
                                    <Typography
                                        variant="h4"
                                        fontWeight="bold"
                                        color="primary"
                                    >
                                        ₹{totalSavings.toLocaleString()}
                                    </Typography>
                                </Box>

                                <Box sx={{ mb: 3 }}>
                                    <TextField
                                        fullWidth
                                        type="number"
                                        label="💹 SIP - Systematic Investment Plan"
                                        sx={{ mb: 2 }}
                                        value={sip}
                                        onChange={(e) =>
                                            setSip(Number(e.target.value))
                                        }
                                        InputProps={{
                                            startAdornment: (
                                                <Typography sx={{ mr: 1 }}>
                                                    ₹
                                                </Typography>
                                            ),
                                        }}
                                        helperText="Expected return: 8% per annum"
                                    />

                                    <TextField
                                        fullWidth
                                        type="number"
                                        label="🏦 Fixed Deposit"
                                        sx={{ mb: 2 }}
                                        value={fd}
                                        onChange={(e) =>
                                            setFd(Number(e.target.value))
                                        }
                                        InputProps={{
                                            startAdornment: (
                                                <Typography sx={{ mr: 1 }}>
                                                    ₹
                                                </Typography>
                                            ),
                                        }}
                                        helperText="Expected return: 5% per annum"
                                    />

                                    <TextField
                                        fullWidth
                                        type="number"
                                        label="🥇 Gold Investment"
                                        value={gold}
                                        onChange={(e) =>
                                            setGold(Number(e.target.value))
                                        }
                                        InputProps={{
                                            startAdornment: (
                                                <Typography sx={{ mr: 1 }}>
                                                    ₹
                                                </Typography>
                                            ),
                                        }}
                                        helperText="Expected return: 6% per annum"
                                    />
                                </Box>

                                <Divider sx={{ my: 3 }} />

                                <Box
                                    sx={{
                                        p: 3,
                                        borderRadius: 2,
                                        bgcolor:
                                            allocated > totalSavings
                                                ? "#ffebee"
                                                : allocated === 0
                                                ? "#fff3e0"
                                                : "#e8f5e8",
                                    }}
                                >
                                    <Typography
                                        variant="h6"
                                        color={
                                            allocated > totalSavings
                                                ? "error"
                                                : allocated === 0
                                                ? "warning.main"
                                                : "success.main"
                                        }
                                        fontWeight="bold"
                                        gutterBottom
                                    >
                                        📊 Total Allocated: ₹
                                        {allocated.toLocaleString()}
                                    </Typography>
                                    <Typography
                                        color={
                                            remaining < 0
                                                ? "error"
                                                : "text.secondary"
                                        }
                                        variant="body1"
                                    >
                                        Remaining: ₹{remaining.toLocaleString()}{" "}
                                        / ₹{totalSavings.toLocaleString()}
                                    </Typography>
                                </Box>

                                {allocated > totalSavings && (
                                    <Alert severity="error" sx={{ mt: 2 }}>
                                        <AlertTitle>
                                            Allocation Exceeds Savings!
                                        </AlertTitle>
                                        Please reduce your allocation to match
                                        your available savings.
                                    </Alert>
                                )}

                                {allocated === 0 && (
                                    <Alert severity="warning" sx={{ mt: 2 }}>
                                        <AlertTitle>
                                            No Investment Allocated
                                        </AlertTitle>
                                        Please allocate some amount to create
                                        your goal.
                                    </Alert>
                                )}
                            </Paper>
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <Paper sx={{ p: 4, borderRadius: 3, boxShadow: 4 }}>
                                <Typography
                                    variant="h6"
                                    gutterBottom
                                    fontWeight="bold"
                                    sx={{ mb: 3 }}
                                >
                                    📈 Investment Preview
                                </Typography>

                                {allocated > 0 ? (
                                    <>
                                        <TableContainer sx={{ mb: 3 }}>
                                            <Table size="small">
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell>
                                                            <strong>
                                                                Investment
                                                            </strong>
                                                        </TableCell>
                                                        <TableCell>
                                                            <strong>
                                                                Monthly
                                                            </strong>
                                                        </TableCell>
                                                        <TableCell>
                                                            <strong>
                                                                1Y Return
                                                            </strong>
                                                        </TableCell>
                                                        <TableCell>
                                                            <strong>
                                                                1Y Value
                                                            </strong>
                                                        </TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {sip > 0 && (
                                                        <TableRow>
                                                            <TableCell>
                                                                💹 SIP
                                                            </TableCell>
                                                            <TableCell>
                                                                ₹
                                                                {sip.toLocaleString()}
                                                            </TableCell>
                                                            <TableCell>
                                                                +₹
                                                                {returns.sip.toFixed(
                                                                    0
                                                                )}
                                                            </TableCell>
                                                            <TableCell>
                                                                ₹
                                                                {(
                                                                    sip * 12 +
                                                                    returns.sip
                                                                ).toFixed(0)}
                                                            </TableCell>
                                                        </TableRow>
                                                    )}
                                                    {fd > 0 && (
                                                        <TableRow>
                                                            <TableCell>
                                                                🏦 FD
                                                            </TableCell>
                                                            <TableCell>
                                                                ₹
                                                                {fd.toLocaleString()}
                                                            </TableCell>
                                                            <TableCell>
                                                                +₹
                                                                {returns.fd.toFixed(
                                                                    0
                                                                )}
                                                            </TableCell>
                                                            <TableCell>
                                                                ₹
                                                                {(
                                                                    fd * 12 +
                                                                    returns.fd
                                                                ).toFixed(0)}
                                                            </TableCell>
                                                        </TableRow>
                                                    )}
                                                    {gold > 0 && (
                                                        <TableRow>
                                                            <TableCell>
                                                                🥇 Gold
                                                            </TableCell>
                                                            <TableCell>
                                                                ₹
                                                                {gold.toLocaleString()}
                                                            </TableCell>
                                                            <TableCell>
                                                                +₹
                                                                {returns.gold.toFixed(
                                                                    0
                                                                )}
                                                            </TableCell>
                                                            <TableCell>
                                                                ₹
                                                                {(
                                                                    gold * 12 +
                                                                    returns.gold
                                                                ).toFixed(0)}
                                                            </TableCell>
                                                        </TableRow>
                                                    )}
                                                    <TableRow
                                                        sx={{
                                                            bgcolor: "#f1f8e9",
                                                        }}
                                                    >
                                                        <TableCell>
                                                            <strong>
                                                                Total
                                                            </strong>
                                                        </TableCell>
                                                        <TableCell>
                                                            <strong>
                                                                ₹
                                                                {allocated.toLocaleString()}
                                                            </strong>
                                                        </TableCell>
                                                        <TableCell>
                                                            <strong>
                                                                +₹
                                                                {totals.returns.toFixed(
                                                                    0
                                                                )}
                                                            </strong>
                                                        </TableCell>
                                                        <TableCell>
                                                            <strong>
                                                                ₹
                                                                {(
                                                                    allocated *
                                                                        12 +
                                                                    totals.returns
                                                                ).toFixed(0)}
                                                            </strong>
                                                        </TableCell>
                                                    </TableRow>
                                                </TableBody>
                                            </Table>
                                        </TableContainer>

                                        {targetAmount && (
                                            <Box
                                                sx={{
                                                    p: 3,
                                                    bgcolor: "#f8f9fa",
                                                    borderRadius: 2,
                                                    mb: 3,
                                                }}
                                            >
                                                <Typography
                                                    variant="body1"
                                                    gutterBottom
                                                >
                                                    🎯 <strong>Target:</strong>{" "}
                                                    ₹
                                                    {Number(
                                                        targetAmount
                                                    ).toLocaleString()}
                                                </Typography>
                                                <Typography
                                                    variant="body1"
                                                    gutterBottom
                                                >
                                                    📅{" "}
                                                    <strong>Duration:</strong>{" "}
                                                    {duration || "?"} years
                                                </Typography>
                                                <Typography
                                                    variant="body1"
                                                    gutterBottom
                                                >
                                                    📈{" "}
                                                    <strong>
                                                        1-Year Value:
                                                    </strong>{" "}
                                                    ₹
                                                    {(
                                                        allocated * 12 +
                                                        totals.returns
                                                    )
                                                        .toFixed(0)
                                                        .toLocaleString()}
                                                </Typography>

                                                {duration && (
                                                    <>
                                                        <LinearProgress
                                                            variant="determinate"
                                                            value={Math.min(
                                                                ((allocated *
                                                                    12 +
                                                                    totals.returns) /
                                                                    Number(
                                                                        targetAmount
                                                                    )) *
                                                                    100,
                                                                100
                                                            )}
                                                            sx={{
                                                                height: 12,
                                                                borderRadius: 6,
                                                                my: 2,
                                                                "& .MuiLinearProgress-bar":
                                                                    {
                                                                        background:
                                                                            "linear-gradient(45deg, #4CAF50 30%, #8BC34A 90%)",
                                                                    },
                                                            }}
                                                        />
                                                        <Typography
                                                            variant="body2"
                                                            color="text.secondary"
                                                        >
                                                            {(
                                                                ((allocated *
                                                                    12 +
                                                                    totals.returns) /
                                                                    Number(
                                                                        targetAmount
                                                                    )) *
                                                                100
                                                            ).toFixed(1)}
                                                            % of target in first
                                                            year
                                                        </Typography>
                                                    </>
                                                )}
                                            </Box>
                                        )}
                                    </>
                                ) : (
                                    <Box sx={{ textAlign: "center", p: 4 }}>
                                        <Typography
                                            variant="body1"
                                            color="text.secondary"
                                        >
                                            💡 Allocate investments to see
                                            preview
                                        </Typography>
                                    </Box>
                                )}

                                <Box sx={{ textAlign: "center", mt: 3 }}>
                                    <Button
                                        variant="contained"
                                        size="large"
                                        onClick={handleCreateGoal}
                                        disabled={!isFormValid}
                                        sx={{
                                            background: isFormValid
                                                ? "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)"
                                                : "grey",
                                            px: 4,
                                            py: 1.5,
                                            minWidth: 200,
                                        }}
                                    >
                                        {editingGoal
                                            ? "💾 Update Goal"
                                            : "🎯 Create Goal"}
                                    </Button>
                                </Box>
                            </Paper>
                        </Grid>
                    </Grid>
                </>
            )}
        </Container>
    );
};

export default Goal;
