
let selectedAminites_list = []
let selectedAminites_dict = {}
let selectedStates_list = []
let selectedStates_dict = {}
let selectedCities_list = []
let selectedCities_dict = {}
let offset = 1

function append_text_to_list() {
    states = selectedStates_list.map(ele => `<b>${ele}</b>`)
    states = states.join(', ')
    cities = selectedCities_list.join(', ')
    $('.locations h4').html(cities && states ? states + ', ' + cities : states ? states : cities)
}



function checkAminites(){
    $('.amenities .popover li input').on('click',
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


function checkStates(){
    $('.locations .popover > ul > input').on('click',
        function () {
            const data_id = $(this).attr("data-id")
            const data_name = $(this).attr("data-name")
            if ($(this).is(":checked")) {
                selectedStates_list.push(data_name)
                selectedStates_dict[data_name] = data_id
            } else {
                selectedStates_list = selectedStates_list.filter((e, i) => e !== data_name);
                delete selectedStates_dict[data_name]
            }
            append_text_to_list()
        })
}



function checkCities(){
    $('.locations .popover > ul li input').on('click',
        function () {
            const data_id = $(this).attr("data-id")
            const data_name = $(this).attr("data-name")
            if ($(this).is(":checked")) {
                selectedCities_list.push(data_name)
                selectedCities_dict[data_name] = data_id
            } else {
                selectedCities_list = selectedCities_list.filter((e, i) => e !== data_name);
                delete selectedCities_dict[data_name]
            }
            append_text_to_list()
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


function loadMore() {
    $('section.places .load-more button').click(() => {
        offset++
        $('section.places .load-more button').remove()
        $('section.places').append(`
                         <div class="loading">
                            <div class="loading-spin"></div>
                         </div>
                    `)

        let aminity_ids = Object.values(selectedAminites_dict)

        let search_data = {
            "states": [],
            "cities": [],
            "amenities": [],
            "offset": offset,
        }
        search_data.amenities = aminity_ids.map(obj => obj.toString())
        fillter_search(search_data)
    })

}


function getPlaces() {
    $('section.filters button').click(() => {
        offset = 1
        $('section.places').empty();
        $('section.places').html(`
                         <div class="loading">
                            <div class="loading-spin"></div>
                         </div>
                    `)
        let aminity_ids = Object.values(selectedAminites_dict)

        let search_data = {
            "states": [],
            "cities": [],
            "amenities": [],
            "offset": offset,
        }
        search_data.amenities = aminity_ids.map(obj => obj.toString())
        fillter_search(search_data)
    })
}


function fillter_search(search_data) {
    $.ajax({
        type: "POST",
        url: 'http://0.0.0.0:5001/api/v1/places_search?limit=10',
        data: JSON.stringify(search_data),
        contentType: 'application/json',
        success: (data) => {
            if (offset === 1)
                $('section.places').empty();
            else
                $('section .loading').remove()

            if (data.length === 0)
                return

            data.forEach((place) => {
                let newPlace = `<article>
                    <div class="title_box">
                        <h2>${place.name}</h2>
                        <div class="price_by_night">$${place.price_by_night}</div>
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
            $('section.places').append(`<div class="load-more"> <button>LOAD MORE</button> </div>`)
            loadMore()
        },
        error: function (error) {
            console.error('Error:', error);
        }
    })
}


$( document ).ready(()=>{
    $('input[type=checkbox]:checked').prop('checked', false)
    check_api_status()
    checkAminites()
    checkStates()
    checkCities()
    getPlaces()
});