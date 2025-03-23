import bcrypt from 'bcryptjs';
import connectToDatabase from '@/lib/mongodb';
import User from "@/models/User"
export async function POST(req) {
  const { email, password ,role} = await req.json();

  if (!email || !password) {
    return new Response('Email and password are required', { status: 400 });
  }

  await connectToDatabase();

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return new Response('User already exists', { status: 400 });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = new User({ email, password: hashedPassword ,role});

  try {
    await newUser.save();
    return new Response('User created successfully', { status: 201 });
  } catch (error) {
    return new Response('Error creating user', { status: 500 });
  }
}
