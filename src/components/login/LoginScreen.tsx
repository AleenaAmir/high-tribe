"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { z } from "zod";
import GlobalInput from "@/components/global/GlobalInput";
import { apiRequest } from "@/lib/api";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  savePassword: z.boolean().optional(),
});

type LoginForm = z.infer<typeof loginSchema>;

const LoginScreen = () => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    mode: "onTouched",
  });

  const onSubmit = async (data: LoginForm) => {
    try {
      const result = await apiRequest<any>("/api/auth/login", {
        method: "POST",
        json: {
          email: data.email,
          password: data.password,
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
          : "An error occurred during login"
      );
    }
  };

  return (
    <div className="mx-auto grid min-h-screen max-w-[1440px] items-center justify-center bg-white p-4 font-sans md:grid-cols-3">
      {/* Left Side */}
      <div
        className="hidden flex-col justify-between p-6 h-screen bg-center bg-no-repeat bg-cover rounded-md md:flex"
        style={{ backgroundImage: "url('/loginbg.png')" }}
      >
        {/* Logo */}
        <div className="mb-4">
          <div className="text-2xl font-bold leading-tight text-white">
            High
            <br />
            Tribe
          </div>
        </div>
        {/* Testimonial Card */}
        <div className="flex items-center gap-4 rounded-xl bg-[#0057FF] p-4 shadow-lg">
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
        <h2 className="mb-2 font-bold text-3xl text-[#181818]">Sign in</h2>
        <p className="mb-6 text-[#181818] text-base">
          Don't have an account?{" "}
          <a
            href="/signup"
            className="font-medium text-[#FF8400] hover:underline"
          >
            Create Now
          </a>
        </p>
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <GlobalInput
            placeholder="Email Address"
            type="email"
            {...register("email")}
            error={errors.email?.message}
          />
          <div className="relative">
            <GlobalInput
              placeholder="Password"
              type={"password"}
              {...register("password")}
              error={errors.password?.message}
            />
          </div>
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="savePassword"
                {...register("savePassword")}
                className="mr-2 h-4 w-4 accent-[#FF8400]"
              />
              <label htmlFor="savePassword" className="text-[#181818] text-sm">
                Save Password
              </label>
            </div>
            <a
              href="/forgot-password"
              className="font-medium text-[#FF8400] text-sm hover:underline"
            >
              Forgot Password?
            </a>
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="mb-2 w-full rounded-md bg-[#2767E7] py-3 font-semibold text-base text-white transition-colors duration-200 hover:bg-[#0057FF] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting ? "Signing In..." : "Sign In"}
          </button>
          <div className="flex items-center my-4">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="mx-2 text-sm text-gray-400">Or register with</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>
          <div className="flex gap-4">
            <button
              type="button"
              className="flex flex-1 gap-2 justify-center items-center py-2 font-medium text-gray-700 bg-white rounded-md border border-gray-300 hover:bg-gray-50"
            >
              <img src="/googlesvg.svg" alt="Google" className="w-5 h-5" />{" "}
              Google
            </button>
            <button
              type="button"
              className="flex flex-1 gap-2 justify-center items-center py-2 font-medium text-gray-700 bg-white rounded-md border border-gray-300 hover:bg-gray-50"
            >
              <img src="/facebooksvg.svg" alt="Facebook" className="w-5 h-5" />{" "}
              Facebook
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginScreen;
