FlowRouter.route('/',{
  action: function () {
    BlazeLayout.render("body", {content: "blogHome"});
  }
});

FlowRouter.route('/:postId',{
  action: function () {
    BlazeLayout.render('body', {content:"blogPost"});
  }
})
