$(function() {
    /*!
     * jQuery - .scrollTo()
     *
     *  Author:
     *  Timothy A. Perez
     *
     * Date: OCT 2012
     * Comments: Setting new web standards...
     */
    // .scrollTo - Plugin
    $.fn.scrollTo = function( target, options, callback ){
        if(typeof options == 'function' && arguments.length == 2){ callback = options; options = target; }
        var settings = $.extend({
            scrollTarget  : target,
            offsetTop     : 50,
            duration      : 500,
            easing        : 'swing'
        }, options);
        return this.each(function(){
            var scrollPane = $(this);
            var scrollTarget = (typeof settings.scrollTarget == "number") ? settings.scrollTarget : $(settings.scrollTarget);
            var scrollY = (typeof scrollTarget == "number") ? scrollTarget : scrollTarget.offset().top + scrollPane.scrollTop() - settings.offsetTop;
            scrollPane.animate({scrollTop : scrollY }, settings.duration, settings.easing, function(){
                if (typeof callback == 'function') { callback.call(this); }
            });
        });
    }
});