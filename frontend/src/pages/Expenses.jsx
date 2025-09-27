import AddRoundedIcon from '@mui/icons-material/AddRounded';

import { expenseAPI } from "../../services/api"

import { LineChart, BarChart } from "@mui/x-charts"

import { useState, useEffect } from 'react';

import { Container, Row, Col, Card, Alert, Spinner } from "react-bootstrap"

import AddExpense from "../components/Expenses/AddExpense"


 

const Expenses = () => {

    const [expenses, setExpenses] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    const [isOpen, setIsOpen] = useState(false);


 

    useEffect(() => {

        fetchExpenses();

    }, []);


 

    const fetchExpenses = async () => {

        try {

            setLoading(true);

            const response = await expenseAPI.getExpenses();

            const expensesData = response.data.expenses || response.data || [];

            setExpenses(Array.isArray(expensesData) ? expensesData : []);

            setError("");

        } catch (error) {

            setError("Failed to fetch expenses");

            console.error("Error fetching expenses:", error);

        } finally {

            setLoading(false);

        }

    };



 

    const processExpenseData = () => {

        if (!Array.isArray(expenses) || !expenses.length)

            return { categoryData: [], monthlyData: [], totalSpent: 0 };


 

        // Group by category

        const categoryTotals = expenses.reduce((acc, expense) => {

            if (expense && expense.category && expense.amount) {

                acc[expense.category] =

                    (acc[expense.category] || 0) + expense.amount;

            }

            return acc;

        }, {});


 

        const categoryData = Object.entries(categoryTotals).map(

            ([category, amount], index) => ({

                id: index,

                value: amount,

                label: category,

            })

        );


 

        // Group by month

        const monthlyTotals = expenses.reduce((acc, expense) => {

            if (expense && expense.date && expense.amount) {

                const month = new Date(expense.date).toLocaleDateString(

                    "en-US",

                    {

                        month: "short",

                        year: "numeric",

                    }

                );

                acc[month] = (acc[month] || 0) + expense.amount;

            }

            return acc;

        }, {});


 

        const monthlyData = Object.entries(monthlyTotals).map(

            ([month, amount]) => ({

                month,

                amount,

            })

        );


 

        // Sort monthly data by date

        monthlyData.sort((a, b) => new Date(a.month) - new Date(b.month));


 

        const totalSpent = expenses.reduce(

            (sum, expense) =>

                sum + (expense && expense.amount ? expense.amount : 0),

            0

        );


 

        return { categoryData, monthlyData, totalSpent };

    };


 

    const { categoryData, monthlyData, totalSpent } = processExpenseData();


 

    const handleAddExpense = async () => {

        await fetchExpenses();

    }


 

    if (loading) {

        return (

            <div className="d-flex justify-content-center align-items-center h-100">

                <div className="text-center">

                    <Spinner animation="border" variant="primary" />

                    <p className="mt-2">Loading expenses...</p>

                </div>

            </div>

        );

    }


 

    return <Container>

        <div className='d-flex justify-content-between align-items-center'>

            <div className=''>

                <h1 className='display-6 fs-5'>Expenses</h1>

                <span className='text-muted fs-6'>View | Add expenses</span>

            </div>

            <button onClick={() => setIsOpen(true)} className="btn btn-primary btn-sm" style={{ height: "fit-content" }}><AddRoundedIcon /> Add Expense</button>

        </div>

        {error && (

            <Row className="mb-4">

                <Col>

                    <Alert variant="danger">{error}</Alert>

                </Col>

            </Row>

        )}


 

        {expenses.length === 0 && !loading ? (

            <Row>

                <Col>

                    <Alert variant="info" className="text-center">

                        <h5>No expenses found</h5>

                        <p>

                            Start by adding some expenses to see your

                            spending analytics.

                        </p>

                    </Alert>

                </Col>

            </Row>

        ) : (

            <>

                {/* Summary Card */}

                <Row className="mb-4">

                    <Col md={12}>

                        <Card className='mt-3'>

                            <Card.Body>

                                <Row className="text-center">

                                    <Col md={4}>

                                        <h3 className="text-blue">

                                            ${totalSpent.toFixed(2)}

                                        </h3>

                                        <p className="text-muted mb-0">

                                            Total Spent

                                        </p>

                                    </Col>

                                    <Col md={4}>

                                        <h3 className="text-success">

                                            {expenses.length}

                                        </h3>

                                        <p className="text-muted mb-0">

                                            Total Transactions

                                        </p>

                                    </Col>

                                    <Col md={4}>

                                        <h3 className="text-info">

                                            {categoryData.length}

                                        </h3>

                                        <p className="text-muted mb-0">

                                            Categories

                                        </p>

                                    </Col>

                                </Row>

                            </Card.Body>

                        </Card>

                    </Col>

                </Row>


 

                {/* Charts Row */}

                <Row>

                    {/* Category Pie Chart */}

                    <Col lg={6} className="mb-4">

                        <Card>

                            <Card.Header>

                                <h5 className="mb-0">Spending Trend</h5>

                            </Card.Header>

                            <Card.Body>

                                <div style={{ height: "300px" }}>

                                    {monthlyData.length > 0 ? (

                                        <LineChart

                                            xAxis={[

                                                {

                                                    scaleType: "point",

                                                    data: monthlyData.map(

                                                        (item) => item.month

                                                    ),

                                                },

                                            ]}

                                            series={[

                                                {

                                                    data: monthlyData.map(

                                                        (item) =>

                                                            item.amount

                                                    ),

                                                    label: "Monthly Spending ($)",

                                                    color: "#198754",

                                                    curve: "linear",

                                                },

                                            ]}

                                            height={300}

                                        />

                                    ) : (

                                        <p className="text-muted">

                                            No data available

                                        </p>

                                    )}

                                </div>

                            </Card.Body>

                        </Card>

                    </Col>


 

                    {/* Monthly Bar Chart */}

                    <Col lg={6} className="mb-4">

                        <Card>

                            <Card.Header>

                                <h5 className="mb-0">Monthly Spending</h5>

                            </Card.Header>

                            <Card.Body>

                                <div style={{ height: "300px" }}>

                                    {monthlyData.length > 0 ? (

                                        <BarChart

                                            xAxis={[

                                                {

                                                    scaleType: "band",

                                                    data: monthlyData.map(

                                                        (item) => item.month

                                                    ),

                                                },

                                            ]}

                                            series={[

                                                {

                                                    data: monthlyData.map(

                                                        (item) =>

                                                            item.amount

                                                    ),

                                                    label: "Amount ($)",

                                                    color: "#0d6efd",

                                                },

                                            ]}

                                            height={300}

                                        />

                                    ) : (

                                        <p className="text-muted">

                                            No data available

                                        </p>

                                    )}

                                </div>

                            </Card.Body>

                        </Card>

                    </Col>

                </Row>

                {/* Spending Trend Line Chart */}

                <Row>

                    <Col lg={12} className="mb-4">


 

                    </Col>

                </Row>


 

                {/* Recent Expenses Table */}

                <Row>

                    <Col lg={12}>

                        <Card>

                            <Card.Header>

                                <h5 className="mb-0">Recent Expenses</h5>

                            </Card.Header>

                            <Card.Body>

                                <div className="table-responsive">

                                    <table className="table table-hover">

                                        <thead className="table-light">

                                            <tr>

                                                <th>Date</th>

                                                <th>Description</th>

                                                <th>Category</th>

                                                <th>Amount</th>

                                            </tr>

                                        </thead>

                                        <tbody>

                                            {Array.isArray(expenses) &&

                                                expenses

                                                    .sort(

                                                        (a, b) =>

                                                            new Date(

                                                                b.date

                                                            ) -

                                                            new Date(a.date)

                                                    )

                                                    .slice(0, 10)

                                                    .map(

                                                        (

                                                            expense,

                                                            index

                                                        ) => (

                                                            <tr

                                                                key={

                                                                    expense._id ||

                                                                    index

                                                                }

                                                            >

                                                                <td>

                                                                    {new Date(

                                                                        expense.date

                                                                    ).toLocaleDateString()}

                                                                </td>

                                                                <td>

                                                                    {

                                                                        expense.description

                                                                    }

                                                                </td>

                                                                <td>

                                                                    <span className="badge bg-secondary">

                                                                        {

                                                                            expense.category

                                                                        }

                                                                    </span>

                                                                </td>

                                                                <td className="fw-bold text-danger">

                                                                    $

                                                                    {expense.amount.toFixed(

                                                                        2

                                                                    )}

                                                                </td>

                                                            </tr>

                                                        )

                                                    )}

                                        </tbody>

                                    </table>

                                </div>

                            </Card.Body>

                        </Card>

                    </Col>

                </Row>

            </>

        )}

        <AddExpense isOpen={isOpen} onClose={() => setIsOpen(false)} onExpenseAdded={handleAddExpense} />

    </Container>

}


 

export default Expenses
