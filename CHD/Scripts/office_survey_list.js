$(document).ready(function () {
    $('#officeSurveyList').DataTable();
    $("#officeListPrint").click(function () {
        w = window.open();
        w.document.write($('#officeSurveyWindow .modal-body').html());
        w.print();
        w.close();
    })
    $('#officeListPDF').click(function () {
        var obj = new jsPDF();
        obj.fromHTML($('#officeSurveyWindow .modal-body').get(0), 10, 10, { 'width': 180 });
        obj.save('Office_Checklist.pdf');
    });
    $(".actionViewDetails").click(function () {
        var uniqueId = $(this).attr("data-id");
        $.ajax({
            url: homePage + "OfficeSurvey/view",
            method: "POST",
            data: { 'uniqueID': uniqueId },
            success: function (result) {
                $("#officeSurveyWindow .modal-body").html(result);
                $('#officeSurveyWindow').modal('show');
            }
        });
    })
})