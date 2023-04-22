<template>
	<view class="cart-container">
		<!-- 购物车商品列表的标题区域 -->
		<view class="cart-title">
			<!-- 左侧的图标 -->
			<uni-icons type="shop" size="18"></uni-icons>
			<!-- 描述文本 -->
			<text class="cart-title-text">购物车</text>
		</view>

		<uni-swipe-action>
			<!-- 商品列表区域 -->
			<block v-for="(goods, i) in cart" :key="i">
				<uni-swipe-action-item :right-options='options' @click='swiperActionClickHandler(goods)'>
					<my-goods :goods="goods" :showRadio='true' :showNum='true' @radio-change="radioChangeHandler"
						@num-change="numberChangeHandler"></my-goods>
				</uni-swipe-action-item>
			</block>

		</uni-swipe-action>
		
		 <!-- 结算区域 -->
		<my-settle></my-settle>
	</view>
</template>

<script>
	// 按需导入 mapGetters 这个辅助方法
	import {
		mapGetters,
		mapState,
		mapMutations
	} from "vuex"
	// 导入自己封装的mixin模块
	import badgeMix from '@/mixins/tabbar-badge.js'
	export default {
		data() {
			return {
				options: [{
					text: '删除', //显示的文本内容
					style: {
						backgroundColor: '#c00000' //按钮的背景颜色
					}
				}]
			};
		},
		// 将 badgeMix 混入到当前的页面中进行使用
		mixins: [badgeMix],
		computed: {
			// 将 m_cart 模块中的 total 映射为当前页面的计算属性
			...mapGetters('m_cart', ['total']),
			...mapState('m_cart', ['cart'])
		},
		methods: {
			// 商品的勾选状态发生了变化
			radioChangeHandler(e) {
				console.log(e) // 输出得到的数据 -> {goods_id: 395, goods_state: false}
				this.updateGoodsState(e);
			},
			numberChangeHandler(e) {
				this.updateGoodsCount(e);
			},
			// 把更新商品数据的方法映射到页面(更新store中商品数据属性选中状态)
			...mapMutations('m_cart', ['updateGoodsState', 'updateGoodsCount','removeGoodsById']),

			//点击了滑动操作按钮
			swiperActionClickHandler(goods) {
				console.log(goods);
				this.removeGoodsById(goods.goods_id)
			}
		}
	}
</script>

<style lang="scss">
	.cart-title {
		height: 40px;
		display: flex;
		align-items: center;
		font-size: 14px;
		padding-left: 5px;
		border-bottom: 1px solid #efefef;

		.cart-title-text {
			margin-left: 10px;
		}
	}
	.cart-container {
	  padding-bottom: 50px;
	}
</style>
