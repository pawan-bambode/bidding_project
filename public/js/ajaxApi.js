function ajaxApi(obj) {
    return $.ajax({
        type: obj.type,
        url: obj.url,
        data: obj.data,
        beforeSend: function () {
            $(".modal-loader").removeClass('d-none')
        },
        success: data => {
            return data
        },
        complete: function () {
            $(".modal-loader").addClass('d-none')
        },
        showSuccess(result) {
        },
        error: err => {
            return err
        },
        dataType: obj.dataType
    });
}





