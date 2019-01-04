function updatePopup(uniqueId) {
    $.ajax({
        url: homePage + "Emergency/getViewData",
        method: "POST",
        data: { 'uniqueID': uniqueId },
        success: function (result) {
            $("#nonResidentialModalWindow .modal-body").html(result);
            $('#nonResidentialModalWindow').modal('show');
        }
    });
}
function setdefault() {
    $("#SecondaryLocation").val("N/A").attr("readonly", true); //secondary location is always off, except "Evacuation off Site" 
    
    $("#DrillScenario").attr("readonly", false);
    if ($("#DrillScenario").val() == "N/A")
        $("#DrillScenario").val("").attr("readonly", false);
    if ($("#EgressWasBlocked").val() == "N/A")
        $("#EgressWasBlocked").val("").attr("readonly", false);
    if ($("#BuildingExit").val() == "N/A")
        $("#BuildingExit").val("").attr("readonly", false);


}
function durationInSeconds() {
    var hms = $("#Durationofdrill").val();
    if (hms != "") {
        var a = hms.split(':');
        var seconds = (+a[0]) * 60 + (+a[1]);
        return seconds;
    }
    return 0;
}
$(document).ready(function () {
    //setting up default value for durationof drill
    $("#DurationofdrillMinutes").val("02");
    $("#DurationofdrillSeconds").val("00");
    $("#Durationofdrill").val("02:00");
    jQuery('#DateTimeofDrill').datetimepicker({ maxDate: new Date(), ampm: true, step: 30, formatTime: 'g:i a', format: 'm/d/Y H:i' });  //, formatDate: 'm/d/Y h:i a'
    jQuery('#StaffSignatureDate,#SupervisorSignatureDate').datetimepicker({ timepicker: false, format: 'm/d/Y', maxDate: new Date() });


    $('#DateTimeofDrill').change(function () {
        var dateNtime = $('#DateTimeofDrill').val();
        var Ntime = new Date(dateNtime).getTime();
        var dateOnly = dateNtime.split(" ");
        var time7 = dateOnly[0] + " 7:00 AM";
        var time7 = new Date(time7).getTime();
        var time10 = dateOnly[0] + " 10:00 PM";
        var time10 = new Date(time10).getTime();

        //setting Drill was during
        $("#DrillWasDuring").val("");
        
        if (Ntime >= time7 && Ntime < time10) {
            $("#DrillWasDuring").val("Awake Hours");
        } else {
            $("#DrillWasDuring").val("Sleep Hours");
        }

    })
    $('#DurationofdrillMinutes, #DurationofdrillSeconds').change(function () {
        $("#Durationofdrill").val($("#DurationofdrillMinutes").val() + ":" + $("#DurationofdrillSeconds").val());
        $("#Durationofdrill").trigger("change");

    })
    $('input[type=radio][name=Evacuation], #Durationofdrill').change(function () {
        var val = $("input[type=radio][name=Evacuation]:checked").val();
        setdefault();
        var seconds = durationInSeconds();
        if (seconds > 0 && seconds < 150 && val == "Evacuation") {
            $("#DrillScenario,#EgressWasBlocked,#BuildingExit").val("N/A").attr("readonly", true);
        }
        else if (val == "Evacuation") {
            $("#DrillScenario").val("N/A").attr("readonly", true);
            $("#DurationofdrillMinutes, #DurationofdrillSeconds").attr("disabled", false);
            $("#Durationofdrill").val("");
        } else if (val == "Table Top") {
            $("#EgressWasBlocked,#BuildingExit").val("N/A").attr("readonly", true);
            $("#DurationofdrillMinutes, #DurationofdrillSeconds").val("").attr("disabled", true);
            $("#Durationofdrill").val("");
        } else if (val == "Evacuation off Site") {
            $("#DrillScenario").val("N/A").attr("readonly", true);
            $("#SecondaryLocation").val("").attr("readonly", false);
            $("#DurationofdrillMinutes, #DurationofdrillSeconds").attr("disabled", false);
            $("#Durationofdrill").val("");
        }
    })
    if ($(".actionViewDetails").length) {
        $(".actionViewDetails").click(function () {
            var uniqueId = $(this).closest('tr').children('td:first').text().trim();
            updatePopup(uniqueId);
        })
    }
    if ($(".clickUniqueId").length) {
        $(".clickUniqueId").click(function () {
            var uniqueId = $(this).text().trim();
            updatePopup(uniqueId);
        })
    }
    if ($('#emergencyDrill').length) {
        $('#emergencyDrill').DataTable({
            dom: 'Bfrtip',
            "columnDefs": [
                {
                    "targets": [3, 4, 5,6, 10, 11, 12],
                    "visible": false,
                    "searchable": false
                }
            ],
            buttons: [
                {
                    extend: 'excelHtml5',
                    filename: "Non-residential / Office base Drills",
                    title: "Non-residential / Office base Drills",
                    text: 'Export',
                    //className: 'btn btn-success',
                    exportOptions: {
                        columns: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
                    },
                    customize: function (xlsx) {
                        var sheet = xlsx.xl.worksheets['sheet1.xml'];
                        //$('row:first c', sheet).attr('s', '2');
                    }
                }
            ]
        })
    }
})