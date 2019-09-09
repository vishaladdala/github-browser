/*
* Fire an event that triggers Sort a Collection
*/

define(['mixins/PubSub'],
  function (PubSub) {

    const CSS_TRIGGER = '.sort-trigger',
          CSS_ACTIVE  = 'open',
          CSS_CURRENT = '.current-sort-item',
          CSS_TARGET  = '.sort-options-list',
          CSS_LINK    = 'nav-link';

    let _Mixin = {
      init() {
        //console.info("Sortable Mixin"," init");
        this.$el = document.querySelector('.'+this.el);//note: for this project we assume only 1 sortable at a time.

        //assign dom events
        var $triggerTarget = this.$el.querySelector(CSS_TRIGGER);
        $triggerTarget.addEventListener('click',this.toggleSortable.bind(this));

        var $menuTarget = this.$el.querySelector(CSS_TARGET)
        $menuTarget.addEventListener('click',this.onSortableClick.bind(this));

        this.setDefaultSelectedText(this.selected);
      },
      /*
      * update UI when initialized with a specified 'selected' text
      */
      setDefaultSelectedText: function(selected){
        //console.log("Sortable Mixin"," setDefaultSelectedText:",selected);
        if(selected){
          let defaultText = this.$el.querySelector('[data-sort-type='+selected+']').innerText;
          this.$el.querySelector(CSS_CURRENT).innerText = defaultText;
        }
      },
      toggleSortable: function(){
        //console.log("Sortable Mixin"," toggleSortable");
        this.$el.querySelector(CSS_TARGET).classList.toggle(CSS_ACTIVE);
      },
      onSortableClick: function(e){
        //console.log("Sortable Mixin"," onSortableClick");
        let attr = e.target.getAttribute('data-sort-type');
        this.toggleSortable();
        this.setDefaultSelectedText(attr);
        PubSub.publish('sort:by',{type:attr});
      }
    }

    return _Mixin
});
