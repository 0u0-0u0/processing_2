function mousePressed() {
  if (isGameOver) {
    // 게임 오버 상태에서 클릭 시 다시 게임 시작
    isGameOver = false;
    matchedPairs = 0;
    numPairs = 3;
    currentStage = 1;
    setupStage(); // 첫 번째 스테이지로 돌아가기
    selectRandomBackground(); // 새로운 배경 이미지 선택
    selectRandomContinueImage(); // 새로운 컨티뉴 이미지 선택
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
            matchedPairs = 0; // 현재 스테이지의 매칭된 쌍 초기화

            if (currentStage === totalStages) {
              isGameOver = true; // 게임 오버 상태로 전환
            } else {
              currentStage++;
              if (numPairs < maxPairs) { // 최대 쌍 제한 확인
                numPairs++; // 스테이지 완료 후에만 카드 쌍 증가
              }
              setupStage();
              selectRandomBackground(); // 새로운 배경 이미지 선택
              selectRandomContinueImage(); // 새로운 컨티뉴 이미지 선택
            }
          }
        }
      }
    }
  }
}
