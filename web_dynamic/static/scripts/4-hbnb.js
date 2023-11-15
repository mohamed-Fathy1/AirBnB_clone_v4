
let selectedAminites_list = []
let selectedAminites_dict = {}
function checkAminites() {
    $('.popover li input').on('click',
        function () {
            const data_id = $(this).attr("data-id")
            const data_name = $(this).attr("data-name")
            if ($(this).is(":checked")) {
                selectedAminites_list.push(data_name)
                selectedAminites_dict[data_name] = data_id
            } else {
                selectedAminites_list = selectedAminites_list.filter((e, i) => e !== data_name);
                delete selectedAminites_dict[data_name]
            }
            $('.amenities h4').html(selectedAminites_list.join(', '))
        })
}

function check_api_status(){
    $(() => {
        $.get('http://0.0.0.0:5001/api/v1/status/', (data) => {
            if (data.status === 'OK') {
                $('div#api_status').addClass('available');
            } else {
                $('div#api_status').removeClass('available');
            }
        })
    })
}

function getPlaces() {
    $('section.filters button').click(() => {
        let aminity_ids = Object.values(selectedAminites_dict)

        let search_data = {
            "states": [],
            "cities": [],
            "amenities": [],
        }
        search_data.amenities = aminity_ids.map(obj => obj.toString())
        fillter_search(search_data)
    })
        function fillter_search(search_data) {
            $.ajax({
                type: "POST",
                url: 'http://0.0.0.0:5001/api/v1/places_search',
                data: JSON.stringify(search_data),
                contentType: 'application/json',
                success: (data) => {
                    $('section.places').empty();
                    data.forEach((place) => {
                        let newPlace = `<article>
                    <div class="title_box">
                        <h2>${place.name}</h2>
                        <div class="price_by_night">${place.price_by_night}</div>
                    </div>
                    <div class="information">
                    <div class="max_guest">${place.max_guest} Guest${(place.max_guest != 1) ? 's' : ''}</div>
                    <div class="number_rooms">${place.number_rooms} Bedroom${(place.number_rooms != 1) ? "s" : ""}</div>
                    <div class="number_bathrooms">${place.number_bathrooms} Bathroom${(place.number_bathrooms != 1) ? "s" : ''}</div>
                    </div>
                    <div class="user">
                    </div>
                    <div class="description">
                    ${place.description}
                    </div>
                    </article>`
                        $('section.places').append(newPlace);
                    })
                },
                error: function (error) {
                    console.error('Error:', error);
                }
            })
        }
}

$( document ).ready(()=>{
    $('input[type=checkbox]:checked').prop('checked', false)
    check_api_status()
    checkAminites()
    getPlaces()
});