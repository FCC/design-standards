'use strict';
(function() {

    /*
     * Link to external site alert
     */
    function extLinks(e) {
        var alertText = 'You are about to leave the FCC website and visit a third-party, non-governmental website that the FCC does not maintain or control. The FCC does not endorse any product or service, and is not responsible for, nor can it guarantee the validity or timeliness of the content on the page you are about to visit. Additionally, the privacy policies of this third-party page may differ from those of the FCC.';

        var confirm = window.confirm(alertText);

        if (!confirm) {
            e.preventDefault();
        }
    }

    $('.link-ext').on('click', extLinks);

    /*
     * Add collapsible panel functionality
     */
    var collapseOne = $('#3collapseOne');
    var collapseTwo = $('#3collapseTwo');
    var collapseThree = $('#3collapseThree');
    $('#collapse-all').click(function() {
        collapseOne.collapse('hide');
        collapseTwo.collapse('hide');
        collapseThree.collapse('hide');
    });

    $('#expand-all').click(function() {
        collapseOne.collapse('show');
        collapseTwo.collapse('show');
        collapseThree.collapse('show');
    });

    /*
     * Setup sidebar active link
     */
    $('.docs-sidebar >.nav > li').each(function() {
        var navItem = $(this);
        if (navItem.find('a').attr('href') === location.pathname) {
            navItem.addClass('active');
        }
    });

    /*
     * Add subnav
     */
    var activeSubNav = $('.docs-sidebar > .nav > .active');
    var newList = $('<ul class="nav nav-stacked"></ul>');
    $('.pl-pattern > h3').each(function() {
        var el = $(this);
        if (el.attr('id')) {
            var li = $('<li><a href="#' + el.attr('id') + '">' + el.text() + '</a></li>');
            newList.append(li);

        }
    });
    if (newList.children().length) {
        activeSubNav.append(newList);
    }

    var autoCollapsed = false;
    $('.nav-collapse').on('click', function() {
        autoCollapsed = false;
        $('body').toggleClass('docs-collapsed-nav');
    });

    /* collapse sidebar when necessary */
    var checkNav = function() {
        var collapsed = $('body').hasClass('docs-collapsed-nav'),
            width = $(this).width();

        if (width <= 767 && !collapsed) {
            autoCollapsed = true;
            $('body').addClass('docs-collapsed-nav');
        } else if (width > 767 && autoCollapsed) {
            $('body').removeClass('docs-collapsed-nav');
        }
    };

    $(window).on('resize', checkNav);
    $(document).on('ready', checkNav);

    /*
     * Use bootstrap's scrollspy plugin to highlight subnav based on scroll position
     */
    $('body').scrollspy({ target: '.docs-sidebar > .nav > .active', offset: 120 });

    /* animate scrolling to the sidebar sublink targets to ensure proper offsets */
    $('.docs-sidebar > .nav > .active > .nav > li > a').on('click', function() {
        $('html, body').animate({
            scrollTop: $($(this).attr('href')).offset().top - 110
        }, 200);
    });


    /* enable masks */
    // $(':input').inputmask();

    /* select2 things */
    // $('.select2').select2({
    //     minimumResultsForSearch: 4
    // });

    /* enable tooltips */
    $('[data-toggle="tooltip"]').tooltip({ container: 'body', delay: { show: 200, hide: 0 } });

    /* enable datepickers */
    $('.datepicker').datepicker({
        // autoSize: true,
        // showButtonPanel: true,
        numberOfMonths: 1,
        showOtherMonths: true
            // changeMonth: true,
            // changeYear: true
    });

    /* find checkboxes with the indeterminate attr and set the indeterminate property */
    $('input[type="checkbox"][indeterminate]').each(function() {
        this.indeterminate = true;
    });


    /* closable toast examples */
    $('.pl-closable-toasts .toast .close').each(function() {
        $(this).on('click', function() {
            $(this).closest('.toast').animate({
                right: '-100%',
                opacity: 0
            }, 150, 'swing', function() {
                $(this).hide(150);
            });
        });
    });

    /* quick and dirty working toast examples */
    // $('.show-toasts').each(function () {
    //     var showToastButton = $(this);

    //     // get toasts and move to body
    //     var selector = showToastButton.attr('data-toast-target');
    //     var toastContainer = $(selector);
    //     toastContainer.hide();
    //     $(document.body).append(toastContainer);

    //     var closers = toastContainer.find('.close');
    //     var closersCount = closers.length;
    //     var closedCount = 0;
    //     closers.each(function () {
    //         $(this).on('click', function () {
    //             if (closersCount === ++closedCount) {
    //                 closedCount = 0;
    //                 setTimeout(function () {
    //                     toastContainer.hide();
    //                 }, 150);
    //             }
    //         });
    //     });

    //     var showToast = function (toastEl) {
    //         toastEl.css({right: '-100%', opacity: 0, display: 'block'});
    //         toastEl.animate({
    //             right: '0',
    //             opacity: 1
    //         }, 150, 'swing', function () {
    //             if (toastEl.next().length) {
    //                 setTimeout(function () {
    //                     showToast(toastEl.next());
    //                 }, 1000);
    //             }
    //         });
    //     };

    //     // show the toasts on click
    //     showToastButton.on('click', function() {
    //         toastContainer.find('.toast').hide().css({right: 0, opacity: 1});
    //         toastContainer.toggle();
    //         if (toastContainer.css('display') === 'block') {
    //             toastContainer.css({
    //                 position: 'fixed',
    //                 top: '42px',
    //                 right: '0px',
    //                 zIndex: '10000'
    //             });
    //             closedCount = 0;
    //             showToast($(toastContainer.find('.toast')[0]));
    //         }
    //     });
    // });

    $('.nav-stacked.nav-tree > li').each(function() {
        var self = $(this);
        var nested = $(this).find('> .nav-stacked');
        var expander = $(this).find('> .expander');
        expander.on('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            var visible = nested.is(':visible');
            expander.toggleClass('expanded', !visible);
            expander.toggleClass('collapsed', visible);

            nested.toggle(150);

            // remove any nested actives
            if (nested.find('li.active').length > 0) {
                nested.find('li.active').removeClass('active');
                self.addClass('active');
            }

            // collapse all expanded subtrees
            if (visible) {
                // nested.find('.expander').removeClass('expanded');
                // nested.find('.expander').addClass('collapsed');
                // nested.find('.nav-stacked').hide(250);
            }
        });
    });



    /* example progress bar */
    $('#exampleProgressBar').each(function() {
        var barEl = $(this);
        var valueEl = $('#exampleProgressBarValue');
        var progress = parseInt(this.style.width, 10);
        setInterval(function() {
            barEl.css('width', ((progress += 19) % 100) + '%');
            valueEl.text(progress % 100 + '%');
        }, 1000);
    });


    /* enable popovers */
    $('[data-toggle="popover"]').popover();


    /* enable noui sliders */
    $('[data-nouislider]').each(function() {
        var el = $(this);
        var opts = {
            range: {
                min: 0,
                max: 100
            },
            connect: 'lower'
        };

        if (el.attr('data-min')) {
            opts.range.min = parseInt(el.attr('data-min'), 10);
        }
        if (el.attr('data-max')) {
            opts.range.max = parseInt(el.attr('data-max'), 10);
        }
        if (el.attr('data-start')) {
            opts.start = parseInt(el.attr('data-start'), 10);
        }
        if (el.attr('data-start-b')) {
            opts.start = [parseInt(el.attr('data-start'), 10), parseInt(el.attr('data-start-b'), 10)];
            opts.connect = true;
            opts.behaviour = 'drag';
        }
        if (el.attr('data-step')) {
            opts.step = parseInt(el.attr('data-step'), 10);
        }

        el.noUiSlider(opts);

        if (el.attr('data-pips')) {
            el.noUiSlider_pips({
                mode: 'count',
                values: 6,
                density: 10
            });
        }

        if (el.attr('data-slider-tooltip')) {
            el.Link('lower').to('-inline-<div class="tooltip fade in top" style="top: -39px; transform: translateX(-50%); margin-left: 6px; display: inline-block; position: relative; width: auto;"></div>', function(value) {
                $(this).html(
                    '<div class="tooltip-inner">' + parseInt(value, 10) + '</div>' +
                    '<div class="tooltip-arrow"></div>'
                );
            });
        }

        if (el.attr('data-link-lower')) {
            el.Link('lower').to($(el.attr('data-link-lower')));
        }
        if (el.attr('data-link-upper')) {
            el.Link('upper').to($(el.attr('data-link-upper')));
        }
    });
    /* expandable rows */
    $('table[data-pl-expandable-rows] > tbody > tr').on('click', function() {
        var val = $(this).attr('aria-expanded') === 'true';
        $(this).attr('aria-expanded', !val);
        $(this).next('tr[data-pl-detail-row]').toggle();
    });


})();
