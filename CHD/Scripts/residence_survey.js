﻿var resultJSON = "";
$.validate({
    lang: 'en'
});

//jQuery('#DateTimeofReview').datetimepicker({ format: 'd/m/Y h:m t' });
$(function () {
    $('#DateTimeofReview').daterangepicker({
        timePicker: true,
        maxDate: new Date(),
        singleDatePicker: true,
        startDate: moment().startOf('hour'),
        endDate: moment().startOf('hour').add(32, 'hour'),
        locale: {
            format: 'M/DD/YYYY h:mm a'
        }
    });
});
$(function () {
    $('#DateofReview').daterangepicker({

        maxDate: new Date(),
        singleDatePicker: true,
        startDate: moment().startOf('hour'),
        endDate: moment().startOf('hour').add(32, 'hour'),
        locale: {
            format: 'M/DD/YYYY '
        }
    });
});
$(function () {
    $('#TimeofReview').daterangepicker({
        timePicker: true,
        singleDatePicker: true,
        startDate: moment().startOf('hour'),
        endDate: moment().startOf('hour').add(32, 'hour'),
        locale: {
            format: 'hh:mm A '
        }
    }).on('show.daterangepicker', function (ev, picker) {
        picker.container.find(".calendar-table").hide();
    });
});
//$(function () {
//    $('#TimeofReview').daterangepicker({
//        timePicker: true,
//        timePickerIncrement: 0,
//        // timePickerSeconds: true,
//        locale: {
//            format: 'HH:mm A'
//        }
//    }).on('show.daterangepicker', function (ev, picker) {
//        picker.container.find(".calendar-table").hide();
//    });
//});
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
        data: JSON.stringify({ ProgramName: program, drillType: 'Residential' }),
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
    var address = $("#Location").val();
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

$("#BasicDetailsForm").submit(function () {
    finalObj["Residence_Survey"] = createQJSON(this)
    console.log(finalObj);
    $("button").prop('disabled', true);
    $(".SurveySection").hide();
    $("#ToxicSubstances").show();
    $("#ToxicSubstancesNext, #ToxicSubstancesPrevious").prop('disabled', false);
    moveToTop();
    breadcrumb();
    return false;
});
$("#ToxicSubstancesForm").submit(function () {
    finalObj["Toxic_Substances"] = createQJSON(this)
    $("button").prop('disabled', true);
    $(".SurveySection").hide();
    $("#KitchensANDDining").show();
    $("#KitchensANDDiningNext, #KitchensANDDiningPrevious").prop('disabled', false);
    moveToTop();
    breadcrumb();
    return false;
});
$("#KitchensANDDiningForm").submit(function () {
    finalObj["Kitchens_Dining"] = createQJSON(this)
    $("button").prop('disabled', true);
    $(".SurveySection").hide();
    $("#CommonLivingSpaces").show();
    $("#CommonLivingSpacesNext, #CommonLivingSpacesPrevious").prop('disabled', false);
    moveToTop();
    breadcrumb();
    return false;
});
$("#CommonLivingSpacesForm").submit(function () {
    finalObj["Common_Living_Spaces"] = createQJSON(this)
    $("button").prop('disabled', true);
    $(".SurveySection").hide();
    $("#LAUNDRYROOM").show();
    $("#LAUNDRYROOMNext, #LAUNDRYROOMPrevious").prop('disabled', false);
    moveToTop();
    breadcrumb();
    return false;
});
$("#LAUNDRYROOMForm").submit(function () {
    finalObj["LAUNDRYROOM"] = createQJSON(this)
    $("button").prop('disabled', true);
    $(".SurveySection").hide();
    $("#Bathrooms").show();
    $("#Bathroom1ButtonSection,#BathroomsFormNext, #BathroomsFormPrevious").prop('disabled', false);
    moveToTop();
    breadcrumb();
    return false;
});
$("#BathroomsForm").submit(function () {
    finalObj["Bathrooms"] = createQJSON(this)
    $("button").prop('disabled', true);
    $(".SurveySection").hide();
    createBathrooms();
    $("#Bathroom1").show();
    $("#Bathroom1Next, #Bathroom1Previous").prop('disabled', false);
    moveToTop();
    breadcrumb();
    return false;
});
$("#Bathroom1Form").submit(function () {
    finalObj["Bathroom1"] = createQJSON(this)
    $("button").prop('disabled', true);
    $(".SurveySection").hide();
    $("#Bedrooms").show();
    $("#BedroomsNext, #BedroomsPrevious").prop('disabled', false);
    breadcrumb();
    return false;
});

