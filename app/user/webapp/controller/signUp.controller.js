
sap.ui.define([
    "sap/ui/core/mvc/Controller"
],
    function (Controller) {
        "use strict";
        var lastUID

        return Controller.extend("app.user.controller.signUp", {
            onInit: function () {

            },


            onLastUID: function () {
                try {
                    var oTable = this.getView().byId("Users");
                    var oItems = oTable.getItems();

                    var usedIDs = new Set();

                    oItems.forEach(function (oItem) {
                        var currentID = parseInt(oItem.getCells()[0].getText(), 10);
                        if (!isNaN(currentID)) {
                            usedIDs.add(currentID);
                        }
                    });

                    // Find the smallest available ID
                    for (let i = 1; i <= oItems.length + 1; i++) {
                        if (!usedIDs.has(i)) {
                            lastUID = i;
                            break;
                        }
                    }
                } catch (error) {
                    lastUID = "1";
                }

            },

            onSignUp: function () {
                const username = this.byId("usernameInput").getValue();
                const email = this.byId("emailInput").getValue();
                const phone = this.byId("phoneInput").getValue();
                const password = this.byId("passwordInput").getValue();
                const password2 = this.byId("passwordInput2").getValue();

                if (username === '' || email === '' || phone === '' || password === '' || password2 === '') {
                    sap.m.MessageToast.show('Fields cannot be blank', {
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
                else if (password !== password2) {
                    sap.m.MessageToast.show('Password and confirm password do not matched', {
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
                } else {
                    var fieldEntry = {
                        uid: Math.round(Math.random() * 100),
                        username: username,
                        email: email,
                        phone: phone,
                        password: password,
                        access: "User"
                    };

                    let oModel = this.getView().getModel();
                    let oBindListField = oModel.bindList("/Users");
                    oBindListField.create(fieldEntry);

                    sap.m.MessageToast.show('Successfully registered', {
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

                    const loginPage = this.getOwnerComponent().getRouter();
                    loginPage.navTo("Routelogin");
                }

            },
        });
    });
