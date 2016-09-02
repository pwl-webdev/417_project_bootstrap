(function(){
  /**
   * load external JavaScript
   * @see http://www.nczonline.net/blog/2009/07/28/the-best-way-to-load-external-javascript/
   */
  function loadScript(url, callback){

      var script = document.createElement("script")
      script.type = "text/javascript";

      if (script.readyState){  //IE
          script.onreadystatechange = function(){
              if (script.readyState == "loaded" ||
                      script.readyState == "complete"){
                  script.onreadystatechange = null;
                  callback();
              }
          };
      } else {  //Others
          script.onload = function(){
              callback();
          };
      }

      script.src = url;
      document.getElementsByTagName("head")[0].appendChild(script);
  }

  var jQueryLoadCallback = function() {
    var jq191 = $.noConflict(true);
    (function($){
      $('#most_popular_widget').html(' \
<ul class="most-popular-list"> \
        <li class="item item-1 clearfix"> \
                                  <div class="item-image"> \
            <a href="http://www.newsweek.com/steven-avery-lawyer-demands-evidence-and-accuses-cops-framing-him-bombshell-493873"><img src="http://s.newsweek.com/sites/www.newsweek.com/files/styles/thumbnail/public/2016/03/25/0408zellner01.jpg" alt="Steven Avery\'s Lawyer Accuses Cops of Framing Him " /></a>          </div> \
                <div class="item-link"> \
          <a href="http://www.newsweek.com/steven-avery-lawyer-demands-evidence-and-accuses-cops-framing-him-bombshell-493873?rel=most_read1">Steven Avery&#039;s Lawyer Accuses Cops of Framing Him </a>        </div> \
              </li> \
        <li class="item item-2 clearfix"> \
                                  <div class="item-image"> \
            <a href="http://www.newsweek.com/2016/09/09/donald-trump-will-gut-republican-party-494306.html"><img src="http://s.newsweek.com/sites/www.newsweek.com/files/styles/thumbnail/public/2016/08/24/0909trump01.jpg" alt="Trumpism Versus Republicanism, Explained" /></a>          </div> \
                <div class="item-link"> \
          <a href="http://www.newsweek.com/2016/09/09/donald-trump-will-gut-republican-party-494306.html?rel=most_read2">Trumpism Versus Republicanism, Explained</a>        </div> \
              </li> \
        <li class="item item-3 clearfix"> \
                                  <div class="item-image"> \
            <a href="http://www.newsweek.com/2016/09/09/elon-musk-tesla-oil-energy-493905.html"><img src="http://s.newsweek.com/sites/www.newsweek.com/files/styles/thumbnail/public/2016/08/24/0909maneymusk01.jpg" alt="Elon Musk Has a Brilliant Plan to Kill Big Oil" /></a>          </div> \
                <div class="item-link"> \
          <a href="http://www.newsweek.com/2016/09/09/elon-musk-tesla-oil-energy-493905.html?rel=most_read3">Elon Musk Has a Brilliant Plan to Kill Big Oil</a>        </div> \
              </li> \
        <li class="item item-4 clearfix"> \
                                  <div class="item-image"> \
            <a href="http://www.newsweek.com/can-anti-inflammatory-drugs-treat-depression-494720"><img src="http://s.newsweek.com/sites/www.newsweek.com/files/styles/thumbnail/public/2015/12/08/1208residencydepression01.jpg" alt="Can Anti-Inflammatory Drugs Treat Depression?" /></a>          </div> \
                <div class="item-link"> \
          <a href="http://www.newsweek.com/can-anti-inflammatory-drugs-treat-depression-494720?rel=most_read4">Can Anti-Inflammatory Drugs Treat Depression?</a>        </div> \
              </li> \
        <li class="item item-5 clearfix"> \
                                  <div class="item-image"> \
            <a href="http://www.newsweek.com/2016/09/09/old-clothes-fashion-waste-crisis-494824.html"><img src="http://s.newsweek.com/sites/www.newsweek.com/files/styles/thumbnail/public/2016/08/25/0909oldclothes01.jpg" alt="No One Wants Your Old Clothes" /></a>          </div> \
                <div class="item-link"> \
          <a href="http://www.newsweek.com/2016/09/09/old-clothes-fashion-waste-crisis-494824.html?rel=most_read5">No One Wants Your Old Clothes</a>        </div> \
              </li> \
  </ul> \
 \
<script type="text/javascript"> \
  if (typeof jQuery != \'undefined\') { \
    (function($){ \
      if ($(\'.item-shares-wrapper\').length != 0) { \
        $(\'.item-shares-wrapper\').mouseenter(function() { \
          $(this).find(\'.item-shares\').addClass(\'hidden\'); \
          $(this).find(\'.addthis_toolbox\').removeClass(\'hidden\'); \
        }); \
         \
        $(\'.item-shares-wrapper\').mouseleave(function() { \
          $(this).find(\'.item-shares\').removeClass(\'hidden\'); \
          $(this).find(\'.addthis_toolbox\').addClass(\'hidden\'); \
        }); \
        addthis.toolbox(\'.addthis_toolbox\'); \
      } \
 \
       \
    })(jQuery) \
  } \
</script>');
    })(jq191);
  }

  loadScript('http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js', jQueryLoadCallback);
})();
