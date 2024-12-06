let images = []; // 모든 이미지를 담는 배열
let imageFileNames = ["0923", "0926", "0927", "0929", "0930", "1001", "1002", "1003", "1004", "1005", "1007", "1008", "1017", "1019", "1021", "1022", "1023", "1024", "1025", "1027", "1028", "1029", "1030", "1031", "1102", "1103", "1104", "1105", "1106", "1107", "1108", "1109", "1110", "1111", "1112", "1113"]; // 파일 이름만 배열에 저장
let cardOrder = []; // 카드의 정답 배열
let flipped = []; // 카드의 뒤집힘 상태
let matched = []; // 카드의 일치 여부
let numPairs; // 현재 스테이지의 카드 쌍 수

let matchedPairs = 0; // 맞춘 쌍의 수
let firstSelection = -1; // 첫 번째 카드의 인덱스
let secondSelection = -1; // 두 번째 카드의 인덱스
let isChecking = false; // 카드 비교 중인지 여부
let cardWidth, cardHeight; // 카드 크기
let totalStages = 4; // 총 스테이지 수
let currentStage = 1; // 현재 진행 중인 스테이지
let delayTime = 500; // 카드가 보여지는 시간 (밀리초)
let delayStartTime = 0; // 카드 딜레이 시작 시간
let maxPairs = 8; // 최대 카드 쌍 수 (최대 8쌍까지)
let totalCards; // 총 카드 개수
let isGameOver = false; // 게임 오버 상태 추가
let font;

// 이미지 로드용 변수
let continueImages = [];
let backgroundImage;

function preload() {
  loadImages(); // 이미지 로드
  loadContinueImages(); // 컨티뉴 이미지 로드
}

function setup() {
  createCanvas(windowWidth, windowHeight); // 원하는 화면 크기로 설정, 모바일 대응
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
  cardWidth = width / 4; // 카드 너비
  cardHeight = height / (numPairs + 1); // 카드 높이

  // 백그라운드 이미지 로드
  backgroundImage = loadImage("background/background.png", 
    () => console.log("Background image loaded."),
    () => console.log("The file background/background.png is missing or inaccessible.")
  );
}

function draw() {
  if (images.some(img => img === undefined)) {
    console.log("Loading images...");
    return; // 이미지가 아직 모두 로드되지 않았으면 draw 함수 종료
  }

  background(255);

  if (isGameOver) { // 게임 오버 상태일 경우
    if (backgroundImage) {
      image(backgroundImage, 0, 0, width, height); // 백그라운드 이미지 표시
    }

    // "계속 실행하고 싶을 시 클릭" 메시지 표시
    fill(255);
    textSize(32);
    textAlign(CENTER, CENTER);
    text("click", width / 2, height / 2);
    return; // draw 함수 종료
  }

  displayCards(); // 카드 표시

  // 두 카드가 일치하지 않는 경우 일정 시간 후 뒤집기
  if (isChecking && millis() - delayStartTime >= delayTime) {
    if (cardOrder[firstSelection] !== cardOrder[secondSelection]) {
      flipped[firstSelection] = false;
      flipped[secondSelection] = false;
    }
    resetSelections(); // 카드 비교 후 선택 초기화
  }
}

function loadImages() {
  for (let i = 0; i < imageFileNames.length; i++) {
    let img = loadImage("game_images/" + imageFileNames[i] + ".jpg", 
      () => console.log("Loaded: " + imageFileNames[i]),
      () => console.log("Image load failed: " + imageFileNames[i])
    );
    images.push(img);
  }
}

function loadContinueImages() {
  // continue_images 폴더 내 파일이 continue1.png, continue2.png, ... 이런 형식으로 있다고 가정하고 자동으로 로드
  let index = 1;
  let img;
  do {
    img = loadImage("continue_images/continue" + index + ".png", 
      () => {
        console.log("Continue image loaded: continue" + index);
        continueImages.push(img);
        index++;
      },
      () => {
        console.log("The file continue_images/continue" + index + ".png is missing or inaccessible.");
        img = null; // 이미지가 없을 경우 반복 종료
      }
    );
  } while (img !== null);
}

function setupStage() {
  totalCards = numPairs * 2; // 카드 개수 설정

  cardOrder = new Array(totalCards);
  flipped = new Array(totalCards).fill(false);
  matched = new Array(totalCards).fill(false);

  let imageIndices = []; // 각 이미지 인덱스를 두 번씩 배치
  for (let i = 0; i < numPairs; i++) {
    imageIndices.push(i);
    imageIndices.push(i);
  }

  shuffleArray(imageIndices);
  for (let i = 0; i < totalCards; i++) {
    cardOrder[i] = imageIndices[i];
  }
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function displayCards() {
  let cols = 4;
  let rows = Math.ceil(totalCards / cols);

  for (let i = 0; i < cardOrder.length; i++) {
    let col = i % cols;
    let row = Math.floor(i / cols);
    let x = col * cardWidth;
    let y = row * cardHeight;

    if (flipped[i] || i === firstSelection || i === secondSelection) {
      image(images[cardOrder[i]], x, y, cardWidth, cardHeight);
    } else {
      fill(100);
      rect(x, y, cardWidth, cardHeight);
    }
  }
}

function mousePressed() {
  if (isGameOver) {
    // 게임 오버 상태에서 클릭 시 다시 게임 시작
    isGameOver = false;
    matchedPairs = 0;
    numPairs = 3;
    currentStage = 1;
    setupStage(); // 첫 번째 스테이지로 돌아가기
    return; // 게임 계속
  }

  let cols = 4;
  let rows = Math.ceil(totalCards / cols);
  let index = Math.floor(mouseX / cardWidth) + Math.floor(mouseY / cardHeight) * cols;

  if (index >= 0 && index < cardOrder.length && mouseX < width && mouseY < height) {
    if (!flipped[index] && !matched[index] && (firstSelection === -1 || secondSelection === -1)) {
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
              isGameOver = true; // 게임 오버 상태로 전환
            } else {
              currentStage++;
              numPairs++;
              if (numPairs > maxPairs) {
                numPairs = maxPairs;
              }
              setupStage();
            }
          }
        }
      }
    }
  }
}

function resetSelections() {
  firstSelection = -1;
  secondSelection = -1;
  isChecking = false;
}
