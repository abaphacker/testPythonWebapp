sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function (Controller) {
	"use strict";

	return Controller.extend("my.app.App", {

		onInit : function(){
			self.oModel = new sap.ui.model.json.JSONModel("/ch/");
			sap.ui.getCore().setModel(oModel);
		},
		onNew : function () {
			var oDialogFragment = sap.ui.xmlfragment("my.app.EditPopup",this.getView().getController());
            oDialogFragment.setB
			oDialogFragment.open();
		},

		onRowSelected: function(oEvent){
			var sPath = oEvent.mParameters.listItem.getBindingContextPath()
			//get the selected  data from the model 
			var data  = self.oModel.getProperty(sPath);
			self.oSelectedModel = new sap.ui.model.json.JSONModel();
			self.oSelectedModel.setData(data)
			sap.ui.getCore().setModel(self.oSelectedModel, 'selected');
		}
	});

});