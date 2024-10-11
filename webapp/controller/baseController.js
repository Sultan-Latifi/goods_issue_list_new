sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/routing/History",
	"sap/m/Button",
	"sap/m/Dialog",
	"sap/m/Text",
	"sap/m/MessageToast"
], function (Controller, History, Button, Dialog, Text, MessageToast) {
	"use strict";

	return Controller.extend("com.mindsquare.gdmvt.remove.mdeapp.controller.baseController", {

		_aBlacklist: ["ST"], //Blacklist = nur Ganzzahlen zugelassen

		getI18n: function () {
			  
			return this.getView().getModel("i18n").getResourceBundle();
		},

		getRouter: function () {
			  
			return sap.ui.core.UIComponent.getRouterFor(this);
		},

		_getModel: function (sModel) {
			  
			return this.getView().getModel(sModel);
		},

		checkFormat: function (oContext) {
			  
			var sMenge = oContext.getProperty("Menge");
			var sMeinh = oContext.getProperty("Meinh");
			var vReturn;
			// Methode zum Prüfen, ob Ganzzalen oder Kommazahlen zugelassen sind; Abbhängig von Meinh; Prüfung via Blacklist
			for (var i = 0; i < this._aBlacklist.length; i++) {
				if (sMeinh === this._aBlacklist[i]) {
					if (sMenge.includes(",") || sMenge.includes(".")) {
						vReturn = false;
					} else vReturn = true;
				} else vReturn = true;
			}
			return vReturn;
		},

		getFormatType: function (oContext) {
			  
			// Methode zum Prüfen, ob Ganzzalen oder Kommazahlen zugelassen sind; Abbhängig von Meinh; Prüfung via Blacklist
			for (var i = 0; i < this._aBlacklist.length; i++) {
				if (oContext.getProperty("Meinh") === this._aBlacklist[i]) {
					return this.getIntegerFormat();
				}
			}
			return this.getDecimalFormat();
		},

		getFormatTypeValue: function (sMeinh) {
			  
			// Methode zum Prüfen, ob Ganzzalen oder Kommazahlen zugelassen sind; Abbhängig von Meinh; Prüfung via Blacklist
			for (var i = 0; i < this._aBlacklist.length; i++) {
				if (sMeinh === this._aBlacklist[i]) {
					return "integer";
				}
			}
			return "float";
		},

		onNavBack: function () {
			  
			var sPreviousHash = History.getInstance().getPreviousHash();
			if (sPreviousHash !== undefined) {
				history.go(-1);
			} else {
				this.getRouter().navTo("TargetsearchAufnr", {}, true /*no history*/ );
			}
		},

		getIntegerFormat: function () {
			  
			var oNumberFormat = "";
			if (this.getCurrentLocale() === "de-DE") {
				oNumberFormat = sap.ui.core.format.NumberFormat.getIntegerInstance({
					maxFractionDigits: 0,
					groupingEnabled: true,
					groupingSeparator: "."
				});
			} else {
				oNumberFormat = sap.ui.core.format.NumberFormat.getIntegerInstance({
					maxFractionDigits: 0,
					groupingEnabled: true,
					groupingSeparator: ","
				});
			}
			return oNumberFormat; //Returns a NumberFormat instance for integer
		},

		getDecimalFormat: function () {
			  
			var oNumberFormat = "";
			if (this.getCurrentLocale() === "de-DE") {
				oNumberFormat = sap.ui.core.format.NumberFormat.getFloatInstance({
					minFractionDigits: 3,
					maxFractionDigits: 3,
					groupingEnabled: true,
					groupingSeparator: ".",
					decimalSeparator: ","
				});
			} else {
				oNumberFormat = sap.ui.core.format.NumberFormat.getFloatInstance({
					minFractionDigits: 3,
					maxFractionDigits: 3,
					groupingEnabled: true,
					groupingSeparator: ",",
					decimalSeparator: "."
				});
			}
			return oNumberFormat; //Returns a NumberFormat instance for float
		},

		getCurrentLocale: function () { //liefert die verwendete Sprache des Nutzers	
			return sap.ui.getCore().getConfiguration().getLanguage();
		},

		isEmpty: function (str) {
			return !str || str.length === 0;
		},

		showMessageErrorDialog: function (message) {
			  
			var dialog = new Dialog({
				title: "Error",
				type: "Message",
				state: "Error",
				content: new Text({
					text: message
				}),
				beginButton: new Button({
					text: "OK",
					press: function () {
						dialog.close();
					}
				}),
				afterClose: function () {
					dialog.destroy();

					//Alban change 5/2/2023 add focus on material input field by accesing the input id from global model
					var oInputField = sap.ui.getCore().getModel("focusId").getData().focus;
					jQuery.sap.delayedCall(750, this, function () {
						oInputField.focus();
					});
					// oInputField.focus();
					//Alban change 5/2/2023 add focus on material input field by accesing the input id from global model
				}
			});
			dialog.open();
		},

		showSuccessMessage: function (hdrMessageObject, iDuration) {
			  
			var duration;
			if (iDuration === undefined) {
				duration = 3000;
			} else {
				duration = iDuration;
			}
			// response header
			sap.m.MessageToast.show(hdrMessageObject.message, {
				duration: duration, // default
				width: "15em", // default
				my: "center bottom", // default
				at: "center bottom", // default
				of: window, // default
				offset: "0 -100", // default
				collision: "fit fit", // default
				onClose: null, // default
				autoClose: true, // default
				animationTimingFunction: "ease", // default
				animationDuration: 1000, // default
				closeOnBrowserNavigation: true // default
			});
		},

		onPageNavButtonPress: function (oEvent) {
			  
			var oHistory, sPreviousHash;
			oHistory = History.getInstance();
			sPreviousHash = oHistory.getPreviousHash();
			if (sPreviousHash !== undefined) {
				window.history.go(-1);
			} else {
				this.getRouter().navTo("auftragsauswahl", {}, true /*no history*/ );
			}
		},

		setFocusOn: function (oControl) {
			  
			oControl.addEventDelegate({
				onAfterRendering: function () {
					oControl.focus();
				}.bind(this)
			});
		},

		//Registriert eine Funktion (sFunction) auf das Feld (oControl), welches beim Drücken der Entertaste ausgeführt wird
		registerFnOnPressEnter: function (oControl, sFunction) {
			  
			oControl.addEventDelegate({
				onsapenter: sFunction.bind(this)
			});
		},

		//Setzt den Focus nach einem Enter auf das Feld oTarget
		afterEnterSetFocusOn: function (oControl, oTarget) {
			  
			this.registerFnOnPressEnter(oControl, this.setFocusOn(oTarget));
		},

		cancelMaterialProcess: function () {
			  
			this.getView().getModel("materialList").setData({
				materials: []
			});
			this.getOwnerComponent().getRouter().navTo("auftragsauswahl", {}, true /*no history*/ );
			this.tagRemovedMaterial("reset");
		},

		formatQuantity: function (sMenge, sMeins) {
			  
			if (sMeins === "PAK" || sMeins === "ST") {
				var sReturn = sMenge.split(".");
				return sReturn[0];
			} else {
				return sMenge;
			}
		},

		splitBarcode: function (input) {
			  
			//Prüfen ob / im Bacrode enthalten ist
			if (input.includes("/")) {
				return null;
			}
			//Trennzeichen @ = Charge | & = Menge
			var arr = input.split(/[@&\s]/);
			var barcode = {
				matnr: arr[0],
				charg: arr[1],
				menge: arr[2]
			};
			if (barcode.charg === undefined) {
				barcode.charg = "";
			}
			if (barcode.menge === undefined) {
				barcode.menge = "";
			}
			return barcode;
		},

		convertDecimal: function (sInput) {
			  
			if (Number.isInteger(sInput)) {
				sInput = sInput.toString();
			}
			if (sInput.includes(",")) {
				sInput = sInput.replace(",", ".");
			}
			return sInput;
		},

		tagRemovedMaterial: function (param) {
			  
			if (param !== "set" && param !== "reset") {
				return;
			}
			var aMaterialList = this.getView().byId("materialList").getItems();
			var aBasketList = this.getOwnerComponent().getModel("materialList").getData().materials;
			for (var m = 0; m < aMaterialList.length; m++) {
				if (param === "set") { //gewählten Eintrag markeieren
					aMaterialList[m].setHighlight(sap.ui.core.MessageType.None);
					for (var b = 0; b < aBasketList.length; b++) {
						var oMaterial = aMaterialList[m].getBindingContext().getObject();
						if (oMaterial && oMaterial.Matnr === aBasketList[b].Matnr && oMaterial.Charg === aBasketList[b].Charg) {
							aMaterialList[m].setHighlight(sap.ui.core.MessageType.Warning);
						}
					}
				} else { // alle Einträge --> default
					aMaterialList[m].setHighlight(sap.ui.core.MessageType.None);
				}
			}
		},
		getCurrentRoute: function (oRouter) {
			  
			var currentHash = oRouter.getHashChanger().getHash();
			var routeName = oRouter.getRouteInfoByHash(currentHash); // since 1.75
			return routeName;
		},
		onUserSettingsPress: function (oEvent) {
			  
			// navigate to User Settings app
			var sSemObj = this.getView().getModel("customizingModel").getData().UsrParamSemObj;
			var oCrossAppNav = sap.ushell.Container.getService("CrossApplicationNavigation");
			oCrossAppNav.toExternal({
				target: {
					semanticObject: sSemObj,
					action: "display"
				}
			});
		}
	});
});