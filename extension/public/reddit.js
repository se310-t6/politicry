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
  
    // calls removeLinkFromDOM to remove a specific post link from the DOM
    removeLink: function(event){
        var hideButton  = $(event.currentTarget);
        var linkElement = hideButton.parents(this.linkSelector);
        var link        = linkElement.attr("id");
        console.log(link, linkElement);
        this.removeLinkFromDOM(link);
        this.refreshDashboard();
    },

    // called removeLinkFromDOM to remove all loaded posts on the page
    removeLinkAll: function(){
        var that = this;
        var linkElements = $(this.visibleLinkSelector);

        linkElements.each(function(i, e){
            var link = $(e).attr("id");
            that.removeLinkFromDOM(link);
            });
        this.refreshDashboard();
    },
  
    // initalize all UI elements and onclick binding
    setupUI: function() {
        var that = this;
    
        // adds hide button to each Reddit post
        $(this.linkSelector).each(function(i, e){
            $(e).prepend($(that.hideLinkHTML()));
        });
    
        // bind the onclick effect to hide buttons
        $(".reddit-action.hide").on("click", { that : this }, function(event){
            that.removeLink(event);
        });

        // add the dashboard to top of posts list
        $(this.listSelector).prepend($(this.dashboardHTML()));
    
        // bind the onclidk effect to unhide all links
        $(".reddit-control.unhide_links").click(function(){
            if (confirm("Are you sure you want to unhide all links?")) {
                that.refreshDashboard();
            }
        });
    
        // bind the onclick effect to hide all links
        $(".reddit-control.hide_links").click(function(){
            that.removeLinkAll();
        });
    },
  
    // refresh dashboard to update total hidden counter
    // BROKEN
    refreshDashboard: function(){
        $(".reddit-status.total_hidden .variable").html($(this.listSelector + " " + this.hiddenLinkSelector).length);
    },
  };
  
Reddit.initialize();