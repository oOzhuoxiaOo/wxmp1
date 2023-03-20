<template>
	<view>
		<view class="scroll-view-container">
			<!-- 左侧滑动区域 -->
			<scroll-view class="left-scroll-view" scroll-y="true" :style="{height: wh + 'px'}">
				<block v-for="(item,index) in cateList" :key="index">
					<view :class="['left-scroll-view-item',index === active ? 'active' : '']"
						@click="activeChanged(index)">{{item.cat_name}}</view>
				</block>
			</scroll-view>
			<!-- 右侧滑动区域 -->
			<scroll-view class="right-scroll-view" scroll-y="true" :style="{height: wh + 'px'}" :scroll-top="scrollTop">
				<!-- 二级分类 -->
				<view class="cate-lv2" v-for="(item2,i2) in cateLevel2" :key="i2">
					<view class="cate-lv2-title">{{item2.cat_name}}</view>
					<!-- 动态渲染三级分类的列表数据 -->
					<view class="cate-lv3-list">
						<!-- 三级分类item项 -->
						<view class="cate-lv3-item" v-for="(item3,i3) in item2.children" :key="i3" @click="gotoGoodsList(item3)">
							<!-- 图片 (由于请求来的图片无法显示，用replace函数将图片链接字符串的字符dev改为web)-->
							<image :src="item3.cat_icon.replace('dev','web')"></image>
							<!-- 文本 -->
							<text>{{item3.cat_name}}</text>
						</view>
					</view>
				</view>
			</scroll-view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				// 窗口的可用高度 = 屏幕高度 - navigationbar高度 - tabBar高度
				wh: 0,
				// 分类数据列表
				cateList: [],
				// 被点击的分类列表项的索引 默认0
				active: 0,
				// 二级分类列表
				cateLevel2: [],
				//切换一级分类后 滚动条位置
				scrollTop: 0,
			};
		},
		onLoad() {
			// 获取系统信息的同步接口 保存在sysinfo中
			const sysinfo = uni.getSystemInfoSync();
			// 给wh动态赋值赋值 为 窗口的可用高度
			this.wh = sysinfo.windowHeight;
			// console.log(sysinfo) //debug

			// 调用获取分类数据的方法
			this.getCateList();
		},

		methods: {
			// 获取分类列表的方法
			async getCateList() {
				// 发起请求
				const {
					data: res
				} = await uni.$http.get('/api/public/v1/categories');
				// 判断是否获取失败
				if (res.meta.status !== 200) return uni.$showMsg();
				// 转存数据
				this.cateList = res.message;
				// 设置 二级分类列表
				this.cateLevel2 = res.message[0].children;
			},
			// 选中项被改变的事件处理函数
			activeChanged(idx) {
				// 数据索引项设置为 点击的索引项
				this.active = idx;
				// 二级分类列表设置为 对应的二级索引
				this.cateLevel2 = this.cateList[idx].children;
				// 每次切换一级分类时 修改滚动条哦的值
				// (TODO:为什么设置为死数据0后还要在此函数中修改值? resolve：因为未知原因，如果赋值一样的话 滚动条不会重置)
				this.scrollTop = this.scrollTop === 0 ? 1 : 0;
			},
			// 点击三级分类项跳转到商品列表页面
			gotoGoodsList(item3){
				uni.navigateTo({
					url:  '/subpkg/goods_list/goods_list?cid=' + item3.cat_id
				})
			}
		}
	}
</script>

<style lang="scss">
	.scroll-view-container {
		display: flex;

		.left-scroll-view {
			width: 120px;

			.left-scroll-view-item {
				height: 60px;
				line-height: 60px;
				text-align: center;
				border-bottom: solid 1px;

				&.active {
					background-color: #ffffff;
					position: relative;

					&::before {
						content: ' ';
						display: block;
						width: 3px;
						height: 30px;
						background-color: #c00000;
						position: absolute;
						left: 0;
						top: 50%;
						transform: translateY(-50%);
					}
				}
			}
		}

		.right-scroll-view {
			.cate-lv2 {
				.cate-lv2-title {
					font-size: 12px;
					font-weight: bold;
					text-align: center;
					padding: 15px 0;
				}

				.cate-lv3-list {
					display: flex;
					flex-wrap: wrap;

					.cate-lv3-item {
						width: 33%;
						margin-bottom: 10px;
						display: flex;
						flex-direction: column;
						align-items: center;

						image {
							width: 60px;
							height: 60px;
						}

						text {
							font-size: 12px;
						}

					}
				}
			}
		}
	}
</style>
