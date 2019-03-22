<template>
	<div class="userMgt-userMgt-userInfo">
		<div class="search-list">
			<div class="option">
				<p @click="addUser" class="add-user">
					<i class="icon kedaIconfont KD-tianjiaxiao keda-icon-style"></i><span>新增</span>
				</p>
				<p class="delete-user" @click="delMoreUser">
					<i class="icon kedaIconfont KD-shanchuda1 keda-icon-style"></i><span>删除所选</span>
				</p>
			</div>
			<kc-form class="form-inline" :inline="true" label-width="4rem" label-position="right">
				<kc-form-item label="登录名" class="item">
					<kc-input v-model="searchParams['f_like_username']" placeholder=""
							  @keydown.enter.native="queryAllUsersInfo" clearable>
					</kc-input>
				</kc-form-item>
				<kc-form-item label="(协)警号" class="item">
					<kc-input v-model="searchParams['f_like_code']" placeholder=""
							  @keydown.enter.native="queryAllUsersInfo" clearable>
					</kc-input>
				</kc-form-item>
				<kc-form-item label="警员姓名" class="item">
					<kc-input v-model="searchParams['f_like_name']" placeholder=""
							  @keydown.enter.native="queryAllUsersInfo" clearable>
					</kc-input>
				</kc-form-item>
				<span class="search-span" @click="queryAllUsersInfo()">
					<i slot="suffix" class="icon kedaIconfont KD-sousuo  keda-icon-heavy-style"></i>
				</span>
			</kc-form>
		</div>
		<div class="user-table" v-loading="userDataLoading">
			<div class="border-copy">
				<div class="bg-grey">
				</div>
				<table>
					<thead>
						<tr>
							<th>
								<kc-checkbox @change="selectedAll" v-model="checkedAll" :indeterminate="isIndeterminate"></kc-checkbox>
							</th>
							<th><span>登录名</span></th>
							<th><span>(协)警号</span></th>
							<th><span>警员姓名</span></th>
							<th><span>警员类别</span></th>
							<th><span>所属单位</span></th>
							<th><span>操作</span></th>
						</tr>
					</thead>
					<tbody>
						<tr v-for="(item, index) in userData" :key="index" :class="{active:index == showActive}" @click="choseTableRow(item, index)">
							<td>
								<kc-checkbox v-model="item.checked" @change="selectOne(item)"></kc-checkbox>
							</td>
							<td>
								<span>{{item.username}}</span>
							</td>
							<td>
								<span>{{item.code}}</span>
							</td>
							<td>
								<span v-if="item && item.name">{{item.name}}</span>
								<span v-if="!item">{{item.extendedField ? JSON.parse(item.extendedField).policeName:''}}</span>
							</td>
							<td>
								<span>{{item.extendedField ? [...JSON.parse(item.extendedField).policeTypes].join(' ') : ''}}</span>
							</td>
							<td>
								<span v-if="item">
									<span v-if="item.department && item.department.name">{{item.department.name}}</span>
								</span>
								<span v-if="!item">
									<span>{{item.extendedField ? JSON.parse(item.extendedField).departmentName:''}}</span>
								</span>
							</td>
							<td>
								<span class="option-item" @click="showChangePswDailog(item.id)">
									<kc-tooltip class="item" effect="light" content="修改密码" placement="bottom">
										<i class="icon kedaIconfont KD-suo keda-icon-style"></i>
									</kc-tooltip>
								</span>
								<span class="option-item" @click="changeInfo(item,1)">
									<kc-tooltip class="item" effect="light" content="查看" placement="bottom">
										<i class="icon kedaIconfont KD-xiangqing keda-icon-style keda-icon-info"></i>
									</kc-tooltip>
								</span>
								<span class="option-item" @click="changeInfo(item)">
									<kc-tooltip class="item" effect="light" content="编辑" placement="bottom">
										<i class="icon kedaIconfont KD-bianjixiao keda-icon-style keda-icon-edit"></i>
									</kc-tooltip>
								</span>
								<span class="option-item" @click="delCurUser(item.id, index, item.username)">
									<kc-tooltip class="item" effect="light" content="删除" placement="bottom">
										<i class="icon kedaIconfont KD-shanchuxiao2 keda-icon-style keda-icon-delete"></i>
									</kc-tooltip>
								</span>
							</td>
						</tr>
					</tbody>
				</table>
			</div>
			<div class="kc-table__empty-block" v-show="userData.length === 0"><span class="kc-table__empty-text">暂无数据</span>
			</div>
		</div>
		<div class="page" v-show="userData.length > 0">
			<kc-pagination
				@size-change="handleSizeChange"
				@current-change="changePage"
				:page-sizes="[10, 20, 30, 40, 50, 100]"
				:page-size="searchParams.pageSize"
				:current-page=searchParams.pageNo
				layout=" total,sizes, prev, pager, next"
				:total="pageTotal">
			</kc-pagination>
		</div>
		<div class="user-details">
			<!-- 添加用户信息弹出层 -->
			<kc-modal :title="dialogTitle" width="44%" :visible.sync="addDialogInfoVisible">
				<kc-form :inline="true" :model="userFormDetail" :rules="rules2" ref="addUserForm"
						 class="demo-ruleForm" :disabled="openAddDialogFor === 'review'">
					<kc-form-item label="(协)警号" prop="personCode">
						<kc-input v-model="userFormDetail.personCode"></kc-input>
					</kc-form-item>
					<kc-form-item label="登录名" prop="username">
						<kc-input v-model="userFormDetail.username"
								  :disabled="openAddDialogFor === 'modify'"></kc-input>
					</kc-form-item>
					<kc-form-item label="警员姓名" prop="policeName">
						<!--<kc-input v-model="userFormDetail.policeName" @click.native="showPoliceDailog()"-->
								  <!--readonly></kc-input>-->
						<kc-input v-model="userFormDetail.policeName"></kc-input>
					</kc-form-item>
					<kc-form-item label="警员类别" prop="policeTypes">
						<kc-select v-model="userFormDetail.policeTypes" :disabled="openAddDialogFor === 'review'"
								   multiple
								   collapse-tags
								   placeholder="请选择警员类别" style="width: 100%">
							<kc-option
								v-for="item in policeTypeList"
								:key="item.description"
								:label="item.description"
								:value="item.description">
							</kc-option>
						</kc-select>
					</kc-form-item>
					<kc-form-item label="警员职务" prop="policeDuties">
						<kc-input v-model="userFormDetail.policeDuties"></kc-input>
					</kc-form-item>
					<kc-form-item label="身份证号" prop="IDnumber">
						<kc-input v-model="userFormDetail.IDnumber"></kc-input>
					</kc-form-item>
					<kc-form-item label="联系电话" prop="ContactNum">
						<kc-input v-model="userFormDetail.ContactNum"></kc-input>
					</kc-form-item>
					<kc-form-item label="手机号码" prop="phoneNumber">
						<kc-input v-model="userFormDetail.phoneNumber"></kc-input>
					</kc-form-item>
					<kc-form-item label="GIS主页" prop="Gis">
						<kc-input v-model="userFormDetail.Gis" @click.native="gisMain()" readonly disabled></kc-input>
					</kc-form-item>
					<kc-form-item label="业务主页" prop="business">
						<kc-input v-model="userFormDetail.business" @click.native="businessMain()"
								  readonly></kc-input>
					</kc-form-item>
					<kc-form-item label="所属单位" prop="departmentName">
						<kc-input v-model="userFormDetail.departmentName" @click.native="affiliation()" readonly  :disabled="openAddDialogFor !== 'newUser'"></kc-input>
					</kc-form-item>
					<kc-form-item label="绑定IP" prop="bindIp">
						<kc-input v-model="userFormDetail.bindIp"></kc-input>
					</kc-form-item>
					<kc-form-item label="用户状态" prop="userStatus">
						<kc-select v-model="userFormDetail.userStatus" clearable placeholder="请选择" :disabled="openAddDialogFor === 'review'">
							<kc-option v-for="item in userStatusInfos" :key="item.value" :label="item.label"
									   :value="item.value" >
							</kc-option>
						</kc-select>
					</kc-form-item>
					<kc-form-item label="所属警种" prop="policeCategory">
						<kc-select v-model="userFormDetail.policeCategory" clearable placeholder="">
							<kc-option v-for="item in policeTypeInfos" :key="item.value" :label="item.label"
									   :value="item.value">
							</kc-option>
						</kc-select>
					</kc-form-item>
					<kc-form-item label="视频路数" prop="videoRoute">
						<kc-select v-model="userFormDetail.videoRoute" clearable :disabled="openAddDialogFor === 'review'">
							<kc-option v-for="item in videoRouteInfos" :key="item.value" :label="item.label"
									   :value="item.value" >
							</kc-option>
						</kc-select>
					</kc-form-item>
					<kc-form-item label="有效期限" prop="usefulData">
						<kc-date-picker v-model="userFormDetail.usefulData" type="date"
										placeholder=""></kc-date-picker>
					</kc-form-item>
					<kc-form-item label="用户描述" prop="describe">
						<kc-input v-model.number="userFormDetail.describe"></kc-input>
					</kc-form-item>
				</kc-form>
				<span slot="footer" class="dialog-footer">
						<kc-button @click="addDialogInfoVisible = false" size="small">{{openAddDialogFor === 'review' ? '关 闭' : '取 消'}}</kc-button>
						<kc-button type="primary" size="small" @click="saveAdd('addUserForm')" v-if="openAddDialogFor !== 'review'">保 存</kc-button>
				</span>
			</kc-modal>
		</div>
		<!-- 弹出层 -->
		<kc-modal :title="typesName" :visible.sync="userDialog" width="30%">
			<gis-main :userId="this.userId" v-on:changeGis="changeGis" v-if="gisShow"></gis-main>
			<business-main :user-id="this.userId" @changeBusiness="changeBusiness" v-show="businessShow"></business-main>
			<department v-show="deptDialogShow" v-on:changeDepartment="changeDepartment"></department>
			<span slot="footer" class="dialog-footer">
				<kc-button @click="userDialog = false" size="small">取 消</kc-button>
				<kc-button type="primary" size="small" @click="dialogConfirm">确 定</kc-button>
			</span>
		</kc-modal>

		<kc-modal title="提示" :visible.sync="changePswDailog" width="30%">
			<span>
				您确认要重置密码么？
			</span>
			<span slot="footer" class="dialog-footer">
				<kc-button @click="changePswDailog = false" size="small">取 消</kc-button>
				<kc-button type="primary" size="small" @click="changePsw">确 定</kc-button>
		 	</span>
		</kc-modal>
		<user-selct v-bind:dialogVisible="usDialogConfig.usDialogVisible"
					v-bind:firstLevelAudit="usDialogConfig.firstLevelAudit"
					v-bind:secondLevelAudit="usDialogConfig.secondLevelAudit"
					v-bind:currentValue="usDialogConfig.currentValue"
					v-on:closeUserSelectDialog="closeUSDialog">
		</user-selct>
	</div>
