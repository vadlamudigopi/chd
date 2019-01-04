$(document).ready(function () {
    $('#residencySurveyList').DataTable();
    $("#residenceListPrint").click(function () {
        w = window.open();
        w.document.write($('#residenceSurveyWindow .modal-body').html());
        w.print();
        w.close();
    })
    $('#residenceListPDF').click(function () {
        var obj = new jsPDF();
        obj.fromHTML($('#residenceSurveyWindow .modal-body').get(0), 10, 10, { 'width': 180 });
        obj.save('Residential_Checklist.pdf');
    });
    $(".actionViewDetails").click(function () {
        var uniqueId = $(this).attr("data-id");
        $.ajax({
            url: homePage + "ResidenceSurvey/view",
            method: "POST",
            data: { 'uniqueID': uniqueId },
            success: function (result) {
                $("#residenceSurveyWindow .modal-body").html(result);
                $('#residenceSurveyWindow').modal('show');
            }
        });
    })
})