sap.ui.define([
	"com/mindsquare/gdmvt/remove/mdeapp/controller/baseController",
	"sap/m/MessageToast",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator"
], function (baseController, MessageToast, Filter, FilterOperator) {
	"use strict";
	return baseController.extend("com.mindsquare.gdmvt.remove.mdeapp.controller.auftragsauswahl", {

		handleRouteMatched: function () {},

		onInit: function () {
			//this.setShowOrder(this.getView());
			//Registrieren der PressEnter Funktion auf ein Control mit der Zielfunction
			//this.registerFnOnPressEnter(this.getView().byId("iSearchByOrder"), this.onBtnSearchOrderPress);

			//Alban change 10/10/2023 add a call to backend to unlock the order when the user comes back from material list view
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.getRoute("auftragsauswahl").attachPatternMatched(this._onObjectMatched, this);
			this._oCustomInput = this.byId("customInput");
			
		},
		
		onBeforeRebindTable: function (oEvent) {
		    var mBindingParams = oEvent.getParameter("bindingParams"),
		        sInputValue = this._oCustomInput.getValue(), // Value from Aufnr input
		        sWerksValue = this.byId("werksInput").getValue(); // Value from Werks input
		
		    // Add filter for Aufnr if there's a value
		    if (sInputValue) {
		        mBindingParams.filters.push(
		            new Filter(
		                "Aufnr",
		                FilterOperator.Contains,
		                sInputValue
		            )
		        );
		    }
		
		    // Add filter for Werks if there's a value
		    if (sWerksValue) {
		        mBindingParams.filters.push(
		            new Filter(
		                "Werks",
		                FilterOperator.EQ,
		                sWerksValue
		            )
		        );
		    }
		},

		_onObjectMatched: function (oEvent) {
			this.getView().getModel().refresh(true)
			var oRsnum = this.getView().getModel("Rsnum").getProperty("/");
			var oAufnr = this.getView().getModel("Aufnr").getProperty("/");
			var oErrorRsnum = this.getView().getModel("ErrorRsnum").getProperty("/");
			this.getView().getModel("Locked").setProperty("/", false); //set the order in free state

			//Unlock the order
			if (oRsnum && !oErrorRsnum) {
				var oPath = "/OrderUnlockSet(Aufnr='" + oAufnr + "',Rsnum='" + oRsnum + "',Lock='')";
				this.getView().getModel("Locked").setProperty("/", false); //set the order in lock state
				//backend call to unlock the order
				this.getView().getModel().read(oPath, {
					success: function (oData) {
						//Success handling do nothin
					}.bind(this),
					error: function () {
						//Error handling do nothing
					}.bind(this)
				})
			}
		},
		//Alban change 10/10/2023 add a call to backend to unlock the order when the user comes back from material list view

		navToDetail: function (oEvent) {

			var oRouter = sap.ui.core.UIComponent.getRouterFor(this),
				oRsnum = oEvent.getSource().getBindingContext().getObject().Rsnum;
			// oRouter.navTo("materialList", {
			// 	path: "OperationSet(Aufnr='" + sAufnr + "',Vornr='" + sVornr + "')",
			// 	origin: "OrderRemoval",
			// 	from: "searchByOrder"
			// });
			console.log("OrderSet('" + oRsnum + "')")
			oRouter.navTo("materialList", {
				path: "OrderSet('" + oRsnum + "')",
				from: "searchByOrder",
				rsnum: oRsnum
			});
			console.log("1")
			this.getView().getModel("materialList").setData({
				materials: []
			});
		},

		// onBtnScanPress: function () {

		// 	jQuery.sap.require("sap.ndc.BarcodeScanner");
		// 	sap.ndc.BarcodeScanner.scan(
		// 		function (oResult) { /* process scan result */
		// 			var sITabSelectedKey = this.getView().byId("idIconTabBarMulti").getSelectedKey();
		// 			var oInput;
		// 			switch (sITabSelectedKey) {
		// 			case "searchByOrder":
		// 				oInput = this.getView().byId("iSearchByOrder");
		// 				oInput.setValue(oResult.text);
		// 				oInput.fireSubmit();
		// 				//this.onBtnSearchOrderPress(oResult.text);
		// 				break;
		// 			case "searchByCostCenter":
		// 				oInput = this.getView().byId("iSearchByCostCenter");
		// 				oInput.setValue(oResult.text);
		// 				oInput.fireSubmit();
		// 				break;
		// 			case "searchByWBSElement":
		// 				oInput = this.getView().byId("iSearchByWBSElement");
		// 				oInput.setValue(oResult.text);
		// 				oInput.fireSubmit();
		// 				break;
		// 			case "searchBySalesOrder":
		// 				oInput = this.getView().byId("iSearchBySalesOrder");
		// 				oInput.setValue(oResult.text);
		// 				oInput.fireSubmit();
		// 				break;
		// 			}
		// 		}.bind(this),
		// 		function (oError) {
		// 			MessageToast.show(oError);
		// 		}
		// 	);
		// },

		// onBtnSubmitPress: function () {

		// 	var sITabSelectedKey = this.getView().byId("idIconTabBarMulti").getSelectedKey();
		// 	var oInput;
		// 	switch (sITabSelectedKey) {
		// 	case "searchByOrder":
		// 		oInput = this.getView().byId("iSearchByOrder");
		// 		oInput.fireSubmit();
		// 		break;
		// 	case "searchByCostCenter":
		// 		oInput = this.getView().byId("iSearchByCostCenter");
		// 		oInput.fireSubmit();
		// 		break;
		// 	case "searchByWBSElement":
		// 		oInput = this.getView().byId("iSearchByWBSElement");
		// 		oInput.fireSubmit();
		// 		break;
		// 	case "searchBySalesOrder":
		// 		oInput = this.getView().byId("iSearchBySalesOrder");
		// 		oInput.fireSubmit();
		// 		break;
		// 	}
		// },

		onBtnSearchOrderPress: function () {

			var sAufnr = this.getView().byId("iSearchByOrder").getValue(),
				aFilter = [],
				oFilter = new sap.ui.model.Filter("Aufnr", "EQ", sAufnr);
			if (sAufnr === "") {
				return;
			}
			aFilter.push(oFilter);
			sap.ui.core.BusyIndicator.show();
			var oMessageManager = sap.ui.getCore().getMessageManager();
			oMessageManager.removeAllMessages();
			this.getView().getModel().read("/OrderSet", {
				filters: aFilter,
				success: function (oData) {
					var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
					if (oData.results.length === 1) {
						if (oData.results[0].ObjnrVorg === true) {
							// we have to read operations as well
							var query = "/OrderSet('" + oData.results[0].Aufnr + "')/navOperation";
							this.getView().getModel().read(query, {
								//filters: aFilter,
								success: function (oData) {
									sap.ui.core.BusyIndicator.hide();
									this.oDialog = sap.ui.xmlfragment(
										"de.mindsquare.mm.mind2_wm_2_goods_issue_list.view.view.fragments.orderOperationsDialog", this);
									var resultsLength = oData.results.length;
									if (resultsLength > 0) {
										for (var i = 0; i < resultsLength; i++) {
											var oTableStdListTemplate = new sap.m.StandardListItem({
												title: oData.results[i].Vornr,
												description: oData.results[i].Vorltxt
											});
											this.oDialog.addItem(oTableStdListTemplate);
										}
										var sTitle = "Vorgangsnummer, Auftrag: " + oData.results[0].Aufnr;
										this.oDialog.setTitle(sTitle);
										var oDialogData = {
											"Aufnr": oData.results[0].Aufnr
										};
										var oDialogModel = new sap.ui.model.json.JSONModel(oDialogData);
										this.oDialog.setModel(oDialogModel);

										this.oDialog.open();
									}
								}.bind(this),
								error: function () {
									sap.ui.core.BusyIndicator.hide();
									var oMMData = oMessageManager.getMessageModel().getData();
									if (oMMData.length > 1) {
										this.showMessageErrorDialog(oMessageManager.getMessageModel().getData()[1].message);
									} else if (oMMData.length !== 0) {
										this.showMessageErrorDialog(oMessageManager.getMessageModel().getData()[0].message);
									} else {
										this.showMessageErrorDialog("ERROR");
									}
								}.bind(this)
							});

						} else {
							sap.ui.core.BusyIndicator.hide();
							oRouter.navTo("materialList", {
								path: "OrderSet('" + oData.results[0].Aufnr + "')",
								origin: "orderRemoval",
								from: "searchByOrder"
							});
							this.getView().getModel("materialList").setData({
								materials: []
							});
						}
					}
					this.getView().byId("iSearchByOrder").setValue("");
				}.bind(this),
				error: function () {
					sap.ui.core.BusyIndicator.hide();
					var oMMData = oMessageManager.getMessageModel().getData();
					if (oMMData.length > 1) {
						this.showMessageErrorDialog(oMessageManager.getMessageModel().getData()[1].message);
					} else if (oMMData.length !== 0) {
						this.showMessageErrorDialog(oMessageManager.getMessageModel().getData()[0].message);
					} else {
						this.showMessageErrorDialog("ERROR");
					}
					this.getView().byId("iSearchByOrder").setValue("");
				}.bind(this)
			});
		},

		OnBtnClearPress: function () {

			//Feld leeren
			this.getView().byId("isearchByIncident").setValue("");
		},

		onOrderSelect: function (oEvent) {

			var sAufnr = oEvent.getSource().getBindingContext().getObject().Aufnr;
			var bObjnrVorg = oEvent.getSource().getBindingContext().getObject().ObjnrVorg;
			var oMessageManager = sap.ui.getCore().getMessageManager();
			if (bObjnrVorg === true) {
				// we have to read operations as well
				var query = "/OrderSet('" + sAufnr + "')/navOperation";
				this.getView().getModel().read(query, {
					//filters: aFilter,
					success: function (oData) {
						sap.ui.core.BusyIndicator.hide();
						this.oDialog = sap.ui.xmlfragment("de.mindsquare.mm.removal.mind2_wm_2_goods_issue_list.view.fragments.orderOperationsDialog",
							this);
						var resultsLength = oData.results.length;
						if (resultsLength > 0) {
							for (var i = 0; i < resultsLength; i++) {
								var oTableStdListTemplate = new sap.m.StandardListItem({
									title: oData.results[i].Vornr,
									description: oData.results[i].Vorltxt
								});
								this.oDialog.addItem(oTableStdListTemplate);
							}
							var sTitle = "Vorgangsnummer, Auftrag: " + oData.results[0].Aufnr;
							this.oDialog.setTitle(sTitle);
							var oDialogData = {
								"Aufnr": oData.results[0].Aufnr
							};
							var oDialogModel = new sap.ui.model.json.JSONModel(oDialogData);
							this.oDialog.setModel(oDialogModel);

							this.oDialog.open();
						}
					}.bind(this),
					error: function () {
						sap.ui.core.BusyIndicator.hide();
						var oMMData = oMessageManager.getMessageModel().getData();
						if (oMMData.length > 1) {
							this.showMessageErrorDialog(oMessageManager.getMessageModel().getData()[1].message);
						} else if (oMMData.length !== 0) {
							this.showMessageErrorDialog(oMessageManager.getMessageModel().getData()[0].message);
						} else {
							this.showMessageErrorDialog("ERROR");
						}
					}.bind(this)
				});
			} else {
				var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
				oRouter.navTo("materialList", {
					path: "OrderSet('" + sAufnr + "')",
					from: "searchByOrder"
				});
				this.getView().getModel("materialList").setData({
					materials: []
				});
			}
		},

		// onCostCenterSelect: function (oEvent) {

		// 	var sKostl = oEvent.getSource().getBindingContext().getObject().Kostl;
		// 	var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
		// 	oRouter.navTo("materialList", {
		// 		path: "CostCenterSet('" + sKostl + "')",
		// 		from: "searchByCostCenter"
		// 	});
		// 	this.getView().getModel("materialList").setData({
		// 		materials: []
		// 	});
		// },

		// onBtnSearchCostCenterPress: function () {

		// 	var sKostl = this.getView().byId("iSearchByCostCenter").getValue();
		// 	sKostl = sKostl.toUpperCase();
		// 	if (sKostl === "") {
		// 		return;
		// 	}
		// 	var aFilter = [];
		// 	var oFilter = new sap.ui.model.Filter("Kostl", "EQ", sKostl);
		// 	aFilter.push(oFilter);
		// 	sap.ui.core.BusyIndicator.show();
		// 	var oMessageManager = sap.ui.getCore().getMessageManager();
		// 	oMessageManager.removeAllMessages();
		// 	var query = "/CostCenterSet('" + sKostl + "')";
		// 	this.getView().getModel().read(query, {
		// 		//filters: aFilter,
		// 		success: function (oData) {
		// 			sap.ui.core.BusyIndicator.hide();
		// 			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
		// 			oRouter.navTo("materialList", {
		// 				path: "CostCenterSet('" + oData.Kostl + "')",
		// 				origin: "costCenterRemoval",
		// 				from: "searchByCostCenter"
		// 			});
		// 			this.getView().getModel("materialList").setData({
		// 				materials: []
		// 			});
		// 			this.getView().byId("iSearchByCostCenter").setValue("");
		// 		}.bind(this),
		// 		error: function () {
		// 			sap.ui.core.BusyIndicator.hide();
		// 			var oMMData = oMessageManager.getMessageModel().getData();
		// 			if (oMMData.length > 1) {
		// 				this.showMessageErrorDialog(oMessageManager.getMessageModel().getData()[1].message);
		// 			} else if (oMMData.length !== 0) {
		// 				this.showMessageErrorDialog(oMessageManager.getMessageModel().getData()[0].message);
		// 			} else {
		// 				this.showMessageErrorDialog("ERROR");
		// 			}
		// 			this.getView().byId("iSearchByCostCenter").setValue("");
		// 		}.bind(this)
		// 	});
		// },

		onBtnSearchWBSElementPress: function () {

			var sPosid = this.getView().byId("iSearchByWBSElement").getValue();
			sPosid = sPosid.toUpperCase();
			if (sPosid === "") {
				return;
			}
			var aFilter = [];
			var oFilter = new sap.ui.model.Filter("Posid", "EQ", sPosid);
			aFilter.push(oFilter);
			sap.ui.core.BusyIndicator.show();
			var oMessageManager = sap.ui.getCore().getMessageManager();
			oMessageManager.removeAllMessages();
			this.getView().getModel().read("/WBSElementSet", {
				filters: aFilter,
				success: function (oData) {
					sap.ui.core.BusyIndicator.hide();
					var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
					if (oData.results.length === 1) {
						oRouter.navTo("materialList", {
							path: "WBSElementSet('" + oData.results[0].PspnrUnc + "')",
							origin: "WBSElementRemoval",
							from: "searchByWBSElement"
						});
						this.getView().getModel("materialList").setData({
							materials: []
						});
					}
					this.getView().byId("iSearchByWBSElement").setValue("");
				}.bind(this),
				error: function () {
					sap.ui.core.BusyIndicator.hide();
					var oMMData = oMessageManager.getMessageModel().getData();
					if (oMMData.length > 1) {
						this.showMessageErrorDialog(oMessageManager.getMessageModel().getData()[1].message);
					} else if (oMMData.length !== 0) {
						this.showMessageErrorDialog(oMessageManager.getMessageModel().getData()[0].message);
					} else {
						this.showMessageErrorDialog("ERROR");
					}
					this.getView().byId("iSearchByWBSElement").setValue("");
				}.bind(this)
			});
		},

		onBtnSearchSalesOrderPress: function () {

			var sVbeln = this.getView().byId("iSearchBySalesOrder").getValue();
			if (sVbeln === "") {
				return;
			}
			var aFilter = [];
			var oFilter = new sap.ui.model.Filter("Vbeln", "EQ", sVbeln);
			aFilter.push(oFilter);
			sap.ui.core.BusyIndicator.show();
			var oMessageManager = sap.ui.getCore().getMessageManager();
			oMessageManager.removeAllMessages();
			var query = "/SalesOrderSet('" + sVbeln + "')/SalesOrderToPositions";

			this.getView().getModel().read(query, {
				//filters: aFilter,
				success: function (oData) {
					sap.ui.core.BusyIndicator.hide();
					this.oDialog = sap.ui.xmlfragment(
						"de.mindsquare.mm.removal.mind2_wm_2_goods_issue_list.view.fragments.salesOrderPositionsDialog",
						this);
					this.oDialog.addStyleClass("salesOrderPositionsDialog");
					var resultsLength = oData.results.length;
					if (resultsLength > 0) {
						for (var i = 0; i < resultsLength; i++) {
							var oTableStdListTemplate = new sap.m.StandardListItem({
								title: oData.results[i].Posnr,
								description: oData.results[i].Arktx
									//info: oData.results[i].Vbeln
							});
							this.oDialog.addItem(oTableStdListTemplate);
						}
						var sTitle = "Kundenauftragspositionen, Auftrag: " + oData.results[0].Vbeln;
						this.oDialog.setTitle(sTitle);
						var oDialogData = {
							"Vbeln": oData.results[0].Vbeln
						};

						var oDialogModel = new sap.ui.model.json.JSONModel(oDialogData);
						this.oDialog.setModel(oDialogModel);

						this.oDialog.open();
					}

					this.getView().byId("iSearchBySalesOrder").setValue("");
				}.bind(this),
				error: function () {
					sap.ui.core.BusyIndicator.hide();
					var oMMData = oMessageManager.getMessageModel().getData();
					if (oMMData.length > 1) {
						this.showMessageErrorDialog(oMessageManager.getMessageModel().getData()[1].message);
					} else if (oMMData.length !== 0) {
						this.showMessageErrorDialog(oMessageManager.getMessageModel().getData()[0].message);
					} else {
						this.showMessageErrorDialog("ERROR");
					}
					this.getView().byId("iSearchBySalesOrder").setValue("");
				}.bind(this)
			});
		},

		onSalesOrderPositionsClose: function (oEvent) {

			var oSelectedItem = oEvent.getParameter("selectedItem");
			if (!oSelectedItem) {
				return;
			}
			var sPosnr = oSelectedItem.getTitle(),
				oRouter = sap.ui.core.UIComponent.getRouterFor(this),
				sVbeln = this.oDialog.getModel().getData().Vbeln;
			oRouter.navTo("materialList", {
				path: "SalesOrderPosSet(Vbeln='" + sVbeln + "',Posnr='" + sPosnr + "')",
				origin: "SalesOrderRemoval",
				from: "searchBySalesOrder"
			});
			this.getView().getModel("materialList").setData({
				materials: []
			});
			this.oDialog.destroy();
		},

		onOrderOperationsClose: function (oEvent) {

			var oSelectedItem = oEvent.getParameter("selectedItem");
			if (!oSelectedItem) {
				return;
			}
			var sVornr = oSelectedItem.getTitle();
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			var sAufnr = this.oDialog.getModel().getData().Aufnr;
			oRouter.navTo("materialList", {
				path: "OperationSet(Aufnr='" + sAufnr + "',Vornr='" + sVornr + "')",
				origin: "OrderRemoval",
				from: "searchByOrder"
			});
			this.getView().getModel("materialList").setData({
				materials: []
			});

			this.oDialog.destroy();
		},

		// onIconTabSelect: function () {

		// 	//Eingabefelder leeren
		// 	this.getView().byId("iSearchByOrder").setValue("");
		// 	this.getView().byId("iSearchByCostCenter").setValue("");
		// 	this.getView().byId("iSearchByWBSElement").setValue("");
		// 	this.getView().byId("iSearchBySalesOrder").setValue("");

		// 	var oView = this.getView();
		// 	var sITabSelectedKey = oView.byId("idIconTabBarMulti").getSelectedKey();
		// 	switch (sITabSelectedKey) {
		// 	case "searchByOrder":
		// 		this.getView().byId("btnSearch").setVisible(true);
		// 		break;
		// 	case "searchByIncident":
		// 		this.getView().byId("btnSearch").setVisible(false);
		// 		break;
		// 	case "searchByCostCenter":
		// 		this.getView().byId("btnSearch").setVisible(true);
		// 		break;
		// 	case "searchByWBSElement":
		// 		this.getView().byId("btnSearch").setVisible(true);
		// 		break;
		// 	case "searchBySalesOrder":
		// 		this.getView().byId("btnSearch").setVisible(true);
		// 		break;
		// 	}
		// },

		/*setShowOrder: function (oView) {
			// oView.byId("btnSearch").setVisible(true);
			oView.byId("btnSearchByOrder").setVisible(true);
			oView.byId("btnSearchByCostCenter").setVisible(false);
			this.getView().byId("iSearchByOrder").focus();
		},
		setShowCostCenter: function (oView) {
			// oView.byId("btnSearch").setVisible(true);
			oView.byId("btnSearchByCostCenter").setVisible(true);
			oView.byId("btnSearchByOrder").setVisible(false);
			this.getView().byId("iSearchByCostCenter").focus();
		},

		setShowIncident: function (oView) {
			oView.byId("btnSearchByOrder").setVisible(false);
			oView.byId("btnSearchByCostCenter").setVisible(false);

			// onAfterRendering: function () {
			// 	this.getView().byId("iSearchByOrder").addEventDelegate({
			// 		onAfterRendering: function () {
			// 			jQuery.sap.delayedCall(1000, this, function () {
			// 				this.getView().byId("iSearchByOrder").focus();
			// 			});
			// 		}.bind(this)
			// 	});
		},*/

		_getDialog: function () {

			if (!this._oDialog) {
				this._oDialog = sap.ui.xmlfragment("de.mindsquare.mm.mind2_wm_2_goods_issue_list.view.view.createIncident", this.getView().getController());
				this.getView().addDependent(this._oDialog);
			}
			return this._oDialog;
		},

		createIncident: function () {

			this._getDialog().open();
		},

		onBtnCancelPress: function () {

			sap.ui.getCore().byId("iAuftext").setValue("");
			this._getDialog().close();
		},

		onIncidentListItemPress: function (oEvent) {

			var sAufnr = oEvent.getSource().getBindingContext().getObject().Aufnr;
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			//@TODO
			var aFilter = [];
			var oFilter = new sap.ui.model.Filter("Aufnr", "EQ", sAufnr);
			aFilter.push(oFilter);
			sap.ui.core.BusyIndicator.show();
			var oMessageManager = sap.ui.getCore().getMessageManager();
			oMessageManager.removeAllMessages();
			this.getView().getModel().read("/OrderSet", {
				filters: aFilter,
				success: function (oData) {
					sap.ui.core.BusyIndicator.hide();
					if (oData.results.length === 1) {
						oRouter.navTo("materialList", {
							path: "OrderSet('" + oData.results[0].Aufnr + "')",
							origin: "orderRemoval",
							from: "searchByOrder"
						});
					}
				}.bind(this),
				error: function () {
					sap.ui.core.BusyIndicator.hide();
					var oMMData = oMessageManager.getMessageModel().getData();
					if (oMMData.length > 1) {
						this.showMessageErrorDialog(oMessageManager.getMessageModel().getData()[1].message);
					} else if (oMMData.length !== 0) {
						this.showMessageErrorDialog(oMessageManager.getMessageModel().getData()[0].message);
					} else {
						this.showMessageErrorDialog("ERROR");
					}
				}.bind(this)
			});
			// oRouter.navTo("materialList", {
			// 	path: "OrderSet('" + sAufnr + "')",
			// 	origin: "orderRemoval"
			// });
		},

		onBtnSubmitIncidentPress: function () {

			var sAuftext = sap.ui.getCore().byId("iAuftext").getValue();
			var oMessageManager = sap.ui.getCore().getMessageManager();
			oMessageManager.removeAllMessages();
			this.getView().getModel().callFunction("/create_incident", {
				method: "POST",
				urlParameters: {
					auftext: sAuftext
				},
				success: function (oData, response) {
					this.showSuccessMessage(response);
					this._getDialog().close();
					sap.ui.getCore().byId("iAuftext").setValue("");
				}.bind(this),
				error: function () {
					var oMMData = oMessageManager.getMessageModel().getData();
					if (oMMData.length > 1) {
						this.showMessageErrorDialog(oMessageManager.getMessageModel().getData()[1].message);
					} else if (oMMData.length !== 0) {
						this.showMessageErrorDialog(oMessageManager.getMessageModel().getData()[0].message);
					} else {
						this.showMessageErrorDialog("ERROR");
					}
				}.bind(this)
			});
		}

	});
});