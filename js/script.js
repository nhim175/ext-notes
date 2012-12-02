var lib = new localStorageDB("library", localStorage);
if(lib.isNew()) {
	lib.createTable("notes",["id", "date", "notes"]);
	lib.insert("notes", {id: 1, date: "11/1/1990", notes: "Hello world!"} );
	lib.insert("notes", {id: 2, date: "11/1/1990", notes: "Notes Demo!"} );
	lib.commit();
	lib.createTable("counter", ["number"]);
	lib.insert("counter", {number: 2});
	lib.commit();
}
var id=10;
var date = "11/1/2011";
$("tr").on("click", function() {
	$(this).toggleClass("done");
});
$("tr").on("dblclick", function() {
	$(this).stop().fadeOut("slow", function() {
		$(this).remove();
	});
});
$("a[href='#']").on("click", function(e) {
	e.preventDefault();
});
$("#button-new").on("click", function() {
	$("#text-new").show("slow", function() {
		$(this).focus();
	});
});
$("#text-new").on("blur", function() {
	$(this).fadeOut("slow");
});
$("#text-new").keypress(function(e) {
	if(e.keyCode==13) {
		var date = new Date();
		var notes = $(this).val();
		$("#tbl-notes").append("<tr><td>"+(++id)+"</td><td>"+date.getDate()+"/"+(date.getMonth()+1)+"/"+(date.getYear()+1900)+"</td><td>"+notes+"</td></tr>");
		$(this).val("");
		$(this).hide();
	}
});
