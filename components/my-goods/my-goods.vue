<template>
	<view class="goods-item">
		<!-- 商品左侧图片区域 -->
		<view class="goods-item-left">
			 <!-- 存储在购物车中的商品，包含 goods_state 属性，表示商品的勾选状态 -->
			<radio :checked='goods.goods_state' color="#C00000" v-if="showRadio"  @click="radioClickHandler"></radio>
			<image :src="goods.goods_small_logo || defaultPic" class="goods-pic"></image>
		</view>
		<!-- 商品右侧信息区域 -->
		<view class="goods-item-right">
			<!-- 商品标题 -->
			<view class="goods-name">{{goods.goods_name}}</view>
			<view class="goods-info-box">
				<!-- 商品价格 -->
				<view class="goods-price">￥{{goods.goods_price | toFixed}}</view>
				<!-- 商品数量 -->
				<!-- 传给自定义组件接口事件 change -->
				<uni-number-box :min="1" :value='goods.goods_count' v-if="showNum" @change="numChangeHandler"></uni-number-box>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: "my-goods",
		data() {
			return {
				// 默认的空图片
				defaultPic: 'https://img3.doubanio.com/f/movie/8dd0c794499fe925ae2ae89ee30cd225750457b4/pics/movie/celebrity-default-medium.png',
			};
		},
		// 定义prop属性，接收来自外界传来此组件的数据
		props: {
			// 商品的对象信息
			goods: {
				type: Object,
				default: {}
			},
			// 是否展示图片左侧radio
			showRadio: {
				type: Boolean,
				// 如果外界不指定showradio值，则默认不展示
				default: false
			},
			   // 是否展示价格右侧的 NumberBox 组件
			showNum:{
				type:Boolean,
				default: false
			}
		},
		filters:{
			toFixed(num){
				// 把数字处理为带两位小数点的数字
				return Number(num).toFixed(2);
			}
		},
		methods:{
			radioClickHandler(){
				this.$emit('radio-change',{
					// 商品的 Id
					      goods_id: this.goods.goods_id,
					      // 商品最新的勾选状态
					      goods_state: !this.goods.goods_state
				})
			},
			  // NumberBox 组件的 change 事件处理函数
			numChangeHandler(val){
			// val为自定义事件中变化的值，也就是商品数量num变化后的虚拟值
				  // 通过 this.$emit() 触发外界通过 @ 绑定的 num-change 事件
				    this.$emit('num-change', {
				      // 商品的 Id
				      goods_id: this.goods.goods_id,
				      // 商品的最新数量
				      goods_count: +val
			})
		}
	}}
</script>

<style lang="scss">
	.goods-item {
		// width: 750rpx;
		// box-sizing: border-box;
		display: flex;
		padding: 10px 5px;
		border-bottom: 1px solid #f0f0f0;
		

		.goods-item-left {
			margin-right: 5px;
			 display: flex;
			justify-content: space-between;
			align-items: center;

			.goods-pic {
				width: 100px;
				height: 100px;
				display: block;
			}
		}

		.goods-item-right {
			display: flex;
			flex-direction: column;
			justify-content: space-between;

			.goods-name {
				font-size: 13px;
			}

			.goods-price {
				font-size: 16px;
				color: #c00000;
			}
		}
	}
</style>
