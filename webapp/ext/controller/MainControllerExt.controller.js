(function () {
    "use strict";

    /*global sap, jQuery */
    jQuery.sap.require("sap/ui/model/Filter");
    jQuery.sap.require("sap/ui/model/FilterOperator");
    jQuery.sap.require("sap/ui/model/json/JSONModel");
    jQuery.sap.require("sap/ui/core/format/DateFormat");
    jQuery.sap.require("sap/m/MessageBox");
    jQuery.sap.require("sap/ui/generic/app/navigation/service/NavError");
    jQuery.sap.require("sap/ui/generic/app/navigation/service/SelectionVariant");
    jQuery.sap.require("sap/viz/ui5/format/ChartFormatter");
    jQuery.sap.require("sap/viz/ui5/api/env/Format");
    jQuery.sap.require("com/el/ovp/cards/charts/VizAnnotationManager");
    sap.viz.api.env.Format
    var Filter              = sap.ui.model.Filter,
        FilterOperator      = sap.ui.model.FilterOperator,
        JSONModel           = sap.ui.model.json.JSONModel,
        DateFormat          = sap.ui.core.format.DateFormat, 
        MessageBox          = sap.m.MessageBox,
        NavError            = sap.ui.generic.app.navigation.service.NavError,
        SelectionVariant    = sap.ui.generic.app.navigation.service.SelectionVariant,
        ChartFormatter      = sap.viz.ui5.format.ChartFormatter;

    sap.ui.controller("com.eldorado.sap.eblog.ovpccoshipbase.ext.controller.MainControllerExt", {
        
        onInit: function() {            
            // var fnCreate = com.el.ovp.cards.generic.Component.prototype.createContent;
            // com.el.ovp.cards.generic.Component.prototype.createContent = function() {
            //     var oView = (fnCreate||Function.prototype).bind(this)();
            //
                // var fnViewInit = oView.getController().onInit;
                // oView.getController().onInit = () => {
                //     (fnViewInit||Function.prototype).bind(oView.getController())();
                //     //if(!oView._bCustomLoaded) {
                //     //    oView._bCustomLoaded = true;
                //         var FIORI_PERCENTAGE_WITH_VAL_FORMAT = "__UI5__PercentageWithValue";  
                    
                //         var oChartFormatter = ChartFormatter.getInstance();  
                //         oChartFormatter.registerCustomFormatter(FIORI_PERCENTAGE_WITH_VAL_FORMAT, function(value) {  
                //             let oPercentage = sap.ui.core.format.NumberFormat.getPercentInstance({style: 'percent',  
                //                 maxFractionDigits: 0});  
                //             return oPercentage.format(value);  
                //         });  
                //         //apply  
                //         sap.viz.ui5.api.env.Format.numericFormatter(oChartFormatter); 
                //     //}
                // };
               // }
                //return oView;
            //};

            this._oUiStaticModel = new JSONModel({ TripText: "" });
            this.getView().setModel(this._oUiStaticModel, "uiStatic");

            this.oGlobalFilter.attachSearch(null, (oEvent) => {
                let aFilters = oEvent.getParameters()[0].selectionSet;
                if(aFilters.length === 0) {
                    return;
                }
                let aTripFilter = aFilters.filter((oItem) => { return oItem.getId().indexOf("TripNumber") >= 0; });
                if(aTripFilter.length === 0) {
                    return; 
                }
                
                var aTokens = aTripFilter[0].getTokens();
                if(aTokens.length === 0) {
                    return; 
                }
                
                let sTrip = aTokens[0].getKey();
                let sTripText = aTokens[0].getText();
                if(sTrip) {
                    this.getView().getModel("uiStatic").setProperty("/TripText", sTripText);
                    return;    
                }
                
                sTrip = sTripText.substring(1); //Remove '=' symbol
                if(!sTrip) {
                    return;
                }

                this.getView().getModel().read(`/ZI_EWM_TripHeaderVH`, {
                    filters: [ new Filter('TripNumber', FilterOperator.EQ, sTrip) ],
                    success: (oResponse) => { 
                        if(oResponse && oResponse.results) {
                            const sTrip = oResponse.results[0].TripNumber;
                            const sShipName = oResponse.results[0].ShipName; 
                            aTokens[0].setKey(sTrip);
                            aTokens[0].setText(`${sTrip} (${sShipName})`);
                            this.getView().getModel("uiStatic").setProperty("/TripText", sShipName);
                        }
                    },
                    error: (oError) => {
                        MessageBox.error(oError.responseText); 
                    }
                });              
                
            }, this);
            
            var fnFormat = com.el.ovp.cards.charts.VizAnnotationManager.formatChartAxes;
            com.el.ovp.cards.charts.VizAnnotationManager.formatChartAxes = function() {
                fnFormat.bind(this)();
                var FIORI_PERCENTAGE_WITH_VAL_FORMAT = "__UI5__PercentageWithValue";  
                
                // var oChartFormatter = ChartFormatter.getInstance();  
                // oChartFormatter.registerCustomFormatter(FIORI_PERCENTAGE_WITH_VAL_FORMAT, function(value) {  
                //     let oPercentage = sap.ui.core.format.NumberFormat.getPercentInstance({style: 'percent',  
                //         maxFractionDigits: 0});  
                //     return oPercentage.format(value);  
                // });  

                var oChartFormatter = {
                    locale: function(){},
                    format: function(value, pattern) {
                        var patternArr = "";
                        if (pattern) {
                            patternArr = pattern.split('/');
                        }
                        if (patternArr.length > 0) {
                            var minFractionDigits, shortRef;
                            if (patternArr.length == 3) {
                                minFractionDigits = Number(patternArr[1]);
                                shortRef = Number(patternArr[2]);
                                if (isNaN(minFractionDigits)) {
                                    minFractionDigits = -1;
                                }
                                if (isNaN(shortRef)) {
                                    shortRef = 0;
                                }
                            } else {
                                minFractionDigits = 2;
                                shortRef = 0;
                            }
                            if (patternArr[0] == "axisFormatter" || (patternArr[0] == "ShortFloat")) {
                                // if (pattern == "axisFormatter") {
                                var numberFormat;
                                numberFormat = sap.ui.core.format.NumberFormat.getFloatInstance(
                                    {style: 'medium',
    //										shortRefNumber: shortRef, //FIORITECHP1-4935Reversal of Scale factor in Chart and Chart title.
    //										showScale: false,
                                            minFractionDigits: minFractionDigits,
                                            maxFractionDigits: minFractionDigits}
                                );
                                if (patternArr[0] == "ShortFloat") {
                                    numberFormat = sap.ui.core.format.NumberFormat.getFloatInstance(
                                        {style: 'medium',
                                                minFractionDigits: minFractionDigits,
                                                maxFractionDigits: minFractionDigits}
                                    );
                                }
                                if (minFractionDigits === -1) {
                                    numberFormat = sap.ui.core.format.NumberFormat.getFloatInstance(
                                            {style: 'medium'}
                                        );
                                }
                                return numberFormat.format(Number(value)); 
                            }else if (patternArr[0] === "tooltipNoScaleFormatter"){//Pattern for tooltip other than Date
                                    var tooltipFormat = sap.ui.core.format.NumberFormat.getFloatInstance(
                                    {style: 'medium',
                                        currencyCode: false,
                                        shortRefNumber: shortRef,
                                        showScale: false,
                                        minFractionDigits: minFractionDigits,
                                        maxFractionDigits: minFractionDigits}
                                );
                                if (minFractionDigits === -1) {
                                    tooltipFormat = sap.ui.core.format.NumberFormat.getFloatInstance(
                                        {
                                            minFractionDigits: 0,
                                            currencyCode: false}
                                    );
                                }
                                return tooltipFormat.format(Number(value));
                            } else if (patternArr[0] == "CURR"){
                                var currencyFormat = sap.ui.core.format.NumberFormat.getCurrencyInstance(
                                        {style: 'medium',
                                            currencyCode: false,
    //										shortRefNumber: shortRef, //FIORITECHP1-4935Reversal of Scale factor in Chart and Chart title.
    //										showScale: false,
                                            minFractionDigits: minFractionDigits,
                                            maxFractionDigits: minFractionDigits}
                                    );
                                if (minFractionDigits === -1) {
                                    currencyFormat = sap.ui.core.format.NumberFormat.getCurrencyInstance(
                                            {style: 'medium',
                                                currencyCode: false}
                                        );
                                }
                                return currencyFormat.format(Number(value));
                            } else if ( patternArr[0].search("%") !== -1) {
                                //FIORITECHP1-5665 - Donut and Pie charts should be able to show numbers
                                var percentFormat = sap.ui.core.format.NumberFormat.getPercentInstance(
                                        {style: 'short', 
                                        minFractionDigits: minFractionDigits,
                                        maxFractionDigits: minFractionDigits
                                    });
                                if (minFractionDigits === -1) {
                                    percentFormat = sap.ui.core.format.NumberFormat.getPercentInstance(
                                            {style: 'short', 
                                                minFractionDigits: 1,
                                                maxFractionDigits: 1
                                            });
                                }
                                value = percentFormat.format(Number(value));
                                return value;
                            }
                        }
                        if (value.constructor === Date) {
                            jQuery.sap.require("sap.ui.core.format.DateFormat");
                            //var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "dd-MMM"});
                            //Commented for FIORITECHP1-3963[DEV] OVP-AC – Remove the formatting of the Time Axis
                            var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: pattern});
                            if (pattern === "YearMonthDay") {
                                oDateFormat = sap.ui.core.format.DateFormat.getDateInstance({style: "medium"});
                            }
                            value = oDateFormat.format(new Date(value));
                        }
                        return value;
                    }
                };
                //apply  
                sap.viz.ui5.api.env.Format.numericFormatter(oChartFormatter); 
            }
        },

        onBeforeRebindPageExtension: function(oCards, oSmartVariants) {
        },
        
        onCustomActionPress: function() {
        },

        onCustomParams: function(sCustomParams) {
        },

        restoreCustomAppStateDataExtension: function (oCustomData) {
        },

        getParamSchedulingDonut: function(oNavigateParams) {
        },

		getCustomFilters: function () { 
		}, 

        getCustomAppStateDataExtension: function(oCustomData) {
        }, 

        onNavSoF: function(oEvent) {
            //alert("Navegacao");
            //let oNavController = this.extensionAPI.getNavigationController();
            //oNavController.navigateExtenal("SOF", {});

            var oResourceBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();
            function fnHandleError(oError) {
                if (oError instanceof NavError) {
                    if (oError.getErrorCode() === "NavigationHandler.isIntentSupported.notSupported") {
                        MessageBox.show(oResourceBundle.getText("ST_NAV_ERROR_NOT_AUTHORIZED_DESC"), {
                            title: oResourceBundle.getText("ST_GENERIC_ERROR_TITLE")
                        });
                } else {
                        MessageBox.show(oError.getErrorCode(), {
                            title: oResourceBundle.getText("ST_GENERIC_ERROR_TITLE")
                        });
                    }
                }
            }
            
            var oSelectionVariant = this.oGlobalFilter.getUiState().getSelectionVariant();
            var sSelectionVariant = oSelectionVariant && JSON.stringify(oSelectionVariant);
            //Get data from standard filters
            var oNavigableSelectionVariant = new SelectionVariant(sSelectionVariant);
            var oInAppData = {selectionVariant: oNavigableSelectionVariant.toJSONString()};
                //this.oNavigationHandler.mixAttributesAndSelectionVariant({});
            this.oNavigationHandler.navigate("EBLOGCCOShipLoad", "displayOper", sSelectionVariant, oInAppData, fnHandleError);
        }
    });
//});
})();