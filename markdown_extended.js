/*
*
* Adds the following extensions to the MarkDown syntax.
* See: https://daringfireball.net/projects/markdown/syntax
*
*-------
*
* Extension: inlineSpoiler
*
*     Usage: [description][(clarifying text)]
*
*     Notes: Position may be anywhere within a <p> element
*          :
*          : Multiple instances allowed, separated by whitespace
*
*    Effect: The text is replaced with a clickable text, "description",
*          :   followed by a space and a hidden inline *spoiler* element
*          :   containing the text "(clarifying text)"
*          :
*          : When clicked, the spoiler element is toggled.
*
* Extension: blockSpoiler
*
*     Usage: (description!Start.)(class-name)
*
*     Notes: Position may be anywhere within a <p> element
*          :
*          : Multiple instances allowed, separated by whitespace
*          :
*          : "!Start." is optional
*
*    Effect: The text is replaced with a clickable text,
*          :   either "description" or "(description)" depending
*          :   on whether description ends with a question mark "?"
*          :   or an ellipsis "..." (versus any other ending)
*          :
*          : When clicked, certain *spoiler* elements below are toggled:
*          :   Spoiler elements are selected by bounding elements containing
*          :     "(start class-name)" and "(stop class-name)"
*          :   Spoiler elements are indented
*          :   Spoiler elements start hidden
*          :
*          : If "!Start." is provided,
*          :   then the first spoiler element is prepended with "Start."
*          :   This is clickable text that toggles the spoiler elements
*          :
*          : Special behavior if the question mark or ellipsis format is used:
*          :   Onclick, the "(description)" text itself is also toggled
*          :   Description is treated as "Start?" or "Start..."
*          :     (unless "!Start." is provided)
*          :     for the purposes of prepending the first spoiler element
*          :     the punctuation is removed, repaced with a single period "."
*
*-------
*
* Preferred usage, for readability:
*
*   - Shorter spoiler sections should use inlineSpoiler if possible.
*
*   - Any paragraph with blockSpoiler usage should be immediately followed by
*     all of its elements to reveal. The spoiler elements should be written
*     in the same order as their toggle descriptions in the paragraph.
*
*   - The generic description usages should have a fully-described noun,
*     such as "proof of irrationality" or "Pythagorean theorem".
*     The description should be the first time the noun's idea
*     is being mentioned, to encourage verbososity.
*
*   - The blockspoiler "?" and "..." features should be reserved for
*     the end of the paragraph. In these descriptions, they should be brief,
*     preferably one capitalized word such as "How?", "Why?", or "But..."
*     If simple descriptors aren't clear enough,
*     (for instance, when you have two things "Why?" could be asking)
*     consider breaking up your paragraph into smaller paragraphs.
*
* * * * */

/*
 * Set up spoiler and toggle text.
 *
 * * * * */

/* function to toggle specific spoilers by class */
function toggleSpoiler(cls){
  $("." + cls).toggle(300);
};
function toggleInlineSpoiler(cls){
  $("." + cls).each(function(){
    if ($("." + cls).css("display") == "none") {
      $(this).css("display", "inline");
    } else {
      $(this).css("display", "none");
    }
  });
};

/*
 * Set up Spoiler extensions.
 *
 * * * * */

