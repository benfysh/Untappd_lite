function MainAssistant(url) {
	/* this is the creator function for your scene assistant object. It will be passed all the 
	   additional parameters (after the scene name) that were passed to pushScene. The reference
	   to the scene controller (this.controller) has not be established yet, so any initialization
	   that needs the scene controller should be done in the setup function below. */
  this.url = 'm.untappd.com';
}

MainAssistant.prototype.setup = function() {
	/* this function is for setup tasks that have to happen when the scene is first created */
		
	/* use Mojo.View.render to render view templates and add them to the scene, if needed */
	
	/* setup widgets here */
	
	/* add event handlers to listen to events from widgets */
  this.controller.setupWidget('web-view', {url:this.url,cacheAdapter:false});

  this.reloadModel = {
    label: $L('Reload'),
    icon: 'refresh',
    command: 'refresh'
  };

  this.stopModel = {
    label: $L('Stop'),
    icon: 'load-progress',
    command: 'stop'
  };

  this.cmdMenuModel = {
    visible: true,
    items: [ {} ]
  };

  this.progress = this.progress.bind(this);
  this.started = this.started.bind(this);
  this.stopped = this.stopped.bind(this);
  this.finished = this.finished.bind(this);
  
  
  Mojo.Event.listen(this.controller.get('web-view'), Mojo.Event.webViewLoadProgress, this.progress);
  Mojo.Event.listen(this.controller.get('web-view'), Mojo.Event.webViewLoadStarted, this.started);
  Mojo.Event.listen(this.controller.get('web-view'), Mojo.Event.webViewLoadStopped, this.stopped);
  Mojo.Event.listen(this.controller.get('web-view'), Mojo.Event.webViewLoadFailed, this.stopped);
  Mojo.Event.listen(this.controller.get('web-view'), Mojo.Event.webViewDidFinishDocumentLoad, this.stopped);
  Mojo.Event.listen(this.controller.get('web-view'), Mojo.Event.webViewDownloadFinished, this.finished);
  this.controller.setupWidget(Mojo.Menu.commandMenu, {menuClass:'no-fade'}, this.cmdMenuModel);
}

MainAssistant.prototype.activate = function(event) {
	/* put in event handlers here that should only be in effect when this scene is active. For
	   example, key handlers that are observing the document */
   try {
      Mojo.Log.info("CLEARING CACHE");
    var mywebview = this.controller.get('web-view');
	mywebview.mojo.clearCache();
   } catch(e) {
      Mojo.Log.error("ERROR CLEARING CACHE FOR WEBVIEW : " + e.message);
   }	   
}

MainAssistant.prototype.started = function(event) {
  this.cmdMenuModel.items.pop(this.reloadModel);
  this.cmdMenuModel.items.push(this.stopModel);

  this.controller.modelChanged(this.cmdMenuModel);

  this.currLoadProgressImage = 0;
}

MainAssistant.prototype.stopped = function(event) {
  this.cmdMenuModel.items.pop(this.stopModel);
  this.cmdMenuModel.items.push(this.reloadModel);
  this.controller.modelChanged(this.cmdMenuModel);
}

MainAssistant.prototype.finished = function(event) {

}

MainAssistant.prototype.deactivate = function(event) {
	/* remove any event handlers you added in activate and do any other cleanup that should happen before
	   this scene is popped or another scene is pushed on top */
}

MainAssistant.prototype.cleanup = function(event) {
	/* this function should do any cleanup needed before the scene is destroyed as 
	   a result of being popped off the scene stack */
  Mojo.Event.stopListening(this.controller.get('web-view'), Mojo.Event.webViewLoadProgress, this.progress);
  Mojo.Event.stopListening(this.controller.get('web-view'), Mojo.Event.webViewLoadStarted, this.started);
  Mojo.Event.stopListening(this.controller.get('web-view'), Mojo.Event.webViewLoadStopped, this.stopped);
  Mojo.Event.stopListening(this.controller.get('web-view'), Mojo.Event.webViewLoadFailed, this.stopped);
  Mojo.Event.stopListening(this.controller.get('web-view'), Mojo.Event.webViewDidFinishDocumentLoad, this.stopped);
  Mojo.Event.stopListening(this.controller.get('web-view'), Mojo.Event.webViewDownloadFinished, this.finished);
}

MainAssistant.prototype.progress = function(event) {
  var percent = event.progress;

  try {
    if (percent > 100) {
      percent = 100;
    }
    else if (percent < 0) {
      percent = 0;
    }
                
                // Update the percentage complete
    this.currLoadProgressPercentage = percent;
                
                // Convert the percentage complete to an image number
    // Image must be from 0 to 23 (24 images available)
    var image = Math.round(percent / 4.1);
    if (image > 23) {
      image = 23;
    }
                
                // Ignore this update if the percentage is lower than where we're showing
    if (image < this.currLoadProgressImage) {
      return;
    }
                
                // Has the progress changed?
    if (this.currLoadProgressImage != image) {
      var icon = this.controller.select('div.load-progress')[0];
      if (icon) {
        this.loadProgressAnimator = Mojo.Animation.animateValue(Mojo.Animation.queueForElement(icon), "linear", this._updateLoadProgress.bind(this), {
          from: this.currLoadProgressImage,
          to: image,
          duration: 0.5
        });
      }
    }
  }
  catch (e) {
    Mojo.Log.logException(e, e.description);
  }
};
MainAssistant.prototype._updateLoadProgress = function(image) {
  // Find the progress image
  image = Math.round(image);
        // Don't do anything if the progress is already displayed
  if (this.currLoadProgressImage == image) {
    return;
  }
  var icon = this.controller.select('div.load-progress');
  if (icon && icon[0]) {
    icon[0].setStyle({'background-position': "0px -" + (image * 48) + "px"});
  }
  this.currLoadProgressImage = image;
};

MainAssistant.prototype.handleCommand = function(event) {
  if (event.type == Mojo.Event.command) {
    switch (event.command) {
      case 'refresh':
        this.controller.get('web-view').mojo.reloadPage();
        break;
      case 'stop':
        this.controller.get('web-view').mojo.stopLoad();
        break;
    }

        this.controller.get('web-view').mojo.getHistoryState(this.temp);
        //console.log("temp" + temp);
  }
};
MainAssistant.prototype.temp = function(event){
        console.log("In htere" + event);
}
 