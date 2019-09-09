//AMD module
// Get and store an object that describes a Github Organization

define(['mixins/PubSub',],
  function (PubSub) {

    //create a store with some getter/setters to hold api response.
    let _store   = {
      model:{},
      set collection(model){
        console.log("Organization"," store.set: ",model);
        this.model = model;
        PubSub.publish('org:store:set',model);
      }
    };

    /**
    * cherry pick props via destructuring
    */
    let _transform = (model) => {
      //console.log("_transform: ",model);
      let { id, login, repos_url, avatar_url } = model;
      let data = {id, login, repos_url, avatar_url};
      return data;
    };

    let _Mixin = {
      init() {
        console.log("Organizations"," init");
      },
      add(orgName){
        //console.log("Organization"," add"," org:",orgName);
        if(orgName){
          let api_url = 'https://api.github.com/orgs/'+orgName
          fetch(api_url, {method:'get'})
            .then( (resp) => resp.json() )
            .then( (json) => _transform(json) )
            .then( (resp) => _store.collection = resp );
        }
      }
    }

    return _Mixin

  });
