# **Four Treasure Maze Documentation**

 By Jake Mayer

## Project Summary

Four Treasure Maze is a game where the player navigates a randomly generated maze to collect a treasure from each corner of the map within a time limit.  
In order to win, the player must collect each treasure when its color is displayed by the LED connected to the ardiuno.  
The player loses if the game timer reaches zero or if the wrong treasure is collected.  
After winning, the game will start to use a larger random maze.  
  
The game intergates the use of an **Arduino** and the **p5.js** and **Tone.js** libraries.  
  
The randomly generated maze is generated through the use of **Kruskal's Algorithm**.
  
Game design, use of the arduino, and how mazes are randomly generated with Kruskal's Algorithm is detailed in later sections of the document.  

## Sample Video (click to play)

[![Project Video Here](https://img.youtube.com/vi/msQaEX3tyUo/0.jpg)](https://www.youtube.com/watch?v=msQaEX3tyUo)

## Game Design

Here is an image of what the game's start screen looks like:  

![Adruino Diagram Here](/finalproject/docs/assets/UI.png)  
  


## Use of Kruskal's Algorithm



## Arduino Details

The arduino uses `final.ino` in the directory `finalproject/final/final.ino`  
  
Here is a diagram that includes all relavent parts to be used with the Arduino:  
(note that the pins used in the diagram are not correct, also the wiring seems to be wrong for the LED)  
  
![Adruino Diagram Here](/finalproject/docs/assets/diagram.png)  

Arduino parts:  
- Arduino Board + Breadboard + USB cable
- Joystick
- RGB LED

Code for the arduino handles printing the joystick inputs to the serial port and retrieving color values for the RGB LED from the serial port.
