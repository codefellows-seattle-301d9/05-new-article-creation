// Configure a view object, to hold all our functions for dynamic updates and article-related event handlers.
var articleView = {};

articleView.render = function() {
  articles.forEach(function(a) {
    $('#articles').append(a.toHtml('#article-template'));
    $('#author-filter').append(a.toHtml('#author-filter-template'));
    if($('#category-filter option:contains("' + a.category + '")').length === 0) {
      $('#category-filter').append(a.toHtml('#category-filter-template'));
    };
  });
  $('pre code').each(function(i, block) {
    hljs.highlightBlock(block);
  });
};

articleView.handleAuthorFilter = function() {
  $('#author-filter').on('change', function() {
    if ($(this).val()) {
      $('article').hide();
      $('article[data-author = "' + $(this).val() + '"]').fadeIn();
    } else {
      $('article').fadeIn();
      $('article.template').hide();
    }
    $('#category-filter').val('');
  });
};

articleView.handleCategoryFilter = function() {
  $('#category-filter').on('change', function() {
    if ($(this).val()) {
      $('article').hide();
      $('article[data-category="' + $(this).val() + '"]').fadeIn();
    } else {
      $('article').fadeIn();
      $('article.template').hide();
    }
    $('#author-filter').val('');
  });
};

articleView.handleMainNav = function() {
  $('.main-nav').on('click', '.tab', function(e) {
    $('.tab-content').hide();
    $('#' + $(this).data('content')).fadeIn();
  });
  $('.main-nav .tab:first').click();
};

articleView.setTeasers = function() {
  $('.article-body *:nth-of-type(n+2)').hide();
  $('article').on('click', 'a.read-on', function(e) {
    e.preventDefault();
    if($(this).text() === 'Read on →') {
      $(this).parent().find('*').fadeIn();
      $(this).html('Show Less &larr;');
    } else {
      $('body').animate({
        scrollTop: ($(this).parent().offset().top)
      },200);
      $(this).html('Read on &rarr;');
      $(this).parent().find('.article-body *:nth-of-type(n+2)').hide();
    }
  });
};

//defining a function on the articleView obj
articleView.initNewArticlePage = function() {
  $('#export-field').hide();
  $('#article-json').on('focus', function() {
    //whenever we recieve focus on this resulting json, copy this entire line so the user won't have to click and drag all of the text
    $(this).select();
  });
  //whenever there's a change to the form, we want to re-render the preview
  //we will be appending this section to article-preview
  $('#new-form').on('change', articleView.create);
};

//now define the articleView.create Method
articleView.create = function() {
  //every time there's a change, it will empty this and brind it back to us
  $('#article-preview').empty().fadeIn();
  //now define how the input will look
  var formArticle = new Article({
    title: $('#article-title').val(),
    body: $('#article-body').val(),
    author: $('#article-author').val(),
    authorUrl: $('#article-author-url').val(),
    category: $('#article-category').val(),
    publishedOn: $('#article-published:checked').length ? new Date() : null
    //pseudo check property, jQuery likes to return arrays which is why we can measure the length to see if the box has been checked
    // ? is a ternary operator, its like if
  });//this is an obj literal
  //utilize the method handlebars gave us to instantiate a new article, append the contents to the preview
  $('#article-preview').append(formArticle.toHtml('#article-template'));

  $('pre code').each(function(index, block) {
    hljs.highlightBlock(block);
      //this func corresponds to index and the block, this targets and pre and code tags and applies highlighting to them
  });
  //now we can show the export field
  $('#export-field').show();
  //now we want to generate the resulting json into the article json read only ele
  $('#article-json').val(JSON.stringify(formArticle));
  //this json.stringify is turning the formArticle obj and turning it into a string and copying and pasting that into the blogArticles data set
};



articleView.initNewArticlePage();
articleView.render();
articleView.handleCategoryFilter();
articleView.handleAuthorFilter();
articleView.handleMainNav();
articleView.setTeasers();
