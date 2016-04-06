if (!data) { var data; }
$.support.cors = true;
$.ajaxSetup({ contentType: 'application/json; charset=utf-8', data: data, error: function () { $('#loginError').text("Error contacting the server.").fadeIn(250); hideProgress(); }, statusCode: { 404: function (msg) { if (msg.responseJSON == "validation failed") { hideProgress(); alert("Validation failed. Please login again."); location.href = "mhbg.html"; } }, 500: function () { alert("AJAX FAIL: 500 Internal Server Error"); } } });
// TODO: how to handle 500/AJAX fail errors?

$(function(){
    prefooter();

    $(window).scroll(function () { prefooter() });

    $('.homeLink').parent().addClass('active');
    $('#mainContent .content').hide();
    $('#home').show();

    $('header nav a:not(.active)').unbind().click(function (e) {
        e.preventDefault();
        var clickID = $(this).attr('class');
        $('header nav li').removeClass('active');
        $(this).parent().addClass('active');
        $.when($('#mainContent .content').fadeOut('150')).then(function () {
            switch (clickID) {
                case "languagesLink": $('#languages').fadeIn('150', function () { prefooter() }); loadLanguageScreen(); break;
                case "englishLink": $('#englishTerms').fadeIn('150', function () { prefooter() }); loadEnglishScreen(); break;
                case "translationsLink": $('#translations').fadeIn('150', function () { prefooter() }); loadTranslationScreen(); break;
            }
        });
    });

 
});

function loadLanguageScreen() {
    
    var searchResults = '', results = {}, data;
    var dto = { "All": "all" }, data = JSON.stringify(dto);
    $.ajax('../api/Language/Languages', {
        type: 'POST',
        data: data,
        success: function (msg) {
            results = msg['ReturnData'];
            if (results.length <= 0) {
                searchResults = "<span>No results were returned.</span>";
            } else {
                searchResults = "<h1><span class='w250'>Language</span><span class='w250'>CssFile</span><br /></h1>";
                for (var i = 0; i < results.length; ++i) {
                   
                    searchResults += '<span class="w250">' + results[i].LanguageName + '</span><span class="w250"><a href="#" class="genCSS" id="lang' + results[i].LanguageId + '">' + results[i].CSSFileName + '</a></span><br />';
                    
                }
            }
            searchResults += '<input class="w250" id="newLanguageName" type="text" placeholder="Language Name"></input><input class="w250" id="newLanguageFile" type="text" placeholder="CSS File Name"></input><span class="w100"><a href="#" id="newLanguageA">Add New</a></span><br />';
            $('#languageList').empty().append(searchResults);

            $('#newLanguageA').unbind().click(function (e) {
                e.preventDefault();
                dto = { "LanguageID" : "-1", "LanguageName" : $('#newLanguageName').val(), "CSSFileName" : $('#newLanguageFile').val() }, data = JSON.stringify(dto);
                $.ajax('../api/Language/LanguageAddOrEdit', {
                    type: 'PUT',
                    data: data,
                    success: function (msg) {
                        loadLanguageScreen();
                    },
                    error: function (msg) {
                        alert("Server error - please try again");
                    }
                });
            });

            $('.genCSS').unbind().click(function (e) {
                e.preventDefault();
                dto = { "LanguageID": this.id.replace("lang", "").toString()}, data = JSON.stringify(dto);
                $.ajax('../api/Language/LanguageGenerateCSS', {
                    type: 'POST',
                    data: data,
                    success: function (msg) {
                        
                        var uri = 'data:text/css;charset=UTF-8,' + encodeURIComponent(msg);
                        var downloadLink = document.createElement("a");
                        downloadLink.href = uri;
                        downloadLink.download = "test.css";// "data.csv";
                        document.body.appendChild(downloadLink);
                        downloadLink.click();
                        document.body.removeChild(downloadLink);
                    },
                    error: function (msg) {
                        alert("Server error - please try again");
                    }
                });
            });
        },
        error: function (msg) {
            alert("Server error - please try again");
        }
    });
}

