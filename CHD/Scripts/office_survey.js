﻿var resultJSON = "";
$.validate({
    lang: 'en'
});

jQuery('#DateTimeofReview').datetimepicker({ maxDate: new Date(), ampm: true, step: 30, formatTime: 'g:i a', format: 'm/d/Y H:i' });

$('#TypeOfDrill').multiSelect({
    noneText: 'Select Drill Type'
});

$(".DynamicAddress").html('');
$(".DynamicData").html('');
function GetLocations(program) {
    $.ajax({
        url: '../ResidentialDrill/GetLocations',
        type: 'POST',
        datatype: 'application/json',
        contentType: 'application/json',
        data: JSON.stringify({ ProgramName: program, drillType: 'Non-Residential' }),
        success: function (result) {
            $(".DynamicData").html('');
            $(".DynamicAddress").html('');
            $("#Location").html("");
            $("#Location").append($('<option></option>').val(null).html("---Select Residence/Team---"));
            $.each($.parseJSON(result), function (i, location)
            { $("#Location").append($('<option></option>').val(location).html(location)) })

        },
        error: function () { alert("Whooaaa! Something went wrong..") },
    });

}
function buildHTML(resultJSON) {
    var html = "";
    html = html + '<div class="col-md-12 dynamicDataVariales"><div class="form-group row"><label class="col-sm-7 col-form-label">' + resultJSON[1]['Key'] + ':</label><label class="col-sm-5"><input type="hidden" value="' + resultJSON[1]['Value'] + '" />' + resultJSON[1]['Value'] + '</label></div></div>';
    html = html + '<div class="col-md-12 dynamicDataVariales"><div class="form-group row"><label class="col-sm-7 col-form-label">' + resultJSON[2]['Key'] + ':</label><label class="col-sm-5"><input type="hidden" value="' + resultJSON[2]['Value'] + '" />' + resultJSON[2]['Value'] + '</label></div></div>';
    html = html + '<div class="col-md-12 dynamicDataVariales"><div class="form-group row"><label class="col-sm-7 col-form-label">' + resultJSON[0]['Key'] + ':</label><label class="col-sm-5"><input type="hidden" value="' + resultJSON[0]['Value'] + '" />' + resultJSON[0]['Value'] + '</label></div></div>';
    return html;
}
function GetAddress(location) {
    var program = $("#NameofProgram").val();
    $.ajax({
        url: '../ResidentialDrill/GetAddress',
        type: 'POST',
        datatype: 'application/json',
        contentType: 'application/json',
        data: JSON.stringify({ Location: location, ProgramName: program }),
        success: function (result) {
            $(".DynamicAddress").html('');
            $(".DynamicData").html('');
            $(".dynamicDataVariales").remove('');
            var count = 0; var address = [];
            $.each($.parseJSON(result), function (Key, Value) {
                if (Value['Key'] == "Address") {
                    address.push(Value['Value']);
                    count++;
                }
            });

            if (count < 2) {
                resultJSON = $.parseJSON(result);
                var html = buildHTML(resultJSON);
                var html = html + '<input type="hidden" name="ProgramAddress" class="form-control dynamicDataVariales" id="ProgramAddress" value="' + resultJSON[1]['Value'] + '">';
                $(".DynamicAddress").after(html);
                //$(".DynamicData").html('<p><label><span style="font-weight:500;">' + resultJSON[0]['Key'] + ': </span> ' + resultJSON[0]['Value'] + '</label> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <label><span style="font-weight:500;">' + resultJSON[1]['Key'] + ': </span> ' + resultJSON[1]['Value'] + '</label></p><p><label><span style="font-weight:500;">' + resultJSON[2]['Key'] + ': </span> ' + resultJSON[2]['Value'] + '</label> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<label><span style="font-weight:500;">' + resultJSON[3]['Key'] + ': </span> ' + resultJSON[3]['Value'] + '</label> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<label><span style="font-weight:500;">' + resultJSON[4]['Key'] + ': </span> ' + resultJSON[4]['Value'] + '</label></p>');
            } else {

                var select = $('<select name="ProgramAddress" class="form-control" id="ProgramAddress" data-validation-error-msg-container="#AddressError" data-validation-error-msg="Please select address" data-validation="required" onchange="GetFullDetails(this.value);"></select>');
                var option = $('<option></option>');
                option.attr('value', '');
                option.text("--Please select address--");
                select.append(option);
                $.each(address, function (index, value) {
                    var option = $('<option></option>');
                    option.attr('value', value);
                    option.text(value);
                    select.append(option);
                });
                var addressList = '<div class="form-group row"><label class="col-sm-7 col-form-label">Address:</label><div class="col-sm-5 DynamicSelect"></div></div>';

                $(".DynamicAddress").html(addressList);
                $('.DynamicSelect').append(select);
                $('.DynamicSelect').append("<span id='AddressError'></span>");
                $.validate({
                    lang: 'en'
                });
            }
        },
        error: function () { alert("Whooaaa! Something went wrong..") },
    });

}

