$(document).ready(function(){

	get_game();

	setInterval(get_game, 3000);
	
	function get_game(){
		console.log("called");
	    $("#lt_card").html("");
	    $("#decklen").text("");
	    $("#r").html("");
	    $("#lb1").html("");
	    $("#lb2").html("");
	    $("#lb3").html("");
		$.ajax
	    ({
	       type: "GET",
	       url: "http://localhost:5000/getgame",
	       dataType: "json",
	       async: false,
	       success: function (response){
	       		//console.log(response);
	       		$("#decklen").text("Deck: "+response["decklength"]);
	       		if(response["current_card"]["special"]=="No")
	       			$("#lt_card").html("<div class='card num-"+response["current_card"]["number"]+" "+response["current_card"]["color"]+"' ><span class='inner'><span class='mark'>"+response["current_card"]["number"]+"</span></span></div>");
	       		else if(response["current_card"]["number"]=="skip")
	       			$("#lt_card").html("<div class='card num-* "+response["current_card"]["color"]+"' ><span class='inner'><span class='mark'><span class='glyphicon glyphicon-ban-circle' style='font-size:75px;' aria-hidden='true'></span></span></span></div>");
	       		else if(response["current_card"]["number"]=="reverse")
	       			$("#lt_card").html("<div class='card num-* "+response["current_card"]["color"]+"' ><span class='inner'><span class='mark'><span class='glyphicon glyphicon-transfer' style='font-size:75px;' aria-hidden='true'></span></span></span></div>");
	       		else if(response["current_card"]["number"]=="+2")
	       			$("#lt_card").html("<div class='card num-* "+response["current_card"]["color"]+"' ><span class='inner'><span class='mark'><span style='font-size:60px;'>+2</span></span></span></div>");	       		
	       		else if(response["current_card"]["number"]=="+4")
	       			$("#lt_card").html("<div class='card num-* "+response["current_card"]["color"]+"' ><span class='inner'><span class='mark'><span style='font-size:60px;'>+4</span></span></span></div>");
	       		else if(response["current_card"]["number"]=="wild")
	       			$("#lt_card").html("<div class='card num-* "+response["current_card"]["color"]+"' ><span class='inner'><span class='mark'><span style='font-size:60px;'></span></span></span></div>");
	       		for(var i=0;i<response["players"].length;i++)
	       		{
	       			if(response["players"][i]["id"] != response["next_to_play"])
	       				$("#r").append("<div style='border-bottom:5px solid white;padding:1px;background-color: #E91E63;'><h3 style='color:white;'>"+response["players"][i]["name"]+" : "+response["players"][i]["cards"].length.toString()+"</h3></div>");
	       			else
	       				$("#r").append("<div style='border-bottom:5px solid white;padding:1px;background-color: #4527A0;'><h3 style='color:white;'>"+response["players"][i]["name"]+" : "+response["players"][i]["cards"].length.toString()+"</h3></div>");
	       		}
	       		if(response["winners"].length==1){
	       			$("#lb1").html("<h2 style='padding: 60px'>Winner: "+response["winners"][0]["name"]+"</h2>");
	       		}
	       		else if(response["winners"].length==2){
	       			$("#lb1").html("<h2 style='padding: 60px'>Winner: "+response["winners"][0]["name"]+"</h2>");
	       			$("#lb1").html("<h2 style='padding: 60px'>Runner Up: "+response["winners"][1]["name"]+"</h2>");
	       		}
	       		else if(response["winners"].length>=3){
	       			$("#lb1").html("<h2 style='padding: 60px'>Winner: "+response["winners"][0]["name"]+"</h2>");
	       			$("#lb2").html("<h2 style='padding: 60px'>RunnerUp: "+response["winners"][1]["name"]+"</h2>");
	       			$("#lb3").html("<h2 style='padding: 60px'>2nd RunnerUp: "+response["winners"][2]["name"]+"</h2>");
	       		}
	       }
	   });
	}

});