$(document).ready(function() {

  function parseMatch(match) {

    // takes either a "[description][(clarifying text)]" string
    //           or a "(description!Start.)(class-name)" string
    // returns an object with:
    //   replace_with: string to replace matched text with
    //    block_class: string from class-name, if present
    //    block_start: string to start new div with

    if (match[0] == "(") {

      // split match, i.e. "(description!Start.)(class-name)"
      // into description, startText_overwrite, cls
      match = match.slice(1,-1).split(/\)\(/);
      var cls = match[1];
      match = match[0].split("!");
      var description = match[0];
      var startText_overwrite = match[1];

      // depending on ending description punctuation,
      // create text strings for spans to come
      var replaceClass = "";
      var replaceText = description;
      var startText = "";
      if (description.endsWith("?") || description.endsWith("...")) {
        replaceClass = " " + cls;
        replaceText = "(" + description + ")";
        startText = description.split(/(?:\?|\.\.\.)$/)[0] + ".";
      }
      if (startText_overwrite != undefined) startText = startText_overwrite;

      // create spans from text strings
      var replace = '<span class="link-like' + replaceClass + '"' +
                    ' onclick="toggleSpoiler(\'' + cls + '\')">' +
                      replaceText +
                    '</span>';
      var start =   '<span class="link-like"' +
                    ' onclick="toggleSpoiler(\'' + cls + '\')">' +
                      startText +
                    '</span> ';

      // create output object
      out = {};
      out.replace_with = replace;
      out.block_class = cls;
      out.block_start = start;
      return out

    } else if (match[0] == "[") {

      // split match, i.e. "[description][(clarifying text)]"
      // into description, spoilerText
      match = match.slice(1,-1).split(/\]\[/);
      var description = match[0];
      var spoilerText = match[1];
      var cls = "inline-" + Math.random().toString(36).slice(2,8);

      // create replacement spans from text strings
      var replace = '<span class="link-like"' +
                    ' onclick="toggleInlineSpoiler(\'' + cls + '\')">' +
                      description +
                    '</span> ' +
                    '<span class="spoiler ' + cls + '">' +
                      spoilerText +
                    '</span>';

      // create output object
      var out = {};
      out.replace_with = replace;
      return out

    }
  }
  
  function checkPar(testchar, par) {

    // if testchar == "[":
    //   checks for [description][(clarifying text)] in par
    //     to turn into inline spoiliers
    //   returns an array of objects to pass to moveToDiv
    //
    // if testchar == "(":
    //   checks for (description)(class-name) in par
    //     to turn into block spoilers
    //   returns nothing
    
    if      (testchar == "[") var test = /\[(?:<.*?>|\\\(.*?\\\)|[^\[\]])+?\]\[(?:<.*?>|\\\(.*?\\\)|[^\[\]])+?\]/g;
    else if (testchar == "(") var test = /\((?:<.*?>|\\\(.*?\\\)|[^\(\)])+?\)\([^\s\(\)]+?\)/g;
    else return [];

    var matches = par.html().match(test);
    if (matches == null) return [];

    var outputArray = [];
    for (i=0; i<matches.length; i++) {
      var parsed = parseMatch(matches[i]);
      par.html(par.html().replace(matches[i], parsed.replace_with));
      outputArray.push(parsed);
    }
    if      (testchar == "[") return outputArray;
    else if (testchar == "(") return outputArray;
  }

  function moveToDiv(cur, parsed) {

    // starts with element containing only (start class-name)
    //   ends with element containing only (end class-name)

    startText = parsed.block_start;
    cls       = parsed.block_class;

    var startTest = new RegExp('^\\(start ' + cls + '\\)$');
    while (!cur.html().match(startTest)) cur = cur.next();
    cur = cur.next();
    cur.prev().remove();

    var divText = '<div class="' + cls + ' spoiler indent"></div>'
    cur.before(divText);
    var div = cur.prev();
    $(cur).prepend(startText);
    var stopTest = new RegExp('^\\(stop ' + cls + '\\)$');
    while (!cur.html().match(stopTest)) {
      cur = cur.next();
      div.append(cur.prev().detach());
    }

    cur.remove();
  }

  $('p').each(function() {

    // check each paragraph for extended MarkDown text
    // implements the respective effects

    while (checkPar("[", $(this)).length > 0);
    var moveArray = checkPar("(", $(this));
    for (i=0; i < moveArray.length; i++) {
      moveToDiv($(this).next(), moveArray[i]);
    }
  });
});

/* after page is ready, hide spoiler text */
$(document).ready(function(){
  if (window.MathJax == undefined) {
    $(".spoiler").hide()
  } else {
    MathJax.Hub.Queue(function(){
      $(".spoiler").hide()
    });
  }
});

