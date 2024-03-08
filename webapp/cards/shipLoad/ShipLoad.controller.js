(function() {
	"use strict";

	jQuery.sap.require("com/eldorado/sap/eblog/ovpccoshipbase/utils/Formatter");
	jQuery.sap.require("sap/viz/ui5/data/FlattenedDataset");
	jQuery.sap.require("sap/viz/ui5/format/ChartFormatter");
	jQuery.sap.require("sap/viz/ui5/api/env/Format");
	jQuery.sap.require("sap/ui/core/HTML");
	jQuery.sap.require("sap/viz/ui5/controls/Popover");

	var FlattenedDataset	= sap.viz.ui5.data.FlattenedDataset,
		ChartFormatter 		= sap.viz.ui5.format.ChartFormatter, 
		Format 				= sap.viz.ui5.api.env.Format,
		HTMLControl 		= sap.ui.core.HTML,
		Popover				= sap.viz.ui5.controls.Popover;

	
	sap.ui.controller("com.eldorado.sap.eblog.ovpccoshipbase.cards.shipLoad.ShipLoad", {
		oFormatter: com.eldorado.sap.eblog.ovpccoshipbase.utils.Formatter, 		

		onInit: function() {
			this._oVizFrame = this.getView().byId("idVizFrame");
			//Format.numericFormatter(ChartFormatter.getInstance());
            var formatPattern = ChartFormatter.DefaultPattern;
			this._oVizFrame.setVizProperties({
				legend: {
					isScrollable: false
				},
				interaction:{
					noninteractiveMode: false,
					selectability: {
						legendSelection: true,
						axisLabelSelection: true,
						mode: 'EXCLUSIVE',
						plotLassoSelection: true,
						plotStdSelection: true
					},
					zoom:{
						enablement: 'disabled'
					}
				},
				plotArea: {
					window: {
						start: 'firstDataPoint',
						end: 'lastDataPoint'
					},
					mode: "percentage",
					dataLabel: {
						type: "value",
						formatString: formatPattern.SHORTFLOAT, //ChartFormatter.DefaultPattern.STANDARDPERCENT_MFD2, //"axisFormatter/-1/"
						visible: true,
						style: {
							fontWeight: 'bold'
						},
						hideWhenOverlap: false, 
						renderer: (oEvent) => {							
							let oModel = this.getModel();
							let oContext = this._oVizFrame.getDataset().getBinding("data").getContexts()[oEvent.ctx._context_row_number];
			
							if(!oEvent.ctx[oEvent.ctx.measureNames]) {								
								return;
							}
			
							if(oModel.getProperty("/#ZC_EWM_ShipLoadBasementLoad/RealLoadQuantity/@sap:label") === oEvent.ctx.measureNames) {
								oEvent.text = `${oEvent.ctx[oEvent.ctx.measureNames]}`;
							} else if(parseFloat((oContext.getObject().BasementCapacity||0)).toFixed(0) !== parseFloat(oEvent.ctx[oEvent.ctx.measureNames]).toFixed(0)) {
								oEvent.text = `${oEvent.ctx[oEvent.ctx.measureNames]} (${parseFloat((oContext.getObject().BasementCapacity||0)).toFixed(0)})`;
							} else {
								oEvent.text = oEvent.ctx[oEvent.ctx.measureNames];
							}
						}
					}, 
					dataPoint: {
						invalidity: 'ignore'
					}, 
					colorPalette: 
						["#C9C12D", "#006C45"]
				},
				valueAxis: {
					label: {
						formatString: "0%"
					},
					title: {
						visible: true
					}
				},
				valueAxis2: {
					label: {
						formatString: formatPattern.SHORTFLOAT
					},
					title: {
						visible: true
					}
				},
				categoryAxis: {
					label: {
						truncatedLabelRatio: 0.15
					},
					title: {
						visible: true
					}
				},
				title: {
					visible: true,
					text: this.getOwnerComponent().getComponentData().i18n.getResourceBundle().getText("card01.title")
				},
				general:{
					groupData: false,
					showAsUTC: true
				}
			});

			this._oVizFrame.attachRenderComplete(null, this._renderComplete, this);

			this._oPopOver = new Popover(this._getPopoverPoperties().popoverProps); //this.getView().byId("idPopOver");
            this._oPopOver.connect(this._oVizFrame.getVizUid());
		}, 

		_renderComplete: function(oEvent) {
			let oVizProp = this._oVizFrame.getVizProperties();
			let sNewText = this.getView().getModel("uiStatic").getProperty("/TripText");

			if(oVizProp.title.text !== sNewText) {
				oVizProp.title.text = sNewText; 
				this._oVizFrame.setVizProperties(oVizProp);
			}
		},

		// _requestCompleted: function(oEvent) {
		// 	let sShip = this.getView().getModel("uiStatic").getProperty("/TripText");
			// if(oEvent.getParameter("response").statusCode === "200") {
			// 	try{
			// 		let oJson = JSON.parse(oEvent.getParameter("response").responseText);
			// 		let oData = (oJson.d.results && oJson.d.results.length > 0 && oJson.d.results[0] || undefined); 
			// 		if(!oData) {
			// 			throw "No data"; 
			// 		}
			// 	} catch(e) {

			// 	}
			// }
		// },

		_getPopoverPoperties: function() {
			var that = this;
			return {
				popoverProps : {
					'customDataControl' : function(data) {
						if (data.data.val) {
							let oFilterData = 
								this.getOwnerComponent().getComponentData().mainComponent.oGlobalFilter.getFilterData();
							
							let sKey = 
								this.getModel().createKey("/ZC_EWM_ShipLoadBasementLoad", 
									{ Warehouse: (oFilterData.Warehouse.items && oFilterData.Warehouse.items.length > 0 && oFilterData.Warehouse.items[0].key || 
												  	oFilterData.Warehouse.ranges && oFilterData.Warehouse.ranges.length > 0 && oFilterData.Warehouse.ranges[0].value1 || 
												  	oFilterData.Warehouse), 
												  
									  TripNumber: (oFilterData.TripNumber.items && oFilterData.TripNumber.items.length > 0 && oFilterData.TripNumber.items[0].key || 
													oFilterData.TripNumber.ranges && oFilterData.TripNumber.ranges.length > 0 && oFilterData.TripNumber.ranges[0].value1 || 
													oFilterData.TripNumber), 
									  Basement: data.data.val[0].value });
							
							let oObject = this.getModel().getObject(sKey);
							
							var svg = "<svg width='10px' height='10px'><path d='M-5,-5L5,-5L5,5L-5,5Z' fill='" + data.data.color + "' transform='translate(5,5)'></path></svg>";
							var divStr = "";
							var values = [];
							values = data.data.val;
							//var bIsEmbarque = this.getModel().getObject("/#ZC_EWM_ShipLoadBasementLoad/BasementCapacityStack/@sap:label") === values[2].id;
							//idx = values[1].value
							divStr = divStr + "<div class='popOverChartLayout'>" + svg + "<b style='margin-left:10px'>Porão: </b>" + values[0].value + "</div>";
							divStr = divStr + `<div class='popOverChartLayout'><b style='margin-left:10px'>Capacidade Total: </b>${oObject.BasementCapacity} ${this.oFormatter.fnFormatUnit(oObject.BasementCapacityUnit)}</div>`;
							divStr = divStr + `<div class='popOverChartLayout'><b style='margin-left:10px'>Embarcado: </b>${oObject.RealLoadQuantity} ${this.oFormatter.fnFormatUnit(oObject.LoadQuantityUnit)}</div>`;
							divStr = divStr + `<div class='popOverChartLayout'><b style='margin-left:10px'>Saldo: </b>${oObject.BasementCapacityStack} ${this.oFormatter.fnFormatUnit(oObject.BasementCapacityUnit)}</div>`;
							//if(bIsEmbarque) {
								divStr = divStr + "<div class='popOverChartLayout'><b style='margin-left:10px'>Produtos:</b></div>";
								oObject.to_BasementProducts.__list.forEach((oItem) => {
									let oProduct = this.getModel().getObject("/".concat(oItem));
									//divStr = divStr + "<div style = 'margin: 5px 30px 0 30px'>" + values[2].name + "<span style = 'float: right'>" + values[2].value + "</span></div>";
									divStr = divStr + "<div style = 'margin: 5px 30px 0 30px'><span style = 'float: right'>" + `${oProduct.ProductName} (${oProduct.Product})` + "</span></div>";
									divStr = divStr + "<div style = 'margin: 5px 30px 0px 30px'>Embarcado:<span style = 'float: right'>" + `${oProduct.RealLoadQuantity} ${this.oFormatter.fnFormatUnit(oProduct.QuantityUnit)}` + "</span></div>";
									divStr = divStr + `<div style = 'margin: 5px 30px 15px 30px'>Qtd. de Retorno:<span style = 'float: right'>${oProduct.ReturnQuantity} ${this.oFormatter.fnFormatUnit(oProduct.QuantityUnit)}</span></div>`;
									//LoadQuantity

								});
							//} else {
							//	divStr = divStr + "<div class='popOverChartLayout'><b style='margin-left:10px'>Produtos:</b></div>";
							//}
							
							
							return new HTMLControl({content:divStr});
						}
					}.bind(this)
				}
			};
		}

	});
})();