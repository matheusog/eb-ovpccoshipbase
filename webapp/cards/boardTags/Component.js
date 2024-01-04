sap.ui.define([
	"com/el/ovp/cards/generic/Component"
], function(Component) {
	"use strict";

	return Component.extend("com.eldorado.sap.eblog.ovpccoshipbase.cards.boardTags.Component", {
        metadata: {
			properties: {
				"contentFragment": {
					"type": "string",
					"defaultValue": "com.eldorado.sap.eblog.ovpccoshipbase.cards.boardTags.BoardTags"
				}
			},

			version: "1.44.08",

			library: "com.el.ovp",

			includes: [],

			dependencies: {
				libs: ["sap.m", "sap.ui.core"],
				components: []
			},
			config: {},
			customizing: {
				"sap.ui.controllerExtensions": {
					"com.el.ovp.cards.generic.Card": {
						controllerName: "com.eldorado.sap.eblog.ovpccoshipbase.cards.boardTags.BoardTags"
					}
				}
			}
		}
	});
});