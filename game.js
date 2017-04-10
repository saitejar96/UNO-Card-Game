$(document).ready(function(){

	get_game();

	setInterval(get_game, 3000);
	
	function get_game(){
		console.log("called");
	    $("#lt_card").html("");
	    $("#decklen").text("");
	    $("#r").html("");
		$.ajax
	    ({
	       type: "GET",
	       url: "http://localhost:5000/getgame",
	       dataType: "json",
	       async: false,
	       success: function (response){
	       		console.log(response);
	       		$("#decklen").text("Deck: "+response["decklength"]);
	       		$("#lt_card").html("<div class='card num-"+response["current_card"]["number"]+" "+response["current_card"]["color"]+"' ><span class='inner'><span class='mark'>"+response["current_card"]["number"]+"</span></span></div>");
	       		for(var i=0;i<response["players"].length;i++)
	       		{
	       			$("#r").append("<div style='padding:1px;background-color: #E91E63;'><h3 style='color:white;'>"+response["players"][i]["name"]+" : "+response["players"][i]["cards"].length.toString()+"</h3></div>");
	       		}
	       }
	   });
	}

});