function GetFullDetails(address) {
    var program = $("#NameofProgram").val();
    address = $("#Location").val();
    var location = $("#ProgramAddress").val();
    $.ajax({
        url: '../ResidentialDrill/GetFullDetails',
        type: 'POST',
        datatype: 'application/json',
        contentType: 'application/json',
        data: JSON.stringify({ ProgramAddress: location, ProgramName: program, Address: address }),
        success: function (result) {
            $(".DynamicData").html('');
            resultJSON = $.parseJSON(result);
            $(".DynamicData").html('<p><label><span style="font-weight:500;">' + resultJSON[0]['Key'] + ': </span> ' + resultJSON[0]['Value'] + '</label> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <label><span style="font-weight:500;">' + resultJSON[1]['Key'] + ': </span> ' + resultJSON[1]['Value'] + '</label></p><p><label><span style="font-weight:500;">' + resultJSON[2]['Key'] + ': </span> ' + resultJSON[2]['Value'] + '</label> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<label><span style="font-weight:500;">' + resultJSON[3]['Key'] + ': </span> ' + resultJSON[3]['Value'] + '</label> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<label><span style="font-weight:500;">' + resultJSON[4]['Key'] + ': </span> ' + resultJSON[4]['Value'] + '</label></p>');

        },
        error: function () { alert("Whooaaa! Something went wrong..") },
    });

}

/*Default properties*/
$("button").prop('disabled', true);
$("#BasicDetailsNext").prop('disabled', false);
var finalObj = {};
/*Default properties*/


/*Previous button logic*/
function goPreviousForm(previousSection, nextButton, previousButton) {
    $("button").prop('disabled', true);
    $(".SurveySection").hide();
    var previousSectionArray = previousSection.split(',');
    jQuery.each(previousSectionArray, function (i, val) {
        $("#" + val).show();
        if (val == "Bathroom1") {
            $("#BathButtonSection").show();
        }
        if (val == "OfficesRoom1") {
            $("#OfficeButtonSection").show();
        }
        if (val == "ExamRoom1") {
            $("#ExamButtonSection").show();
        }
    });
    $("#" + previousSection).show();
    $("#" + nextButton + ", #" + previousButton).prop('disabled', false);
    moveToTop();
    breadcrumb();
}
/*Previous button logic*/

function getFileDetails() {
    var names = "";
    $(':file').each(function () {
        if (this.files && this.files[0]) {
            names += this.files[0].name + ", ";
        }
    });
    console.log(names);
    return names;
}
/*Common logic for QJSON*/
function createQJSON(form) {
    var qJSON = [];
    $(form).find(".row").each(function () {
        var label = $(this).find('label').html(); // This is the jquery object of the input, do what you will
        if (typeof label == "undefined")
            label = "";
        if ($(this).find("select").length > 0) {
            var input = $(this).find("select option:selected").text();
        } else if ($(this).find("input").attr("type") == "radio") {
            var input = $(this).find("input[type='radio']:checked").val();
        } else if ($(this).find("input[type=file]").val() != "" && $("#MediaUpload").is(":visible")) {
            var filesnames = getFileDetails();
            input = filesnames.replace(/(^,)|(,$)/g, "");
        } else {
            var input = $(this).find("input[type='text'],input[type='hidden']").val();
            if ($(this).find("input[type='text']").attr("placeholder") == "Work Order Date/Comments")
                label = "Work Order Date/Comments";
        }
        if (typeof input == "undefined")
            input = "";
        qJSON.push({
            label: label,
            input: input
        });
    });
    return qJSON;
}

$("#SAFETYForm, #HumanRightsForm, #ExteriorDeckPorchWODCForm, #BasementForm, #ExamRoomForm, #Exam_RoomsForm, #BasicDetailsForm, #ToxicSubstancesForm, #KitchensANDDiningForm, #WaitingRoomForm, #CommonLivingSpacesForm, #WaitingRoomForm, #Bath_roomsForm, #Bathroom1Form, #Offices_RoomsForm, #OfficesRoomForm").submit(function () {
    var finalObjName = $(this).find('h4').html();
    finalObjName = finalObjName.replace(" ", "_")
    finalObj[finalObjName] = createQJSON(this)
    console.log(finalObj);
    var id = $(this).attr("data-id") ;
    $("button").prop('disabled', true);
    $(".SurveySection").hide();
    if ($(this).attr("id") == "Bath_roomsForm") {
        createDynamicEle("Bathroom", "Bath_rooms", "BathButtonSection");

    }
    else if ($(this).attr("id") == "Offices_RoomsForm") {
        createDynamicEle("OfficesRoom", "Offices_Rooms", "OfficeButtonSection");
    }
    else if ($(this).attr("id") == "Exam_RoomsForm") {
        createDynamicEle("ExamRoom", "Exam_Rooms", "ExamButtonSection");
    }
    $("#" + id).show();
    $("#" + id + "Next, #" + id + "Previous").prop('disabled', false);
    moveToTop();
    breadcrumb();
    return false;
});

