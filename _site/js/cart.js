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

var GR = GR || {};

GR.Cart = (function(_$) {
    var $ = _$;

    function Cart() {
        this.init();
    }

    Cart.prototype = {
        data: { items: [] },
        customId: '', // used in the custom field of the paypal order, required for IPN tracking, maps to unique id in db for cart
        init: function() {
            if ( ! $.cookie('GR.MyCart') ) {
                $.cookie('GR.MyCart');
            } else {
                this.data = $.parseJSON( $.cookie('GR.MyCart') );
            }
        },

        addItem: function( item ) {
            item.qty = 1;
            this.data.items.push( item );
        },

        removeItem: function( item_id ) {
            this.data.items.splice( item_id, 1 );
        },

        removeAll: function() {
            this.data.items = [];
        },

        save: function() {
            $.cookie('GR.MyCart', JSON.stringify( this.data ), { path: '/' });
        },

        // generate this dynamically because counting has to start at 1 and we might modify the cart before submitting
        hiddenInputHtml: function() {
            var hiddens = '', i;

            for (i = 1; i <= this.data.items.length; i++) {
                hiddens += "<input class='gr_item_" + i + "' type='hidden' name='item_name_" + i + "' value='" + this.data.items[i-1].title + "'>";
                hiddens += "<input class='gr_item_" + i + "' type='hidden' name='amount_" + i + "' value='" + this.data.items[i-1].price + "'>";
                hiddens += "<input class='gr_item_" + i + "' type='hidden' name='shipping_" + i + "' value='0.00'>";
            }

            hiddens += "<input type='hidden' name='custom' value='" + this.customId + "'>";

            return hiddens;
        }
    }

    return Cart;
})(jQuery);

GR.MyCart = new GR.Cart();

