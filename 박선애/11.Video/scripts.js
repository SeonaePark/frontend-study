/* Get  our elements */
const player = document.querySelector('.player'); 
const video = player.querySelector('.viewer'); 
const progress = player.querySelector('.progress');
const progressBar = player.querySelector('.progress__filled');
const toggle = player.querySelector('.toggle');
const skipButtons = player.querySelectorAll('[data-skip]');
const ranges = player.querySelectorAll('.player__slider');

/* Build out functions */

/* 비디오 클릭했을 때 실행/정지 */ 
function togglePlay(){ 
    // 비디오가 정지된 상태에서 클릭하면 play, 아니면 pause
    const method = video.paused ? 'play' : 'pause'; 
    video[method](); // 비디오 상태 
}

 /* 비디오 play 시키면 toggle 아이콘 변경 */ 
function updateButton() {
    // 비디오가 정지된 상태/실행된 상태마다 아이콘 변경
    const icon = this.paused ? '►' : '❚ ❚'; 
    console.log(icon);
    toggle.textContent = icon; // toggle의 자손 텍스트 콘텐츠
  }

  /* 비디오 스킵 */
  function skip() { 
    // 비디오 현재 실행 시간에서 html에서 설정했던 data-skip 값을 더해준다.
   video.currentTime += parseFloat(this.dataset.skip);
  }
  
  /* 마우스로 range 범위 이동시켜서 업데이트 */
  function handleRangeUpdate() {
    // range 값으로 업데이트
    video[this.name] = this.value;
  }
  
  /* progressBar 설정 */
  function handleProgress() {
     // 동영상 시간이 변경될 때마다 현재 시간을 전체시간의 백분위로 구한다.
    const percent = (video.currentTime / video.duration) * 100;
     // 동영상 시간에 따라 progressBar 스타일 변경
    progressBar.style.flexBasis = `${percent}%`; 
  }
  
  /* range 위에서 마우스가 어디에 위치하는 지 파악하고 동영상 시간 갱신 */
  function scrub(e) {
    // offset은 상대적 위치를 나타냄
    // e.offsetX는 이벤트가 일어날 곳을 기준으로 x좌표를 정한다. 
    // progress는 전체 동영상의 길이를 나타내고 x좌표의 기준이다.
    const scrubTime = (e.offsetX / progress.offsetWidth) * video.duration;
    video.currentTime = scrubTime;
  }
  
  /* Hook up the event listeners */
  video.addEventListener('click', togglePlay);
  video.addEventListener('play', updateButton);
  video.addEventListener('pause', updateButton);
  video.addEventListener('timeupdate', handleProgress);
  
  toggle.addEventListener('click', togglePlay);
  skipButtons.forEach(button => button.addEventListener('click', skip));
  ranges.forEach(range => range.addEventListener('change', handleRangeUpdate));
  ranges.forEach(range => range.addEventListener('mousemove', handleRangeUpdate));
  
  let mousedown = false;
  progress.addEventListener('click', scrub);
  progress.addEventListener('mousemove', (e) => mousedown && scrub(e)); // 마우스가 progress 위에서 움직이기만 할 때는 이벤트 발생시키지 않기 위해 mousedown 사용
  progress.addEventListener('mousedown', () => mousedown = true);
  progress.addEventListener('mouseup', () => mousedown = false);