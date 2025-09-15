import dotenv from "dotenv";
import mongoose from "mongoose";
import Tenant from "../models/tenant.js";
import User from "../models/user.js";
import Note from "../models/note.js";

dotenv.config();

async function seed() {
  if (!process.env.MONGO_URI) {
    console.error("Missing MONGO_URI in .env");
    process.exit(1);
  }

  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to Mongo for seeding");

  // Drop database for deterministic local seeding
  await mongoose.connection.db.dropDatabase();

  const acme = await Tenant.create({
    name: "Acme",
    slug: "acme",
    plan: "free",
  });
  const globex = await Tenant.create({
    name: "Globex",
    slug: "globex",
    plan: "free",
  });

  // Create users (password 'password' will be hashed in pre-save)
  const users = [
    {
      email: "admin@acme.test",
      name: "Acme Admin",
      password: "password",
      role: "Admin",
      tenant: acme._id,
    },
    {
      email: "user@acme.test",
      name: "Acme User",
      password: "password",
      role: "Member",
      tenant: acme._id,
    },
    {
      email: "admin@globex.test",
      name: "Globex Admin",
      password: "password",
      role: "Admin",
      tenant: globex._id,
    },
    {
      email: "user@globex.test",
      name: "Globex User",
      password: "password",
      role: "Member",
      tenant: globex._id,
    },
  ];

  await User.create(users);

  // sample notes
  const acmeAdmin = await User.findOne({ email: "admin@acme.test" });
  const globexAdmin = await User.findOne({ email: "admin@globex.test" });

  await Note.create({
    title: "Welcome to Acme",
    content: "Sample note",
    tenant: acme._id,
    owner: acmeAdmin._id,
  });
  await Note.create({
    title: "Welcome to Globex",
    content: "Sample note",
    tenant: globex._id,
    owner: globexAdmin._id,
  });

  console.log("Seeding complete");
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
