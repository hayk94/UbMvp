FlowRouter.route('/',{
  action: function () {
    BlazeLayout.render("body", {content: "home"});
  }
});

// FlowRouter.route('/:postId',{
//   action: function () {
//     BlazeLayout.render('body', {content:"blogPost"});
//   }
// })
FlowRouter.route('/ips',{
  action: function () {
    BlazeLayout.render('body', {content:"ips"});
  }
})
