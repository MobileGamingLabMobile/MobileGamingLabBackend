// Neues Spiel
function addNewGame(event) {

    // Server-Befehle

    var newdiv = document.createElement("div")              // Erzeuge neues <div> als Variable newdiv
    $(newdiv, {                                             // Übergabe der Parameter an das neue <div>:
        id: "game",                                         // ID,
        text: "Klick mich!",                                // Text,
        data:{                                              // Metadaten,
            name : String,
            description : String,
            category : String,
        }
    })
    .css({                                                  // Style-Informationen,
        "height": "100px",
        "width": "200px",
        "text-color": "#fff",
        "background-color": "#29f",
        "margin": "7.5px", 
        "float": "left",
    })
    .on("dblclick", function () {                           // Mit einem Doppelklick wird das <div> geschlossen
        $(this).fadeTo(300, 0, function () {
            $(this).remove();
        })
    })
    document.getElementById("workspace").appendChild(newdiv)     // Anhängen des neues <div> an das mit der ID #test

}

// Neue Quest
function addNewQuest(event) {

    //Server-Befehle

    var newdiv = document.createElement("div")              // Erzeuge neues <div> als Variable newdiv
    $(newdiv, {                                             // Übergabe der Parameter an das neue <div>:
        id: "quest",                                        // ID,
        text: "Klick mich!",                                // Text,
        metadata: {                                         // Metadaten,
        title : String,
        },
    })
    .css({                                                  // Style-Informationen,
        "height": "100px",
        "width": "200px",
        "text-color": "#fff",
        "background-color": "#29b",
        "margin": "7.5px",
        "float": "left",
    })
    .on("dblclick", function () {                           // Mit einem Doppelklick wird das <div> geschlossen
        $(this).fadeTo(300, 0, function () {
            $(this).remove();
        })
    })
    document.getElementById("workspace").appendChild(newdiv)     // Anhängen des neues <div> an das mit der ID #test
}