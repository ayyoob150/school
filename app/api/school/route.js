import connectToDatabase from "@/lib/mongodb";
import School from "@/models/School";
import User from "@/models/User";
import { verifyToken } from "@/lib/auth";

export async function GET(req) {
  try {
    await connectToDatabase();

    const school = await School.find();
    const user = await User.find()
    if(user.length <1){
      const newUser =await new User({email :'admin@school.com', password:'1234' , role : 'admin'})
      newUser.save()
    }

    if(school.length <1){
      const objects = [
        { name: 'School 1', description: 'This is School 1 description', contact : '+91 9171654131' },
        { name: 'School 2', description: 'This is School 2 description', contact : '+91 9272654232' },
        { name: 'School 3', description: 'This is School 3 description', contact : '+91 9373654333' },
        { name: 'School 4', description: 'This is School 4 description', contact : '+91 9474654434' },
        { name: 'School 5', description: 'This is School 5 description', contact : '+91 9575654535' }
    ];
      const schoolData =await School.insertMany(objects)
      return new Response(JSON.stringify(schoolData), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      })
    }
    if (!school) {
      return new Response("no school data found", { status: 404 });
    }
    return new Response(JSON.stringify(school), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (e) {
    return new Response(e.message, { status: 500 });
  }
}


export async function POST(req) {
  try {
    const user = await verifyToken(req);
    if (user.role !== "admin") {
      return new Response("Admin only authorize to perform this operation", {
        status: 500,
      });
    }

    const { name, description, contact } = await req.json();
    await connectToDatabase();
    const school = await School.findOne({ name });
    if (school) {
      return new Response("Already exist", { status: 400 });
    }

    const newSchool = new School({ name:name?.replace(/\s+/g, '-'), description, contact });
    newSchool.save()

    return new Response(JSON.stringify(newSchool), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (e) {
    return new Response(e.message, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    const user = await verifyToken(req);
    if (user.role !== "admin") {
      return new Response("Admin only authorize to perform this operation", {
        status: 500,
      });
    }
    const { id, name, description, contact } = await req.json();
    if (!id) {
      return new Response("ID is required for updating", { status: 400 });
    }
    await connectToDatabase();
    const updatedSchool = await School.findByIdAndUpdate(
      id,
      { name, description, contact },
      { new: true }
    );
    if (!updatedSchool) {
      return new Response("School not found", { status: 404 });
    }
    return new Response(JSON.stringify(updatedSchool), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (e) {
    return new Response(e.message, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const user = await verifyToken(req);
    if (user.role !== "admin") {
      return new Response("Admin only authorize to perform this operation", {
        status: 500,
      });
    }
    const { id } = await req.json();
    if (!id) {
      return new Response("ID is required for deletion", { status: 400 });
    }
    await connectToDatabase();

    const deletedSchool = await School.findByIdAndDelete(id);
    if (!deletedSchool) {
      return new Response("School not found", { status: 404 });
    }
    return new Response("School deleted successfully", {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (e) {
    return new Response(e.message, { status: 500 });
  }
}
