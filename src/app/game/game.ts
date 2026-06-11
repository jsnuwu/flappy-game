import { Component, HostListener, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Pipe {
  x: number;
  gapY: number;
}

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './game.html',
  styleUrl: './game.css',
})
export class Game implements OnInit {
  birdY = 250;
  velocity = 0;

  gravity = 0.5;
  jumpForce = -8;

  gameOver = false;

  pipes: Pipe[] = [];

  score = 0;
  private scoredPipes = new Set<Pipe>();

  private intervalId: any;
  private started = false;

  readonly GAP_SIZE = 160;
get BIRD_X() {
  return this.gameWidth * 0.1;
}
  readonly BIRD_SIZE = 40;
  readonly PIPE_WIDTH = 50;

birdImage = 'assets/bird.png';
private normalBird = 'assets/bird.png';
private jumpBird = 'assets/bird-jump.png';

gameWidth = 0;
gameHeight = 0;

  constructor(private cdr: ChangeDetectorRef) {}

ngOnInit(): void {
  this.gameWidth = window.innerWidth;
  this.gameHeight = window.innerHeight;

  this.birdY = this.gameHeight / 2;

  this.createPipe();

  this.intervalId = setInterval(() => {
    if (!this.gameOver) {
      this.update();
      this.cdr.detectChanges();
    }
  }, 16);
}

createPipe() {
  const margin = 120;

  this.pipes.push({
    x: this.gameWidth,
    gapY:
      Math.random() *
        (this.gameHeight - this.GAP_SIZE - margin * 2) +
      margin +
      this.GAP_SIZE / 2,
  });
}

update() {
  if (this.started) {
    this.velocity += this.gravity;
    this.birdY += this.velocity;
  }

  this.pipes.forEach(pipe => {
    pipe.x -= 3;
  });

const lastPipe = this.pipes[this.pipes.length - 1];
if (this.pipes.length === 0 || lastPipe.x < this.gameWidth - 300) {
  this.createPipe();
}

  this.pipes = this.pipes.filter(p => p.x > -100);

  this.checkCollision();

  this.pipes.forEach(pipe => {
    if (
      pipe.x + this.PIPE_WIDTH < this.BIRD_X &&
      !this.scoredPipes.has(pipe)
    ) {
      this.score++;
      this.scoredPipes.add(pipe);
    }
  });
}

  private startTime = Date.now();

  checkCollision() {
    if (Date.now() - this.startTime < 1500) {
      return;
    }
if (this.birdY + this.BIRD_SIZE > this.gameHeight) {
  this.endGame();
  return;
}

    for (const pipe of this.pipes) {
      const birdLeft = this.BIRD_X;
      const birdRight = this.BIRD_X + this.BIRD_SIZE;

      const pipeLeft = pipe.x;
      const pipeRight = pipe.x + this.PIPE_WIDTH;

      const horizontalHit = birdRight > pipeLeft && birdLeft < pipeRight;

      const birdTop = this.birdY;
      const birdBottom = this.birdY + this.BIRD_SIZE;

      const hitTopPipe = birdTop < pipe.gapY - this.GAP_SIZE / 2;
      const hitBottomPipe = birdBottom > pipe.gapY + this.GAP_SIZE / 2;

      if (horizontalHit && (hitTopPipe || hitBottomPipe)) {
        this.endGame();
      }
    }
  }

  resetGame() {
this.birdY = this.gameHeight / 2;
    this.velocity = 0;

    this.gameOver = false;
    this.started = false;

    this.pipes = [];
    this.score = 0;
    this.scoredPipes.clear();

    this.startTime = Date.now();

    this.createPipe();

    this.intervalId = setInterval(() => {
      if (!this.gameOver) {
        this.update();
        this.cdr.detectChanges();
      }
    }, 16);
  }

  endGame() {
    this.gameOver = true;
    clearInterval(this.intervalId);
  }

  @HostListener('window:keydown.space')
  jump() {
    if (this.gameOver) {
      this.resetGame();
      return;
    }

    if (!this.started) {
      this.started = true;
    }

    this.velocity = this.jumpForce;

    this.birdImage = this.jumpBird;

    setTimeout(() => {
      this.birdImage = this.normalBird;
    }, 150);
  }
}
