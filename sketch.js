var space, spaceImg
var bottomGround
var topGround
var rocket, rocketImg
var obstacleTop, obsTop1, obsTop2
var obstacleBottom, obsBottom1, obsBottom2, obsBottom3
var gameOver, gameOverImg
var restart, restartImg

var score = 0;

var PLAY = 1;
var END = 0;
var gameState = PLAY;


function preload()
{
spaceImg = loadImage("assets/space.png")

rocketImg = loadAnimation("assets/rocket.png");

obsTop1 = loadImage("assets/obsTop1.png")
obsTop2 = loadImage("assets/obsTop2.png")

obsBottom1 = loadImage("assets/obsBottom1.png")
obsBottom2 = loadImage("assets/obsBottom2.png")
obsBottom3 = loadImage("assets/obsBottom3.png")

gameOverImg= loadImage("assets/gameOver.png")
restartImg = loadImage("assets/restart.png")

jumpSound = loadSound("assets/jump.mp3");
dieSound = loadSound("assets/die.mp3");
}

function setup()
{
  createCanvas(500,400);

//background image
space = createSprite(300,300,1,1);
space.addImage(spaceImg);
space.scale = 2;

//creating top and bottom grounds
bottomGround = createSprite(200,390,800,20);
bottomGround.visible = false;

topGround = createSprite(200,10,800,20);
topGround.visible = false;
      
//creating rocket    
rocket = createSprite(100,200,20,50);
rocket.addAnimation("rocket",rocketImg);
rocket.scale = 0.3;

topObstaclesGroup = new Group();
bottomObstaclesGroup = new Group();
barGroup = new Group();

gameOver = createSprite(240,200);
restart = createSprite(240,240);
gameOver.addImage(gameOverImg);
gameOver.scale = 0.7;
restart.addImage(restartImg);
restart.scale = 0.5;
gameOver.visible = false;
restart.visible = false;
}

function draw() 
{
  background("black");

         if(gameState === PLAY)
         {
          //making the rocket jump
          if(keyDown("space")) 
          {
            rocket.velocityY = -5 ;
            jumpSound.play();
          }

          //adding gravity
           rocket.velocityY = rocket.velocityY + 2;

           Bar();

           spawnObstaclesTop();
        spawnObstaclesBottom();

        //condition for END state
        if(topObstaclesGroup.isTouching(rocket) || rocket.isTouching(topGround)
        || rocket.isTouching(bottomGround) || bottomObstaclesGroup.isTouching(rocket))
        {
        
        gameState = END;
        dieSound.play();
        }
    }  

    if(gameState === END) 
    {
          gameOver.visible = true;
          gameOver.depth = gameOver.depth+1
          restart.visible = true;
          restart.depth = restart.depth+1
          
          //all sprites should stop moving in the END state
          rocket.velocityX = 0;
          rocket.velocityY = 0;
          topObstaclesGroup.setVelocityXEach(0);
          bottomObstaclesGroup.setVelocityXEach(0);
          barGroup.setVelocityXEach(0);
  
          //setting -1 lifetime so that obstacles don't disappear in the END state
          topObstaclesGroup.setLifetimeEach(-1);
          bottomObstaclesGroup.setLifetimeEach(-1);
         
          rocket.y = 200;
          
          //resetting the game
          if(mousePressedOver(restart)) 
          {
                reset();
          }
    } 
   
        drawSprites();
        Score(); 
    
}

function reset()
{
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  topObstaclesGroup.destroyEach();
  bottomObstaclesGroup.destroyEach();

  score = 0;
}

function spawnObstaclesTop() 
{
      if(World.frameCount % 60 === 0) 
      {
        obstacleTop = createSprite(500,280,40,50);
    
    obstacleTop.scale = 0.2;
    obstacleTop.velocityX = -4;

    //random y positions for top obstacles
    obstacleTop.y = Math.round(random(10,100));

    //generate random top obstacles
    var rand = Math.round(random(1,2));
    switch(rand) 
    {
      case 1: obstacleTop.addImage(obsTop1);
              break;
      case 2: obstacleTop.addImage(obsTop2);
              break;
      default: break;
    }

     //assign lifetime to the variable
   obstacleTop.lifetime = 200;
    
   rocket.depth = rocket.depth + 1;

   topObstaclesGroup.add(obstacleTop);
   
       }
}

function spawnObstaclesBottom() 
{
      if(World.frameCount % 60 === 0) 
      {
        obstacleBottom = createSprite(400,350,40,50);
    
    obstacleBottom.addImage(obsBottom1);
    obstacleBottom.debug=false

    obstacleBottom.scale = 0.2;
    obstacleBottom.velocityX = -4;
    
   //generate random bottom obstacles
    var rand = Math.round(random(1,3));
    switch(rand) {
      case 1: obstacleBottom.addImage(obsBottom1);
              break;
      case 2: obstacleBottom.addImage(obsBottom2);
              break;
      case 3: obstacleBottom.addImage(obsBottom3);
              break;
      default: break;
    }

     //assign lifetime to the variable
   obstacleBottom.lifetime = 200;
    
   rocket.depth = rocket.depth + 1;

   bottomObstaclesGroup.add(obstacleBottom);
   
       }
}

 function Bar() 
 {
         if(World.frameCount % 60 === 0)
         {
           var bar = createSprite(500,200,10,800);
          bar.velocityX = -6
          bar.depth = rocket.depth;
          bar.lifetime = 70;
          bar.visible = false;

          barGroup.add(bar);
         }
}

function Score()
{
         if(rocket.isTouching(barGroup))
         {
           score = score + 1;
         }
        textFont("algerian");
        textSize(30);
        fill("orange");
        text("Score: "+ score, 350, 50);

}


