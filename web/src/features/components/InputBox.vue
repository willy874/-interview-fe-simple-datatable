<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps({
  modelValue: {
    type: String,
    default: '',
  },
  type: {
    type: String,
    default: 'text',
  },
  name: {
    type: String,
    default: '',
  },
  placeholder: {
    type: String,
    default: '',
  },
  helperText: {
    type: String,
    default: '',
  },
})

const emits = defineEmits({
  'update:model-value': (value: string) => typeof value === 'string',
  input: (event: Event) => event instanceof Event,
  change: (event: Event) => event instanceof Event,
})

const model = computed({
  get: () => props.modelValue,
  set: (value: string) => emits('update:model-value', value),
})
</script>

<template>
  <div class="input-box">
    <div class="input-box__frame">
      <input
        v-model="model"
        :type="$props.type"
        :placeholder="$props.placeholder"
        :name="$props.name"
        @input="$emit('input', $event)"
        @change="$emit('change', $event)"
      >
    </div>
    <div class="input-box__footer">
      <div v-if="$props.helperText" class="input-box__error">{{ $props.helperText }}</div>
    </div>
  </div>
</template>

<style lang="css" scoped>
.input-box {
  margin-bottom: 1.5rem;
}
.input-box .input-box__footer {
  position: relative;
}
.input-box .input-box__error {
  color: #ff0000;
  position: absolute;
  top: 0;
  left: 0;
  font-size: 0.75rem;
}
.input-box__frame {
  border: 1px solid #ccc;
  border-radius: .5rem;
  padding: 0.5rem 0.75rem;
}
.input-box input {
  width: 100%;
  font-size: 1rem;
  border: none;
}
.input-box input:focus {
  outline: none;
}
</style>
