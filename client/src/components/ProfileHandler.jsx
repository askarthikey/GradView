import { useUser } from "@clerk/clerk-react";
import axios from "axios";
import { useEffect } from "react";

const ProfileHandler = () => {
  const { user } = useUser();

  useEffect(() => {
    if (user) {
      const fetchOrCreateStudent = async () => {
        try {
          const res = await axios.get(`http://localhost:5001/student-api/students`);
          if (res.data.length === 0) {
            // No student profile found — create one
            await axios.post("http://localhost:5001/students", {
              name: user.fullName,
              email: user.emailAddresses[0].emailAddress,
              contact: user.phoneNumbers[0]?.phoneNumber || "",
              linkedin: "",
              twitter: "",
              rollNumber: "",
              yearOfAdmission: "",
              yearOfGraduation: "",
              branch: "",
              section: "",
              codingProfiles: {
                leetcode: "",
                github: "",
                codeforces: "",
                codechef: "",
                gfg: "",
              },
            });
          }
        } catch (error) {
          console.error("Error setting up student profile", error);
        }
      };

      fetchOrCreateStudent();
    }
  }, [user]);

  return null; // nothing to render
};

export default ProfileHandler;
