import Link from "next/link";

const QuestionsListLayout = ({
  map,
  userId,
  deleteUserQuestion,
  needsDelete,
}) => {
  return (
    <ul className="list-group">
      {map?.map((question, index) => (
        <li
          key={index}
          className="list-group-item d-flex justify-content-between align-items-center"
        >
          <div className="d-flex w-50">
            <div className="w-75">
              <p className="mb-0">{question.title}</p>
            </div>

            <div>
              <div
                className="mx-2"
                style={{
                  width: "1px",
                  height: "100%",
                  backgroundColor: "lightgray",
                }}
              />
            </div>

            <div className="w-25">
              <p className="mb-0">Price: {question.price}</p>
            </div>
          </div>

          <div className="w-50 d-flex justify-content-end align-items-center gap-4">
            <Link
              href={`/question/${question.id}?userId=${userId}`}
              className="text-info"
              style={{ color: "white", textDecoration: "none" }}
            >
              <span>View Details</span>
            </Link>

            {needsDelete ? (
              <button
                className="btn btn-danger btn-sm"
                onClick={() => deleteUserQuestion(question.id)}
              >
                X
              </button>
            ) : null}
          </div>
        </li>
      ))}
    </ul>
  );
};

export default QuestionsListLayout;