$("#BedroomsForm").submit(function () {
    finalObj["Bedrooms"] = createQJSON(this)
    $("button").prop('disabled', true);
    $(".SurveySection").hide();
    createBedrooms();
    $("#Bedroom").show();
    $("#BedroomNext, #BedroomPrevious").prop('disabled', false);
    moveToTop();
    breadcrumb();
    return false;
});
$("#BedroomForm").submit(function () {
    finalObj["Bedroom"] = createQJSON(this)
    $("button").prop('disabled', true);
    $(".SurveySection").hide();
    $("#Basement").show();
    $("#BasementNext, #BasementPrevious").prop('disabled', false);
    moveToTop();
    breadcrumb();
    return false;
});
function createBedrooms() {
    for (var loop = 1; loop < $("#NoOfBedrooms").val() ; loop++) {
        var id = loop + 1;
        var errorID = "";
        var validationContainer = "";
        var Bathroom = $("#Bedroom").eq(0).clone().prop('id', 'Bedroom' + id);
        Bathroom.find('h4').html(" Bedroom " + id);
        Bathroom.find('input').each(function () {
            validationContainer = $(this).attr("data-validation-error-msg-container");
            $(this).attr("data-validation-error-msg-container", validationContainer + id)
            this.name = this.name.replace('[0]', '[' + id + ']');
        });
        Bathroom.find(".errorMsgClass").each(function () {
            errorID = $(this).attr("id");
            $(this).attr("id", errorID + id)
        })
        $('#BeroomButtonSection').before(Bathroom);
        $("#Bedroom" + id).show();
    }
    $("#BeroomButtonSection").show();
}
$("#BasementForm").submit(function () {
    finalObj["Basement"] = createQJSON(this)
    $("button").prop('disabled', true);
    $(".SurveySection").hide();
    $("#ExteriorDeckPorchWODC").show();
    $("#ExteriorDeckPorchWODCNext, #ExteriorDeckPorchWODCPrevious").prop('disabled', false);
    moveToTop();
    breadcrumb();
    return false;
});

$("#ExteriorDeckPorchWODCForm").submit(function () {
    finalObj["Exterior_Deck_Porch"] = createQJSON(this)
    $("button").prop('disabled', true);
    $(".SurveySection").hide();
    $("#OTHERITEMS").show();
    $("#OTHERITEMSNext, #OTHERITEMSPrevious").prop('disabled', false);
    moveToTop();
    breadcrumb();
    return false;
});
$("#OTHERITEMSForm").submit(function () {
    finalObj["OTHER_ITEMS"] = createQJSON(this)
    $("button").prop('disabled', true);
    $(".SurveySection").hide();
    $("#HumanRights").show();
    $("#HumanRightsNext, #HumanRightsPrevious").prop('disabled', false);
    moveToTop();
    breadcrumb();
    return false;
});
$("#HumanRightsForm").submit(function () {
    finalObj["HumanRights"] = createQJSON(this)
    $("button").prop('disabled', true);
    $(".SurveySection").hide();
    $("#SAFETY").show();
    $("#SAFETYNext, #SAFETYPrevious").prop('disabled', false);
    moveToTop();
    breadcrumb();
    return false;
});
$("#SAFETYForm").submit(function () {
    finalObj["SAFETY"] = createQJSON(this)
    $("button").prop('disabled', true);
    $(".SurveySection").hide();
    $("#SAFETYHeating").show();
    $("#SAFETYHeatingNext, #SAFETYHeatingPrevious").prop('disabled', false);
    moveToTop();
    breadcrumb();
    return false;
});
$("#SAFETYHeatingForm").submit(function () {
    finalObj["SAFETY_Heating"] = createQJSON(this)
    $("button").prop('disabled', true);
    $(".SurveySection").hide();
    $("#MediaUpload").show();
    $("#MediaUploadNext, #MediaUploadPrevious").prop('disabled', false);
    moveToTop();
    breadcrumb();
    return false;
});
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
    $("#SurveyPreviewNext, #SurveyPreviewPrevious, #SurveyPreviewPrint").prop('disabled', false);
    breadcrumb();
    return false;
});
function getTitle(title) {
    return '<h4 class="card-title" style="font-size:16px;"><i class="fa fa-pencil"></i>' + title + '</h4>';
}
function getEachRow(Label, Value) {
    return '<div class="col-md-12"><div class="form-group row"><label class="col-sm-4 col-form-label">' + Label + '</label><div class="col-sm-5">' + Value + '</div></div></div>';
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
        breadcrumb();
        $("#MediaUploadForm").submit();
    }
    return false;
});

function createBathrooms() {
    for (var loop = 1; loop < $("#NoOfBathrooms").val() ; loop++) {
        var id = loop + 1;
        var errorID = "";
        var validationContainer = "";
        var Bathroom = $("#Bathroom1").eq(0).clone().prop('id', 'Bathroom' + id);
        Bathroom.find('h4').html(" Bathroom " + id);
        Bathroom.find('input').each(function () {
            validationContainer = $(this).attr("data-validation-error-msg-container");
            $(this).attr("data-validation-error-msg-container", validationContainer + id)
            this.name = this.name.replace('[0]', '[' + id + ']');
        });
        Bathroom.find(".errorMsgClass").each(function () {
            errorID = $(this).attr("id");
            $(this).attr("id", errorID + id)
        })
        $('#Bathroom1ButtonSection').before(Bathroom);
        $("#Bathroom" + id).show();
    }
    $("#Bathroom1ButtonSection").show();
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