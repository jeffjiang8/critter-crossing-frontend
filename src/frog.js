const FROG_MOVE_INC = 10; // in px

class Frog {

    constructor(avatar){
        this.tag = document.getElementById("frog")
        this.onLog = false;
        this.log = ""
        this.onWinStrip = false
    }


    move(dir, gameBoard, inc = FROG_MOVE_INC) {
    
        let left = parseInt(this.tag.style.left.replace("px", ""));
        let top = parseInt(this.tag.style.top.replace("px", ""));
       
        switch (dir){

            case "left":
                if (left > gameBoard.LEFT_EDGE + 5) {
                    this.tag.style.left = `${left - inc}px`;
                }
                break;
            case "right":
                if (left < gameBoard.RIGHT_EDGE - 35) {
                    this.tag.style.left = `${left + inc}px`;
                }
                break;
            case "up":
                if (top > gameBoard.TOP_EDGE + 7) {
                    this.tag.style.top = `${top - inc}px`;
                }
                break;
            case "down":
                if (top < gameBoard.BOTTOM_EDGE - 35) {
                    this.tag.style.top = `${top + inc}px`;
                }
                break;

        }
        
 
        
    }
    
}
