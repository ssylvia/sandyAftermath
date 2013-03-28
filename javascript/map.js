  dojo.require("esri.map");
  dojo.require("esri.dijit.Legend");
  dojo.require("esri.dijit.Scalebar");
  dojo.require("esri.arcgis.utils");
  dojo.require("esri.IdentityManager");
  dojo.require("dijit.dijit");
  dojo.require("dijit.layout.BorderContainer");
  dojo.require("dijit.layout.ContentPane");
  dojo.require("dijit.layout.StackContainer");
  dojo.require("esri.dijit.TimeSlider");
  
     var map, urlObjects, chooseLayer, swipeslider, swipediv, clipval, offset_left, offset_top, swipelayerid="", swipeconnect=null;
     var mapLoaded = false;
	 var timeProperties = null;
	 
	 function initMap() {
       patchID();
      
       if(configOptions.geometryserviceurl && location.protocol === "https:"){
         configOptions.geometryserviceurl = configOptions.geometryserviceurl.replace('http:','https:');
       }
       esri.config.defaults.geometryService = new esri.tasks.GeometryService(configOptions.geometryserviceurl);

       if(!configOptions.sharingurl){
         configOptions.sharingurl = location.protocol + '//' + location.host + "/sharing/content/items";
       }
       esri.arcgis.utils.arcgisUrl = configOptions.sharingurl;
       
       if(!configOptions.proxyurl){   
         configOptions.proxyurl = location.protocol + '//' + location.host + "/sharing/proxy";
       }

       esri.config.defaults.io.proxyUrl =  configOptions.proxyurl;

       esri.config.defaults.io.alwaysUseProxy = false;
      
       urlObject = esri.urlToObject(document.location.href);
       urlObject.query = urlObject.query || {};
      
       if(urlObject.query.title){
         configOptions.title = urlObject.query.title;
       }
       if(urlObject.query.subtitle){
         configOptions.title = urlObject.query.subtitle;
       }
       if(urlObject.query.webmap){
         configOptions.webmap = urlObject.query.webmap;      
       } 
       if(urlObject.query.bingMapsKey){
         configOptions.bingmapskey = urlObject.query.bingMapsKey;      
       }

	   esri.arcgis.utils.arcgisUrl = "http://arcgis.com/sharing/content/items";	
		
	   var mapDeferred = esri.arcgis.utils.createMap(configOptions.webmap, "map", {
         mapOptions: {
           slider: true,
           nav: false,
           wrapAround180:true
         },
         ignorePopups:false,
         bingMapsKey: configOptions.bingmapskey
       });

       mapDeferred.addCallback(function (response) {

        dojo.forEach(response.itemInfo.itemData.bookmarks,function(bm){
          mapExtents.push(bm.extent);
        });
        
		 document.title = configOptions.title|| response.itemInfo.item.title || "";
         dojo.byId("title").innerHTML = configOptions.title ||response.itemInfo.item.title;
         dojo.byId("subtitle").innerHTML = configOptions.subtitle|| response.itemInfo.item.snippet || "";
        
         map = response.map;
		
		 dojo.connect(map,"onUpdateEnd",hideLoader);
		 dojo.connect(map,"onUpdateStart",showLoader);
		 
		 if(response.itemInfo.itemData.widgets && response.itemInfo.itemData.widgets.timeSlider){
          timeProperties =  response.itemInfo.itemData.widgets.timeSlider.properties;
        }
		
         var layers = response.itemInfo.itemData.operationalLayers;
         if(map.loaded){
           initUI(layers);
		   populateLayerList();
         }
         else{
           dojo.connect(map,"onLoad",function(){
             initUI(layers);
			 populateLayerList();
           });
         }
         //resize the map when the browser resizes
         dojo.connect(dijit.byId('map'), 'resize', map,map.resize);
       });

       mapDeferred.addErrback(function (error) {
         alert("Unable to create map: " + " " + dojo.toJson(error.message));
       });
	   
     }


     function initUI(layers) {
		 setUpLocations();
       //add chrome theme for popup
       dojo.addClass(map.infoWindow.domNode, "chrome");
       //add the scalebar 
       var scalebar = new esri.dijit.Scalebar({
         map: map,
         scalebarUnit:"english" //metric or english
       }); 
		
		/*
		
       var layerInfo = buildLayersList(layers);
      
       if(layerInfo.length > 0){
         var legendDijit = new esri.dijit.Legend({
           map:map,
           layerInfos:layerInfo
         },"legendDiv");
         legendDijit.startup();
       }
       else{
         dojo.byId('legendDiv').innerHTML = 'No operational layers';
       }
	   */
	   if(timeProperties){
	
		  var startTime = timeProperties.startTime;
		  var endTime = timeProperties.endTime;
		  var fullTimeExtent = new esri.TimeExtent(new Date(startTime), new Date(endTime));
	
		  map.setTimeExtent(fullTimeExtent);
		  //create the slider
		  timeSlider = new esri.dijit.TimeSlider({
			style: "width: 100%;",
			loop: configOptions.loop
		  }, dojo.byId("timeSliderDiv"));
		  
		  map.setTimeSlider(timeSlider);
		  //Set time slider properties 
		  timeSlider.setThumbCount(timeProperties.thumbCount);
		  timeSlider.setThumbMovingRate(timeProperties.thumbMovingRate);
		  //define the number of stops
		  if(timeProperties.numberOfStops){
			timeSlider.createTimeStopsByCount(fullTimeExtent,timeProperties.numberOfStops);
		  }else{
			timeSlider.createTimeStopsByTimeInterval(fullTimeExtent,timeProperties.timeStopInterval.interval,timeProperties.timeStopInterval.units);
		  }
		  //set the thumb index values if the count = 2
		  if(timeSlider.thumbCount ==2){
			timeSlider.setThumbIndexes([0,1]);
		  }
		  
		  dojo.connect(timeSlider,'onTimeExtentChange',function(timeExtent){
			//update the time details span.
			var timeString; 
			if(timeProperties.timeStopInterval !== undefined){
			switch(timeProperties.timeStopInterval.units){   
			case 'esriTimeUnitsCenturies':	
			  datePattern = 'yyyy G'
			  break;          
			case 'esriTimeUnitsDecades':
			  datePattern = 'yyyy'
			  break;  
			 case 'esriTimeUnitsYears':
			  datePattern = 'MMMM yyyy'
			  break;
			case 'esriTimeUnitsWeeks':	 
			  datePattern = 'MMMM d, yyyy'
			  break;
			case 'esriTimeUnitsDays':
			  datePattern = 'MMMM d, yyyy'
			  break;        
			case 'esriTimeUnitsHours':
			  datePattern = 'h:m:s.SSS a'
			  break;
			case 'esriTimeUnitsMilliseconds':
			  datePattern = 'h:m:s.SSS a'
			  break;          
			case 'esriTimeUnitsMinutes':
			  datePattern = 'h:m:s.SSS a'
			  break;          
			case 'esriTimeUnitsMonths':
			  datePattern = 'MMMM d, y'
			  break;          
			case 'esriTimeUnitsSeconds':
			  datePattern = 'h:m:s.SSS a'
			  break;          
		  }
		   timeString = formatDate(timeExtent.startTime,datePattern) + " to " + formatDate(timeExtent.endTime,datePattern);
		  }
		  else{
			timeString = formatDate(timeExtent.endTime,'MMMM d,yyyy');
		  }
	
			
			//dojo.byId('timeSliderLabel').innerHTML = timeString;
		  });
	
		  timeSlider.startup();
	   }
     }
	 
	 function formatDate(date,datePattern){
    return dojo.date.locale.format(date, {
        selector: 'date',
        datePattern: datePattern
      });
  	}
	 
     function buildLayersList(layers){
       //build a list of layers for the legend.
       var layerInfos = [];
       dojo.forEach(layers, function(mapLayer, index) {
         if(mapLayer.featureCollection){
           if (mapLayer.featureCollection.layers && mapLayer.featureCollection.showLegend) {
             if(mapLayer.featureCollection.layers.length === 1){
               layerInfos.push({"layer":mapLayer.featureCollection.layers[0].layerObject,"title":mapLayer.title});
             }
             else{
               dojo.forEach(mapLayer.featureCollection.layers, function(layer) {
                 layerInfos.push({
                   layer: layer.layerObject, 
                   title: layer.layerDefinition.name
                 });
               }); 
             }
           }
         }
		 else if (mapLayer.layerObject){
           layerInfos.push({layer:mapLayer.layerObject, title:mapLayer.title});
         }
       });
	   return layerInfos;
     }
    
     function patchID() {  //patch id manager for use in apps.arcgis.com
       esri.id._isIdProvider = function(server, resource) {
       // server and resource are assumed one of portal domains
 
       var i = -1, j = -1;
 
       dojo.forEach(this._gwDomains, function(domain, idx) {
         if (i === -1 && domain.regex.test(server)) {
           i = idx;
         }
         if (j === -1 && domain.regex.test(resource)) {
           j = idx;
         }
       });
 
       var retVal = false;
   
       if (i > -1 && j > -1) {
         if (i === 0 || i === 4) {
           if (j === 0 || j === 4) {
             retVal = true;
           }
         }
         else if (i === 1) {
           if (j === 1 || j === 2) {
             retVal = true;
           }
         }
         else if (i === 2) {
           if (j === 2) {
             retVal = true;
           }
         }
         else if (i === 3) {
           if (j === 3) {
             retVal = true;
           }
         }
       }
 
       return retVal;
     };    
    }
	
	function hideLoader(){
	  $("#loadingCon").hide();
	  if (mapLoaded == false){
		mapLoaded = true;
		$("#swipeImg").css('left',((map.width/2)-80));
		$("#swipeImg").css('top',((map.height/2)-50));
		$("#nextImg").css('top',((map.height/2)-50));
		$("#prevImg").css('top',((map.height/2)-50));
		$("#swipeImg").show();
		if (iPad == false){
			$("#prevImg").show();
			$("#nextImg").show();
			$("#prevImg").fadeOut('slow');
			$("#nextImg").fadeOut('slow');
		}
	  }
	}
	
	function showLoader(){
		$("#loadingCon").show();
	}
	
	//Swipe Control
	function populateLayerList(){			
	  var select = dojo.byId("layerlistdd");				
	  if (map.graphics.graphics.length > 0) {
		select.options[select.options.length] = new Option("Graphics Layer", map.graphics.id,"selected");
	  }
	  //reverse to get the correct order of layers added to map
	  var layerids = dojo.clone(map.layerIds).reverse();
	  dojo.forEach(layerids, function(id, index){
		select.options[select.options.length] = new Option(id, id);					
	  });
	  select.disabled= false;
	  startswipe();
	}
	
	function initswipe() {
      chooseLayer = configOptions.chooseSwipeLevel;
	  swipelayerid = dojo.byId("layerlistdd")[chooseLayer].value;
      clipval = map.width;
      swipediv = null;                
      if (swipelayerid == map.graphics.id) {
        //console.log("Graphics layer");
        //map.graphics._div.parent.rawNode.id
        swipediv = dojo.byId(map.container.id + "_gc");
      }
      else {
        var layer = map.getLayer(swipelayerid);
        //console.log(layer);                    
        if (layer == null || layer == undefined) {
          alert("Swipe layer not defined");
          return;
        }
        swipediv = layer._div;
	  }
      if (swipediv === undefined) {
        alert("unable to initialize swipe tool, try again");
        return;
      }
	  if (swipediv.style === undefined) {
		alert("Cannot swipe on this layer!");
		return;
	  }
      //console.log("Swipe ready to use on layer: " + swipelayerid);
    }
            
    function startswipe(){
      //map.hideZoomSlider();
      //console.log("Swipe tool initializing ...");
                
      initswipe();
        
      if (swipeslider != undefined || swipeslider != null) {
        //console.log("swipe slider is visible? should not happen");
        //console.log(swipeslider);         
	  }
	  
	  //swipelayerid = dojo.byId("layerlistdd").value;
	  //dojo.byId("layerlistdd").disabled = true;
	  
	  if (swipelayerid === undefined || swipelayerid == "") {
        alert("Swipe layer is not defined");
        return;
      }
      swipeslider = new dojo.dnd.move.parentConstrainedMoveable("sliderdiv", {
        area: "content",
        within: true
      });
                
      swipeslider.node.style.height = map.height + "px";
      swipeslider.node.style.top = "0px";
      swipeslider.node.style.left = ((map.width/2)-4) + "px";
	  if (iPad == true){
		swipeslider.node.style.left = ((map.width/2)-7) + "px";
	  }
      clipval = ((map.width/2)-4);
                
      //Just a check, should not call this function here                
        if (swipediv != null) 
        clearClip();
                
        //console.log("Swipe layer: " + swipelayerid);
                
        if (swipelayerid == null || swipelayerid == "") {
          alert("Swipe layer not defined!");
          return;
        }
                
        cliplayer(swipelayerid);
      }
            
      function cliplayer(layerid){
        //Initial swipe slider location                                                               
        swipe(dojo.byId("sliderdiv").style.left);
                
        //Make the slider visible
        dojo.byId("sliderdiv").style.display = "";
                
        dojo.connect(swipeslider, "onMoveStart", function(args){
        //console.log("move start");          
        //this.node.style.opacity = "0.5";
        dojo._setOpacity(this.node, 0.5);
		$("#swipeImg").fadeOut();
          
      });
      swipeconnect = dojo.connect(swipeslider, 'onMove', function(args){
        this.node.style.top = "0px"; //needed to avoid offset
        var left = parseInt(this.node.style.left);
        //console.log(left + ", " + (map.width));
        if (left <=0 || left >= (map.width)) return;       
          clipval = this.node.style.left;
          swipe(clipval);
        });
        dojo.connect(swipeslider, "onMoveStop", function(args){
          //console.log("move stop event");
          //this.node.style.opacity = "1.0";
          dojo._setOpacity(this.node, 1.0);
        });
        panEndConnect = dojo.connect(map, 'onPanEnd', function(args){
          //console.log("pan end event - refreshing swipe position");
          swipe(clipval);
        });

        if (map.navigationMode === "css-transforms") {
          panConnect = dojo.connect(map, 'onPan', function(args){
          //console.log("pan end event - refreshing swipe position");
          swipe(clipval);
        });
      }
    }
            
    function clearClip(){
      //console.log("Clearing clip");
      if (swipediv != null) {
        swipediv.style.clip = dojo.isIE ? "rect(auto auto auto auto)" : "";
      }
    }
            
    function swipe(val){
      if (swipediv != null) {
        offset_left = parseFloat(swipediv.style.left);
        offset_top = parseFloat(swipediv.style.top);
                    
        //console.log("Val: " + val);
                    
        var rightval, leftval, topval, bottomval;
                    
        if (offset_left > 0) {
          rightval = parseFloat(val) - Math.abs(offset_left);
          leftval = -(offset_left);
        }
        else 
        if (offset_left < 0) {
          leftval = 0;
          rightval = parseFloat(val) + Math.abs(offset_left);
        }
        else {
          leftval = 0;
          rightval = parseFloat(val);
        }
        if (offset_top > 0) {
          topval = -(offset_top);
          bottomval = map.height - offset_top;
		}
        else 
        if (offset_top < 0) {
          topval = 0;
          bottomval = map.height + Math.abs(offset_top);
        }
        else {
          topval = 0;
          bottomval = map.height;
        }
                    
        // If CSS Transformation is applied to the layer (i.e. swipediv), 
        // record the amount of translation and adjust clip rect
        // accordingly
        var tx = 0, ty = 0; 
        if (map.navigationMode === "css-transforms") {
          var prefix = "";
          if (dojo.isWebKit) {
            prefix = "-webkit-";
          }
          if (dojo.isFF) {
            prefix = "-moz-";
          }
          if (dojo.isIE) {
            prefix = "-ms-";
          }
          if (dojo.isOpera) {
            prefix = "-o-";
          }
                      
          var transformValue = swipediv.style.getPropertyValue(prefix + "transform");
                      
          if(transformValue) {
			if(transformValue.toLowerCase().indexOf("translate3d") !== -1) {
			  transformValue = transformValue.replace("translate3d(", "").replace(")", "").replace(/px/ig, "").replace(/\s/i, "").split(",");				
			}
			else if(transformValue.toLowerCase().indexOf("translate") !== -1) {
			  transformValue = transformValue.replace("translate(", "").replace(")", "").replace(/px/ig, "").replace(/\s/i, "").split(",");
			} 
						
			//console.log(transformValue);
									
			try {
			  tx = parseFloat(transformValue[0]);
			  ty = parseFloat(transformValue[1]);
			} catch(e) {
			  alert("Error cannot continue");
			  console.error(e);
			}

            //console.log("transform = ", tx, ty);
            leftval -= tx;
            rightval -= tx;
            topval -= ty;
            bottomval -= ty;
          }
        }
                    
        //Syntax for clip "rect(top,right,bottom,left)"
        //var clipstring = "rect(0px " + val + "px " + map.height + "px " + " 0px)";          
        var clipstring = "rect(" + topval + "px " + rightval + "px " + bottomval + "px " + leftval + "px)";
        //console.log("New Clip string(T,R,B,L): " + clipstring);
        swipediv.style.clip = clipstring;
      }
	}
            
    //This is called when "Stop Swipe" button is clicked            
    function stopswipe(){
      map.showZoomSlider();
      //console.log("Swipe tool disabled!");
      swipeslider = null;
      //dojo.byId("layerlistdd").disabled = false;
      dojo.byId("sliderdiv").style.display = "none";
      if (swipeconnect) 
      dojo.disconnect(swipeconnect);
      if (panEndConnect) 
      dojo.disconnect(panEndConnect);
      if (panConnect)
      dojo.disconnect(panConnect);
      clearInterval(animtimer);
      clearInterval(flashtimer);
      if (swipediv != null) {
        swipediv.style.clip = dojo.isIE ? "rect(auto auto auto auto)" : "";
        swipediv = null;
      }                
    }