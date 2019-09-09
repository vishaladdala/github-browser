//AMD module
// Get and store objects that describe a commits associated w/a Github Repo
//depends on html5 fetch api + uses ES6 methods - could benefit from a transpiler

define(['mixins/PubSub',],
  function (PubSub) {

    //create a store with some getter/setters to hold api response.
    let _store   = {
      models:[],
      set collection(models){
        //console.log("Commits"," store.set: ",models);
        this.models = models;
        PubSub.publish('commits:store:set',models);
      }
    };

    /**
    * cherry pick props from the verbose repo objects via destructuring
    */
    let _transform = (models=[]) => {
      //console.log("Commits"," _transform: ",models);
      return models.map( (model) => {
        let { author, commit, html_url } = model;
        let data = {author, commit, html_url};
        let msg = data.commit.message.split('\n\n');
        data.commit.message = msg[0];
        data.commit.description = msg[1];
        data.commit.displaySha = data.commit.tree.sha.substring(0,9);
        data.sha = data.commit.tree.sha;
        return data;
      });
    };

    let _Mixin = {
      init() {
        console.log("Commits"," init");
      },
      add(api_url){
        //console.log("Commits"," add"," api_url:",api_url);
        fetch(api_url, {method:'get'})
          .then( (resp) => resp.json() )
          .then( (json) => _transform(json) )
          .then( (resp) => _store.collection = resp );
      }
    }

    return _Mixin

  });
