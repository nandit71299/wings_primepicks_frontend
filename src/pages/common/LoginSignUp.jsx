import React from "react";
import { Form, useNavigate, useSearchParams } from "react-router-dom";
import { loginApi } from "../../apiUtil";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { loginUser } from "../../redux/user";

function LoginSignUp() {
  const [searchParams] = useSearchParams();
  const mode = searchParams.get("mode") || "login"; // Default to "login" if no query param
  const navigate = useNavigate(); // For navigation after successful form submission
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    let data = {};
    formData.forEach((value, key) => {
      data[key] = value;
    });

    try {
      if (mode === "login") {
        const response = await loginApi({
          email: data.email,
          password: data.password,
        });
        if (response.success) {
          localStorage.setItem("token", response.token);

          if (response.role === "admin" || response.role === "seller") {
            // console.log(response.role);
            navigate("/dashboard");
            toast.success("Logged in successfully");
          } else {
            dispatch(loginUser(response.user));
            navigate("/");
          }
        } else {
          toast.error(response.message || "Error Logging in");
        }
      } else if (mode === "register") {
        const response = await registerApi(data);
        navigate("/authentication");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-center mb-4">
          {mode === "register" ? "Register" : "Login"}
        </h2>

        {/* Single form handling both login and register */}
        <Form
          method="POST"
          action="/authentication"
          className="space-y-4"
          onSubmit={handleSubmit}
        >
          {/* For Register */}
          {mode === "register" && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="firstName"
                    className="block text-sm font-medium text-gray-700"
                  >
                    First Name
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    id="firstName"
                    required
                    className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label
                    htmlFor="lastName"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    id="lastName"
                    required
                    className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  required
                  className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-gray-700"
                >
                  Phone (Optional)
                </label>
                <input
                  type="tel"
                  name="phone"
                  id="phone"
                  className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Optional"
                />
              </div>

              <div>
                <label
                  htmlFor="role"
                  className="block text-sm font-medium text-gray-700"
                >
                  Role
                </label>
                <select
                  name="role"
                  id="role"
                  required
                  className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="customer">Customer</option>
                  <option value="seller">Seller</option>
                </select>
              </div>
            </>
          )}

          {/* For Login */}
          {mode === "login" && (
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                type="email"
                name="email"
                id="email"
                required
                className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          )}

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              required
              className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {mode === "register" ? "Register" : "Login"}
          </button>
        </Form>

        {/* Toggle between login and register */}
        <div className="mt-4 text-center">
          {mode === "login" ? (
            <p>
              Don't have an account?{" "}
              <a
                href="?mode=register"
                className="text-blue-600 hover:underline"
              >
                Register here
              </a>
            </p>
          ) : (
            <p>
              Already have an account?{" "}
              <a href="?mode=login" className="text-blue-600 hover:underline">
                Login here
              </a>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default LoginSignUp;
