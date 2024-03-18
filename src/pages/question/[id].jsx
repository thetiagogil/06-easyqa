import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import supabase from "../../utils/supabase";
import Link from "next/link";

const QuestionDetails = () => {
  const router = useRouter();
  const { id } = router.query;
  const questionId = id;

  const [userQuestion, setUserQuestion] = useState(null);

  // Function to fetch user's questions
  const fetchUserQuestion = async () => {
    try {
      const { data, error } = await supabase
        .from("questions")
        .select("*")
        .eq("id", questionId)
        .single();

      if (error) {
        console.error("Error fetching user question:", error.message);
        return;
      }

      setUserQuestion(data);
    } catch (error) {
      console.error("Error fetching user question:", error.message);
    }
  };

  useEffect(() => {
    fetchUserQuestion();
  }, []);

  return (
    <div className="container">
      <div className="mt-4 d-flex justify-content-between align-items-center">
        <Link href={`/dashboard`} className="btn btn-primary">
          Back
        </Link>

        <Link href={`/answer/form/?userId=${id}`} className="btn btn-primary">
          Add Answer
        </Link>
      </div>

      <div className="mt-4 p-4 border">
        <p className="mb-1">Question Title: {userQuestion?.title}</p>
        <p className="mb-1">Question Content: {userQuestion?.content}</p>
        <p className="mb-1">Question Price: {userQuestion?.price}</p>
      </div>
    </div>
  );
};

export default QuestionDetails;
