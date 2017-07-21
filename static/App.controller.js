sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function (Controller) {
	"use strict";

	return Controller.extend("my.app.App", {

		onInit : function(){
			this.oModel = new sap.ui.model.json.JSONModel("/ch/");
			sap.ui.getCore().setModel(this.oModel);
			this.oSelectedModel = new sap.ui.model.json.JSONModel();
			sap.ui.getCore().setModel(this.oSelectedModel, 'selected');
		},

		onRefresh: function(){
			this.oModel.loadData('/ch/');
			this.oModel.refresh();
		},

		onNew : function () {
			var oDialogFragment = sap.ui.xmlfragment("my.app.EditPopup",this.getView().getController());
			//this.oSelectedModel.setData({})
			oDialogFragment.open();
		},

		onClosedialog: function(oEvent){
			oEvent.oSource.getParent().close();
			oEvent.oSource.getParent().destroy();
		},

		onEdit: function(oEvent){
			var sPath = oEvent.oSource.getParent().getParent().getBindingContextPath();
			var data  = this.oModel.getProperty(sPath);
			this.oSelectedModel.setData(data)
			var oDialogFragment = sap.ui.xmlfragment("my.app.EditPopup",this.getView().getController());
			oDialogFragment.open();
		}, 
		onDel: function(oEvent){
			var sPath = oEvent.oSource.getParent().getParent().getBindingContextPath();
			var data  = this.oModel.getProperty(sPath);
			var that = this;
			var oReq = $.ajax({ type : "DELETE",
								contentType : "application/json",
								url : "/ch/",
								dataType : "json",
								data : JSON.stringify(data),
								success : function(data,textStatus, jqXHR) {
									that.onRefresh();
							}});
		},

		onSaveEntrie: function(oEvent){
			var that = this;
			var data = this.oSelectedModel.getData();

			var oReq = $.ajax({ type : "POST",
								contentType : "application/json",
								url : "/ch/",
								dataType : "json",
								data : JSON.stringify(data),
								success : function(data,textStatus, jqXHR) {
									that.onRefresh();
							}});

			this.onClosedialog(oEvent);
		}
	});

});