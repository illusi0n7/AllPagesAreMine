
  $(function(){
    var $container = $('#gallery');
 /*   $container.imagesLoaded( function(){
      $container.isotope({
          itemSelector : '.span3'
      });
    });*/
    $('#filters a').click(function(){
      var selector = $(this).attr('data-filter');
      $container.isotope({ filter: selector });
      return false;
    });
    /*
    $container.isotope({
        getSortData : {
            name : function ( $elem ) {
                return $elem.find('.name').text();
            }
        }
    });*/
    
    $('#sort-by a[href=#nameDesc]').click(function(){
        var sortName = $(this).attr('href').slice(1);
        $container.isotope({ sortBy : sortName, sortAscending : false });
        return false;
    });

    $('#sort-by a[href=#nameAsc]').click(function(){
      var sortName = $(this).attr('href').slice(1);
      $container.isotope({ sortBy : sortName, sortAscending : true });
      return false;
    });

    $('#sort-by a[href=#original]').click(function(){
        var sortName = $(this).attr('href').slice(1);
        $container.isotope({ sortBy : original-order });
        return false;
    });      

    $('#sort-by a[href=#random]').click(function(){
        var sortName = $(this).attr('href').slice(1);
        $container.isotope({ sortBy : random });
      return false;
    }); 
    // $container.infinitescroll({ 
    //   navSelector  : '#page-nav',    // selector for the paged navigation 
    //   nextSelector : '#page-nav a',  // selector for the NEXT link (to page 2)
    //   itemSelector : '.span3',     // selector for all items you'll retrieve
    //   loading: {
    //       finishedMsg: '로드할 페이지가 더 이상 없습니다.',
    //       msgText : "<em>다음 페이지를 로딩합니다.</em>",
    //       img: 'http://i.imgur.com/6RMhx.gif'
    //     }
    //   },
    //   // trigger Masonry as a callback
    //   function( newElements ) {
    //       $container.isotope( 'appended', $( newElements ) ); 
    //     }
    // );   

  });