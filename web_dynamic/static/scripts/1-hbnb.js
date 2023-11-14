
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
$( document ).ready(()=>{
    checkAminites()
});