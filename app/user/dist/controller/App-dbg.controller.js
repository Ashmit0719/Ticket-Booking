sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/routing/History"
  ],
  function (BaseController, History) {
    "use strict";

    return BaseController.extend("app.user.controller.App", {
      onInit: function () {
      },

      onPressBack: function () {
        
        window.history.back();
      },
      onLogoPressed: function(){
        const oRouter = this.getOwnerComponent().getRouter();
        oRouter.navTo("Routehome");

      },
      onAvatarPressed: function(){
        const oRouter = this.getOwnerComponent().getRouter();
        oRouter.navTo("Routelogin");
        
      }

    });
  }
);
