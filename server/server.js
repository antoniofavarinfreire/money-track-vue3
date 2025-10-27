const express = require("express");
const cors = require("cors");
const app = express();
const userRoutes = require("./routes/Users/userRouter");
const incomeTaxCategoriesRoutes = require("./routes/IncomeTaxCategories/incomeTaxCategoriesRouter");
const expensesRoutes = require("./routes/Expenses/expensesRouter");
const fiscalRulesRoutes = require("./routes/FiscalRules/fiscalRulesRouter");
const sequelize = require("./database/db");
require("./models/associations");
sequelize.sync();

app.use(
  cors({
    origin: "http://localhost:8080", // porta do front Vue
    credentials: true,
  })
);

app.use(express.json());
app.use("/users", userRoutes);
app.use("/income-tax-categories", incomeTaxCategoriesRoutes);
app.use("/expenses", expensesRoutes);
app.use("/fiscal-rules", fiscalRulesRoutes);

app.listen(3000, () => {
  console.log("Server running on port 3000");
  console.log("🔹 Users API: http://localhost:3000/users");
  console.log("🔹 Income Tax Categories API: http://localhost:3000/income-tax-categories");
  console.log("🔹 Expenses API: http://localhost:3000/expenses");
  console.log("🔹 FiscalRules API: http://localhost:3000/fiscal-rules");
});
