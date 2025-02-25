import {
  Form,
  FormButton,
  FormField,
  FormFieldGroup,
} from "@/components/ui/form";

export default () => {
  return (
    <div className="max-w-md w-full space-y-8 p-8 rounded-lg place-self-center">
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
          className="bg-neutral-800 hover:bg-neutral-900 text-white w-full"
        >
          Sign in
        </FormButton>
      </Form>

      <div className="text-center text-neutral-600">
        Don't have an account?{" "}
        <a href="/auth/signup" className="underline hover:text-black">
          Sign up
        </a>
      </div>
    </div>
  );
};
