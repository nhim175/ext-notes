
var lib = new localStorageDB("library", localStorage);
//Create database
if(lib.isNew()) {
	lib.createTable("notes",["id", "date", "notes", "status"]);
	lib.insert("notes", {id: 1, date: "11/1/1990", notes: "Hello world!", status: 1} );
	lib.insert("notes", {id: 2, date: "11/1/1990", notes: "Notes Demo!", status: 0} );
	lib.commit();
	lib.createTable("attributes", ["key", "value"]);
	lib.insert("attributes", {key: "counter", value: 2});
	lib.commit();
}
var id=lib.query("attributes", {key: "counter"})[0].value;
//Init table

var arrNotes = lib.query("notes");
var notes = arrNotes.length;

for(var i=0; i<notes; i++) {
	var row = "<tr class='row-note";
	if(arrNotes[i].status==1) {
		row += " done";
	}
	row += "'>";
	row += "<td>"+arrNotes[i].id+"</td>";
	row += "<td>"+arrNotes[i].date+"</td>";
	row += "<td>"+arrNotes[i].notes+"</td>";
	row += "</tr>";
	$("#tbl-notes").append(row);
}



$("tr.row-note").on("click", function() {
	$(this).toggleClass("done");
	var id = $(this).children("td")[0].innerHTML;
	lib.update("notes", {id: id}, function(row) {
		if(row.status!=1) {
			row.status = 1;
		} else {
			row.status = 0;
		}
		return row;
	});
	lib.commit();
});

$("tr.row-note").on("dblclick", function() {
	$(this).stop().fadeOut("slow", function() {
		$(this).remove();
	});
	var id = $(this).children("td")[0].innerHTML;
	lib.deleteRows("notes", {id: id});
	lib.commit();
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
		var fullDate = date.getDate()+"/"+(date.getMonth()+1)+"/"+(date.getYear()+1900);
		$("#tbl-notes").append("<tr class='row-note'><td>"+(++id)+"</td><td>"+fullDate+"</td><td>"+notes+"</td></tr>");
		lib.insert("notes", {id: id, date: fullDate, notes: notes, status: 0});
		lib.update("attributes", {key: "counter"}, function(row) {
			row.value = id;
			return row;
		});
		lib.commit();
		$(this).val("");
		$(this).hide();
	}
});
