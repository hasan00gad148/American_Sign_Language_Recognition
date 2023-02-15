const video = document.getElementById('input_video');

var out4 = document.getElementById("myCanvas");
var canvasCtx4 = out4.getContext("2d");


const holistic = new Holistic({locateFile: (file) => {
    return `https://cdn.jsdelivr.net/npm/@mediapipe/holistic/${file}`;
  }});

holistic.setOptions({
    selfieMode: true,
    upperBodyOnly: true,
    enableSegmentation: false,
    smoothSegmentation: false,
    refineFaceLandmarks: false,
    minDetectionConfidence: 0.1,
    minTrackingConfidence: 0.1
  });




const fpsControl = new FPS();
const spinner = document.querySelector('.loading');


function removeElements(landmarks, elements) {
  for (const element of elements) {
    delete landmarks[element];
  }
}

function removeLandmarks(results) {
  if (results.poseLandmarks) {
    removeElements(
        results.poseLandmarks,
        [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 15, 16, 17, 18, 19, 20, 21, 22]);
  }
}

function connect(ctx, connectors) {
  const canvas = ctx.canvas;
  for (const connector of connectors) {
    const from = connector[0];
    const to = connector[1];
    if (from && to) {
      if (from.visibility && to.visibility &&
          (from.visibility < 0.1 || to.visibility < 0.1)) {
        continue;
      }
      ctx.beginPath();
      ctx.moveTo(from.x * canvas.width, from.y * canvas.height);
      ctx.lineTo(to.x * canvas.width, to.y * canvas.height);
      ctx.stroke();
    }
  }
}




let motion = []
function onResultsHolistic(results){
    motion.push(results)


    //===========================================================================

  removeLandmarks(results);

  canvasCtx4.save();
  canvasCtx4.clearRect(0, 0, out4.width, out4.height);
  canvasCtx4.drawImage(
      results.image, 0, 0, out4.width, out4.height);
  canvasCtx4.lineWidth = 5;
  if (results.poseLandmarks) {
    if (results.rightHandLandmarks) {
      canvasCtx4.strokeStyle = '#00FF00';
      connect(canvasCtx4, [[
                results.poseLandmarks[POSE_LANDMARKS.RIGHT_ELBOW],
                results.rightHandLandmarks[0]
              ]]);
    }
      if (results.leftHandLandmarks) {
        canvasCtx4.strokeStyle = '#FF0000';
        connect(canvasCtx4, [[
                  results.poseLandmarks[POSE_LANDMARKS.LEFT_ELBOW],
                  results.leftHandLandmarks[0]
                ]]);
    }
  }
  drawConnectors(
      canvasCtx4, results.poseLandmarks, POSE_CONNECTIONS,
      {color: '#00FF00'});
  drawLandmarks(
      canvasCtx4, results.poseLandmarks,
      {color: '#00FF00', fillColor: '#FF0000'});
  drawConnectors(
      canvasCtx4, results.rightHandLandmarks, HAND_CONNECTIONS,
      {color: '#00CC00'});
  drawLandmarks(
      canvasCtx4, results.rightHandLandmarks, {
        color: '#00FF00',
        fillColor: '#FF0000',
        lineWidth: 2,
        radius: (data) => {
          return lerp(data.from.z, -0.15, .1, 10, 1);
        }
      });
  drawConnectors(
      canvasCtx4, results.leftHandLandmarks, HAND_CONNECTIONS,
      {color: '#CC0000'});
  drawLandmarks(
      canvasCtx4, results.leftHandLandmarks, {
        color: '#FF0000',
        fillColor: '#00FF00',
        lineWidth: 2,
        radius: (data) => {
          return lerp(data.from.z, -0.15, .1, 10, 1);
        }
      });
  drawConnectors(
      canvasCtx4, results.faceLandmarks, FACEMESH_TESSELATION,
      {color: '#C0C0C070', lineWidth: 1});
  drawConnectors(
      canvasCtx4, results.faceLandmarks, FACEMESH_RIGHT_EYE,
      {color: '#FF3030'});
  drawConnectors(
      canvasCtx4, results.faceLandmarks, FACEMESH_RIGHT_EYEBROW,
      {color: '#FF3030'});
  drawConnectors(
      canvasCtx4, results.faceLandmarks, FACEMESH_LEFT_EYE,
      {color: '#30FF30'});
  drawConnectors(
      canvasCtx4, results.faceLandmarks, FACEMESH_LEFT_EYEBROW,
      {color: '#30FF30'});
  drawConnectors(
      canvasCtx4, results.faceLandmarks, FACEMESH_FACE_OVAL,
      {color: '#E0E0E0'});
  drawConnectors(
      canvasCtx4, results.faceLandmarks, FACEMESH_LIPS,
      {color: '#E0E0E0'});

  canvasCtx4.restore();

    //=============================================================================
}

holistic.onResults(onResultsHolistic);



let hol =async ()=>{
  holistic.send({image: video});
}
l=0
video.onpause = function() {
  //alert("The video has been paused");
  hol()
  setTimeout(()=>{l+=1
    console.log("play")  
    video.play()
  },1000)
};
video.onplay = function() {
  //alert("The video has been played");
  

   setTimeout(()=>{
   console.log("pause")
   video.pause()
   },45)
 };  
   
video.onended = function() {
  alert("The video has been played");
	  video.onplay = null
    video.onpause = null
};


video.play()


//==========================================
// video.addEventListener('playing', function(e){
//   // e.preventDefault();
//   setTimeout(() => {
//     console.log("pause2")
//       video.pause() 
//     }, 200);
//   } );

// addEventListener('paused',  function(e){

//   // hol()
//   // e.preventDefault();
//   setTimeout(() => {
//     console.log("play")
//     video.play()
//   }, 200);
// });








// ==========================================
// var playPromise = video.play();
 
// if (playPromise !== undefined) {
//   playPromise.then(_ => {
   
//     setTimeout(() => {

//       video.pause() 
//       console.log("pause1",video.paused)
//     }, 200);
//   })
//   .catch(error => {
//     console.error("error",error)
//   });
// }








// =======================================================
// c_tmp = document.createElement('canvas');
// c_tmp.setAttribute('width', 720);
// c_tmp.setAttribute('height', 480);
// ctx_tmp = c_tmp.getContext('2d');

// ctx_tmp.drawImage(video, 0, 0, video.videoWidth , video.videoHeight );
// // let frame = ctx_tmp.getImageData(0, 0, video.videoWidth , video.videoHeight );

// ctx1.putImageData(frame, 0, 0);
