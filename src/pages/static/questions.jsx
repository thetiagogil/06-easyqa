import { useEffect, useState } from "react";
import supabase from "../../utils/supabase";

const Questions = () => {
  const [questionsData, setQuestionsData] = useState([]);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const { data, error } = await supabase.from("questions").select("*");

        if (error) {
          throw error;
        }

        setQuestionsData(data);
      } catch (error) {
        console.error("Error fetching users:", error.message);
      }
    };

    fetchQuestions();
  }, []);

  return (
    <div>
      <h2>Questions Data</h2>
      <pre>{JSON.stringify(questionsData, null, 2)}</pre>
    </div>
  );
};

export default Questions;
