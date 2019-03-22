<template>
	<div class="main-login">
		<div v-loading="isLogined"></div>
		<div v-show="!isLogined" class="main-login">
			<img class="login-bg" src="../../assets/images/login-bg.png" alt="">
			<!--<img class="img-text" src="../../assets/images/login-text2.png" alt="">-->
			<div class="img-text"></div>

			<div class="login-right">
				<div class="login-logo">
					<img class="login-logoimg" src="../../assets/images/jinghui.png">
				</div>
				<h3 class="slogan">欢迎登录</h3>
				<kc-form :model="models" ref="loginForm" :rules="rules">
					<div class="user-name">
						<kc-form-item prop="username">
							<kc-input placeholder="用户名" v-model="models.username" auto-complete="off">
								<i slot="prefix" class="kedaIconfont KD-yonghuming"></i>
							</kc-input>
						</kc-form-item>
					</div>
					<div class="user-password">
						<kc-form-item prop="password">
							<kc-input placeholder="密码" type="password" v-model="models.password" auto-complete="off">
								<i slot="prefix" class="kedaIconfont KD-mima"></i>
							</kc-input>
						</kc-form-item>
					</div>
					<div class="box">
						<kc-checkbox v-model="rememberUser">记住用户名</kc-checkbox>
					</div>
					<!--<div class="box">-->
					<!--<kc-radio-group v-model="theme">-->
					<!--<kc-radio-button :label="item.label" v-for="item in themeList" :key="item.label">{{item.name}}</kc-radio-button>-->
					<!--</kc-radio-group>-->
					<!--</div>-->
					<div class="valid-button">
						<kc-button type="primary" @click="userLogin()" id="keybtn" :loading="loading">登录{{loading?'中':''}}
						</kc-button>
						<kc-button class="ukey">UKey登录
						</kc-button>
					</div>
				</kc-form>
			</div>
			<footer class="copyright">Copyright 2017.All Right reserved</footer>
		</div>
	</div>

</template>

<script>
	import Util from 'utils/util';
	import Global from 'utils/global';
	import Constants from 'utils/constants';
	import {postMessage, onMessage, getChromeVersion} from 'utils/event-bus';
	import {loginApi, getHomePage} from '../../service/login.js';
	import Auth from 'utils/auth';

	export default {
		name: 'login',
		data() {
			return {
				loading: false,
				isLogined: true, //用于判断是否已经登录过，如果已经登录过，执行关闭窗口
				models: {
					username: '',
					password: ''
				},
				windows: [
					{
						windowId: 'primary',
						primary: true,
						url: '/tollgate'
					},
					{
						windowId: 'map',
						url: '/map'
					}
				],
				rules: {
					username: [
						{required: true, message: '用户名不能为空', trigger: 'blur'}
					],
					password: [{required: true, message: '密码不能为空', trigger: 'blur'}]
				},
				rememberUser: false, // 记住密码
				theme: Util.getTheme(),
				themeList: [
					{label: Constants.THEME_LIGHT, name: '标准模式'},
					{label: Constants.THEME_DARK, name: '夜间模式'}
				]
			};
		},
		watch: {
			theme() {
				Util.setTheme(this.theme);
			}
		},
		methods: {
			userLogin() {
				if (this.models.username && this.models.password) {
					this.loading = true;
					Auth.setRememberUser(this.rememberUser);
					loginApi(this.models).then(result => {
						this.loading = false;
						if (result && result.jwt_token) {
							Auth.clearStorage();
							Auth.setJwtToken(result.jwt_token);
							Auth.setRefreshToken(result.refresh_token);
							this.models.password = Util.encrypt(this.models.password);
							Auth.setUserInfo(this.models);

							Global.init().then(res => {
								// 获取个人主页的设置
								getHomePage().then(result => {
									console.log(result, '获取个人主页的设置获取个人主页的设置获取个人主页的设置');
									if (result.businessHomepageUrl) {
												// 如果主页存在就设置主页
										this.windows[0].url = result.businessHomepageUrl;
										Global.setWindows(this.windows);
									}
									if(Global.isPopUp()){
										Util.openWindows(Global.getWindows());
									}else{
										let windows = Global.getWindows();
										if(windows.length > 0){
											location.href = Util.getFullUrl(windows[0].url);
										}
									}
								}).catch(result => {
									if(Global.isPopUp()){
										Util.openWindows(Global.getWindows());
									}else{
										let windows = Global.getWindows();
										if(windows.length > 0){
											location.href = Util.getFullUrl(windows[0].url);
										}
									}
								});
							});
						} else {
							this.$alert('无效的用户信息！', '警告', {
								confirmButtonText: '确定',
								callback: action => {
								}
							});
						}
					});
				}
			},
			closeWin() {
				if(Global.isPopUp()){
					window.location.href = 'about:blank';
					window.close();
				}
			}
		},
		created() {
			this.rememberUser = Auth.getRememberUser();
			if (this.rememberUser) {
				this.models.username = Auth.getUserInfo().username;
				this.models.password = Util.decrypt(Auth.getUserInfo().password);
			}
			if(Util.isOpenedWindow()){
				this.isLogined = false;
			}else{
				postMessage(Constants.EVENT_BUS_CODE_CHECK_LOGINED, {status: true});
				onMessage(Constants.EVENT_BUS_CODE_CHECK_LOGINED_CALLBACK, (data) => {
					this.isLogined = true;
					this.closeWin();
				});
			}

			let callbackCount = 0;
			onMessage(Constants.EVENT_BUS_CODE_CLOSE_LOGIN_WIN, () => {
				callbackCount++;
				if(getChromeVersion() <= 60){
					if (callbackCount >= 1) {
						this.closeWin();
					}
				}else{
					if (callbackCount >= Global.getWindows().length) {
						this.closeWin();
					}
				}
			});

			//绑定enter键登陆
			document.onkeydown = (event) => {
				let e = event || window.event;
				if (e && e.keyCode == 13) {
					this.userLogin();
				}
			};
		},
		mounted() {
			setTimeout(() => {
				this.isLogined = false;
			}, 200);
		}
	};
</script>
