let images = [];
let imagePaths = [];
let imageFileNames = ["0923", "0926", "0927", "0929", "0930", "1001", "1002", "1003", "1004", 
"1005", "1007", "1008", "1017", "1019", "1021", "1022", "1023", "1024", "1025", "1027", "1028",
"1029", "1030", "1031", "1102", "1103", "1104", "1105", "1106", "1107", "1108", "1109", "1101",
"1111", "1112", "1113" ]; // 파일 이름만 배열에 저장

for (let i = 0; i < imageFileNames.length; i++) {
  imagePaths.push("game_images/" + imageFileNames[i] + ".jpg");
}

let cardOrder = [];
let flipped = [];
let matched = [];
let numPairs = 3;
let matchedPairs = 0;
let firstSelection = -1;
let secondSelection = -1;
let isChecking = false;
let cardWidth, cardHeight;
let delayTime = 500;
let delayStartTime = 0;

function preload() {
  for (let i = 0; i < imagePaths.length; i++) {
    images[i] = loadImage(imagePaths[i]);
  }
}

function setup() {
  createCanvas(800, 600);
  cardWidth = width / 4;
  cardHeight = height / 3;
  setupStage();
}

function draw() {
  background(255);

  for (let i = 0; i < cardOrder.length; i++) {
    let col = i % 4;
    let row = Math.floor(i / 4);
    let x = col * cardWidth;
    let y = row * cardHeight;

    if (flipped[i] || i === firstSelection || i === secondSelection) {
      image(images[cardOrder[i]], x, y, cardWidth, cardHeight);
    } else {
      fill(100);
      rect(x, y, cardWidth, cardHeight);
    }
  }

  if (isChecking && millis() - delayStartTime >= delayTime) {
    if (cardOrder[firstSelection] !== cardOrder[secondSelection]) {
      flipped[firstSelection] = false;
      flipped[secondSelection] = false;
    }
    resetSelections();
  }
}

function setupStage() {
  let totalCards = numPairs * 2;
  cardOrder = [];
  flipped = [];
  matched = [];

  let imageIndices = [];
  for (let i = 0; i < numPairs; i++) {
    imageIndices.push(i, i);
  }
  shuffle(imageIndices, true);

  for (let i = 0; i < totalCards; i++) {
    cardOrder.push(imageIndices[i]);
    flipped.push(false);
    matched.push(false);
  }
}

function mousePressed() {
  let col = Math.floor(mouseX / cardWidth);
  let row = Math.floor(mouseY / cardHeight);
  let index = row * 4 + col;

  if (index >= 0 && index < cardOrder.length && !flipped[index] && !matched[index]) {
    if (firstSelection === -1) {
      firstSelection = index;
      flipped[index] = true;
    } else if (secondSelection === -1 && index !== firstSelection) {
      secondSelection = index;
      flipped[index] = true;
      isChecking = true;
      delayStartTime = millis();
    }
  }
}

function resetSelections() {
  firstSelection = -1;
  secondSelection = -1;
  isChecking = false;
}
