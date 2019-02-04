var arr = []

// set API Gateway URL
var url_get_list = "https://{restapi_id}.execute-api.{region}.amazonaws.com/{stage_name}/";
var url_register = "https://{restapi_id}.execute-api.{region}.amazonaws.com/{stage_name}/";
var url_delete = "https://{restapi_id}.execute-api.{region}.amazonaws.com/{stage_name}/";

var task_max = 10;
var task_count = 0;

$(function () {
    // ページ読み込み時に実行する処理
    $(document).ready(function () {
        $.ajax({
            type: "POST",
            url: url_get_list,
            dataType: "json",
        }).done(function (data) {
            $("#errmsg_get_list").hide();
            if (data.Count) {
                task_count = data.Count;
            }
            data.Items.forEach(function (item) {
                $('#tb1').append('<tr><td>' + item.task + '</td><td><input type="checkbox" name="task[]" value ="' + item.task + '">');
            });
        }).fail(function () {
            $("#errmsg_get_list").show();
        })
    });

    // 送信ボタンをクリックしたときに実行
    $('#send').click(function () {
        if (task_count < task_max) {
            // テキストボックスに入力したテキストを変数に格納
            var addtext = $('#task').val();
            $.ajax({
                type: "POST",
                url: url_register,
                data: {
                    "task": $("#task").val()
                }
            }).done(function () {
                $("#errmsg_register").hide();
                $("#errmsg_register_over").hide();
                // appendで動的にチェックボックスを追加
                $('#tb1').append('<tr><td>' + addtext + '</td><td><input type="checkbox" name="task[]" value ="' + addtext + '">');
                task_count += 1;
            }).fail(function () {
                $("#errmsg_register").show();
            });
        } else {
            $("#errmsg_register_over").show();
        }
        // テキストボックスをクリア
        $('#task').val("");
    });

    // チェックボックスをチェックしたら実行
    $(document).on('change', 'input[name="task[]"]', function () {
        $.ajax({
            type: "POST",
            url: url_delete,
            data: {
                "task": $('input[name="task[]"]:checked').val()
            }
        }).done(function () {
            $("#errmsg_delete").hide();
            // チェックされた行を削除
            $('input[name="task[]"]:checked').parents('tr').remove();
            task_count -= 1;
        }).fail(function () {
            $("#errmsg_delete").show();
        });
    });
});