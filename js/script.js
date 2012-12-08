var lib = new localStorageDB("library", localStorage);
var itemPerPage = 10;	//Số item 1 trang
var curPage = 1; //Trang hiện tại
var totalItem;
var totalPage;
//Cập nhật trạng thái các button prev và next
function buttonStatus() {
	if (curPage==1&&totalPage>1) {
		$("li.prev").addClass("disabled");		
		$("li.next").removeClass("disabled");
	} else if (curPage==totalPage&&totalPage>1) {
		$("li.next").addClass("disabled");
		$("li.prev").removeClass("disabled");
	} else if (curPage==totalPage&&totalPage==1) {
		$("li.prev").addClass("disabled");
		$("li.next").addClass("disabled");
	} else {
		$("li.prev").removeClass("disabled");
		$("li.next").removeClass("disabled");
	}
}
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


//Hàm update table 
function showItems(page, itemPerPage) {
	totalItem = lib.query("notes").length;	//Tổng số item
	totalPage = Math.ceil(totalItem/itemPerPage); //Tổng số trang
	$("#tbl-notes").html("");	//Xóa nội dung bảng
	//Thêm heading row
	$("#tbl-notes").append("<tr class='heading'>\
								<th>#</th>\
								<th>Date</th>\
								<th>Notes</th>\
							</tr>");
	var arrNotes = lib.query("notes").reverse();	//Đảo thứ tự cho notes mới nhất lên đầu
	var notes = arrNotes.length;	//Đếm số notes	
	var start = (page-1)*itemPerPage;	//Số thứ tự của notes đầu tiên trong trang hiện tại
	var end;	//Số thứ tự notes cuối cùng 
	if((start+itemPerPage)>(totalItem-1)) {
		end = totalItem;
	} else {
		end = start+itemPerPage;
	}
	for(var i=start; i<end; i++) {
		var row = "<tr class='row-note";
		if(arrNotes[i].status==1) {
			row += " done";
		}
		row += "'>";
		row += "<td>"+arrNotes[i].id+"</td>";
		row += "<td>"+arrNotes[i].date+"</td>";
		row += "<td>"+arrNotes[i].notes+"</td>";
		row += "</tr>";
		$("#tbl-notes").append(row).hide().fadeIn("slow");
	}
	buttonStatus();
}
showItems(curPage, itemPerPage);

//2 nút phân trang 
$("li.next").on("click", function() {
	if($(this).hasClass("disabled")) {
		return false;
	}
	curPage++;
	showItems(curPage, itemPerPage);
});

$("li.prev").on("click", function() {
	if($(this).hasClass("disabled")) {
		return false;
	}
	curPage--;
	showItems(curPage, itemPerPage);
});

//Click để đánh dấu notes đã xong 
$("tr.row-note").live("click", function() {
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
//Double click để xóa notes 
$("tr.row-note").live("dblclick", function() {
	/*var r=confirm("Confirm Delete?");
	if(r==false) {
		return false;
	}*/
	
	var id = $(this).children("td")[0].innerHTML;
	lib.deleteRows("notes", {id: id});
	lib.commit();
	$(this).stop().fadeOut("slow", function() {
		$(this).remove();		
		showItems(curPage, itemPerPage);
	});
});

//Click vào a# thì ko làm j` cả
$("a[href='#']").on("click", function(e) {
	e.preventDefault();
});

//Ấn nút viết mới
$("#button-new").on("click", function() {
	$("#new-input").fadeIn("slow", function() {
		$("textarea").focus();
	});
});
$("#input-close-btn").on("click", function() {
    $("#new-input").fadeOut("slow");
})


//Khi ko focus vào input nữa thì ẩn nó đi
/*
$("#text-new").on("blur", function() {
	$(this).fadeOut("slow");
});
*/


//Enter để nhập
$("textarea").keypress(function(e) {
	if(e.keyCode==13) {
		var date = new Date();
		var notes = $(this).val();
		var fullDate = date.getDate()+"/"+(date.getMonth()+1)+"/"+(date.getYear()+1900);
		//$("#tbl-notes").append("<tr class='row-note'><td>"+(++id)+"</td><td>"+fullDate+"</td><td>"+notes+"</td></tr>");
		id++;
		lib.insert("notes", {id: id, date: fullDate, notes: notes, status: 0});
		lib.update("attributes", {key: "counter"}, function(row) {
			row.value = id;
			return row;
		});
		lib.commit();
		$(this).val("");
		$(this).parent().parent().fadeOut("slow", function() {            
            showItems(1, itemPerPage);
        });
	}
});
