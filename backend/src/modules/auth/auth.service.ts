import bcrypt from "bcrypt";
import AppError from "../../utils/AppError.js";
import UserModel from "../user/user.model.js";

interface RegisterUserInput {
  name: string;
  email: string;
  password: string;
}

export const registerUser = async ({
  name,
  email,
  password,
}: RegisterUserInput) => {
  // Validate required fields
  if (!name || !email || !password) {
    throw new AppError("All fields are required", 400);
  }

  // Check if email already exists
  const existingUser = await UserModel.findOne({ email });

  if (existingUser) {
    throw new AppError("Email already exists", 409);
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create user
  const user = new UserModel({
    name,
    email,
    password: hashedPassword,
  });

  await user.save();

  return {
    success: true,
    message: "Registration successful",
    data: {
      id: user._id,
      name: user.name,
      email: user.email,
    },
  };
};
