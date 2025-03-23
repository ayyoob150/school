import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(req) {
  try{
    const { email, password } = await req.json();

  if (!email || !password) {
    return new Response('Email and password are required', { status: 400 });
  }

  await connectToDatabase();

  const user = await User.findOne({ email});
  if (!user) {
    return new Response('Invalid credentials', { status: 401 });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return new Response('Invalid credentials', { status: 401 });
  }

  const token = jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );

  return new Response(JSON.stringify({ token }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
  }catch(e){
    return new Response(e.message, {status : 500})
  }
}
