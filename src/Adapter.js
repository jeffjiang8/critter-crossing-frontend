const BASE_URL = "http://localhost:3000"
const FROG_URL = "/frogs"
const VEHICLE_URL = "/vehicles"
const LANE_URL = "/lanes"

class Adapter{

    // Fetches a random car from the api to add to the given or a random lane
    static getCar(game, lane = Lane.all[Math.floor(Math.random()*5)]){
        
        fetch(`${BASE_URL}${VEHICLE_URL}?limit=1`)
            .then(resp =>resp.json())
            .then(data => {

                let thisVehicle = data[Math.floor(Math.random()*data.length)]
            
                let vehicleTag = document.createElement("img")
                vehicleTag.className = "vehicle"
                vehicleTag.src = thisVehicle.avatar
                vehicleTag.dataset.dir = lane.direction

                // Add this tag to the game board (which will add the the Vehicle tags array) 
                game.gameBoard.appendCar(vehicleTag, lane)
                
                
            })

    }

    // Fetches a car for each lane to begin the round
    static getStartingCars(game){
        
        Vehicle.tags = []
       
        Lane.all.forEach(lane => {
            if (lane.height > 5) {
                game.gameBoard.addLog(lane)
            }else{
                Adapter.getCar(game, lane)
            }
            
        })

    }
    
    static getLanes(game){
        fetch(`${BASE_URL}${LANE_URL}`)
            .then(resp => resp.json())
            .then(data => {
                Lane.all = data
            
                 //load initial cars
                Adapter.getStartingCars(game)
            })
    
    }
    
    static getAvatar(game, id){
        fetch(`${BASE_URL}${FROG_URL}/${id}`)
            .then(resp => resp.json())
            .then(data => {
             
                console.log("the avatar is", data.avatar)
                game.setFrog(data.avatar)
              
                //Hide the form
                game.gameBoard.formOverlay.style.display = "none"
                game.gameBoard.startOverlay.style.display = "block"
                game.setPrize(data.prize)
                game.addListener()
            })
        
    }

    static fetchAllFrogs(game) {
        fetch(`${BASE_URL}${FROG_URL}`)
        .then(resp => resp.json())
        .then(data => game.gameBoard.buildDropDown(data))
    }


}

