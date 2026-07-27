import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());

const INDEED_API_KEY = process.env.INDEED_API_KEY;

app.get("/api/jobs", async (req, res) => {
  const { q, location, days } = req.query;

  try {
    const url = `https://api.indeed.com/v2/jobs/search?query=${encodeURIComponent(
      q
    )}&location=${encodeURIComponent(location)}&postedWithin=${days}`;

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${INDEED_API_KEY}`,
      },
    });

    const data = await response.json();

    const jobs = data.jobs.map(job => ({
      title: job.title,
      company: job.company,
      location: job.location,
      posted_at: job.postedAt,
      url: job.url,
      salary: job.salary,
      type: job.employmentType,
    }));

    res.json(jobs);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

app.listen(3000, () => {
  console.log("Backend running on port 3000");
});
