//AMD module
// Get and store objects that describe a Github Repo
//depends on html5 fetch api + uses ES6 methods - could benefit from a transpiler

define(['mixins/PubSub'],
  function (PubSub) {

    //create a store with some getter/setters to hold api response.
    let _store   = {
      link_header:null,
      set collection(models){
        //console.log("Repos"," store.set: ",models);
        this.models = _sort(models);//default to an alpha sort
        PubSub.publish('repo:store:set',this.models);
      },
      sort(type='name'){
        //console.log("Repos"," store.sort: ",type);
        _sort(this.models,{type:type});
        PubSub.publish('repo:store:sort',this.models);
      },
      set headers(links){
        this.link_header = links;
      },
      getNextLink(){
        //console.log("store getNextLink");
        let links = this.link_header.split(',');
        let next = links.filter((link) => { return /rel="next"/.test(link) } )
        return next.pop().split(';')[0];
      }
    };

    /**
    * given a list of repo objects - alpha sort or sort by a numeric property
    */
    let _sort = (models=[], config={type:'name'}) => {
      //console.log("Repos"," _sort: ",config);
      if(config.type === 'name'){
        models.sort((a,b) => {
          let aName = a.name.toLowerCase();
          let bName = b.name.toLowerCase();
          let sort  = 0;

          if(aName < bName){
            sort = -1;
          }else if(aName > bName){
            sort = 1;
          }
          return sort;
        })
      }else{
        //console.log('...',config.type,' sort');
        models.sort((a,b) => {
          return  b[config.type] - a[config.type]
        })
      }

      return models;
    };

    /**
    * cherry pick props from the verbose repo objects via destructuring
    */
    let _transform = (models=[]) => {
      //console.log("Repos"," _transform: ",models);
      return models.map( (model) => {
        let { id, description, language, name, owner, watchers, forks, commits_url } = model;
        let data = {id, description, language, name, owner, watchers, forks, commits_url};
        data.commits_url = data.commits_url.split('{/sha}')[0];
        return data;
      });
    };

    let _Mixin = {
      init() {
        //get 'em if initialized w/a 'api_url' property
        if(this.api_url){
          this.add(this.api_url);
        }
      },
      add(api_url){
        api_url += '?per_page=100';//note: given more time I'd first check for any existing GET params
        //console.log("Repos"," add"," api_url:",api_url);
        fetch(api_url, {method:'get'})
          .then( (resp) => { _store.headers = resp.headers.get("link"); return resp } )
          .then( (resp) => resp.json() )
          .then( (json) => _transform(json) )
          .then( (models) => _store.collection = models )
          .catch( (error) => { console.log(error) });
      },
      next(){
        //:note this currently unused but given the extra time I'd use the return value
        //to paginate through the org's repos, adding new json response data to our local store.
        //ex. return value '<https://api.github.com/organizations/913567/repos?per_page=100&page=2>'
        //could take the form of a 'more' link in UI or we could automatically make recursive api calls
        return _store.getNextLink();
      },
      sort(config={}){
        _store.sort(config.type);
      }
    }

    return _Mixin

  });
