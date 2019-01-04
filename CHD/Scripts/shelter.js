$('#shelterTable').DataTable();

var resultJSON = "";
$.validate({
    lang: 'en'
});

jQuery('#ShelterEntryDate, #CurrentUnitEntryDate, #ShelterExitDate').datetimepicker({ timepicker: false, format: 'm/d/Y', maxDate: new Date() });

$(document).ready(function () {
    var pnext = 0;
    $("#p-add-more").click(function (e) {
        e.preventDefault();
        var addto = "#prow" + pnext;
        var addRemove = "#prow" + (pnext) + " .p-remove-btn";
        pnext = pnext + 1;
        var newIn = ' <div class="form-group row" id="prow' + pnext + '"style="display:flex;margin-bottom: 10px;"><label class="col-sm-5 col-form-label">CHILD:</label><div class="col-sm-5"><input type="text" name="CHILD[]" id="CHILD" data-validation-error-msg-container="#CHILDError" data-validation-error-msg="Enter CHILD" class="form-control" data-validation="requireded" /><span id="CHILDError"></span></div><div class="col-sm-2 p-remove-btn"></div></div>';
        var newInput = $(newIn);
        var removeBtn = '<a id="remove' + (pnext - 1) + '" class="btn btn-icons cbtn-sm btn-rounded btn-outline-danger p-remove-me"><i class="mdi mdi-delete"></i></a>';
        var removeButton = $(removeBtn);
        $(addto).after(newInput);
        $(addRemove).append(removeButton);
        $("#pfield" + pnext).attr('data-source', $(addto).attr('data-source'));
        $("#count").val(pnext);

        $('.p-remove-me').click(function (e) {
            e.preventDefault();
            var pfieldNum = this.id.charAt(this.id.length - 1);
            var pfieldID = "#prow" + pfieldNum;
            $(this).remove();
            $(pfieldID).remove();
        });
    });
});


function GetAddress(location) {
    $.ajax({
        url: '../Shelter/GetAddress',
        type: 'POST',
        datatype: 'application/json',
        contentType: 'application/json',
        data: JSON.stringify({ Location: location }),
        success: function (result) {
            $("#Address").html("");
            $("#Address").append($('<option></option>').val(null).html("---Select Address---"));
            $.each($.parseJSON(result), function (i, location)
            { $("#Address").append($('<option></option>').val(location).html(location)) })

        },
        error: function () { alert("Whooaaa! Something went wrong..") },
    });

}

function GetUnit(address) {
    var location = $("#Location").val();
    $.ajax({
        url: '../Shelter/GetUnit',
        type: 'POST',
        datatype: 'application/json',
        contentType: 'application/json',
        data: JSON.stringify({ Location: location, Address: address }),
        success: function (result) {
            $("#UNIT").html("");
            $("#UNIT").append($('<option></option>').val(null).html("---Select Unit---"));
            $.each($.parseJSON(result), function (i, location)
            { $("#UNIT").append($('<option></option>').val(location).html(location)) })
        },
        error: function () { alert("Whooaaa! Something went wrong..") },
    });

}
