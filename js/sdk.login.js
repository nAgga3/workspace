var mythinrdp = null;

// refresh the screen size automatically when user resize browser window.
// var resizeTimeout = null;
// var waitToResize = -1; // 1000 = 1 second (-1 to deactivate)

helper.dom.ready(function () {
    // GetThinRDP(serverURL, runRemote)
    //   Creates a new ThinRDP instance
    //      serverURL:  substitute with the ThinRDP server URL (http[s]://[URL - IP]:port/)
    //      runRemote:  use to set ThinRDP mode
    //          -- false->local (renders into this page)
    //          -- true-> remote (posts connection data to postPage ("connection.html" as default)
    mythinrdp = GetThinRDP("", false);
    function login() {
        mythinrdp.logout();
        var rc = mythinrdp.login(
            $("#userid").val(),     // user
            $("#password").val(),   // password
            '',                     // security method
            function () {           // onSuccess
                // redirect to sdk.html
                window.location.href = 'sdk.html';
            },
            function () {           // onFailure
                // do not redirect.
                // show alert message
                alert(thinRDPconsts.invalidUserPass);
            }
        );
    };


    $("#loginOk").click(function () {
        login();
    });

    $("#changePasswordOk").click(function () {
        changePassword();
    });

    $(document.body).keydown(function (e) {
        if (e.keyCode == "13") {
            if ($("#login-page").css("display") == "block") {
                login();
            } else if ($("#changePassword-page").css("display") == "block") {
                changePassword();
            }
        }
    });


    // -- This snippet can handler show / hide events using on method.
    (function ($) {
        $.each(['show', 'hide'], function (i, ev) {
            var elem = $.fn[ev];
            $.fn[ev] = function () {
                this.trigger(ev);
                return elem.apply(this, arguments);
            }
        });
    })(jQuery);
    // -- End snippet
    $("#changePassword-page").on("show", function () {
        $("#oldPassword").val("");
        $("#newPassword").val("");
        $("#cnfPassword").val("");
    });

    function changePassword() {
        var username = $("#userid2").val();
        var oldPassword = $("#oldPassword").val();
        var newPassword = $("#newPassword").val();
        var cnfPassword = $("#cnfPassword").val();

        var errorRequestPasswordAgain = function (msg) {
            $("#newPassword").val("");
            $("#cnfPassword").val("");
            Thinfinity.Popups.alert(msg, thinRDPconsts.productDescription, undefined, undefined, undefined, function () {
                setTimeout(function () {
                    Thinfinity.Popups.unblock();
                    $("#newPassword").focus();
                }, 200);
            });
        };
        if ((newPassword == cnfPassword)) {
            $.blockUI({
                message: "<div class='popup' id='updatingPassword'><h2>" + thinRDPconsts.pleaseWait + "</h2><img id='ecWaiting' src='images/core/loadajax.gif' /></div>",
                css: {
                    'padding': 0, 'margin': 0,
                    'width': '100%', 'height': '100%',
                    'top': '0px', 'left': '0px',
                    'textAlign': 'center',
                    'backgroundColor': 'transparent',
                    'border': 'none',
                    'cursor': 'auto'
                }, centerX: true, centerY: true
            });
            mythinrdp.changePassword(username, oldPassword, newPassword, function (obj) {
                $.unblockUI();
                if ((obj != undefined)) {
                    if (obj.rc == 0) {
                        $.unblockUI();
                        Thinfinity.Popups.alert(thinRDPconsts.passswordUpdated, thinRDPconsts.productDescription, undefined, undefined, undefined, function () {
                            setTimeout(function () {
                                Thinfinity.Popups.unblock();
                                $("#password").focus();
                            }, 200);
                        });
                        $("#changePassword-page").hide();
                        $("#login-page").show();
                        $("#userid").val(username);
                    } else {
                        var msg = thinRDPconsts.changePasswordError;
                        if ((obj.msg != undefined) && (obj.msg != '')) {
                            msg = obj.msg;
                        }
                        errorRequestPasswordAgain(msg);
                    }
                } else {
                    var msg = thinRDPconsts.changePasswordError;
                    errorRequestPasswordAgain(msg);
                }
            }, function (error) {
                $.unblockUI();
                if (error != undefined) {
                    var msg = thinRDPconsts.changePasswordError;
                    if ((error.msg != undefined) && (error.msg != '')) {
                        msg = error.msg;
                    }
                    errorRequestPasswordAgain(msg);
                } else {
                    errorRequestPasswordAgain(thinRDPconsts.changePasswordError);
                }
            });
        } else {
            errorRequestPasswordAgain(thinRDPconsts.invalidPasswordMatch);
        }
    };

    function radiusChallenger(username, authId, answer) 
    {

    }

    $("#userid").focus();
});
