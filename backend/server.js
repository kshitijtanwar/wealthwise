const express = require('express');

const dbConnect = require('./config/db')

require('dotenv').config();

const authRoutes = require('./routes/authRoutes')

const expensesRoutes = require('./routes/expenseRoutes')

const budgetRoutes = require('./routes/budgetRoutes');

const dashboardRoutes = require('./routes/dashboardRoutes');

const goalRoutes = require('./routes/goalRoutes');

const { errorHandler } = require('./middleware/errorMiddleware')

const cookieParser = require('cookie-parser');

const cors = require('cors');

const requestLogger = require('./middleware/requestLogger');


 

const app = express();

const PORT = process.env.PORT || 8000

dbConnect();


 

app.use(express.json())

app.use(cookieParser())

app.use(cors({

    origin: "http://localhost:5173",

    credentials: true

}))


 

app.use(requestLogger)


 

app.use('/api/v1/auth', authRoutes);

app.use('/api/v1/expenses', expensesRoutes);

app.use('/api/v1/budgets', budgetRoutes);

app.use('/api/v1/dashboard', dashboardRoutes);

app.use('/api/v1/goals', goalRoutes);


 

app.use(errorHandler)


 

app.listen(PORT, () => {

    console.log(`Server running on port ${PORT}`);


 

})