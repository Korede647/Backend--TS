import cron from "node-cron";
import { db } from "../config/db";
import { subDays } from "date-fns";

const deleteUnverifiedUser = () => {
  const DELETE_UNVERIFIED_USERS_CRON = "*/1 * * * *"; 

  // Cron job to delete unverified users after 7 days
  cron.schedule(DELETE_UNVERIFIED_USERS_CRON, async () => {
    console.log("Starting cron job: Deleting unverified users...");

    try {
      
      const thresholdDate = subDays(new Date(), 7);

      
      const deletedUsers = await db.user.deleteMany({
        where: {
          emailVerified: false, // Email not verified
          createdAt: { lt: thresholdDate }, // Registered more than 7 days ago
        },
      });

      console.log(
        `Cron job completed: ${deletedUsers.count} unverified users deleted.`
      );
    } catch (error) {
      console.error(
        "Error running cron job to delete unverified users:",
        error
      );
    }
  });
};
export default deleteUnverifiedUser;