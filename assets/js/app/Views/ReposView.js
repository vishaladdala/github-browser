//AMD module
//View for an orgs repo's

define([
  'mixins/PubSub',
  'mixins/SortableList',
  'handlebars',
  'text!'+_baseUrl+'/assets/js/app/templates/repo.tmpl?noext',
],
  function (PubSub, SortableBehavior, Handlebars, RepoTemplate) {
    const RE_REPO_LINK  = /repo-commits/;
    const CSS_SRTBLE    = 'sortable-mixin';
    const CSS_ACTIVE    = 'active';

    let _View = {
      init() {
        //console.log("ReposView"," init");
        this.el = document.getElementById('repo_list');
        this.template = Handlebars.compile(RepoTemplate);
        PubSub.subscribe('repo:store:set', this.render.bind(this) );
        PubSub.subscribe('repo:store:sort', this.render.bind(this) );
        let _SRTBLE = Object.create(SortableBehavior,{'el':{'value':CSS_SRTBLE}});
        _SRTBLE.init();

        this.delegateEvts();
      },
      delegateEvts(){
        //console.log("delegateEvts:");
        this.el.addEventListener('click',function(e){
          e.preventDefault();

          if(RE_REPO_LINK.test(e.target.className)){
            [...this.el.getElementsByClassName('repo-commits')].forEach((node) => node.classList.remove(CSS_ACTIVE));//no jQuery - just es6 magic.
            e.target.classList.add(CSS_ACTIVE);
            PubSub.publish('repo:item:click',e.target);
          }
        }.bind(this),false);
      },
      render(models=[]) {
        //console.log("ReposView"," render: ", models);
        this.el.innerHTML = this.template(models);
      }
    }

    return _View

  });
