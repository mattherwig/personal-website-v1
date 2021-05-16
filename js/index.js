const StickyClassName = 'sticky';

const body = $('body');
const navbar = $('nav')[0];
const quickDetailPanel = $('#quick-detail-panel');

const navbarClassList = navbar.classList;
const navbarOriginalOffset = navbar.offsetTop;

let skillsChart;

Chart.defaults.defaultFontFamily = 'Montserrat';
Chart.defaults.defaultFontColor = '#3B4048';

const ChartBackgroundColors = ['#b7aa9f', '#3b4048', '#ab9a93', '#3b4048', '#4d525a', '#dee4ec', '#4b4b55', '#60656e', '#5c5761', '#747981', '#6d636c', '#888d96', '#7e7076'];

/**
 * ------------------------------------------------------------------------
 * 				LISTENER METHODS
 * ------------------------------------------------------------------------
 */

$(document).ready(function () {
	printWelcomeMessage()
	loadSkillsTable();
	loadSkillsChart();
	updateStickyNavbar();
});

$(document).scroll(function () {
	updateAboutPanel();
	updateStickyNavbar();
});

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

$('#skills #skills-chart').mouseleave(function() {
	getActiveSkills().removeClass('active');
});

$('#skills .nav-link').click(function() {
	setTimeout(() => updateSkillsChart(), 100);
});

$('#skills').on('mouseenter', '.skill', function() {
	$(this).addClass('active');
	skillsChart.setActiveElements([{ datasetIndex: 0, index: $(this).data('index') }]);
	skillsChart.render();
});

$('#skills').on('mouseleave', '.skill', function() {
	getActiveSkills().removeClass('active');
	skillsChart.setActiveElements([]);
	skillsChart.render();
});

// @note Fixes Bootstrap scrolling issues
// @link https://stackoverflow.com/questions/49331572/offset-scroll-anchor-in-html-with-bootstrap-4-fixed-navbar/49331692;
$('.navbar .nav-link').click(function(){    
	const divId = $(this).attr('href');
	$('html, body').animate({ scrollTop: $(divId).offset().top - 54 }, 100);
});

/**
 * ------------------------------------------------------------------------
 * 				HELPER METHODS
 * ------------------------------------------------------------------------
 */

const printWelcomeMessage = () => console.log(`Thanks for checking out my website!`);

const updateStickyNavbar = () => {
	if (window.pageYOffset > navbarOriginalOffset && !navbarClassList.contains(StickyClassName)) {
		navbarClassList.add(StickyClassName);
		body.css('margin-top', '57px'); // This will fill the gap when the navbar sticks to the top of the screen.
	} else if (window.pageYOffset < navbarOriginalOffset && navbarClassList.contains(StickyClassName)) {
		navbarClassList.remove(StickyClassName);
		body.css('margin-top', '0px');
	}
};

const updateAboutPanel = () => {
	if (window.innerWidth < 992) return;

	const percentUnadjusted = (((window.pageYOffset - navbarOriginalOffset) / navbarOriginalOffset) * 100) + 110;
	const percent = Math.max(58, Math.min(100, percentUnadjusted));
	quickDetailPanel.css('width', percent + '%');
};

const loadSkillsTable = () => {
	Object.entries(skills).forEach(([category, categorySkills]) => {
		const totalLevels = categorySkills.reduce((agg, { level }) => agg + level, 0);
		categorySkills.forEach(({ label, level }, index) => {
			const percentage = Math.floor((level / totalLevels) * 100);
			const skillElement = `<span class="skill" data-${category}='${label}' data-percentage='${percentage}' data-index='${index}'>${label}</span>`;
			$(`#skills .tab-pane[data-category='${category}']`).append(skillElement);
		});
	});
};

const loadSkillsChart = () => {
	const category = getActiveSkillCategory(),
				labels = skills[category].map(({ label }) => label),
				data = skills[category].map(({ level }) => level);
	
	const dataset = {
		data: data,
		backgroundColor: ChartBackgroundColors,
		hoverOffset: 15,
		cutout: '65%'
	};
	skillsChart = new Chart($('#skills-chart')[0].getContext('2d'), {
		type: 'doughnut',
		data: { labels: labels, datasets: [dataset] },
		options: {
			responsive: true,
			layout: { padding: 15 },
			animation: { easing: 'easeInOutCubic' },
			plugins: {
				legend: { display: false },
				tooltip: {
					filter: function (tooltipItem, data) {
						getActiveSkills().removeClass('active');
						const categoryElement = $('#skills').find(`[data-${getActiveSkillCategory()}='${tooltipItem.label}']`).first();
						categoryElement.addClass('active');
						return false;
					},
				},
				doughnutlabel: {
					labels: [
						{ text: getActiveSkillCurrentPercentage, font: { size: '40', family: 'Montserrat-Black' } },
						{ text: getActiveSkillCurrent, font: { size: '15' } }
					]
				}
			},
		},
	});
};

const updateSkillsChart = () => {
	const category = getActiveSkillCategory(),
				categorySkills = skills[category];
	
	skillsChart.data.labels = categorySkills.map(({ label }) => label);
	skillsChart.data.datasets[0].data = categorySkills.map(({ level }) => level);
	skillsChart.update();
};

const getActiveSkillCategory = () => $('#skills .nav-link.active').data('category');

const getActiveSkills = () => $('#skills .skill.active');

const getActiveSkillCurrent = () => getActiveSkills().first().data(getActiveSkillCategory()) || '';

const getActiveSkillCurrentPercentage = () => (getActiveSkills().first().data('percentage') || '100') + '%';