function getFileName(inputFileName) {
    var qJSON = [];
    $("input[type=file]").each(function () {
        var filename = $(this).val();
        if (filename != "") {
            filename = filename.split('\\').pop();
            qJSON.push({
                label: $(this).attr("name"),
                input: filename
            });
        }
    })
    return qJSON;
}
$("#MediaUploadForm").submit(function () {
    if ($("#completeFormData").val() != "") {
        //alert("data==>" + $("#completeFormData").val());
        return true;
    }
    finalObj["MediaUpload"] = createQJSON(this)
    generatePreview()
    $("button").prop('disabled', true);
    $(".SurveySection").hide();
    $("#SurveyPreview, #SurveyPreviewHTML").show();
    $("#SurveyPreviewNext, #SurveyPreviewHTMLPrevious, #SurveyPreviewPrint").prop('disabled', false);
    breadcrumb();
    return false;
});
function getTitle(title) {
    return '<h4 class="card-title" style="font-size:16px;"><i class="fa fa-pencil"></i>' + title + '</h4>';
}
function getEachRow(Label, Value) {
    return '<div class="col-md-12"><div class="form-group row"><label class="col-sm-7 col-form-label">' + Label + '</label><div class="col-sm-5">' + Value + '</div></div></div>';
}
function generatePreview() {
    var html = "";
    for (var key in finalObj) {
        if (finalObj.hasOwnProperty(key)) {
            html = html + getTitle(key);
            var item = finalObj[key];
            var innerHTML = "";
            for (var innerkey in item) {
                html = html + getEachRow(item[innerkey].label, item[innerkey].input)
            }
            html = html + "<hr/>";
        }
    }
    $("#SurveyPreviewHTML").html(html);
}


$("#SurveyPreviewForm").submit(function (e) {
    $("#completeFormData").val(JSON.stringify(finalObj))
    if ($("#completeFormData").val() != "") {
        $("#SurveyPreviewNext, #SurveyPreviewPrevious, #SurveyPreviewPrint").prop('disabled', false);
        $("#MediaUploadForm").submit();
    }
    return false;
});


