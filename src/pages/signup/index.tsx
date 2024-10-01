import { SignUp } from "@clerk/clerk-react";

export default function SignUpPage() {
  const handleSignUpSuccess = (user) => {
    console.log("User signed up:", user);
  };

  return (
    <SignUp
      path="/sign-up"
      onSuccess={handleSignUpSuccess}
      options={{
        // Define a localização específica aqui
        country: "pt-BR", // Exemplo para o Brasil
      }}
    />
  );
}
