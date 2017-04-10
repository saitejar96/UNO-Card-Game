$(document).ready(function(){
	
	var host="localhost";
	var port="5000";

	$("#login").submit(function(){

		var inicards = parseInt($("#inicards").val());
		var str_array = $("#numplayers").val().split(',');
		var players = [];
		for(var i = 1; i <= parseInt(str_array[0]); i++)
		{
			alert(str_array[i]);
			var temp ={"name":str_array[i]};
			players.push(temp);
		}
		var data = {"inicards":inicards,"players":players};
		$.ajax
	    ({
	       type: "POST",
	       url: "http://localhost:5000/creategame",
	       dataType: "json",
	       contentType:'application/json',
	       async: false,
           data: JSON.stringify(data),
	       success: function (response){
	       		alert(response["task"]);
	       		window.open("game.html","mywindow");
	       }
	   });
	    // $.post("http://saitejar96.pythonanywhere.com/creategame",data,
     //    function(data,status){
     //        alert("Data: " + data + "\nStatus: " + status);
     //    });

	});

});