$(document).ready(function () {
    $('.js--check-item').on('click', function () {
        var block = $(this).closest('.items-list--el');

        if (!(block.hasClass('disabled'))) {
            block.toggleClass('choiced').addClass('hover');
        }

        return false;
    });

    $('.items-list--el').on('mouseleave', function () {
        $(this).removeClass('hover');
    });
});