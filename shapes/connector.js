Connector = draw2d.shape.basic.Circle.extend({
  init: function (attr) {
    this._super({
      x:100,
      y:100, 
      diameter: 75,
      stroke: attr.stroke, 
      color:  attr.color,
      bgColor: attr.bgColor,
    });
      this.label =  new draw2d.shape.basic.Label({text:"Process",color: 'none'});
      this.label.installEditor(new draw2d.ui.LabelInplaceEditor({}));
      this.add(this.label, new draw2d.layout.locator.CenterLocator());
  },
  getPersistentAttributes: function () {
    var memento = this._super();

    // add all decorations to the memento 
    //
    memento.labels = [];
    this.children.each(function (i, e) {
        var labelJSON = e.figure.getPersistentAttributes();
        labelJSON.locator = e.locator.NAME;
        memento.labels.push(labelJSON);
        
    });
    memento.userData = memento.labels;
    return memento;
  },
  setPersistentAttributes: function(memento) {
    this._super(memento);
    
    // remove all decorations created in the constructor of this element
    //
    this.resetChildren();

    // and add all children of the JSON document.
    //
    $.each(memento.labels, $.proxy(function (i, json) {
        // create the figure stored in the JSON
        var figure = eval("new " + json.type + "()");
        
        // apply all attributes
        figure.attr(json)

        // instantiate the locator
        var locator = eval("new " + json.locator + "()");
        console.log(figure, locator);
        // add the new figure as child to this figure
        this.add(figure, locator);
    }, this));
  }  
})