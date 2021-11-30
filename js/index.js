import * as THREE from '../node_modules/three/build/three.module.js';
import { TrackballControls } from '../node_modules/three/examples/jsm/controls/TrackballControls.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 100;
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);

const form = document.getElementById('form');
const selectFigure = document.getElementById('selectFigure');
const scaleFigure = document.getElementById('scaleFigure');
const uuidList = document.getElementById('uuidList');

let items = [];

let scale;
let figure;

form.addEventListener('submit', (event) => {
	event.preventDefault();

	scale = document.getElementById('scaleFigure').value;
	objectType = document.getElementById('selectFigure').value;
	addObject(objectType);
});

function getRandomCoords() {
	const rand = () => Math.random() * 25;
	return [rand(), rand(), rand()];
}

function createListItem(uuid) {
	function deleteItem() {
		const deleteItem = items.find(
			(el) => el.uuid === this.getAttribute('data-uuid')
		);
		items = items.filter(
			(el) => el.uuid !== this.getAttribute('data-uuid')
		);

		this.closest('li').remove();
		scene.remove(deleteItem.getMesh());
	}

	const item = document.createElement('li');
	const itemSpan = document.createElement('span');
	itemSpan.textContent = uuid;
	const button = document.createElement('button');
	button.setAttribute('data-uuid', uuid);
	button.textContent = 'X';
	button.addEventListener('click', deleteItem);

	item.append(itemSpan);
	item.append(button);

	uuidList.append(item);
}

class Shape {
	constructor({ scale, color = '0x00ff00', coords }) {
		this.scale = scale;
		this.color = color;
		this.coords = coords;
		this.mesh = null;
		(this.uuid = null),
			(this.material = new THREE.MeshBasicMaterial({ color: 0x00ff00 }));
	}

	create() {
		this.mesh = new THREE.Mesh(this.getGeometry(), this.material);
		this.mesh.position.set(...this.coords);
		this.uuid = this.mesh.uuid;
		createListItem(this.uuid);

		return this;
	}
	getMesh() {
		return this.mesh;
	}

	getGeometry() {}
}

class Cube extends Shape {
	constructor(args) {
		super(args);
	}

	getGeometry() {
		return new THREE.BoxGeometry(this.scale, this.scale, this.scale);
	}
	makeFrameAnimation() {
		this.mesh.rotation.x += 0.01;
		this.mesh.rotation.y += 0.01;
	}
}
class Pyramid extends Shape {
	constructor(args) {
		super(args);
	}

	getGeometry() {
		return new THREE.ConeGeometry(this.scale, this.scale * 2, 4);
	}
	makeFrameAnimation() {
		this.mesh.rotation.x += 0.01;
		this.mesh.rotation.y += 0.01;
	}
}
class Sphere extends Shape {
	constructor(args) {
		super(args);
	}

	getGeometry() {
		return new THREE.SphereGeometry(this.scale, this.scale, this.scale);
	}
	makeFrameAnimation() {
		this.mesh.rotation.x += 0.01;
		this.mesh.rotation.y += 0.01;
	}
}

const light = new THREE.DirectionalLight(0xffffff);
light.position.set(1, 1, 1);
scene.add(light);

function animate() {
	requestAnimationFrame(animate);
	items.forEach((item) => {
		item.makeFrameAnimation();
	});

	renderer.render(scene, camera);
}
animate();
document.body.appendChild(renderer.domElement);

function addObject(type) {
	const object = {
		cube: () => new Cube({ scale, coords: getRandomCoords() }).create(),
		pyramid: () =>
			new Pyramid({ scale, coords: getRandomCoords() }).create(),
		sphere: () => new Sphere({ scale, coords: getRandomCoords() }).create()
	}[type]();
	items.push(object);
	scene.add(object.getMesh());
}
