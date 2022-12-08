// $(document).ready(function() {
//     $('a.abstract').click(function() {
//         $(this).parent().parent().find(".abstract.hidden").toggleClass('open');
//     });
//     $('a.bibtex').click(function() {
//         $(this).parent().parent().find(".bibtex.hidden").toggleClass('open');
//     });
//     $('a').removeClass('waves-effect waves-light');
// });



$(document).ready(function () {
    // Use abstract button to open and close
    $("a.abstract.publink").click(function () {
      $(this).parent().parent().find(".abstract.hidden").toggleClass("open");
      $(this).parent().parent().find(".bib.hidden").toggleClass("open", false);
    });
    $("a.bib.publink").click(function () {
      $(this).parent().parent().find(".abstract.hidden").toggleClass("open", false);
      $(this).parent().parent().find(".bib.hidden").toggleClass("open");
    });
    // Open abstract when targeted (#bibkey in url)
    $("div.row.publication-row:target").find(".abstract.hidden").addClass("open");
  });