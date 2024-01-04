/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require(["com/eldorado/sap/eblog/ovpccoshipbase/test/integration/AllJourneys"
	], function () {
		QUnit.start();
	});
});
