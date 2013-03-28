var overButton = false;
var mouseDown = 0, mouseOverA = 0;

var mapExtents = [];

// [
//      //xmin,ymin,xmax,ymax
// 	 new esri.geometry.Extent(-8245941.023663707,4856419.421644134,-8245176.65338075,4856946.717706518, new esri.SpatialReference({ wkid:102100 })),
// 	 new esri.geometry.Extent(-8288521.179588634,4771025.15913448,-8282406.217325659,4775243.527633079, new esri.SpatialReference({ wkid:102100 })),
// 	 new esri.geometry.Extent(-8279334.404251365,4779509.669274361,-8276276.9231198765,4781618.853523661, new esri.SpatialReference({ wkid:102100 })),
// 	 new esri.geometry.Extent(-8242112.051567996,4879866.546757705,-8241347.681285039,4880393.842820088, new esri.SpatialReference({ wkid:102100 })),
// 	 new esri.geometry.Extent(-8301680.681755428,4762363.988156241,-8300151.941189854,4763418.580280774, new esri.SpatialReference({ wkid:102100 })),
// 	 new esri.geometry.Extent(-8367466.6878749095,4605663.302870606,-8365937.947309336,4606717.894995139, new esri.SpatialReference({ wkid:102100 })),
// 	 new esri.geometry.Extent(-8233583.996573069,4973812.728808983,-8232819.626290112,4974340.024871367, new esri.SpatialReference({ wkid:102100 })),
// 	 new esri.geometry.Extent(-8101197.452221993,5006940.417439494,-8100433.081939036,5007467.713501878, new esri.SpatialReference({ wkid:102100 })),
// 	 new esri.geometry.Extent(-8244225.966525398,4871158.819459764,-8242697.225959824,4872213.411584297, new esri.SpatialReference({ wkid:102100 })),
// 	 new esri.geometry.Extent(-8228899.14933946,4947022.978238763,-8228134.7790565025,4947550.274301147, new esri.SpatialReference({ wkid:102100 }))
// 	 ];

var extentTitles = [
	"Rockaway Beach, Queens, NY",
	"Breezy Point, Queens, NY",
	"Sheepshead Bay, Queens, NY",
	"Staten Island, NY",
	"South Beach, Staten Island, NY",
	"New Dorp Beach, Staten Island, NY",
	"Mantoloking, NJ",
	"Mantoloking, NJ",
	"Ocean Beach, NJ",
	"Lavallette, NJ",
	"Seaside Heights, NJ",
	"Atlantic City, NJ"
	];

var extentText = [
	"Despite its broad beach, this Rockaway neighborhood suffered major damage from the storm surge.",
	"Fire destroyed dozens of homes; damage from water and sand was also extensive.",
	"Debris from destroyed piers and boats litters the waterfront.",
	"A 168-foot water tanker was washed ashore after being ripped from its moorings about a mile away.",
	"This Staten Island community was among New York City's hardest hit, with major flooding, downed trees, and ruined cars.",
	"Beachfront houses were swept away by the storm.",
	"The barrier island was breeched on either side of the Herbert Street bridge, cutting the town in half.",
	"The storm swept across the barrier island, destroying many homes. Fire cause extensive damage as well.",
	"Many oceanfront homes were destroyed by Sandy's storm surge.",
	"The boardwalk was destroyed, and tons of sand was washed inland. Much of the town was flooded from the bay side.",
	"The seaward end of Casino Pier was destroyed, leaving a roller coaster in the water.",
	"The boardwalk along Absecon Channel was washed away, and coastal flooding caused major damage to structures."
	];

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
		var newExtent = new esri.geometry.Extent({"xmin":mapExtents[mapIndex].xmin, "ymin": mapExtents[mapIndex].ymin, "xmax": mapExtents[mapIndex].xmax, "ymax": mapExtents[mapIndex].ymax, "spatialReference": {"wkid": mapExtents[mapIndex].spatialReference.wkid}});
		map.setExtent(newExtent);
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
	var newExtent = new esri.geometry.Extent({"xmin":mapExtents[mapIndex].xmin, "ymin": mapExtents[mapIndex].ymin, "xmax": mapExtents[mapIndex].xmax, "ymax": mapExtents[mapIndex].ymax, "spatialReference": {"wkid": mapExtents[mapIndex].spatialReference.wkid}});
	map.setExtent(newExtent);
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
	var newExtent = new esri.geometry.Extent({"xmin":mapExtents[mapIndex].xmin, "ymin": mapExtents[mapIndex].ymin, "xmax": mapExtents[mapIndex].xmax, "ymax": mapExtents[mapIndex].ymax, "spatialReference": {"wkid": mapExtents[mapIndex].spatialReference.wkid}});
	map.setExtent(newExtent);
	$("#mapTitle").html(extentTitles[mapIndex]);
	$("#mapText").html(extentText[mapIndex]);
}