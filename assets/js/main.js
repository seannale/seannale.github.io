/*
	Strata by HTML5 UP
	html5up.net | @ajlkn
	Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)
*/

(function($) {

	var $window = $(window),
		$body = $('body'),
		$header = $('#header'),
		$footer = $('#footer'),
		$main = $('#main'),
		settings = {

			// Parallax background effect?
				parallax: true,

			// Parallax factor (lower = more intense, higher = less intense).
				parallaxFactor: 20

		};

	// Breakpoints.
		breakpoints({
			xlarge:  [ '1281px',  '1800px' ],
			large:   [ '981px',   '1280px' ],
			medium:  [ '737px',   '980px'  ],
			small:   [ '481px',   '736px'  ],
			xsmall:  [ null,      '480px'  ],
		});

	// Play initial animations on page load.
		$window.on('load', function() {
			window.setTimeout(function() {
				$body.removeClass('is-preload');
			}, 100);
		});

	// Touch?
		if (browser.mobile) {

			// Turn on touch mode.
				$body.addClass('is-touch');

			// Height fix (mostly for iOS).
				window.setTimeout(function() {
					$window.scrollTop($window.scrollTop() + 1);
				}, 0);

		}

	// Footer.
		breakpoints.on('<=medium', function() {
			$footer.insertAfter($main);
		});

		breakpoints.on('>medium', function() {
			$footer.appendTo($header);
		});

	// Header.

		// Parallax background.

			// Disable parallax on IE (smooth scrolling is jerky), and on mobile platforms (= better performance).
				if (browser.name == 'ie'
				||	browser.mobile)
					settings.parallax = false;

			if (settings.parallax) {

				breakpoints.on('<=medium', function() {

					$window.off('scroll.strata_parallax');
					$header.css('background-position', '');

				});

				breakpoints.on('>medium', function() {

					$header.css('background-position', 'left 0px');

					$window.on('scroll.strata_parallax', function() {
						$header.css('background-position', 'left ' + (-1 * (parseInt($window.scrollTop()) / settings.parallaxFactor)) + 'px');
					});

				});

				$window.on('load', function() {
					$window.triggerHandler('scroll');
				});

			}

	// Main Sections: Two.

		// Lightbox gallery.
			$window.on('load', function() {

				// Initialize poptrox per project so arrows only cycle images inside the clicked .work-item.
				$('.work-item').poptrox({
					caption: function($a) {
						return $a.data('caption')
							|| $a.find('img').attr('title')
							|| $a.closest('.work-item').find('h3').text()
							|| '';
					},
					overlayColor: '#2c2c2c',
					overlayOpacity: 0.85,
					popupCloserText: '',
					popupLoaderText: '',
					selector: 'a.image',
					usePopupCaption: true,
					usePopupDefaultStyling: false,
					usePopupEasyClose: false,
					usePopupNav: true,
					windowMargin: (breakpoints.active('<=small') ? 0 : 50)
				});

				// Project description modal (created once, reused). Accessible + keyboard-close (ESC).
				if (!$('#project-modal').length) {
					$('body').append('\n\t\t\t\t<div id="project-modal" class="project-modal" aria-hidden="true">' +
						'<div class="project-modal__overlay" data-close></div>' +
						'<div class="project-modal__panel" role="dialog" aria-modal="true" aria-labelledby="project-modal-title">' +
							'<button class="project-modal__close" aria-label="Close">&times;</button>' +
							'<h3 id="project-modal-title" class="project-modal__title"></h3>' +
							'<div class="project-modal__body"></div>' +
						'</div>' +
					'</div>\n');
				}

				// Open modal when Details button is clicked (delegated)
				$(document).on('click', '.project-details', function(e) {
					e.preventDefault();
					var $btn = $(this);
					var $article = $btn.closest('.work-item');
					var title = $article.find('h3').first().text() || '';
					// Prefer explicit .project-desc (HTML), then data-desc, then visible paragraph summary.
				var $rawDesc = $article.find('.project-desc').first();
				var desc = '';
				if ($rawDesc.length) {
					// clone so we don't mutate the DOM; strip action buttons/links for modal-only view
					var $descClone = $rawDesc.clone();
					$descClone.find('a.button, .button').remove();
					desc = $descClone.html() || '';
				}
				desc = desc || $article.data('desc') || $article.find('p').first().html() || '<p>No description available.</p>';
					$('#project-modal .project-modal__title').text(title);
					$('#project-modal .project-modal__body').html(desc);
					$('#project-modal').attr('aria-hidden', 'false').addClass('visible');
					$('body').addClass('project-modal-open');
					// save trigger to restore focus later
					$btn.data('project-modal-trigger', true);
					$('#project-modal .project-modal__close').focus();
				});

				// Close handlers (overlay, close button, ESC)
				$(document).on('click', '#project-modal .project-modal__close, #project-modal .project-modal__overlay', function(e) {
					e.preventDefault();
					$('#project-modal').attr('aria-hidden', 'true').removeClass('visible');
					$('body').removeClass('project-modal-open');
					var $trigger = $('.project-details').filter(function(){ return $(this).data('project-modal-trigger'); }).first();
					if ($trigger.length) { $trigger.focus().removeData('project-modal-trigger'); }
				});

				$(document).on('keydown', function(e) {
					if (e.key === 'Escape' && $('#project-modal').hasClass('visible')) {
						e.preventDefault();
						$('#project-modal .project-modal__close').trigger('click');
					}
				});

			});

})(jQuery);