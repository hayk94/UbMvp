FlowRouter.route('/',{
  action: function () {
    BlazeLayout.render("mainLayout", {content: "home"});
  }
});

// FlowRouter.route('/:postId',{
//   action: function () {
//     BlazeLayout.render('body', {content:"blogPost"});
//   }
// })
FlowRouter.route('/ips',{
  action: function () {
    BlazeLayout.render('mainLayout', {content:"ips"});
  }
})
