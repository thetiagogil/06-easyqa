const FormLayout = ({
  isQuestionForm,
  title,
  setTitle,
  price,
  setPrice,
  content,
  setContent,
  handleSubmitButton,
  handleCancelButton,
}) => {
  return (
    <div className="container d-flex flex-column align-items-center">
      <h2 className="mt-4 mb-4">
        {isQuestionForm ? "Question Form" : "Answer Form"}
      </h2>

      <form onSubmit={handleSubmitButton} className="w-50">
        {isQuestionForm && (
          <div className="mb-4 d-flex justify-content-between gap-2">
            <div className="flex-grow-1">
              <label htmlFor="title" className="form-label">
                Title
              </label>

              <input
                type="text"
                className="form-control"
                maxLength={50}
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="flex-grow-2">
              <label htmlFor="price" className="form-label">
                Price
              </label>

              <input
                type="text"
                className="form-control"
                maxLength={15}
                id="price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>
          </div>
        )}

        <div className="mb-4">
          <label htmlFor="content" className="form-label">
            Content
          </label>

          <textarea
            className="form-control"
            rows="4"
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>

        <div className="gap-2">
          <button type="submit" className="btn btn-primary me-2">
            Submit
          </button>

          <button
            type="button"
            onClick={handleCancelButton}
            className="btn btn-secondary"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default FormLayout;
