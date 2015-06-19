var l3viAPI = "http://api.l3vi.de/";
var weatherAPI = "http://api.openweathermap.org/data/2.5/weather?";
var timezoneAPI = "https://maps.googleapis.com/maps/api/timezone/json";

var offset = 0;
var intervals = {};

var timezone, place, address;

function toFixed(n) {
        return n<10?"0"+n:n;    
}

function refreshTime() {
        var offset = +$("#time").data("offset");
        var x = new Date(+new Date() + offset);
        setText("#time",toFixed(x.getUTCHours()) + ":" + toFixed(x.getMinutes()) + ":" + toFixed(x.getSeconds()));
        $(".card-time").css("display","block").css("opacity",1);
        setTimeout(refreshTime, 1000);
}

function getData() {
    var loc = $.ajax({
            dataType: "json",
            url: l3viAPI + "location.json",
            async: false
    }).responseJSON;
    setText("#address",loc["address"]);
    setText("#city",loc["town"]);
    $(".card-location").css("display","block").css("opacity",1);
    town = loc["town"];
    address = loc["address"]
    $("#link-map").attr('href',"https://www.google.com/maps?q=" + address);

/*      $.getJSON(l3viAPI + "status.json", function(data){
                setText("#status",data["status"]);
                var diff = parseInt((+new Date()/1000 - data["last_update"])/3600) +1;
                setText("#statustime",diff + " hours");
        }); */
        
    $.getJSON(l3viAPI + "mood.json", function(data){
        setText("#mood",data["mood"]);
        $(".card-mood").css("display","block").css("opacity",1);
    });
            
        $.getJSON(weatherAPI, {lat: loc.lat, lon: loc.lon},function(data){
                place=data["name"];
                //setText("#city",data["name"]);
                setText("#temp",Math.round(10*(data["main"]["temp"]-272.15))/10 + "°C");
                setText("#weather",data["weather"][0]["description"].replace("Sky is Clear","a clear sky"));
                $(".card-weather").css("display","block").css("opacity",1);
        });
        
        $.getJSON(timezoneAPI + "?location=" + loc.lat + "," + loc.lon + "&timestamp=" + +new Date()/1000, function(data){
                $("#time").data("offset",(data["rawOffset"] + data["dstOffset"]) * 1000);
                refreshTime();
        });
        
        $.getJSON(l3viAPI + "battery.json", function(data){
                setText("#battery", data["battery"] + "%");
                var timediff = +new Date() - parseInt(data["last_update"]*1000);
                if(timediff>12000000) {
                        setText("#batterytime", "out of date");
                        console.log(timediff);
                }
                else {
                        setText("#batterytime", "up to date");
                }
                $(".card-phone").css("display","block").css("opacity",1);
        });
        
        $.getJSON(l3viAPI + "calendar.json", function(data){
                var cal = (data["calendar"] != "") ? data["calendar"] : "unknown"
                setText("#calendar", data["calendar"]);
                $(".card-event").css("display","block").css("opacity",1);
        });
        
        setTimeout(getData, 120000)
}

function setText(where,what) {
        $(where).text(what);
}

$(function(){
    getData();
});
