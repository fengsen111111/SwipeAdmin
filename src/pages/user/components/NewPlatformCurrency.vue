<template>
	<div>
		<a-modal :visible="visible" title="新增平台币" :confirmLoading="loading" @ok="() => { $emit('ok') }" @cancel="
			() => {
				$emit('cancel');
			}
		">
			<a-spin :spinning="loading">
				<a-form :form="form" v-bind="formLayout">
					<a-form-item label="币种">
						<a-select placeholder="请选择币种" v-decorator="[
							'issued_currency_id',
							{
								rules: [
									{
										required: true,
										message: '请选择币种',
									},
								],
							},
						]">
							<a-select-option :key="item.id" :value="item.id" v-for="item in currenList ">{{
									item.symbol
							}}
							</a-select-option>
						</a-select>
					</a-form-item>
					<a-form-item label="锁定币数量">
						<a-input placeholder="请输入锁定币数量" allowClear v-decorator="[
							'locked',
							{
								rules: [
									{
										required: true,
										message: '数量是必须的',
									},
								],
							},
						]" />
					</a-form-item>
				</a-form>
			</a-spin>
		</a-modal>
	</div>
</template>

<script>
const fields = ["locked", "issued_currency_id"];
export default {
	name: "NewPlatformCurrency",
	props: {
		visible: {
			type: Boolean,
			default: false,
		},
		loading: {
			type: Boolean,
			default: false,
		},
		currenList: {
			type: Array,
			default: () => []
		}

	},
	data() {
		this.formLayout = {
			labelCol: {
				span: 5,
			},
			wrapperCol: {
				span: 19,
			},
		};
		return {
			form: this.$form.createForm(this),
		}
	},
	created() {
		// 防止表单未注册
		fields.forEach((v) => this.form.getFieldDecorator(v));
		// 当 model 发生改变时，为表单设置值
		this.$watch("modules", () => {
			this.modules && this.form.setFieldsValue(this.modules);
		});
	},
	methods: {

	},
};
</script>

<style lang="scss" scoped>
</style>