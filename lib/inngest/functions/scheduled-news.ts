import { inngest } from "../client";

export default inngest.createFunction({id:"newsletter/scheduled", name:"Scheduled Newsletter"}, {
  event: "inngest/scheduled"},async({event,step,runID})=>{
    // Your function logic here
   const allArticles = await  step.run("Fetch all articles", async () => {
     const  categories = ["technology", "health", "finance"];
     return fetchArticles(categories);
   });
});