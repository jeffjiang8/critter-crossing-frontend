let CAR_MOVE_TIME = 1000 //175// in ms
let CAR_ADD_TIME = 20000 // 800  // in ms
let LOG_MOVE_TIME = 175
let LOG_ADD_TIME = 2000
const VEHICLE_MOVE_INC = 10 // in px
const LOG_MOVE_INC = 10 // in px

 //intervals
let moveCarInterval
let addCarInterval 
let moveLogInterval
let addLogInterval
let freezeInterval
let reloadInterval

class Game{
    constructor(){
        this.gameBoard = new GameBoard(this)
        this.frog = new Frog("")
        this.prize = new Prize("")
        this.lives = 3
        this.paused = true;
        this.firstGo = true;
        this.level = 1;
        this.count = 3;
        this.locked = false
        this.tag = document.getElementById("game-holder")
    }

    // handles all key presses (arrows and space bar)
    keyDownHandler = (e) => {

        // IF THE GAME IS GOING
        if(!this.paused){
          
            if (e.key === "ArrowLeft") {
                this.frog.move("left", this.gameBoard)
                this.checkForWinOrLoss()
            }
            if (e.key === "ArrowRight") {
                this.frog.move("right", this.gameBoard);
                this.checkForWinOrLoss()
            }
            if (e.key === "ArrowUp") {
                this.frog.move("up", this.gameBoard);
                this.checkForWinOrLoss()
            }
            if (e.key === "ArrowDown") {
                this.frog.move("down", this.gameBoard);
                this.checkForWinOrLoss()
            }
            if (e.keyCode === 32){ // SPACE BAR
                console.log("PAUSING")  
                this.pause()       
            }
        }else{ // IF THE GAME IS PAUSED
            
    
            // If User Hits Enter
            if(e.keyCode === 13 ){
             
                this.gameBoard.lifeOverlay.style.display = "none"
                this.gameBoard.spacebarOverlay.style.display = "block"
                this.locked = false

            }

            //hit spacebar
            if (e.keyCode === 32 && !this.locked){
    
                this.paused = !this.paused
                this.gameBoard.pauseOverlay.style.display = "none"
                this.gameBoard.startOverlay.style.display = "none"
                this.gameBoard.spacebarOverlay.style.display = "none"
                
                //Set the car move interval
                moveCarInterval = setInterval(this.moveCars, CAR_MOVE_TIME)
                moveLogInterval = setInterval(this.moveLogs, LOG_MOVE_TIME)
                
                //Set the add car interval
                addCarInterval = setInterval(this.getACar, CAR_ADD_TIME)
                addLogInterval = setInterval(this.getALog, LOG_ADD_TIME)
                
                if(this.firstGo){
                  
                    this.firstGo = false
                    this.count = 3;

                    document.removeEventListener("keydown", this.keyDownHandler)
                    
                    //make the three visivle
                    this.gameBoard.countdownOverlay.innerText =  this.count;
                    this.gameBoard.countdownOverlay.style.display = "block";
                  
                    //set an interval for 1 second to change innerHTML

                    this.gameBoard.setCountDown()

                    //set interval to start the listener after the 3 seconds
                    freezeInterval = setInterval(this.addListener, 4000)
                    
                }
                
            }

        }
        
    }

    // adds the keydown listener to the document
    addListener =()=>{
        document.addEventListener("keydown", this.keyDownHandler)
        clearInterval(freezeInterval)
    }

    // ================================  CAR STUFF =======================================================
    getACar = () =>{
        Adapter.getCar(this)
    }
    getALog = () =>{
        this.gameBoard.addLog()
    }

