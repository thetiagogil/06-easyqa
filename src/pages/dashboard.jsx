import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import supabase from "../utils/supabase";
import Connect from "../components/Connect";
import useIsConnected from "../components/useIsConnected";
import Link from "next/link";

const Dashboard = () => {
  useIsConnected();
  const router = useRouter();
  const { userId } = router.query;
  const [userQuestions, setUserQuestions] = useState(null);

  // Function to fetch user's questions
  const fetchUserQuestions = async () => {
    try {
      const { data, error } = await supabase
        .from("questions")
        .select("*")
        .eq("user_id", userId);

      if (error) {
        console.error("Error fetching user questions:", error.message);
        return;
      }

      setUserQuestions(data);
    } catch (error) {
      console.error("Error fetching user questions:", error.message);
    }
  };

  // Function to delete a user question
  const deleteUserQuestion = async (questionId) => {
    try {
      await supabase.from("questions").delete().eq("id", questionId);
      setUserQuestions(
        userQuestions.filter((question) => question.id !== questionId)
      );
    } catch (error) {
      console.error("Error deleting user question:", error.message);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchUserQuestions();
    }
  }, []);

  return (
    <div className="container">
      <div className="d-flex justify-content-end mt-4">
        <Connect />
      </div>

      <div className="d-flex justify-content-between align-items-center mt-4 mb-4">
        <h1 className="mt-4">Dashboard</h1>

        <Link href={`/question/form?userId=${userId}`}>
          <p className="btn btn-primary">Add Question</p>
        </Link>
      </div>

      {userId ? (
        <ul className="list-group">
          {userQuestions?.map((question, index) => (
            <li
              key={index}
              className="list-group-item d-flex justify-content-between align-items-center"
            >
              <div>
                <Link href={`/question/${question.id}`}>
                  <p className="mb-0">{question.title}</p>
                </Link>

                <p className="mb-0">Price: {question.price}</p>
              </div>

              <button
                className="btn btn-danger"
                onClick={() => deleteUserQuestion(question.id)}
              >
                X
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default Dashboard;
