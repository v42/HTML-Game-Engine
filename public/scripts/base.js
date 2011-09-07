$("a[rel*='external']").live("click",function(e) {
	e.preventDefault()
	window.open(this.href)
});

$("#magic-button").live("click", function(){
	window.location = "/";
});

function padNumber(num, length){
	return (num / Math.pow(10, length)).toFixed(length).substr(2)
}