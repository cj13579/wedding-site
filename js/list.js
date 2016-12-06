/**
Copyright 2012 Sliverware Applications, Inc

This file is part of the WordPress Gift Registry Plugin.

WordPress Gift Registry Plugin is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

WordPress Gift Registry Plugin is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with WordPress Gift Registry Plugin.  If not, see <http://www.gnu.org/licenses/>.
*/


jQuery(document).ready(function ($) {

    $('button.gr_add_to_cart_btn').click(function( e ) {
        var item = $(this).data('item');

        GR.MyCart.addItem( item );
        GR.MyCart.save();

        addItemComplete( e );
    });

    $('button.gr_custom_add_to_cart_btn').click(function( e ) {
        var item = {
            title: $('#gr_custom_item_title').val(),
            price: $('#gr_custom_item_price').val().replace(/[^\d\.]/g,''),
            qty: 1
        };

        GR.MyCart.addItem( item );
        GR.MyCart.save();

        addItemComplete( e );
    });

    $('.gr-descr-hover').click( function( e ) {
        var descr = $('.gr_item_descr', $(this).closest('.gr_item_details'));

        e.preventDefault();
        e.stopPropagation();

        descr.toggle();

        $('body').bind('click', function( e ) {
            descr.toggle();
            $(this).unbind( e );
        });
    });

    function addItemComplete( e ) {
        if ( GR.Data.cartUrl ) {
            document.location = GR.Data.cartUrl;
        } else {
            GR.Alert("'" + item.title + "' successfully added to cart!");
        }

        e.stopPropagation();
        e.preventDefault();
    }

});