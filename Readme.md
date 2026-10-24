# Bubble Rush

Bubble Rush is a lightweight browser game built with HTML, CSS, and vanilla JavaScript. Players match a target number shown at the top of the screen, click the correct bubble, and try to score as much as possible before the timer reaches zero.

## Live demo

- https://bubble-game-copy.vercel.app/

## How to run locally

1. Open the project folder in a browser, or serve it locally with a small static file server.
2. From the project root, run:
   - `python -m http.server 8000`
3. Open `http://localhost:8000` in your browser.

## How to play

1. On the welcome screen, pick a difficulty: Easy, Medium, or Hard.
2. Click the Start Game button.
3. A target number appears in the header.
4. Find the matching bubble and click it.
5. A correct click adds 10 points and generates a new target.
6. A wrong bubble ends the round immediately.
7. The game ends when the timer reaches zero or when you click the wrong bubble.
8. Use the Play Again button to start a fresh round.

## Difficulty modes

- Easy: 45-second timer, larger bubbles, relaxed pace
- Medium: 30-second timer, balanced board and speed
- Hard: 20-second timer, denser bubble layout, faster challenge

The selected difficulty changes the timer, bubble count, and bubble size, so it changes the actual gameplay rather than only the label.

## Scoring and game rules

- Correct bubble: +10 points
- Wrong bubble: the round ends immediately
- Timer: the round ends automatically when the countdown reaches 0
- Accuracy is calculated as: correct hits / total attempts × 100
- If there are zero attempts, accuracy shows 0%

## Game over and restart

When the game ends, a result screen appears with:

- Final score
- Best score
- Correct hits
- Total attempts
- Accuracy
- Difficulty
- Play Again button
- Back to Home button

The game can be restarted without reloading the page.

## Best score storage

The best score is saved in the browser using `localStorage`. This data is stored locally on the device and is not part of an online leaderboard or remote database.

The game safely handles missing, invalid, or blocked storage values and falls back to a default score of 0.

## Technologies used

- HTML
- CSS
- JavaScript (vanilla)
- Local browser storage for best score persistence

## Current limitations

- This is a single-player browser game without online multiplayer or leaderboard syncing.
- No sound effects are included.
- Saved data only exists in the local browser, not across devices.

## Project status

This README reflects the final implementation in this repository. It matches the required game flow, difficulty settings, restart behavior, and local high-score logic.


