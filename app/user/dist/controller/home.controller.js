sap.ui.define(["sap/ui/core/mvc/Controller"],function(o){"use strict";return o.extend("app.user.controller.home",{onInit:function(){},onBookTicket:function(){const o=this.getOwnerComponent().getRouter();o.navTo("RoutebookTicket")},myBookings:function(){const o=this.getOwnerComponent().getRouter();o.navTo("RoutemyBookings")}})});
//# sourceMappingURL=home.controller.js.map