sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
],
    function (Controller, JSONModel) {
        "use strict";
        var validateNewUser;
        var users;

        return Controller.extend("app.admin.controller.login", {
            onInit: function () {
                var that = this;

                var loadDataPromise = new Promise(function (resolve, reject) {
                    var loginModel = new sap.ui.model.json.JSONModel();
                    that.getView().setModel(loginModel, "loginModel");
                    let oModel = that.getOwnerComponent().getModel();
                    let oBindList = oModel.bindList("/Users");
                    oBindList.requestContexts(0, Infinity).then(function (aContexts) {
                        users = [];
                        aContexts.forEach(function (oContext) {
                            users.push(oContext.getObject());
                        });
                        loginModel.setData(users);
                        var usersModelData = that.getView().getModel("loginModel").getData();
                        validateNewUser = usersModelData.map(function (obj) {
                            return {
                                uid: obj.uid,
                                username: obj.username,
                                password: obj.password,
                                access: obj.access
                            };
                        });
                        // console.log("Validate New Parameter", validateNewUser);
                        resolve(users);
                    });
                });

            },

            onLogin: function () {
                const username = this.byId("usernameInput").getValue();
                const password = this.byId("passwordInput").getValue();

                if (username == "" || password == "") {
                    sap.m.MessageToast.show("Please enter the username and password first", {
                        duration: 3000,
                        width: "15em",
                        my: "center top",
                        at: "center top",
                        of: window,
                        offset: "30 30",
                        onClose: function () {
                            console.log("Message toast closed");
                        }
                    });
                    return;
                }
                else {
                    validateNewUser.forEach((user) => {
                        if (username === username && password === password) {
                            sap.m.MessageToast.show("Successfully Logged in", {
                                duration: 3000,
                                width: "15em",
                                my: "center top",
                                at: "center top",
                                of: window,
                                offset: "30 30",
                                onClose: function () {
                                    console.log("Message toast closed");
                                }
                            });
                            const adminHome = this.getOwnerComponent().getRouter();
                            adminHome.navTo("RouteadminHome");
                            return;
                        }
                   
                    sap.m.MessageToast.show("Invalid Username or Password", {
                        duration: 3000,
                        width: "15em",
                        my: "center top",
                        at: "center top",
                        of: window,
                        offset: "30 30",
                        onClose: function () {
                            console.log("Message toast closed");
                        }
                    });
                });
                    return;
                }
            }
        });
    });
