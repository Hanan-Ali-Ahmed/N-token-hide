const express = require ('express')
const app = express()
const port = process.env.PORT || 3000
const routerFile = require("./router/user")
require("./db/mongoose")



app.use(express.json())
app.use(routerFile)  




app.listen(port , () => {
    console.log("The connection succeeded");
}) 