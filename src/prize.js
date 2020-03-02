class Prize{

    constructor(avatar){
        this.tag = document.getElementById("prize")
    }

    // Sets the location on the DOM 
    setLocation(left, top){
        console.log("setting location at (", left, ", ", top, ")")
        this.tag.style.top = top
        this.tag.style.left = left
    }
}
