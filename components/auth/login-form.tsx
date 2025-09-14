"use client";

import { useState } from "react";
import { User, Mail, Lock, Loader2 } from "lucide-react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Input } from "../ui/input";
import ApiClient from "@/lib/apiCalling";
import { useUserStore } from "@/stores/userStore";

const LoginModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    rememberMe: false,
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const setUser = useUserStore((state) => state.setUser);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (authMode === "signup" && formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
    if (formData.password.trim().length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    return newErrors;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    setIsLoading(true);
    setApiError(null);

    try {
      const apiClient = new ApiClient();

      if (authMode === "login") {
        const res = await apiClient.post("/auth/login", {
          email: formData.email,
          password: formData.password,
          rememberMe: formData.rememberMe,
        });
        const resData = res.data.data;

        setUser(
          {
            id: resData.user._id,
            email: resData.user.email ?? "",
            name: resData.user.name ?? "",
            role: resData.user.role,
            accessToken: resData.accessToken,
            refreshToken: resData.refreshToken,
          },
          resData.accessToken
        );

        localStorage.setItem("authToken", resData.accessToken);

        onClose();
        setFormData({
          name: "",
          email: "",
          password: "",
          rememberMe: false,
        });
      } else {
        await apiClient.post("/auth/signup", {
          name: formData.name,
          email: formData.email,
          password: formData.password,
        });
        onClose();
        setFormData({
          name: "",
          email: "",
          password: "",
          rememberMe: false,
        });
      }
    } catch (error: any) {
      setApiError(error.response?.data?.message || "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAuthModeChange = () => {
    setAuthMode(authMode === "login" ? "signup" : "login");
    setFormData({
      name: "",
      email: "",
      password: "",
      rememberMe: false,
    });
    setErrors({});
    setApiError(null);
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          onClose();
          setFormData({
            name: "",
            email: "",
            password: "",
            rememberMe: false,
          });
          setErrors({});
          setApiError(null);
        }
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-primary">
            {authMode === "login" ? "Login" : "Create Account"}
          </DialogTitle>
          <DialogDescription>
            {authMode === "login"
              ? "Sign in to your account"
              : "Create a new account"}
          </DialogDescription>
        </DialogHeader>

        {apiError && (
          <div className="bg-primary/10 text-primary p-3 rounded-md text-sm">
            {apiError}
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-4">
          {authMode === "signup" && (
            <div className="space-y-2">
              <label className="block text-sm font-medium text-primary">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-primary/60" />
                <Input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  type="text"
                  placeholder="Your name"
                  className="pl-10"
                  disabled={isLoading}
                />
              </div>
              {errors.name && (
                <p className="text-primary text-xs mt-1">{errors.name}</p>
              )}
            </div>
          )}

          <div className="space-y-2">
            <label className="block text-sm font-medium text-primary">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-primary/60" />
              <Input
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your.email@example.com"
                className="pl-10"
                disabled={isLoading}
              />
            </div>
            {errors.email && (
              <p className="text-primary text-xs mt-1">{errors.email}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-primary">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-primary/60" />
              <Input
                name="password"
                value={formData.password}
                onChange={handleChange}
                type="password"
                placeholder="••••••••"
                className="pl-10"
                disabled={isLoading}
              />
            </div>
            {errors.password && (
              <p className="text-primary text-xs mt-1">{errors.password}</p>
            )}
          </div>

          {authMode === "login" && (
            <div className="flex items-center justify-between">
              <label className="flex items-center text-primary">
                <input
                  name="rememberMe"
                  type="checkbox"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  className="h-4 w-4 text-primary focus:ring-primary border-primary/30 rounded"
                  disabled={isLoading}
                />
                <span className="ml-2 text-sm">Remember me</span>
              </label>
              <a href="#" className="text-primary hover:text-primary/80 text-sm">
                Forgot password?
              </a>
            </div>
          )}

          <Button
            type="submit"
            className="w-full bg-primary hover:bg-primary/90 text-white"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {authMode === "login" ? "Logging in..." : "Creating account..."}
              </>
            ) : authMode === "login" ? (
              "Login"
            ) : (
              "Create Account"
            )}
          </Button>

          <div className="text-center text-sm text-primary">
            {authMode === "login"
              ? "Don't have an account? "
              : "Already have an account? "}
            <button
              type="button"
              className="font-medium hover:text-primary/80"
              onClick={handleAuthModeChange}
              disabled={isLoading}
            >
              {authMode === "login" ? "Sign up" : "Login"}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default LoginModal;
