let images = []; // 모든 이미지를 담는 배열
let imageFileNames = ["0923", "0926", "0927", "0929", "0930", "1001", "1002", "1003", "1004", "1005"]; // 파일 이름
let cardOrder = []; // 카드의 정답 배열
let flipped = []; // 카드의 뒤집힘 상태
let matched = []; // 카드의 일치 여부
let numPairs = 3; // 첫 번째 스테이지의 카드 쌍 수
let matchedPairs = 0; // 맞춘 쌍의 수
let firstSelection = -1; // 첫 번째 카드의 인덱스
let secondSelection = -1; // 두 번째 카드의 인덱스
let isChecking = false; // 카드 비교 중인지 여부
let cardWidth, cardHeight; // 카드 크기
let totalStages = 4; // 총 스테이지 수
let currentStage = 1; // 현재 진행 중인 스테이지
let isGameOver = false; // 게임 오버 상태
let delayTime = 500; // 카드가 보여지는 시간 (밀리초)
let delayStartTime = 0; // 카드 딜레이 시작 시간

function preload() {
  loadImagesForStage(numPairs); // 현재 스테이지에 필요한 이미지만 로드
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  textFont('Nirmala UI, Arial', 32);
  cardWidth = width / 4; // 카드 너비
  cardHeight = height / 3; // 카드 높이
  setupStage(); // 첫 번째 스테이지 설정
}

function draw() {
  background(255);

  if (isGameOver) {
    textSize(32);
    textAlign(CENTER, CENTER);
    text("Game Over! Click to Restart", width / 2, height / 2);
    return;
  }

  displayCards(); // 카드 표시

  if (isChecking && millis() - delayStartTime >= delayTime) {
    if (cardOrder[firstSelection] !== cardOrder[secondSelection]) {
      flipped[firstSelection] = false;
      flipped[secondSelection] = false;
    }
    resetSelections(); // 카드 비교 후 선택 초기화
  }
}

function loadImagesForStage(numPairs) {
  images = []; // 이전 스테이지의 이미지를 제거
  for (let i = 0; i < numPairs; i++) {
    loadImage("game_images/" + imageFileNames[i] + ".jpg", 
      (img) => {
        images.push(img);
      },
      () => console.log("Image load failed: " + imageFileNames[i])
    );
  }
}

function setupStage() {
  let totalCards = numPairs * 2; // 현재 스테이지의 총 카드 수
  cardOrder = new Array(totalCards);
  flipped = new Array(totalCards).fill(false);
  matched = new Array(totalCards).fill(false);

  let imageIndices = [];
  for (let i = 0; i < numPairs; i++) {
    imageIndices.push(i);
    imageIndices.push(i);
  }

  shuffleArray(imageIndices); // 무작위로 카드 배치
  for (let i = 0; i < totalCards; i++) {
    cardOrder[i] = imageIndices[i];
  }
}

function displayCards() {
  let cols = 4;
  let rows = Math.ceil(cardOrder.length / cols);

  for (let i = 0; i < cardOrder.length; i++) {
    let col = i % cols;
    let row = Math.floor(i / cols);
    let x = col * cardWidth;
    let y = row * cardHeight;

    if (flipped[i]) {
      image(images[cardOrder[i]], x, y, cardWidth, cardHeight);
    } else {
      fill(200);
      rect(x, y, cardWidth, cardHeight); // 뒷면 카드
    }
  }
}

function mousePressed() {
  if (isGameOver) {
    restartGame();
    return;
  }

  let cols = 4;
  let index = Math.floor(mouseX / cardWidth) + Math.floor(mouseY / cardHeight) * cols;

  if (index >= 0 && index < cardOrder.length && !flipped[index] && !matched[index]) {
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

        if (matchedPairs === numPairs) {
          currentStage++;
          if (currentStage > totalStages) {
            isGameOver = true;
          } else {
            numPairs++;
            loadImagesForStage(numPairs); // 다음 스테이지 이미지 로드
            setupStage();
          }
        }
        resetSelections();
      }
    }
  }
}

function resetSelections() {
  firstSelection = -1;
  secondSelection = -1;
  isChecking = false;
}

function restartGame() {
  isGameOver = false;
  currentStage = 1;
  numPairs = 3;
  matchedPairs = 0;
  loadImagesForStage(numPairs); // 첫 번째 스테이지 이미지 로드
  setupStage();
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}
