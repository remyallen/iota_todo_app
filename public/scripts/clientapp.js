$(document).ready(function() {

    getData();

    $('#post-data').on('click', postData);

    $('#container').on('change', '.task', showComplete);

    $('#container').on('click', '.delete-data', deleteData);


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
                // Because we're putting the id on the DOM, it must be a valid attribute and follow this format:
                // data-type=""
                // This is fixed to concatenate a proper string with the id value
                $('#container').append('<div class="task" data-type="' + task.id + '"></div>');
                var $el = $('#container').children().last();
                $el.append('<h2>' + task.task_name + '</h2>');
                // The checkbox here is unnecessary unless you really want to allow deleting multiple
                // tasks, which is rather tricky to do. I'd skip it.
                $el.append('<label><input type="checkbox">Complete</label>' +
                    '<button class="delete-data">Delete</button>');
            });
        }
    });
}


function showComplete(){
    event.preventDefault();

    $(this).toggleClass('highLight');

    var values = {};
    values.type = $(this).parent().data('type');

    console.log(values);

    $.ajax({
        type: 'POST',
        url: '/complete',
        data: values,
        success: function(data) {
            if(data) {
                // everything went ok
                console.log('from server:', data);
            } else {
                console.log('error');
            }
        }
    });
}


function deleteData(){
    event.preventDefault();
    console.log('here');

    var values = {};
    //attempt on targeting out the task.id from line 53
    values.type = $(this).parent().data('type');
    // There is no form to strip of values, so the $.each stuff is not needed.
    //$.each($(this).serializeArray(), function(i, field) {
    //    values[field.name] = field.value;
    //});
    console.log(values);

    // POST works but type of DELETE is more accurate here. We'll go over this on Monday.
    $.ajax({
        type: 'DELETE',
        url: '/delete',
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

    $(this).parent().remove();
}
