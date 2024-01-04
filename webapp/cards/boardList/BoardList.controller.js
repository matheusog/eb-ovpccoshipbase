(function() {
	"use strict";

	jQuery.sap.require("com/eldorado/sap/eblog/ovpccoshipbase/utils/Formatter");
	//var Formatter	= com.eldorado.sap.eblog.ovpccoshipbase.utils.Formatter;

	sap.ui.controller("com.eldorado.sap.eblog.ovpccoshipbase.cards.boardList.BoardList", {
		oFormatter: com.eldorado.sap.eblog.ovpccoshipbase.utils.Formatter, 

		onListPress: function(oEvent) {
			var oObject = oEvent.getSource().getBindingContext().getObject();
		}
	});
})();