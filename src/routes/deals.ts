import { Router, Request, Response } from "express";
import axios from "axios";

const router = Router();

const forwardRequest = async (
  req: Request,
  res: Response,
  method: "get" | "post" | "put"
) => {
  let url = process.env.BASE_URL || "";

  if (method === "put") {
    const id = req.params.id || req.body.id;
    if (id) {
      url += `/${id}`;
    }
  }

  url += `?api_token=${process.env.PIPEDRIVE_API_TOKEN}`;

  try {
    const options = {
      method,
      url,
      data: req.body,
      headers: { "Content-Type": "application/json" },
    };
    const response = await axios(options);
    res.status(response.status).json(response.data);
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      res.status(error.response?.status || 500).json({ error: error.message });
    } else if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: "An unexpected error occurred" });
    }
  }
};

router.get("/deals", async (req: Request, res: Response) => {
  await forwardRequest(req, res, "get");
});

router.post("/deals", async (req: Request, res: Response) => {
  await forwardRequest(req, res, "post");
});

router.put("/deals", async (req: Request, res: Response) => {
  await forwardRequest(req, res, "put");
});

export default router;
