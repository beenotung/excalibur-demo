import * as ex from 'excalibur';

const game = new ex.Engine({
  width: Math.min(800, window.screen.availWidth - 16),
  height: Math.min(600, window.screen.availHeight - 16),
});

const paddle = new ex.Actor(150, game.drawHeight - 40, 200, 20);
paddle.color = ex.Color.Chartreuse;
paddle.collisionType = ex.CollisionType.Fixed;
game.add(paddle);

const ball = new ex.Actor(100, 300, 20, 20);
ball.color = ex.Color.Red;
ball.vel.setTo(100, 100);
ball.collisionType = ex.CollisionType.Passive;
ball.on('precollision', evt => {
  const intersection = evt.intersection.normalize();
  if (Math.abs(intersection.x) > Math.abs(intersection.y)) {
    ball.vel.x *= -1;
  } else {
    ball.vel.y *= -1;
  }
});
ball.on('postupdate', () => {
  if (ball.pos.x < ball.getWidth() / 2) {
    ball.vel.x *= -1;
  }
  if (ball.pos.x + ball.getWidth() / 2 > game.drawWidth) {
    ball.vel.x *= -1;
  }
  if (ball.pos.y < ball.getHeight() / 2) {
    ball.vel.y *= -1;
  }
});
ball.draw = (ctx, delta) => {
  ctx.fillStyle = ball.color.toString();
  ctx.beginPath();
  ctx.arc(ball.pos.x, ball.pos.y, 10, 0, Math.PI * 2);
  ctx.closePath();
  ctx.fill();
};
ball.on('exitviewport', () => {
  ball.kill();
  alert('game over');
});
game.add(ball);

game.start();

game.input.pointers.primary.on('move', evt => {
  paddle.pos.x = evt.worldPos.x;
});
