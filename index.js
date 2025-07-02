require("dotenv").config()

const express = require("express")
const app = express();

const PORT = process.env.PORT || 8080

const {dbConnection} = require("./config/config")

const PaymentController = require("./controllers/PaymentController");
const expressRaw = express.raw({ type: 'application/json' });

app.post("/payments/webhook", expressRaw, PaymentController.stripeWebhook);

app.use(express.json());

app.use("/payments", require("./routes/payments"));

app.use("/users", require("./routes/users"))
app.use("/massages", require("./routes/massages"))
app.use("/orders", require("./routes/orders"))
app.use("/reviews", require("./routes/reviews"))
app.use("/schedule", require("./routes/schedule"))

dbConnection()


app.listen(PORT, ()=> console.log(`server stared on port ${PORT}`))
