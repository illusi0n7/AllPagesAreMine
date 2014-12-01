var metaData = {};
var keys = [];
var length = 0;

$(document).ready(function() {
	chrome.storage.sync.get(function(metaData){
	var ul_id = document.getElementById("gallery");
	var input = "";

//	len = metaData.length;
	for (var key in metaData) {
		input += "<li class=\"span3\" id = \"" + length +"node" +"\">";
		input += "<div class=\"thumbnail\" id = \"" + key + "\">";
		input += "<a href =\"";
		input += key;
		input += "\" target=\"_blank\">";
		input += "<img src=\"img/basic.png\"></a>";
		input += "<div class=\"caption\">";
		input += "<h3 style=\"height:88px; overflow:hidden\" class=\"name\">"+metaData[key].title+"</h3>";
		input += "<p><a style=\"visibility:hidden\" href=\"#\" class=\"btn btn-primary\"><i class=\"icon-shopping-cart\"></i>공유</a>";
    	input += "<a href=\"#\" id = \"" +length+"\">";
    	input += "<span class=\"rating pull-right\"><i class=\"icon-remove\"></i></span>"+"</a>"; 
		input += "</p></div></div></li>";
		keys[length] = key;
		length = length + 1;
	}
	ul_id.innerHTML = input;

	var i = 0;
	for (var key in metaData){
		var id = '#'+i;
		console.log(id + " bind key " + key )
		keys.push(key);

		$(id).on('click', function(){
			$('#'+this.id+'node').fadeOut(parseInt( 300, 10));
			chrome.storage.sync.remove($('#'+this.id+'node').children(0).attr('id'))
		});
		i++;
	}
});
});