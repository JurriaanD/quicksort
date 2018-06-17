let list = new Array(20);
let lookup = [];
let unitW, unitH;
let slider;
const offset = 50;

function setup() {
	createCanvas(windowWidth, windowHeight);

	slider = createSlider(0.3, 2, 1, 0.1);
	slider.style('width', '200px');
	slider.style('direction', 'rtl');
	slider.position(width/2 - 100, 10);
	slider.elt.title = "Speed";

	unitW = (width-2*offset) / list.length;
	unitH = height / list.length;

	list = list.fill().map(() => Math.random());
	let sortedList = list.slice().sort();
	for (let i = 0; i < sortedList.length; i++) {
		lookup[sortedList[i]] = i;
	}

	strokeWeight(2);
	textSize(20);
	textAlign(CENTER, TOP);
	
	noLoop();

	quicksort(list).then(() => cleanAnimation());
}

function draw() {}

function swap(list, i, j) {
	let temp = list[i];
	list[i] = list[j];
	list[j] = temp;
}

async function quicksort(list, low, high) {
	if (typeof low == "undefined") {low = 0; high = list.length-1;}	
	if (low >= high){return Promise.resolve("instantly");}

	let pivotIndex = await pivot(list, low, high);
	await quicksort(list, low, pivotIndex-1);
	await sleep(500*slider.value());
	await quicksort(list, pivotIndex+1, high);
	return sleep(500*slider.value());
}

async function pivot(list, low, high) {
	let pivot = list[low];
	let i = low;
	let j = high+1;

	await animatePivot(list, low, high);
	while(i < j) {
		while(list[++i] < pivot && i != high){await visualize(list, low, high, i, j);}
		await visualize(list, low, high, i, j);
		await blink(list, i);
		while(list[--j] >= pivot && j != low){await visualize(list, low, high, i, j);}
		await visualize(list, low, high, i, j);
		await blink(list, j);
		if (i<j){await animateSwap(list, low, high, low, i, j); swap(list, i, j);}
	}
	if (j!=low) {
		await animateUberSwap(list, low, high, j);
		swap(list, low, j);
	}
	return Promise.resolve(j);
}

async function visualize(list, low, high, i, j) {
	background(0);
	for (let a = 0; a < list.length; a++) {
		if (low <= a && a <= high) {
			stroke(0, 255, 0);
			fill(0, 255, 0);
		} else {
			stroke(255, 255, 255, 55);
			fill(255, 255, 255, 55);
		}
		ellipse(a*unitW + offset, height/2, getR(a), getR(a));			
	}

	j = Math.min(j, high);
	stroke(255);
	fill(255);
	ellipse(offset + i*unitW, getPivotH(), getR(low), getR(low));
	ellipse(offset + j*unitW, getPivotH(), getR(low), getR(low));

	
	return sleep(500*slider.value());
}

async function animatePivot(list, low, high) {
	const frames = (high-low);
	for (let l = 1; l <= frames; l++) {
		background(0);
		for (let a = 0; a < list.length; a++) {
			if (low <= a && a <= high) {
				stroke(0, 255, 0);
				fill(0, 255, 0);
			} else {
				stroke(255, 255, 255, 55);
				fill(255, 255, 255, 55);
			}
			ellipse(a*unitW + offset, height/2, getR(a), getR(a));					
		}

		let deltaX1 = l/frames * unitW;
		let deltaY = l/frames * 3 * getR(list.length-1);
		let deltaX2 = l/frames * (high-low) * unitW;

		fill(255);
		stroke(255);
		ellipse(low*unitW + offset + deltaX1, height/2 + deltaY, getR(low), getR(low));
		ellipse(low*unitW + offset + deltaX2, height/2 + deltaY, getR(low), getR(low));

		await sleep(100*slider.value());
	}
	return sleep(500*slider.value());
}

