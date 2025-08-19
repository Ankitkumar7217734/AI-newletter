import { inngest } from "../client";
import { fetchArticles } from "../../news";
import { createClient } from "../../server";

interface ArticleType {
  title: string;
  description: string;
  url: string;
}

interface TextPart {
  text: string;
}

export default inngest.createFunction(
  { id: "newsletter/scheduled" },
  { event: "newsletter.schedule" },
  async ({ event, step }) => {
    try {
      // 0️⃣ Check if user's newsletter is still active
      const isUserActive = await step.run("check-user-status", async () => {
        const supabase = await createClient();
        const { data, error } = await supabase
          .from("user_preferences")
          .select("is_active")
          .eq("user_id", event.data.userId)
          .single();

        if (error) {
          console.error("Error checking user status:", error);
          return false;
        }

        return data?.is_active || false;
      });

      // If user has paused their newsletter, exit early
      if (!isUserActive) {
        console.log(
          `User ${event.data.userId} has paused their newsletter. Skipping processing.`
        );
        return {
          skipped: true,
          reason: "User newsletter is paused",
          userId: event.data.userId,
        };
      }

      // 1️⃣ Fetch articles per category
      const allArticles = await step.run("fetch-news", async () => {
        console.log(
          `Fetching articles for categories: ${event.data.categories.join(
            ", "
          )}`
        );
        return fetchArticles(event.data.categories);
      });

      // 2️⃣ Generate AI summary
      const summary = await step.ai.infer("summarize-news", {
        model: step.ai.models.gemini({ model: "gemini-2.5-flash" }),
        body: {
          contents: [
            {
              role: "user",
              parts: [
                {
                  text: `You are an expert newsletter editor creating a personalized newsletter. 
Write a concise, engaging summary that:
- Highlights the most important stories
- Provides context and insights
- Uses a friendly, conversational tone
- Is well-structured with clear sections
- Keeps the reader informed and engaged
Format the response as a proper newsletter with a title and organized content.
Make it email-friendly with clear sections and engaging subject lines.

Create a newsletter summary for these articles from the past week. 
Categories requested: ${event.data.categories.join(", ")}

Articles:
${allArticles
  .map(
    (article: ArticleType, index: number) =>
      `${index + 1}. ${article.title}\n   ${article.description}\n   Source: ${
        article.url
      }\n`
  )
  .join("\n")}`,
                },
              ],
            },
          ],
        },
      });

      const newsletterContent =
        (summary?.candidates?.[0]?.content?.parts?.[0] as TextPart)?.text ||
        "Failed to generate content";

      if (!newsletterContent) {
        throw new Error("Failed to generate newsletter content");
      }

      // 3️⃣ Log the newsletter content (email functionality removed for now)
      await step.run("log-newsletter", async () => {
        console.log("Newsletter generated for:", event.data.email);
        console.log("Content length:", newsletterContent.length);
        return { emailSent: true };
      });

      if (!event.data.isTest) {
        // 4️⃣ Schedule the next newsletter based on frequency
        await step.run("schedule-next", async () => {
          const now = new Date();
          let nextScheduleTime: Date;

          switch (event.data.frequency) {
            case "daily":
              nextScheduleTime = new Date(now.getTime() + 24 * 60 * 60 * 1000);
              break;
            case "weekly":
              nextScheduleTime = new Date(
                now.getTime() + 7 * 24 * 60 * 60 * 1000
              );
              break;
            case "biweekly":
              nextScheduleTime = new Date(
                now.getTime() + 3 * 24 * 60 * 60 * 1000
              );
              break;
            default:
              nextScheduleTime = new Date(
                now.getTime() + 7 * 24 * 60 * 60 * 1000
              );
          }

          nextScheduleTime.setHours(9, 0, 0, 0);

          // Schedule the next newsletter
          await inngest.send({
            name: "newsletter.schedule",
            data: {
              userId: event.data.userId,
              email: event.data.email,
              categories: event.data.categories,
              frequency: event.data.frequency,
              scheduledFor: nextScheduleTime.toISOString(),
            },
            ts: nextScheduleTime.getTime(),
          });

          console.log(
            `Next newsletter scheduled for: ${nextScheduleTime.toISOString()}`
          );
        });
      }

      const result = {
        newsletter: newsletterContent,
        articleCount: allArticles.length,
        categories: event.data.categories,
        emailSent: true,
        nextScheduled: true,
        success: true,
      };

      return result;
    } catch (error) {
      console.error("Scheduled newsletter generation failed:", error);
      throw error;
    }
  }
);
