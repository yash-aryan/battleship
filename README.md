# Battleship

## Overview

Iconic game of ["Battleship"](<https://en.wikipedia.org/wiki/Battleship_(game)>) created using vanilla JavaScript, with a fully responsive layout & enemy bot.

### [View Live Demo](https://yash-aryan.github.io/Battleship/)

- The Game is played against the bot.
- Used Jest for unit-testing the interface of factory functions.
- Used Webpack for bundling the files required to create this project.
- `dist/` directory contains output files: `index.html`, `bundle.js` (minified code)
- `src/` directory contains the non-bundled code.

## Features

- ### Intuitive GUI to Setup Ships

  - Players can manually setup their ships using the arrow keys or the d-pad.
  - Players get visual feedback when moving the ships on the grid.

- ### Auto-Generating Ship Placements for the Bot

  - New ship placements are auto-generated for the Bot on each new game.

- ### Smart AI Bot

  - The Bot has 3 phases - explore, orientation, and follow-up.
  - The Bot does not scan the grid, and determines next moves based on the outcome of it's last shot (hit, miss, or sink).
  - The Bot first explores to find any enemy ship, and then makes sure to sink it, before exploring again for the next ship.

- ### Reset Game / Play Again

  - Player can choose to "Play Again" after game ends.

## File Details

- I've put thought into decoupling the code as much as I can, and into following the _Single Responsibility Principle_.
- `index.js` holds the main game logic, and dictates the flow of events. It calls any necessary functions from other modules.
- `src/dom-handlers/` contains 'dom-handlers' that exports functions to perform DOM manipulation on their own components.
- `src/factories/` contains the following factory functions:
  - `bot-factory.js` returns factory function to create the AI Object responsible for making moves.
  - `ship-factory.js` allows creating individual ship objects.
  - `gameboard-factory.js` allowing creating individual gameboards that contains several of these ship objects.

## Project Status

- [x] Create basic UI.
- [x] Create basic gameplay loop vs bot.
- [x] Update bot to shoot adjacent cells after hit.
- [x] Create logic for the player to place ships.
- [x] Create logic for the bot to generate new ship placement.
- [x] Update UI.
