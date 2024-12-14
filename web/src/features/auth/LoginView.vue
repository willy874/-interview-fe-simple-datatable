<script setup lang="ts">
import { onMounted, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { z } from 'zod';
import { flow } from 'lodash-es';
import { useMutation } from '@tanstack/vue-query'
import { useLocalStorage } from '@/libs/storage';
import { useLoginService } from './services';

const router = useRouter()
const storage = useLocalStorage('ACCESS_TOKEN')

onMounted(() => {
  if (storage.value) {
    router.push('/')
  }
})

enum Field {
  USERNAME = 'username',
  PASSWORD = 'password'
}

const loginForm = reactive({
  [Field.USERNAME]: '',
  [Field.PASSWORD]: '',
})

const helperTexts = reactive({
  [Field.USERNAME]: '',
  [Field.PASSWORD]: '',
})

const loginService = useLoginService()

enum ErrorMessages {
  USERNAME_EMPTY = 'USERNAME_EMPTY',
  PASSWORD_EMPTY = 'PASSWORD_EMPTY',
}

const helperTextMap: Record<string, [keyof typeof helperTexts, string]> = {
  [ErrorMessages.USERNAME_EMPTY]: [Field.USERNAME, '帳號不可為空'],
  [ErrorMessages.PASSWORD_EMPTY]: [Field.PASSWORD, '密碼不可為空'],
}

const loginFormSchema = z.object({
  username: z.string().nonempty(ErrorMessages.USERNAME_EMPTY),
  password: z.string().nonempty(ErrorMessages.PASSWORD_EMPTY),
})

const failedValidation = (value: unknown, field: Field) => {
  loginFormSchema.shape[field].safeParseAsync(value).then((output) => {
    if (output.success) {
      helperTexts[field] = ''
      return
    }
    const [, message] = Object.values(helperTextMap).find(([f]) => (f === field)) || []
    helperTexts[field] = message || ''
  })
}

const onInput = (event: Event) => {
  const input = event.target as HTMLInputElement
  const field = input.name as Field
  if (helperTexts[field]) {
    failedValidation(input.value, field)
  }
}

const onChange = (event: Event) => {
  const input = event.target as HTMLInputElement
  const field = input.name as Field
  failedValidation(input.value, field)
}

const validation = (value: unknown) => {
  return loginFormSchema.safeParseAsync(value).then((output) => {
    if (output.success) {
      return Promise.resolve(output.data)
    }
    for (const err of output.error.errors) {
      const [key, message] = helperTextMap[err.message]
      helperTexts[key] = message
    }
    return Promise.reject(new Error('form validation failed'))
  })
}

const fetchLogin = (form: z.infer<typeof loginFormSchema>) => {
  return loginService.login({
    body: {
      username: form.username,
      password: form.password,
    }
  })
  .then((response) => {
    if (response.status === 200) {
      storage.value = response.body.token
      router.push('/')
    }
  })
}

const { mutate: onSubmit } = useMutation({
  mutationKey: ['LOGIN'],
  mutationFn: flow(
    validation,
    (result) => result.then(fetchLogin)
  ),
})
</script>

<template>
  <div class="login-page">
    <form @submit.prevent="onSubmit(loginForm)">
      <div class="login-page__frame">
        <h2 class="login-page__title">登入</h2>
        <div>
          <label class="login-page__label">帳號</label>
          <input-box
            v-model="loginForm.username"
            :name="Field.USERNAME"
            type="text"
            placeholder="username"
            :helper-text="helperTexts.username"
            @input="onInput"
            @change="onChange"
          />
        </div>
        <div>
          <label class="login-page__label">密碼</label>
          <input-box
            v-model="loginForm.password"
            :name="Field.PASSWORD"
            type="password"
            placeholder="password"
            :helper-text="helperTexts.password"
            @input="onInput"
            @change="onChange"
          />
        </div>
        <button class="login-page__button" type="submit">登入</button>
      </div>
    </form>
  </div>
</template>

<style lang="css" scoped>
.login-page {
  flex-grow: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f9f9f9;
}
.login-page__frame {
  margin-top: -5rem;
  width: 25rem;
  border-radius: 1rem;
  background-color: #fff;
  padding: 1.75rem 2rem;
  border: 1px solid #ccc;
}
.login-page__title {
  margin-bottom: 1rem;
  font-weight: bold;
}
.login-page__label {
  display: block;
  margin-bottom: .5rem;
}
.login-page__button {
  display: block;
  width: 100%;
  border: none;
  color: #fff;
  font-weight: bold;
  background-color: #4B6156;
  padding: .5rem;
  border-radius: .5rem;
  cursor: pointer;
}
</style>
