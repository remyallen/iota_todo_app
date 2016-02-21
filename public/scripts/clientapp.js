$(document).ready(function() {

    //postData();

    $('#post-data').on('click', postData);

    $('#container').on('change', '.task', showComplete);


});

function postData() {
    event.preventDefault();

    var values = {};
    $.each($('#post-form').serializeArray(), function(i, field) {
        values[field.name] = field.value;
    });

    values.taskComplete = false;

    $('#post-form').find('input[type=text]').val('');

    console.log(values);

    $.ajax({
        type: 'POST',
        url: '/task',
        data: values,
        success: function(data) {
            if(data) {
                // everything went ok
                console.log('from server:', data);
                getData();
            } else {
                console.log('error');
            }
        }
    });

}

function getData() {
    $.ajax({
        type: 'GET',
        url: '/task',
        success: function(data) {
            console.log(data);

            $.each(data, function(i, task) {
                $('#container').append('<div class="task"></div>');
                var $el = $('#container').children().last();
                $el.append('<h2>' + task.task_name + '</h2>');
                $el.append('<label><input type="checkbox" value="FALSE">Complete</label>' +
                    '<button id="delete-data">Delete</button>');
            });
        }
    });
}


function showComplete(){
    $(this).toggleClass('highLight');
}