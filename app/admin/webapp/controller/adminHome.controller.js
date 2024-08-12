sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    'sap/ui/core/Fragment',
    "sap/m/MessageToast"
], function (Controller, JSONModel, Fragment, MessageToast) {
    "use strict";

    return Controller.extend("app.admin.controller.adminHome", {
        onInit: function () {

            this.oView = this.getView();
            const addNewTrainModel = new JSONModel();
            this.oView.setModel(addNewTrainModel, "addNewTrainModel");
        },

        onAddNewTrain: function () {
            if (!this._oDialogItem) {
                this._oDialogItem = sap.ui.xmlfragment("app.admin.fragments.addNewTrain", this);
                this.oView.addDependent(this._oDialogItem);
            }
            this._oDialogItem.open();
        },

        oncancelNewTrain: function () {
            this._oDialogItem.close();
        },

        onsaveNewTrain: function () {
            var oModel = this.getOwnerComponent().getModel(); // Retrieve the OData model
            if (!oModel) {
                console.error("OData Model is undefined or null.");
                return;
            }

            // Retrieve the values from the input fields in the fragment
            var trainCode = parseInt(sap.ui.getCore().byId("trainCodeInput").getValue(), 10);
            var trainName = sap.ui.getCore().byId("trainNameInput").getValue();
            var sourceStation = sap.ui.getCore().byId("sourceStationInput").getValue();
            var destinationStation = sap.ui.getCore().byId("destinationStationInput").getValue();
            var srcDepartureTime = sap.ui.getCore().byId("srcDepartureTimeInput").getValue();
            var dstnArrivalTime = sap.ui.getCore().byId("dstnArrivalTimeInput").getValue();
            var seatingCapacity = parseInt(sap.ui.getCore().byId("seatingCapacityInput").getValue(), 10);
            var ticketPrice = parseInt(sap.ui.getCore().byId("ticketPriceInput").getValue(), 10);

            var oBindList = oModel.bindList("/Trains");

            oBindList.create({
                trainCode: trainCode,
                trainName: trainName,
                sourceStation: sourceStation,
                destinationStation: destinationStation,
                srcDepartureTime: srcDepartureTime,
                dstnArrivalTime: dstnArrivalTime,
                seatingCapacity: seatingCapacity,
                ticketPrice: ticketPrice
            });

            console.log("Success");
            oModel.refresh();
            this._oDialogItem.close();
        }
    });
});
