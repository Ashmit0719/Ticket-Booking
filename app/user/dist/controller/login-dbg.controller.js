sap.ui.define([
    "sap/ui/core/mvc/Controller"
], function (Controller) {
    "use strict";
    var validateNewUser1;

    return Controller.extend("app.user.controller.login", {
        onInit: function () {
            var that = this;

            // Create a JSON model for user login data and set it to the view
            var userLoginModel = new sap.ui.model.json.JSONModel();
            that.getView().setModel(userLoginModel, "userLoginModel");

            // Get the main model and bind to the /Users path
            var oModel = that.getOwnerComponent().getModel();
            var oBindList = oModel.bindList("/Users");

            // Request all user data and set it to the userLoginModel
            oBindList.requestContexts(0, Infinity).then(function (contexts) {
                var users = contexts.map(function (context) {
                    return context.getObject();
                });

                userLoginModel.setData(users);

                // Create a simplified list of users for validation
                validateNewUser1 = users.map(function (user) {
                    return {
                        username: user.username,
                        password: user.password
                    };
                });
            });
        },

        onLogin: function () {
            const username1 = this.byId("usernameInput").getValue();
            const password1 = this.byId("passwordInput").getValue();

            if (username1 === "" || password1 === "") {
                sap.m.MessageToast.show("Please enter the username and password first", {
                    duration: 3000,
                    width: "15em",
                    my: "center top",
                    at: "center top",
                    of: window,
                    offset: "30 30"
                });
                return;
            }

            var loggedIn = validateNewUser1.some((user) => {
                if (user.username === username1 && user.password === password1) {
                    sap.m.MessageToast.show("Successfully Logged in", {
                        duration: 3000,
                        width: "15em",
                        my: "center top",
                        at: "center top",
                        of: window,
                        offset: "30 30"
                    });

                    // Save the logged-in username in a global model
                    var loggedInUserModel = new sap.ui.model.json.JSONModel({ username: username1 });
                    sap.ui.getCore().setModel(loggedInUserModel, "loggedInUser");

                    const home = this.getOwnerComponent().getRouter();
                    home.navTo("Routehome");
                    return true;
                }
                return false;
            });

            if (!loggedIn) {
                sap.m.MessageToast.show("Invalid Username or Password", {
                    duration: 3000,
                    width: "15em",
                    my: "center top",
                    at: "center top",
                    of: window,
                    offset: "30 30"
                });
            }
        },

        onSignUpPress: function () {
            const signUpPage = this.getOwnerComponent().getRouter();
            signUpPage.navTo("RoutesignUp");
        }
    });
});
