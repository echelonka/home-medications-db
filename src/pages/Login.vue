<template>
  <v-content>
    <v-container class="fill-height" fluid>
      <v-row align="center" justify="center">
        <v-col cols="12" sm="8" md="4">
          <v-card class="elevation-6">
            <v-toolbar color="primary" dark flat>
              <v-toolbar-title>Log in</v-toolbar-title>
              <v-spacer></v-spacer>
            </v-toolbar>
            <v-form @submit.prevent="submitForm">
              <v-card-text>
                <v-text-field
                  id="email"
                  label="Email"
                  name="email"
                  required
                  :error-messages="emailError || emailErrors"
                  prepend-icon="mail"
                  type="email"
                  v-model="email"
                ></v-text-field>
                <v-text-field
                  id="password"
                  label="Password"
                  name="password"
                  required
                  :error-messages="passwordError || passwordErrors"
                  prepend-icon="lock"
                  type="password"
                  v-model="password"
                ></v-text-field>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn depressed color="primary" type="submit" :loading="sending">Log In</v-btn>
              </v-card-actions>
            </v-form>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-content>
</template>

<script>
  import { validationMixin } from 'vuelidate'
  import { required, email } from 'vuelidate/lib/validators'
  import { auth } from 'firebase'

  export default {
    name: 'Login',
    mixins: [validationMixin],
    data: () => ({
      email: null,
      password: null,
      sending: false,
      emailError: null,
      passwordError: null
    }),
    validations: {
      email: { required, email },
      password: { required }
    },
    computed: {
      emailErrors () {
        const errors = []
        if (!this.$v.email.$dirty) return errors
        !this.$v.email.email && errors.push('Must be valid email')
        !this.$v.email.required && errors.push('Email is required')
        return errors
      },
      passwordErrors () {
        const errors = []
        if (!this.$v.password.$dirty) return errors
        !this.$v.password.required && errors.push('Password is required')
        return errors
      }
    },
    methods: {
      submitForm () {
        this.$v.$touch()

        if (!this.$v.$invalid) {
          this.logIn()
        }
      },
      async logIn () {
        this.sending = true

        try {
          await auth().signInWithEmailAndPassword(this.email, this.password)
          this.$router.replace('/dashboard')
        } catch ({ code, message }) {
          if (code === 'auth/user-not-found') {
            this.emailError = message
          } else if (code === 'auth/wrong-password') {
            this.passwordError = message
          }
        } finally {
          this.sending = false
        }
      }
    }
  }
</script>

<style scoped>
</style>