function loadEnglishScreen() {
    var searchResults = '', results = {}, data;
    var dto = { "All": "all" }, data = JSON.stringify(dto);
    $.ajax('../api/EnglishTerm/EnglishTerms', {
        type: 'POST',
        data: data,
        success: function (msg) {
            results = msg['ReturnData'];
            if (results.length <= 0) {
                searchResults = "<span>No results were returned.</span>";
            } else {
                searchResults = "<h1><span class='w250'>English Term</span><span class='w250'>Position</span><br /></h1>";
                for (var i = 0; i < results.length; ++i) {
                    if (results[i].BeforeOrAfter == "Before") {
                        searchResults += '<span class="w250"><input type="text" class="w250 editET" id="et' + results[i].EnglishTermID + '" value="' + results[i].Term + '"></input></span><span class="w250"><select id ="ba' + results[i].EnglishTermID + '" class="editBA"><option value="Before" selected>Before</option><option value="After">After</option></select></span><br />';
                    }
                    else {
                        searchResults += '<span class="w250"><input type="text" class="w250 editET" id="et' + results[i].EnglishTermID + '" value="' + results[i].Term + '"></input></span><span class="w250"><select id ="ba' + results[i].EnglishTermID + '" class="editBA"><option value="Before">Before</option><option value="After" selected>After</option></select></span><br />';

                    }

                }
            }
            searchResults += '<span class="w250"><input class="w250" id="newTerm" type="text" placeholder="English Term"></input></span><span class="w250"><select id ="newBeforeOrAfter"><option value="Before">Before</option><option value="after">After</option></select></span><span class="w100"><a href="#" id="newEnglishTermA">Add New</a></span><br />';
            $('#englishList').empty().append(searchResults);

            $('#newEnglishTermA').unbind().click(function (e) {
                e.preventDefault();
                dto = { "EnglishTermID": "-1", "Term": $('#newTerm').val(), "BeforeOrAfter": $('#newBeforeOrAfter').val() }, data = JSON.stringify(dto);
                $.ajax('../api/EnglishTerm/EnglishTermAddOrEdit', {
                    type: 'PUT',
                    data: data,
                    success: function (msg) {
                        loadEnglishScreen();
                    },
                    error: function (msg) {
                        alert("Server error - please try again");
                    }
                });
            });

            $('.editET').unbind().blur(function (e) {
                e.preventDefault();
                dto = { "EnglishTermID": this.id.replace("et", ""), "Term": $(this).val() }, data = JSON.stringify(dto);
                
                $.ajax('../api/EnglishTerm/EnglishTermAddOrEdit', {
                    type: 'PUT',
                    data: data,
                    success: function (msg) {
                        loadEnglishScreen();
                    },
                    error: function (msg) {
                        alert("Server error - please try again");
                    }
                });
            });

            $('.editBA').unbind().change(function (e) {
                e.preventDefault();
                dto = { "EnglishTermID": this.id.replace("ba", ""), "BeforeOrAfter": $(this).val() }, data = JSON.stringify(dto);

                $.ajax('../api/EnglishTerm/EnglishTermAddOrEdit', {
                    type: 'PUT',
                    data: data,
                    success: function (msg) {
                        loadEnglishScreen();
                    },
                    error: function (msg) {
                        alert("Server error - please try again");
                    }
                });
            });
        },
        error: function (msg) {
            alert("Server error - please try again");
        }
    });
}

function loadTranslationScreen() {
    var searchResults = '', results = {}, data;
    var dto = { "All": "all" }, data = JSON.stringify(dto);
    $.ajax('../api/Language/Languages', {
        type: 'POST',
        data: data,
        success: function (msg) {
            results = msg['ReturnData'];
            if (results.length <= 0) {
                searchResults = "<span>No results were returned.</span>";
            } else {
                
                for (var i = 0; i < results.length; ++i) {

                    searchResults += '<option value="' + results[i].LanguageId + '">' + results[i].LanguageName + '</option>';

                }
            }
            
            $('#languageDDL').empty().append(searchResults);

            $('#languageDDL').unbind().change(function (e) {
                e.preventDefault();
                
                loadTranslationScreenDetail($(this).val())
            });
        },
        error: function (msg) {
            alert("Server error - please try again");
        }
    });
}

