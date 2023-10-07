import bcrypt from "bcryptjs";
import express from "express"
import * as Staff from "../models/staff.js"
import * as Changelog from "../models/changelog.js"
import access_control from "../access_control.js";

const staffController = express.Router()

staffController.get("/staff_login", (request, response) => {
    response.render("staff_login.ejs")
})

// Session viewing example
// staffController.get("/session_info", (request, response) => {
//     response.render("status.ejs", {
//         status: "Session info",
//         message: JSON.stringify(request.session)
//     })
// })

staffController.post("/staff_login", (request, response) => {
    const login_username = request.body.username
    const login_password = request.body.password

    // Lookup the user by their username
    Staff.getByUsername(login_username).then(staff => {
        // Then if there's a match - check if the password hashes match
        if (bcrypt.compareSync(login_password, staff.password)) {
            // Remember that the user is logged in (session)
            request.session.user = {
                staffID: staff.id,
                accessRole: staff.access_role,
            }

            const userLoginChangelogEntry = Changelog.newChangelog(
                null,
                null,
                staff.id,
                "User logged in"
            )
            Changelog.create(userLoginChangelogEntry).catch(error => {
                console.log("Failed to add to change log: " + userLoginChangelogEntry)
            })

            // response.render("status.ejs", {
            //     status: "Logged in!",
            //     message: "The login process worked!"
            // })

            // Redirect to staff page
            response.redirect("/staff_admin")
        } else {
            response.render("status.ejs", {
                status: "Login Failed",
                message: "The password was invalid"
            })
        }
    }).catch(error => {
        response.render("status.ejs", {
            status: "Login Failed",
            message: "The user was not found"
        })
    })
})

staffController.get("/staff_logout", (request, response) => {
    request.session.destroy()
    response.redirect("/")
})

staffController.get("/staff_admin",
    access_control(["admin"]),
    (request, response) => {
        const editID = request.query.edit_id;
        if (editID) {
            Staff.getById(editID).then(editStaff => {
                Staff.getAll().then(allStaff => {
                    response.status(200).render("staff_admin.ejs", {
                        allStaff,
                        editStaff,
                        accessRole: request.session.user.accessRole,
                    })
                })
            })
        } else {
            Staff.getAll().then(allStaff => {
                // let staffList = "";
                // for (const staff of allStaff) {
                //     staffList += staff.username + "<br>";
                // }
                //response.status(200).send("Here's staff!" + staffList);
                response.status(200).render("staff_admin.ejs", {
                    allStaff,
                    editStaff: Staff.newStaff(0, "", "", "", "", ""),
                    accessRole: request.session.user.accessRole,
                })

            }).catch(error => {
                response.status(500).send("An error happened! " + error)
            })
        }
    })

staffController.post("/edit_staff",
    access_control(["admin"]),
    (request, response) => {
        const formData = request.body;

        // @todo: validate input first name
        // @todo: validate input last name
        // @todo: validate input password

        // Create a staff model object to represent the staff member submitted
        const editStaff = Staff.newStaff(
            formData.staff_id,
            formData.first_name,
            formData.last_name,
            formData.access_role,
            formData.username,
            formData.password
        )

        // hash the password if it isn't already hashed
        if (!editStaff.password.startsWith("$2a")) {
            editStaff.password = bcrypt.hashSync(editStaff.password);
        }

        // Determine and run CRUD operation
        if (formData.action == "create") {
            Staff.create(editStaff).then(([result]) => {
                response.redirect("/staff_admin");
            });
        } else if (formData.action == "update") {
            Staff.update(editStaff).then(([result]) => {
                response.redirect("/staff_admin");
            });
        } else if (formData.action == "delete") {
            Staff.deleteById(editStaff.id).then(([result]) => {
                response.redirect("/staff_admin");
            });
        }

        const userUpdateChangelogEntry = Changelog.newChangelog(
            null,
            null,
            request.session.user.staffID,
            "User " + formData.action + "d another user with id " + editStaff.id
        )
        Changelog.create(userUpdateChangelogEntry).catch(error => {
            console.log("Failed to add to change log: " + userUpdateChangelogEntry)
        })

    })

export default staffController
