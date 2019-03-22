<template>
	<div class="person-center-box">
		<div class="myself">
			<img @click="checkPersonal" src="../../assets/images/police.png" alt="我的">
		</div>

		<div v-show="personalShow" class="personal-center">
			<div class="triangle"></div>
			<div class="personal-title">
				<div class="buddha">
					<img src="../../assets/images/police.png" alt="我的">
				</div>
				<div class="name">{{userinfo.username}}</div>
			</div>
			<div class="personal-content">
        <span class="icons">
          <kc-tooltip content="换肤" placement="bottom" effect="light">
            <span @click.stop="updateHomePage('theme')">
              <i class="kedaIconfont KD-huanfu"></i>
            </span>
          </kc-tooltip>
          <kc-tooltip content="下载" placement="bottom" effect="light">
            <span @click.stop="lookDownload">
              <i class="kedaIconfont KD-xiazaixiao"></i>
            </span>
          </kc-tooltip>
          <kc-tooltip content="设置" placement="bottom" effect="light">
            <span @click.stop="updateHomePage('setting')">
              <i class="kedaIconfont KD-shezhixiao"></i>
            </span>
          </kc-tooltip>
          <kc-tooltip content="退出登录" placement="bottom" effect="light">
            <span @click.stop="logOut">
              <i class="kedaIconfont KD-tuichuxiao"></i>
            </span>
          </kc-tooltip>
        </span>
				<p>
					<span>用户单位</span>{{userinfo.deptName}}
				</p>
				<p>
					<span>登录地址</span>{{localAddr}}
				</p>
				<p>
					<span>当前时间</span>{{currentdate}}
				</p>
			</div>
		</div>

		<div v-show="downloadShow" class="download-center">
			<h3>下载
				<i @click.stop="closeDownload" class="kedaIconfont KD-guanbixiao"></i>
			</h3>
			<p v-show="!downloadList.length">暂无下载任务！</p>
			<section class="m-scroll">
				<div class="item" v-for="(item,index) in downloadList" :key="index">
					<p>{{item.downloadType}}</p>
					<kc-progress
						:text-inside="true"
						:stroke-width="7"
						:show-text="false"
						:percentage="item.status == 'Y' ? 100 : item.percentage*1"
					></kc-progress>
					<p>
						{{item.beginTime}}
						<span>{{item.status == "Y" ? "完成" : "下载中"}}</span>
					</p>
				</div>
			</section>
		</div>
	</div>
