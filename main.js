"use strict";

function init() {
	let canvas = document.querySelector('#glViewport');
	let gl = canvas.getContext('webgl');

	if (!gl) return;

	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;

	gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);


	let verticies = [
		 1.0,  1.0, 0.0,
		-1.0,  1.0, 0.0,
		-1.0, -1.0, 0.0,
		 1.0, -1.0, 0.0,
	], indices = [0, 1, 2, 2, 3, 0];


	let shaderSource = document.querySelector('#vertex-shader').innerHTML;
	let vertexShader = gl.createShader(gl.VERTEX_SHADER);
	gl.shaderSource(vertexShader, shaderSource);
	gl.compileShader(vertexShader);

	shaderSource = document.querySelector('#fragment-shader').innerHTML;
	let fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
	gl.shaderSource(fragmentShader, shaderSource);
	gl.compileShader(fragmentShader);

	let shaderProgram = gl.createProgram();
	gl.attachShader(shaderProgram, vertexShader);
	gl.attachShader(shaderProgram, fragmentShader);
	gl.linkProgram(shaderProgram);

	gl.detachShader(shaderProgram, vertexShader);
	gl.detachShader(shaderProgram, fragmentShader);
	gl.deleteShader(vertexShader);
	gl.deleteShader(fragmentShader);

	if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
		console.log("Unable to initialize the shader program.");
		return;
	}

	const vbo = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verticies), gl.STATIC_DRAW);

	const ebo = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ebo);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);

	gl.useProgram(shaderProgram);

	let a_Position = gl.getAttribLocation(shaderProgram, 'a_Position');
	let a_Color = gl.getAttribLocation(shaderProgram, 'a_Color');

	gl.clearColor(0.0, 0.0, 0.0, 1.0);
	gl.clear(gl.COLOR_BUFFER_BIT);

	gl.enableVertexAttribArray(a_Position);
	//gl.enableVertexAttribArray(a_Color);

	gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
	gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);
//	gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, 4 * (3 + 3), 4 * 3);

	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ebo);

	gl.uniform1f(gl.getUniformLocation(shaderProgram,'u_resX'), canvas.width);
	gl.uniform1f(gl.getUniformLocation(shaderProgram,'u_resY'), canvas.height);

	let radius = 0;
	let s_time = Date.now(), e_time = 0.0;
	setInterval(function() {
		e_time = (Date.now() - s_time) / 1000;

		if (0.17 > radius) {
			radius = Math.sin(0.17 * e_time * 4.0) * 0.2;
			console.log(radius);
			gl.uniform1f(gl.getUniformLocation(shaderProgram,'u_radius'), radius);
		}
		gl.uniform1f(gl.getUniformLocation(shaderProgram,'u_time'), e_time);
		gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
	}, 1000/60);
}

document.addEventListener('DOMContentLoaded', init);