const StickyClassName = 'sticky';

const body = $('body');
const navbar = $('nav')[0];
const quickDetailPanel = $('#quick-detail-panel');

const navbarClassList = navbar.classList;
const navbarOriginalOffset = navbar.offsetTop;

window.onload = function () {
	console.log(`
		Hey! Gonna be honest, if you are looking at this... 
		there is much to improve, but hey, this doesn\'t pay
		the bills... Anyways, thanks for checking out my
		website!
	`);

	var ctx = document.getElementById('skills-chart').getContext('2d');
	var myChart = new Chart(ctx, {
		type: 'doughnut',
		data: {
			labels: ['Java', 'Scala', 'HTML5', 'CSS3', 'JavaScript', 'Python', 'SQL', 'C', 'C++', 'C#', 'Apex', 'Visualforce', 'Aura Components', 'Lightning Web Components'],
			datasets: [{
				label: 'Skills',
				data: [30, 20, 20, 10, 10, 20, 4, 4, 4, 4, 4, 4, 4],
				borderRadius: 0,
				backgroundColor: ['#b7aa9f', '#3b4048', '#ab9a93', '#3b4048', '#4d525a', '#dee4ec', '#4b4b55', '#60656e', '#5c5761', '#747981', '#6d636c', '#888d96', '#7e7076'],
				hoverOffset: 10
			}]
		},
		options: {
			responsive: true,
			maintainAspectRatio: false,
			layout: { padding: 10 },
			plugins: {
				legend: { display: false },
				tooltip: {
					filter: function (tooltipItem, data) {
						$('#skills .skill.active').removeClass('active');
						const languageElement = $('#skills').find(`[data-language='${tooltipItem.label}']`).first();
						languageElement.addClass('active');
						return false;
					},
				}
			},
		}
	});
	updateStickyNavbar();
}

window.onscroll = function () {
	updateAboutPanel();
	updateStickyNavbar();
};

function updateStickyNavbar() {
	if (window.pageYOffset > navbarOriginalOffset && !navbarClassList.contains(StickyClassName)) {
		navbarClassList.add(StickyClassName);
		// This will fill the gap when the navbar sticks to the top of the screen.
		body.css('margin-top', '57px');
	} else if (window.pageYOffset < navbarOriginalOffset && navbarClassList.contains(StickyClassName)) {
		navbarClassList.remove(StickyClassName);
		body.css('margin-top', '0px');
	}
}

function updateAboutPanel() {
	if (window.innerWidth < 992) return;

	const percentUnadjusted = (((window.pageYOffset - navbarOriginalOffset) / navbarOriginalOffset) * 100) + 110;
	const percent = Math.max(58, Math.min(100, percentUnadjusted));
	quickDetailPanel.css('width', percent + '%');
}

$('#experiences .expander').click(function () {
	$('#experiences .event-hidden').each(function () { $(this).slideToggle(); });
	$('#experiences .expander .expander-container').toggleClass('fa-flip-vertical');
});

$('#education .certification').hover(function () {
	$(this).find('.detail .front').hide();
	$(this).find('.detail .back').show();
}, function () {
	$(this).find('.detail .front').show();
	$(this).find('.detail .back').hide();
});

$("#skills #skills-chart").mouseleave(function() {
	$('#skills .skill.active').removeClass('active');
});

// @note Fixes Bootstrap scrolling issues
// @link https://stackoverflow.com/questions/49331572/offset-scroll-anchor-in-html-with-bootstrap-4-fixed-navbar/49331692
var divId;
$('.navbar .nav-link').click(function(){    
	divId = $(this).attr('href');
	$('html, body').animate({
	scrollTop: $(divId).offset().top - 54
}, 100);
});