</template>
<script>
	import Auth from 'utils/auth';
	import Global from 'utils/global';

	import { userInfoApi, getLocalAddr } from '../../service/person.js';
	// import Constants from 'utils/constants';
	// import { postMessage } from 'utils/event-bus';
	import { logoutApi } from '../../service/login.js';

	export default {
		name: 'Menu',
		props: {
			index: {
				type: Number,
				default: 0
			},
			percentage: {
				type: Number,
				default: 0
			}
		},
		data() {
			return {
				localAddr: '',
				userinfo: {},
				personalShow: false,
				downloadShow: false,
				downloadList: [],
				currentdate: '',
				interval: null,
				stompClient: null,
				username: '',
				password: '',
				timeInterval: null,
				clientId: '',
				currentDownload: '',
				downloadInfoSubscribe: null,
				downloadCompleteSubscribe: null
			};
		},
		mounted() {
			let _this = this;
			document.querySelector('.person-center-box').addEventListener('click', e => {
				e.stopPropagation();
				_this.personalShow = true;
			});
			document.querySelector('.download-center').addEventListener('click', e => {
				e.stopPropagation();
				_this.downloadShow = true;
			});
			document.addEventListener('click', e => {
				e.stopPropagation();
				this.downloadShow = false;
				this.personalShow = false;
			});
		},
		beforeDestroy() {
			// let _this = this;
			// 必须要取消订阅，否则每次路由跳转跳转会重复订阅同一个主题
			this.downloadInfoSubscribe.unsubscribe();
			this.downloadCompleteSubscribe.unsubscribe();
		},
		computed: {
			themeFlagS() {
				return this.$store.state.themeFlag;
			},
			watermarkFlag() {
				return this.$store.state.main.watermarkFlag;
			}
		},
		watch: {
			personalShow(newVal, oldVal) {
				let _this = this;
				if (newVal) {
					_this.timeInterval = setInterval(() => {
						_this.timeFormat();
					}, 1000);
				} else {
					clearInterval(_this.timeInterval);
				}
			},
			themeFlagS(newVal) {
				this.themeFlag = newVal;
			}
		},
		updated() {
			if (this.$refs.personSettingModel) {
				this.$refs.personSettingModel.style.width =
					document.body.clientWidth + 'px';
				this.$refs.personSettingModel.style.height =
					document.body.clientHeight + 'px';
			}
		},
		created() {
			this.init();
		},
		methods: {
			updateHomePage(val) {
				this.personalShow = true;
				console.log(val, 'val222');
				this.$emit('updateHomePage', val);
			},
			async init() {
				let result = await userInfoApi({});
				console.log('userInfoApi result', result);
				if (result.user.id) {
					this.userinfo = result.user;
					// 页面渲染后即建立 websocket 连接
					this.createWebsocket(this.userinfo.username);
				}
				let addrResult = await getLocalAddr({});
				console.log('addrResult : ', addrResult);
				if (addrResult != null) {
					this.localAddr = addrResult;
				}
			},
			createWebsocket (username) {
				// debugger;
				// let this = this;
				let socket = new window.SockJS(`${Global.getBaseUrl()}/ws/stomp`);
				this.stompClient = window.Stomp.over(socket);
				console.log(this.stompClient, '<<<<-----');
				let connectInfo = { 'usreId': username, 'onDisconnectTopic': '/user', 'clientId': username };
				this.stompClient.connect(connectInfo, frame => {
					console.log(frame, '建立一个websocket');
					this.websocketOnmsg(username);
				});
			},
			websocketOnmsg (username) {
				// let _this = this;
				// 此处只用于显示下载列表
				this.downloadInfoSubscribe = this.stompClient.subscribe(`/user/${username}/downloadInfo`, data => {
					let msg = JSON.parse(data.body);
					this.downloadList = msg.result;
				});
				// 此处只用于下载
				this.downloadCompleteSubscribe = this.stompClient.subscribe(`/user/${username}/downloadComplete`, data => {
					let downloadInfo = JSON.parse(data.body).result;
					if (downloadInfo.downloadUrl && downloadInfo.downloadStatus == 'READY' && this.$route.path.indexOf('map') === -1 && downloadInfo.zipFileName != this.currentDownload) {
						this.currentDownload = downloadInfo.zipFileName;
						let a = document.createElement('a'); // 创建一个<a></a>标签
						a.href = downloadInfo.downloadUrl; // 下载地址
						a.download = downloadInfo.zipFileName;  // 文件名称
						document.body.appendChild(a);
						a.click();
						a.remove();
					}
				});
			},
			intFormat(nub) {
				if (nub >= 0 && nub <= 9) {
					return '0' + nub;
				} else {
					return nub;
				}
			},
			timeFormat() {
				let date = new Date();
				let seperator1 = '-';
				let seperator2 = ':';
				let Y = date.getFullYear();
				let month = date.getMonth() + 1;
				let strDate = date.getDate();
				let H = date.getHours();
				let M = date.getMinutes();
				let S = date.getSeconds();
				this.currentdate =
					Y +
					seperator1 +
					this.intFormat(month) +
					seperator1 +
					this.intFormat(strDate) +
					' ' +
					this.intFormat(H) +
					seperator2 +
					this.intFormat(M) +
					seperator2 +
					this.intFormat(S);
			},
			checkPersonal(e) {
				e.stopPropagation();
				this.personalShow = !this.personalShow;
				this.downloadShow = false;
			},
			lookDownload() {
				console.log('下载');
				this.personalShow = false;
				this.downloadShow = true;
			},
			closeDownload() {
				this.downloadShow = false;
				this.personalShow = true;
			},
			// 退出登录
			logOut() {
				this.$confirm('确定要退出应用吗？', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					logoutApi().then(res => {});
					Auth.exit();
				});
			}
		}
	};
</script>
