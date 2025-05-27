import express, { Request, Response } from "express";
import admin from "firebase-admin";

const router = express.Router();

interface AuthRequestBody {
  email: string;
  password: string;
}

router.use(express.json());

// Sign Up Route
router.post("/signup", async (req: Request<{}, {}, AuthRequestBody>, res: Response) => {
  const { email, password } = req.body;

  try {
    const userRecord = await admin.auth().createUser({
      email,
      password,
    });

    res.status(201).json({
      uid: userRecord.uid,
      message: "User created successfully",
    });
  } catch (error: any) {
    console.error("Signup error:", error);
    res.status(400).json({ error: error.message });
  }
});

// Login Route
router.post("/login", async (req: Request<{}, {}, AuthRequestBody>, res: Response) => {
  const { email, password } = req.body;

  try {
    const response = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${process.env.FIREBASE_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          returnSecureToken: true,
        }),
      }
    );

    const data = await response.json();

    if (data.error) throw new Error(data.error.message);

    res.status(200).json({
      uid: data.localId,
      idToken: data.idToken,
      refreshToken: data.refreshToken,
    });
  } catch (error: any) {
    console.error("Login error:", error);
    res.status(401).json({ error: error.message });
  }
});

export default router;