    // Moves all the cars by one increment. Set with an interval
    moveCars = () =>{
        Vehicle.tags.forEach((vehicle, index) => {
            let left = parseInt(vehicle.style.left.replace("px", ""))
            if(vehicle.dataset.dir === "east"){
                if (left < this.gameBoard.WIDTH + 20) {
                    vehicle.style.left = `${left + LOG_MOVE_INC}px`;
                }else{
                    this.gameBoard.removeVehicle(vehicle, index)
                    Vehicle.tags.splice(index,1)
                }
              
            }else {
                if (left > -80) {
                    vehicle.style.left = `${left - LOG_MOVE_INC}px`;
                }else{
                    this.gameBoard.removeVehicle(vehicle, index)
                    Vehicle.tags.splice(index,1)
                }
            }
            this.checkConflict(vehicle) 
        })
        
    }


    moveLogs = () => {
        Log.tags.forEach((log, index) => {
            let moveFrog = false
            if(this.frog.onLog && this.frog.log === log){
                moveFrog = true;
                console.log("THAT FROG IS ON A LOG")
            }

            let left = parseInt(log.style.left.replace("px", ""))

            if(log.dataset.dir === "east"){
                if (left < this.gameBoard.WIDTH + 10) {
                    log.style.left = `${left + LOG_MOVE_INC}px`;
                    if(moveFrog){
                        this.frog.move("right", this.gameBoard, LOG_MOVE_INC)
                    }
                }else{
                    //remove it from DOM and Logs array
                    Log.tags.splice(index,1)
                    this.gameBoard.removeLog(log)
                }     
            }else {
                if (left > -70) {
                    log.style.left = `${left - LOG_MOVE_INC}px`;
                    if(moveFrog){
                        this.frog.move("left", this.gameBoard, LOG_MOVE_INC)
                    }
                }else{
                    
                    //remove it from DOM and Logs array
                    Log.tags.splice(index,1)
                    this.gameBoard.removeLog(log)
               
                }
            }
        })
    }

    // =====================================  Game Instance Stuff =========================================================

    // Set the level
    setLevel(level){
        this.level = level
        this.CAR_MOVE_TIME = CAR_MOVE_TIME - this.level * 50//= 200 // in ms
        this.CAR_ADD_TIME = CAR_ADD_TIME - this.level * 200//= 1000 // in ms
    }

    setChinaLevel(){
        this.CAR_MOVE_TIME = 10 //ms
        this.CAR_ADD_TIME = 10//ms
    }

    // Set the frog avatar
    setFrog(avatar){
        this.frog.avatar = avatar
        this.frog.tag.innerText = avatar
        this.gameBoard.resetFrog(this.frog)
    }

    // Set the prize 
    setPrize(avatar){
        this.prize.avatar = avatar
        this.prize.tag.innerText = avatar
        this.gameBoard.placePrize(this.prize)
    }


    //================================  PAUSE AND GO AND SETUP =========================================================

    // Stop all the cars moving and being added
    stopTheCars(){
        //remove the car mover listeners
        clearInterval(moveCarInterval)
        clearInterval(moveLogInterval)
        clearInterval(addCarInterval)
        clearInterval(addLogInterval)

    }

    // Pause the game
    pause(){
        this.paused = !this.paused
        this.stopTheCars()
        this.gameBoard.pauseOverlay.style.display = "block"
    }

    winPause(){
        this.gameBoard.setCountDown()
    }

    // Reload the page after game over
    resetGame(){
        location.reload()
    }

    // Reset cars and decrease lives, reset game
    setupNextLife(){
        this.paused = true;
        this.firstGo= true;
        this.locked = true;

        this.stopTheCars()

        this.lives -= 1

        this.gameBoard.resetFrog(this.frog)
        
        this.gameBoard.removeAllVehicles()
        this.gameBoard.removeAllLogs()
        Adapter.getStartingCars(this)
    }

    //====================================== FROG CONFLICT STUFF ==============================================================

