sap.ui.define(
	[
		"com/mindsquare/gdmvt/remove/mdeapp/controller/baseController",
		"sap/m/Button",
		"sap/m/Dialog",
		"sap/m/Text",
		"sap/m/MessageToast",
		"sap/m/MessageBox",
		"sap/ui/model/json/JSONModel"
	],
	function (
		baseController,
		Button,
		Dialog,
		Text,
		MessageToast,
		MessageBox,
		JSONModel
	) {
		"use strict";
		var oAusme;
		return baseController.extend(
			"com.mindsquare.gdmvt.remove.mdeapp.controller.addMaterial", {
				onInit: function () {
					var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
					oRouter.getRoute("addMaterial").attachPatternMatched(this.handleRouteAddMaterialMatched, this);
					oRouter.getRoute("addMaterialCharg").attachPatternMatched(this.handleRouteAddMaterialChargMatched, this);
					oRouter.getRoute("addMaterialBarcode").attachPatternMatched(this.handleRouteAddMaterialBarcodeMatched, this);
					this.scanItem = "";
					this.Matnr = "";
					this.Matnr1 = {};
					this.Materials = {};
					this.btnCancelFlag = "false";
					this.Counter = 0;
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

				handleRouteAddMaterialMatched: function (oEvent) {
					var oArgs = oEvent.getParameter("arguments");
					// oView.byId("tableId").setVisible(false);
					// oView.byId("tableId").removeAllItems();
					oAusme = oArgs.ausme; //Alban Change

					this._getModel().metadataLoaded().then(function () {
						this.createMaterialContext(oArgs.matnr, oArgs.charg, oArgs.rsnum, oArgs.rspos, oArgs.sernr, oArgs.menge, oArgs.lgort, /*oArgs.bdter*/ );
					}.bind(this));
				},

				handleRouteAddMaterialChargMatched: function (oEvent) {
					var oArgs = oEvent.getParameter("arguments");
					// oView = this.getView();
					// oView.byId("tableId").setVisible(false);
					// oView.byId("tableId").removeAllItems();
					oAusme = oArgs.ausme; //Alban Change 21/05/2022

					this.createMaterialContext(oArgs.matnr, oArgs.charg, oArgs.rsnum, oArgs.rspos, oArgs.sernr, oArgs.menge, /*oArgs.bdter*/ );
				},

				handleRouteAddMaterialBarcodeMatched: function (oEvent) {
					var sBarcode = oEvent.getParameter("arguments").barcode;
					var oBarcode = this.splitBarcode(sBarcode);
					// var oView = this.getView();

					// oView.byId("tableId").setVisible(false);
					// oView.byId("tableId").removeAllItems();

					this.createMaterialContext(
						oBarcode.matnr,
						oBarcode.charg,
						oBarcode.menge
					);
				},

				addMaterialByReservation: function (oEvent) {
					// this._origin = "material";
					var oView = this.getView();
					var oModel = oView.getModel();
					oView.setBindingContext(
						new sap.ui.model.Context(
							oModel,
							"/" + oEvent.getParameter("arguments").path
						)
					);
				},

				createMaterialContext: function (sMatnr, sCharg, sRsnum, sRspos, sSernr, sMenge, sLgort) {
					// create an entry of the Material collection with the specified properties and values
					var oModel = this.getView().getModel(),
						oContext = oModel.createEntry("/MaterialSet", {
							properties: {
								Matnr: sMatnr,
								Charg: sCharg ? sCharg : "",
								Rsnum: sRsnum ? sRsnum : "",
								Rspos: sRspos ? sRspos : "",
								Sernr: sSernr ? sSernr : ""
							}
						}),
						sPath = oModel.createKey("/MaterialSet", {
							Rsnum: sRsnum ? sRsnum : "",
							Rspos: sRspos ? sRspos : "",
							Matnr: sMatnr ? sMatnr : "",
							Charg: sCharg ? sCharg : ""
						}),
						oMessageManager = sap.ui.getCore().getMessageManager();
					oMessageManager.removeAllMessages();
					//get material information
					oModel.read(sPath, {
						success: function (oData) {

						
							if (oData.Sernr) {
								var oSernr = oData.Sernr.split(",");
								this.getView().getModel("Sernr").setProperty("/", oSernr, oContext);
							}
						
							oModel.setProperty("Maktx", oData.Maktx, oContext);
							oModel.setProperty("Meins", oData.Meins, oContext);
							oModel.setProperty("Ausme", oData.Ausme, oContext);
							oModel.setProperty("Serpf", oData.Serpf, oContext);
							oModel.setProperty("Rsnum", oData.Rsnum, oContext);
							oModel.setProperty("Rspos", oData.Rspos, oContext);
							oModel.setProperty("Rfmng", parseFloat(oData.Rfmng), oContext);
							oModel.setProperty("Lfimg", parseFloat(oData.Lfimg), oContext);
							oModel.setProperty("Pikmg", parseFloat(oData.Pikmg), oContext);
							// oModel.setProperty("Menget", parseFloat(oData.Pikmg), oContext);
							// oModel.setProperty("Pikmg", sPikmg, oContext);
							// oModel.setProperty("Kommg", FlKommg, oContext);
							
							this.getView().getModel("Sernr").setProperty("/Serpf", oData.Serpf, oContext);
							//oModel.setProperty("Bdter", oData.Bdter, oContext); //FG
							if (sMenge === undefined) {
								sMenge = "";
							}
							//Alban modification 4/26/2023 in case of Unit ST save menge without decimals
							var oMenge = oData.Meins == 'ST' ? parseInt(sMenge) : sMenge;
							// var oAvailableQan = oData.Meins == 'ST' ? 0 : "";
							var oAvailableQan = parseFloat(oData.AvailableQan);
							oModel.setProperty("Menget", oMenge, oContext);
							oModel.setProperty("Menge", oMenge, oContext);
							this.initSerialTable(oMenge);
							oModel.setProperty("AvailableQan", oAvailableQan, oContext);
							this.sMeins = oData.Meins;
							// oModel.setProperty("AvailableQan", "", oContext);
							// oModel.setProperty("Menge", sMenge, oContext);
							//Alban modification 4/26/2023 in case of Unit ST save menge without decimals
							oModel.setProperty("Lgort", oData.Lgort, oContext);
							oModel.setProperty("Lgpbe", oData.Lgpbe, oContext);
							this.getView().setBindingContext(oContext);

							//Mengenfeld für Bobbine anpassen
							if (oData.Xchpf) {
								// true --> ist Bobine
								this.setBobine(true, oData);
							} else {
								// false
								this.setBobine(false);
							}

							// //LP 18-10-21 Check for serial number flag
							// var oView = this.getView();
							// if (oData.Serpf == 0) {
							// 	// not needed serialNr - menge visible true//
							// 	// this.setScan(false);
							// 	oView.byId("iSernr").setRequired(false);
							// } else if (oData.Serpf == 1) {
							// 	// serialNr optional - menge visible false//
							// 	// this.setScan(true);
							// 	oView.byId("iSernr").setRequired(true);
							// } else if (oData.Serpf == 2) {
							// 	// needed serialNr required - menge visible false//
							// 	// this.setScan(true);
							// 	oView.byId("iSernr").setRequired(true);
							// 	//	this.getView().byId("containerSerialNr").setRequired(true);
							// }

							//Setzte den Focus auf das Mengenfeld
							this.getView().byId("iMenge").focus();
							// this.getWarehouseInformation(sMatnr, sCharg, sLgort);
							this.byId("addMaterial").setBusy(false);
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
						}.bind(this),
					});
				},

				getWarehouseInformation: function (sMatnr, sCharg, sLgort) {
					// var oSelect = this.getView().byId("selectWarehouse"),
					// 	oItemSelectTemplate = new sap.ui.core.Item({
					// 		key: "{Lgort}",
					// 		text: "{Lgort}",
					// 	}),
					// 	aFilter = [];
					// if (sMatnr) {
					// 	aFilter.push(new sap.ui.model.Filter("Matnr", "EQ", sMatnr));
					// }
					// if (sCharg) {
					// 	aFilter.push(new sap.ui.model.Filter("Charg", "EQ", sCharg));
					// }
					// oSelect.bindAggregation("items", {
					// 	path: "/WarehouseSet",
					// 	template: oItemSelectTemplate,
					// 	filters: aFilter,
					// 	events: {
					// 		dataReceived: function () {
					// 			//manuell erstes Item auswählen
					// 			if (sLgort) {
					// 				this.byId("addMaterial").setBusy(false);
					// 			} else {
					// 				oSelect.setSelectedItem(oSelect.getFirstItem());
					// 			}
					// 			this.onWarehouseChange();
					// 		}.bind(this),
					// 	},
					// });
				},

				onWarehouseChange: function () {
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
				    
				    var inputQuantity = parseFloat(this.getView().byId("iMenge").getValue()); // Eingegebene Menge
				
				    if (isNaN(inputQuantity) || inputQuantity <= 0) {
				        sap.m.MessageBox.error("Bitte geben Sie eine gültige Menge ein.");
				        return;
				    }
				
				    // Prüfen, ob die eingegebene Menge die verfügbare Menge nicht übersteigt
				    if (inputQuantity > oData.Lfimg) {
				        sap.m.MessageBox.error("Die eingegebene Menge darf die verfügbare Menge nicht überschreiten.");
				        return;
				    }
				
				    var oMaterialModel = this.getOwnerComponent().getModel("materialList"),
				        aMaterialList = oMaterialModel.getProperty("/materials") ? oMaterialModel.getProperty("/materials") : [];
				
				    this.Counter = this.Counter + 1;
				    var oNewEntry = {
				        Index: this.Counter,
				        Matnr: oData.Matnr,
				        Maktx: oData.Maktx,
				        Rsnum: oData.Rsnum,
				        Rspos: oData.Rspos,
				        Menge: inputQuantity,  // Eingabe Menge verwenden
				        Charg: this.byId("charge").getValue(),
				        Ausme: oData.Ausme,
				        Lgort: oData.Lgort,
				        Lgpbe: oData.Lgpbe,
				        Sernr: oData.Sernr,
				        Serpf: oData.Serpf
				    };
				    aMaterialList.push(oNewEntry);
				    oModel.setProperty("/materials", aMaterialList);
				    this.leaveView();
				},


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
						oView.byId("charge").setValue("");
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
					// this.byId("tableId").removeItem(event.getSource().getParent());
					var oTable = this.getView().byId("tableId");
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
									oTable.addItem(
										new sap.m.ColumnListItem({
											cells: [
												new sap.m.Text({
													text: sInput,
												}),
												new sap.m.Button({
													icon: "sap-icon://delete",
													press: function (event) {
														that.byId("tableId").removeItem(event.getSource().getParent());
														oTableLength = oTable.getItems().length;
														if (oTableLength === 0) {
															that.getView().byId("scanNumber").setVisible(false);
														}
													},
												}),
											],
										})
									);
									sInput = this.getView().byId("iMaterial").setValue("");
								} else if (oTableLength !== 0) {
									if (sMatnr == this.Matnr) {
										for (var i = 0; i < oTableLength; i++) {
											if (
												sInput ===
												this.getView()
												.byId("tableId")
												.getItems()[i].getAggregation("cells")[0]
												.getText()
											) {
												var alreadyScannedMessage = this.getView().getModel("i18n").getResourceBundle().getText("alreadyScannedMessage");
												this.showMessageErrorDialog(alreadyScannedMessage);
												exist = true;
												break;
											}
										}
										if (exist !== true) {
											oTable.addItem(
												new sap.m.ColumnListItem({
													cells: [
														new sap.m.Text({
															text: sInput,
														}),
														new sap.m.Button({
															icon: "sap-icon://delete",
															press: function (event) {
																that.byId("tableId").removeItem(event.getSource().getParent());
																oTableLength = oTable.getItems().length;
																if (oTableLength === 0) {
																	that.getView().byId("scanNumber").setVisible(false);
																}
															},
														}),
													],
												})
											);
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
											oTable.addItem(
												new sap.m.ColumnListItem({
													cells: [
														new sap.m.Text({
															text: sInput,
														}),
														new sap.m.Button({
															icon: "sap-icon://delete",
															press: function (event) {
																that.byId("tableId").removeItem(event.getSource().getParent());
																oTableLength = oTable.getItems().length;
																if (oTableLength === 0) {
																	that.getView().byId("scanNumber").setVisible(false);
																}
															},
														}),
													],
												})
											);
											sInput = this.getView().byId("iMaterial").setValue("");
										}
									}
									// var	oTableLength1 =oTableLength + 1;
									// 		this.Matnr1 = {
									// 		matnr: sMatnr,
									// 		scan: this.scanItem,
									// 		itemNr: oTableLength1
									// 	};
								}
							}
						}
					}
					//}
				},

				onBtnScanPress: function () {
					jQuery.sap.require("sap.ndc.BarcodeScanner");
					sap.ndc.BarcodeScanner.scan(
						function (oResult) {
							/* process scan result */
							this.getView().byId("iMaterial").setValue(oResult.text);
							this.onInputSubmit(true, oResult.text);
						}.bind(this),
						function (oError) {
							/* handle scan error */
						}
					);
				},
				//LP 12-10-21
			}
		);
	}
);