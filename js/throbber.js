/*
The MIT License (MIT)

Copyright (c) 2015 Jeroen van Warmerdam

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/
(function(){

	"use strict";

	var requestAnimFrame = (function(callback) {
		/// <summary>
		/// Cross browser animation frame;
		/// <summary>
		
		return	window.requestAnimationFrame || 
				window.webkitRequestAnimationFrame || 
				window.mozRequestAnimationFrame || 
				window.oRequestAnimationFrame || 
				window.msRequestAnimationFrame ||
				function(callback) {
					window.setTimeout(callback, 13);
				};
	})();

	function hexToRgb(hex) {
		/// <summary>
		/// Convert hex color to rgb color;
		/// <summary>
		
		hex = hex.replace("#", "").replace(/^([a-f\d])([a-f\d])([a-f\d])$/i, function(m, r, g, b) {
			return r + r + g + g + b + b;
		});
		
		var bigint = parseInt(hex, 16),
			r = (bigint >> 16) & 255,
			g = (bigint >> 8) & 255,
			b = bigint & 255;

		return [r, g, b].join(",");
	}
	
	var Throbber = function(){
		/// <summary>
		/// Throbber constructor;
		/// <summary>
		
		this.options = {
			width: 20,			// width of a line;
			height: 100,		// height of a line;
			offset: 100,		// offset from line to middle point;
			color: "#000000",	// color of the lines, can be hex short ("#0F0") and long ("#00FF00") or rgb ("0, 255, 0") (no alpha);
			count: 14,			// number of lines;
			interval: 100,		// interval speed (milliseconds);
			clockwise: true		// direction of the animation (true = clockwise, false = counter clockwise);
		};
	};

	Throbber.prototype.appendTo = function(elem){
		/// <summary>
		/// Append to canvas element;
		/// <summary>
		
		if(elem && elem.tagName.toUpperCase() === "CANVAS"){
			this.canvas = elem;
			
			if(elem.getContext){
				this.ctx = elem.getContext("2d");
				
				if(!this.options.count){
					this.options.count = Math.min(14, Math.min(this.canvas.width, this.canvas.height) / 2 + 4);
				}
			}
		}
		return this;
	}
	
	Throbber.prototype.draw = function(){
		/// <summary>
		/// Start drawing the trobber;
		/// <summary>
		
		if(!this.canvas || !this.ctx) return this;

		var that = this,
			indexer = 0,
			timer = new Date().getTime();
	
		// center to the canvas;
		that.ctx.translate(that.canvas.width / 2, that.canvas.height / 2);

		// draw sprite;
		function addSprite(c){
			var halfWidth = that.options.width / 2;
			
			// top arc;
			that.ctx.beginPath();
			that.ctx.arc(0, that.options.offset + Math.max(halfWidth, that.options.height - halfWidth), halfWidth, 0, Math.PI, false);
			//that.ctx.strokeStyle = c;
			//that.ctx.stroke();
			that.ctx.fillStyle = c;
			that.ctx.fill();

			// middle rect;
			that.ctx.fillStyle = c;
			that.ctx.fillRect( -halfWidth, that.options.offset + halfWidth, that.options.width, Math.max(0, that.options.height - that.options.width));
			//that.ctx.strokeStyle = c;
			//that.ctx.strokeRect( -halfWidth, that.options.offset + halfWidth, that.options.width, Math.max(0, that.options.height - that.options.width));

			// bottom arc;
			that.ctx.beginPath();
			that.ctx.arc(0, that.options.offset + halfWidth, halfWidth, 0, Math.PI, true);
			//that.ctx.strokeStyle = c;
			//that.ctx.stroke();
			that.ctx.fillStyle = c;
			that.ctx.fill();
		}

		// draw again;
		function draw(){
			
			// clear canvas context;
			that.ctx.clearRect(-that.canvas.width / 2, -that.canvas.height / 2, that.canvas.width, that.canvas.height);
			
			// update alpha;
			var now = new Date().getTime();
			if(now - timer > that.options.interval){
				indexer = ++indexer % that.options.count;
				timer = now;
			}
			
			// draw all lines;
			var alpha,
				rgba,
				radians = (that.options.clockwise ? -2 : 2) * Math.PI,
				rgb = /^#/.test(that.options.color) ? hexToRgb(that.options.color) : that.options.color;
			for(var i = 0; i < that.options.count; i++){
				alpha = 1 / that.options.count * (that.options.count - ((indexer + i) % that.options.count));
				rgba = "rgba(" + rgb + "," + alpha + ")";

				addSprite(rgba);
				that.ctx.rotate(radians / that.options.count);
			}

			// let the browser update as fast as possible;
			requestAnimFrame(function() {
				draw();
			});
		}
			 
		draw();

		return this;
	}

	// public global;
	window.Throbber = Throbber;
	
})();
