$('.fdatepicker').datepicker({
    format: 'dd-mm-yyyy',
    autoclose: true
});
$("#mfdob").datepicker({
    format: 'dd-mm-yyyy',
    autoclose: true,
}).on('change', function () {
    var fdate = formatDate($("#mfdob").val());
    var age = getAge(fdate);
    $("#mfage").val(age);
});
function getAge(dateVal) {
    var
        birthday = new Date(dateVal),
        today = new Date(),
        ageInMilliseconds = new Date(today - birthday),
        years = ageInMilliseconds / (24 * 60 * 60 * 1000 * 365.25),
        months = 12 * (years % 1),
        days = Math.floor(30 * (months % 1));
    return Math.floor(years);
}
function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
}
function nShow(div, token) {
    var count = $('#ncount').val();
    if (token == "1") {
        $('#noption' + div).show();
        $('#nadd' + (div - 1)).hide();
        $('#nremove' + (div - 1)).hide();
        if (div == "6") {
            $('#nadd' + div).hide();
        }
        $('#nremove' + div).show();
        $('#ncount').val(eval(count) + 1);
    } else {
        $('#nadd' + (div - 1)).show();
        if (div != "2") {
            $('#nremove' + (div - 1)).show();
        }
        $('#noption' + div).hide();
        $('#ncount').val(eval(count) - 1);
    }
}
function b64toBlob(b64Data, contentType, sliceSize) {
    contentType = contentType || '';
    sliceSize = sliceSize || 512;

    var byteCharacters = atob(b64Data);
    var byteArrays = [];

    for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
        var slice = byteCharacters.slice(offset, offset + sliceSize);

        var byteNumbers = new Array(slice.length);
        for (var i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
        }

        var byteArray = new Uint8Array(byteNumbers);

        byteArrays.push(byteArray);
    }

    var blob = new Blob(byteArrays, { type: contentType });
    return blob;
}
$.validator.setDefaults({
    submitHandler: function () {
        $("#info-status").hide();
        $("#btnsent").hide();
        var ImageURL = $('#mfphoto').attr('src');
        if (ImageURL != undefined) {
            var block = ImageURL.split(";");
            var contentType = block[0].split(":")[1];// In this case "image/gif"
            var realData = block[1].split(",")[1];// In this case "R0lGODlhPQBEAPeoAJosM...."
            var blob = b64toBlob(realData, contentType);
            var form = document.getElementById("membershipForm");
            var fd = new FormData(form);
            fd.append("profile-pic", blob);
        }
        else {
            var form = document.getElementById("membershipForm");
            var fd = new FormData(form);
        }
        $.ajax({
            url: "upload-profile.php",
            data: fd,
            type: "POST",
            contentType: false,
            processData: false,
            cache: false,
            dataType: "json",
            success: function (response) {
                $("#info-status").show();
                if (response.type == "error") {
                    $("#info-status").attr("class", "error");
                } else if (response.type == "message") {
                    $("#info-status").attr("class", "success");
                }
                $("#info-status").html(response.text);
            },
        });
    }
});