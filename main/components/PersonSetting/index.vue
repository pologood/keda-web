<template>
	<div>
		<kc-form label-width="4rem">
			<h3>修改密码<i class="kedaIconfont KD-baocun keda-icon-heavy-style" title="保存" @click="savePwd"></i></h3>
			<kc-form-item  label="旧密码">
				<kc-input type="password" v-model="oldPwd"></kc-input>
			</kc-form-item>
			<kc-form-item  label="新密码">
				<kc-input type="password" v-model="newPwd"></kc-input>
			</kc-form-item>
			<kc-form-item  label="密码确认">
				<kc-input type="password" v-model="repeatPwd"></kc-input>
			</kc-form-item>
		</kc-form>
		<kc-form label-width="4rem">
			<h3 class="content-bottom-title">修改主页<i title="保存" @click="saveHomePage" class="kedaIconfont KD-baocun keda-icon-heavy-style"></i></h3>
			<kc-form-item label="业务主页" >
				<kc-input v-model="business" @focus="businessClick"></kc-input>
			</kc-form-item>
		</kc-form>
		<kc-modal
			width="16.2rem"
			:title=this.typesName
			:visible.sync="menuDialog"
			class="business-homepage"
			append-to-body>
			<div class="tree m-scroll"> 
        <kd-tree
          :load="loadNode"
          lazy
          :data="treedata"
          :props="keymap"
          :styles="styles"
          @node-click="handleChange">
        </kd-tree>
      </div>
		</kc-modal>
	</div>
</template>
<script>
import Auth from 'utils/auth';
import {userInfoApi, changePasswordApi, updateHomePage} from '../../service/person.js';
import { logoutApi } from '../../service/login.js';
import Constants from 'utils/constants';
  
export default {
	name: 'Modal',
	data: function () {
		return {
			menuDialog: false,
			typesName: '',
			userinfo: {},
			updateuser: Auth.getUserInfo(),
			oldPwd: '',
			newPwd: '',
			repeatPwd: '',
			business: '',
			username: '',
			password: '',
			homePageParams: {
				businessHomepage: '',
				businessHomepageUrl: ''
			},
			treedata: {},
			keymap: {
				children: 'children',
				label: 'name',
				isLeaf: 'leaf'
			},
			styles: {
				icon: {
					color: '#FFA70B',
					folder: 'wenjianjia'
				}
			}
		};
	},
	mounted () {
		this.password = this.updateuser.password;
		this.username = this.updateuser.username;
		this.$el.addEventListener('click', (e) => {
			e.stopPropagation();
		});
	},
	created () {
		this.init();
		this.treedata = JSON.parse(localStorage.getItem(Constants.MENU_NAME));
	},
	methods: {
		loadNode(node, resolve){
			console.log(node, '树');
			if (node.level === 0) {
				return resolve(node.data.map(item => {
					if (!item.children || item.children.length === 0) {  // 如果没有子菜单则当前菜单为叶子节点
						return {...item, leaf: true};  // leaf为true时表示叶子节点
					} else {
						return {...item};
					}
				}));
			} else {
				return resolve(node.data.children.map(item => {
					if (!item.children || item.children.length === 0) {
						if (item.url) {
							return {...item, leaf: true};
						}
					} else {
						let flag = true;
						if(item.children && item.children.length > 0){
							item.children.forEach(obj => {  // 如果当前菜单的子菜单都没有子菜单或者都没有url，则设为叶子节点
								if (obj.children || obj.url) {
									flag = false;
								}
							});
							if (flag && item.url) {
								return {...item, leaf: true};
							} else {
								return {...item};
							}
						} else {
							return {...item, leaf: true};
						}
					}
				}));
			}
		},
		handleChange (data) {
			console.log(data, '///////////');
			if (data.url) {
				this.homePageParams.businessHomepageUrl = data.url;
				this.homePageParams.businessHomepage = data.name;
				this.business = data.name;
				this.menuDialog = false;
			}
		},
		saveHomePage() {
			if (this.homePageParams.businessHomepageUrl) {
				updateHomePage(this.homePageParams).then(response => {
					if (response.status === 200) {
						this.$alert('主页设置成功！', '提示', {
							confirmButtonText: '确定',
							callback: () => {
							}
						});
					}
				});
			} else {
				this.$alert('请选择主页！', '提示', {
					confirmButtonText: '确定'
				});
			}
		},
		async init(){
			let result = await userInfoApi({});
			console.log(1111111111111111111111111);
			console.log('userInfoApi result', result);
			if (result.user.id) {
				this.userinfo = result.user;
			}
		},
			// 更改当前用户密码
		savePwd () {
			if (this.oldPwd === '') {
				this.$alert('请输入旧密码', '提示', {
					confirmButtonText: '确定',
					type: 'warning'
				});
				return false;
			}
			if (this.newPwd === '') {
				this.$alert('新密码不能为空！', '提示', {
					confirmButtonText: '确定',
					type: 'warning'
				});
				return false;
			}
			if (this.newPwd !== this.repeatPwd) {
				this.$alert('两次新密码输入不一致！', '提示', {
					confirmButtonText: '确定',
					type: 'warning'
				});
				return false;
			}
			let params = {
				oldPassword: this.oldPwd,
				password: this.newPwd
			};
			changePasswordApi(params).then(result => {
				console.log('result>>>>>>>>>', result);
				let msn = result.message || result[0].message;
				if (!msn){
					this.$alert('保存新密码成功', '提示', {
						confirmButtonText: '确定',
						type: 'success',
						callback: () => {
							this.logOut();
						}
					});
					this.oldPwd = '';
					this.newPwd = '';
					this.repeatPwd = '';
				} else { //原密码输错或密码不符合要求
					this.$alert(msn, '提示', {
						confirmButtonText: '确定',
						type: 'warning'
					});
					this.oldPwd = '';
					this.newPwd = '';
					this.repeatPwd = '';
				} 
			});
		},
			// window.location.hrefK
		backOperation () {
			this.menuDialog = false;
			this.business = '';
		},
		dialogConfirm () {
			this.menuDialog = false;
		},
			// 业务主页弹出层
		businessClick: function () {
			this.typesName = '业务主页';
			this.menuDialog = true;
		},
			// 退出登录
		logOut () {
			this.$confirm('确定要退出应用吗？', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(() => {
				logoutApi().then(res => {
				});
				Auth.exit();
			});
		}

	}
};
</script>
