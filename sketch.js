//Create variables here

var dog;
var happyDog;
var database
var foodS
var foodStock
var lastFed
var fedTime
var bedroom
//var garden
//var washroom

function preload()
{
  //load images here
  
  var dog = loadImg("dogImg.png");
  var happyDog = loadImg("dogImg1.png");

  var bedroom=LoadImage(images/bedroom.png);
        var garden=LoadImage(images/garden.png);
        var washroom=LoadImage(images/washroom.png);


}

function setup() {
  createCanvas(500, 500);
  
  foodStock=database.ref('Food');
  foodStock.on("value", readStock);

  feed = createButton("Feed the dog");
  feed.position(700,95);
  feed.mousePressed(feedDog);

  addFood = createButton("Add Food");
  addFood.position(800,95);
  addFood.mousePressed(addFoods);


  readState=database.ref('gameState');
  readState.on("value", function(data){
      gameState=data.val();
  })


  
}


function draw() { 
  
  background(46,139,87);

  if(keyWentDown(UP_ARROW)){
    writeStock(foodS);
    dog.addImage(dogHappy);
    display();
    foodStock();
    fedTime=database.ref('FeedTime');
    fedTime.on("value", function(data)){
      lastFed=data.val();
      drawSprites();


      fill(255,255,254);
      textSize(15);
      if(lastFed>=12){
        text("Last Feed : "+ lastFeed%12 + " PM", 350,30);
      }
      else{
        if(lastFeed==0){
          text("Last Feed : 12 AM", 350,30);
        }
        else{
          text("Last Feed : "+ lastFeed + " AM", 350,30);
        }
      }



    };

    curretTime=hour();
    if(currentTime==(lastFed+1)){
      update("Playing");
      foodObj.garden();
    }else if(currentTime==(lastFed+2)){
      update("Sleeping");
      foodObj.bedroom();
    }else if(currentTime>(lastFed+2)&&currentTime<=(lastFed+4)){
      update("Bathing");
      foodObj.washroom();
    }else{
      update("Hungry");
      foodObj.display();
    }

    if(gameState!="Hungry"){
      feed.hide();
      addFood.hide();
      dog.remove();
    }else{
      feed.show();
      addFood.show();
      dog.addImage(sadDog)
    }


    update();
  }

  readStock();
  writeStock();



  textSize(4);
  fill(blue);
  stroke(0.5);
  text("Note: Press UP ARROW KEY TO FEED THE DOG MILK", 128, 300);
  //add styles here

}

function readStock(data){
  foodS=data.val();
} 

function writeStock(x){

  if(x<=0){
    x=0;
  }else{
    x=x-1;
  }

  database.ref('/').update({
    Food:x
  })
}


function addFood(){
  if(dog.fedMilk){
    milk = milk-1;
    dog.image ="dogImg1.png";
}

function feedDog(){
  dog.addImage(happyDog);

  foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  database.ref('/').update({
    Food:foodObj.getFoodStock(),
    FeedTime:hour();
  })
}

function addFoods(){
  foodS++;
  database.ref('/').update({
    Food:foodS
  })
}


function update(state){
  database.ref('/').update({
    gameState:state
  });
}


