( function( $ ) {
	// Responsive videos
	var $all_videos = $( '.entry-content' ).find( 'iframe[src*="player.vimeo.com"], iframe[src*="youtube.com"], iframe[src*="youtube-nocookie.com"], iframe[src*="dailymotion.com"],iframe[src*="kickstarter.com"][src*="video.html"], object, embed' ),
		$window = $(window),
		$more_site = $( '#more-site' ),
		$card = $( '.title-card' ),
		window_height, window_width,
		is_rtl = ( $( 'body' ).hasClass( 'rtl' ) ) ? false : true;

	$all_videos.not( 'object object' ).each( function() {
		var $video = $(this);

		if ( $video.parents( 'object' ).length ) {
			return;
		}

		if ( ! $video.prop( 'id' ) ) {
			$video.attr( 'id', 'rvw' + Math.floor( Math.random() * 999999 ) );
		}

		$video
			.wrap( '<div class="responsive-video-wrapper" style="padding-top: ' + ( $video.attr( 'height' ) / $video.attr( 'width' ) * 100 ) + '%" />' )
			.removeAttr( 'height' )
			.removeAttr( 'width' );
	} );

	$( 'a[href="#"]' ).click( function(e) {
		e.preventDefault();
	} );

	// Shortcode
	if ( arcade_basic_vars.carousel ) {
		var autoplay = ( arcade_basic_vars.autoplay ) ? '' : 'pause';
		$( '.carousel' ).carousel( autoplay );
	}

	if ( arcade_basic_vars.tooltip ) {
		$( 'a[rel="tooltip"]' ).tooltip();
	}

	if ( arcade_basic_vars.tabs ) {
		$( '.nav-tabs a' ).click( function(e) {
			e.preventDefault();
			$(this).tab( 'show' );
		} );
	}

	$( '#site-navigation' ).find( '.dropdown-toggle' ).click( function(e) {
		e.preventDefault();

		$( '#site-navigation' ).find( 'li' ).not( $(this).parents() ).removeClass( 'open' );
		$(this).parent().toggleClass( 'open' );
	} );

    // Arc the site title
    if ( 0 != arcade_basic_vars.arc ) {
        $( '#site-title a' ).arctext( {
        	radius: arcade_basic_vars.arc,
        	rotate: is_rtl,
        	fitText	: arcade_basic_vars.fittext
        } );
    }

    // Set up jumbo header image
    if ( $card.length ) {
        $window
            .on( 'resize.title-card', function() {
                window_width = $window.width();
				window_height = ( $( 'body' ).hasClass( 'admin-bar' ) ) ? $window.height() - 32 : $window.height();
				if ( window_width < 599 || ! $( 'body' ).hasClass( 'home' ) || ( $( 'body' ).hasClass( 'home' ) && $( 'body' ).hasClass( 'paged' ) ) ) {
					$card.css( 'height', 300 );
					$more_site.removeData( 'scroll-to' ).attr( 'data-scroll-to', 300 );
				} else {
					$card.css( 'height', window_height );
					$more_site.removeData( 'scroll-to' ).attr( 'data-scroll-to', window_height );
				}
			} )
			.trigger( 'resize.title-card' )
			.scroll( function () {
				if ( $window.scrollTop() >= ( $more_site.data( 'scroll-to' ) - 50 ) ) {
					$( '#site-navigation' ).addClass( 'black' );
				} else {
					$( '#site-navigation' ).removeClass( 'black' );
				}
			} );

        $card.fillsize( '> img.header-img' );
	}

    // Scroll past jumbo header image
	$more_site.click( function() {
		$( 'html, body' ).animate( { scrollTop: ( $more_site.data( 'scroll-to' ) - 50 ) }, 'slow', 'swing' );
	} );
} )( jQuery );