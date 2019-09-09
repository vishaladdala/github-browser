//AMD module
//View for an orgs repo's

define([
  'mixins/PubSub',
  'handlebars',
  'text!'+_baseUrl+'/assets/js/app/templates/org_results.tmpl?noext',
],
  function (PubSub, Handlebars, Template) {
    const RE_INPUT = /find-by-name/;
    const CSS_PARENT = 'org_search';
    const CSS_ORG_NAME = 'current-organization';

    let _View = {
      init() {
        //console.log("SearchView"," init");
        this.el = document.getElementById(CSS_PARENT);
        this.template = Handlebars.compile(Template);
        PubSub.subscribe('org:store:set', this.render.bind(this) );
        this.delegateEvts();
      },
      delegateEvts(){
        //console.log("SearchView"," delegateEvts:");
        this.el.addEventListener('keyup',function(e){
          e.preventDefault();
          if(RE_INPUT.test(e.target.className) && e.keyCode === 13){
            PubSub.publish('search:input:entered',e.target.value);
            e.target.value = '';
          }
        },false);
      },
      render(model={}) {
        //console.log("SearchView"," render: ", model);
        let resultNode = document.querySelector('#'+CSS_PARENT+' .'+CSS_ORG_NAME);
        resultNode.innerHTML = this.template(model);
      }
    }

    return _View

  });
