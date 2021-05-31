const video = document.querySelector('.player');
const canvas = document.querySelector('.photo');
const ctx = canvas.getContext('2d');
const strip = document.querySelector('.strip');
const snap = document.querySelector('.snap');

function getVideo(){
    navigator.mediaDevices.getUserMedia({video : true, audio: false})
     .then(localMediaStream => {
         console.log(localMediaStream);
         video.srcObject = localMediaStream; // wesbos에서는 구버전 사용해서 코드 수정함
         video.play();
     })
     .catch(err => {
         console.error(`OH NO!!` , err);
     });
}
function paintToCanvas() {
    const width = video.videoWidth;
    const height = video.videoHeight;
    canvas.width = width;
    canvas.height = height;
  
    return setInterval(() => {
      ctx.drawImage(video, 0, 0, width, height);
      // take the pixels out
      let pixels = ctx.getImageData(0, 0, width, height);
      // mess with them
      // pixels = redEffect(pixels);
  
      pixels = rgbSplit(pixels);
      // ctx.globalAlpha = 0.8;
  
      // pixels = greenScreen(pixels);
      // put them back
      ctx.putImageData(pixels, 0, 0);
    }, 16);
  }
  
  function takePhoto() {
    // played the sound
    snap.currentTime = 0; // 찰칵 오디오 시작을 0으로
    snap.play(); // snap 플레이
  
    // take the data out of the canvas
    const data = canvas.toDataURL('image/jpeg');
    // toDataURL로 캔버스에 그린 그림을 문자열 형태로 변환
    const link = document.createElement('a');
    // a 태그를 만듦
    link.href = data; // 링크 하이퍼링크로 data 값을 함
    link.setAttribute('download', 'handsome');
    // link의 download 속성 값을 handsome으로 함
    link.innerHTML = `<img src="${data}" alt="Handsome Man" />`; 
    // link에 찍은 이미지를 넣음
    strip.insertBefore(link, strip.firstChild);
    // link를 strip.firstChild 앞에 삽입함
  }
  
  function redEffect(pixels) { 
    for (let i = 0; i < pixels.data.length; i+=4) { // red, green, blue, alpha 4개라 4개씩
      pixels.data[i + 0] = pixels.data[i + 0] + 200; // RED
      pixels.data[i + 1] = pixels.data[i + 1] - 50; // GREEN
      pixels.data[i + 2] = pixels.data[i + 2] * 0.5; // Blue
    }
    return pixels;
  }
  
  function rgbSplit(pixels) {
    for (let i = 0; i < pixels.data.length; i+=4) {
      pixels.data[i - 150] = pixels.data[i + 0]; // RED
      pixels.data[i + 500] = pixels.data[i + 1]; // GREEN
      pixels.data[i - 550] = pixels.data[i + 2]; // Blue
    }
    return pixels;
  }
function greenScreen(pixels) {
    const levels = {};
  
    document.querySelectorAll('.rgb input').forEach((input) => {
      levels[input.name] = input.value;
    });
  
    for (i = 0; i < pixels.data.length; i = i + 4) {
      red = pixels.data[i + 0];
      green = pixels.data[i + 1];
      blue = pixels.data[i + 2];
      alpha = pixels.data[i + 3];
  
      if (red >= levels.rmin
        && green >= levels.gmin
        && blue >= levels.bmin
        && red <= levels.rmax
        && green <= levels.gmax
        && blue <= levels.bmax) {
        // take it out!
        pixels.data[i + 3] = 0;
      }
    }
}
getVideo();
video.addEventListener('canplay', paintToCanvas); 
//  user agent가 media를 재생할 수 있을 때 paintToCanvas 호출