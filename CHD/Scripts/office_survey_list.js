﻿$(document).ready(function () {
    $('#officeSurveyList').DataTable({
        dom: 'Bfrtip',
        "columnDefs": [
            {
                "targets": [4, 5, 7, 8],
                "visible": false,
                "searchable": false
            }
        ],
        buttons: [
            {
                extend: 'excelHtml5',
                filename: "Office Checklist",
                title: "Office Checklist",
                text: 'Export',
                //className: 'btn btn-success',
                exportOptions: {
                    columns: [0, 1, 2, 3, 4, 5, 6, 7, 8]
                },
                customize: function (xlsx) {
                    var sheet = xlsx.xl.worksheets['sheet1.xml'];
                }
            }
        ]
    });

    $("#officeListPrint").click(function () {
        $("#print_pdf").html($('#officeSurveyWindow .modal-body').html());
        $("#print_pdf").find("div").show();
            w = window.open();
            w.document.write($('#print_pdf').html());
            w.print();
            w.close();
        $("#print_pdf").html("");
    })
    $('#officeListPDF').click(function () {
        var doc = new jsPDF();
        var specialElementHandlers = {
            'div': function (element, renderer) {
                element.show();
            }
        };

        doc.fromHTML($('#officeSurveyWindow .modal-body').get(0), 15, 15, {
            'width': 170,
            'elementHandlers': specialElementHandlers
        });
        doc.save('Office_Checklist.pdf');

    });
    $(".actionViewDetails").click(function () {
        var uniqueId = $(this).attr("data-id");
        $("#summaryLink").attr({ "href": homePage + "OfficeSurvey/pdf/?page=summary&a=" + uniqueId });
        $("#fullLink").attr({ "href": homePage + "OfficeSurvey/pdf/?page=full&a=" + uniqueId });
        $.ajax({
            url: homePage + "OfficeSurvey/view",
            method: "POST",
            data: { 'uniqueID': uniqueId },
            success: function (result) {
                var string = '<!DOCTYPE html><html lang="en"><head><style><style>body{font-family: "Poppins", sans-serif;}.h5, h5 {font-size: 1rem; }hr{width: 100%;}hr {margin-top: 1rem;margin-bottom: 1rem;border: 0; border-top: 1px solid rgba(0, 0, 0, 0.1);}.col-md-12{width:100%;}.col-sm-8{width:60%; float:left;}.col-sm-4{width:40%;float:right;}</style></style></head><body>' + result + '</body></html>';
                console.log(string);
                $("#htmlContent").val(string);
                $("#officeSurveyWindow .modal-body").html(result);
                $('#officeSurveyWindow').modal('show');
            }
        });
    })
})