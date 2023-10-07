import express from "express"
import session from "express-session"

const app = express()
const port = 8080

// Enable support for URL-encoded request bodies (form posts)
app.use(express.urlencoded({ extended: true }))

// Setup and use session middleware
app.use(session({
    secret: "secret phrase",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false },
}))

// Setup and use the EJS view engine
app.set("view engine", "ejs")


// TODO: Setup and use static files middleware
app.use(express.static("static"))

// TODO: Import and use controllers
import productController from "./controllers/products.js"
app.use(productController)
import staffController from "./controllers/staff.js"
app.use(staffController)
import orderController from "./controllers/orders.js"
app.use(orderController)

// TODO: Setup 404 and root page redirects
app.get("/", (request, response) => {
    response.status(301).redirect("/product_list")
})
app.get("*", (request, response) => {
    response.status(404).render("status.ejs", {
        status: "404 Not Found",
        message: "Insert funny joke about the page being missing here"
    })
})

app.listen(port, () => {
    console.log("Express server started on http://localhost:" + port)
    console.log("Products: http://localhost:" + port + "/product_list")
    console.log("Products: http://localhost:" + port + "/staff_admin")
})