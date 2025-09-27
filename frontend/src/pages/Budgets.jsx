import AddRoundedIcon from "@mui/icons-material/AddRounded";

import { budgetAPI } from "../../services/api";

import { expenseAPI } from "../../services/api";

import { useState, useEffect } from "react";

import {

  Container,

  Row,

  Col,

  Card,

  Alert,

  Spinner,

  ProgressBar,

} from "react-bootstrap";

import { PieChart, LineChart } from "@mui/x-charts";

import AddBudget from "../components/Budgets/AddBudget";


 

const COLORS = [

  "#e63946", // strong red

  "#1d3557", // navy blue

  "#f4a261", // orange

  "#2a9d8f", // teal

  "#264653", // dark blue

  "#9d4edd", // purple

];


 

const Budgets = () => {

  const [budgets, setBudgets] = useState([]);

  const [expenses, setExpenses] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [isOpen, setIsOpen] = useState(false);


 

  useEffect(() => {

    fetchAllData();

  }, []);


 

  const fetchAllData = async () => {

    try {

      setLoading(true);

      const [budgetsRes, expensesRes] = await Promise.all([

        budgetAPI.getBudgets(),

        expenseAPI.getExpenses(),

      ]);

      setBudgets(budgetsRes.data.budgets || budgetsRes.data || []);

      setExpenses(expensesRes.data.expenses || expensesRes.data || []);

      setError("");

    } catch (err) {

      setError("Failed to fetch budgets or expenses.");

      console.error(err);

    } finally {

      setLoading(false);

    }

  };


 

  /*

   * Aggregate expense amounts by category for pie chart and budget consumption

   */

  const expenseTotalsByCategory = expenses.reduce((acc, e) => {

    if (e.category && e.amount) {

      acc[e.category] = (acc[e.category] || 0) + e.amount;

    }

    return acc;

  }, {});


 

  /*

   * Pie chart data: show remaining budget by category, label category + duration

   */

  const pieData = budgets.map((b, idx) => {

    const spent = expenseTotalsByCategory[b.category] || 0;

    const remaining = Math.max(b.amount - spent, 0);

    return {

      id: idx,

      label: `${b.category}`,

      value: remaining,

      color: COLORS[idx % COLORS.length],

      spent,

      total: b.amount,

    };

  }).filter(b => b.value > 0); // optionally filter out fully consumed budgets


 

  /*

   * Build data for line chart:

   * Track budget remaining over months for each category (assuming expenses have 'date')

   */

  const monthlyExpensesByCategory = {};

  expenses.forEach(({ category, date, amount }) => {

    if (category && date && amount) {

      const month = new Date(date).toLocaleDateString("en-US", {

        month: "short",

        year: "numeric",

      });

      if (!monthlyExpensesByCategory[category]) monthlyExpensesByCategory[category] = {};

      monthlyExpensesByCategory[category][month] =

        (monthlyExpensesByCategory[category][month] || 0) + amount;

    }

  });


 

  const allMonthsSet = new Set();

  Object.values(monthlyExpensesByCategory).forEach((m) =>

    Object.keys(m).forEach((month) => allMonthsSet.add(month))

  );

  const allMonths = Array.from(allMonthsSet).sort(

    (a, b) => new Date(a) - new Date(b)

  );


 

  const lineSeries = budgets.map((b, idx) => {

    const monthlySpend = monthlyExpensesByCategory[b.category] || {};

    let cumulativeSpend = 0;

    const data = allMonths.map((month) => {

      const spent = monthlySpend[month] || 0;

      cumulativeSpend += spent;

      return Math.max(b.amount - cumulativeSpend, 0);

    });

    return {

      label: `${b.category}`,

      data,

      color: COLORS[idx % COLORS.length],

      curve: "linear",

    };

  });


 

  /*

   * For progress bars, show spend % per budget

   */

  const enhancedBudgets = budgets.map((b, idx) => {

    const spent = expenseTotalsByCategory[b.category] || 0;

    const percentUsed = Math.min(100, (spent / b.amount || 0) * 100);

    return {

      ...b,

      spent,

      percentUsed,

      remaining: Math.max(b.amount - spent, 0),

      color: COLORS[idx % COLORS.length],

    };

  });


 

  if (loading)

    return (

      <div className="d-flex justify-content-center align-items-center h-100">

        <Spinner animation="border" variant="primary" />

      </div>

    );


 

  return (

    <Container className="mt-4">

      {error && <Alert variant="danger">{error}</Alert>}

      <div className="d-flex justify-content-between align-items-center mb-4">

        <h1 className="display-6 fs-5">Budgets Overview</h1>

        <button

          onClick={() => setIsOpen(true)}

          className="btn btn-primary btn-sm"

        >

          <AddRoundedIcon className="me-2" />

          Add Budget

        </button>

      </div>


 

      {/* Pie Chart */}

      <Row>

        <Col md={6} className="mb-4">

          <Card>

            <Card.Body>

              <h5>Remaining Budget Distribution</h5>

              {pieData.length ? (

                <PieChart

                  height={300}

                  labels={pieData.map((p) => p.label)}

                  series={[

                    {

                      data: pieData.map((p) => p.value),

                      color: (i) => pieData[i].color,

                      label: "Remaining Budget",

                    },

                  ]}

                />

              ) : (

                <p>No budget data available.</p>

              )}

            </Card.Body>

          </Card>

        </Col>


 

        {/* Progress Bars */}

        <Col md={6} className="mb-4">

          <Card>

            <Card.Body>

              <h5>Budget Usage</h5>

              {enhancedBudgets.length ? (

                enhancedBudgets.map((budget, idx) => (

                  <div key={idx} className="mb-3">

                    <div className="d-flex justify-content-between">

                      <div>

                        <strong>

                          {budget.category}

                        </strong>

                      </div>

                      <div>

                        ${budget.spent.toFixed(2)} / ${budget.amount.toFixed(2)}

                      </div>

                    </div>

                    <ProgressBar

                      now={budget.percentUsed}

                      label={`${budget.percentUsed.toFixed(1)}%`}

                      style={{ height: "1.6rem" }}

                      variant="info"

                      animated

                    />

                  </div>

                ))

              ) : (

                <p>No budget data available.</p>

              )}

            </Card.Body>

          </Card>

        </Col>

      </Row>


 

      {/* Line Chart */}

      <Row>

        <Col>

          <Card>

            <Card.Body>

              <h5>Budget Remaining Over Time</h5>

              {lineSeries.length ? (

                <LineChart

                  height={400}

                  xAxis={[

                    {

                      scaleType: "point",

                      data: allMonths,

                    },

                  ]}

                  series={lineSeries}

                />

              ) : (

                <p>No budget data available.</p>

              )}

            </Card.Body>

          </Card>

        </Col>

      </Row>


 

      <AddBudget

        isOpen={isOpen}

        onClose={() => setIsOpen(false)}

        onBudgetAdded={fetchAllData}

      />

    </Container>

  );

};


 

export default Budgets;

