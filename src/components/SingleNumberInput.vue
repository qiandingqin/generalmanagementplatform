<!--
 * @Description: 单数字输入框
-->
<template>
  <!-- 单数字输入框 -->
  <section class="add-grade-view">
    <template v-for="(code, codeIndex) in codes" :key="codeIndex">
      <a-input :maxlength="1" :_index="codeIndex" :ref="el => el && (codeRefs[codeIndex] = el)" v-model:value="codes[codeIndex]" :min="0" :max="9" 
        @keyup="onInputChange($event, codeIndex)" />
    </template>
  </section>
</template>

<script>
import { defineComponent, ref} from 'vue'
import { Input } from 'ant-design-vue'

export default defineComponent({
  props: {
    codes: { type: Array, default: () => [] }
  },
  components: { AInput: Input },
  setup(props, ctx) {
    const codes = props.codes || [];
    const codeRefs = ref([]);

    // 取ref
    const getRef = (index, isNext) => {
      const len = codes.length;
      const refs = codeRefs.value;
      const next = index + ( isNext ? 1 : -1 );
      const nextRef = refs[next] || refs[isNext ? len - 1 : 0];
      return nextRef;
    }

    // input 变化
    const onInputChange = (event, index) => {
      const code = codes[index] + '';
      const next = event.keyCode != 8;
      const codeRef = getRef(index, next);

      if (!next) {
        codeRef.focus();
      } else if (next && code) {
        codeRef.focus();
      }
      // console.log(66)
      // 触发事件
      ctx.emit('changed');
    }

    return {
      onInputChange,
      // codes,
      codeRefs
    }
  },
})
</script>


<style lang="less" scoped>
.add-grade-view {
  display: flex;
  justify-content: center;

  :deep(.ant-input) {
    width: 35px;
    height: 35px;
    border:none;
    border: 1px solid rgba(0, 0, 0, 0.15);
    border-radius: 0;
    margin-right: 10px;
    box-shadow: none;
    padding:0;
    text-align: center;
    font-size: 18px;
    color: rgba(0,0,0,0.85);
    -webkit-appearance: none;
    -moz-appearance: none;
    -moz-appearance:textfield;

    
    &::-webkit-inner-spin-button,
    &::-webkit-outer-spin-button {
      -webkit-appearance: none;
    }

    .ant-input-number-handler-wrap {
      display: none;
    }

    &:active, &:focus {
      border-color: #d9d9d9;
    }

    &:last-child {
      margin-right: 0;
    }

    input {
      padding:0;
      text-align: center;
    }
  }

}
</style>