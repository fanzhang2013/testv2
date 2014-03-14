function pd( func ) {
return function( event ) {
event.preventDefault()
func && func(event)
}
}

document.ontouchmove = pd()
var app = {
view: {},
model:{}
}
var bb = {
view: {},
model:{}
}

var browser = {
android: /Android/.test(navigator.userAgent)
}
browser.iphone = !browser.android





bb.init = function() {
var scrollContent = {
scroll: function() {
var self = this
setTimeout( function() {
if( self.scroller ) {
self.scroller.refresh()
}
else {
self.scroller = new iScroll( $("div[data-role='content']")[0] )
}
},1)
}
}
//model
bb.model.Item=Backbone.Model.extend(_.extend({
  defaults:{text:''},
  initialize:function(){
    var self=this
    _.bindAll(self)
  }
}))

bb.model.Items=Backbone.Collection.extend(_.extend({
  model:bb.model.Item,
  url: '/api/rest/todo',
  initialize:function(){
    var self=this
    _.bindAll(self)
    self.count=0
    self.on('reset',function() {
        self.count = self.length
      })
},
  additem:function(thing)
  {
    var self = this
      var item = new bb.model.Item({
        text: thing
        //location: {lat:'1213',lont:'2344'}
      })
      console.log(item)
      self.add(item)
      self.count++
      item.save() 
  }
}))


//views
bb.view.Head=Backbone.View.extend(_.extend({
  events:{
    'tap #add':function(){
      var self=this;
      var thing=self.input.val();
      self.items.additem(thing);
    }

  },
  initialize:function(items){
    var self=this;
    _.bindAll(self);
    self.setElement("div[data-role='popup']");
    self.input = self.$("#new-todo");
    self.items=items;
  }
}))

bb.view.List = Backbone.View.extend(_.extend({
initialize: function(items) {
var self = this
_.bindAll(self);
self.setElement('#list')
self.tm = {
item: _.template( self.$el.html() )
}
self.items=items
self.items.on('add',self.appenditem)
},
render: function() {
var self = this
self.$el.empty()
self.items.each(function(item){
  self.appenditem(item)
})
},
appenditem:function(item){
  var self=this
  var html=self.tm.item(item.toJSON())
  self.$el.append(html)
  self.scroll()
}
},scrollContent))
}

app.init_browser = function() {
if( browser.android ) {
$("#main div[data-role='content']").css({
bottom: 0
})
}
}
app.init = function() {
console.log('start init')
bb.init()
app.init_browser()
app.model.items=new bb.model.Items()
app.view.Head = new bb.view.Head(app.model.items)
app.view.list = new bb.view.List(app.model.items)
app.view.list.render()
console.log('end init')
}
$(app.init)

_.templateSettings = {
interpolate: /\{\{(.+?)\}\}/g,
escape: /\{\{-(.+?)\}\}/g,
evaluate: /\{\{=(.+?)\}\}/g
};

