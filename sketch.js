var PLAY = 1;
var END = 0;
var gameState = PLAY;

var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;
var gameOver_img, restart_img

var score;
var scores = [];
var highScore = 0;


function preload(){
  trex_running = loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_collided = loadAnimation("trex_collided.png");
  
  groundImage = loadImage("ground2.png");
  
  cloudImage = loadImage("cloud.png");
  
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  
  gameOver_img = loadImage("gameOver.png");
  restart_img = loadImage("restart.png");
  
  jumpSound = loadSound("jump.mp3")
  dieSound = loadSound("die.mp3")
  checkPointSound = loadSound("checkPoint.mp3")
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  trex = createSprite(50,height-20,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided" , trex_collided)
  trex.scale = 0.5;
  
  ground = createSprite(200,height-20,400,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  
  
  invisibleGround = createSprite(200,height-10,400,10);
  invisibleGround.visible = false;
  
  //create Obstacle and Cloud Groups
  obstaclesGroup = createGroup();
  cloudsGroup = createGroup();
  
  
  trex.setCollider("circle",0,0,40);
  //trex.debug = true
  
  score = 0;
  
  gameOver = createSprite(width/2, height/2, 10, 10);
  gameOver.addImage("gameOver", gameOver_img);
  
  restart = createSprite(width/2+50, height/2-50, 10, 10);
  restart.addImage("restart", restart_img);
  restart.scale = 0.5;
  
  chkbox = createCheckbox("Activate AI");
  chkbox.position(width-150,50);
}

function draw() {
  background(180);
  //displaying score
  textSize(20)
  text("Score: "+ score, width-150,50);
  if(scores.length > 1){
  text("HS:" + max(scores), width-300, 50)
  }
  else{
    text("HS:" + 0, width-300, 50)
  }
  if(gameState === PLAY){
    //move the ground
    ground.velocityX = -(6+score/100);
    //scoring
    //score = score + Math.round(frameCount/60);
    if(frameCount%5 ===0){
    score = score + 1}
    if(score%300 === 0 && score>0){
      checkPointSound.play()
    }
    
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
    
    //jump when the space key is pressed
    if(keyDown("space")&& trex.y >=height-80) {
        trex.velocityY = -13;
        jumpSound.play()
    }
    
    //add gravity
    trex.velocityY = trex.velocityY + 0.8
  
    if(chkbox.checked()){
       
      trex.setCollider("circle",40,0,40);
      if(obstaclesGroup.isTouching(trex)){
       
        trex.velocityY = -13
      }
      
       }
    else{
      
      trex.setCollider("circle",0,0,40);
      if(obstaclesGroup.isTouching(trex)){
        gameState = END;
        dieSound.play();      
      }
    }
    //spawn the clouds
    spawnClouds();
  
    //spawn obstacles on the ground
    spawnObstacles();
    
     gameOver.visible = false;
     restart.visible = false;
    
  }
   else if (gameState === END) {
    ground.velocityX = 0;
     trex.velocityY = 0;
     obstaclesGroup.setVelocityXEach(0);
     cloudsGroup.setVelocityXEach(0);
     obstaclesGroup.setLifetimeEach(-1);
     cloudsGroup.setLifetimeEach(-1);
     
     trex.changeAnimation("collided" , trex_collided);
     
     gameOver.visible = true;
     restart.visible = true;
     
     if(mousePressedOver(restart)){
       reset();
     }
     
   }
  
 
  //stop trex from falling down
  trex.collide(invisibleGround);
  
  
  
  drawSprites();
}

function spawnObstacles(){
 if (frameCount % 60 === 0){
   var obstacle = createSprite(width,height-35,10,40);
   obstacle.velocityX = -(6+score/100);
   
    //generate random obstacles
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
      case 6: obstacle.addImage(obstacle6);
              break;
      default: break;
    }
   
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.5;
    obstacle.lifetime = 300;
   
   //add each obstacle to the group
    obstaclesGroup.add(obstacle);
 }
}

function spawnClouds() {
  //write code here to spawn the clouds
   if (frameCount % 60 === 0) {
    var cloud = createSprite(600,100,40,10);
    cloud.y = Math.round(random(10,height/3));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;
    
     //assign lifetime to the variable
    cloud.lifetime = 134;
    
    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //adding cloud to the group
   cloudsGroup.add(cloud);
    }
  
}

function reset(){
  gameState = PLAY;
  scores.push(score)
  if(highScore < score){
    highScore = score
  }
  score = 0;
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  trex.changeAnimation("running", trex_running);
  
}

