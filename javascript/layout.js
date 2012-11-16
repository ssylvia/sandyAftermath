var overButton = false;
var mouseDown = 0, mouseOverA = 0;

var mapExtents = [
     //xmin,ymin,xmax,ymax
	 new esri.geometry.Extent(-8245941.023663707,4856419.421644134,-8245176.65338075,4856946.717706518, new esri.SpatialReference({ wkid:102100 })),
	 new esri.geometry.Extent(-8288521.179588634,4771025.15913448,-8282406.217325659,4775243.527633079, new esri.SpatialReference({ wkid:102100 })),
	 new esri.geometry.Extent(-8279334.404251365,4779509.669274361,-8276276.9231198765,4781618.853523661, new esri.SpatialReference({ wkid:102100 })),
	 new esri.geometry.Extent(-8242112.051567996,4879866.546757705,-8241347.681285039,4880393.842820088, new esri.SpatialReference({ wkid:102100 })),
	 new esri.geometry.Extent(-8301680.681755428,4762363.988156241,-8300151.941189854,4763418.580280774, new esri.SpatialReference({ wkid:102100 })),
	 new esri.geometry.Extent(-8367466.6878749095,4605663.302870606,-8365937.947309336,4606717.894995139, new esri.SpatialReference({ wkid:102100 })),
	 new esri.geometry.Extent(-8233583.996573069,4973812.728808983,-8232819.626290112,4974340.024871367, new esri.SpatialReference({ wkid:102100 })),
	 new esri.geometry.Extent(-8101197.452221993,5006940.417439494,-8100433.081939036,5007467.713501878, new esri.SpatialReference({ wkid:102100 })),
	 new esri.geometry.Extent(-8244225.966525398,4871158.819459764,-8242697.225959824,4872213.411584297, new esri.SpatialReference({ wkid:102100 })),
	 new esri.geometry.Extent(-8228899.14933946,4947022.978238763,-8228134.7790565025,4947550.274301147, new esri.SpatialReference({ wkid:102100 }))];

var extentTitles = [
	"Seaside, NJ",
	"Atlantic City, NJ",
	"Brigantine, NJ",
	"Point Pleasant Beach, NJ",
	"Ocean City, NJ",
	"Assateague, MD",
	"Queens, NY",
	"Beachway on Long Island",
	"Mantoloking, NJ",
	"Breezy Point Fire location, NY"
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
	"One of the fastest-growing counties in the U.S., northern Virginia’s Loudoun County increased in population by 84% between 2000 and 2010. In this area near Dulles Airport, rural fields (pink and green) and woodlots (dark green) visible in 1990 have been largely replaced by subdivisions and light industry.<br /><br /><p style='font-family:Arial, Helvetica, sans-serif; font-size:10px'><strong>Sources:</strong> Left, Esri's <a style='color:#333; text-decoration:underline; font-weight:normal;' onMouseOver='overA()' onMouseOut='outA()' href='http://www.arcgis.com/home/item.html?id=10df2279f9684e4a9f6a7f08febac2a9' target='_blank'>World Imagery</a> basemap; Right, <a style='color:#333; text-decoration:underline; font-weight:normal;' onMouseOver='overA()' onMouseOut='outA()' href='http://www.arcgis.com/home/item.html?id=1edfe16c7aff4f5b9bf10c88a97ec30b' target='_blank'>1990 Landsat imagery</a>.</p>"];

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