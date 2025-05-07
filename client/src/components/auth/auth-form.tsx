import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import LoginForm from "./login-form";
import RegisterForm from "./register-form";

export default function AuthForm() {
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  
  return (
    <Card className="max-w-md w-full border shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">
          {activeTab === "login" ? "Welcome Back" : "Create Account"}
        </CardTitle>
        <CardDescription className="text-center">
          {activeTab === "login" 
            ? "Sign in to access your bookmarks" 
            : "Register to start saving and organizing your links"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "login" | "register")}>
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="register">Register</TabsTrigger>
          </TabsList>
          <TabsContent value="login">
            <LoginForm />
          </TabsContent>
          <TabsContent value="register">
            <RegisterForm />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
