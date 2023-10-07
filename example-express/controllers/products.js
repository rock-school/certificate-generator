import express from "express"
import * as Products from "../models/products.js"

const productController = express.Router()

productController.get("/product_list", (request, response) => {
    if (request.query.search_term) {
        Products.getBySearch(request.query.search_term).then(products => {
            response.status(200).render("product_list.ejs", { products })
        }).catch(error => {
            response.status(500).send("An error happened! " + error)
        })
    } else {
        Products.getAll().then(products => {
            response.status(200).render("product_list.ejs", { products })
        }).catch(error => {
            response.status(500).send("An error happened! " + error)
        })
    }
})

productController.get("/product_checkout", (request, response) => {
    // Check if there's a selected product in the url
    if (request.query.id) {
        // Load details of the selected product
        Products.getById(request.query.id).then(product => {
            // Render checkout page view with selected product
            response.render("product_checkout.ejs", { product })
        }).catch(error => {
            response.status(500).send("An error happened! " + error)
        })
    }
})

export default productController