    // When frog is hit by a car
    frogHit(){

        if(this.lives <= 1){

            //display that you died
            this.gameBoard.deathOverlay.style.display="block"
            this.stopTheCars()
            document.removeEventListener("keydown", this.keyDownHandler)

            // reset the game (reload page) in 4 seconds
            reloadInterval = setInterval(this.resetGame, 4000)

        }else{
        
            let span = this.gameBoard.lifeOverlay.getElementsByTagName("span")[0]
            span.innerText = `Lives remaining: ${this.lives - 1}`
            this.gameBoard.lifeOverlay.style.display="block"
  
            this.setupNextLife()
        }
    }

    // Show the win overlay
    youWin(){
        this.stopTheCars()

        document.removeEventListener("keydown", this.keyDownHandler)
        this.gameBoard.winOverlay.style.display = "block"
        

        if(this.level < 3){
            console.log("moving on")
            this.setLevel(this.level + 1)
            this.setupNextLife()
            this.lives = 3
        } else if (this.level === 3){
            this.setChinaLevel()
        }

    }

    checkForLog(){
        if(this.frog.onLog){

            this.frog.onLog = false
            //see if it just hopped off the log
            Log.tags.forEach(log => {
                this.checkConflict(log)
            })
            if(!this.frog.onLog){
                console.log("YOU LEFT THE LOG")
            }

        }else{ // see if it just hopped onto a log
            Log.tags.forEach(log => {
                this.checkConflict(log)
            })
        }
    }

    // Check conflict against prize and cars
    checkForWinOrLoss = ()=>{
        this.checkForLog()
       // this.checkConflict(this.gameBoard.winStrip)
        this.checkConflict(this.prize.tag)
        this.checkConflict(this.gameBoard.riverTag)
        Vehicle.tags.forEach(vehicle => this.checkConflict(vehicle), this)
    }


    // check conflict between this.frog and given tag
    checkConflict(itemTag){
        
        let buffer = 7
        let frogBuffer = 9;
        if(itemTag.className === "log"){
            buffer = 3
        }
        // else if(itemTag.id === "winStrip"){
        //     buffer = -5
        // }
        
        
        let frogXMin = parseInt(this.frog.tag.style.left.replace("px", "")) +frogBuffer 
        let frogXMax = frogXMin + this.frog.tag.offsetWidth - 2*frogBuffer
        let frogYMin = parseInt(this.frog.tag.style.top.replace("px", "")) + frogBuffer 
        let frogYMax = frogYMin + this.frog.tag.offsetHeight - 2*frogBuffer

        let itemXMin = parseInt(itemTag.style.left.replace("px", "")) + buffer
        let itemXMax = itemXMin + itemTag.offsetWidth - 2*buffer
        let itemYMin = parseInt(itemTag.style.top.replace("px", "")) + buffer
        let itemYMax = itemYMin + itemTag.offsetHeight - 2*buffer

        // CHECK IF FROG OVERLAPS
        if(frogXMin > itemXMin && frogXMin < itemXMax || frogXMax > itemXMin && frogXMax < itemXMax){
            if(frogYMin > itemYMin && frogYMin < itemYMax || frogYMax  > itemYMin && frogYMax < itemYMax){
                
                // we're comaparing to log so you're safe
                if (itemTag.className === "log"){
                    console.log("YOU'RE ON A LOG!")
                    this.frog.onLog = true;
                    this.frog.log = itemTag
               
                // We're comparing to the prize so you win
                // }else if(itemTag.id === "winStrip"){
                //     console.log("YA ON THE WIN STRIP")
                //     this.frog.onLog = false
                //     //this.frog.onWinStrip = true

                }else if(itemTag.id === "prize"){
                    console.log("YOU HIT THE PRIZE")
                    this.youWin()

                // you hit river
                }else if(itemTag.id === "river"){
                    if(!this.frog.onLog ){//&& !this.frog.onWinStrip){
                        console.log("YOU ARE ON THE RIVER AND NOT ON A LOG")
                        this.frogHit()
                    }

                }else{ // hit a car
                    console.log("YOU HIT A VEHICLE")
                    this.frogHit()
                }  
            }
        }
    }


} // END OF GAME CLASS
