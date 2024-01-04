sap.ui.define([
], function () {
	"use strict";
    
	return {
		
		/**
		 * Returns formatted seconds in minutes
		 *
		 * @public
		 * @param {integer} iSeconds Time in seconds 
		 * @returns {string} Formatted time in minutes
		 */
		fnFormatTerno: function(sTerno) {
			return sTerno === "00" ? "Navio" : `Terno ${sTerno}`;
		}, 

		/**
		 * Returns formatted seconds in minutes
		 *
		 * @public
		 * @param {integer} iSeconds Time in seconds 
		 * @returns {string} Formatted time in minutes
		 */
		fnFormatMinutes : function(iSeconds) {

			if(!iSeconds) {
				return "00:00"; 
			}

			let iHours		= Math.floor(iSeconds / 3600);
			let iMinutes 	= Math.floor(( (iSeconds - (iHours * 3600)) / 60));
			let iRemSeconds = Math.floor((iSeconds - (iHours * 3600) - (iMinutes * 60)));

			function fnPadLeft(sInput, cPad, iLength) {
				return (new Array(iLength + 1).join(cPad) + sInput).slice(-iLength);
			}
			  
			return iHours === 0 ? 
					fnPadLeft(iMinutes, '0', 2) + ':' + fnPadLeft(iRemSeconds, '0', 2) : 
					iHours < 100 ? 
						fnPadLeft(iHours, '0', 2) + ':' + fnPadLeft(iMinutes, '0', 2) + ':' + fnPadLeft(iRemSeconds, '0', 2) :
						fnPadLeft(iHours, '0', 3) + ':' + fnPadLeft(iMinutes, '0', 2) + ':' + fnPadLeft(iRemSeconds, '0', 2) ;
		},

		/**
		 * Returns formatted seconds in minutes with text
		 *
		 * @public
		 * @param {integer} iSeconds Time in seconds 
		 * @returns {string} Formatted time in minutes
		 */
		fnFormatMinutesText : function(iSeconds) {
			let sReturn; 

			if(!iSeconds) {
				return "0 minuto(s)"; 
			}

			let iHours		= Math.floor(iSeconds / 3600);
			let iMinutes 	= Math.floor(( (iSeconds - (iHours * 3600)) / 60));
			let iRemSeconds = Math.floor((iSeconds - (iHours * 3600) - (iMinutes * 60)));

			function fnPadLeft(sInput, cPad, iLength) {
				return (new Array(iLength + 1).join(cPad) + sInput).slice(-iLength);
			  }
			
			if(iHours === 0) {
				sReturn = `${ iMinutes } minuto(s)`;
				if (iRemSeconds > 0) {
					sReturn = sReturn.concat(`e ${ iRemSeconds } segundo(s)`);
				}
			} else {
				sReturn = `${ iHours } hora(s)`;
				if (iMinutes > 0) {
					sReturn = sReturn.concat(`e ${ iMinutes } minuto(s)`);
				}
			}
			
			return sReturn;
		},

		/**
		 * Returns formatted chart tooltip
		 *
		 * @public
		 * @param {object} oContext Binding context 
		 * @returns {string} Formatted tooltip
		 */
		fnFormatMicroChartTooltip : function(oContext) {
			return "";
		},
		
		/**
		 * Format UNIT
		 *
		 * @public
		 * @param {object} oContext Binding context 
		 * @returns {string} Formatted tooltip
		 */
		fnFormatUnit: function(sUnit) {
			return sUnit === "TO" ? "t" : sUnit; 
		},

		/**
		 * Returns formatted message type
		 *
		 * @public
		 * @param {string} sMessageType Message Type
		 * @returns {sap.ui.core.MessageType} Formatted Message Type
		 */
		fnFormatMsgType : function(sMessageType) {
			var sMsgType;
			switch(sMessageType) {
				case "S": 
					sMsgType = sap.ui.core.MessageType.Success;
					break;
				case "I":
					sMsgType = sap.ui.core.MessageType.Information;
					break;
				case "W": 
					sMsgType = sap.ui.core.MessageType.Warning; 
					break;
				default:
					sMsgType = sap.ui.core.MessageType.Error;
					break;
			}
			return sMsgType;
        }
	};
},/*export*/true);