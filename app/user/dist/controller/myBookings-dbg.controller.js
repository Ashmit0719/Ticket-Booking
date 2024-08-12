sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/ui/model/Filter",
  "sap/ui/model/FilterOperator"
], function (Controller, Filter, FilterOperator) {
  "use strict";
  let userData = [];
  let bookingData = [];

  return Controller.extend("app.user.controller.myBookings", {
      onInit: function () {
          let userModel = this.getOwnerComponent().getModel();
          let userBindList = userModel.bindList("/Users");
          let bookingModel = this.getOwnerComponent().getModel();
          let bookingBindList = bookingModel.bindList("/Bookings");

          // Request contexts for both users and bookings
          Promise.all([
              userBindList.requestContexts(0, Infinity).then(function (users) {
                  users.forEach(function (user) {
                      userData.push(user.getObject());
                  });
              }),
              bookingBindList.requestContexts(0, Infinity).then(function (bookings) {
                  bookings.forEach(function (booking) {
                      bookingData.push(booking.getObject());
                  });
              })
          ]).then(function () {
              // This code will run after both user and booking data are fully loaded
              let userBookingModel = new sap.ui.model.json.JSONModel();
              let loggedInUserModel = sap.ui.getCore().getModel("loggedInUser");

              if (loggedInUserModel) {
                  let loggedInUsername = loggedInUserModel.getProperty("/username");

                  let filteredBooking = bookingData.filter(function (obj) {
                      return obj.username === loggedInUsername;
                  });

                  // Setting the filtered bookings to the model (if necessary)
                  userBookingModel.setData({ bookings: filteredBooking });
                  this.getView().setModel(userBookingModel, "userBookings");

                  console.log("bookings", filteredBooking);
                  console.log("BookData", bookingData);
                  console.log("userData", userData);
              } else {
                  console.error("No logged-in user found.");
              }
          }.bind(this)); // Bind this to maintain the correct context
      },

      onSearch: function (oEvent) {
          var sQuery = oEvent.getParameter("newValue"); // Get the search query
          var aFilters = [];
          if (sQuery && sQuery.length > 0) {
              // Create a filter for the trainName property
              var oFilter = new Filter({
                  filters: [new Filter("trainName", FilterOperator.Contains, sQuery)],
                  and: false
              });
              aFilters.push(oFilter);
          }

          // Get the binding of the table items and apply the filter
          var oTable = this.byId("bookingsTable");
          var oBinding = oTable.getBinding("items");
          oBinding.filter(aFilters, "Application");
      }
  });
});
