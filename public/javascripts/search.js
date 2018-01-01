$(document).ready(function () {

    // function returns html div element containing business information
    function businessPlate(business) {
        console.log("GOING::::::",business.going);
        var plate = "<div class='row plate plate-mine'>";
        plate += "<div class='pl-2'><img width='100' height='100' class='mt-3' ";
        plate += "src=" + business.image_url + "> </div>";
        plate += "<div class='col'>";
        plate += "<p class='text-left'><strong>" + business.name + "</strong></p>";
        plate += "<p class='text-left'><q><em>" + business.review + "</em></q></p>";
        plate += "<button type='button' class='btn btn-outline-light going-bar' data-biss-id='" + business.id + "'><span>"+ business.going +"</span> Going</button>"
        plate + "</div></div>";
        return plate;
    }

    // select the go button
    const button = $(".go");
    const searchResult = $(".search-result");

    button.on( "click", function () {
        var place = $("input:text").val();
        if (place === "") {
            return;
        }
        button.prop("disabled", true);
        $.ajax({
            type: "POST",
            method: 'POST',
            url: "/",
            data: {
                "place": place
            },
            success: function (data) {
                button.prop("disabled", false);
                $('.plate').remove();
                if (data['SUCCESS']) {
                    let results = data['results'];
                    console.log(results);
                    for (let i = 0; i < results.length; i++) {
                        searchResult.append(businessPlate(results[i]));
                    }

                } else {
                    let plate = "<div class='alert plate alert-dark ml-5' role='alert'>Opps!... can't find the place</div>";
                    searchResult.append(plate);
                }

            },
            error: function (e) {

                alert("Oops! Something went wrong.");
                button.prop("disabled", false);

            }
        });
    });

    // trigger click event on "GO" button
    button.trigger("click");


    $("body").on("click", ".going-bar", function () {
        console.log($(this).data('biss-id'));
        var businessId = $(this).data('biss-id');
        //console.log($(this).children('span').text('10'));
        var bizz = $(this);
        //console.log($('body').find('.going-bar'));
        var goingBar = $('body').find('.going-bar');
        goingBar.prop("disabled", true);
        $.ajax({
            type: "POST",
            method: 'POST',
            url: "/bar",
            data: {
                "id": businessId
            },
            success: function (data) {
                goingBar.prop("disabled", false);
                if (!data['LOGED']) {
                    window.location = data.redirect;
                } else {
                    console.log("GOING:",data.going);
                    bizz.children('span').text(data.going);
                }

            },
            error: function (e) {

                alert("Oops! Something went wrong.");
                goingBar.prop("disabled", false);

            }
        });
    });
});