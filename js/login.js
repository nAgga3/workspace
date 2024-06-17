// =========================================================================================================================
// Copyright 2014 - 2021, CybeleSoft
// CYBELESOFT
// info@cybelesoft.com
// =========================
//*************************************
function renderPage() {
  const { defineComponent, createApp, nextTick, ref } = Vue;
  const login = new Thinfinity.Login();
  const app = createApp({});
  const themeApplied = ref(false);

  helper.dom.ready(function () {
    const processLoginResponseErrorMsg = (data) => {
      let errMsg = null;
      switch (data.message) {
        case login.RESULTS.ACTION_FAILED:
          errMsg = data.msgdata;
          break;
        case login.RESULTS.LICENSE_EXPIRED:
          errMsg = consts.licenseExpired;
          break;
        case login.RESULTS.USERS_LIMIT_REACHED:
          errMsg = consts.usersLimitReached;
          break;
        case login.RESULTS.NO_PROFILES_AVAILABLE:
          errMsg = consts.noProfilesAvailable;
          break;
        case login.RESULTS.INVALID_DATA:
          errMsg = consts.invalidUserPass;
          break;
        case login.RESULTS.EMPTY_RESPONSE:
          errMsg = consts.errEmptyResponse;
          break;
        default:
          errMsg = consts.loginFailed;
      }

      return errMsg;
    };

		Thinfinity.Theme.apply({
      callback: () => {
        themeApplied.value = true;
      },
    });

		const LoginBox = defineComponent({
      props: ["errormsg"],
      template: "#login-box",
      name: 'LoginBox',
      data() {
        return {
          username: "",
          password: "",
          method: null,
          bypassConfig: false,
          error_message: this.errormsg || null,
          methods: {
            internal: [],
            oauth: [],
            received: false,
            loading: true,
          },
          passwordFieldType: "password",
          allStyles: "",
        };
      },
      mounted() {
        login.onAuthMethodsReceived = this.onAuthMethodsReceived;
        login.onSendData = () => {};
        login.onResponseReceived = () => {};
        login.onLoginSucceeded = () => {};
        login.onChangePasswordSucceeded = () => {};
        login.onLoginFailed = this.onLoginFailed;
        this.bypassConfig = login.bypassConfig;
      },
      activated: function () {
        login.onLoginFailed = this.onLoginFailed;
      },
      watch: {
        errormsg: function (val) {
          this.error_message = val;
        },
      },
      methods: {
        onAuthMethodsReceived(data) {
          let methods =
            data && data.msgdata && data.msgdata.methods
              ? data.msgdata.methods
              : [];
          this.methods.oauth = methods.filter((t) => !!t.url);
          this.methods.internal = methods.filter((t) => !t.url);
          this.method =
            this.methods.internal.length > 0
              ? this.methods.internal[0].name
              : null;

          if (
            this.methods.internal.length == 0 &&
            this.methods.oauth.length == 1 &&
            this.settings?.RDP?.autoLoginWithSSO === true &&
            !localStorage.getItem("__#fromLogOut__")
          ) {
            login.callOAuthLogin(this.methods.oauth[0]?.url);
            return;
          } else localStorage.removeItem("__#fromLogOut__");
					nextTick(() => {
            this.methods.received = true;
            this.methods.loading = false;

						if (this.$refs.username) this.$refs.username.focus();
						// -- TW-100 - Show initials if none icon was setted;
						nextTick(() => {
							if (this.$refs.methodContainer) {
								let oauthItems =
									this.$refs.methodContainer.querySelectorAll(".auth-circle");
								oauthItems.forEach((item) => {
									let icon = item.querySelector("i");
									if (icon) {
										if (!this.matchesExistingStyle(icon)) {
											let dm = item.getAttribute("data-methodId");
											let idx = this.methods.oauth.findIndex((d) => {
												return d.id === dm;
											});
											if (idx !== -1) {
												let names = this.methods.oauth[idx].name.split(" ");
												let l = names.length,
													i = 0;
												let initials = "";
												while (initials.length < 2 && i < l) {
													initials += names[i].substr(0, 1);
													i++;
												}
												if (initials.length < 2)
													initials = names[0].substr(0, 2);
												this.methods.oauth[idx].initials = initials;
											}
										}
									}
								});
								this.methods.oauth = [...this.methods.oauth];
							}
						});
						// -- TW-100 - Show initials if none icon was setted;
					});
        },
        matchesExistingStyle(element) {
          if (this.allStyles == "") {
            this.allStyles = [...document.styleSheets]
              .map((styleSheet) => {
                try {
                  return [...styleSheet.cssRules]
                    .map((rule) => rule.cssText)
                    .join("");
                } catch (e) {
                  return "";
                }
              })
              .filter(Boolean)
              .join("\n");
          }
          return (
            this.allStyles.indexOf(
              [...element.classList].find((e) => e.indexOf("thin-") !== -1)
            ) != -1
          );
        },
        onLoginFailed(data) {
          switch (data.message) {
            case login.RESULTS.CREDENTIALS_EXPIRED:
              this.$emit("credentials-expired", {
                username: data.msgdata,
              });
              break;
            case login.RESULTS.RADIUS_CHALLENGE:
              const { username, original, question } = data.msgdata;
              this.$emit("radius-challenge", { username, original, question });
              break;
            default:
              this.error_message = processLoginResponseErrorMsg(data);
              break;
          }
        },
        onAuthMethodClick(method) {
          this.error_message = null;
          login.callOAuthLogin(method.url);
        },
        onSubmit() {
          this.error_message = null;
          login.bypassConfig = this.bypassConfig;
          login.login(this.username, this.password, this.method);
        },
        showHidePassword() {
          this.passwordFieldType =
            this.passwordFieldType == "password" ? "text" : "password";
        },
      },
      computed: {
				themeApplied() {
          return themeApplied.value;
				},
        edition() {
          return Thinfinity.global.variables.edition;
        },
        isSMB() {
          return this.edition == 0;
        },
        passwordEyeClass() {
          return this.passwordFieldType == "password"
            ? "thin-eye"
            : "thin-eye-off";
        },
      },
    });

    const ChangePasswordBox = defineComponent({
      template: '#changepassword-box',
			props: ["username"],
      data() {
        return {
          old_password: "",
          password: "",
          confirm_password: "",
          error_message: null,
          passwordFieldType: new Array(3)
            .fill()
            .map((t) => ({ type: "password" })),
        };
      },
      mounted() {
        login.onChangePasswordSucceeded = () => {};
        login.onChangePasswordFailed = this.onChangePasswordFailed;
        nextTick(() => {
          this.$refs.oldpassword.focus();
        });
      },
      methods: {
        onSubmit() {
          login.changePassword(
            this.username,
            this.old_password,
            this.password,
            this.confirm_password
          );
        },
        onChangePasswordFailed({ msgdata }) {
          this.error_message = msgdata;
          this.password = null;
          this.confirm_password = null;
        },
        showHidePassword(inx) {
          this.passwordFieldType[inx].type =
            this.passwordFieldType[inx].type == "password"
              ? "text"
              : "password";
        },
        passwordFieldType1(inx) {
          return this.passwordFieldType[inx];
        },
      },
      computed: {
        passwordEyeClass() {
          return (inx) => {
            return this.passwordFieldType[inx].type == "password"
              ? "thin-eye"
              : "thin-eye-off";
          };
        },
      },
    });

    const RadiusChallenge = defineComponent({
			template: '#radius-challenge-box',
			props: ["username", "question", "original"],
      data() {
        return {
          fields: {
            username: "",
            question: "",
            original: "",
          },
          answer: "",
          error_message: "",
        };
      },
      mounted() {
        this.fields.username = this.$props.username;
        this.fields.question = this.$props.question;
        this.fields.original = this.$props.original;

        login.onRadiusChallengeSucceeded = () => {};

        login.onRadiusChallengeFailed = (data) => {
          const {
            username = "",
            original = "",
            question = "",
          } = data?.data?.message ?? {};
          this.fields.username = username;
          this.fields.original = original;
          this.fields.question = question;
          this.answer = "";

          this.focusAnswer();
        };

        login.onLoginFailed = (data) => {
          this.$emit("radius-challenge-login-failed", data);
        };

        this.focusAnswer();
      },
      methods: {
        focusAnswer() {
          nextTick(() => {
            this.$refs?.answerField?.focus();
          });
        },
        onSubmit() {
          const { username, original } = this.fields;
          login.radiusChallengeResponse(username, original, this.answer);
        },
        onCancel() {
          this.$emit("switch-mode", { mode: "login" });
        },
      },
    });

    const MainApp = defineComponent({
			template: '#main-app',
      data() {
        return {
          allowAnonymous: false,
          mode: "login",
          props: {
            changePassword: null,
            login: null,
            radiusChallenge: null,
          },
        };
      },
      methods: {
        cancelLogin() {
          let htmlRes = "login.html";
          window.location.href =
            window.location.origin +
            (window.location.pathname.endsWith(htmlRes)
              ? window.location.pathname.substring(
                  0,
                  window.location.pathname.length - htmlRes.length
                )
              : window.location.pathname);
        },
        onCredentialsExpired({ username }) {
          this.props.changePassword = {
            username: username,
          };
          this.mode = "changepassword";
        },
        onRadiusChallenge(data) {
          this.props.radiusChallenge = data;
          this.mode = "radius-challenge";
        },
        onRadiusChallengeLoginFailed(data) {
          this.mode = "login";
          this.props.login = { errormsg: processLoginResponseErrorMsg(data) };
        },
        onSwitchMode(data) {
          this.mode = data.mode;
        },
      },
      computed: {
        kaComponent(){
          const appComponents = [
            {id: 1, mode: 'login', component: 'login-box'},
            {id: 2, mode: 'changepassword', component: 'changepassword-box'},
            {id: 3, mode: 'radius-challenge', component: 'radius-challenge-box'}
          ];
          return appComponents.find(t => t.mode == this.mode).component;
        }
      },
      mounted() {
        login.init();

        let queryError = helper.url.gup("errmsg");
        try {
          if (typeof queryError === "string" && queryError.length > 0) {
            queryError = decodeURI(queryError).replace(/\+/g, " ");
          } else queryError = null;
        } catch (err) {
          queryError = null;
        }

        if (queryError) {
          this.props.login = { errormsg: queryError };
        }
      },
    });

		app.component('login-box', LoginBox);
		app.component('changepassword-box', ChangePasswordBox);
		app.component('radius-challenge-box', RadiusChallenge);
		app.component('main-app', MainApp);
		app.mount('#app');
  });
}

renderPage();
