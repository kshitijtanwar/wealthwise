import React, { useState, useEffect } from "react";

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
    Snackbar,
    Alert,
    Divider,
    Box,
    Card,
    CardContent,
    IconButton,
} from "@mui/material";

import { Edit, Delete } from "@mui/icons-material";

import { goalAPI } from "../../services/api";

import { useAuth } from "../../hooks/useAuth";

const Goal = () => {
    const { user } = useAuth();

    const [goalName, setGoalName] = useState("");

    const [targetAmount, setTargetAmount] = useState("");

    const [duration, setDuration] = useState("");

    const totalSavings = user.breakdown.savings || 0;

    const [sip, setSip] = useState(0);

    const [fd, setFd] = useState(0);

    const [gold, setGold] = useState(0);

    const [showSummary, setShowSummary] = useState(false);

    const [alert, setAlert] = useState({ open: false, msg: "", type: "error" });

    const [goals, setGoals] = useState([]);

    const allocated = sip + fd + gold;

    const remaining = totalSavings - allocated;

    const returns = {
        sip: (sip * 8) / 100,

        fd: (fd * 5) / 100,

        gold: (gold * 6) / 100,
    };

    const totals = {
        invested: allocated,

        returns: returns.sip + returns.fd + returns.gold,

        value: allocated + returns.sip + returns.fd + returns.gold,
    };

    const fetchGoals = async () => {
        try {
            const res = await goalAPI.getGoals();

            setGoals(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchGoals();
    }, []);

    const handleNext = () => {
        if (allocated > totalSavings) {
            setAlert({
                open: true,

                msg: "❌ Allocation exceeds available savings!",

                type: "error",
            });

            return;
        }

        setShowSummary(true);
    };

    const handleConfirm = async () => {
        try {
            const payload = {
                name: goalName,

                targetAmount: Number(targetAmount),

                durationYears: Number(duration),

                allocation: { sip, fd, gold },
            };

            await goalAPI.createGoal(payload);

            setAlert({
                open: true,

                msg: `🎉 Your goal "${goalName}" has been created successfully!`,

                type: "success",
            });

            setGoalName("");

            setTargetAmount("");

            setDuration("");

            setSip(0);

            setFd(0);

            setGold(0);

            setShowSummary(false);

            fetchGoals(); // Refresh goals
        } catch (err) {
            console.error(err);

            setAlert({
                open: true,

                msg: err.response?.data?.message || "Failed to create goal",

                type: "error",
            });
        }
    };

    const handleDelete = async (id) => {
        try {
            await goalAPI.deleteGoal(id);

            setAlert({
                open: true,

                msg: "🗑️ Goal deleted successfully!",

                type: "success",
            });

            fetchGoals();
        } catch (err) {
            console.error(err);

            setAlert({
                open: true,

                msg: "Failed to delete goal",

                type: "error",
            });
        }
    };

    const handleUpdate = (goal) => {
        setGoalName(goal.name);

        setTargetAmount(goal.targetAmount);

        setDuration(goal.durationYears);

        setSip(goal.allocation.sip);

        setFd(goal.allocation.fd);

        setGold(goal.allocation.gold);

        setShowSummary(true);
    };

    return (
        <Container maxWidth="xl" sx={{ mt: 4 }}>
            <Typography
                variant="h4"
                gutterBottom
                fontWeight="bold"
                color="primary"
            >
                🎯 Create New Goal
            </Typography>

            {/* Goal Info Section */}

            <Paper sx={{ p: 3, mb: 4, borderRadius: 3, boxShadow: 4 }}>
                <Grid container spacing={2}>
                    <Grid item xs={12} md={4}>
                        <TextField
                            fullWidth
                            label="Goal Name"
                            value={goalName}
                            onChange={(e) => setGoalName(e.target.value)}
                        />
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <TextField
                            fullWidth
                            type="number"
                            label="Target Amount (₹)"
                            value={targetAmount}
                            onChange={(e) => setTargetAmount(e.target.value)}
                        />
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <TextField
                            fullWidth
                            type="number"
                            label="Duration (Years)"
                            value={duration}
                            onChange={(e) => setDuration(e.target.value)}
                        />
                    </Grid>
                </Grid>
            </Paper>

            <Grid container spacing={4}>
                {/* LEFT: Allocation */}

                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 4, borderRadius: 3, boxShadow: 4 }}>
                        <Box
                            sx={{
                                background: "#e3f2fd",
                                p: 2,
                                borderRadius: 2,
                                mb: 3,
                            }}
                        >
                            <Typography variant="h6" fontWeight="bold">
                                💰 Your Savings: ₹
                                {totalSavings.toLocaleString()}
                            </Typography>
                        </Box>

                        <TextField
                            fullWidth
                            type="number"
                            label="SIP (8%)"
                            sx={{ mb: 2 }}
                            value={sip}
                            onChange={(e) => setSip(Number(e.target.value))}
                        />

                        <TextField
                            fullWidth
                            type="number"
                            label="FD (5%)"
                            sx={{ mb: 2 }}
                            value={fd}
                            onChange={(e) => setFd(Number(e.target.value))}
                        />

                        <TextField
                            fullWidth
                            type="number"
                            label="Gold (6%)"
                            sx={{ mb: 2 }}
                            value={gold}
                            onChange={(e) => setGold(Number(e.target.value))}
                        />

                        <Divider sx={{ my: 2 }} />

                        <Typography
                            color={
                                allocated > totalSavings ? "error" : "primary"
                            }
                        >
                            📊 Allocated: ₹{allocated.toLocaleString()} / ₹
                            {totalSavings.toLocaleString()}
                        </Typography>

                        <Typography color="text.secondary">
                            Remaining Savings: ₹{remaining.toLocaleString()}
                        </Typography>
                    </Paper>
                </Grid>

                {/* RIGHT: Summary */}

                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 4, borderRadius: 3, boxShadow: 4 }}>
                        <Typography
                            variant="h6"
                            gutterBottom
                            color="secondary"
                            fontWeight="bold"
                        >
                            📈 Investment Summary
                        </Typography>

                        <TableContainer sx={{ mb: 2 }}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Investment</TableCell>

                                        <TableCell>Amount</TableCell>

                                        <TableCell>Expected Return</TableCell>

                                        <TableCell>Value After 1 Yr</TableCell>
                                    </TableRow>
                                </TableHead>

                                <TableBody>
                                    <TableRow>
                                        <TableCell>SIP</TableCell>

                                        <TableCell>₹{sip}</TableCell>

                                        <TableCell>
                                            +₹{returns.sip.toFixed(0)}
                                        </TableCell>

                                        <TableCell>
                                            ₹{(sip + returns.sip).toFixed(0)}
                                        </TableCell>
                                    </TableRow>

                                    <TableRow>
                                        <TableCell>FD</TableCell>

                                        <TableCell>₹{fd}</TableCell>

                                        <TableCell>
                                            +₹{returns.fd.toFixed(0)}
                                        </TableCell>

                                        <TableCell>
                                            ₹{(fd + returns.fd).toFixed(0)}
                                        </TableCell>
                                    </TableRow>

                                    <TableRow>
                                        <TableCell>Gold</TableCell>

                                        <TableCell>₹{gold}</TableCell>

                                        <TableCell>
                                            +₹{returns.gold.toFixed(0)}
                                        </TableCell>

                                        <TableCell>
                                            ₹{(gold + returns.gold).toFixed(0)}
                                        </TableCell>
                                    </TableRow>

                                    <TableRow
                                        sx={{
                                            fontWeight: "bold",
                                            backgroundColor: "#f1f8e9",
                                        }}
                                    >
                                        <TableCell>Total</TableCell>

                                        <TableCell>
                                            ₹{totals.invested}
                                        </TableCell>

                                        <TableCell>
                                            +₹{totals.returns.toFixed(0)}
                                        </TableCell>

                                        <TableCell>
                                            ₹{totals.value.toFixed(0)}
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </TableContainer>

                        <Typography>🎯 Target: ₹{targetAmount || 0}</Typography>

                        <Typography sx={{ mb: 1 }}>
                            Current Plan: ₹{totals.value.toFixed(0)} in 1 year
                        </Typography>

                        <LinearProgress
                            variant="determinate"
                            value={Math.min(
                                (totals.value / (targetAmount || 1)) * 100,
                                100
                            )}
                            sx={{ height: 12, borderRadius: 5, mb: 2 }}
                        />

                        <Typography variant="body2" color="text.secondary">
                            You will reach your goal in ~{duration || "?"} years
                            if you continue investing this way.
                        </Typography>

                        <Box textAlign="right" mt={3}>
                            <Button
                                variant="contained"
                                size="large"
                                onClick={handleNext}
                            >
                                Next ➡️
                            </Button>
                        </Box>

                        {showSummary && (
                            <Paper
                                sx={{
                                    mt: 3,
                                    p: 3,
                                    border: "2px solid #4caf50",
                                    borderRadius: 2,
                                    bgcolor: "#f1f8f6",
                                }}
                            >
                                <Typography variant="h6" color="success.main">
                                    ✅ Confirm Goal Plan
                                </Typography>

                                <Typography sx={{ mb: 2 }}>
                                    Your goal "<b>{goalName}</b>" is ready.
                                    Confirm to save!
                                </Typography>

                                <Button
                                    variant="contained"
                                    color="success"
                                    onClick={handleConfirm}
                                >
                                    Confirm & Save
                                </Button>
                            </Paper>
                        )}
                    </Paper>
                </Grid>
            </Grid>

            {/* Display Goals */}

            <Typography variant="h5" sx={{ mt: 4, mb: 2 }}>
                📌 Your Goals
            </Typography>

            {goals.length === 0 ? (
                <Typography color="text.secondary">
                    No goals available
                </Typography>
            ) : (
                <Grid container spacing={2}>
                    {goals.map((goal) => (
                        <Grid item xs={12} md={4} key={goal._id}>
                            <Card sx={{ p: 2 }}>
                                <CardContent>
                                    <Typography variant="h6">
                                        {goal.name}
                                    </Typography>

                                    <Typography>
                                        Target: ₹{goal.targetAmount}
                                    </Typography>

                                    <Typography>
                                        Duration: {goal.durationYears} years
                                    </Typography>

                                    <Typography>
                                        SIP: ₹{goal.allocation.sip}
                                    </Typography>

                                    <Typography>
                                        FD: ₹{goal.allocation.fd}
                                    </Typography>

                                    <Typography>
                                        Gold: ₹{goal.allocation.gold}
                                    </Typography>

                                    <Box mt={1}>
                                        <IconButton
                                            color="primary"
                                            onClick={() => handleUpdate(goal)}
                                        >
                                            <Edit />
                                        </IconButton>

                                        <IconButton
                                            color="error"
                                            onClick={() =>
                                                handleDelete(goal._id)
                                            }
                                        >
                                            <Delete />
                                        </IconButton>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}

            {/* Snackbar for alerts */}

            <Snackbar
                open={alert.open}
                autoHideDuration={3000}
                onClose={() => setAlert({ ...alert, open: false })}
            >
                <Alert
                    severity={alert.type}
                    onClose={() => setAlert({ ...alert, open: false })}
                >
                    {alert.msg}
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default Goal;
