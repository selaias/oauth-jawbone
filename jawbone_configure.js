Template.configureLoginServiceDialogForJawbone.helpers({
  siteUrl: function () {
    return Meteor.absoluteUrl();
  }
});
Template.configureLoginServiceDialogForJawbone.fields = function () {
  return [
    {property: 'client_id', label: 'Client ID'},
    {property: 'secret', label: 'Client Secret'}
  ];
};