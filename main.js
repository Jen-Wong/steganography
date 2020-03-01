// Kick off image processing
function readURL(input) {
	if (input.files && input.files[0]) {
		let reader = new FileReader();
		reader.onload = e => processImage(e.target.result);
		reader.readAsDataURL(input.files[0]);
	}
}

// Displays image and/or message
function processImage(url) {
	let img = document.createElement('img'),
		textBox = document.getElementById('message'),
		canvas = document.getElementById('canvas'),
		ctx = canvas.getContext('2d');

	img.src = url;
	img.onload = () => {
		const ratio = Math.min(
			canvas.clientWidth / img.width,
			canvas.clientHeight / img.height
		);
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		ctx.drawImage(img, 0, 0, img.width * ratio, img.height * ratio);

		textBox.value == '' ? recover() : hide(textBox.value);
	};
}

// Encode text in image
function hide(message) {
	let canvas = document.getElementById('canvas'),
		ctx = canvas.getContext('2d'),
		imageData = ctx.getImageData(0, 0, canvas.width, canvas.height),
		data = imageData.data,
		bin = messageToBinary(message),
		i = 0;

	bin.split('').forEach(bit => {
		if (bit != ' ') {
			data[i] = bit == '1' ? data[i] | 1 : data[i] & ~1;
			i++;
		}
	});
	ctx.putImageData(imageData, 0, 0);
	addDownloadLink();
}

// Recover message from image
function recover() {
	let canvas = document.getElementById('canvas'),
		textBox = document.getElementById('message'),
		ctx = canvas.getContext('2d'),
		data = ctx.getImageData(0, 0, canvas.width, canvas.height).data,
		MESSAGE_LENGTH_LIMIT = 20,
		bin = [];

	for (let i = 0; i < MESSAGE_LENGTH_LIMIT * 8; i++) {
		bin.push(data[i] & 1);
	}
	textBox.value = binaryToMessage(bin.join(''));
}

// Create handy button
function addDownloadLink() {
	let canvas = document.getElementById('canvas'),
		downloadLink = document.createElement('a');
	downloadLink.href = canvas.toDataURL();
	downloadLink.download = 'hehe.png';
	downloadLink.textContent = 'download';
  document.body.appendChild(downloadLink);
}

// big helper func vibes
function messageToBinary(message) {
	return message.split('').reduce(
		(acc, curr) => {
			let char = curr.charCodeAt(0).toString(2);
			char = char.length < 8 ? '00000000'.slice(char.length) + char : char;
			return acc + char + ' ';
		},
		''
	);
}

// very large helper func energy
function binaryToMessage(bin) {
	return bin.replace(/\s*[01]{8}\s*/g, function(group) {
		return String.fromCharCode(parseInt(group, 2));
	});
}
