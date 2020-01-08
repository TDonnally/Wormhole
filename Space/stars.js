/*
1) slider that will change the overall speed of the stars
2) Finish ship
3) Fix rotation speed up glitch
*/

//Our ship created using ZDog library
const ship = new Zdog.Illustration({
    element: '#ship',
    resize: 'fullscreen',
    zoom: 2,
    rotate: {x:Zdog.TAU/5},
    dragRotate: true
  })
const body = new Zdog.Shape({
    addTo: ship,
    path: [ // triangle
      { x:   0, y: -40 },
      { x:  40, y:  40 },
      { x: -40, y:  40 },
    ],
    // closed by default
    stroke: 5,
    color: '#F90000',
    fill: true
  });
const dome = new Zdog.Hemisphere({
    addTo: ship,
    diameter: 20,
    stroke: false,
    color: '#FF6500',
    translate: {z:3, y:20}
  });

const leftEngine = new Zdog.Cylinder({
    addTo: ship,
    diameter: 20,
    length: 20,
    translate:{x: -40, y:40},
    rotate: {x:Zdog.TAU/4},
    stroke: false,
    color: '#7A0000',
    backface: '#FF6500'
  });
const rightEngine = new Zdog.Cylinder({
    addTo: ship,
    diameter: 20,
    length: 20,
    translate:{x: 40, y:40},
    rotate: {x:Zdog.TAU/4},
    stroke: false,
    color: '#7A0000',
    backface: '#FF6500'
  }); 
const leftFire = new Zdog.Cone({
    diameter: 15,
    length: 40,
    stroke: false,
    translate:{z:-10},
    rotate: {x:Zdog.TAU/2},
    color: '#2C9BB5',
    zoom:2
  });
const rightFire = new Zdog.Cone({
    diameter: 15,
    length: 40,
    stroke: false,
    translate:{z:-10},
    rotate: {x:Zdog.TAU/2},
    color: '#2C9BB5',
    zoom:2
  });      
rightEngine.addChild(rightFire);
leftEngine.addChild(leftFire);


var c = document.getElementById("canvas");
var ctx = c.getContext("2d");
var stars = new Array();
var slider = document.getElementById("speed");
var speed = slider.value;


//creates 50 instances of stars throughout canvas at init
for(i = 0; i<50;i++){
    let originX = Math.floor(Math.random() * canvas.width);
    let originY = Math.floor(Math.random() * canvas.height);
    let xDirection = Math.floor(Math.random() * 25 + 1)/50; 
    let yDirection = Math.floor(Math.random() * 25 + 1)/50; 
    if (originX < canvas.width/2 & originY < canvas.height/2){
        stars.push(new createStar(originX, originY, -xDirection, -yDirection));
    }
    else if(originX > canvas.width/2 & originY < canvas.height/2){
        stars.push(new createStar(originX, originY, xDirection, -yDirection));
    }
    else if(originX < canvas.width/2 & originY > canvas.height/2){
        stars.push(new createStar(originX, originY, -xDirection, +yDirection));
    }
    else if(originX > canvas.width/2 & originY > canvas.height/2){
        stars.push(new createStar(originX, originY, xDirection, +yDirection));
    }
    
}

//default settings for instances of stars
function createStar(xStart, yStart, movementX, movementY){
    this.xStart = (typeof xStart !== 'undefined') ? xStart : c.width/2;
    this.yStart = (typeof yStart !== 'undefined') ? yStart : c.height/2;
    this.movementX = (typeof movementX !== 'undefined') ? movementX : Math.floor(Math.random() * 50-25)/50;
    this.movementY = (typeof movementY !== 'undefined') ? movementY : Math.floor(Math.random() * 50-25)/50;
    ctx.beginPath();
    ctx.strokeStyle = "white";
    ctx.fillStyle = "white";
    ctx.rect(xStart, yStart, 1, 1);
    ctx.stroke();
}

var timer = 0;
var size = 1.0;
var negative = true;
var denominator = 90;

//loop of all things rendered to the canvas
function animate(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    timer++;
    if (timer == 2){
        stars.push(new createStar());
        timer = 0;
    }
        
    //loop through all instances of createStar() in the star array and update their position.
    for(i = 0; i<stars.length; i++){
        var s=stars[i]
        ctx.beginPath();
        ctx.strokeStyle = "white";
        ctx.rect(s.xStart+=(s.movementX+(s.movementX*speed)), s.yStart+=(s.movementY+(s.movementY*speed)), 1, 1);

        //remove stars off screen
        if (s.xStart < 0 || s.xStart>c.width || s.yStart<0 || s.yStart>c.height){
            stars.splice(i,1);
            i--;
        }
        
        //ensures no stars are permanetly in middle of screen
        if (s.movementX == 0 & s.movementY == 0){
            stars.splice(i,1);
            i--;
        }
        ctx.stroke();  
    }

    //ship movement and render
    if (flyLeft == true){
        if (ship.rotate.y<1){
            ship.rotate.y +=.1;
        }
    }
    else if (flyRight == true){
        if (ship.rotate.y>-1){
            ship.rotate.y -=.1;
        }
    }
    
    ship.zoom = 2/(Math.sqrt(speed));
    
    rightFire.zoom = size;
    leftFire.zoom = size;
    if (size > 2.0){
        negative = true;
      }
    else if (size < 1.1){
        negative = false;
      }
    if (negative == false){
        size += 1/denominator;
      }
    else{
        size -= 1/denominator;
      }
    rightFire.zoom = size;
    leftFire.zoom = size;

    ship.updateRenderGraph();

    requestAnimationFrame(animate);
}
requestAnimationFrame(animate);

var flyLeft = false;
var flyRight = false;

//Handles logic after inputs
document.addEventListener('keydown', function(event) {
    if (event.code == 'KeyA') {
        flyLeft = true;
        flyRight = false;
    }
    else if (event.code == 'KeyD'){
        flyRight = true;
        flyLeft = false;
    }
  });

  slider.oninput = function(){
      speed = slider.value;
      console.log(speed);
  }