function setup() {
  updateCanvasSize(); // 디바이스에 따라 캔버스 크기 설정
  textFont('Nirmala UI, Arial', 32);

  if (images.length === 0) {
    console.log("No images found. Please check your data folder.");
    noLoop(); // 이미지가 없으면 게임 종료
    return;
  }
  if (images.length / 2 < maxPairs) {
    console.log("Not enough images for the game to work correctly.");
    noLoop(); // 이미지가 부족하면 게임 종료
    return;
  }

  numPairs = 3; // 첫 번째 스테이지의 카드 쌍 수 설정
  setupStage(); // 첫 번째 스테이지 설정
  selectRandomBackground(); // 랜덤 배경 이미지 선택
  selectRandomContinueImage(); // 랜덤 컨티뉴 이미지 선택
}

function windowResized() {
  updateCanvasSize(); // 창 크기 변경 시 캔버스 크기 업데이트
}

function updateCanvasSize() {
  // PC와 모바일 디바이스를 구분하여 캔버스 비율 설정
  if (windowWidth > windowHeight) {
    // PC 비율 (가로형 비율)
    createCanvas(windowWidth, windowHeight); // 가로형 캔버스
    cardWidth = width / 4; // 카드 너비
    cardHeight = height / (numPairs + 1); // 카드 높이
  } else {
    // 모바일 비율 (세로형 비율)
    createCanvas(windowHeight, windowWidth); // 세로형 캔버스
    cardWidth = height / 4; // 카드 너비
    cardHeight = width / (numPairs + 1); // 카드 높이
  }
}
