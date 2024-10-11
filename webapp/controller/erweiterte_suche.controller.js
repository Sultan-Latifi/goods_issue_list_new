sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"com/mindsquare/gdmvt/remove/mdeapp/controller/baseController"
], function (Controller, baseController) {
	"use strict";
	return baseController.extend("com.mindsquare.gdmvt.remove.mdeapp.controller.erweiterte_suche", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf com.mindsquare.gdmvt.remove.mdeapp..viewerweiterte_suche
		 */
		onInit: function () {
			debugger;
		},
		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf com.mindsquare.gdmvt.remove.mdeapp..viewerweiterte_suche
		 */ //	onBeforeRendering: function() {
		//
		//	},
		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf com.mindsquare.gdmvt.remove.mdeapp..viewerweiterte_suche
		 */ //	onAfterRendering: function() {
		//
		//	},
		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf com.mindsquare.gdmvt.remove.mdeapp..viewerweiterte_suche
		 */ //	onExit: function() {
		//
		//	}
		/**
		 *@memberOf com.mindsquare.gdmvt.remove.mdeapp.controller.erweiterte_suche
		 */
		onPageNavButtonPress: function () {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("auftragssuche");
		},
		OnBtnExtSearchPress: function (oEvent) {
			//Routing
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("auftragsauswahl");
		}
	});
});