</template>
<script>
	import PoliceCategory from './PoliceCategory';
	import GisMain from './GisMain';
	import BusinessMain from './BusinessMain';
	import Department from './Department';
	import UserSelct from './UserSelect';
	import Vue from 'vue';
	import {
		getAllUsersApi
	} from '../../../service/userMgt.js';
	import myGlobal from '../../../utils/myGlobal';
	import { createNamespacedHelpers } from 'vuex';
	const { mapState, mapMutations, mapActions } = createNamespacedHelpers('userMgtStore');
	export default {
		components: {
			PoliceCategory,
			GisMain,
			BusinessMain,
			Department,
			UserSelct
		},
		props: {
			department: '',
			depData: {
				type: Array
			}
		},
		data() {
			return {
				showActive: 0, // 用户选中状态class
				isIndeterminate: false,
				checkedAll: false,
				usDialogConfig: {
					usDialogVisible: false,
					firstLevelAudit: false,
					secondLevelAudit: false
				},
				userInfoDetails: null,
				userFormDetail: null,
				addDialogInfoVisible: false,
				changePswDailog: false, // 重置密码模态框
				currentIdForChangePsw: '', // 临时存储要重置密码的ID
				currentPerson: null,
				tmpRow: null,
				dialogTitle: '添加用户信息',
				dialogInfoVisible: false,
				openAddDialogFor: '', // review  modify addnew
				gisNodename: '',
				businessNodename: '',
				departmentName: '',
				policeShow: false,
				gisShow: false,
				businessShow: false,
				deptDialogShow: true,
				userDialog: false,
				typesName: '',
				userDataLoading: true
			};
		},
		computed: {
			...mapState({
				defaultDepId: state => state.userMgt.defaultDepId,
				userData: state => state.userMgt.userData,
				pageNo: state => state.userMgt.pageNo,
				pageSize: state => state.userMgt.pageSize,
				pageTotal: state => state.userMgt.pageTotal,
				userId: state => state.userMgt.userId,
				searchParams: state => state.userMgt.searchParams,
				policeTypeList: state => state.userMgt.policeTypeList,
				rules2: state => state.userMgt.rules2,
				policeTypeInfos: state => state.userMgt.policeTypeInfos,
				userStatusInfos: state => state.userMgt.userStatusInfos,
				videoRouteInfos: state => state.userMgt.videoRouteInfos,
				originOfUserInfoDetails: state => state.userMgt.originOfUserInfoDetails
			}),
			// 点击表格checkbox获取用户id集合
			ids(){
				let result = [];
				for (let i = 0, len = this.userData.length; i < len; i++) {
					if (this.userData[i].checked) {
						result.push(this.userData[i].id);
					}
				}
				return result;
			},
			// 点击表格checkbox全选状态样式
			checkSelectStatus(){
				let flag = {
					checkedAll: false,
					isIndeterminate: false
				};
				let i = 0;
				this.userData.forEach(item => {
					if (item.checked === true) {
						i++;
					}
				});
				if (i === 0) {
					flag.checkedAll = false;
					flag.isIndeterminate = false;
				} else if (i === this.userData.length) {
					flag.isIndeterminate = false;
					flag.checkedAll = true;
				} else {
					flag.isIndeterminate = true;
				}
				return flag;
			}
		},
		watch: {
			depData(val) {
				this.USERINFO_DEFAULT_DEPID(val[0].id);
				this.queryAllUsersInfo();
			},
			dialogInfoVisible(val) {
				if (!val) {
					this.$nextTick(() => {
						this.$refs.ruleForm1.resetFields();
					});
				}
			},
			addDialogInfoVisible(val) {
				if (!val) {
					this.$nextTick(() => {
						this.$refs.addUserForm.resetFields();
					});
				}
			},
			// 部门
			department(val) {
				this.userFormDetail.departmentName = val.name;
				this.USERINFO_DEFAULT_DEPID(val.id);
				this.queryAllUsersInfo();
			}
		},
		methods: {
			...mapActions({
				userMgtAddNewUser: 'userMgtAddNewUser',
				userMgtModifyUser: 'userMgtModifyUser',
				userMgtDelCurUser: 'userMgtDelCurUser',
				userMgtDelMoreUser: 'userMgtDelMoreUser',
				userMgtGetPoliceType: 'userMgtGetPoliceType',
				userMgtChangePsw: 'userMgtChangePsw'
			}),
			...mapMutations({
				USERINFO_DEFAULT_DEPID: 'USERINFO_DEFAULT_DEPID',
				All_USERS_INFO: 'All_USERS_INFO',
				USERINFO_UPDATE_PAGE_TOTAL:	'USERINFO_UPDATE_PAGE_TOTAL',	// 更新页码
				USERINFO_UPDATE_PAGE_SIZE: 'USERINFO_UPDATE_PAGE_SIZE',
				USERINFO_UPDATE_PAGE: 'USERINFO_UPDATE_PAGE',
				USERINFO_UPDATE_USER_ID: 'USERINFO_UPDATE_USER_ID'
			}),
			initObjformOrigin(has1) { // init the varibles, too many collections to change them, use this formate funcion.
				switch (has1) {
				case 'has1':
					this.userFormDetail = {...this.originOfUserInfoDetails};
					break;
				case 'no1':
					this.userInfoDetails = {...this.originOfUserInfoDetails};
					break;
				}
			},
			closeUSDialog(res) {
				this.currentPerson = JSON.parse(JSON.stringify(res));
				if (this.currentPerson.department) {
					this.userFormDetail.departmentName = this.currentPerson.department.name;
				} else {
					this.userFormDetail.departmentName = '无';
				}
				this.userFormDetail.policeId = this.currentPerson.id;
				this.userFormDetail.policeName = this.currentPerson.name;
				this.usDialogConfig.usDialogVisible = false;
			},
			// 重置密码弹框
			showChangePswDailog(id) {
				this.currentIdForChangePsw = id;
				this.changePswDailog = true;
			},
			// 重置密码
			changePsw() {
				let vm = this;
				let params = {
					password: myGlobal.getDefaultPass(),
					id: this.currentIdForChangePsw
				};
				this.userMgtChangePsw({params, vm});
			},
			changePoliceCategory(val) {
				this.userFormDetail.policeTypes = val;
			},
			// 获取所有用户方法
			queryAllUsersInfo () {
				this.userDataLoading = true;
				this.searchParams['f_like_name'] = this.searchParams['f_like_name'].trim();
				this.searchParams['f_like_code'] = this.searchParams['f_like_code'].trim();
				this.searchParams['f_like_username'] = this.searchParams['f_like_username'].trim();
				let params = {
					...this.searchParams,
					'f_eq_department.id': this.defaultDepId,
					pageNo: this.pageNo,
					pageSize: this.pageSize,
					'f_eq_status': 1// 状态（不传-查询全部）
				};
				this.$emit('chosedRole', {}); // 预先清空
				getAllUsersApi(params).then(res => {
					let result = res.result;
					this.userDataLoading = false;
					if (result) {
						this.isIndeterminate = false;
						this.checkedAll = false;
						if (result.data && result.data.length > 0) {
							this.choseTableRow(result.data[0], 0);
						}else{
							this.$emit('chosedRole', {}); // 预先清空
						}
						result.data.forEach(item => {
							item.checked = false;
						});
						this.All_USERS_INFO(result.data);
						this.USERINFO_UPDATE_PAGE_TOTAL(result.total);
					}
				}, err => {
					this.$message.warning(err);
					this.userDataLoading = false;
				});
			},
			// 添加用户
			addUser() {
				this.dialogTitle = '添加用户信息';
				this.openAddDialogFor = 'newUser';
				this.initObjformOrigin('has1');
				this.userFormDetail.videoRoute = '4';
				this.addDialogInfoVisible = true;
				this.$refs.addUserForm.resetFields();
			},
			// 修改用户详情
			changeInfo(row, s) {
				this.initObjformOrigin('has1');
				let extendedField = '';
				if(row.extendedField){
					extendedField = {...JSON.parse(row.extendedField)};
				}
				this.userFormDetail = {
					id: row.id,
					username: row.username,
					policeName: row.name,
					policeDuties: row.position,
					describe: row.remark,
					personCode: row.code,
					videoRoute: extendedField.videoRoute ? extendedField.videoRoute : '',
					departmentName: row.department ? row.department.name : '',
					department: { id: row.department.id, name: row.department.name + '-' + row.department.code, code: row.department.code },
					policeCategory: extendedField.policeCategory ? extendedField.policeCategory : '', //所属警种类
					policeTypes: extendedField.policeTypes ? extendedField.policeTypes : [], // 警员类型
					business: extendedField.business ? extendedField.business : '', //业务主页
					ContactNum: extendedField.ContactNum ? extendedField.ContactNum : '', //联系电话
					bindIp: extendedField.bindIp ? extendedField.bindIp : '', //IP
					usefulData: extendedField.usefulData ? extendedField.usefulData : '', //有效期
					userStatus: row.status,
					phoneNumber: row.phone,
					IDnumber: row.identity,
					Gis: extendedField.Gis ? extendedField.Gis : '' //Gis主页
				};
				if (!s) {
					this.dialogTitle = '修改用户信息';
					this.openAddDialogFor = 'modify';
				} else {
					this.dialogTitle = '查看用户信息';
					this.openAddDialogFor = 'review';
				}
				this.addDialogInfoVisible = true;
				// this.$refs.addUserForm.resetFields();
			},
			// 保存添加、修改用户
			saveAdd(formName) {
				const {userFormDetail, tmpRow} = this;
				this.$refs[formName].validate((valid) => {
					if (!valid) return;
					let params = {
						username: userFormDetail.username,
						status: userFormDetail.userStatus,
						email: '',
						remark1: '',
						remark2: '',
						sex: 1, //默认男
						extendedField: {
							policeTypes: [],
							policeCategory: '',
							policeDuties: '',
							videoRoute: '',
							Gis: ''
						}
					};
					switch (this.openAddDialogFor) {
					case 'newUser':
						params.password = myGlobal.getDefaultPass();
						params.name = userFormDetail.policeName;
						params.extendedField.policeTypes = userFormDetail.policeTypes;//警员类别
						params.extendedField.policeCategory = userFormDetail.policeCategory;//所属警种
						params.extendedField.policeDuties = userFormDetail.policeDuties;//警员职务
						params.extendedField.videoRoute = userFormDetail.videoRoute;//视频路数
						params.extendedField.business = userFormDetail.business;//业务主页
						params.extendedField.Gis = userFormDetail.Gis;
						params.extendedField.ContactNum = userFormDetail.ContactNum;//联系电话
						params.extendedField.bindIp = userFormDetail.bindIp; //IP
						params.extendedField.usefulData = userFormDetail.usefulData;//有效期
						params.code = userFormDetail.personCode;//用户编号 就是协警号
						params.identity = userFormDetail.IDnumber;
						params.remark = userFormDetail.describe; //用户描述
						params.phone = userFormDetail.phoneNumber;
						params.position = userFormDetail.policeDuties;
						params.department = this.userFormDetail.department;
						let vm = this;
						this.userMgtAddNewUser({params, vm});
						break;
					case 'review':
						console.log('review');
						break;
					case 'modify':
						params.id = userFormDetail.id;
						params.name = userFormDetail.policeName;
						params.extendedField.policeTypes = userFormDetail.policeTypes;//警员类别
						params.extendedField.policeCategory = userFormDetail.policeCategory;//所属警种
						params.extendedField.policeDuties = userFormDetail.policeDuties;//警员职务
						params.extendedField.videoRoute = userFormDetail.videoRoute;//视频路数
						params.extendedField.business = userFormDetail.business;
						params.extendedField.Gis = userFormDetail.Gis;
						params.extendedField.ContactNum = userFormDetail.ContactNum;//联系电话
						params.extendedField.bindIp = userFormDetail.bindIp; //IP
						params.extendedField.usefulData = userFormDetail.usefulData;//有效期
						params.code = userFormDetail.personCode;//用户编号 就是协警号
						params.email = tmpRow.email;
						params.remark1 = tmpRow.remark1;
						params.remark2 = tmpRow.remark2;
						params.identity = userFormDetail.IDnumber;
						params.remark = userFormDetail.describe; //用户描述
						params.phone = userFormDetail.phoneNumber;
						params.position = userFormDetail.policeDuties;
						params.department = this.userFormDetail.department;
						let editThis = this;
						this.userMgtModifyUser({params, editThis});
						break;
					}
				});
			},
			// 删除单个用户
			delCurUser(id, index, name) {
				this.$confirm('您确定要删除用户：' + name + ' 吗?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					closeOnClickModal: false,
					type: 'warning'
				}).then(() => {
					let params = {
						id: id,
						info: {
							command: 'STOP'
						}
					};
					let vm = this;
					this.userMgtDelCurUser({params, vm, index});
				}).catch(() => {
				});
			},
			// 批量删除用户
			delMoreUser() {
				if (this.ids.length === 0) {
					this.$message.warning('请选择要删除的用户！');
					return;
				}
				this.$confirm('您确定要删除勾选的用户吗?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					closeOnClickModal: false,
					type: 'warning'
				}).then(() => {
					let params = {
						command: 'STOP',
						ids: this.ids
					};
					if (this.ids) {
						let vm = this;
						this.userMgtDelMoreUser({params, vm});
					}
				}).catch(() => {
				});
			},
			// 全选
			selectedAll(event) {
				if (event) {
					this.userData.filter(function (item) {
						Vue.set(item, 'checked', true);
					});
					this.checkedAll = true;
					this.isIndeterminate = false;
				} else {
					this.userData.filter(function (item) {
						Vue.set(item, 'checked', false);
					});
					this.isIndeterminate = false;
					this.checkedAll = false;
				}
			},
			// 单选
			selectOne(val) {
				this.userData.forEach((v, i) => {
					if(v.id == val.id){
						this.userData[i].checked = val.checked;
					}
				});
				this.All_USERS_INFO(this.userData);
				this.checkedAll = this.checkSelectStatus.checkedAll;
				this.isIndeterminate = this.checkSelectStatus.isIndeterminate;
			},
			// 每页条数更改
			handleSizeChange(pageSize) {
				this.USERINFO_UPDATE_PAGE_SIZE(pageSize);
				this.USERINFO_UPDATE_PAGE(0);
				this.queryAllUsersInfo();
			},
			// 改变页码
			changePage(pageNo) {
				pageNo = pageNo - 1;
				this.USERINFO_UPDATE_PAGE(pageNo);
				this.queryAllUsersInfo();
			},
			// 清除所有已选checkbox
			clearSelection(data) {
				data.filter(function (item) {
					Vue.set(item, 'checked', false);
				});
			},
			//选中当前行
			choseTableRow(row, index) {
				this.$emit('chosedRole', row);
				this.tmpRow = row;
				this.showActive = index;
			},
			// gis主页 弹出层
			gisMain() {
				this.USERINFO_UPDATE_USER_ID(this.userFormDetail.id);
				if (this.openAddDialogFor) {
					return;
				}
				this.typesName = 'Gis主页';
				this.type = 'Gis主页';
				this.userDialog = true;
				this.policeShow = false;
				this.gisShow = true;
				this.businessShow = false;
				this.deptDialogShow = false;
			},
			// 业务主页 弹出层
			businessMain() {
				if (this.openAddDialogFor === 'review') {
					return;
				}
				this.typesName = '业务主页';
				this.type = '业务主页';
				this.userDialog = true;
				this.policeShow = false;
				this.gisShow = false;
				this.deptDialogShow = false;
				this.businessShow = true;
			},
			// 所属单位 弹出层
			affiliation() {
				if (this.openAddDialogFor !== 'newUser') {
					return;
				}
				this.typesName = '所属单位';
				this.type = '所属单位';
				this.userDialog = true;
				this.policeShow = false;
				this.gisShow = false;
				this.deptDialogShow = true;
				this.businessShow = false;
			},
			// gis主页 获取点击的节点名称
			changeGis(nodename) {
				this.gisNodename = nodename;
			},
			// 业务主页 获取点击的节点名称
			changeBusiness(nodename) {
				this.businessNodename = nodename.name;
			},
			// 所属单位 获取点击的节点名称
			changeDepartment(name, code, id, status) {
				this.departmentName = name;
				this.userFormDetail.department = {
					name: name + '-' + code, //科达科技-101000 接口规范
					code: code,
					id: id,
					status: status
				};
			},
			// 弹出层 确定按钮
			dialogConfirm() {
				this.userDialog = false;
				switch (this.type) {
				case '警员类别':
					break;
				case 'Gis主页':
					this.userFormDetail.Gis = this.gisNodename;
					break;
				case '业务主页':
					this.userFormDetail.business = this.businessNodename;
					break;
				case '所属单位':
					this.userFormDetail.departmentName = this.departmentName;
					break;
				}
			}
		},
		created() {
			this.initObjformOrigin('has1');
			this.initObjformOrigin('no1');
		},
		mounted() {
			// 警员类别数据请求
			this.userMgtGetPoliceType({});
		}
	};
</script>

