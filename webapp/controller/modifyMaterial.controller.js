sap.ui.define([
	"com/mindsquare/gdmvt/remove/mdeapp/controller/baseController",
	"sap/m/Button",
	"sap/m/Dialog",
	"sap/m/Text",
	"sap/m/MessageToast",
	"sap/m/MessageBox",
	'sap/ui/model/json/JSONModel'

], function (baseController, Button, Dialog, Text, MessageToast, MessageBox, JSONModel) {
	"use strict";
	return baseController.extend("com.mindsquare.gdmvt.remove.mdeapp.controller.modifyMaterial", {

		onInit: function () {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.getRoute("addMaterialMod").attachPatternMatched(this.handleRouteAddMaterialMatchedMod, this);
			oRouter.getRoute("addMaterialModSer").attachPatternMatched(this.handleRouteAddMaterialMatchedModSer, this);
			oRouter.getRoute("addMaterialChargMod").attachPatternMatched(this.handleRouteAddMaterialChargModMatched, this);
			oRouter.getRoute("addMaterialBarcode").attachPatternMatched(this.handleRouteAddMaterialBarcodeMatched, this);
			this.scanItem = "";
			this.Matnr = "";
			this.Matnr1 = {};
			this.Materials = {};
			this.btnCancelFlag = "false";
		},

		SerialTabChange: function (oEvent) {
			var sValue = oEvent.getParameter("value")
			this.initSerialTable(sValue);
		},

		initSerialTable: function (Anzahl) {
			var oTableData = [];
			var iRowCount = Anzahl;
			var input = 123;
			var aModel = this.getView().getModel("Sernr");
			var oSernrArr = aModel.getProperty("/");
			// Anzahl der Zeilen
			for (var i = 0; i < iRowCount; i++) {
				oTableData.push({
					column1: oSernrArr[i],
					
				});
			}
			var oModel = new JSONModel({
				tableData: oTableData
			});
			this.getView().setModel(oModel, "SerialTab");
			// this.getView().setModel(oModel);
		},

		handleRouteAddMaterialMatchedMod: function (oEvent) { //Modify Alban Elezi 1.11.2021
			var result = oEvent.getParameter("arguments").details;
			var details = JSON.parse(result);
			this.sSelectedItem = details;
			var oView = this.getView();

			var oCtx = this.getView().getModel("materialList").getProperty("/materials/" + details.sPath);
			var sDetails = [{
				sRsnum: details.sRsnum,
				sRspos: details.sRspos,
				sAusme: oCtx.Ausme,
				sAvailableQan: oCtx.AvailableQan,
				sLgort: oCtx.Lgort,
				sLgpbe: oCtx.Lgpbe,
				sMaktx: oCtx.Maktx,
				sMatnr: oCtx.Matnr,
				sSernr: oCtx.Sernr,
				sSerpf: oCtx.Serpf,
				// sSernr: details.sSernr,
				sCharg: details.sCharg,
				sMenge: details.sMenge,
				sParamFrom: oCtx.ParamFrom,
				sParamTo: oCtx.ParamTo,
				sIndex: oCtx.Index,
				sRfmng: oCtx.Rfmng,
				sLfimg: oCtx.Lfimg,
				sPikmg: oCtx.Pikmg,
				sFlag: details.sFlag
			}];

			this.sChangeFlag = details.sFlag;
			this.sSelectedIndex = oCtx.Index;

			oView.byId("tableId").setVisible(false);
			oView.byId("tableId").removeAllItems();
			//Call material context for normal material
			this.createMaterialContext(sDetails);
		},
		onAfterRendering: function () {
			var iMenge = this.getView().byId("iMenge");
			this.onReFocus(iMenge);
		},

		onReFocus: function (pView) {
			// var iSearchInventory = this.getView().byId("iSearchInventory");
			jQuery.sap.delayedCall(1000, this, function () {
				pView.focus();
			});
			// pView.focus();
		},

		handleRouteAddMaterialMatchedModSer: function (oEvent) { //Modify Alban Elezi 1.11.2021
			var result = oEvent.getParameter("arguments").details;
			var details = JSON.parse(result);
			this.details = details;
			this.sSelectedItem = details;
			var oView = this.getView();

			var oCtx = this.getView().getModel("materialList").getProperty("/materials/" + details.sPath);
			var sDetails = [{
				sRsnum: details.sRsnum,
				sAusme: oCtx.Ausme,
				sAvailableQan: oCtx.AvailableQan,
				sLgort: oCtx.Lgort,
				sLgpbe: oCtx.Lgpbe,
				sMaktx: oCtx.Maktx,
				sMatnr: oCtx.Matnr,
				sSernr: oCtx.Sernr,
				sSerpf: oCtx.Serpf,
				sCharg: oCtx.Charg,
				sMenge: oCtx.Menge,
				sParamFrom: oCtx.ParamFrom,
				sParamTo: oCtx.ParamTo,
				sIndex: oCtx.Index,
				sFlag: details.sFlag
			}];

			var sSernr = oCtx.Sernr;
			this.sChangeFlag = details.sFlag;
			this.sSelectedIndex = oCtx.Index;
			this.createMaterialContext(sDetails);
			var sSplitSernr = sSernr.split(";");

			this.getView().byId("tableId").removeAllItems();
			// call the input submit function to simulate the adding of serial numbers
			for (var i = 0; i < sSplitSernr.length; ++i) {
				this.addSerialNumber(sSplitSernr[i]);
			}
		},

		handleRouteAddMaterialChargModMatched: function (oEvent) { //Modify Alban Elezi 1.11.2021
			var result = oEvent.getParameter("arguments").details;
			var details = JSON.parse(result);
			this.sSelectedItem = details;
			var oView = this.getView();

			var oCtx = this.getView().getModel("materialList").getProperty("/materials/" + details.sPath);
			var sDetails = [{
				sRsnum: details.sRsnum,
				sAusme: oCtx.Ausme,
				sAvailableQan: oCtx.AvailableQan,
				sLgort: oCtx.Lgort,
				sLgpbe: oCtx.Lgpbe,
				sMaktx: oCtx.Maktx,
				sMatnr: oCtx.Matnr,
				sSernr: oCtx.Sernr,
				sSerpf: oCtx.Serpf,
				sCharg: oCtx.Charg,
				sMenge: oCtx.Menge,
				sParamFrom: oCtx.ParamFrom,
				sParamTo: oCtx.ParamTo,
				sIndex: oCtx.Index,
				sFlag: details.sFlag
			}];

			this.sChangeFlag = details.sFlag;
			this.sSelectedIndex = oCtx.Index;

			oView.byId("tableId").setVisible(false);
			oView.byId("tableId").removeAllItems();
			//call material context for material with charg
			this.modifyMaterialContext(sDetails);
		},

		handleRouteAddMaterialBarcodeMatched: function (oEvent) {

			var sBarcode = oEvent.getParameter("arguments").barcode;
			var oBarcode = this.splitBarcode(sBarcode);

			this.sChangeFlag = "";
			this.sSelectedIndex = "";

			this.createMaterialContext(oBarcode.matnr, oBarcode.charg, oBarcode.menge);
		},

		addMaterialByReservation: function (oEvent) {
			// this._origin = "material";
			var oView = this.getView();
			var oModel = oView.getModel();
			oView.setBindingContext(
				new sap.ui.model.Context(
					oModel, "/" + oEvent.getParameter("arguments").path
				)
			);
		},

		createMaterialContext: function (details) {
			// create an entry of the Material collection with the specified properties and values
			var oModel = this.getView().getModel();
			var oView = this.getView();
			var sPath = "/MaterialSet(" + "Rsnum='" + details[0].sRsnum + "',Rspos='" + details[0].sRspos + "',Matnr='" + details[0].sMatnr +
				"',Charg='" + details[0].sCharg + "')";
			var oContext = oModel.createEntry("/MaterialSet", {
				properties: {
					Matnr: details[0].sMatnr,
					Charg: details[0].sCharg,
					Rsnum: details[0].sRsnum,
					Sernr: details[0].sSernr
				}
			});

			var oMessageManager = sap.ui.getCore().getMessageManager();
			oMessageManager.removeAllMessages();
			//get material information
			oModel.read(sPath, {
				success: function (oData) {

					if (details[0].sSernr) {
						var oSernr = details[0].sSernr.split(",");
						this.getView().getModel("Sernr").setProperty("/", oSernr, oContext);
					}
					oModel.setProperty("Rfmng", parseFloat(oData.Rfmng), oContext);
					oModel.setProperty("Lfimg", parseFloat(oData.Lfimg), oContext);
					oModel.setProperty("Pikmg", parseFloat(oData.Pikmg), oContext);   
					oModel.setProperty("Matnr", details[0].sMatnr, oContext);
					oModel.setProperty("Maktx", details[0].sMaktx, oContext);
					oModel.setProperty("StockQuant", details[0].sStockQuant, oContext);
					oModel.setProperty("Ausme", details[0].sAusme, oContext);
					oModel.setProperty("Serpf", details[0].sSerpf, oContext);
					oModel.setProperty("Rsnum", oData.Rsnum, oContext);
					oModel.setProperty("Rspos", oData.Rspos, oContext);
					//Alban modification 4/26/2023 in case of Unit ST save menge without decimals
					var oMenge = details[0].sAusme == 'ST' ? parseInt(details[0].sMenge) : details[0].sMenge;
					// var oAvailableQan = details[0].sAusme == 'ST' ? 0 : "";
					var oAvailableQan = parseFloat(oData.AvailableQan);
					oModel.setProperty("Menge", oMenge, oContext);
					oModel.setProperty("Menget", oMenge, oContext);
					this.initSerialTable(oMenge);
					oModel.setProperty("AvailableQan", oAvailableQan, oContext);
					this.sMeins = details[0].sAusme;
					// oModel.setProperty("AvailableQan", details[0].sAvailableQan, oContext);
					// oModel.setProperty("Menge", details[0].sMenge, oContext);
					//Alban modification 4/26/2023 in case of Unit ST save menge without decimals

					this.getView().setBindingContext(oContext);

					//Mengenfeld für Bobbine anpassen
					if (oData.Xchpf) { // true --> ist Bobine
						this.setBobine(true, oData);
					} else { // false
						this.setBobine(false);
					}

					//LP 18-10-21 Check for serial number flag 
					// if (oData.Serpf == 0) { // not needed serialNr - menge visible true//
					// 	this.setScan(false);
					// 	oView.byId("iSernr").setRequired(false);
					// } else if (oData.Serpf == 1) { // serialNr optional - menge visible false// 
					// 	this.setScan(true);
					// 	oView.byId("iSernr").setRequired(true);
					// } else if (oData.Serpf == 2) { // needed serialNr required - menge visible false// 
					// 	this.setScan(true);
					// 	oView.byId("iSernr").setRequired(true);
					// }

					//Setzte den Focus auf das Mengenfeld
					this.getView().byId("iMenge").focus();

					// this.getWarehouseInformation(details[0].sMatnr, details[0].sCharg, details[0].sLgort);
					// var oSelect = this.getView().byId("selectWarehouse");
					// oSelect.setSelectedKey(details[0].sLgort);
					oModel.setProperty("Lgpbe", details[0].sLgpbe, oContext);
					oModel.setProperty("Lgort", details[0].sLgort, oContext);

					//Clear the fields when we create the new item
					this.getView().byId("iParamFrom").setValue("");
					this.getView().byId("iParamTo").setValue("");

					//In case we are creating a new material with serial number we hide the previosly created serial numbers 
					if (this.sChangeFlag === "") {
						oView.byId("scanNumber").setVisible(false);
					}

				}.bind(this),
				error: function (oData) {
					//Errorhandling
					var oMMData = oMessageManager.getMessageModel().getData();
					this.onBtnCancelPress();

					setTimeout(function () {
						if (oMMData.length > 1) {
							this.showMessageErrorDialog(oMMData[1].message); //oMessageManager.getMessageModel().getData()[1].message);
						} else if (oMMData.length !== 0) {
							this.showMessageErrorDialog(oMMData[0].message);
						} else {
							this.showMessageErrorDialog("ERROR");
						}
					}.bind(this), 500);

				}.bind(this)
			});

		},

		getWarehouseInformation: function (sMatnr, sCharg, sLgort) {
			// var oSelect = this.getView().byId("selectWarehouse");
			// var oItemSelectTemplate = new sap.ui.core.Item({
			// 	key: "{Lgort}",
			// 	text: "{Lgort}"
			// });
			// var aFilter = [];
			// var oFilter1 = new sap.ui.model.Filter("Matnr", "EQ", sMatnr);
			// var oFilter2 = new sap.ui.model.Filter("Charg", "EQ", sCharg);
			// aFilter.push(oFilter1, oFilter2);
			// oSelect.bindAggregation("items", {
			// 	path: "/WarehouseSet",
			// 	template: oItemSelectTemplate,
			// 	filters: aFilter,
			// 	events: {
			// 		dataReceived: function () {
			// 			// this.onWarehouseChange();
			// 		}.bind(this)
			// 	}
			// });
		},

		onWarehouseChange: function (oEvent) {
			// var oSelect = this.getView().byId("selectWarehouse");
			// var oObj = oSelect.getSelectedItem().getBindingContext().getObject();
			// var oModel = this.getView().getModel();
			// var oCtx = this.getView().getBindingContext();
			// oModel.setProperty("Lgort", oObj.Lgort, oCtx);
			// oModel.setProperty("Lgpbe", oObj.Lgpbe, oCtx);

			// //Alban modification 4/26/2023 in case of Unit ST save menge without decimals
			// var oAvailableQan = this.sMeins == 'ST' ? parseInt(oObj.AvailableQan) : oObj.AvailableQan;
			// oModel.setProperty("AvailableQan", this.formatQuantity(oAvailableQan, oModel.getProperty("Ausme")), oCtx);
			// // oModel.setProperty("AvailableQan", this.formatQuantity(oObj.AvailableQan, oModel.getProperty("Ausme")), oCtx);
			// //Alban modification 4/26/2023 in case of Unit ST save menge without decimals

		},

		setBobine: function (boole, oData) {
			var oView = this.getView();
			oView.byId("charge").setRequired(boole);
			oView.byId("containerCharg").setVisible(boole);
			if (oData && oData.Mtart === "TRAF") {
				boole = false;
			}
			oView.byId("containerBobine").setVisible(boole);
			oView.byId("iMenge").setEnabled(!boole);
		},

		calculateQuant: function () {
			var oView = this.getView();
			var sFrom = oView.byId("iParamFrom").getValue();
			if (sFrom !== "") {
				sFrom = parseInt(sFrom, 10);
			} else {
				return;
			}
			var sTo = oView.byId("iParamTo").getValue();
			if (sTo !== "") {
				sTo = parseInt(sTo, 10);
			} else {
				return;
			}
			// if (sFrom !== "" && sTo !== "") {
			var sMenge = Math.abs(sTo - sFrom);
			sMenge = sMenge.toString();
			oView.getModel().setProperty("Menge", sMenge, oView.getBindingContext());
			// }
		},

		onMengeChange: function (oEvent) {
			var oInput = oEvent.getSource();
			oInput.setValue(this.convertDecimal(oInput.getValue()));
		},
		onBtnSubmitPress: function () {
			var oCtx = this.getView().getBindingContext(),
				oData = oCtx.getObject(),
				oModel = this.getView().getModel();
			if (oData.Menget <= oData.Lfimg - oData.Rfmng && oData.Menget >= 0) {
				var oMaterialModel = this.getOwnerComponent().getModel("materialList"),
					aMaterialList = oMaterialModel.getProperty("/materials") ? oMaterialModel.getProperty("/materials") : [];
				var EntryExist = -1;
				for (var i = 0; i < aMaterialList.length; i++) {
					if (aMaterialList[i].Charg == oData.Charg && aMaterialList[i].Posnr == oData.Posnr) {
						EntryExist = i;
					}
				}
				 
				if (EntryExist >= 0) {
					aMaterialList[EntryExist].Menget = parseFloat(oData.Menget)
					aMaterialList[EntryExist].Menge = parseFloat(oData.Menget)
				} else {
					//Fehler
				}
				oModel.setProperty("/materials", aMaterialList); //Update the model
				oModel.refresh(true);
				this.leaveView();
			} else {
				var WrongMenge = this.getView().getModel("i18n").getResourceBundle().getText("WrongMengeMessage");
				this.showMessageErrorDialog(WrongMenge);
			}
		},
		onBtnSubmitPressOld: function () {
			//Check leere Menge
			var oView = this.getView();
			var sMenge = oView.byId("iMenge").getValue();
			var sCharg = this.getView().getBindingContext().getObject().Charg;
			var sMatnr = this.getView().getBindingContext().getObject().Matnr;
			var sSernr = this.getView().getBindingContext().getObject().Sernr;
			var oCtx = this.getView().getBindingContext();
			var oTable = this.getView().byId("tableId");
			var oTableLength = oTable.getItems().length;

			// 18-10-21 add values of scan item table to variable
			if (oTableLength !== 0) {
				this.scanItem = "";
				for (var k = 0; k < oTableLength; k++) {
					this.scanItem = this.scanItem + this.getView().byId("tableId").getItems()[k].getAggregation("cells")[0].getText() + ";";
				}
				this.scanItem = this.scanItem.slice(0, -1);
				sSernr = this.scanItem;
				this.getView().getModel().setProperty("Sernr", sSernr, this.getView().getBindingContext());
			}

			// if table has scanned item, put length to sMenge
			if (oTableLength !== 0 && this.getView().byId("iMenge").getRequired() !== true) {
				sMenge = oTableLength.toString();
				this.getView().getModel().setProperty("Menge", sMenge, this.getView().getBindingContext());
			} else if (oTableLength === 0) {
				this.getView().byId("tableId").setVisible(false);
			}

			if (this.Matnr === sMatnr && oTableLength !== 0 && this.getView().byId("iMenge").getRequired() !== true) {
				this.scanItem = "";
				for (var i = 0; i < oTableLength; i++) {
					this.scanItem = this.scanItem + this.getView().byId("tableId").getItems()[i].getAggregation("cells")[0].getText() + ";";
				}
				this.scanItem = this.scanItem.slice(0, -1);
				sSernr = this.scanItem;
				this.getView().getModel().setProperty("Sernr", sSernr, this.getView().getBindingContext());
				sMenge = oTableLength.toString();
				this.getView().getModel().setProperty("Menge", sMenge, this.getView().getBindingContext());

			} else if (oTableLength === 0) {
				this.getView().byId("tableId").setVisible(false);
			}
			if (sCharg === "" && this.getView().byId('charge').getRequired()) {
				var chargMandatory = this.getView().getModel("i18n").getResourceBundle().getText("chargMandatoryMessage");
				this.showMessageErrorDialog(chargMandatory);

			} else {

				this.convertDecimal(sMenge);
				oCtx.getModel().setProperty("Menge", this.convertDecimal(sMenge), oCtx); //Menge leeren
				//Lösung mit OwnerComponent

				//Modify Alban Elezi 01.11.2021
				var oModel = this.getOwnerComponent().getModel("materialList");
				var sMaterialList = this.getView().getModel("materialList").getData().materials;

				//We remove material with serial number if all serials are deleted
				// if (oTableLength === 0 && this.getView().byId('iSernr').getRequired()) {
				// 	for (var n = 0; n < sMaterialList.length; ++n) {
				// 		if (sMaterialList[n].Index === this.sSelectedIndex) {
				// 			sMaterialList.splice(n, 1);
				// 		}
				// 	}
				// }

				if (this.sChangeFlag === "X") { //In case we want to change an existing material and not add a new one we update the model from material list with the updated values
					for (var n = 0; n < sMaterialList.length; ++n) {
						if (sMaterialList[n].Index === this.sSelectedIndex) {
							sMaterialList[n].Lgort = this.getView().getBindingContext().getObject().Lgort;
							sMaterialList[n].Lgpbe = this.getView().getBindingContext().getObject().Lgpbe;
							sMaterialList[n].Sernr = this.getView().getBindingContext().getObject().Sernr;
							sMaterialList[n].Charg = this.getView().getBindingContext().getObject().Charg;
							sMaterialList[n].Menge = this.getView().getBindingContext().getObject().Menge;
							sMaterialList[n].ParamFrom = this.getView().byId("iParamFrom").getValue();
							sMaterialList[n].ParamTo = this.getView().byId("iParamTo").getValue();
							sMaterialList[n].Index = this.sSelectedIndex;
							sMaterialList[n].Flag = "X";
						}
					}
					oModel.oData.materials = sMaterialList;
					this.sChangeFlag = ""; //Clear the flag and index for the next round
					this.sSelectedIndex = "";
					oModel.refresh(true);
				} else {

					oModel.getData().materials.unshift(oCtx.getProperty());

					var sCounter = sMaterialList.length; //We create the counter based on table length
					sMaterialList[0]["Index"] = sCounter; //we assing the new index to the first row
					sMaterialList[0]["ParamFrom"] = this.getView().byId("iParamFrom").getValue();
					sMaterialList[0]["ParamTo"] = this.getView().byId("iParamTo").getValue();
					oModel.oData.materials = sMaterialList; //Update the model

					oModel.refresh(true);
				}

				sSernr = "";
				this.leaveView();

			}
		},

		//Remove material Alban Elezi 2/23/2022
		onBtnRemovePress: function () {
			//Check leere Menge
			// var sMenge = this.getView().getBindingContext().getObject().Menge;
			var sMaterialList;
			var oModel;
			var sSernr = this.getView().getBindingContext().getObject().Sernr;

			//Remove the material from the list Modify Alban Elezi 02/23/2022
			sMaterialList = this.getView().getModel("materialList").getData().materials;
			oModel = this.getOwnerComponent().getModel("materialList");

			for (var l = 0; l < sMaterialList.length; ++l) {
				if (sMaterialList[l].Index === this.sSelectedIndex) {
					sMaterialList.splice(l, 1);
				}
			}
			oModel.oData.materials = sMaterialList;
			this.sChangeFlag = ""; //Clear the flag and index for the next round
			this.sSelectedIndex = "";
			oModel.refresh(true);

			sSernr = "";
			this.leaveView();
		},
		// },
		//Remove material Alban Elezi 2/23/2022

		setScan: function (boole) {
			var oView = this.getView();
			oView.byId("containerSerialNr").setVisible(boole);
			if (oView.byId("containerSerialNr").getVisible()) {
				// if item has serial number 
				oView.byId("iMenge").setVisible(false);
				oView.byId("iMengeText").setVisible(false);
			} else {
				oView.byId("iMenge").setVisible(true);
				oView.byId("iMengeText").setVisible(true);
				oView.byId("tableId").setVisible(false);
				oView.byId("tableId").removeAllItems();
			}
		},

		onBtnCancelPress: function () {
			this.btnCancelFlag = "true";
			this.leaveView();
		},

		leaveView: function () {
			var oView = this.getView();
			if (oView.byId("containerBobine").getVisible()) {
				oView.byId("iParamFrom").setValue("");
				oView.byId("iParamTo").setValue("");
			}
			// if (!oView.byId("containerSerialNr").getVisible()) {
			// 	oView.byId("tableId").setVisible(false);
			// 	oView.byId("tableId").removeAllItems();
			// } else if (this.btnCancelFlag == "true" && oView.byId("containerSerialNr").getVisible()) {
			// 	oView.byId("tableId").setVisible(false);
			// 	oView.byId("tableId").removeAllItems();
			// }
			this.onPageNavButtonPress();
		},
		//LP 28-10-21 
		onInputSubmit: function (bBarcode, sInput) {

			var oTable = this.getView().byId("tableId");

			//In case we are modifying a material with serial number we valorize the material with the current material
			if (this.sChangeFlag === "X") {
				this.Matnr = this.getView().getBindingContext().getObject().Matnr;
			} else { //Else we valorize the length with 0 to delete previously added serial numbers
				// oTable = "";
			}

			this.getView().byId("tableId").setVisible(true);
			var oTableLength = oTable.getItems().length;
			var sMatnr = this.getView().getBindingContext().getObject().Matnr;
			var sSernr = this.getView().getBindingContext().getObject().Sernr;
			var that = this;
			var exist = false;
			if (bBarcode !== true) {
				sInput = this.getView().byId("iMaterial").getValue();
				if (sInput !== "") {
					var oBarcode = this.splitBarcode(sInput);
					if (oBarcode === null) {
						var msg = "Ungültiger Barcode: " + sInput;
						this.showMessageErrorDialog(msg);
						return;
					} else if (oBarcode !== null) {
						if (oTableLength === 0) {
							this.Matnr = sMatnr;
							this.getView().byId("scanNumber").setVisible(true);
							oTable.addItem(new sap.m.ColumnListItem({
								cells: [new sap.m.Text({
										text: sInput
									}),
									new sap.m.Button({
										icon: "sap-icon://delete",
										press: function (event) {
											that.byId("tableId").removeItem(event.getSource().getParent());
											oTableLength = oTable.getItems().length;
											if (oTableLength === 0) {
												that.getView().byId("scanNumber").setVisible(false);
											}
										}
									})
								]
							}));
							sInput = this.getView().byId("iMaterial").setValue("");
						} else if (oTableLength !== 0) {
							if (sMatnr == this.Matnr) {
								for (var i = 0; i < oTableLength; i++) {
									if (sInput === this.getView().byId("tableId").getItems()[i].getAggregation("cells")[0].getText()) {
										var alreadyScannedMessage = this.getView().getModel("i18n").getResourceBundle().getText("alreadyScannedMessage");
										this.showMessageErrorDialog(alreadyScannedMessage);
										exist = true;
										break;
									}
								}
								if (exist !== true) {
									oTable.addItem(new sap.m.ColumnListItem({
										cells: [new sap.m.Text({
												text: sInput
											}),
											new sap.m.Button({
												icon: "sap-icon://delete",
												press: function (event) {
													that.byId("tableId").removeItem(event.getSource().getParent());
													oTableLength = oTable.getItems().length;
													if (oTableLength === 0) {
														that.getView().byId("scanNumber").setVisible(false);
													}
												}
											})
										]
									}));
									exist = false;
								}
								sInput = this.getView().byId("iMaterial").setValue("");
							} else if (sMatnr !== this.Matnr) {
								this.getView().byId("tableId").setVisible(false);
								this.getView().byId("tableId").removeAllItems();
								oTableLength = 0;
								if (oTableLength === 0) {
									this.Matnr = sMatnr;
									this.getView().byId("tableId").setVisible(true);
									this.getView().byId("scanNumber").setVisible(true);
									oTable.addItem(new sap.m.ColumnListItem({
										cells: [new sap.m.Text({
												text: sInput
											}),
											new sap.m.Button({
												icon: "sap-icon://delete",
												press: function (event) {
													that.byId("tableId").removeItem(event.getSource().getParent());
													oTableLength = oTable.getItems().length;
													if (oTableLength === 0) {
														that.getView().byId("scanNumber").setVisible(false);
													}
												}
											})
										]
									}));
									sInput = this.getView().byId("iMaterial").setValue("");
								}
							}
						}

					}
				}
			}
			//}  
		},

		onBtnScanPress: function () {
			jQuery.sap.require("sap.ndc.BarcodeScanner");
			sap.ndc.BarcodeScanner.scan(
				function (oResult) { /* process scan result */
					this.getView().byId("iMaterial").setValue(oResult.text);
					this.onInputSubmit(true, oResult.text);
				}.bind(this),
				function (oError) { /* handle scan error */ }
			);
		},
		//LP 12-10-21

		//New function to handle the modification of material context when the user is changing an existing record
		modifyMaterialContext: function (details) {
			// create an entry of the Material collection with the specified properties and values
			var oModel = this.getView().getModel();
			//var sAufnr = oEvent.getParameter("arguments").origin;
			if (details[0].sCharg === undefined) {
				details[0].sCharg = "";
			}
			if (details[0].sSernr === undefined) {
				details[0].sSernr = "";
			}
			var sAufnr;
			if (details[0].sAufnr === undefined) {
				sAufnr = "";
			}
			var oContext = oModel.createEntry("/MaterialSet", {
				properties: {
					Matnr: details[0].sMatnr,
					Charg: details[0].sCharg,
					Aufnr: details[0].sRsnum,
					Sernr: details[0].sSernr
				}
			});

			if (details[0].sMenge === undefined) {
				details[0].sMenge = "";
			}

			oModel.setProperty("Matnr", details[0].sMatnr, oContext);
			oModel.setProperty("Maktx", details[0].sMaktx, oContext);
			// oModel.setProperty("StockQuant", details[0].sStockQuant, oContext);
			oModel.setProperty("Ausme", details[0].sAusme, oContext);
			oModel.setProperty("AvailableQan", details[0].sAvailableQan, oContext);
			oModel.setProperty("Menge", details[0].sMenge, oContext);

			this.getView().byId("iParamFrom").setValue(details[0].sParamFrom);
			this.getView().byId("iParamTo").setValue(details[0].sParamTo);
			this.getView().setBindingContext(oContext);

			this.setBobine(true);

			var oView = this.getView();
			this.setScan(false);
			oView.byId("iSernr").setRequired(false);
			//Setzte den Focus auf das Mengenfeld
			this.getView().byId("iMenge").focus();

			//Lgort Informationen Laden
			// this.getWarehouseInformation(details[0].sMatnr, details[0].sCharg, details[0].sLgort);
			// var oSelect = this.getView().byId("selectWarehouse");
			// oSelect.setSelectedKey(details[0].sLgort);
			oModel.setProperty("Lgpbe", details[0].sLgpbe, oContext);
		},

		//New function to add the serial numbers when we change the material with serial numbers
		addSerialNumber: function (sInput) {
			var oTable = this.getView().byId("tableId");
			var oTableLength = oTable.getItems().length;
			var that = this;

			this.getView().byId("tableId").setVisible(true);
			this.getView().byId("scanNumber").setVisible(true);

			if (sInput !== "") {
				oTable.addItem(new sap.m.ColumnListItem({
					cells: [new sap.m.Text({
							text: sInput
						}),
						new sap.m.Button({
							icon: "sap-icon://delete",
							press: function (event) {
								that.byId("tableId").removeItem(event.getSource().getParent());
								oTableLength = oTable.getItems().length;
								if (oTableLength === 0) {
									that.getView().byId("scanNumber").setVisible(false);
								}
							}
						})
					]
				}));

				oTable.getModel().refresh(true);

			}
		}
	});
});