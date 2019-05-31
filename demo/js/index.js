// HELPER FUNCTIONS

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

Element.prototype.on = function(event, handler) {
	this.addEventListener(event, handler);
};
Element.prototype.addClass = function() {
	this.classList.add(...arguments);
};
Element.prototype.removeClass = function() {
	this.classList.remove(...arguments);
};

const configRipple = () => {
	const entries = Object.entries(config);
	for (const entry of entries) {
		Ripple[entry[0]] = entry[1];
	}
};

let Ripple = new MatRipple();
$('.item').appendChild(Ripple);

let config = {};

// UI STUFF
let underlineInputs = $$('.js__underline input');
for (const input of underlineInputs) {
	input.on('focus', function() {
		input.labels[0].addClass('filled', 'focused');
	});

	input.on('blur', function() {
		input.labels[0].removeClass('focused');
		if (this.value === '') {
			input.labels[0].removeClass('filled');
		}
	});
}

// RIPPLE STUFF
let checkboxInputs = $$('.js__checkbox input');
for (const input of checkboxInputs) {
	input.on('change', function() {
		config[input.id] = input.checked;
		configRipple();
	});
}

for (const input of underlineInputs) {
	input.on('input', function() {
		// COLOR
		if (this.id === 'color') {
			if (this.value.length) {
				config[this.id] = this.value;
			} else {
				config[this.id] = `rgba(0,0,0,.2)`;
			}
		}

		// RADIUS
		if (this.id === 'radius') {
			let value = Number(this.value);
			if (value > 0) {
				config[this.id] = value;
			} else {
				config[this.id] = 0;
			}
		}
		configRipple();
	});
}
