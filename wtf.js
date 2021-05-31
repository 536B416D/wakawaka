window.addEventListener('load', function(e) {

	var
			canvas	= document.getElementById('screen'),
			ctx			= canvas.getContext('2d');

	var CanvasWidth		= canvas.width 	= window.innerWidth;
	var CanvasHeight	= canvas.height = window.innerHeight;

	var sX = CanvasWidth / 2;
	var sY = CanvasHeight / 2;

	function GCD(a, b) {
		var t;
		while (b != 0) {
			t = b;
			b = a % t;
			a = t;
		}

		return a;
	}

	function Spirograph(x ,y) {
		this.init();
	};

	Spirograph.prototype = {
		constructor: Spirograph,

		init: function() {
			this.R = Math.random() * 100 + 50 | 0;
			this.r = Math.random() * 10 | 0;
			this.h = Math.random() * 100 | 0;
			this.X = Math.random() * CanvasWidth | 0;
			this.Y = Math.random() * CanvasHeight | 0;
			this.k = this.R - this.r;

			this.color = {
				r: Math.random() * 255 + 50,
				g: Math.random() * 255 + 50,
				b: Math.random() * 255 + 50,
				a: 1
			};
      
      			this.max = Math.abs(this.r)/GCD(Math.abs(this.R), Math.abs(this.r));
		},

		draw: function() {
			var x, y, r, g, b, t = 0;

			ctx.strokeStyle 	= `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${this.color.a})`;


			while (t / (Math.PI * 2) <= this.max) {
				x = this.k * Math.cos(t) + this.h * Math.cos(this.k * t / this.r);
				y = this.k * Math.sin(t) + this.h * Math.sin(this.k * t / this.r);

				ctx.beginPath();
				ctx.moveTo(this.X + x + 1, this.Y + y + 1);
				ctx.lineTo(this.X + x, this.Y + y);
				ctx.stroke();

				t += 0.1;
			}

		},

		update: function() {
			
			this.color.a -= 0.01;

			if (0 == (this.h = ++this.h % (this.R * 2))) {
				this.init();
			}


		}
	}

	var spiros = []; for (let i = 0; i < 10; i++) { spiros.push(new
	Spirograph()); }



	function draw() {
		ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
		ctx.fillRect(0, 0, CanvasWidth, CanvasHeight);

		spiros.forEach(e => {
			e.draw();
			e.update();
		});


		requestAnimationFrame(draw);

	}
  
	draw();
});
