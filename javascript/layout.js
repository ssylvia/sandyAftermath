var overButton = false;
var mouseDown = 0, mouseOverA = 0;

var mapExtents = [
	new esri.geometry.Extent(6215448.627786052,5372806.419964143,6998163.797426219,5855276.942500153, new esri.SpatialReference({ wkid:102100 })), 
	new esri.geometry.Extent(4107771.1245415304,-372672.42632336804,4205610.520746425,-312363.6110064453, new esri.SpatialReference({ wkid:102100 })),
	 new esri.geometry.Extent(-16467714.02011686,8596563.575002903,-16272035.227706732,8717181.205636958, new esri.SpatialReference({ wkid:102100 })), 
	 new esri.geometry.Extent(-9739387.336995596,1450626.1865470726,-9690467.638893148,1480780.594205534, new esri.SpatialReference({ wkid:102100 })), 
	 new esri.geometry.Extent(12617273.64987246,406090.8799947877,12641733.498923682,421168.0838240184, new esri.SpatialReference({ wkid:102100 })), 
	 new esri.geometry.Extent(-7154531.207096819,-2074239.9741702052,-6763173.622276904,-1833004.7129023047, new esri.SpatialReference({ wkid:102100 })), 
	 new esri.geometry.Extent(14473807.224474363,3870252.068861484,14498267.073525585,3885329.272690715, new esri.SpatialReference({ wkid:102100 })), 
	 new esri.geometry.Extent(-12524848.085687213,7726586.100995238,-12329169.293277085,7847203.7316292925, new esri.SpatialReference({ wkid:102100 })), 
	 new esri.geometry.Extent(-9081373.933097947,4572973.322950388,-9056914.084046725,4588050.526779619, new esri.SpatialReference({ wkid:102100 })), 
	 new esri.geometry.Extent(12652271.879276711,2629625.351356609,12676731.728327934,2644702.5551858395, new esri.SpatialReference({ wkid:102100 })), 
	 new esri.geometry.Extent(-12954937.258830944,3994310.2546197944,-12942707.334305333,4001848.85653441, new esri.SpatialReference({ wkid:102100 })), 
	 new esri.geometry.Extent(-8632312.505170723,4723087.762920504,-8620082.580645112,4730626.364835119, new esri.SpatialReference({ wkid:102100 }))];

var extentTitles = [
	"Aral Sea, Uzbekistan and Kazakhstan", 
	"Mount Kilimanjaro, Tanzania", 
	"Columbia Glacier, Alaska, United States", 
	"Gulf of Fonseca, Honduras", 
	"Coastal Malaysia", 
	"Santa Cruz, Bolivia", 
	"Isahaya Bay, Japan", 
	"Athabaska oil sands, Alberta, Canada", 
	"Mountaintop Removal, West Virginia, United States",
	"Dongguan, China", 
	"Palm Springs, California, United States", 
	"Loudoun County, Virginia, United States"
	];

