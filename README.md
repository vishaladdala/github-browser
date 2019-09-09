## Browse Commits By Project

A simple interactive UI to display a list of an arbitrary user-specified organization's GitHub projects ranked by any meaningful metric you'd like, and allow the user to browse recent commits on that project.

### Feature Notes

* Loads with list of Netflix repos
* Use search input to get repos for a different organization e.g. twitter, linkedin, google etc
* click repo name to view commits
* default repo sorting is alpha ascending
* change repo sort to decending by forks or watcher counts

### File Structure
* Using Github Pages/ Jekyll for convenience - so some files associated with that set up and not relevant to project - ex. 'Gemfile'
* Clientside files (js, css etc) located in `/assets`
* scss located in `_sass\` which is a convenience set up by jekyll

### Architecture

#### Object Hierarchy
The parent App file is initialized by requirejs (which is used for module loading). The App object creates versions of the data stores which are each responsible for fetching, transforming and storing json returned by a single Github api. For example the Repos store uses a given organization name to fetch a list of associated repositories. The parent App object then goes on to create and initialize views corresponding to each of the stores. Views are each responsible for a discreet part of the UI; they render, assign dom behaviors, respond to custom events from other parts of the app and may extend themselves further by using mixins as in the case of the 'Sortable' behavior mixin. Mixins are meant to be reusable and handle some well defined task. For example the PubSub mixin is used by all the App's objects as a communications channel. The diagram below helps to illustrate how the pieces fit together.

![Object Hierarchy Diagram](https://user-images.githubusercontent.com/658255/29934750-2d1f9066-8e31-11e7-9296-aa864b096c01.png)

#### Messaging Between Components
Each of the objects uses event messaging to stay informed of what's happening and avoid tight coupling with other objects within the app. The diagram below shows a simple example of messaging where the Repo store publishes that it's just been set (made an api call and saved the response json). The event is relayed to any interested subscribers - in this case the Repos View which in turn renders any models sent as an event payload.

![Simple Messaging example](https://user-images.githubusercontent.com/658255/29938394-71ebdd74-8e3d-11e7-89b1-cbc71d287708.png)

A more complex example would involve the user entering an organization name in the search field and eventually triggering a re-render of the Repos View. That event flow would look like the diagram below:

![Search Messaging example](https://user-images.githubusercontent.com/658255/29939876-475b50a8-8e42-11e7-839f-03a1c3f0a78e.png)

Here's a breakdown for the above:

1. User enters a search term and publishes the 'search:input:entered' event.

2. The parent App js catches the event and uses it's reference to the Organization Store to trigger a fetch of info for the org in question.

3. The Organization Store sets the github api json response and publishes the 'org:store:set' event.

4. The parent App js catches the org event and uses it's reference to the Repos Store to trigger a fetch of repos for the org in question.

5. The Repos store sets the github api json response and publishes the 'repo:store:set' which is eventually caught by the Repos View and triggers a render of all the new repo models.

The above approach gets objects loosely coupled (with the exception of the parent app object). Stores and Views do not need to know about the internals of each other - or that one another even exists. This makes product changes less prone to breaking down the road.

### Approach
* minimal use of outside libraries - just Handlebars and requirejs
* markup skeleton delivered w/page load. content inserted/change via client templates.
* Custom 'Model' objects encapsulate data store and methods for each of the Github api's used. For example a 'Repos' object fetches a given org's repos, transforms, and stores response json in an internal hash.
* Keep objects loosely coupled with custom event messaging / PubSub
* 'View' objects responsible for rendering in response to data store change events ('set', 'sort')
* Top level App object helps by mediating events so that 'Models' subscribe to nada
* Tried to avoid brittle prototypal class hierarchies by using a mixin pattern.

### Manual Testing
* On page load Netflix repo's should load
* clicking a repo name should display a page of most recent commits in alpha ascending
* clicking a selection from the 'sortable' widget should re-order existing repos accordingly (alpha, forks, watchers)
* entering a valid organization name into the search field and pressing return/enter should fetch and display a list of assoc repos
* entering a valid organization name into the search field and pressing return/enter should update the current org string in topbar
* entering a *invalid* organization name into the search field and pressing return/enter should clear the current org string in topbar
* clicking the abbr sha for a commit should open a new tab with the associated commit details page


### TODOS
* several optimizations marked in js - `/assets/js`
* sync sort state in UI when user searches for a new repo. for example if u sort the Netflix repos by 'watchers' then search for twitter
 the returned repos will be alpha order but sortable widget UI stays on 'watchers'. Alternatively just display repos in 'watchers' order.
* Display message in UI when an invalid organization is submitted via search input
* default select first repo in list, + display assoc commits
* add currently selected repo name to display in topbar area
* use lib like moment.js to format datetime string
* constrain height of page container and force nav / body to scroll
* bigger select target for repo links. better styling on select
* run a transpiler to port es6 syntax to older browsers
* pagination through repos. currently 1 request is made for first 100 results.