function loadTranslationScreenDetail(languageID) {
   
    var dto = { "LanguageID": languageID }, data = JSON.stringify(dto);
    $.ajax('../api/TranslatedTerm/TranslatedTerms', {
        type: 'POST',
        data: data,
        success: function (msg) {
            results = msg['ReturnData'];
            if (results.length <= 0) {
                searchResults = "<span>No results were returned.</span>";
            } else {
                searchResults = "<h1><span class='w250'>English Term</span><span class='w250'>Translated Term</span><br /></h1>";
                for (var i = 0; i < results.length; ++i) {

                    searchResults += '<span class="w250">' + results[i].Term + '</span><span class="w250"><input type="text" class="w250 editTT" data-lid="' + results[i].LanguageID + '" data-etid="' + results[i].EnglishTermID + '" id="tt' + results[i].TranslationID + '" value="' + results[i].TermTranslated + '"></input></span><br />';



                }
            }
            $('#translationList').empty().append(searchResults);

            $('.editTT').unbind().blur(function (e) {
                e.preventDefault();
                dto = { "TranslationID": this.id.replace("tt", ""), "TermTranslated": $(this).val(), "LanguageID": $(this).data("lid").toString(), "EnglishTermID": $(this).data("etid").toString() }, data = JSON.stringify(dto);

                $.ajax('../api/TranslatedTerm/TranslatedTermAddOrEdit', {
                    type: 'PUT',
                    data: data,
                    success: function (msg) {
                        loadEnglishScreen();
                    },
                    error: function (msg) {
                        alert("Server error - please try again");
                    }
                });
            });

        },
        error: function (msg) {
            alert("Server error - please try again");
        }
    });
}

function prefooter() { if ($(window).scrollTop() + $(window).height() >= $(document).height()) { $('#prefooter .content').fadeOut('50'); } else { $('#prefooter .content').fadeIn('50'); } }

function showProgress(targetElement, classIdentifier) { var bgElement = "#modalBG." + classIdentifier, layer = '<div class="windows8" id="progressBar"><div class="wBall" id="wBall_1"><div class="wInnerBall"></div></div><div class="wBall" id="wBall_2"><div class="wInnerBall"></div></div><div class="wBall" id="wBall_3"><div class="wInnerBall"></div></div><div class="wBall" id="wBall_4"><div class="wInnerBall"></div></div><div class="wBall" id="wBall_5"><div class="wInnerBall"></div></div></div><div class="modal ' + classIdentifier + '" id="modalBG"></div>'; $(targetElement).css('position', 'relative').prepend(layer); centerProgress(targetElement); $('#progressBar').fadeIn('50'); $(bgElement).fadeIn('25'); }

function hideProgress(classIdentifier) { var bgElement = "#modalBG." + classIdentifier; $(bgElement).fadeOut('100'); $('#progressBar').fadeOut('100', function () { $('#progressBar').remove(); $(bgElement).remove(); }); }

function centerProgress(container) { var containerHeight = $(container).innerHeight(), containerWidth = $(container).innerWidth(), modalHeight = $('#progressBar').innerHeight(), modalWidth = $('#progressBar').innerWidth(); var modalTop = (containerHeight - modalHeight) / 2, modalLeft = (containerWidth - modalWidth) / 2; $('#progressBar').css({ 'top': modalTop, 'left': modalLeft }); }

// OPENS AND CENTERS MODALS ON WINDOW
function openModal(modalId) { $("#modalBG").fadeIn('50'); centerModalX(modalId); $(modalId).fadeIn('50'); $(".modal-close").click(function(e) { e.preventDefault(); closeModal(); }); $(document).keyup(function(e) { if (e.keyCode == 27) { closeModal() } }); }

function centerModal(modalId) { var windowHeight = window.innerHeight, windowWidth = window.innerWidth, modalHeight = $(modalId).innerHeight(), modalWidth = $(modalId).innerWidth(); var modalTop = (windowHeight - modalHeight) - 20 / 2, modalLeft = (windowWidth - modalWidth) / 2; $(modalId).css({ 'top': modalTop, 'left': modalLeft }); }

function centerModalX(modalId) { var windowWidth = window.innerWidth, modalWidth = $(modalId).innerWidth(); var modalLeft = (windowWidth - modalWidth) / 2; $(modalId).css({ 'top': '50px', 'left': modalLeft }); }

function closeModal() { $('.modal').fadeOut('150'); }