var extentText = [
	"A 1990 Landsat satellite image (left) contrasts with a recent view of this briny, Central Asia lake. Diversion of rivers for cotton irrigation has shrunk its extent by three quarters in the last fifty years. Color variations are due to differences in detection equipment and processing techniques.",
	"Despite its tropical location, the upper slopes of this 19,340-foot volcano have been draped in glaciers for 12,000 years. Yet scientists predict that these ice fields will likely disappear within the next decade and a half, victims of a warming climate. The 1990 image at left shows a greater extent of snow and ice than the more current view at right.",
	"The mouth of this glacier near Prince William Sound has retreated by more than six miles from its 1990 location (purple symbol) to today (red). In both images, floating ice is visible below the glacier. Although a variety of factors can affect glacial dynamics, a warming climate has hastened the retreat of glaciers worldwide.",
	"Estuaries and wetlands in many parts of the world are being heavily altered for aquaculture. In southwestern Honduras, large areas of mangrove swamps have been converted to shrimp farms. The farms can have economic benefits, but at the cost of natural habitat that is important to healthy coastal and marine ecosystems—and to the people who depend on them for a living.",
	"Large tracts of land in Malaysia, Indonesia, and other tropical countries have been converted to oil palm plantations like the one visible in the more recent image at right. Palm oil is used in a variety of food products, and has been touted as a biofuel. Increased demand for palm oil has led to destruction of large tracts of rain forest, and has raised concerns about pollution from fertilizers and waste from palm mills.",
	"Prior to 1975, the forests east of central Bolivia’s Grande (Guapay) River were virtually untouched. By 1990 (left image) roads had been built and settlement had begun. Recent imagery shows that large tracts of forest have been converted to pastures and cropland.",
	"An effort to reclaim tidal flats in this area of Japan’s southern island of Kyushu began a year prior to the 1990 image at left. Although a substantial portion of the area behind the seawall (visible as a diagonal gray line) has been fully converted to agriculture, Japanese citizens groups continue to protest the destruction of wetlands and other ecological damage caused by the project.",
	"Canada’s oil reserves are second only to Saudi Arabia’s. Most of these reserves are in the vast oil sands deposits of Alberta. Extracting the heavy oil, which is mixed with sand, minerals, and water, is expensive both economically and environmentally. As oil prices have increased, extraction has become more economically viable, a trend that is evident in these images.",
	"America’s ever-increasing demand for energy is met in large part by coal, much of which is extracted from the remote mountains of West Virginia. Mountaintop removal involves stripping forests and overburden from mountaintops to remove the coal. Even after restoration, landscapes are significantly altered.",
	"Like its neighboring cities of Guangzhou and Shenzhen, Dongguan has grown explosively as rural Chinese have moved to urban centers seeking employment in factories. In 2008, migrants from other parts of China outnumbered Dongguan’s local residents five to two. The images reflect that change; note in the more recent image the new circumferential highway and areas of bare ground at construction sites.",
	"The desert sunshine of Palm Springs has long been a draw for tourists and retirees. Suburbs and retirement communities continue to expand southeastward toward the Coachella Valley; the city now boasts more than 125 golf courses.",
	"One of the fastest-growing counties in the U.S., northern Virginia’s Loudoun County increased in population by 84% between 2000 and 2010. In this area near Dulles Airport, rural fields (pink and green) and woodlots (dark green) visible in 1990 have been largely replaced by subdivisions and light industry.<br /><br /><p style='font-family:Arial, Helvetica, sans-serif; font-size:10px'><strong>Sources:</strong> Left, <a style='color:#333; text-decoration:underline; font-weight:normal;' onMouseOver='overA()' onMouseOut='outA()' href='http://www.arcgis.com/home/item.html?id=1edfe16c7aff4f5b9bf10c88a97ec30b' target='_blank'>1990 Landsat imagery</a>; Right, Esri's <a style='color:#333; text-decoration:underline; font-weight:normal;' onMouseOver='overA()' onMouseOut='outA()' href='http://www.arcgis.com/home/item.html?id=10df2279f9684e4a9f6a7f08febac2a9' target='_blank'>World Imagery</a> basemap</p>"];

var mapIndex = 0;


function overA(){
	mouseOverA = 1;
}

function outA(){
	mouseOverA = 0;
}

//Jquery Layout
$(window).resize(function(e) {
    $("#sliderdiv").css('height','100%');
});

$(document).ready(function(e) {
	$("#mapTitle").html(extentTitles[0]);
	$("#mapText").html(extentText[0]);
	$(document).mousedown(function(e) {
        mouseDown = 1;
    });
	$('#sliderdiv').mousedown(function(e) {
       mouseDown = 1;
    });
	$(document,"#sliderdiv").mouseup(function(e) {
        mouseDown = 0;
    });
	$("#map").mousemove(function(e) {
		if (iPad == false){
			if (mouseDown == 0 && mouseOverA == 0){
				if (e.pageX < 200){
					$("#prevImg").show();
				}
				else if (e.pageX > (($(document).width())-200) && mouseOverA == 0){
					$("#nextImg").show();
				}
				else{
					$("#prevImg").hide();
					$("#nextImg").hide();
				}
			}
		}
    });
	$("#map").mouseout(function(e) {
        $("#prevImg").hide();
       	$("#nextImg").hide();
    });
});

function setUpLocations(){
	for (i=0;i<mapExtents.length;i++){
		$("#links").append("<div id='nav"+(i)+"' class='links'><p class='navText'>"+(i+1)+"</p></div>");
	}
	$("#nav0").addClass('selected');
	$(".links").click(function(e) {
        $(".links").removeClass('selected');
		$(this).addClass('selected');
		mapIndex = $(this).attr('id').slice(3);
		map.setExtent(mapExtents[mapIndex]);
		$("#mapTitle").html(extentTitles[mapIndex]);
		$("#mapText").html(extentText[mapIndex]);
    });
}

function nextExtent(){
	++mapIndex;
	if (mapIndex == mapExtents.length){
		mapIndex = 0;
	}
	$(".links").removeClass('selected');
	$("#nav"+mapIndex).addClass('selected');
	map.setExtent(mapExtents[mapIndex]);
	$("#mapTitle").html(extentTitles[mapIndex]);
	$("#mapText").html(extentText[mapIndex]);
}

function prevExtent(){
	--mapIndex;
	if (mapIndex == -1){
		mapIndex = (mapExtents.length - 1);
	}
	$(".links").removeClass('selected');
	$("#nav"+mapIndex).addClass('selected');
	map.setExtent(mapExtents[mapIndex]);
	$("#mapTitle").html(extentTitles[mapIndex]);
	$("#mapText").html(extentText[mapIndex]);
}