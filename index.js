require("dotenv").config()

const express = require("express")
const app = express();

const PORT = process.env.PORT || 8001

const {dbConnection} = require("./config/config")

app.use(express.json())

app.use("/users", require("./routes/users"))
app.use("/massages", require("./routes/massages"))


dbConnection()


app.listen(PORT, ()=> console.log(`server stared on port ${PORT}`))
