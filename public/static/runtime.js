$(document).ready(function () {

  var $myPreview = $('#my-preview');
  var $progressPreview = $('#my-preview-change-progress');
  //var $image = $('#graph-image');
  function renderPreview(textCode) {
    textCode = textCode.trim();
    // detect start word
    //console.log(textCode);
    if (textCode.startsWith("@startuml") == false) {
      textCode = "@startuml;\n\r" + textCode;
    }
    // detect end word
    if (textCode.endsWith("@enduml") == false) {
      textCode = textCode + "\n\r@enduml";
    }
    //console.log(textCode);
    // gravizo usage
    // var encoded = encodeURIComponent(textCode);
    // var url = ['//gravizo.com/g?',
    //   '\n',
    //   encoded,
    //   '\n'].join('');
    // plantuml-server
    var encoded = compress(textCode);
    var url = [
      "http://www.plantuml.com/plantuml/img/",
      encoded
    ].join('');
    //$('im').src = "http://www.plantuml.com/plantuml/img/"+);
    //$image.attr('src', url);

    renderProgress($progressPreview, function () {
      $progressPreview.progress('reset');
    });
    var img = new Image();
    img.onload = function () {
      $progressPreview.progress('complete');
      $myPreview.html('');
      $myPreview.append(img);
    };
    img.src = url;
  };


  function renderProgress($progressElm, callback) {
    clearInterval(window.changeProgress);
    $progressElm.progress('reset');
    window.changeProgress = setInterval(function () {
      // stop incrementing when complete
      if ($progressElm.progress('is complete')) {
        clearInterval(window.changeProgress);
        $progressElm.progress('reset');
        $progressElm.progress('increment 1');
        if ($.isFunction(callback)) {
          callback();
        }
      } else {
        $progressElm.progress('increment 1');
      }
      //console.log($progress.progress('get value'));
    }, 100);
  };

  // editor progress
  var $progressEditor = $('#my-editor-change-progress');
  // editor mode
  var editor = ace.edit("my-editor");
  editor.setTheme("ace/theme/github");
  editor.getSession().setMode("ace/mode/diagram");
  editor.getSession().on('change', function (e) {
    var textCode = editor.getValue();
    renderProgress($progressEditor, function () {
      renderPreview(textCode);
    });
  });
  // init editor display
  var textCode = editor.getValue();
  renderProgress($progressEditor, function () {
    renderPreview(textCode);
  });

  // docs handle active effect on items
  $('.docs').on('click', '.title1 a.item, .title2 a.item', function (e) {
    $(this)
      .addClass('active')
      .closest('.ui')
      .find('.item')
      .not($(this))
      .removeClass('active');
  });
  // docs handle clicks on items
  $('.docs').on('click', '.title1 a.item, .title2 a.item', function (e) {
    e.preventDefault();
    var url = $(this).attr('href');
    var d = new Date();
    url = url + '?v=' + d.getMilliseconds();
    var target = $(this).attr('target');
    var targetElm = '#' + target;
    $(targetElm).load(url);
  });
  // docs initial load
  $('.docs .title1 a.item:first').trigger("click");

});