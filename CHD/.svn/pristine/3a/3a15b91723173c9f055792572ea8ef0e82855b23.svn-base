function moveToTop() {
    $('html, body').animate({ scrollTop: 0 }, 'slow');
}
function breadcrumb() {
    $("#pageScrollUp, #pageScrollDown").hide()
    var listli = "";
    var completed = true;
    $(".SurveySection").each(function () {
        var active = "";
        var title = $(this).find("h4").text();
        if ($(this).css("display") == "block") {
            completed = false;
            active = "class='is-active'";
        } else {
            active = "";
            if (completed)
                active = "class='is-complete'";
        }

        if (title != "") {
            listli = listli + '<li ' + active + '><span>' + title + '</span></li>';
        }

    });
    $('.chd-progress-bar').html(listli);
    //If is-active class applied to 2 li.
    if ($('.chd-progress-bar li.is-active').length > 1) {
        $('.chd-progress-bar li.is-active').eq(1).attr("class", "");
    }
}
function showMessage(message) {
    removeHash();   //removing query stirng..
    $("#snackbar").html(message);
    var x = document.getElementById("snackbar");
    x.className = "show";
    setTimeout(function () { console.log("asdf"); x.className = x.className.replace("show", ""); }, 5000);
}
function removeHash() {
    history.pushState("", document.title, window.location.pathname);
}
function getMessage(msgId) {
    switch (msgId) {
        case "1":
            return "Login success.";
            break;
        case "2":
            return "Username or password is wrong. Please try again!!!";
            break;
        case "3":
            return "Please enter Username or password.";
            break;
        case "4":
            return "Emergency drill added successfully";
            break;
        case "5":
            return "Fail to add emergency drill. Please try again later!!";
            break;
        case "6":
            return "Residential drill added successfully";
            break;
        case "7":
            return "Fail to add Residential drill. Please try again later!!";
            break;
        case "8":
            return "Residence checklist added successfully";
            break;
        case "9":
            return "Fail to add residence checklist. Please try again later!!";
            break;
        case "10":
            return "Office checklist added successfully";
            break;
        case "11":
            return "Fail to add office checklist. Please try again later!!";
            break;
        case "12":
            return "You have successfully updated your password.";
            break;
        case "13":
            return "Your old password is wrong.";
            break;
        case "14":
            return "Something went wrong! Please try again later!!";
            break;
        case "15":
            return "Password mismatch!!!";
            break;

    }
}
$(document).ready(function () {
    var urlParams = new URLSearchParams(window.location.search);
    if(urlParams.has('msg')) {
        var msgID = urlParams.get('msg');
        showMessage(getMessage(msgID));
    }
})
