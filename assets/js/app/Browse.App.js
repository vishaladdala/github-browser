//Define an AMD module

define([
  'mixins/PubSub',
  'app/Repos',
  'app/Views/ReposView',
  'app/Commits',
  'app/Views/CommitsView',
  'app/Organizations',
  'app/Views/SearchView'
  ],
  function (PubSub, Repos, ReposView, Commits, CommitsView, Orgs, SearchView) {
    let _ORG = Object.create(Orgs);
    let _RPS = Object.create(Repos, {'api_url':{value:'https://api.github.com/orgs/netflix/repos'}});
    let _CMTS = Object.create(Commits);

    let _App  = {
      el:'.browse-app',

      init(options){
        //console.log("BrowseApp"," init");
        this.views = {repos:Object.create(ReposView), commits:Object.create(CommitsView), search:Object.create(SearchView)};

        //start views
        for(i in this.views){
          this.views[i].init()
        }

        _RPS.init();

        //mediate some events
        PubSub.subscribe('repo:item:click', _CMTS.add );
        PubSub.subscribe('search:input:entered', _ORG.add );
        PubSub.subscribe('org:store:set', (model) => {
          _RPS.add(model.repos_url);
        });
        PubSub.subscribe('sort:by',_RPS.sort);
        
      }
    };

  return _App;
});
