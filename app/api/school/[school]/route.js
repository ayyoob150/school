import connectToDatabase from '@/lib/mongodb';
import School from "@/models/School";

export async function GET(req,{ params }) {
    try {
      const {school} =await params;
      if (!school) {
        return new Response("School parameter is required", { status: 400 });
      }
      
      await connectToDatabase();
  
      const findschool = await School.findOne({ name: { $regex: `^${school}$`, $options: 'i' } });
      if (!findschool) {
        return new Response("no school data found", { status: 404 });
      }
      return new Response(JSON.stringify(findschool), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      });
    } catch (e) {
      return new Response(e.message, { status: 500 });
    }
  }