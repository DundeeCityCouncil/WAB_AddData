define(['dojo/_base/declare',
    'jimu/BaseWidget',
    'jimu/loaderplugins/jquery-loader!https://code.jquery.com/jquery-1.11.2.min.js',
    'esri/arcgis/Portal',
    'esri/arcgis/utils',
    "./LayerLoader",
    "dijit/_TemplatedMixin",
    "dijit/_WidgetsInTemplateMixin",
    "dojo/text!./templates/AddFromGISPane.html",
    "esri/layers/ArcGISDynamicMapServiceLayer",
    "esri/layers/ArcGISImageServiceLayer",
    "esri/layers/ArcGISTiledMapServiceLayer",
    "esri/layers/DynamicLayerInfo",
    "esri/layers/FeatureLayer",
    "esri/layers/ImageParameters",
    "esri/layers/ImageServiceParameters",
    "esri/layers/KMLLayer",
    "esri/layers/LayerDrawingOptions",
    "esri/layers/MosaicRule",
    "esri/layers/RasterFunction",
    "esri/layers/VectorTileLayer",
    'esri/layers/WMSLayer', 'esri/dijit/PopupTemplate'],
        function (declare, BaseWidget, $, arcgisPortal, arcgisUtils, LayerLoader, _TemplatedMixin, _WidgetsInTemplateMixin,template, ArcGISDynamicMapServiceLayer, ArcGISImageServiceLayer, ArcGISTiledMapServiceLayer,
                DynamicLayerInfo, FeatureLayer, ImageParameters, ImageServiceParameters, KMLLayer,
                LayerDrawingOptions, MosaicRule, RasterFunction, VectorTileLayer, WMSLayer, PopupTemplate) {
            //To create a widget, you need to derive from BaseWidget.

            return declare([BaseWidget, _TemplatedMixin, _WidgetsInTemplateMixin], {
                // Custom widget code goes here

                baseClass: 'jimu-widget-addmapdata',
                templateString: template,
                wabWidget: null,

                //this property is set by the framework when widget is loaded.
                //name: 'AddMapData',


                //methods to communication with app container:

                postCreate: function () {
                    this.inherited(arguments);

                },

                startup: function () {

                    this.inherited(arguments);
                    this.portalQuery();
                },

                _portalMap: {},
                portalQuery: function () {
                    var data = this;
                    var OpLayers = {};
                    var myPortal = new arcgisPortal.Portal("https://mapsonline.dundeecity.gov.uk/portal/");
                    var params = {q: "group:\"574abc27ed8a475faeba54d9a0bfd9ed\" type:\"Web Map\"", num: 100};
                    myPortal.queryItems(params).then(function (groups) {
                        for (var result in groups.results)
                        {
                            var layerTitle = groups.results[result].title;
                            var MapID = groups.results[result].id;
                            data.mapItems.innerHTML += "<li data-portal-item='" + MapID + "'>" + layerTitle + "<span class='added' ></span></li>";
                            arcgisUtils.getItem(MapID).then(function (eachLayer) {
                                opTitle = eachLayer.item.title;
                                OpLayers[opTitle] = eachLayer;
                                data._portalMap[eachLayer.item.id] = eachLayer;
                            });
                        }
                    });
                },

                loadLayer: function (event) {
                    
                    this.inherited(arguments);
                    
                    var dataL = this.wabWidget;
                    
                   
                    var ID = $(event.target).data('portal-item');
                    var tempMapObj = arcgisUtils.createMap(ID, "map2");
                      textPlaceHolder=$(event.target).context.innerHTML;
                      console.log($(event.target));
                      $(event.target).context.firstElementChild.innerHTML = "&#10004; Added";

                    tempMapObj.then(function (response) {
                        var tempMap = response.map;
                        for (var j = 0; j < tempMap.graphicsLayerIds.length; j++)
                        {

                            var tempGLayer = tempMap.getLayer(tempMap.graphicsLayerIds[j]);
                            dataL.map.addLayer(tempGLayer);
                        }

                        for (var i = 1; i < tempMap.layerIds.length; i++)
                        {
                            //This loops skips the first object (Basemap)
                            var tempFLayer = tempMap.getLayer(tempMap.layerIds[i]);
                            dataL.map.addLayer(tempFLayer);

                        }

                    });
                }


                // onOpen: function(){
                //   console.log('onOpen');
                // },

                // onClose: function(){
                //   console.log('onClose');
                // },

                // onMinimize: function(){
                //   console.log('onMinimize');
                // },

                // onMaximize: function(){
                //   console.log('onMaximize');
                // },

                // onSignIn: function(credential){
                //   /* jshint unused:false*/
                //   console.log('onSignIn');
                // },

                // onSignOut: function(){
                //   console.log('onSignOut');
                // }

                // onPositionChange: function(){
                //   console.log('onPositionChange');
                // },

                // resize: function(){
                //   console.log('resize');
                // }

                //methods to communication between widgets:

            });
        });