var map, datasource, popup, newMarker = {};
var mapCenterPosition = [-123.250377, 49.266845];

//Define an HTML template for a custom popup content laypout.
var popupTemplate = '<div class="customInfobox"><div class="name">{name}</div>{description}</div>';

function GetMap() {
    //Add your Azure Maps subscription key to the map SDK. Get an Azure Maps key at https://azure.com/maps
    atlas.setSubscriptionKey('6kza7lBm44mzwhAgz_tFeiny_zViabvsN2fSmkiQmyo');

    //Initialize a map instance.
    map = new atlas.Map('myMap', {
        center: mapCenterPosition,
        zoom: 14
    });

    //Wait until the map resources have fully loaded.
    map.events.add('load', function (e) {

        //Create a data source and add it to the map.
        datasource = new atlas.source.DataSource(null, {
            cluster: false
        });
        map.sources.add(datasource);

        //var data = JSON.parse(require('data.json'));
        var data = [{
              "building" : "The Nest",
              "x" : "49.266845",
              "y" : "-123.250377",
              "description" : "1st floor, seating area beside honour roll <br> 2nd floow, near the piano <br> 4th floor, out the patio "
            },
              // {
              //   "building" : "The Nest",
              //   "x" : "49.266845",
              //   "y" : "-123.250377",
              //   "description" : ""
              // },
              // {
              //   "building" : "The Nest",
              //   "x" : "49.266845",
              //   "y" : "-123.250377",
              //   "description" : "2nd floow, near the piano"
              // },
              {
                "building" : "The Nest",
                "x" : "49.266845",
                "y" : "-123.250377",
                "description" : "4th floor, out the patio"
              },
              {
                "building" : "Sauder",
                "x" : "49.265039",
                "y" : "-123.253575",
                "description" : "1st floor in the cafe"
              },
              {
                "building" : "Totem Park Residence commons block",
                "x" : "49.257857",
                "y" : "-123.253120",
                "description" : "Walk up the stairs to the cafeteria, in the seating area beside the water machines"
              },
              {
                "building" : "ICICS Computer Science",
                "x" : "49.260865",
                "y" : "-123.248799",
                "description" : "In the cube (room 021)"
              },
              {
                "building" : "MacMillan LFS building",
                "x" : "49.261041",
                "y" : "-123.251187",
                "description" : "On ground floor in the seating are of the Agora Eat Cafe"
              },
              {
                "building" : "EOAS building",
                "x" : "49.263229",
                "y" : "-123.252139",
                "description" : "2nd floor in the student lounge"
              },
              {
                "building" : "Buchannan C",
                "x" : "49.268746",
                "y" : "-123.254282",
                "description" : "a few door down the IT helpdesk"
              },
              {
                "building" : "Law building (Peter A. Allard School of Law)",
                "x" : "49.270059",
                "y" : "-123.253329",
                "description" : "In the law cafe"
              },
              {
                "building" : "",
                "x" : "",
                "y" : "",
                "description" : ""
              }]

        for (var i = 0; i < data.length; i++) {
            //alert(myStringArray[i]);
            //Do something
            var point =  new atlas.data.Feature(new atlas.data.Point([data[i].y,data[i].x]), {
                name: data[i].building,
                description: data[i].description
            });

            datasource.add([point]);
        
        }


        // //Add the symbol to the data source.
        // datasource.add([point4]);

        //Add a layer for rendering point data as symbols.
        var symbolLayer = new atlas.layer.SymbolLayer(datasource);
        map.layers.add(symbolLayer);

        //Create a popup but leave it closed so we can update it and display it later.
        popup = new atlas.Popup({
            position: [0, 0],
            pixelOffset: [0, -18]
        });

        //Add a click event to the symbol layer.
        map.events.add('click', symbolLayer, symbolClicked);

    });
}

function symbolClicked(e) {
    //Make sure the event occured on a point feature.
    if (e.shapes && e.shapes.length > 0) {
        var content, coordinate;

        //Check to see if the first value in the shapes array is a Point Shape.
        if (e.shapes[0] instanceof atlas.Shape && e.shapes[0].getType() === 'Point') {
            var properties = e.shapes[0].getProperties();
            content = popupTemplate.replace(/{name}/g, properties.name).replace(/{description}/g, properties.description);
            coordinate = e.shapes[0].getCoordinates();
        } else if (e.shapes[0].type === 'Feature' && e.shapes[0].geometry.type === 'Point') {

            //Check to see if the feature is a cluster.
            if (e.shapes[0].properties.cluster) {
                content = '<div style="padding:10px;">Cluster of ' + e.shapes[0].properties.point_count + ' symbols</div>';
            } else {
                //Feature is likely from a VectorTileSource.
                content = popupTemplate.replace(/{name}/g, properties.name).replace(/{description}/g, properties.description);
            }
            
            coordinate = e.shapes[0].geometry.coordinates;
        }

        if (content && coordinate) {
            //Populate the popupTemplate with data from the clicked point feature.
            popup.setOptions({
                //Update the content of the popup.
                content: content,

                //Update the position of the popup with the symbols coordinate.
                position: coordinate
            });

            //Open the popup.
            popup.open(map);
        }
    }
}


function addMapMarker() {

    /*Create a data source and add it to the map*/
    var dataSource = new atlas.source.DataSource();
    map.sources.add(dataSource);
    var point = new atlas.Shape(new atlas.data.Point(mapCenterPosition),null,{
        subType: "Circle",
        radius: 50
        });
    
//Create a polygon layer to render the filled in area of the circle polygon, and add it to the map.*/
map.layers.add(new atlas.layer.PolygonLayer(dataSource, null, {
    fillColor: 'rgba(0, 200, 200, 0.95)'
   }));

    //Add the symbol to the data source.
    dataSource.add([point]);
    
    /* Gets co-ordinates of clicked location*/
    map.events.add('click', function(e){
        /* Update the position of the point feature to where the user clicked on the map. */
        point.setCoordinates(e.position);

        //add to our new Marker object
        newMarker.coordinates = e.position;

    });

   
    
    //Create a symbol layer using the data source and add it to the map
    map.layers.add(new atlas.layer.SymbolLayer(dataSource, null));
}




(function ($) {
    $( document ).ready(function() {


/************** ADD NEW ******************/
        var $addButton = $("#add-button"),
            $addModule = $("#add-modal").addClass('hidden'),
            $submit = $("#submit-new-marker");
        $addButton.on('click', function() {
           $addModule.removeClass('hidden');
           addMapMarker();
        });
        $addModule.find('.close').on('click', function() {
            $addModule.addClass('hidden');
        });

        $submit.on('click', function(){
            var build = newMarker.building = $('#building').value;
            var y = newMarker.coordinates[0];
            var x = newMarker.coordinates[1];

            var point =  new atlas.data.Feature(new atlas.data.Point([y,x]), {
                name: build,
                description: ""
            });

            var myEvent = { building: build, x: y, y: x, description:"", };
            $.ajax({
                url:'/utilities', type: "POST", contentType: 'application/json; charset=uft-8',
                data: $.toJSON(myEvent), dataType: 'text', success: function (result) {
                    alert(result.Result);
                }
            });

            datasource.add([point]);
            
        });
        
      });
})(jQuery);
