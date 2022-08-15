<template>
    <div>
        <!-- visible显示与否  title标题判断 $emit绑定外部传递方法  width定义弹框宽度 -->
        <a-modal :visible="visible" title='新增物流模板' v-drag-modal @ok="
            () => {
                $emit('ok');
            }
        " @cancel="
    () => {
        $emit('cancel');
    }
">
            <a-spin :spinning="loading">
                <a-form :form="form" :label-col="{ span: 3 }" :wrapper-col="{ span: 21 }">
                    <a-form-item label="标题" :span="24">
                        <a-input placeholder="请输入标题" v-decorator="['title', { rules: [{ required: true, message: '请输入标题' }] }]" />
                    </a-form-item>
                    <a-form-item label="国家">
                        <a-select v-decorator="[
                            'country_id',
                            { rules: [{ required: true, message: '请选择国家' }] },
                        ]" placeholder="请选择国家" @change="handleSelectChange">
                            <a-select-option v-for="item in nation_list" :key="item.id" :value="item.id">
                               {{item.name}}
                            </a-select-option>
                        </a-select>
                    </a-form-item>
                </a-form>
            </a-spin>
        </a-modal>
    </div>
</template>

<script>

export default {
    // visible 隐藏显示 isTitle标题内容  modules点击编辑传过来的默认值  loading动画
    props: {
        visible: {
            type: Boolean,
            default: false,
        },
        isTitle: {
            type: Number,
            default: 1,
        },
        modules: {
            type: Object,
            default: () => { },
        },
        loading: {
            type: Boolean,
            default: false,
        },
        nation_list:{
            type: Array,
            default: () => [],
        },
    },
    data() {
        return {
            form: this.$form.createForm(this),
            languageList: [], //语言
        };
    },
    created() {
        // 防止表单未注册
        // fields.forEach((v) => this.form.getFieldDecorator(v));
        // 当 modules 发生改变时，为表单设置值
        // this.$watch("modules", () => {
        //   this.modules && this.form.setFieldsValue(this.modules);
        // });
    },
    methods: {
       handleSelectChange(value) {
      console.log(value);
    //   this.form.setFieldsValue({
    //     note: `Hi, ${value === 'male' ? 'man' : 'lady'}!`,
    //   });
    },
    },
};
</script>
