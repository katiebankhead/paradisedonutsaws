// requires API_ENDPOINT_URL_STR in window scope

var
	$breed_select = $("[data-role='breed_select']");
	$filter_type = $("[data-role='filter_type']"),
	$cat_info = $("[data-role='cat_info']");

function g_ajaxer(url_str, params, ok_cb, fail_cb){
	$.ajax({
		url: url_str,
		type: "POST",
		data: JSON.stringify(params),
		crossDomain: true,
		contentType: "application/json",
		dataType: "json",
		success: ok_cb,
		error: fail_cb,
		timeout: 3000
	});
}
function clearFilter(){
	$breed_select.val("All");
	$cat_info.html("");
	$cat_info
		.attr("data-showing", "not_showing")
	// $filter_type.text("Showing all donuts");
	//do new search
	postRequest("all");
}
function handleFailure(fe){
	console.log("FAIL", fe.status);
	if(fe.status === 405){
		$filter_type.text("No API to call");
	}else{
		$filter_type.text("Failed due to CORS");
	}
}
function handleSuccess(data_arr){
	var 
		filter_str = $breed_select.val();
	if(data_arr.length === 0){
		$filter_type.text("No " + filter_str.toLowerCase() + " donuts found");
		$cat_info
			.attr("data-showing", "not_showing")
	}
	showCats(data_arr);
}
function postRequest(breed_str){
	showSearching();
	var params = {
		breed_str: breed_str
	};
	g_ajaxer(window.API_ENDPOINT_URL_STR, params, handleSuccess, handleFailure);
}
function showCats(data_arr){
	var 
		html_str = '',
		donutName = "",
		newName = "",
		imgPath = "";
	
		for(var i_int = 0; i_int < data_arr.length; i_int += 1){
		donutName  = data_arr[i_int].name.S;
		imgPath = data_arr[i_int].key.S;
		newName = data_arr[i_int].new_name.S;

		html_str += '<article>';
		html_str += 	'<h4>' + newName + '</h4>';
		html_str += 	'<figure>';
		html_str += 		'<img alt="this is a picture of ' +  newName + ' " src="img/krispykremedonuts/' + donutName + 'aspx.jpg" width="300" height="300" />'; 
		html_str += 	'</figure>';
		html_str += '</article>';

	}
	// $filter_type.text("Showing " + filter_str.toLowerCase() + " cats");
	$cat_info
		.attr("data-showing", "showing")
		.append(html_str);
	// if(data_arr.length === 0){
	// 	$cat_info.html('<h6>No donuts found!</h6>');
	// }

}
function showSearching(){
	var 
		filter_str = $breed_select.val();
	// $filter_type.text("Searching database for " + filter_str.toLowerCase() + " donuts...");
	$cat_info.attr("data-showing", "not_showing").html("");
}
function submitBreed(se){
	se.preventDefault();
	//validate todo
	postRequest($breed_select.val());
}

// handlers
$(document).on("change", "[data-action='choose_breed']", submitBreed);


//onm load
postRequest("All");