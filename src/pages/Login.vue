<template>
  <div class="login md-layout md-alignment-center">
    <form novalidate class="md-layout md-alignment-center" @submit.prevent="validateUser">
      <md-card class="md-layout-item md-size-40 md-small-size-90">
        <md-card-header>
          <div class="md-title">Log in</div>
        </md-card-header>

        <md-card-content>
          <md-field :class="getValidationClass('email')">
            <label for="email">Email</label>
            <md-input
              type="email"
              name="email"
              id="email"
              autocomplete="email"
              v-model="form.email"
              :disabled="sending"
              @input="emailError = null"
            />
            <md-icon>mail</md-icon>
            <span class="md-error" v-if="!$v.form.email.required">The email is required</span>
            <span class="md-error" v-else-if="!$v.form.email.email">Invalid email</span>
            <span class="md-error" v-else-if="!$v.form.email.isValid">{{ emailError }}</span>
          </md-field>
          <md-field :class="getValidationClass('password')" :md-toggle-password="false">
            <label for="password">Password</label>
            <md-input
              type="password"
              name="email"
              id="password"
              autocomplete="password"
              v-model="form.password"
              :disabled="sending"
              @input="passwordError = null"
            />
            <md-icon>lock</md-icon>
            <span class="md-error" v-if="!$v.form.password.required">The password is required</span>
            <span class="md-error" v-else-if="!$v.form.password.isValid">{{ passwordError }}</span>
          </md-field>
        </md-card-content>

        <md-card-actions>
          <md-button type="submit" class="md-raised md-primary" :disabled="sending">Log In</md-button>
        </md-card-actions>
      </md-card>
    </form>
  </div>
</template>

<script>
  import { validationMixin } from 'vuelidate'
  import { required, email } from 'vuelidate/lib/validators'
  import { auth } from 'firebase'

  export default {
    name: 'Login',
    mixins: [validationMixin],
    data: () => ({
      form: {
        email: null,
        password: null
      },
      sending: false,
      emailError: null,
      passwordError: null
    }),
    validations: {
      form: {
        email: {
          required,
          email,
          isValid () {
            return !this.emailError
          }
        },
        password: {
          required,
          isValid () {
            return !this.passwordError
          }
        }
      }
    },
    methods: {
      getValidationClass (fieldName) {
        const field = this.$v.form[fieldName]

        if (field) {
          return {
            'md-invalid': field.$invalid && field.$dirty
          }
        }
      },
      validateUser () {
        this.$v.$reset()
        this.emailError = null
        this.passwordError = null
        this.$v.$touch()

        if (!this.$v.$invalid) {
          this.logIn()
        }
      },
      logIn () {
        this.sending = true

        auth().signInWithEmailAndPassword(this.form.email, this.form.password)
          .then(() => this.$router.replace('/dashboard'))
          .catch(err => {
            if (err.code === 'auth/user-not-found') {
              this.emailError = err.message
            } else if (err.code === 'auth/wrong-password') {
              this.passwordError = err.message
            }
          })
          .finally(() => this.sending = false)
      }
    }
  }
</script>

<style scoped>
  .login {
    height: 100%;
  }
</style>
