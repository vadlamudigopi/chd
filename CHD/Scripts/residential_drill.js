function updatePopup(uniqueId) {
    $.ajax({
        url: homePage + "ResidentialDrill/getViewData",
        method: "POST",
        data: { 'uniqueID': uniqueId },
        success: function (result) {
            $("#residentialModalWindow .modal-body").html(result);
            $('#residentialModalWindow').modal('show');
        }
    });
}
$.validator.addMethod("time24", function (value, element) {
    if (!/^\d{2}:\d{2}$/.test(value)) return false;
    var parts = value.split(':');
    if (parts[0] > 59 || parts[1] > 59) return false;
    return true;
}, "Please enter correct time.");


$(document).ready(function () {
    //setting up default value for durationof drill
    $("#DurationofdrillMinutes").val("02");
    $("#DurationofdrillSeconds").val("00");
    $("#Durationofdrill").val("02:00");

    $('#DurationofdrillMinutes, #DurationofdrillSeconds').change(function () {
        $("#Durationofdrill").val($("#DurationofdrillMinutes").val() + ":" + $("#DurationofdrillSeconds").val());
        $("#Durationofdrill").trigger("change");

    })
    $('input[type=radio][name=Evacuation]').change(function () {
        var val = $("input[type=radio][name=Evacuation]:checked").val();
        $("#Durationofdrill").val("");
        if (val == "Evacuation") {            
            $("#DurationofdrillMinutes, #DurationofdrillSeconds").attr("disabled", false);
        } else if (val == "Table Top") {
            $("#DurationofdrillMinutes, #DurationofdrillSeconds").val("").attr("disabled", true);
        } else if (val == "Evacuation off Site") {
            $("#DurationofdrillMinutes, #DurationofdrillSeconds").attr("disabled", false);
        }
    })
    jQuery('#ImprovementDate, #CompletedDate').datetimepicker({ timepicker: false, format: 'm/d/Y',maxDate: new Date() });
    jQuery('#DrillDate').datetimepicker({ maxDate: new Date(), ampm: true, step: 30, formatTime: 'g:i a', format: 'm/d/Y H:i' });

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
    if ($('#residentialsDrill').length) {
        $('#residentialsDrill').DataTable({
            dom: 'Bfrtip',
            "columnDefs": [
                {
                    "targets": [3, 4, 5, 6, 10, 11, 12, 13],
                    "visible": false,
                    "searchable": false
                }
            ],
            buttons: [
                {
                    extend: 'excelHtml5',
                    filename: "Residential Drill Logs",
                    title: "Residential Drill Logs",
                    text: 'Export',  
                    //className: 'btn btn-success',
                    exportOptions: {
                        columns: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]
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