function createDynamicEle(section, inputs, button_section) {
    var selectedCount = $("#NoOf" + inputs).val();
    var existCount = $("section[id^='" + section + "']").length;
    //console.log(section, inputs, button_section);
    console.log(selectedCount, existCount);
    if (selectedCount == "-1") {
        $("section[id^='" + section + "']").html("<br/><h4 class='NoExamRooms'>No Exam Rooms</h4><p>No Exam rooms, Please click Next!</p><br/>");
    } else {
        if ($(".NoExamRooms").length > 0) {
            $("section[id^='" + section + "']").html('<h4>Exam Room - 1</h4><div class="col-md-12"> <div class="form-group row"> <label class="col-sm-6 col-form-label">Supplies are put away neatly </label> <div class="col-sm-3" style="display:flex;"> <div class="form-radio" style="margin-top:auto;"> <label class="form-check-label"> <input type="radio" class="form-check-input" name="ExSupplies[0]" id="ExSuppliesYes" value="Yes" data-validation-error-msg-container="#ExSuppliesError" data-validation-error-msg="Please select Supplies are put away neatly" data-validation="required"> Yes </label> </div>&nbsp;&nbsp;&nbsp;&nbsp; <div class="form-radio" style="margin-top:auto;"> <label class="form-check-label"> <input type="radio" class="form-check-input" name="ExSupplies[0]" id="ExSuppliesNo" value="No" data-validation-error-msg-container="#ExSuppliesError" data-validation-error-msg="Please select Supplies are put away neatly" data-validation="required"> No </label> </div>&nbsp;&nbsp;&nbsp;&nbsp; <div class="form-radio" style="margin-top:auto;"> <label class="form-check-label"> <input type="radio" class="form-check-input" name="ExSupplies[0]" id="ExSuppliesNA" value="N/A" data-validation-error-msg-container="#ExSuppliesError" data-validation-error-msg="Please select Supplies are put away neatly" data-validation="required"> N/A </label> </div></div><div class="col-sm-3"> <input type="text" value="" name="ExSuppliesWODC[0]" id="ExSuppliesWODC" placeholder="Work Order Date/Comments" data-validation-error-msg-container="#ExSuppliesWODCError" data-validation-error-msg="Enter Work Order Date/Comments" class="form-control"/> </div><div class="col-sm-6"></div><div class="col-sm-12 errorMsgClass" id="ExSuppliesError"></div><div class="col-sm-3 errorMsgClass" id="ExSuppliesWODCError"></div></div></div><div class="col-md-12"> <div class="form-group row"> <label class="col-sm-6 col-form-label">Sink area is clean </label> <div class="col-sm-3" style="display:flex;"> <div class="form-radio" style="margin-top:auto;"> <label class="form-check-label"> <input type="radio" class="form-check-input" name="ExSink[0]" id="ExSinkYes" value="Yes" data-validation-error-msg-container="#ExSinkError" data-validation-error-msg="Please select Sink area is clean" data-validation="required"> Yes </label> </div>&nbsp;&nbsp;&nbsp;&nbsp; <div class="form-radio" style="margin-top:auto;"> <label class="form-check-label"> <input type="radio" class="form-check-input" name="ExSink[0]" id="ExSinkNo" value="No" data-validation-error-msg-container="#ExSinkError" data-validation-error-msg="Please select Sink area is clean" data-validation="required"> No </label> </div>&nbsp;&nbsp;&nbsp;&nbsp; <div class="form-radio" style="margin-top:auto;"> <label class="form-check-label"> <input type="radio" class="form-check-input" name="ExSink[0]" id="ExSinkNA" value="N/A" data-validation-error-msg-container="#ExSinkError" data-validation-error-msg="Please select Sink area is clean" data-validation="required"> N/A </label> </div></div><div class="col-sm-3"> <input type="text" value="" name="ExSinkWODC[0]" id="ExSinkWODC" placeholder="Work Order Date/Comments" data-validation-error-msg-container="#ExSinkWODCError" data-validation-error-msg="Enter Work Order Date/Comments" class="form-control"/> </div><div class="col-sm-6"></div><div class="col-sm-12 errorMsgClass" id="ExSinkError"></div><div class="col-sm-3 errorMsgClass" id="ExSinkWODCError"></div></div></div><div class="col-md-12"> <div class="form-group row"> <label class="col-sm-6 col-form-label">No Broken equipment </label> <div class="col-sm-3" style="display:flex;"> <div class="form-radio" style="margin-top:auto;"> <label class="form-check-label"> <input type="radio" class="form-check-input" name="ExNoBroken[0]" id="ExNoBrokenYes" value="Yes" data-validation-error-msg-container="#ExNoBrokenError" data-validation-error-msg="Please select No Broken equipment" data-validation="required"> Yes </label> </div>&nbsp;&nbsp;&nbsp;&nbsp; <div class="form-radio" style="margin-top:auto;"> <label class="form-check-label"> <input type="radio" class="form-check-input" name="ExNoBroken[0]" id="ExNoBrokenNo" value="No" data-validation-error-msg-container="#ExNoBrokenError" data-validation-error-msg="Please select No Broken equipment" data-validation="required"> No </label> </div>&nbsp;&nbsp;&nbsp;&nbsp; <div class="form-radio" style="margin-top:auto;"> <label class="form-check-label"> <input type="radio" class="form-check-input" name="ExNoBroken[0]" id="ExNoBrokenNA" value="N/A" data-validation-error-msg-container="#ExNoBrokenError" data-validation-error-msg="Please select No Broken equipment" data-validation="required"> N/A </label> </div></div><div class="col-sm-3"> <input type="text" value="" name="ExNoBrokenWODC[0]" id="ExNoBrokenWODC" placeholder="Work Order Date/Comments" data-validation-error-msg-container="#ExNoBrokenWODCError" data-validation-error-msg="Enter Work Order Date/Comments" class="form-control"/> </div><div class="col-sm-6"></div><div class="col-sm-12 errorMsgClass" id="ExNoBrokenError"></div><div class="col-sm-3 errorMsgClass" id="ExNoBrokenWODCError"></div></div></div><div class="col-md-12"> <div class="form-group row"> <label class="col-sm-6 col-form-label">Equipment is stored in proper location </label> <div class="col-sm-3" style="display:flex;"> <div class="form-radio" style="margin-top:auto;"> <label class="form-check-label"> <input type="radio" class="form-check-input" name="ExEquipment[0]" id="ExEquipmentYes" value="Yes" data-validation-error-msg-container="#ExEquipmentError" data-validation-error-msg="Please select Equipment is stored in proper location" data-validation="required"> Yes </label> </div>&nbsp;&nbsp;&nbsp;&nbsp; <div class="form-radio" style="margin-top:auto;"> <label class="form-check-label"> <input type="radio" class="form-check-input" name="ExEquipment[0]" id="ExEquipmentNo" value="No" data-validation-error-msg-container="#ExEquipmentError" data-validation-error-msg="Please select Equipment is stored in proper location" data-validation="required"> No </label> </div>&nbsp;&nbsp;&nbsp;&nbsp; <div class="form-radio" style="margin-top:auto;"> <label class="form-check-label"> <input type="radio" class="form-check-input" name="ExEquipment[0]" id="ExEquipmentNA" value="N/A" data-validation-error-msg-container="#ExEquipmentError" data-validation-error-msg="Please select Equipment is stored in proper location" data-validation="required"> N/A </label> </div></div><div class="col-sm-3"> <input type="text" value="" name="ExEquipmentWODC[0]" id="ExEquipmentWODC" placeholder="Work Order Date/Comments" data-validation-error-msg-container="#ExEquipmentWODCError" data-validation-error-msg="Enter Work Order Date/Comments" class="form-control"/> </div><div class="col-sm-6"></div><div class="col-sm-12 errorMsgClass" id="ExEquipmentError"></div><div class="col-sm-3 errorMsgClass" id="ExEquipmentWODCError"></div></div></div><div class="col-md-12"> <div class="form-group row"> <label class="col-sm-6 col-form-label">Furniture is in good repair and in appropriate place </label> <div class="col-sm-3" style="display:flex;"> <div class="form-radio" style="margin-top:auto;"> <label class="form-check-label"> <input type="radio" class="form-check-input" name="ExFurniture[0]" id="ExFurnitureYes" value="Yes" data-validation-error-msg-container="#ExFurnitureError" data-validation-error-msg="Please select Furniture is in good repair and in appropriate place" data-validation="required"> Yes </label> </div>&nbsp;&nbsp;&nbsp;&nbsp; <div class="form-radio" style="margin-top:auto;"> <label class="form-check-label"> <input type="radio" class="form-check-input" name="ExFurniture[0]" id="ExFurnitureNo" value="No" data-validation-error-msg-container="#ExFurnitureError" data-validation-error-msg="Please select Furniture is in good repair and in appropriate place" data-validation="required"> No </label> </div>&nbsp;&nbsp;&nbsp;&nbsp; <div class="form-radio" style="margin-top:auto;"> <label class="form-check-label"> <input type="radio" class="form-check-input" name="ExFurniture[0]" id="ExFurnitureNA" value="N/A" data-validation-error-msg-container="#ExFurnitureError" data-validation-error-msg="Please select Furniture is in good repair and in appropriate place" data-validation="required"> N/A </label> </div></div><div class="col-sm-3"> <input type="text" value="" name="ExFurnitureWODC[0]" id="ExFurnitureWODC" placeholder="Work Order Date/Comments" data-validation-error-msg-container="#ExFurnitureWODCError" data-validation-error-msg="Enter Work Order Date/Comments" class="form-control"/> </div><div class="col-sm-6"></div><div class="col-sm-12 errorMsgClass" id="ExFurnitureError"></div><div class="col-sm-3 errorMsgClass" id="ExFurnitureWODCError"></div></div></div><div class="col-md-12"> <div class="form-group row"> <label class="col-sm-6 col-form-label">Floor is clean and in good repair – NO rips/stains or unglued from wall/floor </label> <div class="col-sm-3" style="display:flex;"> <div class="form-radio" style="margin-top:auto;"> <label class="form-check-label"> <input type="radio" class="form-check-input" name="ExFloorClean[0]" id="ExFloorCleanYes" value="Yes" data-validation-error-msg-container="#ExFloorCleanError" data-validation-error-msg="Please select Floor is clean and in good repair – NO rips/stains or unglued from wall/floor" data-validation="required"> Yes </label> </div>&nbsp;&nbsp;&nbsp;&nbsp; <div class="form-radio" style="margin-top:auto;"> <label class="form-check-label"> <input type="radio" class="form-check-input" name="ExFloorClean[0]" id="ExFloorCleanNo" value="No" data-validation-error-msg-container="#ExFloorCleanError" data-validation-error-msg="Please select Floor is clean and in good repair – NO rips/stains or unglued from wall/floor" data-validation="required"> No </label> </div>&nbsp;&nbsp;&nbsp;&nbsp; <div class="form-radio" style="margin-top:auto;"> <label class="form-check-label"> <input type="radio" class="form-check-input" name="ExFloorClean[0]" id="ExFloorCleanNA" value="N/A" data-validation-error-msg-container="#ExFloorCleanError" data-validation-error-msg="Please select Floor is clean and in good repair – NO rips/stains or unglued from wall/floor" data-validation="required"> N/A </label> </div></div><div class="col-sm-3"> <input type="text" value="" name="ExFloorCleanWODC[0]" id="ExFloorCleanWODC" placeholder="Work Order Date/Comments" data-validation-error-msg-container="#ExFloorCleanWODCError" data-validation-error-msg="Enter Work Order Date/Comments" class="form-control"/> </div><div class="col-sm-6"></div><div class="col-sm-12 errorMsgClass" id="ExFloorCleanError"></div><div class="col-sm-3 errorMsgClass" id="ExFloorCleanWODCError"></div></div></div><div class="col-md-12"> <div class="form-group row"> <label class="col-sm-6 col-form-label">Baseboard is in good repair – NOT pulled away from wall </label> <div class="col-sm-3" style="display:flex;"> <div class="form-radio" style="margin-top:auto;"> <label class="form-check-label"> <input type="radio" class="form-check-input" name="ExBaseboard[0]" id="ExBaseboardYes" value="Yes" data-validation-error-msg-container="#ExBaseboardError" data-validation-error-msg="Please select Baseboard is in good repair – NOT pulled away from wall" data-validation="required"> Yes </label> </div>&nbsp;&nbsp;&nbsp;&nbsp; <div class="form-radio" style="margin-top:auto;"> <label class="form-check-label"> <input type="radio" class="form-check-input" name="ExBaseboard[0]" id="ExBaseboardNo" value="No" data-validation-error-msg-container="#ExBaseboardError" data-validation-error-msg="Please select Baseboard is in good repair – NOT pulled away from wall" data-validation="required"> No </label> </div>&nbsp;&nbsp;&nbsp;&nbsp; <div class="form-radio" style="margin-top:auto;"> <label class="form-check-label"> <input type="radio" class="form-check-input" name="ExBaseboard[0]" id="ExBaseboardNA" value="N/A" data-validation-error-msg-container="#ExBaseboardError" data-validation-error-msg="Please select Baseboard is in good repair – NOT pulled away from wall" data-validation="required"> N/A </label> </div></div><div class="col-sm-3"> <input type="text" value="" name="ExBaseboardWODC[0]" id="ExBaseboardWODC" placeholder="Work Order Date/Comments" data-validation-error-msg-container="#ExBaseboardWODCError" data-validation-error-msg="Enter Work Order Date/Comments" class="form-control"/> </div><div class="col-sm-6"></div><div class="col-sm-12 errorMsgClass" id="ExBaseboardError"></div><div class="col-sm-3 errorMsgClass" id="ExBaseboardWODCError"></div></div></div><div class="col-md-12"> <div class="form-group row"> <label class="col-sm-6 col-form-label">Windows are in good repair and operable </label> <div class="col-sm-3" style="display:flex;"> <div class="form-radio" style="margin-top:auto;"> <label class="form-check-label"> <input type="radio" class="form-check-input" name="ExWindowsGood[0]" id="ExWindowsGoodYes" value="Yes" data-validation-error-msg-container="#ExWindowsGoodError" data-validation-error-msg="Please select Windows are in good repair and operable" data-validation="required"> Yes </label> </div>&nbsp;&nbsp;&nbsp;&nbsp; <div class="form-radio" style="margin-top:auto;"> <label class="form-check-label"> <input type="radio" class="form-check-input" name="ExWindowsGood[0]" id="ExWindowsGoodNo" value="No" data-validation-error-msg-container="#ExWindowsGoodError" data-validation-error-msg="Please select Windows are in good repair and operable" data-validation="required"> No </label> </div>&nbsp;&nbsp;&nbsp;&nbsp; <div class="form-radio" style="margin-top:auto;"> <label class="form-check-label"> <input type="radio" class="form-check-input" name="ExWindowsGood[0]" id="ExWindowsGoodNA" value="N/A" data-validation-error-msg-container="#ExWindowsGoodError" data-validation-error-msg="Please select question" data-validation="required"> N/A </label> </div></div><div class="col-sm-3"> <input type="text" value="" name="ExWindowsGoodWODC[0]" id="ExWindowsGoodWODC" placeholder="Work Order Date/Comments" data-validation-error-msg-container="#ExWindowsGoodWODCError" data-validation-error-msg="Enter Work Order Date/Comments" class="form-control"/> </div><div class="col-sm-6"></div><div class="col-sm-12 errorMsgClass" id="ExWindowsGoodError"></div><div class="col-sm-5 errorMsgClass" id="ExWindowsGoodWODCError"></div></div></div><div class="col-md-12"> <div class="form-group row"> <label class="col-sm-6 col-form-label">Windows are clean and in good repair and operable </label> <div class="col-sm-3" style="display:flex;"> <div class="form-radio" style="margin-top:auto;"> <label class="form-check-label"> <input type="radio" class="form-check-input" name="ExWindowsClean[0]" id="ExWindowsCleanYes" value="Yes" data-validation-error-msg-container="#ExWindowsCleanError" data-validation-error-msg="Please select Windows are clean and in good repair and operable" data-validation="required"> Yes </label> </div>&nbsp;&nbsp;&nbsp;&nbsp; <div class="form-radio" style="margin-top:auto;"> <label class="form-check-label"> <input type="radio" class="form-check-input" name="ExWindowsClean[0]" id="ExWindowsCleanNo" value="No" data-validation-error-msg-container="#ExWindowsCleanError" data-validation-error-msg="Please select Windows are clean and in good repair and operable" data-validation="required"> No </label> </div>&nbsp;&nbsp;&nbsp;&nbsp; <div class="form-radio" style="margin-top:auto;"> <label class="form-check-label"> <input type="radio" class="form-check-input" name="ExWindowsClean[0]" id="ExWindowsCleanNA" value="N/A" data-validation-error-msg-container="#ExWindowsCleanError" data-validation-error-msg="Please select Windows are clean and in good repair and operable" data-validation="required"> N/A </label> </div></div><div class="col-sm-3"> <input type="text" value="" name="ExWindowsCleanWODC[0]" id="ExWindowsCleanWODC" placeholder="Work Order Date/Comments" data-validation-error-msg-container="#ExWindowsCleanWODCError" data-validation-error-msg="Enter Work Order Date/Comments" class="form-control"/> </div><div class="col-sm-6"></div><div class="col-sm-12 errorMsgClass" id="ExWindowsCleanError"></div><div class="col-sm-5 errorMsgClass" id="ExWindowsCleanWODCError"></div></div></div><div class="col-md-12"> <div class="form-group row"> <label class="col-sm-6 col-form-label">Paper towel, soap and sanitizer dispensers are in place, clean and full </label> <div class="col-sm-3" style="display:flex;"> <div class="form-radio" style="margin-top:auto;"> <label class="form-check-label"> <input type="radio" class="form-check-input" name="ExPaperTowel[0]" id="ExPaperTowelYes" value="Yes" data-validation-error-msg-container="#ExPaperTowelError" data-validation-error-msg="Please select Paper towel, soap and sanitizer dispensers are in place, clean and full" data-validation="required"> Yes </label> </div>&nbsp;&nbsp;&nbsp;&nbsp; <div class="form-radio" style="margin-top:auto;"> <label class="form-check-label"> <input type="radio" class="form-check-input" name="ExPaperTowel[0]" id="ExPaperTowelNo" value="No" data-validation-error-msg-container="#ExPaperTowelError" data-validation-error-msg="Please select Paper towel, soap and sanitizer dispensers are in place, clean and full" data-validation="required"> No </label> </div>&nbsp;&nbsp;&nbsp;&nbsp; <div class="form-radio" style="margin-top:auto;"> <label class="form-check-label"> <input type="radio" class="form-check-input" name="ExPaperTowel[0]" id="ExPaperTowelNA" value="N/A" data-validation-error-msg-container="#ExPaperTowelError" data-validation-error-msg="Please select Paper towel, soap and sanitizer dispensers are in place, clean and full" data-validation="required"> N/A </label> </div></div><div class="col-sm-3"> <input type="text" value="" name="ExPaperTowelWODC[0]" id="ExPaperTowelWODC" placeholder="Work Order Date/Comments" data-validation-error-msg-container="#ExPaperTowelWODCError" data-validation-error-msg="Enter Work Order Date/Comments" class="form-control"/> </div><div class="col-sm-6"></div><div class="col-sm-12 errorMsgClass" id="ExPaperTowelError"></div><div class="col-sm-5 errorMsgClass" id="ExPaperTowelWODCError"></div></div></div><div class="col-md-12"> <div class="form-group row"> <label class="col-sm-6 col-form-label">Walls are clean and in good repair : NO holes, graffiti, scuff marks </label> <div class="col-sm-3" style="display:flex;"> <div class="form-radio" style="margin-top:auto;"> <label class="form-check-label"> <input type="radio" class="form-check-input" name="ExWallsClean[0]" id="ExWallsCleanYes" value="Yes" data-validation-error-msg-container="#ExWallsCleanError" data-validation-error-msg="Please select Walls are clean and in good repair : NO holes, graffiti, scuff marks" data-validation="required"> Yes </label> </div>&nbsp;&nbsp;&nbsp;&nbsp; <div class="form-radio" style="margin-top:auto;"> <label class="form-check-label"> <input type="radio" class="form-check-input" name="ExWallsClean[0]" id="ExWallsCleanNo" value="No" data-validation-error-msg-container="#ExWallsCleanError" data-validation-error-msg="Please select Walls are clean and in good repair : NO holes, graffiti, scuff marks" data-validation="required"> No </label> </div>&nbsp;&nbsp;&nbsp;&nbsp; <div class="form-radio" style="margin-top:auto;"> <label class="form-check-label"> <input type="radio" class="form-check-input" name="ExWallsClean[0]" id="ExWallsCleanNA" value="N/A" data-validation-error-msg-container="#ExWallsCleanError" data-validation-error-msg="Please select Walls are clean and in good repair : NO holes, graffiti, scuff marks" data-validation="required"> N/A </label> </div></div><div class="col-sm-3"> <input type="text" value="" name="ExWallsCleanWODC[0]" id="ExWallsCleanWODC" placeholder="Work Order Date/Comments" data-validation-error-msg-container="#ExWallsCleanWODCError" data-validation-error-msg="Enter Work Order Date/Comments" class="form-control"/> </div><div class="col-sm-6"></div><div class="col-sm-12 errorMsgClass" id="ExWallsCleanError"></div><div class="col-sm-5 errorMsgClass" id="ExWallsCleanWODCError"></div></div></div><div class="col-md-12"> <div class="form-group row"> <label class="col-sm-6 col-form-label">Ceiling is in good repair – NO holes, peeling paint, graffiti </label> <div class="col-sm-3" style="display:flex;"> <div class="form-radio" style="margin-top:auto;"> <label class="form-check-label"> <input type="radio" class="form-check-input" name="ExCeiling[0]" id="ExCeilingYes" value="Yes" data-validation-error-msg-container="#ExCeilingError" data-validation-error-msg="Please select Ceiling is in good repair – NO holes, peeling paint, graffiti " data-validation="required"> Yes </label> </div>&nbsp;&nbsp;&nbsp;&nbsp; <div class="form-radio" style="margin-top:auto;"> <label class="form-check-label"> <input type="radio" class="form-check-input" name="ExCeiling[0]" id="ExCeilingNo" value="No" data-validation-error-msg-container="#ExCeilingError" data-validation-error-msg="Please select Ceiling is in good repair – NO holes, peeling paint, graffiti " data-validation="required"> No </label> </div>&nbsp;&nbsp;&nbsp;&nbsp; <div class="form-radio" style="margin-top:auto;"> <label class="form-check-label"> <input type="radio" class="form-check-input" name="ExCeiling[0]" id="ExCeilingNA" value="N/A" data-validation-error-msg-container="#ExCeilingError" data-validation-error-msg="Please select Ceiling is in good repair – NO holes, peeling paint, graffiti " data-validation="required"> N/A </label> </div></div><div class="col-sm-3"> <input type="text" value="" name="ExCeilingWODC[0]" id="ExCeilingWODC" placeholder="Work Order Date/Comments" data-validation-error-msg-container="#ExCeilingWODCError" data-validation-error-msg="Enter Work Order Date/Comments" class="form-control"/> </div><div class="col-sm-6"></div><div class="col-sm-12 errorMsgClass" id="ExCeilingError"></div><div class="col-sm-5 errorMsgClass" id="ExCeilingWODCError"></div></div></div><div class="col-md-12"> <div class="form-group row"> <label class="col-sm-6 col-form-label">Light fixtures are operable and in good condition </label> <div class="col-sm-3" style="display:flex;"> <div class="form-radio" style="margin-top:auto;"> <label class="form-check-label"> <input type="radio" class="form-check-input" name="ExLightFixtures[0]" id="ExLightFixturesYes" value="Yes" data-validation-error-msg-container="#ExLightFixturesError" data-validation-error-msg="Please select Light fixtures are operable and in good condition" data-validation="required"> Yes </label> </div>&nbsp;&nbsp;&nbsp;&nbsp; <div class="form-radio" style="margin-top:auto;"> <label class="form-check-label"> <input type="radio" class="form-check-input" name="ExLightFixtures[0]" id="ExLightFixturesNo" value="No" data-validation-error-msg-container="#ExLightFixturesError" data-validation-error-msg="Please select Light fixtures are operable and in good condition" data-validation="required"> No </label> </div>&nbsp;&nbsp;&nbsp;&nbsp; <div class="form-radio" style="margin-top:auto;"> <label class="form-check-label"> <input type="radio" class="form-check-input" name="ExLightFixtures[0]" id="ExLightFixturesNA" value="N/A" data-validation-error-msg-container="#ExLightFixturesError" data-validation-error-msg="Please select Light fixtures are operable and in good condition" data-validation="required"> N/A </label> </div></div><div class="col-sm-3"> <input type="text" value="" name="ExLightFixturesWODC[0]" id="ExLightFixturesWODC" placeholder="Work Order Date/Comments" data-validation-error-msg-container="#ExLightFixturesWODCError" data-validation-error-msg="Enter Work Order Date/Comments" class="form-control"/> </div><div class="col-sm-6"></div><div class="col-sm-12 errorMsgClass" id="ExLightFixturesError"></div><div class="col-sm-5 errorMsgClass" id="ExLightFixturesWODCError"></div></div></div><div class="col-md-12"> <div class="form-group row"> <label class="col-sm-6 col-form-label">Light switches/outlets are operable and in good condition </label> <div class="col-sm-3" style="display:flex;"> <div class="form-radio" style="margin-top:auto;"> <label class="form-check-label"> <input type="radio" class="form-check-input" name="ExLightSwitches[0]" id="ExLightSwitchesYes" value="Yes" data-validation-error-msg-container="#ExLightSwitchesError" data-validation-error-msg="Please select Light switches/outlets are operable and in good condition" data-validation="required"> Yes </label> </div>&nbsp;&nbsp;&nbsp;&nbsp; <div class="form-radio" style="margin-top:auto;"> <label class="form-check-label"> <input type="radio" class="form-check-input" name="ExLightSwitches[0]" id="ExLightSwitchesNo" value="No" data-validation-error-msg-container="#ExLightSwitchesError" data-validation-error-msg="Please select Light switches/outlets are operable and in good condition" data-validation="required"> No </label> </div>&nbsp;&nbsp;&nbsp;&nbsp; <div class="form-radio" style="margin-top:auto;"> <label class="form-check-label"> <input type="radio" class="form-check-input" name="ExLightSwitches[0]" id="ExLightSwitchesNA" value="N/A" data-validation-error-msg-container="#ExLightSwitchesError" data-validation-error-msg="Please select Light switches/outlets are operable and in good condition" data-validation="required"> N/A </label> </div></div><div class="col-sm-3"> <input type="text" value="" name="ExLightSwitchesWODC[0]" id="ExLightSwitchesWODC" placeholder="Work Order Date/Comments" data-validation-error-msg-container="#ExLightSwitchesWODCError" data-validation-error-msg="Enter Work Order Date/Comments" class="form-control"/> </div><div class="col-sm-6"></div><div class="col-sm-12 errorMsgClass" id="ExLightSwitchesError"></div><div class="col-sm-3 errorMsgClass" id="ExLightSwitchesWODCError"></div></div></div>');
            $(".form-check label,.form-radio label").append('<i class="input-helper"></i>');

        }
        if (selectedCount > existCount) {
            for (var loop = existCount; loop < selectedCount ; loop++) {
                var id = loop + 1;
                var errorID = "";
                var validationContainer = "";
                var Bathroom = $("#" + section + "1").eq(0).clone().prop('id', section + id);
                Bathroom.find('h4').html(section + id);
                Bathroom.find('input').each(function () {
                    validationContainer = $(this).attr("data-validation-error-msg-container");
                    $(this).attr("data-validation-error-msg-container", validationContainer + id)
                    this.name = this.name.replace('[0]', '[' + id + ']');
                });
                Bathroom.find(".errorMsgClass").each(function () {
                    errorID = $(this).attr("id");
                    $(this).attr("id", errorID + id)
                })
                //console.log(Bathroom.html());
                $('#' + button_section).before(Bathroom);
                $("section[id^='" + section + "']").show();
            }
        } else if (selectedCount == existCount) {
            $("section[id^='" + section + "']").show();
        } else {
            console.log(selectedCount);
            for (var loop = selectedCount; loop < existCount ; loop++) {
                var id = parseInt(loop) + 1;
                $("section[id^='" + section + "']").show();
                console.log(id);
                $("#" + section + id).remove();
            }
        }
    }

    $("#" + button_section).show();
}


$(document).ready(function () {
    //printing page
    $("#SurveyPreviewPrint").click(function () {
        w = window.open();
        w.document.write($('#SurveyPreviewHTML').html());
        w.print();
        w.close();
    })

    $(window).scroll(function () {
        if ($(this).scrollTop() > 300) {
            $('#pageScrollUp').fadeIn();
            $('#pageScrollDown').fadeOut();
        } else if ($(this).scrollTop() > 200) {
            $('#pageScrollUp').fadeOut();
            $('#pageScrollDown').fadeIn();
        }
    });

    $('.scrollup').click(function () {
        $("html, body").animate({ scrollTop: 0 }, 600);
        return false;
    });

    $('.scrolldown').click(function () {
        $("html, body").animate({ scrollTop: $(document).height() }, 600);
        return false;
    });
})