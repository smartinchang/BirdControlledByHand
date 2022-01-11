let video = document.getElementById("video");
let model;
let canvas1 = document.getElementById("canvas1");
let ctx1 = canvas1.getContext("2d");
let canvas2 = document.getElementById("canvas2");
let ctx2 = canvas2.getContext("2d");
let kukek;
let kukek_count = 0;
let kukek_width = 220/2;
let kukek_height = 199/2;

const setupCamera = () => {
	navigator.mediaDevices
	.getUserMedia({
		video: {width: 640, height: 480},
		audio: false,
	})
	.then((stream) => {
		video.srcObject = stream;
	});
};

const detectHands = async () => {
	kukek.src = "kukek/frame_" + kukek_count + ".gif";
	ctx1.fillStyle = "white";
	ctx1.fillRect(0, 0, 640, 480);
	const predictions = await model.estimateHands(video);
	for (let i = 0; i < predictions.length; i++) {
		const keypoints = predictions[i].landmarks;
			const x = keypoints[12][0];
			const y = keypoints[12][1];
			ctx1.drawImage(kukek, x - kukek_width/2, y - kukek_height/2, kukek_width, kukek_height);
	}
	ctx2.drawImage(video, 0, 0, 640, 480);
	kukek_count += 1;
	if (kukek_count == 26) {
		kukek_count = 0;
	}
}

setupCamera();
video.addEventListener("loadeddata", async () => {
	model = await handpose.load();
	setInterval(detectHands, 100);	
})

window.onload = function() {
	kukek = document.getElementById("kukek");
}