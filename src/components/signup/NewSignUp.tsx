"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { z } from "zod";
import GlobalInput from "@/components/global/GlobalInput";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { apiRequest } from "@/lib/api";

const signUpSchema = z.object({
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  phone: z.string().min(10, "Phone number is required"),
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(15, "Password must not exceed 15 characters")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/^\S*$/, "Password must not contain spaces"),

  agreeToTerms: z.literal(true, {
    errorMap: () => ({ message: "You must agree to the Terms & Condition" }),
  }),
});

type SignUpForm = z.infer<typeof signUpSchema>;

const NewSignUp = () => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignUpForm>({
    resolver: zodResolver(signUpSchema),
    mode: "onTouched",
    defaultValues: {
      firstName: "TestFirstName",
      lastName: "TestLastName",
      phone: "1234567890",
      email: "test@example.com",
      password: "Test1234",
      agreeToTerms: true,
    },
  });

  const handleGoogleLogin = (credentialResponse: any) => {
    const decoded = jwtDecode(credentialResponse.credential);
    console.log(decoded);
  };

  const onSubmit = async (data: SignUpForm) => {
    try {
      const result = await apiRequest<any>("/api/auth/signup", {
        method: "POST",
        json: {
          fullName: `${data.firstName} ${data.lastName}`,
          email: data.email,
          password: data.password,
          confirmPassword: data.password,
          phoneNumber: data.phone,
          agreeToTerms: data.agreeToTerms,
        },
      });

      // Store the JWT token in localStorage
      localStorage.setItem("token", result.access_token);

      // Redirect to home page or dashboard
      router.push("/dashboard");
    } catch (error: any) {
      alert(
        error instanceof Error
          ? error.message
          : "An error occurred during sign up"
      );
    }
  };

  return (
    <div className="mx-auto grid min-h-screen max-w-[1440px] items-center justify-center bg-white p-4 font-sans md:grid-cols-3">
      {/* Left Side */}
      <div
        className="hidden h-screen flex-col justify-between rounded-md bg-[#FF8400] bg-center bg-cover bg-no-repeat p-6 md:flex"
        style={{ backgroundImage: "url('/signupbg.png')" }}
      >
        {/* Logo */}
        <div className="mb-4">
          <div className="text-2xl font-bold leading-tight text-white">
            High
            <br />
            Tribe
          </div>
        </div>

        <div className=" flex items-center gap-4 rounded-xl bg-[#0057FF] p-4 shadow-lg">
          <div className="flex-1">
            <p className="mb-2 text-sm text-white">
              Lorem ipsum dolor sit amet consectetur. Dolor nisl ac orci enim
              tellus mattis suspendisse. Pharetra
            </p>
            <div className="flex gap-4 mt-2">
              <img
                src="https://randomuser.me/api/portraits/men/32.jpg"
                alt="User"
                className="object-contain w-16 h-16 rounded-md border-2 border-white"
              />
              <div>
                <div className="text-sm font-semibold leading-tight text-white">
                  Timson K
                </div>
                <div className="text-xs text-white/80">User</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Right Side (Form) */}
      <div className="col-span-2 p-6">
        <h2 className="mb-2 font-bold text-3xl text-[#181818]">
          Create an account
        </h2>
        <p className="mb-6 text-[#181818] text-base">
          Already have an account?{" "}
          <a
            href="/login"
            className="font-medium text-[#0057FF] hover:underline"
          >
            Log in
          </a>
        </p>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="flex gap-4">
            <GlobalInput
              placeholder="First Name"
              {...register("firstName")}
              error={errors.firstName?.message}
              className="flex-1"
            />
            <GlobalInput
              placeholder="Last Name"
              {...register("lastName")}
              error={errors.lastName?.message}
              className="flex-1"
            />
          </div>
          <GlobalInput
            placeholder="Phone Number"
            {...register("phone")}
            error={errors.phone?.message}
          />
          <GlobalInput
            placeholder="Email Address"
            type="email"
            {...register("email")}
            error={errors.email?.message}
          />
          <GlobalInput
            placeholder="Password"
            type="password"
            {...register("password")}
            error={errors.password?.message}
          />

          <div className="flex items-center mb-2">
            <input
              type="checkbox"
              id="agreeToTerms"
              {...register("agreeToTerms")}
              className="mr-2 h-4 w-4 accent-[#FF8400]"
            />
            <label htmlFor="agreeToTerms" className="text-[#181818] text-sm">
              I agree to the{" "}
              <a href="/terms" className="text-[#FF8400] hover:underline">
                Terms & Condition
              </a>
            </label>
          </div>
          {errors.agreeToTerms && (
            <p className="mb-2 text-sm text-red-600">
              {errors.agreeToTerms.message}
            </p>
          )}
          <button
            type="submit"
            disabled={isSubmitting}
            className="mb-2 w-full rounded-md bg-[#2767E7] py-3 font-semibold text-base text-white transition-colors duration-200 hover:bg-[#0057FF] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting ? "Creating Account..." : "Create Account"}
          </button>
          <div className="flex items-center my-4">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="mx-2 text-sm text-gray-400">Or register with</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>
          <div className="flex gap-4 justify-center items-center">
            <GoogleOAuthProvider clientId="814963512618-3rs252kucgkpbdvq5hmmrb10ehkkues4.apps.googleusercontent.com">
              {/* <button
                type="button"
                className="flex flex-1 gap-2 justify-center items-center py-2 font-medium text-gray-700 bg-white rounded-md border border-gray-300 hover:bg-gray-50"
              >
                <img src="/googlesvg.svg" alt="Google" className="w-5 h-5" />{" "}
                Google
              </button> */}
              <GoogleLogin
                onSuccess={(credentialResponse) => {
                  handleGoogleLogin(credentialResponse);
                }}
                onError={() => {
                  console.log("Login Failed");
                }}
                useOneTap
              />
            </GoogleOAuthProvider>

            <button
              type="button"
              className="flex gap-2 justify-center items-center px-4 py-2 font-medium text-gray-700 bg-white rounded-md border border-gray-300 hover:bg-gray-50"
            >
              <img
                src="/facebooksvg.svg"
                alt="Facebook"
                className="flex-shrink-0 w-6 h-6"
              />{" "}
              Facebook
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewSignUp;
