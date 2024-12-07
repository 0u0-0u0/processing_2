function setup() {
  createCanvas(windowWidth, windowHeight); // 원하는 화면 크기로 설정
  textFont('Nirmala UI, Arial', 32);

  // 이미지 로드 확인
  if (images.length === 0 || backgroundImages.length === 0 || continueImages.length === 0) {
    console.log("Images are missing. Please check your folders.");
    noLoop(); // 이미지가 없으면 게임 종료
    return;
  }

  setupStage(); // 첫 번째 스테이지 설정
  cardWidth = width / 4; // 카드 너비
  cardHeight = height / (numPairs + 1); // 카드 높이
  selectRandomBackground(); // 랜덤 배경 이미지 선택
  selectRandomContinueImage(); // 랜덤 컨티뉴 이미지 선택
}

function mousePressed() {
  if (isGameOver) {
    // 게임 오버 상태에서 클릭 시 다시 게임 시작
    isGameOver = false;
    matchedPairs = 0;
    numPairs = 3; // 첫 번째 스테이지로 초기화
    currentStage = 1; // 스테이지 초기화
    setupStage();
    selectRandomBackground();
    selectRandomContinueImage();
    return;
  }

  let cols = 4;
  let index = Math.floor(mouseX / cardWidth) + Math.floor(mouseY / cardHeight) * cols;

  if (
    index >= 0 &&
    index < cardOrder.length &&
    mouseX < width &&
    mouseY < height &&
    !flipped[index] &&
    !matched[index]
  ) {
    flipped[index] = true;

    if (firstSelection === -1) {
      firstSelection = index;
    } else if (secondSelection === -1 && index !== firstSelection) {
      secondSelection = index;
      isChecking = true;
      delayStartTime = millis();

      if (cardOrder[firstSelection] === cardOrder[secondSelection]) {
        matched[firstSelection] = true;
        matched[secondSelection] = true;
        matchedPairs++;
        resetSelections();

        if (matchedPairs === numPairs) {
          matchedPairs = 0;

          if (currentStage === totalStages) {
            isGameOver = true; // 게임 오버 상태
          } else {
            currentStage++;
            if (currentStage <= totalStages) {
              numPairs++;
              if (numPairs > maxPairs) numPairs = maxPairs;
              setupStage();
              selectRandomBackground();
              selectRandomContinueImage();
            }
          }
        }
      }
    }
  }
}
