sap.ui.define(["sap/ui/core/mvc/Controller"], function (Controller) {
  "use strict";

  return Controller.extend("app.user.controller.home", {
    onInit: function () {
      // Initialization code
    },
    onBookTicket: function () {
      const bookTicket = this.getOwnerComponent().getRouter();
      bookTicket.navTo("RoutebookTicket");
    },
    myBookings: function () {
      const myBookings = this.getOwnerComponent().getRouter();
      myBookings.navTo("RoutemyBookings");
    },
  });
});
