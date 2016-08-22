FlowRouter.route('/',{
  action: function () {
    BlazeLayout.render("mainLayout", {content: "home"});
    console.log(window.location.href);
    // console.log(window.location.hash);
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
    console.log(window.location.href);
    // console.log(window.location.hash);
  }
})
