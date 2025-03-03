import {
  Form,
  FormButton,
  FormField,
  FormFieldGroup,
} from '@/components/ui/form'

import { API_ERRORS, ErrorType } from '@/app/api/errors'

export default ({ query }: { query: Record<string, string> }) => {
  return (
    <div className="w-full max-w-md space-y-8 place-self-center rounded-lg p-8">
      <div>
        <h2 className="text-center text-3xl font-bold text-gray-900">
          Create your account
        </h2>
      </div>

      <Form action="/api/auth/signup" method="POST">
        <FormFieldGroup>
          <FormField name="name" type="text" placeholder="Name" required />
          <FormField name="email" type="email" placeholder="Email" required />
          <FormField
            name="password"
            type="password"
            placeholder="Password"
            required
          />
        </FormFieldGroup>

        <p className="text-xs text-neutral-600">
          Password must be at least 8 characters long
        </p>

        <FormButton
          type="submit"
          className="w-full bg-neutral-800 text-white hover:bg-neutral-900"
        >
          Sign up
        </FormButton>
      </Form>

      <div className="text-center text-neutral-600">
        Already have an account?{' '}
        <a href="/auth/login" className="underline hover:text-black">
          Sign in
        </a>
      </div>

      {query?.error && (
        <div className="text-center text-red-600">
          {API_ERRORS[query.error as ErrorType]?.message}
        </div>
      )}
    </div>
  )
}
