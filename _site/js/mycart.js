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

    var $C = GR.Data.currency;

    $('#gr_cart_tbl a.gr_delete').click(function( e ) {
        var row = $(this).closest('tr'),
            item_id = parseInt( row.data('item_id') ),
            line_tot_amt = parseFloat($('.gr_tot', row).html().replace($C.symbol, '')),
            cart_tot = $('#gr_cart_total'),
            cart_tot_amt = parseFloat(cart_tot.html().replace($C.symbol, ''));

        cart_tot.html($C.symbol + (cart_tot_amt - line_tot_amt).toFixed(2));
        GR.MyCart.removeItem( item_id - 1 );
        GR.MyCart.save();
        row.fadeOut('slow', function() {
            var item_rows, inp, emptyRow;

            $(this).remove();
            
            item_rows = $('#gr_cart_tbl .gr_cart_item');
            if ( item_rows.length > 0 ) {
                // reset the names of the qty inputs and the row item_ids after a shift
                for (var i = 1; i <= item_rows.length; i++) {
                    $( item_rows[i-1] ).attr('data-item_id', i);
                    inp = $( 'input', item_rows[i-1] )[0].name = 'qauntity_' + i;
                }
            } else {
                emptyRow = $('<tr class="cart_empty"><td colspan="5">There are no items left in your cart</td></tr>');
                $('#gr_cart_tbl tr').first().after( emptyRow );
            }
        });


        e.stopPropagation();
        e.preventDefault();
    });

    $('#gr_clear_cart').click(function( e ) {
        var cart_items = $('#gr_cart_tbl .gr_cart_item'),
            len = cart_items.length,
            emptyRow = $('<tr class="cart_empty"><td colspan="5">There are no items left in your cart</td></tr>');
        
        GR.MyCart.removeAll();
        GR.MyCart.save();

        // remove all item rows from table, replace with a single row indicating there's nothing left in the cart
        cart_items.fadeOut('slow', function() {
            $(this).remove();
        });

        if ( len > 0 ) { // only add the empty row if the cart isn't already empty
            $('#gr_cart_tbl tr').first().after( emptyRow );
            $('#gr_cart_total').html( $C.symbol + '0.00' );
        }
    });

    function checkout( e ) {
        var data, wrap = $('#gr_cart_wrap');

        wrap.addClass('loading');

        data = { action: 'prepare_cart' };

        $.ajax({
            type: 'POST',
            url: GR.Data.ajaxUrl,
            data: data,
            success: function( data ) {
                try {
                    var response = GR.parseJSON( data ),
                        cartForm = $('#gr_cart_form');
                } catch ( ex ) {
                    GR.Alert(GR.Messages.error);
                    return;
                }

                GR.MyCart.customId = response.customId;

                $('[name=return]', cartForm).val( response.returnUrl );
                cartForm.append( GR.MyCart.hiddenInputHtml() );
                cartForm.submit();
            },
            error: function( jqXHR, textStatus, errorThrown ) {
                GR.Alert(GR.Messages.error, { error: true });
            }
        });
    }

    $('#gr_checkout').click( checkout );
    $('#gr_test_checkout_button').click( checkout );

    function qtyChanged( e ) {
        updateCartTotal( $(this) );
    }

    function updateCartTotal( qtyInput ) {
        var row = qtyInput.closest('tr'),
            line_tot = $('.gr_tot', row),
            cur_line_tot = parseFloat(line_tot.html().replace($C.symbol, '')),
            line_each = parseFloat($('.gr_each', row).html().replace($C.symbol, '')),
            new_line_tot = qtyInput.val() * line_each,
            cart_tot = $('#gr_cart_total'),
            delta = new_line_tot - cur_line_tot,
            item_id = row.data('item_id') - 1; // -1 to get the index, paypal cart items start at 1

        // reset qty to 1 if non-numeric is entered
        if ( qtyInput.val().match(/[^\d]/g) ) {
            qtyInput.val(1);
            new_line_tot = line_each;
            delta = new_line_tot - cur_line_tot;
        }

        line_tot.html($C.symbol + new_line_tot.toFixed(2) );
        cart_tot.html($C.symbol + ( parseFloat(cart_tot.html().replace($C.symbol, '')) + delta ).toFixed(2) );

        GR.MyCart.data.items[item_id].qty = qtyInput.val();
        GR.MyCart.save();
    }

    $('.gr_incr').click(function( e ) {
        var incrButton = $(this),
            qty_input = $('.gr_qty', incrButton.closest('td')),
            qty = parseInt(qty_input.val());

        if ( incrButton.hasClass('gr_plus') ) {
            qty++;
        } else if ( incrButton.hasClass('gr_minus') && qty > 1 ) {
            qty--;
        }

        qty_input.val(qty);
        updateCartTotal( qty_input );
    });

    var gr_qty = $('input.gr_qty');

    gr_qty.change( qtyChanged );
    gr_qty.focus(function() {
        $('#gr_cart_wrap').addClass('editing');
    }).blur(function() {
        $('#gr_cart_wrap').removeClass('editing');
    });

    if ( gr_qty[0] && typeof gr_qty[0].oninput != 'undefined' ) {
        gr_qty.bind('input', qtyChanged );
    }
});
