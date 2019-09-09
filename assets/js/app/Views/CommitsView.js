//AMD module
//View for a repo's commits

define([
  'mixins/PubSub',
  'handlebars',
  'text!'+_baseUrl+'/assets/js/app/templates/commit.tmpl?noext',
],
  function (PubSub, Handlebars, CmtTemplate) {

    let _View = {
      init() {
        //console.log("CommitsView"," init");
        this.el = document.getElementById('commits_list');
        this.template = Handlebars.compile(CmtTemplate);
        PubSub.subscribe('commits:store:set', this.render.bind(this) );

      },
      render(models=[]) {
        //console.log("CmtsView"," render: ", models);
        this.el.innerHTML = this.template(models);
      }
    }

    return _View

  });
