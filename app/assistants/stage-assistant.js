function StageAssistant() {
	/* this is the creator function for your stage assistant object */
}

StageAssistant.prototype.setup = function() {
	/* this function is for setup tasks that have to happen when the stage is first created */
// Get Cookie
myCookie = new Mojo.Model.Cookie('MyCookie');
cookieData = myCookie.get() || '';

if (cookieData == '') {
  this.controller.pushScene("first");
  myCookie.put({ firstuse: true });
} else {
  this.controller.pushScene("main");
}
};

StageAssistant.prototype.handleCommand = function(inEvent) {

  switch (inEvent.type) {

    case Mojo.Event.commandEnable:
      switch (inEvent.command) {
        case Mojo.Menu.helpCmd:
          inEvent.stopPropagation();
        break;
      }
    break;

    case Mojo.Event.command:
      switch (inEvent.command) {
        case Mojo.Menu.helpCmd:
          this.controller.pushAppSupportInfoScene();
        break;
      }
    break;

  }

};