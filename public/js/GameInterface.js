//GameInterface Class
var GameInterface = function (properties, data) {
    this.data = data;
    this.header = null;
    this.body = null;
    this.footer = null;
    this.quests = [];
    this.inventarItems = [];
    this.unreadQuests = 0;
    this.socket = null;

    this.initialize(properties.header, properties.body, properties.footer);
};

GameInterface.prototype.initialize = function (_header, _body, _footer) {
    this.header = new Header(_header, this);
    this.body = new Container(_body, this);
    this.footer = new Container(_footer, this);
    
    
    this.loadInitialData();
    this.loadData();
};

GameInterface.prototype.loadInitialData = function () {
    //Quests
    var that = this;

    //Dummy data
    this.data.finishedQuests.push({
        _id: 123312,
        title: "nur ein test",
        description: {
            html: "nochmal Hallo",
            name: "Hallo"
        },
        started: false
    });
    
    $.each(that.data.availableQuests, function (index) {
        var quest = that.data.availableQuests[index];
        that.quests[quest._id] = {
            clicked: false,
            finished: false,
            data: quest
        };
        that.unreadQuests ++;
    });
    $.each(that.data.finishedQuests, function (index) {
        var quest = that.data.finishedQuests[index];
        that.quests[quest._id] = {
            clicked: false,
            finished: true,
            data: quest
        };
        that.unreadQuests ++;
    });
    this.footer.buttons.taskButton.addCount(that.unreadQuests, "update");
    
    this.getPosition();
    this.body.map.drawMapItems();
    //$.each(this.data.availableQuests, function (index) {
       //console.log(that.data.availableQuests[index]);
    //});
    //$.each(this.data.finishedQuests, function (index) {
       //console.log(that.data.availableQuests[index]);
    //});
    
};

GameInterface.prototype.getPosition = function () {
    var GI = this;
    
    GI.body.map.updatePlayerPos(51.969430, 7.595814);
    
    document.addEventListener('deviceready', function () {
        console.log(GI);
        //GI.body.map.addLocator();
        
        var geolocationSuccess = function (position) {
            lat = position.coords.latitude;
            lng = position.coords.longitude;
            GI.body.map.updatePlayerPos(lat, lng);
        }
        // onError Callback receives a PositionError object
        //
        function geolocationError(error) {
            console.log(error);
        }
        var watchId = navigator.geolocation.watchPosition(geolocationSuccess, geolocationError);
        
    }, false);
};

GameInterface.prototype.loadData = function () {
    var that = this;
    //this.socket = io.connect("http://giv-mgl.uni-muenster.de:3035"); 
    /*
    this.socket.on("Quest", function (data) {
        if (that.quests[data.quest._id]) {
            that.quests[data.quest._id].data = data;
            console.log(data);
        } else {
            that.quests[data.quest._id] = {
                data: data,
                clicked: false
            }
            that.unreadQuests ++;
            that.footer.buttons.taskButton.addCount(that.unreadQuests, "update");
        } 
    });
    this.socket.emit("addClient" , {
        clientName: "Jonas"
    });
    
    this.socket.on("Player", function (data) {
        console.log(data);
    });
    this.socket.on("MapItem", function (data) {
        console.log(data);
    });
    this.socket.on("InventarItem", function (data) {
        console.log(data);
    });
    this.socket.on("Quest", function (data) {
        console.log(data);
        $.each(data, function (index) {
            if (that.quests[data[index].ID]) {
                that.quests[data[index].ID].data = data[index];
            } else {
                that.quests[data[index].ID] = {
                    data: data[index],
                    clicked: false
                };   
                that.unreadQuests ++;
                that.footer.buttons.taskButton.addCount(that.unreadQuests, "update");
            } 
        });
    });
    this.socket.on("QuestEvent", function (data) {
        console.log(data);
    });
    
    this.socket.emit("Quest", {
        operation: "active",
        id: "5589372dc3c9618a348075ee"
    });*/
};