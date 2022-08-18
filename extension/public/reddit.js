var Reddit = {

    // CSS selector for Reddit links
    linkSelector: ".scrollerItem[id]",

    // CSS selector for hidden links
    hiddenLinkSelector: ".scrollerItem[id]:hidden",

    // CSS selector for visible links
    visibleLinkSelector: ".scrollerItem[id]:visible",

    // CSS selector for the Reddit posts list
    listSelector: ".rpBJOHq2PR60pnwJlUyP0", 
    
    // HTML for hide button
    hideLinkHTML: function(){
      return '<div class="reddit-actions"><div class="reddit-action hide">Hide</div></div>';
    },
  
    // HTML for dashboard
    dashboardHTML: function(){
      var h = '<div class="reddit-dashboard">';
      h    +=   '<div class="reddit-page-status">';
      h    +=     '<div class="reddit-status total_hidden"><span class="variable"></span>Total hidden</div>';
      h    +=   '</div>';
      h    +=   '<div class="reddit-controls">';
      h    +=     '<div class="reddit-control hide_links">Hide all</div>';
      h    +=     '<div class="reddit-control unhide_links">Unhide all</div>';
      h    +=   '</div>';
      h    += '</div>';
  
      return h;
    },
  
    // initalize UI
    initialize: function() { 
        this.setupUI();
        this.refreshDashboard();
    },

  };
  
  Reddit.initialize();