async function animateSwap(list, low, high, pivot, i, j) {
	function drawPlebs() {
		background(0);
		for (let a = 0; a < list.length; a++) {
			if (a != i && a != j) {
				if (low <= a && a <= high) {
					stroke(0, 255, 0);
					fill(0, 255, 0);
				} else {
					stroke(255, 255, 255, 55);
					fill(255, 255, 255, 55);
				}
				ellipse(a*unitW + offset, height/2, getR(a), getR(a));			
			}
		}

		fill(255);
		stroke(255);
		ellipse(offset + i*unitW, getPivotH(), getR(pivot), getR(pivot));
		ellipse(offset + j*unitW, getPivotH(), getR(pivot), getR(pivot));
		fill(0, 255, 0);
		stroke(0, 255, 0);
	}

	const framesVertical = 5;
	const framesHorizontal = (j-i);
	const verticalDist = 3*getR(list.length-1);

	// Part 1: go upward
	for (let l = 1; l <= framesVertical; l++) {
		drawPlebs();

		let deltaY = l/framesVertical*verticalDist;
		ellipse(offset + i*unitW, height/2 - deltaY, getR(i), getR(i));
		ellipse(offset + j*unitW, height/2 - deltaY, getR(j), getR(j));

		await sleep(100*slider.value());
	}

	// Part 2: go to new x position
	for (let l = 1; l <= framesHorizontal; l++) {
		drawPlebs();

		let deltaX = (j-i)*unitW/framesHorizontal*l;
		ellipse(offset + i*unitW + deltaX, height/2 - verticalDist, getR(i), getR(i));
		ellipse(offset + j*unitW - deltaX, height/2 - verticalDist, getR(j), getR(j));

		await sleep(100*slider.value());
	}

	// Part 3: go down
	for (let l = 1; l <= framesVertical; l++) {
		drawPlebs();

		let deltaY = (framesVertical - l)/framesVertical*verticalDist;
		ellipse(offset + i*unitW, height/2 - deltaY, getR(j), getR(j));
		ellipse(offset + j*unitW, height/2 - deltaY, getR(i), getR(i));

		await sleep(100*slider.value());
	}

	return sleep(350*slider.value());
}

async function animateUberSwap(list, low, high, j) {
	function drawPlebs() {
		background(0);
		for (let a = 0; a < list.length; a++) {
			if (a != j && a!= low) {
				if (low <= a && a <= high) {
					stroke(0, 255, 0);
					fill(0, 255, 0);
				} else {
					stroke(255, 255, 255, 55);
					fill(255, 255, 255, 55);
				}
				ellipse(a*unitW + offset, height/2, getR(a), getR(a));			
			}
		}

		fill(255);
		stroke(255);
		fill(0, 255, 0);
		stroke(0, 255, 0);
	}

	const framesVertical = 5;
	const framesHorizontal = 15;
	const verticalDist = 3*getR(list.length-1);

	// Part 1: go upward
	for (let l = 1; l <= framesVertical; l++) {
		drawPlebs();

		let deltaY = l/framesVertical*verticalDist;
		ellipse(offset + low*unitW, height/2 - deltaY, getR(low), getR(low));
		ellipse(offset + j*unitW, height/2 - deltaY, getR(j), getR(j));

		await sleep(150*slider.value());
	}

	// Part 2: go to new x position
	for (let l = 1; l <= framesHorizontal; l++) {
		drawPlebs();

		let deltaX = (j-low)*unitW/framesHorizontal*l;
		ellipse(offset + low*unitW + deltaX, height/2 - verticalDist, getR(low), getR(low));
		ellipse(offset + j*unitW - deltaX, height/2 - verticalDist, getR(j), getR(j));

		await sleep(150*slider.value());
	}

	// Part 3: go down
	for (let l = 1; l <= framesVertical; l++) {
		drawPlebs();

		let deltaY = (framesVertical - l)/framesVertical*verticalDist;
		ellipse(offset + low*unitW, height/2 - deltaY, getR(j), getR(j));
		ellipse(offset + j*unitW, height/2 - deltaY, getR(low), getR(low));

		await sleep(150*slider.value());
	}

	return sleep(500*slider.value());
}

async function blink(list, idx) {
	fill(255);
	stroke(255);
	ellipse(offset + idx*unitW, height/2, getR(idx), getR(idx));
	await sleep(400*slider.value());
	fill(0, 255, 0);
	stroke(0, 255, 0);
	ellipse(offset + idx*unitW, height/2, getR(idx), getR(idx));
	return Promise.resolve("instantly");
}

async function sleep(ms) {
	return new Promise(
		resolve => {
			setTimeout(() => resolve(), ms);
		}
	);
}

function getR(idx) {
	return 5+2*lookup[list[idx]];
}

function getPivotH() {
	return height/2 + 3*getR(list.length-1);
}

function cleanAnimation() {
	background(0);
	// (x, y) = (current index, correct index)
	for (let a = 0; a < list.length; a++) {
		stroke(255, 255, 255, 55);
		fill(255, 255, 255, 55);
		ellipse(a*unitW + offset, height/2, getR(a), getR(a));			
	}
	setTimeout(plug(), 1000);
}

function plug() {
	fill(255);
	textSize(64);
	textAlign(CENTER, CENTER);
	text("Half puntje waard?", width/2, height/2);
	text("Groetjes, r0708572", width/2, 3*height/4);
}