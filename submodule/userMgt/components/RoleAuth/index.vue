<template>
	<div class="userMgt-roleAuth">
		<kc-tabs :stretch='true' class="role-tab" @tab-click="tabClick" :disabled="disableRoleAuth">
			<kc-tab-pane label="功能菜单" class="fun-menu-wrapper">
				<function-menu :currentRoleId="roleId"></function-menu>
			</kc-tab-pane>
			<kc-tab-pane label="设备资源" class="video-resources-wrapper">
				<div class="">
					<span>设备类型</span>
					<kc-select  v-model="selected.deviceType" placeholder="请选择设备类型" @change="changeDeviceType">
						<kc-option
							v-for="item in deviceTypes"
							:key="item.groupType"
							:label="item.name"
							:value="item.code">
						</kc-option>
					</kc-select>
					<span>授权类型</span>
					<kc-select  v-model="selected.attrType" placeholder="请选择授权类型" @change="changeAttrType">
						<kc-option
							v-for="item in attrTypes"
							:key="item"
							:label="item"
							:value="item">
						</kc-option>
					</kc-select>
				</div>
				<div class="video-resources-wrapper videoResources" v-if="videoResourcesShow">
					<div class="video-resources-group resources-content" v-if="videoResourcesGroupShow">
						<div class="group-left left m-scroll">
							<groupTree
								@addGroup="addGroup"
								:fzGroupIds='fzGroupIds'
								:currentRoleId="roleId"
								:searchInfo="selected">
							</groupTree>
						</div>
						<div class="group-right right m-scroll">
							<groupAuth
								:addGroupData="addGroups"
								@groupId="groupId"
								:currentRoleId="roleId"
								:searchInfo="selected">
							</groupAuth>
						</div>
					</div>
					<div class="video-resources-device resources-content" v-if="videoResourcesDeviceShow">
						<div class="device-left left m-scroll">
							<deviceTree
								@addDeviceInfo="addDeviceInfo"
								:fzDeviceInfos='fzDeviceInfos'
								:currentRoleId="roleId"
								:searchInfo="selected">
							</deviceTree>
						</div>
						<div class="device-right right m-scroll">
							<deviceAuth
								:deviceInfosData="deviceInfos"
								@deviceInfo="deviceInfo"
								:currentRoleId="roleId"
								:searchInfo="selected" >
							</deviceAuth>
						</div>
					</div>
					<div class="video-resources-attr resources-content" v-if="videoResourcesAttrShow">
						<div class="attr-left left m-scroll">
							<attrTree
								@addAttr="addAttr"
								:fzGroupIds='attrGroupIds'
								:currentRoleId="roleId"
								:deviceType="selected.info">
							</attrTree>
						</div>
						<div class="attr-right right m-scroll">
							<attrAuth
								:addGroupData="addAttrGroups"
								@groupId="attrgroupId"
								:currentRoleId="roleId"
								:deviceType="selected.info">
							</attrAuth>
						</div>
					</div>
				</div>
				<div  class="video-resources-wrapper  videoResources"  v-if="tollgateResourceShow">
					<div class="video-resources-group resources-content" v-if="videoResourcesGroupShow">
						<div class="group-left left m-scroll">
							<kGroupTree
								@kaddGroup="kaddGroup"
								:kkGroupIds="kkGroupIds"
								:currentRoleId="roleId"
								:searchInfo="selected">
							</kGroupTree>
						</div>
						<div class="group-right right m-scroll">
							<kGroupAuth
								:kaddGroupData="kaddGroups"
								@kgroupId="kgroupId"
								:currentRoleId="roleId"
								:searchInfo="selected">
							</kGroupAuth>
						</div>
					</div>
					<div class="video-resources-device resources-content" v-if="videoResourcesDeviceShow">
						<div class="device-left left m-scroll">
							<kDeviceTree
								@addKDeviceInfo="addKDeviceInfo"
								:fzKDeviceInfos='fzKDeviceInfos'
								:currentRoleId="roleId"
								:searchInfo="selected">
							</kDeviceTree>
						</div>
						<div class="device-right right m-scroll">
							<kDeviceAuth
								:kdeviceInfosData="kdeviceInfos"
								@kdeviceInfo="kdeviceInfo"
								:currentRoleId="roleId"
								:searchInfo="selected">
							</kDeviceAuth>
						</div>
					</div>
				</div>
			</kc-tab-pane>
		</kc-tabs>
	</div>
