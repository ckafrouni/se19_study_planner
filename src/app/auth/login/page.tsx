import {
  Form,
  FormButton,
  FormField,
  FormFieldGroup,
} from '@/components/ui/form'

export default () => {
  return (
    <div className="w-full max-w-md space-y-8 place-self-center rounded-lg p-8">
      <div>
        <h2 className="text-center text-3xl font-bold text-gray-900">
          Sign in to your account
        </h2>
      </div>

      <Form action="/api/auth/login" method="POST">
        <FormFieldGroup>
          <FormField name="email" type="email" placeholder="Email" required />
          <FormField
            name="password"
            type="password"
            placeholder="Password"
            required
          />
        </FormFieldGroup>

        <FormButton
          type="submit"
          className="w-full bg-neutral-800 text-white hover:bg-neutral-900"
        >
          Sign in
        </FormButton>
      </Form>

      <div className="text-center text-neutral-600">
        Don't have an account?{' '}
        <a href="/auth/signup" className="underline hover:text-black">
          Sign up
        </a>
      </div>
    </div>
  )
}
