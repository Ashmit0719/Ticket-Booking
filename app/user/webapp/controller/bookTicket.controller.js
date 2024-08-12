sap.ui.define([
    'sap/ui/core/mvc/Controller',
    'sap/ui/model/json/JSONModel',
    'sap/ui/model/Filter',
    'sap/ui/model/FilterOperator'
],
function (Controller, JSONModel, Filter, FilterOperator) {
    "use strict";
    var oSelectedTrain;

    return Controller.extend("app.user.controller.bookTickets", {
        onInit: function () {
            var that = this;

            var loadTrainsPromise = this._loadTrainsData();
            var loadBookingsPromise = this._loadBookingsData();

            Promise.all([loadTrainsPromise, loadBookingsPromise]).then(function (results) {
                var trains = results[0];
                var bookings = results[1];

                trains.forEach(function (train) {
                    var seatingCapacity = parseInt(train.seatingCapacity);
                    var bookedSeats = bookings
                        .filter(function (booking) {
                            return booking.trainCode === train.trainCode;
                        })
                        .reduce(function (sum, booking) {
                            return sum + parseInt(booking.noOfSeatsBooked);
                        }, 0);

                    train.availableSeats = seatingCapacity - bookedSeats;
                });

                var trainsModel = new JSONModel({ entries: trains });
                that.getView().setModel(trainsModel, "trainsModel");

                var oTable = that.getView().byId("trainsTable");
                oTable.setModel(trainsModel);
                oTable.bindItems({
                    path: "trainsModel>/entries",
                    template: new sap.m.ColumnListItem({
                        cells: [
                            new sap.m.Text({ text: "{trainsModel>trainCode}" }),
                            new sap.m.Text({ text: "{trainsModel>trainName}" }),
                            new sap.m.Text({ text: "{trainsModel>sourceStation}" }),
                            new sap.m.Text({ text: "{trainsModel>destinationStation}" }),
                            new sap.m.Text({ text: "{trainsModel>ticketPrice}" }),
                            new sap.m.Text({ text: "{trainsModel>availableSeats}" }),
                            new sap.m.Button({ icon: "sap-icon://action", press: this.onBookTicketPress.bind(this) })
                        ]
                    })
                });
            }.bind(this));
        },

        _loadTrainsData: function () {
            var that = this;
            return new Promise(function (resolve, reject) {
                var trainsModel = new sap.ui.model.json.JSONModel();
                that.getView().setModel(trainsModel, "trainsModel");
                let oModel = that.getOwnerComponent().getModel();
                let oBindList = oModel.bindList("/Trains");
                oBindList.requestContexts(0, Infinity).then(function (aContexts) {
                    var trains = [];
                    aContexts.forEach(function (oContext) {
                        trains.push(oContext.getObject());
                    });
                    resolve(trains);
                });
            });
        },

        _loadBookingsData: function () {
            var that = this;
            return new Promise(function (resolve, reject) {
                var bookingsModel = new sap.ui.model.json.JSONModel();
                that.getView().setModel(bookingsModel, "bookingsModel");
                let oModel = that.getOwnerComponent().getModel();
                let oBindList = oModel.bindList("/Bookings");
                oBindList.requestContexts(0, Infinity).then(function (aContexts) {
                    var bookings = [];
                    aContexts.forEach(function (oContext) {
                        bookings.push(oContext.getObject());
                    });
                    resolve(bookings);
                });
            });
        },

        onBookTicketPress: function (oEvent) {
            var oItem = oEvent.getSource().getParent();
            var oContext = oItem.getBindingContext("trainsModel");
            oSelectedTrain = oContext.getObject();
            console.log("Selected Train:", oSelectedTrain);

            // Show passenger details form
            var oPassengerDetailsPanel = this.getView().byId("_IDGenPanel2");
            oPassengerDetailsPanel.setVisible(true);

            // Set the logged-in username in the username input field
            var oLoggedInUserModel = sap.ui.getCore().getModel("loggedInUser");
            if (oLoggedInUserModel) {
                var username = oLoggedInUserModel.getProperty("/username");
                this.byId("username").setValue(username);
            }
        },

        onBookTicketsPress: function () {
            var that = this;

            const username = this.byId("username").getValue();
            const noOfSeatsBooked = this.byId("numSeats").getValue();

            if (noOfSeatsBooked > oSelectedTrain.availableSeats) {
                sap.m.MessageToast.show('Number of seats available is less than your request', {
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
            } else if (username === "") {
                sap.m.MessageToast.show('Enter Username', {
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
            } else if (noOfSeatsBooked <= 0) {
                sap.m.MessageToast.show('Number of seats cannot be zero (0)', {
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
                    id: Math.round(Math.random() * 100),
                    uid: 108, // Ideally, this should be the user's actual UID
                    username: username,
                    trainCode: parseInt(oSelectedTrain.trainCode),
                    trainName: oSelectedTrain.trainName,
                    noOfSeatsBooked: parseInt(noOfSeatsBooked),
                    sourceStation: oSelectedTrain.sourceStation,
                    destinationStation: oSelectedTrain.destinationStation
                };

                let oModel = this.getView().getModel();
                let oBindListField = oModel.bindList("/Bookings");
                oBindListField.create(fieldEntry);

                sap.m.MessageToast.show('Successfully Booked your tickets', {
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

                const home = this.getOwnerComponent().getRouter();
                home.navTo("Routehome");
            }
        },

        onFilterTrains: function () {
            var oView = this.getView();
            var fromStation = oView.byId("fromStation").getValue();
            var toStation = oView.byId("toStation").getValue();
            var trainName = oView.byId("trainName1").getValue();
            var selectedClass = oView.byId("classSegmentedButton").getSelectedKey();

            var aFilters = [];

            if (fromStation) {
                aFilters.push(new Filter("sourceStation", FilterOperator.Contains, fromStation));
            }
            if (toStation) {
                aFilters.push(new Filter("destinationStation", FilterOperator.Contains, toStation));
            }
            if (trainName) {
                aFilters.push(new Filter("trainName", FilterOperator.Contains, trainName));
            }
            if (selectedClass) {
                aFilters.push(new Filter("class", FilterOperator.EQ, selectedClass));
            }

            var oTable = oView.byId("trainsTable");
            var oBinding = oTable.getBinding("items");
            oBinding.filter(aFilters);
        }
    });
});