</template>
<script>
	/* 功能菜单 */
	import functionMenu from '../../views/roleMgt/roleDetail/roleResource/functionMenu/index';
	/* 视频资源 */
	import groupAuth from '../../views/roleMgt/roleDetail/roleResource/videoResource/groupAuth/group'; // 分组授权
	import groupTree from '../../views/roleMgt/roleDetail/roleResource/videoResource/groupAuth/groupTree';

	import deviceAuth from '../../views/roleMgt/roleDetail/roleResource/videoResource/deviceAuth/device';  // 设备授权
	import deviceTree from '../../views/roleMgt/roleDetail/roleResource/videoResource/deviceAuth/deviceTree';

	import attrAuth from '../../views/roleMgt/roleDetail/roleResource/videoResource/attrAuth/attrAuth'; // 属性授权
	import attrTree from '../../views/roleMgt/roleDetail/roleResource/videoResource/attrAuth/attrTree'; // 属性授权
	/* 卡口资源 */
	import kGroupTree from '../../views/roleMgt/roleDetail/roleResource/tollgatesResource/groupAuth/groupTree'; // 分组授权
	import kGroupAuth from '../../views/roleMgt/roleDetail/roleResource/tollgatesResource/groupAuth/group';

	import kDeviceTree from '../../views/roleMgt/roleDetail/roleResource/tollgatesResource/deviceAuth/deviceTree';  // 设备授权
	import kDeviceAuth from '../../views/roleMgt/roleDetail/roleResource/tollgatesResource/deviceAuth/device';

	import myGlobal from '../../utils/myGlobal';

	export default {
		components: {
			groupTree,
			groupAuth,
			deviceTree,
			deviceAuth,
			attrTree,
			attrAuth,
			functionMenu,
			kGroupTree,
			kGroupAuth,
			kDeviceTree,
			kDeviceAuth
		},
		data () {
			return {
				addRole: [],
				addGroups: {},  // 新增分组
				addAttrGroups: {},  // 新增属性
				kaddGroups: {},
				fzGroupIds: [], //分组
				attrGroupIds: [], //属性
				kkGroupIds: [],
				deviceInfos: [],
				fzDeviceInfos: [],
				kdeviceInfos: [],
				fzKDeviceInfos: [],
				/* 按需加载 */
				/* 视频 */
				videoResourcesShow: false,
				videoResourcesGroupShow: false,
				videoResourcesDeviceShow: false,
				videoResourcesAttrShow: false,
				/* 卡口 */
				tollgateResourceShow: false,
				tollgateResourceDeviceShow: false,
				//设备类型
				deviceTypes: myGlobal.getDevicetypes(),
				//授权类型
				attrTypes: ['按分组授权', '按设备授权', '按属性授权'],
				selected: {
					info: {},
					deviceType: 'video',
					attrType: '按分组授权'
				}
			};
		},
		props: {
			roleId: {
				type: String,
				default: ''
			},
			disableRoleAuth: Boolean
		},
		methods: {
			needAddRole (val) {
				this.addRole = val;
			},
			addGroup (val) { //视频按分组树 回调
				this.addGroups = val;
			},
			addAttr(val) { //视频按属性树 回调
				this.addAttrGroups = val;
			},
			kaddGroup (val) {
				this.kaddGroups = val;
			},
			groupId (val) {
				this.fzGroupIds = val;
			},
			attrgroupId (val) {
				this.attrGroupIds = val;
			},
			kgroupId (val) {
				this.kkGroupIds = val;
			},
			addDeviceInfo (val) {
				this.deviceInfos = val;
			},
			deviceInfo (val) {
				this.fzDeviceInfos = val;
			},
			addKDeviceInfo (val) {
				this.kdeviceInfos = val;
			},
			kdeviceInfo (val) {
				this.fzKDeviceInfos = val;
			},
			// 最外层tab单击事件
			tabClick (tab) {
				if (tab.label === '设备资源') {
					this.changeDeviceType('video');
				}
			},
			changeDeviceType(select){
				this.selected.deviceType = select;
				this.selected.info = myGlobal.getDevicetypes()[select];
				switch (select) {
				case 'video':
					this.attrTypes = ['按分组授权', '按设备授权', '按属性授权'];
					this.videoResourcesShow = true;
					this.tollgateResourceShow = false;
					break;
				default:
					this.attrTypes = ['按分组授权', '按设备授权'];
					this.tollgateResourceShow = true;
					this.videoResourcesShow = false;
					break;
				}
				this.selected.attrType = this.attrTypes[0];
				this.changeAttrType(this.selected.attrType);
				this.selected = JSON.parse(JSON.stringify(this.selected));
			},
			changeAttrType(select){
				this.selected.attrType = select;
				switch (select) {
				case '按设备授权':
					this.videoResourcesGroupShow = false;
					this.videoResourcesDeviceShow = true;
					this.videoResourcesAttrShow = false;
					break;
				case'按属性授权':
					this.videoResourcesGroupShow = false;
					this.videoResourcesDeviceShow = false;
					this.videoResourcesAttrShow = true;
					break;
				default:
					this.videoResourcesGroupShow = true;
					this.videoResourcesDeviceShow = false;
					this.videoResourcesAttrShow = false;
					break;
				}
				this.selected = JSON.parse(JSON.stringify(this.selected));
			}
		}
	};
</script>
